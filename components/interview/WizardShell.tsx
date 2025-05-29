"use client"

import { useState, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { InterviewWizardProvider } from "./InterviewWizardContext"

interface WizardShellProps {
  children: ReactNode
  flow: "individual" | "group"
  onComplete?: () => void
  onCancel?: () => void
}

export function WizardShell({ children, flow, onComplete, onCancel }: WizardShellProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const childrenArray = Array.isArray(children) ? children : [children]
  const steps = childrenArray.filter(Boolean)
  const totalSteps = steps.length
  const progress = ((currentStep + 1) / totalSteps) * 100

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // 마지막 단계에서 완료 처리
      onComplete?.()
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    } else {
      // 첫 단계에서 취소 처리
      onCancel?.()
    }
  }

  const stepTitles = [
    "면접 유형 선택",
    "자료 선택",
    flow === "individual" ? "면접 시작 옵션" : "참가자 초대",
    flow === "individual" ? "면접 옵션 설정" : "면접 예약",
    "미리보기",
  ]

  return (
    <InterviewWizardProvider initialFlow={flow}>
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <button onClick={onCancel} className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
            <ArrowLeft className="h-4 w-4 mr-1" /> 내 면접으로 돌아가기
          </button>
          <h1 className="text-2xl font-bold">새 면접 만들기</h1>
          <p className="text-gray-600 mt-2">면접을 시작하기 위한 정보를 선택해주세요.</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-[#8FD694] font-medium">
              단계 {currentStep + 1}/{totalSteps}
            </span>
            <span className="text-gray-500">{stepTitles[currentStep]}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">{steps[currentStep]}</div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={handlePrev}>
            {currentStep === 0 ? "취소" : "이전"}
          </Button>
          <Button className="bg-[#8FD694] hover:bg-[#7ac47f] text-white" onClick={handleNext}>
            {currentStep === totalSteps - 1 ? "완료" : "다음"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </InterviewWizardProvider>
  )
}
