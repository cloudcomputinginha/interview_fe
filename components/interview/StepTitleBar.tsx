'use client'

import { useInterviewWizard } from './InterviewWizardContext'
import { TITLES } from '@/lib/types/interview-wizard'
import { Progress } from '@/components/ui/progress'

export function StepTitleBar() {
	const { currentStep, maxSteps, state } = useInterviewWizard()

	const currentTitle =
		TITLES.find(
			t =>
				t.step === currentStep &&
				(t.interviewType === 'common' ||
					t.interviewType === state.interviewType)
		)?.title || '면접 설정'

	const progress = (currentStep / maxSteps) * 100

	return (
		<div className="mb-6">
			<div className="flex items-center justify-between mb-4">
				<h1 className="text-2xl font-bold">{currentTitle}</h1>
				<span className="text-sm text-gray-500">
					{currentStep} / {maxSteps}
				</span>
			</div>
			<Progress value={progress} className="h-2" />
		</div>
	)
}
