export interface Participant {
	id: number
	name: string
	isHost: boolean
	hasSubmittedDocs: boolean
}

export interface Resume {
	id: string
	name: string
}

export interface CoverLetter {
	id: string
	name: string
}

export type AiVoice = 'female1' | 'female2' | 'male1' | 'male2'

export type InterviewType = 'technical' | 'personality'

export interface InterviewFormState {
	step: number
	sessionName: string
	participants: Participant[]
	date: string
	time: string
	selectedResume: string
	selectedCoverLetter: string
	aiVoice: AiVoice
	interviewType: InterviewType
	questionCount: number
	duration: number
}
