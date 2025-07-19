'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useMemberSession } from '../../components/member-session-context'
import { Button } from '@/components/ui/button'
import { setAccessToken, setRefreshToken } from '@/utils/session/token-storage'
import { getMemberInfo } from '@/api/member'

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
            console.error('인증 토큰이 누락되었습니다.')
            setError('인증 토큰이 누락되었습니다.')
            return
        }
        setAccessToken(accessToken)
        setRefreshToken(refreshToken)

        if (accessToken && refreshToken) {
            login()
        }
        return
        // 실제 서비스라면 at를 디코드하거나 백엔드에서 memberId를 받아야 함
        setError('유효하지 않은 토큰입니다.')
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