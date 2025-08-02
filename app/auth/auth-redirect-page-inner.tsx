'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useMemberSession } from '../../components/member-session-context'
import { Button } from '@/components/ui/button'
import { setAccessToken, setRefreshToken } from '@/utils/session/token-storage'
import { getMemberInfo } from '@/apis/member'

export default function AuthRedirectPageInner() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const { login: loginMember } = useMemberSession()
	const [error, setError] = useState<string | null>(null)

	const login = async () => {
		const memberId = await getMemberInfo().then(data => data.result?.memberId)
		if (memberId) {
			loginMember(memberId)
			router.replace('/workspace')
		} else {
			setError('사용자 정보를 가져올 수 없습니다.')
		}
	}

	useEffect(() => {
		const accessToken = searchParams.get('at')
		const refreshToken = searchParams.get('rt')
		if (!accessToken || !refreshToken) {
			setError('인증 토큰이 누락되었습니다.')
			return
		}
		setAccessToken(accessToken)
		setRefreshToken(refreshToken)
		login()
		return
	}, [searchParams, router, login])

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen">
				<div className="text-red-500 mb-4">{error}</div>
				<Button onClick={() => router.push('/login')}>
					로그인 페이지로 돌아가기
				</Button>
			</div>
		)
	}

	return (
		<div className="flex flex-col items-center justify-center min-h-screen">
			<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
			<div className="mt-4">로그인 처리 중...</div>
		</div>
	)
}
