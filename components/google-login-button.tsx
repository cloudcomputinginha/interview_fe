"use client"

import { Button } from '@/components/ui/button'
import { serverFetch } from '@/utils/fetch/fetch'

export function GoogleLoginButton() {
    const handleGoogleLogin = async () => {
        window.location.href = `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/GOOGLE`
    }

    return (
        <Button
            onClick={handleGoogleLogin}
            className='w-full py-6 bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 font-medium rounded-lg flex items-center justify-center space-x-2 transition-colors'
        >
            <GoogleIcon />
            <span>구글로 로그인하기</span>
        </Button>
    )
}

function GoogleIcon() {
    return (
        <svg width='18' height='18' viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <g>
                <path d='M17.64 9.2045c0-.638-.057-1.252-.163-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.797 2.717v2.26h2.908c1.703-1.57 2.685-3.885 2.685-6.618z' fill='#4285F4' />
                <path d='M9 18c2.43 0 4.47-.805 5.96-2.18l-2.908-2.26c-.807.54-1.84.86-3.052.86-2.347 0-4.332-1.587-5.044-3.72H.96v2.33A8.997 8.997 0 0 0 9 18z' fill='#34A853' />
                <path d='M3.956 10.7A5.41 5.41 0 0 1 3.5 9c0-.59.102-1.16.28-1.7V4.97H.96A8.997 8.997 0 0 0 0 9c0 1.41.34 2.75.96 3.93l2.996-2.23z' fill='#FBBC05' />
                <path d='M9 3.579c1.32 0 2.5.454 3.43 1.346l2.572-2.572C13.47 1.14 11.43.001 9 .001A8.997 8.997 0 0 0 .96 4.97l2.996 2.33C4.668 5.166 6.653 3.579 9 3.579z' fill='#EA4335' />
            </g>
        </svg>
    )
} 