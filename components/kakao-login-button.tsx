"use client"

import { Button } from "@/components/ui/button"

export function KakaoLoginButton() {
  const handleKakaoLogin = () => {
    // This would be replaced with actual Kakao login implementation
    console.log("Kakao login initiated")
    // Redirect to consent page after successful OAuth
    window.location.href = "/login/consent"
  }

  return (
    <Button
      onClick={handleKakaoLogin}
      className="w-full py-6 bg-[#FEE500] hover:bg-[#FFDE00] text-[#3A1D1D] font-medium rounded-lg flex items-center justify-center space-x-2 transition-colors"
    >
      <KakaoIcon />
      <span>카카오로 로그인하기</span>
    </Button>
  )
}

function KakaoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M9 0.5C4.02944 0.5 0 3.69067 0 7.66707C0 10.1276 1.55756 12.3 3.93667 13.5893C3.77 14.0933 3.31778 15.9387 3.23111 16.3893C3.12333 16.9493 3.49056 16.9427 3.73222 16.7813C3.92 16.6547 6.19778 15.1067 7.10111 14.4813C7.72 14.5667 8.35333 14.6107 9 14.6107C13.9706 14.6107 18 11.4213 18 7.44493C18 3.46853 13.9706 0.5 9 0.5Z"
        fill="#3A1D1D"
      />
    </svg>
  )
}
