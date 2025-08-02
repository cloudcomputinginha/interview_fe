import { reissueToken } from '@/apis'
import {
	BadRequestError,
	NotFoundError,
	UnProcessableError,
} from '../error/error'
import {
	getAccessToken,
	getRefreshToken,
	setAccessToken,
	setRefreshToken,
	removeAccessToken,
	removeRefreshToken,
} from '../session/token-storage'
import { toast } from 'sonner'

const baseServerURL = process.env.NEXT_PUBLIC_SERVER_URL
const baseAIServerURL = process.env.NEXT_PUBLIC_AI_SERVER_URL

if (!baseServerURL) {
	throw new Error('환경변수 NEXT_PUBLIC_SERVER_URL이 설정되지 않았습니다.')
}
if (!baseAIServerURL) {
	throw new Error('환경변수 NEXT_PUBLIC_AI_SERVER_URL이 설정되지 않았습니다.')
}

function getAuthHeaders() {
	const accessToken = getAccessToken()
	const refreshToken = getRefreshToken()
	return {
		...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
		...(refreshToken ? { 'x-refresh-token': refreshToken } : {}),
	}
}

async function fetchWithAuthRetry(
	input: RequestInfo,
	init?: RequestInit,
	retry = true
): Promise<Response> {
	const headers = {
		...(init?.headers || {}),
		...getAuthHeaders(),
	}
	const response = await fetch(input, { ...init, headers })

	if (response.status === 403 && retry) {
		// 액세스 토큰 만료로 간주
		const refreshToken = getRefreshToken()
		if (!refreshToken) {
			removeAccessToken()
			removeRefreshToken()
			toast.error('로그인이 만료되어, 자동으로 로그아웃 처리됩니다.')
			window.location.href = '/login'
			return new Response('Unauthorized', { status: 403 })
		}
		let refreshRes
		try {
			refreshRes = await reissueToken({ refreshToken })
			if (!refreshRes) {
				removeAccessToken()
				removeRefreshToken()
				toast.error('로그인이 만료되어, 자동으로 로그아웃 처리됩니다.')
				window.location.href = '/login'
				return new Response('Unauthorized', { status: 403 })
			}
		} catch (error) {
			removeAccessToken()
			removeRefreshToken()
			toast.error('로그인이 만료되어, 자동으로 로그아웃 처리됩니다.')
			window.location.href = '/login'
			return new Response('Unauthorized', { status: 403 })
		}
		const { accessToken: newAt, refreshToken: newRt } =
			refreshRes as unknown as {
				accessToken: string
				refreshToken: string
			}
		setAccessToken(newAt)
		setRefreshToken(newRt)
		// 원래 요청을 한 번 더 재시도
		return fetchWithAuthRetry(input, init, false)
	}

	return response
}

function createFetch(baseURL: string) {
	const get = async <T>(
		url: string,
		params?: Record<string, string | number | boolean>
	): Promise<T> => {
		console.log('GET : ', url)
		const paramsURL = new URLSearchParams(
			Object.entries(params || {}).map(([key, value]) => [key, String(value)])
		).toString()
		const input = paramsURL
			? `${baseURL}${url}?${paramsURL}`
			: `${baseURL}${url}`
		const response = await fetchWithAuthRetry(input, { method: 'GET' })

		const json = await response.json()
		console.log(json)
		if (!response.ok) {
			if (response.status === 400) {
				throw new BadRequestError(
					json.result.flatMap((e: any) => e.message).join(', ') || 'Bad Request'
				)
			} else if (response.status === 404) {
				throw new NotFoundError(json.message || 'Not Found')
			} else if (response.status === 422) {
				throw new UnProcessableError(json.message || 'UnProcessable')
			} else {
				throw new Error('UnExpected Error')
			}
		}
		return json
	}

	const post = async <T = boolean, K = unknown>(
		url: string,
		body?: K
	): Promise<T | boolean> => {
		console.log('POST : ', url)
		const input = `${baseURL}${url}`
		const response = await fetchWithAuthRetry(input, {
			method: 'POST',
			body: JSON.stringify(body),
			headers: { 'Content-Type': 'application/json' },
		})

		const text = await response.text()
		if (!response.ok) {
			if (response.status === 400) {
				throw new BadRequestError(JSON.parse(text).message || 'Bad Request')
			} else if (response.status === 404) {
				throw new NotFoundError('Not Found')
			} else {
				throw new Error('UnExpected Error')
			}
		}
		return text.length > 0 ? (JSON.parse(text) as T) : response.ok
	}

	const put = async <T, K>(url: string, body?: K): Promise<T> => {
		const input = `${baseURL}${url}`
		const response = await fetchWithAuthRetry(input, {
			method: 'PUT',
			body: JSON.stringify(body),
			headers: { 'Content-Type': 'application/json' },
		})
		if (!response.ok) {
			throw new Error(`${response.status}-${response.statusText}`)
		}
		return response.json()
	}

	const patch = async <T = boolean, K = unknown>(
		url: string,
		body?: K
	): Promise<T | boolean> => {
		console.log('PATCH : ', url)
		const input = `${baseURL}${url}`
		const response = await fetchWithAuthRetry(input, {
			method: 'PATCH',
			body: JSON.stringify(body),
			headers: { 'Content-Type': 'application/json' },
		})
		if (!response.ok) {
			if (response.status === 400) {
				throw new BadRequestError('Bad Request')
			} else if (response.status === 404) {
				throw new NotFoundError('Not Found')
			} else {
				throw new Error('UnExpected Error')
			}
		}
		const text = await response.text()
		return text.length > 0 ? (JSON.parse(text) as T) : response.ok
	}

	const del = async <T = boolean, K = unknown>(
		url: string,
		body?: K
	): Promise<T | boolean> => {
		const input = `${baseURL}${url}`
		const response = await fetchWithAuthRetry(input, {
			method: 'DELETE',
			body: JSON.stringify(body),
		})
		if (!response.ok) {
			throw new Error('UnExpected Error')
		}
		return response.ok
	}

	return {
		get,
		post,
		put,
		patch,
		del,
	}
}

const serverFetch = createFetch(baseServerURL)
const aiFetch = createFetch(baseAIServerURL)

export { createFetch, serverFetch, aiFetch }
