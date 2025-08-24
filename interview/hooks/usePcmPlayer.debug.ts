// interview/hooks/usePcmPlayer.debug.ts
'use client'
import { useEffect, useRef, useState } from 'react'

type PlayerDebugOpts = {
	debug?: boolean
	tag?: string
	targetBuffer?: number
	maxBuffer?: number
	logEvery?: number
	// NEW: 버스트/리로드 감지 임계값
	burstGapMs?: number // 연속 "매우 짧은 Δ"로 버스트 판단 (기본 5ms)
	burstCount?: number // 버스트로 판단할 최소 연속 횟수 (기본 3)
	// NEW: 워치독
	watchdogLagMs?: number // 연속 과대지연으로 판단할 lag (기본 120ms)
	watchdogCount?: number // 연속 횟수 (기본 5)
	// NEW: 적응형 타깃버퍼
	minTarget?: number // sec, 하한 (기본 0.08)
	maxTarget?: number // sec, 상한 (기본 0.18)
	upStep?: number // sec, 올릴 때 (기본 +0.01)
	downStep?: number // sec, 내릴 때 (기본 -0.005)
}

declare global {
	interface Window {
		__PCM_DEBUG?: boolean
	}
}

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
function applyFadeInOut(buf: Float32Array, sampleRate: number) {
	const fade = Math.max(1, Math.floor(sampleRate * 0.002)) // 2ms
	const n = buf.length,
		last = n - 1
	const L = Math.min(fade, n)
	for (let i = 0; i < L; i++) {
		const g = i / L
		buf[i] *= g
		buf[last - i] *= g
	}
}

export function usePcmPlayerDebug(
	ws: WebSocket | null,
	enabled: boolean,
	opts: PlayerDebugOpts = {}
) {
	const ctxRef = useRef<AudioContext | null>(null)
	const hpRef = useRef<BiquadFilterNode | null>(null)
	const playHeadRef = useRef<number>(0)

	const [lagMs, setLagMs] = useState(0)

	// 기본 버퍼
	const BASE_TARGET = opts.targetBuffer ?? 0.12
	const MAX_BUFFER = opts.maxBuffer ?? 0.3

	// NEW: 적응형 타깃
	const targetRef = useRef(BASE_TARGET)
	const MIN_TARGET = opts.minTarget ?? 0.08
	const MAX_TARGET2 = opts.maxTarget ?? 0.18
	const UP_STEP = opts.upStep ?? 0.01
	const DOWN_STEP = opts.downStep ?? 0.005

	const LOG_EVERY = Math.max(1, opts.logEvery ?? 1)
	const TAG = opts.tag ?? 'PCM'

	// 디버그 측정
	const msgCountRef = useRef(0)
	const lastTsRef = useRef<number | null>(null)
	const emaGapRef = useRef<number | null>(null)
	const emaJitRef = useRef<number | null>(null)

	// NEW: 버스트/리로드 감지
	const BURST_GAP = opts.burstGapMs ?? 5
	const BURST_COUNT = opts.burstCount ?? 3
	const burstRunRef = useRef(0)

	// NEW: 워치독(지연 누적)
	const WATCH_LAG = opts.watchdogLagMs ?? 120
	const WATCH_COUNT = opts.watchdogCount ?? 5
	const lagRunRef = useRef(0)

	useEffect(() => {
		if (!enabled || !ws) return
		ws.binaryType = 'arraybuffer'

		const Ctx = window.AudioContext || (window as any).webkitAudioContext
		const ctx = ctxRef.current ?? new Ctx()
		ctxRef.current = ctx
		ctx.resume().catch(() => {})

		if (!hpRef.current) {
			const hp = ctx.createBiquadFilter()
			hp.type = 'highpass'
			hp.frequency.value = 20
			hp.Q.value = Math.SQRT1_2
			hp.connect(ctx.destination)
			hpRef.current = hp
		}

		// NEW: HMR(리로드) 시점에 재동기화
		const resetSync = (why: string) => {
			const now = ctx.currentTime
			playHeadRef.current = now + (targetRef.current = BASE_TARGET)
			burstRunRef.current = 0
			lagRunRef.current = 0
			if (window.__PCM_DEBUG || opts.debug) {
				console.warn(`[${TAG}] RESET SYNC → ${why}`)
			}
		}

		// HMR 이벤트 힌트(개발환경 전용)
		let unsub: (() => void) | null = null
		if (typeof window !== 'undefined') {
			const onVis = () => {
				// 탭 전환/포커스 복귀 시 한 번 재동기화
				if (document.visibilityState === 'visible')
					resetSync('visibilitychange')
			}
			document.addEventListener('visibilitychange', onVis)
			unsub = () => document.removeEventListener('visibilitychange', onVis)
		}

		const onMsg = async (ev: MessageEvent) => {
			const tNow = performance.now()
			const last = lastTsRef.current
			const gapMs = last == null ? 0 : tNow - last
			lastTsRef.current = tNow

			const alpha = 0.2
			if (last != null) {
				emaGapRef.current =
					emaGapRef.current == null
						? gapMs
						: alpha * gapMs + (1 - alpha) * emaGapRef.current
				const jit = Math.abs(gapMs - (emaGapRef.current ?? gapMs))
				emaJitRef.current =
					emaJitRef.current == null
						? jit
						: alpha * jit + (1 - alpha) * emaJitRef.current
			}

			let ab: ArrayBuffer | null = null
			if (ev.data instanceof ArrayBuffer) ab = ev.data
			else if (ev.data instanceof Blob) ab = await ev.data.arrayBuffer()
			else return

			const i16 = new Int16Array(ab)
			if (i16.length === 0) return

			// 버스트 감지(아주 짧은 Δ 연속 → 리로드/몰림)
			if (gapMs > 0 && gapMs < BURST_GAP) {
				burstRunRef.current++
				if (burstRunRef.current >= BURST_COUNT) {
					resetSync(`burst(Δ~${gapMs.toFixed(1)}ms x${burstRunRef.current})`)
				}
			} else {
				burstRunRef.current = 0
			}

			// 오디오 변환
			const f32 = i16ToF32(i16)
			let resampled = resampleLinear(f32, 16000, ctx.sampleRate)
			applyFadeInOut(resampled, ctx.sampleRate)

			const buf = ctx.createBuffer(1, resampled.length, ctx.sampleRate)
			buf.copyToChannel(resampled, 0)
			const src = ctx.createBufferSource()
			src.buffer = buf
			src.connect(hpRef.current!)

			// 스케줄링
			const now = ctx.currentTime
			let ph = playHeadRef.current
			if (ph < now + 0.02) ph = now + 0.02
			const queue = ph - now

			// NEW: 적응형 타깃 (밀리면 올리고, 안정적이면 서서히 내림)
			if (queue > targetRef.current * 1.6) {
				targetRef.current = Math.min(MAX_TARGET2, targetRef.current + UP_STEP)
			} else if (queue < targetRef.current * 0.6) {
				targetRef.current = Math.max(MIN_TARGET, targetRef.current - DOWN_STEP)
			}

			// 클램프(상한 초과 시 강제 재동기화)
			let clamped = false,
				reason = ''
			if (queue > MAX_BUFFER) {
				ph = now + targetRef.current
				clamped = true
				reason = `queue=${(queue * 1000) | 0}ms > MAX=${(MAX_BUFFER * 1000) | 0}ms`
			}

			src.start(ph)
			ph += buf.duration
			playHeadRef.current = ph
			const newLagMs = Math.round((ph - now) * 1000)
			setLagMs(newLagMs)

			// NEW: 워치독(연속 과대지연) → 강제 재동기화
			if (newLagMs >= WATCH_LAG) {
				lagRunRef.current++
				if (lagRunRef.current >= WATCH_COUNT) {
					resetSync(`watchdog(lag~${newLagMs}ms x${lagRunRef.current})`)
				}
			} else {
				lagRunRef.current = 0
			}

			const n = ++msgCountRef.current
			const shouldLog =
				(window.__PCM_DEBUG || opts.debug) && n % LOG_EVERY === 0
			if (shouldLog) {
				const title = `%c[${TAG}]#${n} Δ=${gapMs.toFixed(1)}ms len=${i16.length} lag=${newLagMs}ms tgt=${(targetRef.current * 1000) | 0}ms ${clamped ? '%cCLAMPED' : ''}`
				const s1 = 'color:#0b7;font-weight:600',
					s2 = 'color:#d22;font-weight:700'
				clamped
					? console.groupCollapsed(title, s1, s2)
					: console.groupCollapsed(title, s1)
				console.log('arrival', {
					ts: tNow.toFixed(1) + 'ms',
					gapMs: gapMs.toFixed(1),
					emaGapMs: (emaGapRef.current ?? 0).toFixed(1),
					emaJitterMs: (emaJitRef.current ?? 0).toFixed(1),
				})
				console.log('chunk', {
					int16Length: i16.length,
					outRate: ctx.sampleRate,
					durationMs: (buf.duration * 1000).toFixed(1),
				})
				console.log('queue', {
					now: now.toFixed(3),
					playHead: playHeadRef.current.toFixed(3),
					queueSec: queue.toFixed(3),
					target: targetRef.current.toFixed(3),
					max: MAX_BUFFER,
					clamped,
					reason: clamped ? reason : undefined,
				})
				console.groupEnd()
			}
		}

		ws.addEventListener('message', onMsg)
		return () => {
			ws.removeEventListener('message', onMsg)
			unsub?.()
		}
	}, [
		ws,
		enabled,
		BASE_TARGET,
		MAX_BUFFER,
		LOG_EVERY,
		opts.debug,
		opts.tag,
		opts.burstGapMs,
		opts.burstCount,
		opts.watchdogLagMs,
		opts.watchdogCount,
		opts.minTarget,
		opts.maxTarget,
		opts.upStep,
		opts.downStep,
	])

	return { lagMs }
}
