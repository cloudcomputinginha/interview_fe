"use client"

import { WizardShell } from "@/components/interview/WizardShell"
import { InterviewTypeStep } from "@/components/interview/steps/InterviewTypeStep"
import { DataSelectionStep } from "@/components/interview/steps/DataSelectionStep"
import { SchedulingStep } from "@/components/interview/steps/SchedulingStep"
import { ParticipantInviteStep } from "@/components/interview/steps/ParticipantInviteStep"
import { InterviewOptionsStep } from "@/components/interview/steps/InterviewOptionsStep"
import { PreviewStep } from "@/components/interview/steps/PreviewStep"

export default function GroupInterviewPage() {
  return (
    <WizardShell flow="group">
      <InterviewTypeStep />
      <DataSelectionStep />
      <SchedulingStep />
      <ParticipantInviteStep />
      <InterviewOptionsStep />
      <PreviewStep />
    </WizardShell>
  )
}
