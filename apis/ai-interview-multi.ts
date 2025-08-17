import { aiFetch } from '../utils/fetch/fetch'
import type {
	InterviewSession,
	QA,
	ApiResponseInterviewStartResponseDTO,
} from './types/interview-types'

export function toCamelCaseQA(raw: any): QA {
	return {
		question: raw.question,
		audioPath: raw.audio_path,
		answer: raw.answer,
		followUpLength: raw.follow_up_length,
		followUps: raw.follow_ups?.map((f: any) => ({
			question: f.question,
			audioPath: f.audio_path,
			answer: f.answer,
		})),
		feedback: raw.feedback,
	}
}

function toCamelCaseInterviewSession(raw: any): InterviewSession {
	return {
		interviewId: raw.interview_id,
		memberInterviewId: raw.member_interview_id,
		sessionId: raw.session_id,
		cursor: raw.cursor,
		videoPath: raw.video_path,
		questionLength: raw.question_length,
		qaFlow: raw.qa_flow?.map?.(toCamelCaseQA) ?? [],
		finalReport: raw.final_report,
	}
}

// 멀티 세션용 질문 생성
export async function generateMultiSessionQuestions(
	interviewId: string,
	memberInterviewId: string,
	payload?: any
): Promise<InterviewSession> {
	try {
		const res = await aiFetch.post<any>(
			`/interview/generate_questions`,
			payload
		)
		console.log('멀티 세션 질문 생성 성공:', res)
		if (typeof res === 'boolean') {
			throw new Error('멀티 세션 질문 생성에 실패했습니다.')
		}
		return toCamelCaseInterviewSession(res)
	} catch (error) {
		console.error('멀티 세션 질문 생성 실패:', error)
		throw error
	}
}

// 멀티 세션용 메인 질문 답변 (참가자별)
export async function answerMultiSessionMainQuestion(
	sessionId: string,
	index: number,
	participantId: string,
	payload: any
): Promise<any> {
	console.log('멀티 세션 메인 질문 답변 API 호출:', {
		sessionId,
		index,
		participantId,
	})

	try {
		const res = await aiFetch.patch<any>(
			`/interview/session/${sessionId}/qa/${index}/answer`,
			{
				...payload,
				participant_id: participantId,
			}
		)
		console.log('멀티 세션 메인 질문 답변 성공:', res)

		return res
	} catch (error) {
		console.error('멀티 세션 메인 질문 답변 실패:', error)
		throw error
	}
}

// 멀티 세션용 후속 질문 생성
export async function generateMultiSessionFollowUpQuestions(
	sessionId: string,
	index: number,
	payload?: any
): Promise<InterviewSession> {
	const res = await aiFetch.post<any>(
		`/interview/session/${sessionId}/qa/${index}/generate_follow-ups`,
		payload
	)
	if (typeof res === 'boolean') {
		throw new Error('멀티 세션 후속 질문 생성에 실패했습니다.')
	}
	return toCamelCaseInterviewSession(res)
}

// 멀티 세션용 후속 질문 답변 (참가자별)
export async function answerMultiSessionFollowUpQuestion(
	sessionId: string,
	index: number,
	fIndex: number,
	participantId: string,
	payload: any
): Promise<any> {
	console.log('멀티 세션 후속 질문 답변 API 호출:', {
		sessionId,
		index,
		fIndex,
		participantId,
	})

	try {
		const res = await aiFetch.patch<any>(
			`/interview/session/${sessionId}/qa/${index}/follow-up/${fIndex}/answer`,
			{
				...payload,
				participant_id: participantId,
			}
		)
		console.log('멀티 세션 후속 질문 답변 성공:', res)
		return toCamelCaseInterviewSession(res)
	} catch (error) {
		console.error('멀티 세션 후속 질문 답변 실패:', error)
		throw error
	}
}

// 멀티 세션용 피드백 생성
export async function generateMultiSessionFeedback(
	sessionId: string,
	index: number,
	payload?: any
): Promise<InterviewSession> {
	const res = await aiFetch.post<any>(
		`/interview/session/${sessionId}/qa/${index}/feedback`,
		payload
	)
	if (typeof res === 'boolean') {
		throw new Error('멀티 세션 피드백 생성에 실패했습니다.')
	}
	return toCamelCaseInterviewSession(res)
}

// 멀티 세션용 최종 리포트 생성
export async function generateMultiSessionFinalReport(
	sessionId: string,
	payload?: any
): Promise<InterviewSession> {
	const res = await aiFetch.post<any>(
		`/interview/session/${sessionId}/report`,
		payload
	)
	if (typeof res === 'boolean') {
		throw new Error('멀티 세션 최종 리포트 생성에 실패했습니다.')
	}
	return toCamelCaseInterviewSession(res)
}

// 멀티 세션용 세션 조회
export async function getMultiSessionById(
	sessionId: string
): Promise<InterviewSession> {
	const res = await aiFetch.get<any>(`/interview/session/${sessionId}`)
	return toCamelCaseInterviewSession(res)
}

// 멀티 세션용 세션 조회 (interviewId, memberInterviewId)
export async function getMultiSessionByInterviewAndMember(
	interviewId: string,
	memberInterviewId: string
): Promise<InterviewSession | null> {
	console.log('멀티 세션 조회 API 호출:', { interviewId, memberInterviewId })

	try {
		const res = await aiFetch.get<any>(`/interview/session/sess_c6105daf`)
		console.log('멀티 세션 조회 성공:', res)
		return toCamelCaseInterviewSession(res)
	} catch (error) {
		console.error('멀티 세션 조회 실패:', error)
		return null
	}
}
