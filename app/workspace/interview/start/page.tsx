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
import { useState } from 'react'
import type { Resume, CoverLetter } from '@/components/interview/steps/Step5Individual'
import { useMemberSession } from '@/components/member-session-context'
import { createInterview, createMemberInterview } from '@/api/interview'
import { useRouter } from 'next/navigation'

export default function InterviewStartPage() {
  const wiz = useInterviewWizard()
  const router = useRouter()
  const { memberId } = useMemberSession()
  // wizard 전체에서 이력서/자소서 상태 관리
  const [resumes, setResumes] = useState<Resume[]>([
    { id: '1', name: '신입 개발자 이력서.pdf', url: 'https://mock-resume.com/1.pdf' },
    { id: '2', name: '포트폴리오_2023.pdf', url: 'https://mock-resume.com/2.pdf' },
    { id: '3', name: '경력기술서_최종.docx', url: 'https://mock-resume.com/3.docx' },
  ])
  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([
    {
      id: '1',
      representativeTitle: '삼성전자 SW개발직군 자기소개서',
      items: [
        { title: '성장과정', content: '저는 컴퓨터공학을 전공하며...' },
        { title: '지원동기', content: '삼성전자에서 혁신적인 기술 개발에...' },
      ],
    },
    {
      id: '2',
      representativeTitle: '네이버 백엔드 개발자 자기소개서',
      items: [
        { title: '경험', content: '다양한 웹 서비스를 개발하며...' },
        { title: '포부', content: '네이버의 기술력과 함께 성장하고 싶습니다.' },
      ],
    },
  ])

  const stepProps = {
    form: wiz.form,
    setForm: wiz.setForm,
    resumes,
    setResumes,
    coverLetters,
    setCoverLetters,
  }

  const handleNext = async () => {
    if (wiz.step < wiz.totalSteps) {
      wiz.next()
      return
    }
    // 최종 제출 단계
    if (!memberId) {
      alert('로그인이 필요합니다.')
      return
    }
    try {
      wiz.setForm((prev) => ({ ...prev, submitting: true }))
      const interviewRes = await createInterview(wiz.form)
      const interviewId = interviewRes?.result?.interviewId
      const interviewFormat = wiz.form.interviewType === 'individual' ? 'INDIVIDUAL' : 'GROUP'
      const startType = wiz.form.startType === 'now' ? 'NOW' : 'SCHEDULED'
      if (interviewFormat === 'INDIVIDUAL' && startType === 'NOW' && interviewId) {
        // 바로 참여 신청
        const memberRes = await createMemberInterview(interviewId, {
          memberId,
          resumeId: Number(wiz.form.resumeId),
          coverletterId: Number(wiz.form.coverLetterId),
        })
        // 세션 페이지로 이동
        router.push(`/workspace/interview/session/${interviewId}`)
        return
      }
      // 기존 로직 (예: 그룹/예약 면접 등)
      alert('면접 생성이 완료되었습니다.')
      router.push('/workspace/interviews')
    } catch (e) {
      alert('면접 생성 중 오류가 발생했습니다.')
    } finally {
      wiz.setForm((prev) => ({ ...prev, submitting: false }))
    }
  }

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
              {wiz.step === 1 && <Step1 form={wiz.form} setForm={wiz.setForm} />}
              {wiz.step === 2 && <Step2 {...stepProps} />}
              {wiz.step === 3 && <Step3 form={wiz.form} setForm={wiz.setForm} />}
              {wiz.step === 4 && wiz.form.interviewType === 'individual' && <Step4Individual form={wiz.form} setForm={wiz.setForm} />}
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
              onClick={handleNext}
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