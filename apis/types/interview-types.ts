export interface InterviewCreateDTO {
	name: string
	description: string
	sessionName?: string
	corporateName: string
	jobName: string
	interviewFormat: 'INDIVIDUAL' | 'GROUP'
	interviewType: 'PERSONALITY' | 'TECHNICAL'
	voiceType:
		| 'MALE20'
		| 'MALE30'
		| 'MALE40'
		| 'MALE50'
		| 'FEMALE20'
		| 'FEMALE30'
		| 'FEMALE40'
		| 'FEMALE50'
	questionNumber: number
	answerTime: number
	startType?: 'NOW' | 'SCHEDULED'
	scheduledDate?: string
	scheduledTime?: string
	maxParticipants?: number
	isOpen?: boolean
	resumeId: number
	resumeTitle?: string
	coverLetterId: number
	coverLetterTitle?: string
	inviteEmailDTOList?: InviteEmailDTO[]
	noticeUrl?: string
}

export interface InviteEmailDTO {
	id?: number
	email?: string
}

export interface ApiResponseInterviewCreateResultDTO {
	isSuccess?: boolean
	code?: string
	message?: string
	result?: InterviewCreateResultDTO
}

export interface InterviewCreateResultDTO {
	interviewId?: number
	name?: string
	description?: string
	corporateName?: string
	jobName?: string
	interviewFormat?: 'INDIVIDUAL' | 'GROUP'
	interviewType?: 'PERSONALITY' | 'TECHNICAL'
	startType?: 'NOW' | 'SCHEDULED'
	startedAt?: string
	createdAt?: string
}

export interface CreateMemberInterviewDTO {
	memberId: number
	resumeId: number
	coverletterId: number
}

export interface ApiResponseCreateMemberInterviewDTO {
	isSuccess?: boolean
	code?: string
	message?: string
	result?: CreateMemberInterviewDTO
}

export interface CreateMemberInterviewResultDTO {
	memberInterviewId?: number
	createdAt?: string
}

export interface changeMemberStatusDTO {
	memberId: number
	status: 'NO_SHOW' | 'SCHEDULED' | 'IN_PROGRESS' | 'DONE'
}

export interface ApiResponseMemberInterviewStatusDTO {
	isSuccess?: boolean
	code?: string
	message?: string
	result?: MemberInterviewStatusDTO
}

export interface MemberInterviewStatusDTO {
	memberInterviewId?: number
	status?: 'NO_SHOW' | 'SCHEDULED' | 'IN_PROGRESS' | 'DONE'
	updatedAt?: string
}

export interface endInterviewRequestDTO {
	endedAt: string
}

export interface ApiResponseInterviewEndResultDTO {
	isSuccess?: boolean
	code?: string
	message?: string
	result?: InterviewEndResultDTO
}

export interface InterviewEndResultDTO {
	interviewId?: number
	endedAt?: string
}

export interface InterviewOptionUpdateDTO {
	voiceType:
		| 'MALE20'
		| 'MALE30'
		| 'MALE40'
		| 'MALE50'
		| 'FEMALE20'
		| 'FEMALE30'
		| 'FEMALE40'
		| 'FEMALE50'
	questionNumber: number
	answerTime: number
}

export interface ApiResponseInterviewOptionUpdateResponseDTO {
	isSuccess?: boolean
	code?: string
	message?: string
	result?: InterviewOptionUpdateResponseDTO
}

export interface InterviewOptionUpdateResponseDTO {
	interviewId?: number
	interviewOptionId?: number
	voiceType?:
		| 'MALE20'
		| 'MALE30'
		| 'MALE40'
		| 'MALE50'
		| 'FEMALE20'
		| 'FEMALE30'
		| 'FEMALE40'
		| 'FEMALE50'
	questionNumber?: number
	answerTime?: number
}

// 1대다(그룹) 면접 관련 타입
export interface ApiResponseListInterviewGroupCardDTO {
	isSuccess?: boolean
	code?: string
	message?: string
	result?: InterviewGroupCardDTO[]
}

export interface InterviewGroupCardDTO {
	interviewId?: number
	name?: string
	description?: string
	sessionName?: string
	jobName?: string
	interviewType?: 'PERSONALITY' | 'TECHNICAL'
	currentParticipants?: number
	maxParticipants?: number
	startedAt?: string
}

export interface ApiResponseGroupInterviewDetailDTO {
	isSuccess?: boolean
	code?: string
	message?: string
	result?: GroupInterviewDetailDTO
}

export interface GroupInterviewDetailDTO {
	interviewId?: number
	name?: string
	description?: string
	sessionName?: string
	jobName?: string
	interviewType?: 'PERSONALITY' | 'TECHNICAL'
	maxParticipants?: number
	currentParticipants?: number
	startedAt?: string
	noticeUrl?: string
	hostName?: string
	groupInterviewParticipants?: GroupInterviewParticipantDTO[]
}

export interface GroupInterviewParticipantDTO {
	memberId?: number
	name?: string
	submitted?: boolean
	host?: boolean
}

// 면접 시작 관련 타입
export interface ApiResponseInterviewStartResponseDTO {
	isSuccess?: boolean
	code?: string
	message?: string
	result?: InterviewStartResponseDTO
}

export interface InterviewStartResponseDTO {
	interviewId?: number
	interview?: InterviewDTO
	options?: InterviewOptionDTO
	participants?: ParticipantDTO[]
}

export interface InterviewDTO {
	interviewId?: number
	corporateName?: string
	jobName?: string
	noticeUrl?: string
	startType?: 'NOW' | 'SCHEDULED'
	participantCount?: number
}

export interface InterviewOptionDTO {
	interviewFormat?: 'INDIVIDUAL' | 'GROUP'
	interviewType?: 'PERSONALITY' | 'TECHNICAL'
	voiceType?:
		| 'MALE20'
		| 'MALE30'
		| 'MALE40'
		| 'MALE50'
		| 'FEMALE20'
		| 'FEMALE30'
		| 'FEMALE40'
		| 'FEMALE50'
	questionNumber?: number
	answerTime?: number
}

export interface ParticipantDTO {
	memberInterviewId?: number
	resumeDTO?: ResumeSimpleDTO
	coverLetterDTO?: CoverLetterDetailDTO
}

export interface ResumeSimpleDTO {
	resumeId?: number
	fileUrl?: string
}

export interface CoverLetterDetailDTO {
	coverletterId: number
	corporateName: string
	jobName: string
	qnaList: {
		question: string
		answer: string
	}[]
	createdAt: string
}

// === AI 인터뷰 세션 관련 타입 (FastAPI 기반) ===

export interface Cursor {
	qIdx: number
	fIdx: number
}

export interface FollowUpQA {
	question: string
	audioPath: string
	answer?: string | null
}

export interface QA {
	question: string
	audioPath: string
	answer?: string | null
	followUpLength: number
	followUps?: FollowUpQA[] | null
	feedback?: string | null
}

export interface InterviewSession {
	interviewId: string
	memberInterviewId: string
	sessionId: string
	cursor: Cursor
	videoPath?: string | null
	questionLength: number
	qaFlow: QA[]
	finalReport?: string | null
}

export interface InterviewCardDTO {
	interviewId: number
	name: string
	corporateName: string
	jobName: string
	currentParticipants: number
	maxParticipants: number
	startedAt: string
	endedAt?: string
}

export interface InterviewOptionPreviewDTO {
	interviewFormat: 'INDIVIDUAL' | 'GROUP'
	interviewType: 'PERSONALITY' | 'TECHNICAL'
}

export interface MyInterviewDTO {
	myInterviewCardDTO: InterviewCardDTO
	interviewOptionPreviewDTO: InterviewOptionPreviewDTO
	memberInterviewStatusDTO: MemberInterviewStatusDTO
}

export interface MyInterviewListDTO {
	myInterviews: MyInterviewDTO[]
}

export interface ApiResponseMyInterviewListDTO {
	isSuccess: boolean
	code: string
	message: string
	result: MyInterviewListDTO
}

// 면접 문서 변경 DTO
export interface UpdateDocumentDTO {
	resumeId: number
	coverletterId: number
}

// 면접 문서 변경 응답 DTO
export interface MemberInterviewDocumentDTO {
	memberInterviewId?: number
	resumeId?: number
	coverLetterId?: number
	updatedAt?: string
}

// 면접 문서 변경 응답 래퍼
export interface ApiResponseMemberInterviewDocumentDTO {
	isSuccess?: boolean
	code?: string
	message?: string
	result?: MemberInterviewDocumentDTO
}
