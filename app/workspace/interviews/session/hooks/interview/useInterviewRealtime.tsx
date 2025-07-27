import React, {
	createContext,
	useContext,
	useState,
	useRef,
	useCallback,
	useEffect,
} from 'react'
import { AIInterviewSocket } from '@/apis/ai-interview-socket'

interface RealtimeContextValue {
	isAnswering: boolean
	handleStartAnswering: () => Promise<void> | void
	stopAnswering: () => void
	mediaError: string | null
	isWsConnected: boolean
}

const RealtimeContext = createContext<RealtimeContextValue | undefined>(
	undefined
)

interface RealtimeProviderProps {
	children: React.ReactNode
	wsRef: React.MutableRefObject<AIInterviewSocket | null> | null
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
	const [isWsConnected, setIsWsConnected] = useState(false)

	const audioContextRef = useRef<AudioContext | null>(null)
	const processorRef = useRef<ScriptProcessorNode | AudioWorkletNode | null>(
		null
	)
	const audioProcessingRef = useRef(false)

	const convertFloat32ToInt16 = (buffer: Float32Array): ArrayBuffer => {
		const l = buffer.length
		const pcm = new Int16Array(l)
		for (let i = 0; i < l; i++) {
			const s = Math.max(-1, Math.min(1, buffer[i]))
			pcm[i] = s < 0 ? s * 0x8000 : s * 0x7fff
		}
		return pcm.buffer
	}

	// WebSocket 연결 상태 모니터링
	useEffect(() => {
		const checkConnection = () => {
			const ws = wsRef?.current
			const connected = ws?.isConnected() || false
			setIsWsConnected(connected)

			// 연결이 끊어지면 오디오 처리 중단
			if (!connected && audioProcessingRef.current) {
				console.log('WebSocket 연결 끊어짐, 오디오 처리 중단')
				audioProcessingRef.current = false
			}
		}

		// 초기 상태 확인
		checkConnection()

		// 주기적으로 연결 상태 확인 (1초마다)
		const interval = setInterval(checkConnection, 1000)

		return () => clearInterval(interval)
	}, [wsRef])

	// WebSocket 연결 끊어짐 시 자동 재연결 시도
	useEffect(() => {
		if (!isWsConnected && isAnswering) {
			console.log('WebSocket 연결 끊어짐, 자동 재연결 시도')
			const reconnectTimer = setTimeout(async () => {
				try {
					await connectWsAsync()
					console.log('WebSocket 자동 재연결 성공')
				} catch (error) {
					console.error('WebSocket 자동 재연결 실패:', error)
					// 서버 오류인 경우 사용자에게 알림
					if (error instanceof Error && error.message.includes('시간 초과')) {
						setMediaError(
							'서버 연결에 문제가 있습니다. 잠시 후 다시 시도해주세요.'
						)
					}
				}
			}, 3000) // 3초 후 재연결 시도 (서버 오류이므로 더 긴 대기 시간)

			return () => clearTimeout(reconnectTimer)
		}
	}, [isWsConnected, isAnswering, connectWsAsync])

	const handleStartAnswering = useCallback(async () => {
		try {
			const ws = wsRef?.current
			if (!ws || !ws.isConnected()) {
				console.log('WebSocket 연결 시도 중...')
				setMediaError('WebSocket이 연결되지 않았습니다.')
				try {
					await connectWsAsync()
					// 연결 후 다시 확인
					if (!wsRef?.current?.isConnected()) {
						setMediaError('WebSocket 연결에 실패했습니다.')
						return
					}
				} catch (error) {
					console.error('WebSocket 연결 실패:', error)
					setMediaError('WebSocket 연결에 실패했습니다.')
					return
				}
			}

			console.log('handleStartAnswering - WebSocket 연결 확인됨')
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
			setMediaStream(stream)

			const audioContext = new AudioContext({ sampleRate: 16000 })
			await audioContext.audioWorklet.addModule('/pcm-processor.js')
			const source = audioContext.createMediaStreamSource(stream)
			const workletNode = new AudioWorkletNode(audioContext, 'pcm-processor')

			workletNode.port.onmessage = event => {
				// WebSocket 연결 상태 확인
				const currentWs = wsRef?.current
				if (!currentWs || !currentWs.isConnected()) {
					console.warn('WebSocket 연결 끊어짐, 오디오 처리 중단')
					audioProcessingRef.current = false
					return
				}

				// 오디오 처리 중단 플래그 확인
				if (!audioProcessingRef.current) {
					return
				}

				const inputData = event.data as Float32Array
				const pcmData = convertFloat32ToInt16(inputData)
				const blob = new Blob([pcmData], { type: 'audio/pcm' })

				try {
					currentWs.sendAudio(blob)
				} catch (error) {
					console.error('오디오 전송 에러:', error)
					audioProcessingRef.current = false
				}
			}

			source.connect(workletNode)
			workletNode.connect(audioContext.destination)

			audioContextRef.current = audioContext
			processorRef.current = workletNode
			audioProcessingRef.current = true

			setIsAnswering(true)
			setMediaError(null) // 성공 시 에러 메시지 제거
		} catch (err) {
			console.error('handleStartAnswering 에러:', err)
			setMediaError('마이크 권한이 필요합니다.')
		}
	}, [wsRef, connectWsAsync])

	const stopAnswering = useCallback(() => {
		console.log('답변 중단')
		setIsAnswering(false)
		audioProcessingRef.current = false

		processorRef.current?.disconnect()
		audioContextRef.current?.close()
		processorRef.current = null
		audioContextRef.current = null

		if (mediaStream) {
			mediaStream.getTracks().forEach(track => track.stop())
			setMediaStream(null)
		}
	}, [mediaStream])

	const value: RealtimeContextValue = {
		isAnswering,
		handleStartAnswering,
		stopAnswering,
		mediaError,
		isWsConnected,
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
