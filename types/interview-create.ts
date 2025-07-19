// 최종 전송되는 데이터 타입 정의

export interface InterviewCreateRequest {
	// 공통 필드
	company: string
	position: string
	title: string
	description?: string
	interviewType: 'individual' | 'group'
	resumeId: string
	coverLetter:
		| {
				title: string
				content: string
		  }
		| string // 기존 자기소개서 ID 또는 새로 작성한 자기소개서 객체
	options: {
		voiceType: 'female1' | 'female2' | 'male1' | 'male2'
		interviewStyle: 'personality' | 'technical'
		answerDuration: number // 1-5 분
		questionCount: number // 5-15 개
		format: '1:1' | '1:n'
	}

	// 개인 면접 전용 필드
	startType?: 'now' | 'scheduled'
	scheduledAt?: string // ISO 8601 format: "2023-12-25T14:30:00"

	// 그룹 면접 전용 필드
	sessionName?: string
	maxParticipants?: number // 2-5
	visibility?: 'public' | 'private'
	participants?: Array<{ email: string }>
}

// API 응답 타입
export interface InterviewCreateResponse {
	success: boolean
	interviewId: string
	message: string
	redirectUrl?: string // 개인면접 즉시시작의 경우 세션 URL
}

// 개인 면접 생성 요청 예시
export const IndividualInterviewExample: InterviewCreateRequest = {
	company: '삼성전자',
	position: 'SW개발',
	title: '삼성전자 상반기 공채 모의면접',
	description: '백엔드 개발자 포지션 면접 연습',
	interviewType: 'individual',
	resumeId: 'resume_123',
	coverLetter: {
		title: '삼성전자 SW개발직군 자기소개서',
		content: '저는 사용자 중심의 서비스를 개발하는 것에 관심이 많은...',
	},
	options: {
		voiceType: 'female1',
		interviewStyle: 'technical',
		answerDuration: 3,
		questionCount: 10,
		format: '1:1',
	},
	startType: 'scheduled',
	scheduledAt: '2023-12-25T14:30:00',
}

// 그룹 면접 생성 요청 예시
export const GroupInterviewExample: InterviewCreateRequest = {
	company: '네이버',
	position: '백엔드개발',
	title: '네이버 신입 개발자 그룹면접',
	description: '동료들과 함께하는 모의 그룹면접',
	interviewType: 'group',
	resumeId: 'resume_456',
	coverLetter: 'coverletter_789', // 기존 자기소개서 ID
	options: {
		voiceType: 'male1',
		interviewStyle: 'personality',
		answerDuration: 2,
		questionCount: 8,
		format: '1:n',
	},
	sessionName: '2023 하반기 신입 공채 모의면접',
	maxParticipants: 4,
	visibility: 'private',
	scheduledAt: '2023-12-26T10:00:00',
	participants: [
		{ email: 'user1@example.com' },
		{ email: 'user2@example.com' },
		{ email: 'user3@example.com' },
	],
}
