export type InterviewType = 'individual' | 'group'

export interface InterviewTitle {
	step: number
	title: string
	interviewType: InterviewType | 'common'
}

export const TITLES: InterviewTitle[] = [
	{ step: 1, title: '면접 유형 선택', interviewType: 'common' },
	{ step: 2, title: '자료 선택하기 / 입력하기', interviewType: 'common' },
	{ step: 3, title: '면접 옵션 선택하기', interviewType: 'common' },
	{ step: 4, title: '면접 시작 옵션', interviewType: 'individual' },
	{ step: 4, title: '면접 예약', interviewType: 'group' },
	{ step: 5, title: '면접 정보 미리보기', interviewType: 'individual' },
	{ step: 5, title: '참가자 초대하기', interviewType: 'group' },
	{ step: 6, title: '면접 정보 미리보기', interviewType: 'group' },
]

export interface CoverLetter {
	representativeTitle: string
	content: string
}

export interface InterviewOptions {
	voiceType: 'female1' | 'female2' | 'male1' | 'male2'
	interviewStyle: 'personality' | 'technical'
	answerDuration: number // 1-5 minutes
}

export interface IndividualInterviewCreate {
	title: string
	resumeId: string
	coverLetter: CoverLetter
	startType: 'now' | 'scheduled'
	startAt: string // date-time
	options: InterviewOptions
}

export interface GroupInterviewCreate {
	sessionName: string
	maxParticipants: number
	visibility: 'public' | 'private'
	participants: { email: string }[]
	scheduledAt: string // date-time
	options: InterviewOptions
}

export interface WizardState {
	// Common
	interviewType: InterviewType
	coverLetter: CoverLetter
	options: InterviewOptions

	// Individual specific
	title?: string
	resumeId?: string
	startType?: 'now' | 'scheduled'
	startAt?: string

	// Group specific
	sessionName?: string
	maxParticipants?: number
	visibility?: 'public' | 'private'
	participants?: { email: string }[]
	scheduledAt?: string
}
