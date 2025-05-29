// app/workspace/interview/start/page.tsx
"use client"

import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { HeaderWithNotifications } from "@/components/header-with-notifications"

import CreateInterviewHeader from "@/components/interview/header/CreateInterviewHeader"
import CreateInterviewProgress from "@/components/interview/header/CreateInterviewProgress"
import StepTitle from "@/components/interview/title/StepTitle"

import Step1 from "@/components/interview/steps/Step1"
import Step2 from "@/components/interview/steps/Step2"
import Step3 from "@/components/interview/steps/Step3"
import Step4Individual from "@/components/interview/steps/Step4Individual"
import Step4Group from "@/components/interview/steps/Step4Group"
import Step5Group from "@/components/interview/steps/Step5Group"
import Step5Individual from "@/components/interview/steps/Step5Individual"

import { useInterviewWizard } from "@/hooks/useInterviewWizard"

export default function InterviewStartPage() {
  const wiz = useInterviewWizard()
  const stepProps = { form: wiz.form, setForm: wiz.setForm }

  return (
    <>
      <HeaderWithNotifications />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto p-6">
          <CreateInterviewHeader prevStep={wiz.prev} />
          <CreateInterviewProgress step={wiz.step} interviewType={wiz.form.interviewType} />

          <Card className="mb-6">
            <StepTitle step={wiz.step} interviewType={wiz.form.interviewType} />
            <CardContent>
              {wiz.step === 1 && <Step1 {...stepProps} />}
              {wiz.step === 2 && <Step2 {...stepProps} />}
              {wiz.step === 3 && <Step3 {...stepProps} />}
              {wiz.step === 4 && wiz.form.interviewType === "individual" && <Step4Individual {...stepProps} />}
              {wiz.step === 4 && wiz.form.interviewType === "group" && <Step4Group {...stepProps} />}
              {wiz.step === 5 && wiz.form.interviewType === "group" && <Step5Group {...stepProps} />}
              {(wiz.step === 5 && wiz.form.interviewType === "individual") ||
                (wiz.step === 6 && wiz.form.interviewType === "group") ? (
                <Step5Individual form={wiz.form} />
              ) : null}
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={wiz.prev}>
              {wiz.step === 1 ? "취소" : "이전"}
            </Button>
            <Button
              disabled={wiz.submitting}
              onClick={wiz.next}
              className="bg-[#8FD694] hover:bg-[#7ac47f] text-white flex items-center gap-2"
            >
              {wiz.submitting
                ? "생성 중..."
                : wiz.step === wiz.totalSteps
                  ? "면접 생성"
                  : "다음"}
              {!wiz.submitting && <ArrowRight className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}