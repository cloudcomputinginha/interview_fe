'use client'
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { InterviewStepHeader } from './components/InterviewStepHeader'
import { InterviewStepProgress } from './components/InterviewStepProgress'
import { InterviewStep1 } from './components/InterviewStep1'
import { InterviewStep2 } from './components/InterviewStep2'
import { InterviewStepFooter } from './components/InterviewStepFooter'
import { InterviewStepNotice } from './components/InterviewStepNotice'
import { useInterviewCreateForm } from './hooks/useInterviewCreateForm'
import { HeaderWithNotifications } from '@/components/header-with-notifications'

export default function CreateGroupInterviewPage({
	params,
}: {
	params: { id: string }
}) {
	const postId = params.id
	const {
		form,
		setField,
		nextStep,
		prevStep,
		formatDateTime,
		MOCK_RESUMES,
		MOCK_COVER_LETTERS,
	} = useInterviewCreateForm()

	return (
		<>
			<HeaderWithNotifications />
			<div className="min-h-screen bg-gray-50">
				<div className="max-w-4xl mx-auto p-6">
					<InterviewStepHeader postId={postId} sessionName={form.sessionName} />
					<InterviewStepProgress step={form.step} />
					<Card className="mb-6">
						<CardHeader>
							<CardTitle>
								{form.step === 1
									? '면접 일정 설정'
									: '호스트 자료 및 면접 옵션 설정'}
							</CardTitle>
						</CardHeader>
						<CardContent>
							{form.step === 1 ? (
								<InterviewStep1
									sessionName={form.sessionName}
									participants={form.participants}
									date={form.date}
									time={form.time}
									setField={setField}
									formatDateTime={formatDateTime}
								/>
							) : (
								<InterviewStep2
									selectedResume={form.selectedResume}
									selectedCoverLetter={form.selectedCoverLetter}
									aiVoice={form.aiVoice}
									interviewType={form.interviewType}
									questionCount={form.questionCount}
									duration={form.duration}
									setField={setField}
									resumes={MOCK_RESUMES}
									coverLetters={MOCK_COVER_LETTERS}
								/>
							)}
						</CardContent>
						<CardFooter>
							<InterviewStepFooter
								step={form.step}
								onPrev={() => prevStep(postId)}
								onNext={nextStep}
							/>
						</CardFooter>
					</Card>
					{form.step === 2 && (
						<InterviewStepNotice
							date={form.date}
							time={form.time}
							formatDateTime={formatDateTime}
						/>
					)}
				</div>
			</div>
		</>
	)
}
