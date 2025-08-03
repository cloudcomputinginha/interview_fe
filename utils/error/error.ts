import type { ApiErrorResponse } from '@/apis/types/common-types'

export class ApiError extends Error {
	public code: string

	constructor(response: ApiErrorResponse) {
		super(response.message || 'API Error가 발생했습니다.')
		this.name = 'API Error'
		this.code = response.code ?? '코드가 존재하지 않습니다.'
		this.message = response.message ?? '메세지가 존재하지 않습니다.'
	}
}
