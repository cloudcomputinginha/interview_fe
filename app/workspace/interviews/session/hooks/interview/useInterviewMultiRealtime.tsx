import React, {
	createContext,
	useContext,
	useState,
	useRef,
	useCallback,
	useEffect,
} from 'react'
import { AIInterviewMultiSocket } from '@/apis/ai-interview-multi-socket'

interface MultiRealtimeContextValue {
	isAnswering: boolean
	handleStartAnswering: () => Promise<void> | void
	stopAnswering: () => void
	mediaError: string | null
	isWsConnected: boolean
}

const MultiRealtimeContext = createContext<
	MultiRealtimeContextValue | undefined
>(undefined)

interface MultiRealtimeProviderProps {
	children: React.ReactNode
	wsRef: React.MutableRefObject<AIInterviewMultiSocket | null> | null
	connectWsAsync: () => Promise<unknown>
	wsCloseCode?: number | null
}

export function MultiRealtimeProvider({
	children,
	wsRef,
	connectWsAsync,
	wsCloseCode,
}: MultiRealtimeProviderProps) {
	const [isAnswering, setIsAnswering] = useState(false)
	const [mediaError, setMediaError] = useState<string | null>(null)
	const [isWsConnected, setIsWsConnected] = useState(false)
	const mediaRecorderRef = useRef<MediaRecorder | null>(null)
	const streamRef = useRef<MediaStream | null>(null)

	const handleStartAnswering = useCallback(async () => {
		try {
			// WebSocket 연결 확인
			if (!wsRef?.current?.isConnected()) {
				console.log('WebSocket 연결 시도 중...')
				await connectWsAsync()
			}

			// 미디어 스트림 가져오기
			const stream = await navigator.mediaDevices.getUserMedia({
				audio: {
					sampleRate: 16000,
					channelCount: 1,
					echoCancellation: true,
					noiseSuppression: true,
				},
			})

			streamRef.current = stream
			setMediaError(null)

			// MediaRecorder 설정
			const mediaRecorder = new MediaRecorder(stream, {
				mimeType: 'audio/webm;codecs=opus',
			})

			mediaRecorderRef.current = mediaRecorder

			// 오디오 데이터 처리
			mediaRecorder.ondataavailable = event => {
				if (event.data.size > 0 && wsRef?.current?.isConnected()) {
					wsRef.current.sendAudio(event.data)
				}
			}

			// 녹음 시작
			mediaRecorder.start(100) // 100ms마다 데이터 전송
			setIsAnswering(true)
			setIsWsConnected(true)

			console.log('멀티 세션 답변 시작')
		} catch (error) {
			console.error('멀티 세션 답변 시작 실패:', error)
			setMediaError(
				error instanceof Error
					? error.message
					: '마이크 접근 권한이 필요합니다.'
			)
		}
	}, [wsRef, connectWsAsync])

	const stopAnswering = useCallback(() => {
		if (
			mediaRecorderRef.current &&
			mediaRecorderRef.current.state !== 'inactive'
		) {
			mediaRecorderRef.current.stop()
		}

		if (streamRef.current) {
			streamRef.current.getTracks().forEach(track => track.stop())
			streamRef.current = null
		}

		setIsAnswering(false)
		console.log('멀티 세션 답변 중지')
	}, [])

	// WebSocket 연결 상태 모니터링
	useEffect(() => {
		if (wsRef?.current) {
			const checkConnection = () => {
				const connected = wsRef.current?.isConnected() || false
				setIsWsConnected(connected)
			}

			// 초기 연결 상태 확인
			checkConnection()

			// 주기적으로 연결 상태 확인
			const interval = setInterval(checkConnection, 1000)
			return () => clearInterval(interval)
		}
	}, [wsRef])

	// 컴포넌트 언마운트 시 정리
	useEffect(() => {
		return () => {
			stopAnswering()
		}
	}, [stopAnswering])

	return (
		<MultiRealtimeContext.Provider
			value={{
				isAnswering,
				handleStartAnswering,
				stopAnswering,
				mediaError,
				isWsConnected,
			}}
		>
			{children}
		</MultiRealtimeContext.Provider>
	)
}

export function useInterviewMultiRealtime() {
	const context = useContext(MultiRealtimeContext)
	if (context === undefined) {
		throw new Error(
			'useInterviewMultiRealtime must be used within a MultiRealtimeProvider'
		)
	}
	return context
}
