import type { InterviewSession } from '@/apis/types/interview-types'

export type ReadyStatus =
	| 'INIT'
	| 'FETCHING_INTERVIEW_DETAIL'
	| 'GENERATING_SESSION'
	| 'PRELOADING_AUDIO'
	| 'INTERVIEW_READY'
	| 'INTERVIEW_FINISHED'
	| 'ERROR'

export interface InterviewState {
	session: InterviewSession | null
	currentQuestionIdx: number
	currentFollowUpIdx: number
	readyStatus: ReadyStatus
	isLoading: boolean
	isQuestionLoading: boolean
	error: string | null
	isAudioPreloading: boolean
	isFeedbackLoading: boolean
	isFinalReportLoading: boolean
	finalReport: any
	timer: number
}
