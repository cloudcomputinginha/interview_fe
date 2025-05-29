"use client"

import { Button } from "@/components/ui/button"
import { useInterviewWizard } from "./InterviewWizardContext"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface NavigationButtonsProps {
  onNext?: () => void
  onPrev?: () => void
  onSubmit?: () => void
  isNextDisabled?: boolean
  isSubmitting?: boolean
}

export function NavigationButtons({
  onNext,
  onPrev,
  onSubmit,
  isNextDisabled = false,
  isSubmitting = false,
}: NavigationButtonsProps) {
  const { currentStep, maxSteps } = useInterviewWizard()

  const isLastStep = currentStep === maxSteps
  const isFirstStep = currentStep === 1

  return (
    <div className="flex justify-between mt-8">
      <Button variant="outline" onClick={onPrev} disabled={isFirstStep} className="flex items-center gap-2">
        <ChevronLeft className="h-4 w-4" />
        이전
      </Button>

      {isLastStep ? (
        <Button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="bg-[#8FD694] hover:bg-[#7ac47f] text-white flex items-center gap-2"
        >
          {isSubmitting ? "생성 중..." : "면접 생성"}
        </Button>
      ) : (
        <Button
          onClick={onNext}
          disabled={isNextDisabled}
          className="bg-[#8FD694] hover:bg-[#7ac47f] text-white flex items-center gap-2"
        >
          다음
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
