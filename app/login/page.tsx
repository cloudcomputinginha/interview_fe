"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { KakaoLoginButton } from "@/components/kakao-login-button"
import { useMemberSession } from '../../components/member-session-context'

export default function LoginPage() {
  const { login } = useMemberSession()

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo and Tagline */}
          <div className="text-center">
            <div className="mx-auto w-20 h-20 relative mb-4">
              <div className="absolute inset-0 bg-[#8FD694] rounded-full opacity-20"></div>
              <div className="absolute inset-2 bg-[#8FD694] rounded-full flex items-center justify-center">
                <span className="text-white text-2xl font-bold">AI</span>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">InterviewPro AI</h1>
            <p className="mt-2 text-gray-600">AI 모의 면접으로 취업을 준비하세요</p>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-xl font-medium text-gray-900 mb-6 text-center">로그인</h2>

            <div className="space-y-4">
              <KakaoLoginButton />

              <p className="text-sm text-center text-gray-500 mt-4">간편하게 로그인하고 면접을 시작하세요</p>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">또는</span>
                </div>
              </div>

              <Button variant="outline" className="w-full" onClick={() => { login(1); window.location.href = "/workspace" }}>
                임시 로그인
              </Button>
            </div>
          </div>

          {/* Additional Info */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              로그인하면{" "}
              <Link href="/terms" className="text-[#8FD694] hover:text-[#7ac47f] font-medium">
                이용약관
              </Link>
              과{" "}
              <Link href="/privacy" className="text-[#8FD694] hover:text-[#7ac47f] font-medium">
                개인정보처리방침
              </Link>
              에 동의하게 됩니다.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex justify-center space-x-6 text-sm text-gray-500">
            <Link href="/privacy-policy" className="hover:text-gray-900">
              개인정보처리방침
            </Link>
            <Link href="/terms-of-service" className="hover:text-gray-900">
              이용약관
            </Link>
            <Link href="/help" className="hover:text-gray-900">
              고객센터
            </Link>
          </div>
          <p className="text-center text-xs text-gray-400 mt-4">
            © {new Date().getFullYear()} InterviewPro AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
