'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useMemberSession } from '../../components/member-session-context'
import { Button } from '@/components/ui/button'
import { setAccessToken, setRefreshToken } from '@/utils/session/token-storage'

export default function AuthRedirectPage() {

    const router = useRouter()
    const searchParams = useSearchParams()
    const { login } = useMemberSession()
    const [error, setError] = useState<string | null>(null)

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
            login(6)
            router.replace('/workspace')
        }
        return
        // 실제 서비스라면 at를 디코드하거나 백엔드에서 memberId를 받아야 함
        setError('유효하지 않은 토큰입니다.')
    }, [searchParams, router, login])

    if (error) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <div className='bg-white p-8 rounded shadow text-center'>
                    <p className='text-red-500 font-bold mb-2'>로그인 실패</p>
                    <p className='text-gray-600'>에러 내용 : {error}</p>

                    <Button onClick={() => router.replace('/login')}>로그인 페이지로 이동</Button>
                </div>
            </div>
        )
    }

    return (
        <div className='min-h-screen flex items-center justify-center'>
            <div className='bg-white p-8 rounded shadow text-center'>
                <p className='text-gray-700'>로그인 처리 중입니다...</p>
            </div>
        </div>
    )
} 