import { useCallback, useEffect, useRef, useState } from 'react'
import { InterviewState } from '@/types/interview/interview'
import { AIInterviewSocket } from '@/apis/ai-interview-socket'

const emptyResult = {
	isStarted: false,
	voiceAnswerText: '',
	setVoiceAnswerText: () => {},
	isProcessing: true,
	setIsProcessing: () => {},
	connectWsAsync: () => Promise.resolve(false),
	wsRef: null,
}

export const useInterviewWebSocket = (sessionCtx: InterviewState | null) => {
	if (!sessionCtx)
		return {
			isStarted: false,
			setIsStarted: () => {},
			voiceAnswerText: '',
			setVoiceAnswerText: () => {},
			isProcessing: true,
			setIsProcessing: () => {},
			connectWsAsync: () => Promise.resolve(false),
		}

	const [isStarted, setIsStarted] = useState(false)
	const [voiceAnswerText, setVoiceAnswerText] = useState('')
	const [isProcessing, setIsProcessing] = useState(true)

	const wsRef = useRef<AIInterviewSocket | null>(null)

	const connectWs = useCallback(() => {
		if (!isStarted) return
		if (
			sessionCtx.session &&
			typeof sessionCtx.currentQuestionIdx === 'number' &&
			typeof sessionCtx.currentFollowUpIdx === 'number'
		) {
			wsRef.current = new AIInterviewSocket()
			wsRef.current.connect(
				sessionCtx.session.interviewId,
				sessionCtx.session.memberInterviewId,
				sessionCtx.currentQuestionIdx,
				sessionCtx.currentFollowUpIdx,
				sessionCtx.session.sessionId
			)
		}
	}, [
		isStarted,
		sessionCtx.session?.sessionId,
		sessionCtx.currentQuestionIdx,
		sessionCtx.currentFollowUpIdx,
	])

	const connectWsAsync = useCallback(async () => {
		if (!isStarted) return
		if (
			sessionCtx.session &&
			typeof sessionCtx.currentQuestionIdx === 'number' &&
			typeof sessionCtx.currentFollowUpIdx === 'number'
		) {
			return new Promise((resolve, reject) => {
				wsRef.current = new AIInterviewSocket()
				try {
					if (!sessionCtx.session) throw new Error('session is not found')
					wsRef.current.connect(
						sessionCtx.session.interviewId,
						sessionCtx.session.memberInterviewId,
						sessionCtx.currentQuestionIdx,
						sessionCtx.currentFollowUpIdx,
						sessionCtx.session.sessionId
					)
					resolve(true)
				} catch (e) {
					reject(e)
				}
			})
		}
	}, [
		isStarted,
		sessionCtx.session,
		sessionCtx.currentQuestionIdx,
		sessionCtx.currentFollowUpIdx,
	])

	useEffect(() => {
		if (!isStarted) return
		if (
			sessionCtx.session &&
			typeof sessionCtx.currentQuestionIdx === 'number' &&
			typeof sessionCtx.currentFollowUpIdx === 'number'
		) {
			connectWs()
		}
	}, [
		isStarted,
		sessionCtx.session?.sessionId,
		sessionCtx.currentQuestionIdx,
		sessionCtx.currentFollowUpIdx,
	])

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
	}, [
		isStarted,
		sessionCtx.session?.sessionId,
		sessionCtx.currentQuestionIdx,
		sessionCtx.currentFollowUpIdx,
	])

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
