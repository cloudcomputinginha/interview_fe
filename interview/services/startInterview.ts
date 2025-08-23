// services/bootstrapInterview.ts
import { getInterview, getMockInterview } from '@/apis/interview'
import {
	aiGetSessionByPair,
	aiGenerateQuestions,
	type InterviewSession,
} from '@/interview/api/api'
import { syncStoreFromInterviewSession } from '@/interview/services/sessionSync'
import { BootstrapOptions, OnProgressCallback } from '@/interview/types'

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms))

/**
 * 인터뷰 페이지 최초 진입 시, 모든 참가자의 InterviewSession을 한 번에 스토어에 반영한다.
 *
 * @param interviewId   인터뷰 ID (number)
 * @param myMemberInterviewId    현재 접속 사용자의 memberInterviewId (number)
 * @param onProgress    진행 상태를 알리는 콜백 함수 (추가됨)
 * @param opts          폴링 옵션
 * @returns { base, sessions, sessionsArray }
 */
export async function bootstrapInterview(
	interviewId: number,
	myMemberInterviewId: number,
	onProgress: OnProgressCallback,
	opts: BootstrapOptions = {}
) {
	onProgress('fetching_base')
	const intervalMs = opts.intervalMs ?? 5000
	const maxAttempts = opts.maxAttempts ?? 24

	const base = await getMockInterview(interviewId)
	const infoPayload = base
	const participants = base.result?.participants ?? []

	if (participants.length === 0) {
		onProgress('complete')
		return {
			base,
			sessions: {} as Record<string, string>,
			sessionsArray: [] as InterviewSession[],
		}
	}

	// memberInterviewId 정렬 및 최소값 식별
	const memberInterviewIds = participants
		.map(p => Number(p.memberInterviewId))
		.filter(n => !Number.isNaN(n))
	memberInterviewIds.sort((a, b) => a - b)
	const minMemberInterviewId = memberInterviewIds[0]

	// 결과 누적
	const sessionsMap: Record<string, string> = {}
	const sessionsArray: InterviewSession[] = []

	// 공통: 세션 반영 도우미
	const applySession = (s: InterviewSession) => {
		syncStoreFromInterviewSession(s)
		sessionsMap[s.member_interview_id] = s.session_id
		sessionsArray.push(s)
	}

	// 2) 최소 id 사용자면 → generate 실행 (일괄 생성)
	if (myMemberInterviewId === minMemberInterviewId) {
		onProgress('generating_sessions')
		const createdList = await aiGenerateQuestions(infoPayload) // InterviewSession[]
		createdList.forEach(applySession)

		// 혹시 생성 응답에 빠진 대상이 있으면 폴링으로 보강
		const createdSet = new Set(createdList.map(s => s.member_interview_id))
		const missing = memberInterviewIds
			.map(String)
			.filter(mid => !createdSet.has(mid))

		onProgress('polling_missing')
		const pollOne = async (memberInterviewId: string) => {
			let attempt = 0
			while (attempt < maxAttempts) {
				attempt++
				try {
					const s = await aiGetSessionByPair(
						String(base.result?.interviewId ?? 0),
						memberInterviewId
					)
					applySession(s)
					return
				} catch {
					await sleep(intervalMs)
				}
			}
			console.warn(
				`[bootstrapInterview] Polling timed out for memberInterviewId=${memberInterviewId}`
			)
		}

		await Promise.all(missing.map(pollOne))
		onProgress('complete')
		return { base, sessions: sessionsMap, sessionsArray }
	}

	// 3) 최소 id 사용자가 아니라면 → generate 호출 금지, 전원 폴링
	onProgress('polling_all')
	const pollOne = async (memberInterviewId: number) => {
		let attempt = 0
		while (attempt < maxAttempts) {
			attempt++
			try {
				const s = await aiGetSessionByPair(
					String(base.result?.interviewId ?? 0),
					String(memberInterviewId)
				)
				applySession(s)
				return
			} catch {
				await sleep(intervalMs)
			}
		}
		console.warn(
			`[bootstrapInterview] Polling timed out for memberInterviewId=${memberInterviewId}`
		)
	}

	await Promise.all(memberInterviewIds.map(pollOne))
	onProgress('complete')
	return { base, sessions: sessionsMap, sessionsArray }
}
