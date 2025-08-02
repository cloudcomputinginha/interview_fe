import { useCallback, useEffect, useRef, useState } from 'react'
import {
	AIInterviewMultiSocket,
	MultiSessionMessage,
} from '@/apis/ai-interview-multi-socket'

interface UseInterviewMultiWebSocketProps {
	sessionId: string
	participantId: string
	onStateUpdate?: (state: MultiSessionMessage) => void
	onSttText?: (
		text: string,
		participantId: string,
		index: number,
		fIndex: number
	) => void
	onFinished?: () => void
}

interface UseInterviewMultiWebSocketResult {
	isConnected: boolean
	connectWsAsync: () => Promise<boolean>
	disconnect: () => void
	sendAudio: (audioBlob: Blob) => void
	sendControl: (message: any) => void
	wsRef: React.MutableRefObject<AIInterviewMultiSocket | null>
	lastCloseCode: number | null
}

export function useInterviewMultiWebSocket({
	sessionId,
	participantId,
	onStateUpdate,
	onSttText,
	onFinished,
}: UseInterviewMultiWebSocketProps): UseInterviewMultiWebSocketResult {
	const [isConnected, setIsConnected] = useState(false)
	const [lastCloseCode, setLastCloseCode] = useState<number | null>(null)
	const wsRef = useRef<AIInterviewMultiSocket | null>(null)

	const connectWs = useCallback(() => {
		if (!sessionId || !participantId) return

		console.log('멀티 세션 WebSocket 연결 시도:', { sessionId, participantId })
		wsRef.current?.disconnect()
		wsRef.current = new AIInterviewMultiSocket()

		// 종료 코드 추적을 위한 핸들러 설정
		wsRef.current.onClose((code, reason) => {
			console.log(`멀티 세션 WebSocket 종료 코드 추적: ${code} - ${reason}`)
			setLastCloseCode(code)
			setIsConnected(false)
		})

		// 메시지 핸들러 설정
		wsRef.current.onMessage((data: MultiSessionMessage) => {
			console.log('멀티 세션 WebSocket 메시지 수신:', data)

			switch (data.type) {
				case 'state':
					onStateUpdate?.(data)
					break
				case 'stt_text':
					if (
						data.text &&
						data.participant_id &&
						typeof data.index === 'number' &&
						typeof data.f_index === 'number'
					) {
						onSttText?.(
							data.text,
							data.participant_id,
							data.index,
							data.f_index
						)
					}
					break
				case 'finished':
					onFinished?.()
					break
				default:
					console.log('알 수 없는 메시지 타입:', data.type)
			}
		})

		wsRef.current.connectMulti(sessionId, participantId, 'team')
	}, [sessionId, participantId, onStateUpdate, onSttText, onFinished])

	const connectWsAsync = useCallback(async () => {
		if (!sessionId || !participantId) return false

		return new Promise<boolean>((resolve, reject) => {
			try {
				connectWs()

				// 연결 상태 확인을 위한 타이머
				let attempts = 0
				const maxAttempts = 50 // 5초 (100ms * 50)

				const checkConnection = () => {
					attempts++
					if (wsRef.current?.isConnected()) {
						console.log('멀티 세션 WebSocket 연결 성공 확인')
						setIsConnected(true)
						resolve(true)
					} else if (attempts >= maxAttempts) {
						console.error('멀티 세션 WebSocket 연결 시간 초과')
						reject(new Error('멀티 세션 WebSocket 연결 시간 초과'))
					} else {
						setTimeout(checkConnection, 100)
					}
				}

				checkConnection()
			} catch (e) {
				console.error('멀티 세션 WebSocket 연결 에러:', e)
				reject(e)
			}
		})
	}, [sessionId, participantId, connectWs])

	const disconnect = useCallback(() => {
		wsRef.current?.disconnect()
		setIsConnected(false)
	}, [])

	const sendAudio = useCallback((audioBlob: Blob) => {
		wsRef.current?.sendAudio(audioBlob)
	}, [])

	const sendControl = useCallback((message: any) => {
		wsRef.current?.sendControl(message)
	}, [])

	// 컴포넌트 언마운트 시 정리
	useEffect(() => {
		return () => {
			wsRef.current?.disconnect()
		}
	}, [])

	return {
		isConnected,
		connectWsAsync,
		disconnect,
		sendAudio,
		sendControl,
		wsRef,
		lastCloseCode,
	}
}
