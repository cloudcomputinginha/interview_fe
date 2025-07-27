import type { QA } from '@/apis/types/interview-types'

const S3_URL = process.env.NEXT_PUBLIC_S3_URL || ''

export async function preloadAudio(audioPath: string): Promise<string> {
	if (!audioPath) return ''
	const url = S3_URL + audioPath
	const res = await fetch(url)
	if (!res.ok) throw new Error('오디오 프리로드 실패: ' + url)
	const blob = await res.blob()
	return URL.createObjectURL(blob)
}

export async function preloadAllAudios(
	qaFlow: QA[],
	audioUrlMap: Record<string, string>
): Promise<Record<string, string>> {
	const entries: [string, string][] = []

	for (let qIdx = 0; qIdx < qaFlow.length; qIdx++) {
		const q = qaFlow[qIdx]
		// 메인 질문
		const mainKey = `${qIdx}_-1`
		if (q.audioPath) {
			if (audioUrlMap[mainKey]) {
				entries.push([mainKey, audioUrlMap[mainKey]])
			} else {
				const blobUrl = await preloadAudio(q.audioPath)
				entries.push([mainKey, blobUrl])
			}
		}
		// 팔로우업
		if (Array.isArray(q.followUps)) {
			for (let fIdx = 0; fIdx < q.followUps.length; fIdx++) {
				const f = q.followUps[fIdx]
				const followKey = `${qIdx}_${fIdx}`
				if (f.audioPath) {
					if (audioUrlMap[followKey]) {
						entries.push([followKey, audioUrlMap[followKey]])
					} else {
						const blobUrl = await preloadAudio(f.audioPath)
						entries.push([followKey, blobUrl])
					}
				}
			}
		}
	}
	return Object.fromEntries(entries)
}
