import React, {
	createContext,
	useContext,
	useState,
	useRef,
	useCallback,
} from 'react'
import { AIInterviewSocket } from '@/api/ai-interview-socket'

interface RealtimeContextValue {
	isAnswering: boolean
	handleStartAnswering: () => void
	stopAnswering: () => void
	mediaError: string | null
}

const RealtimeContext = createContext<RealtimeContextValue | undefined>(
	undefined
)

interface RealtimeProviderProps {
	children: React.ReactNode
	wsRef: React.MutableRefObject<AIInterviewSocket | null>
	connectWsAsync: () => Promise<unknown>
}
export function RealtimeProvider({
	children,
	wsRef,
	connectWsAsync,
}: RealtimeProviderProps) {
	const [isAnswering, setIsAnswering] = useState(false)
	const [mediaStream, setMediaStream] = useState<MediaStream | null>(null)
	const [mediaError, setMediaError] = useState<string | null>(null)

	const audioContextRef = useRef<AudioContext | null>(null)
	const processorRef = useRef<ScriptProcessorNode | AudioWorkletNode | null>(
		null
	)

	const convertFloat32ToInt16 = (buffer: Float32Array): ArrayBuffer => {
		const l = buffer.length
		const pcm = new Int16Array(l)
		for (let i = 0; i < l; i++) {
			const s = Math.max(-1, Math.min(1, buffer[i]))
			pcm[i] = s < 0 ? s * 0x8000 : s * 0x7fff
		}
		return pcm.buffer
	}

	const handleStartAnswering = useCallback(async () => {
		try {
			const ws = wsRef.current
			if (!ws || !ws.isConnected()) {
				setMediaError('WebSocket이 연결되지 않았습니다.')
				await connectWsAsync()
				return
			}

			const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
			setMediaStream(stream)

			const audioContext = new AudioContext({ sampleRate: 16000 })
			await audioContext.audioWorklet.addModule('/pcm-processor.js')
			const source = audioContext.createMediaStreamSource(stream)
			const workletNode = new AudioWorkletNode(audioContext, 'pcm-processor')
			workletNode.port.onmessage = event => {
				const inputData = event.data as Float32Array
				const pcmData = convertFloat32ToInt16(inputData)
				const blob = new Blob([pcmData], { type: 'audio/pcm' })
				if (ws.isConnected()) {
					ws.sendAudio(blob)
				}
			}
			source.connect(workletNode)
			workletNode.connect(audioContext.destination)

			audioContextRef.current = audioContext
			processorRef.current = workletNode

			setIsAnswering(true)
		} catch (err) {
			console.error(err)
			setMediaError('마이크 권한이 필요합니다.')
		}
	}, [wsRef])

	const stopAnswering = useCallback(() => {
		setIsAnswering(false)
		processorRef.current?.disconnect()
		audioContextRef.current?.close()
		processorRef.current = null
		audioContextRef.current = null

		if (mediaStream) {
			mediaStream.getTracks().forEach(track => track.stop())
			setMediaStream(null)
		}
	}, [])

	const value: RealtimeContextValue = {
		isAnswering,
		handleStartAnswering,
		stopAnswering,
		mediaError,
	}

	return (
		<RealtimeContext.Provider value={value}>
			{children}
		</RealtimeContext.Provider>
	)
}

export function useInterviewRealtime() {
	const ctx = useContext(RealtimeContext)
	if (!ctx)
		throw new Error(
			'useInterviewRealtime must be used within a RealtimeProvider'
		)
	return ctx
}
