// interview/services/audioWaiters.ts
import {
	getFollowUpAudioPath,
	getQuestionAudioPath,
} from '@/interview/services/audioPathAdapter'

/** 스토어에 오디오 경로가 채워질 때까지 잠깐 폴링해서 기다린다. */
export async function waitForFollowUpSrc(
	sessionId: string,
	qIndex: number,
	fIndex: number,
	{
		timeoutMs = 5000,
		intervalMs = 150,
	}: { timeoutMs?: number; intervalMs?: number } = {}
): Promise<string | undefined> {
	const deadline = Date.now() + timeoutMs
	while (Date.now() < deadline) {
		const src = getFollowUpAudioPath(sessionId, qIndex, fIndex)
		if (src) return src
		await new Promise(res => setTimeout(res, intervalMs))
	}
	return undefined
}

export async function waitForQuestionSrc(
	sessionId: string,
	qIndex: number,
	{
		timeoutMs = 5000,
		intervalMs = 150,
	}: { timeoutMs?: number; intervalMs?: number } = {}
): Promise<string | undefined> {
	const deadline = Date.now() + timeoutMs
	while (Date.now() < deadline) {
		const src = getQuestionAudioPath(sessionId, qIndex)
		if (src) return src
		await new Promise(res => setTimeout(res, intervalMs))
	}
	return undefined
}
