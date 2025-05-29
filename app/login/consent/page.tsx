"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft } from "lucide-react"

export default function ConsentPage() {
  const [consents, setConsents] = useState({
    all: false,
    name: false,
    email: false,
    jobInterests: false,
    activityHistory: false,
  })

  const handleAllChange = (checked: boolean) => {
    setConsents({
      all: checked,
      name: checked,
      email: checked,
      jobInterests: checked,
      activityHistory: checked,
    })
  }

  const handleSingleChange = (key: string, checked: boolean) => {
    const newConsents = { ...consents, [key]: checked }

    // Update "all" checkbox based on individual selections
    const allChecked = newConsents.name && newConsents.email && newConsents.jobInterests && newConsents.activityHistory

    setConsents({ ...newConsents, all: allChecked })
  }

  const handleSubmit = () => {
    // Check if required consents are given
    if (consents.name && consents.email) {
      window.location.href = "/workspace"
    } else {
      alert("필수 항목에 동의해주세요.")
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <Link href="/login" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8">
            <ArrowLeft className="h-4 w-4 mr-1" /> 로그인으로 돌아가기
          </Link>

          {/* Consent Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">정보 제공에 동의해주세요</h2>
            <p className="text-sm text-gray-500 mb-6 text-center">
              InterviewPro AI 서비스 이용을 위해 다음 정보 제공에 동의해주세요.
            </p>

            <div className="space-y-6">
              {/* All Consent */}
              <div className="flex items-center space-x-3 pb-4 border-b">
                <Checkbox
                  id="all-consent"
                  checked={consents.all}
                  onCheckedChange={(checked) => handleAllChange(checked as boolean)}
                  className="data-[state=checked]:bg-[#8FD694] data-[state=checked]:border-[#8FD694]"
                />
                <label htmlFor="all-consent" className="font-medium">
                  모두 동의합니다
                </label>
              </div>

              {/* Required Consents */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700">필수 항목</h3>

                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="name-consent"
                    checked={consents.name}
                    onCheckedChange={(checked) => handleSingleChange("name", checked as boolean)}
                    className="data-[state=checked]:bg-[#8FD694] data-[state=checked]:border-[#8FD694]"
                  />
                  <div className="grid gap-1.5">
                    <label htmlFor="name-consent" className="text-sm font-medium leading-none">
                      이름 (필수)
                    </label>
                    <p className="text-xs text-gray-500">면접 진행 및 결과 분석에 사용됩니다.</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="email-consent"
                    checked={consents.email}
                    onCheckedChange={(checked) => handleSingleChange("email", checked as boolean)}
                    className="data-[state=checked]:bg-[#8FD694] data-[state=checked]:border-[#8FD694]"
                  />
                  <div className="grid gap-1.5">
                    <label htmlFor="email-consent" className="text-sm font-medium leading-none">
                      이메일 (필수)
                    </label>
                    <p className="text-xs text-gray-500">계정 식별 및 알림 발송에 사용됩니다.</p>
                  </div>
                </div>
              </div>

              {/* Optional Consents */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700">선택 항목</h3>

                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="job-consent"
                    checked={consents.jobInterests}
                    onCheckedChange={(checked) => handleSingleChange("jobInterests", checked as boolean)}
                    className="data-[state=checked]:bg-[#8FD694] data-[state=checked]:border-[#8FD694]"
                  />
                  <div className="grid gap-1.5">
                    <label htmlFor="job-consent" className="text-sm font-medium leading-none">
                      직무 관심사 (선택)
                    </label>
                    <p className="text-xs text-gray-500">맞춤형 면접 질문 생성에 활용됩니다.</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="activity-consent"
                    checked={consents.activityHistory}
                    onCheckedChange={(checked) => handleSingleChange("activityHistory", checked as boolean)}
                    className="data-[state=checked]:bg-[#8FD694] data-[state=checked]:border-[#8FD694]"
                  />
                  <div className="grid gap-1.5">
                    <label htmlFor="activity-consent" className="text-sm font-medium leading-none">
                      활동 이력 (선택)
                    </label>
                    <p className="text-xs text-gray-500">서비스 개선 및 맞춤형 추천에 활용됩니다.</p>
                  </div>
                </div>
              </div>
            </div>

            <Button className="w-full mt-8 bg-[#8FD694] hover:bg-[#7ac47f] text-white" onClick={handleSubmit}>
              다음
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
