// services/sessionSync.ts
import { useInterviewStore } from '@/interview/store/useInterviewStore'
import { AudioBus } from '@/interview/audio/audioBus'

export type FollowUpQA = {
	question: string
	audio_path: string
	answer?: string | null
}
export type QA = {
	question: string
	audio_path: string
	answer?: string | null
	follow_up_length: number
	follow_ups?: FollowUpQA[] | null
	feedback?: string | null
}
export type Cursor = { q_idx: number; f_idx: number }
export type InterviewSession = {
	interview_id: string
	member_interview_id: string
	session_id: string
	cursor: Cursor
	question_length: number
	qa_flow: QA[]
	final_report?: string | null
}

// ---- S3 풀 URL 헬퍼 ---------------------------------------------------------
const S3_BASE = (process.env.NEXT_PUBLIC_S3_URL ?? '').replace(/\/$/, '')
const toFullUrl = (p?: string | null) => {
	if (!p) return ''
	if (p.startsWith('http')) return p
	return `${S3_BASE}/${p.replace(/^\//, '')}`
}

export function syncStoreFromInterviewSession(s: InterviewSession) {
	const {
		setQuestions,
		replaceFollowUps,
		downloadAudio,
		setCurrent,
		bindSessionToMember,
	} = useInterviewStore.getState()

	const sessionId = s.session_id

	// (1) 매핑(세션↔멤버)
	bindSessionToMember(sessionId, Number(s.member_interview_id))

	// (2) 메인 질문 텍스트
	const questions = s.qa_flow.map(q => q.question)
	setQuestions(sessionId, questions, 'replace')

	// (3) 메인 오디오 경로: 스토어 라우트/다운로드 + 프리로드
	const preloadTasks: Promise<any>[] = []

	s.qa_flow.forEach((q, i) => {
		const full = toFullUrl(q.audio_path)
		if (full) {
			// a) 내부 라우트 생성/저장 (기존 로직)
			downloadAudio(sessionId, i, undefined, async () => full)
			// b) 프리로드(다운로드+blob 캐시)
			preloadTasks.push(AudioBus.preload(full).catch(() => {}))
		}
	})

	// (4) 후속질문 텍스트/오디오: 스토어 반영 + 프리로드
	s.qa_flow.forEach((q, i) => {
		const fus = q.follow_ups ?? []
		if (fus && fus.length) {
			replaceFollowUps(
				sessionId,
				i,
				fus.map(f => f.question)
			)
			fus.forEach((f, fIdx) => {
				const full = toFullUrl(f.audio_path)
				if (full) {
					downloadAudio(sessionId, i, fIdx, async () => full)
					preloadTasks.push(AudioBus.preload(full).catch(() => {}))
				}
			})
		}
	})

	// (5) 커서 동기화
	setCurrent(sessionId, s.cursor.q_idx, s.cursor.f_idx)

	// (6) 프리로드는 백그라운드로 처리 (실패 무시)
	Promise.allSettled(preloadTasks).catch(() => {})
}

const inflight = new Map<string, Promise<void>>()

export async function ensureFollowUps(sessionId: string, qIndex: number) {
	const st = useInterviewStore.getState()
	const existing = st.followUpQuestions[sessionId]?.[qIndex]
	if (existing && existing.length) return // 이미 있으면 스킵

	const key = `${sessionId}:${qIndex}`
	if (inflight.has(key)) return inflight.get(key)!

	const task = (async () => {
		try {
			// 혹시 대기 중에 다른 곳에서 채웠을 수 있으니 다시 확인
			const again =
				useInterviewStore.getState().followUpQuestions[sessionId]?.[qIndex]
			if (again && again.length) return

			const { aiGenerateFollowUps } = await import('@/interview/api/api')
			const updated = await aiGenerateFollowUps(sessionId, qIndex)

			// ⬇️ 생성 스냅샷 반영 시, 위에서 프리로드까지 자동 실행됨
			syncStoreFromInterviewSession(updated)
		} catch (e) {
			console.error('[ensureFollowUps] failed', e)
		} finally {
			inflight.delete(key)
		}
	})()

	inflight.set(key, task)
	return task
}
