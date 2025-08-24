// interview/services/hydrateFollowUps.ts
import { useInterviewStore } from '@/interview/store/useInterviewStore'
import { aiGetSession } from '@/interview/api/api'
import { syncStoreFromInterviewSession } from '@/interview/services/sessionSync'

const inflight = new Map<string, Promise<boolean>>()

/**
 * follow-up이 없거나 길이가 기대치랑 다르면 주기적으로 GET해서 갱신.
 * - maxAttempts, intervalMs 조절 가능
 * - true: 기대 길이에 맞게 채워짐
 * - false: 끝까지 못 채움
 */
export async function hydrateFollowUpsFromServer(
	sessionId: string,
	qIndex: number,
	{
		intervalMs = 1000,
		maxAttempts = 10,
	}: { intervalMs?: number; maxAttempts?: number } = {}
): Promise<boolean> {
	const key = `${sessionId}:${qIndex}`
	if (inflight.has(key)) return inflight.get(key)!

	const task = (async () => {
		let attempt = 0
		while (attempt < maxAttempts) {
			attempt++
			try {
				const snap = await aiGetSession(sessionId)
				syncStoreFromInterviewSession(snap)

				const st = useInterviewStore.getState()
				const q = snap.qa_flow[qIndex]
				const expected = q?.follow_up_length ?? 0
				const current = st.followUpQuestions[sessionId]?.[qIndex]?.length ?? 0

				if (expected > 0 && current >= expected) {
					return true // ✅ 기대치 달성
				}
			} catch (e) {
				console.warn(
					`[hydrateFollowUps] GET 실패 (sid=${sessionId}, q=${qIndex})`,
					e
				)
			}
			await new Promise(res => setTimeout(res, intervalMs))
		}
		return false
	})()

	inflight.set(key, task)
	try {
		return await task
	} finally {
		inflight.delete(key)
	}
}
