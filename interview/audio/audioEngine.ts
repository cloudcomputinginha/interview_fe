// interview/audio/AudioEngine.ts
let ac: AudioContext | null = null

export function getAudioContext() {
	if (!ac)
		ac = new (window.AudioContext || (window as any).webkitAudioContext)()
	return ac
}

export async function resumeAudioContext() {
	const ctx = getAudioContext()
	if (ctx.state === 'suspended') {
		try {
			await ctx.resume()
		} catch (e) {
			console.error('resumeAudioContext', e)
		}
	}
	return ctx
}

// 페이지 가려졌다가 돌아올 때 복구
if (typeof document !== 'undefined') {
	document.addEventListener('visibilitychange', () => {
		if (!ac) return
		if (ac.state === 'suspended') ac.resume().catch(() => {})
	})
}
