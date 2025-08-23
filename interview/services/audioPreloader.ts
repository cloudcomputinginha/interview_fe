// interview/services/audioPreloader.ts
import { AudioBus } from '@/interview/audio/audioBus'
import type { InterviewSession } from '@/interview/api/api'

const BASE = process.env.NEXT_PUBLIC_S3_URL ?? ''

function fullUrl(path: string) {
	if (!path) return ''
	// audio_path가 상대경로라면 S3 URL 붙여줌
	if (path.startsWith('http')) return path
	return `${BASE.replace(/\/$/, '')}/${path.replace(/^\//, '')}`
}

/**
 * InterviewSession에 포함된 모든 질문/팔로우업 오디오를 미리 다운로드 & 캐싱
 */
export async function preloadAudiosFromSession(session: InterviewSession) {
	const tasks: Promise<any>[] = []

	session.qa_flow.forEach((qa, qi) => {
		const qUrl = fullUrl(qa.audio_path)
		if (qUrl) tasks.push(AudioBus.preload(qUrl))

		if (qa.follow_ups) {
			qa.follow_ups.forEach((f, fi) => {
				const fUrl = fullUrl(f.audio_path)
				if (fUrl) tasks.push(AudioBus.preload(fUrl))
			})
		}
	})

	await Promise.allSettled(tasks)
}
