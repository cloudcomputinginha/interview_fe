import { useCallback, useEffect, useRef, useState } from 'react'
import { AIInterviewSocket } from '@/apis/ai-interview-socket'
import { useInterviewSession } from './useInterviewSession'

const emptyResult = {
	isStarted: false,
	voiceAnswerText: '',
	setVoiceAnswerText: () => {},
	isProcessing: true,
	setIsProcessing: () => {},
	connectWsAsync: () => Promise.resolve(false),
	wsRef: null,
}

export const useInterviewWebSocket = (
	sessionCtx: ReturnType<typeof useInterviewSession>
) => {
	const [isStarted, setIsStarted] = useState(false)
	const [voiceAnswerText, setVoiceAnswerText] = useState('')
	const [isProcessing, setIsProcessing] = useState(true)

	const wsRef = useRef<AIInterviewSocket | null>(null)
	const connectionParamsRef = useRef<{
		interviewId: string
		memberInterviewId: string
		qIndex: number
		fIndex: number
		sessionId: string
	} | null>(null)

	const connectWs = useCallback(() => {
		if (!isStarted) return
		if (
			sessionCtx.session &&
			typeof sessionCtx.currentQuestionIdx === 'number' &&
			typeof sessionCtx.currentFollowUpIdx === 'number'
		) {
			// 연결 파라미터가 변경된 경우에만 재연결
			const newParams = {
				interviewId: sessionCtx.session.interviewId,
				memberInterviewId: sessionCtx.session.memberInterviewId,
				qIndex: sessionCtx.currentQuestionIdx,
				fIndex: sessionCtx.currentFollowUpIdx,
				sessionId: sessionCtx.session.sessionId,
			}

			const currentParams = connectionParamsRef.current
			if (
				!currentParams ||
				currentParams.interviewId !== newParams.interviewId ||
				currentParams.memberInterviewId !== newParams.memberInterviewId ||
				currentParams.qIndex !== newParams.qIndex ||
				currentParams.fIndex !== newParams.fIndex ||
				currentParams.sessionId !== newParams.sessionId
			) {
				console.log('WebSocket 연결 파라미터 변경, 재연결')
				wsRef.current?.disconnect()
				wsRef.current = new AIInterviewSocket()
				wsRef.current.connect(
					newParams.interviewId,
					newParams.memberInterviewId,
					newParams.qIndex,
					newParams.fIndex,
					newParams.sessionId
				)
				connectionParamsRef.current = newParams
			}
		}
	}, [
		isStarted,
		sessionCtx.session?.interviewId,
		sessionCtx.session?.memberInterviewId,
		sessionCtx.currentQuestionIdx,
		sessionCtx.currentFollowUpIdx,
		sessionCtx.session?.sessionId,
	])

	const connectWsAsync = useCallback(async () => {
		if (!isStarted) return false
		if (
			sessionCtx.session &&
			typeof sessionCtx.currentQuestionIdx === 'number' &&
			typeof sessionCtx.currentFollowUpIdx === 'number'
		) {
			return new Promise<boolean>((resolve, reject) => {
				try {
					if (!sessionCtx.session) {
						reject(new Error('session is not found'))
						return
					}

					connectWs()

					// 연결 상태 확인을 위한 타이머
					let attempts = 0
					const maxAttempts = 50 // 5초 (100ms * 50)

					const checkConnection = () => {
						attempts++
						if (wsRef.current?.isConnected()) {
							console.log('WebSocket 연결 성공 확인')
							resolve(true)
						} else if (attempts >= maxAttempts) {
							console.error('WebSocket 연결 시간 초과')
							reject(new Error('WebSocket 연결 시간 초과'))
						} else {
							setTimeout(checkConnection, 100)
						}
					}

					checkConnection()
				} catch (e) {
					console.error('WebSocket 연결 에러:', e)
					reject(e)
				}
			})
		}
		return false
	}, [isStarted, connectWs])

	// isStarted가 변경될 때만 WebSocket 연결 관리
	useEffect(() => {
		if (isStarted) {
			connectWs()
		} else {
			wsRef.current?.disconnect()
			connectionParamsRef.current = null
		}
	}, [isStarted, connectWs])

	// 메시지 핸들러 설정
	useEffect(() => {
		wsRef.current?.onMessage(data => {
			if (data.text) {
				setVoiceAnswerText(prev => prev + data.text)
				setIsProcessing(false)
			}
			if (data.status === 'processing') {
				setIsProcessing(true)
			}
			if (data.status === 'end') {
				setIsProcessing(false)
			}
		})

		return () => {
			wsRef.current?.disconnect()
		}
	}, []) // 의존성 배열을 비워서 한 번만 실행

	if (!sessionCtx.session)
		return {
			isStarted: false,
			setIsStarted: () => {},
			voiceAnswerText: '',
			setVoiceAnswerText: () => {},
			isProcessing: true,
			setIsProcessing: () => {},
			connectWsAsync: () => Promise.resolve(false),
			wsRef: null,
		}

	return {
		isStarted,
		setIsStarted,
		voiceAnswerText,
		setVoiceAnswerText,
		isProcessing,
		setIsProcessing,
		connectWsAsync,
		wsRef,
	}
}
