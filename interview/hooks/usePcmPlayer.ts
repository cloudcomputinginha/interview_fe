// hooks/usePcmPlayer.ts — 교체/보강 버전
'use client'
import { useEffect, useRef, useState } from 'react'

function i16ToF32(int16: Int16Array) {
	const out = new Float32Array(int16.length)
	for (let i = 0; i < int16.length; i++) out[i] = int16[i] / 32768
	return out
}
function resampleLinear(input: Float32Array, inRate: number, outRate: number) {
	if (inRate === outRate) return input
	const ratio = outRate / inRate
	const outLen = Math.round(input.length * ratio)
	const out = new Float32Array(outLen)
	for (let i = 0; i < outLen; i++) {
		const pos = i / ratio,
			i0 = Math.floor(pos),
			i1 = Math.min(i0 + 1, input.length - 1)
		const f = pos - i0
		out[i] = input[i0] * (1 - f) + input[i1] * f
	}
	return out
}
// ⬇ 2ms 페이드 인/아웃
function applyFadeInOut(buf: Float32Array, sampleRate: number) {
	const fadeSamples = Math.max(1, Math.floor(sampleRate * 0.002)) // 2ms
	const n = buf.length
	const last = n - 1
	for (let i = 0; i < Math.min(fadeSamples, n); i++) {
		const g = i / fadeSamples
		buf[i] *= g // fade-in
		const j = last - i
		buf[j] *= g // fade-out
	}
}

export function usePcmPlayer(ws: WebSocket | null, enabled: boolean) {
	const ctxRef = useRef<AudioContext | null>(null)
	const hpRef = useRef<BiquadFilterNode | null>(null)
	const playHeadRef = useRef<number>(0)
	const [lagMs, setLagMs] = useState(0)

	const TARGET_BUFFER = 0.12
	const MAX_BUFFER = 0.3

	useEffect(() => {
		if (!enabled || !ws) return
		ws.binaryType = 'arraybuffer'
		const Ctx = window.AudioContext || (window as any).webkitAudioContext
		const ctx = ctxRef.current ?? new Ctx()
		ctxRef.current = ctx
		ctx.resume().catch(() => {})

		// DC 제거용 하이패스
		if (!hpRef.current) {
			const hp = ctx.createBiquadFilter()
			hp.type = 'highpass'
			hp.frequency.value = 20
			hp.Q.value = Math.SQRT1_2
			hp.connect(ctx.destination)
			hpRef.current = hp
		}

		const onMsg = async (ev: MessageEvent) => {
			let ab: ArrayBuffer | null = null
			if (ev.data instanceof ArrayBuffer) ab = ev.data
			else if (ev.data instanceof Blob) ab = await ev.data.arrayBuffer()
			else return

			const i16 = new Int16Array(ab)
			if (i16.length === 0) return

			const f32 = i16ToF32(i16)
			const resampled = resampleLinear(f32, 16000, ctx.sampleRate)
			applyFadeInOut(resampled, ctx.sampleRate) // ⬅ 디클릭

			const buf = ctx.createBuffer(1, resampled.length, ctx.sampleRate)
			buf.copyToChannel(resampled, 0)
			const src = ctx.createBufferSource()
			src.buffer = buf
			src.connect(hpRef.current!) // highpass → destination

			const now = ctx.currentTime
			let ph = playHeadRef.current
			if (ph < now + 0.02) ph = now + 0.02
			const queue = ph - now
			if (queue > MAX_BUFFER) ph = now + TARGET_BUFFER

			src.start(ph)
			ph += buf.duration
			playHeadRef.current = ph
			setLagMs(Math.round((ph - now) * 1000))
		}

		ws.addEventListener('message', onMsg)
		return () => {
			ws.removeEventListener('message', onMsg)
		}
	}, [ws, enabled])

	return { lagMs }
}
