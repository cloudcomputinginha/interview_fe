import { useState, useEffect, useCallback } from 'react'
import { MultiSessionMessage } from '@/apis/ai-interview-multi-socket'

interface Participant {
	id: string
	name: string
	isActive: boolean
	isMuted: boolean
}

interface MultiSessionState {
	sessionId: string
	participants: Participant[]
	currentIndex: number
	currentActivePid: number | null
	participantFIndex: Record<string, number>
	isFinished: boolean
	isLoading: boolean
	error: string | null
}

interface UseInterviewMultiSessionProps {
	sessionId: string
	participantId: number
	initialParticipants?: Participant[]
}

interface UseInterviewMultiSessionResult {
	state: MultiSessionState
	setParticipants: (participants: Participant[]) => void
	setActiveParticipant: (participantId: number) => void
	advanceTurn: () => void
	isCurrentParticipantActive: (participantId: number) => boolean
	getCurrentParticipantFIndex: (participantId: number) => number
	handleStateUpdate: (serverState: MultiSessionMessage) => void
}

export function useInterviewMultiSession({
	sessionId,
	participantId,
	initialParticipants = [],
}: UseInterviewMultiSessionProps): UseInterviewMultiSessionResult {
	const [state, setState] = useState<MultiSessionState>({
		sessionId,
		participants: initialParticipants,
		currentIndex: 0,
		currentActivePid: null,
		participantFIndex: {},
		isFinished: false,
		isLoading: false,
		error: null,
	})

	const setParticipants = useCallback((participants: Participant[]) => {
		setState(prev => ({
			...prev,
			participants,
		}))
	}, [])

	const setActiveParticipant = useCallback((participantId: number) => {
		setState(prev => ({
			...prev,
			currentActivePid: participantId,
			participants: prev.participants.map(p => ({
				...p,
				isActive: p.id === participantId.toString(),
			})),
		}))
	}, [])

	const advanceTurn = useCallback(() => {}, [])

	const isCurrentParticipantActive = (participantId: number) =>
		Number(state.currentActivePid) === participantId

	const getCurrentParticipantFIndex = (participantId: number) =>
		state.participantFIndex[participantId] || -1

	const handleStateUpdate = useCallback((serverState: MultiSessionMessage) => {
		console.log('📨 서버 상태 업데이트 수신:', serverState)

		setState(prev => {
			const updates: Partial<MultiSessionState> = {}
			let hasChanges = false

			if (
				serverState.index !== undefined &&
				serverState.index !== prev.currentIndex
			) {
				console.log(
					`🔄 질문 인덱스 변경: ${prev.currentIndex} → ${serverState.index}`
				)
				updates.currentIndex = serverState.index
				hasChanges = true
			}

			// 활성 참가자 변경 확인
			if (
				serverState.active_pid !== undefined &&
				serverState.active_pid !== prev.currentActivePid
			) {
				console.log(
					`🔄 활성 참가자 변경: ${prev.currentActivePid} → ${serverState.active_pid}`
				)
				updates.currentActivePid = serverState.active_pid
				// 참가자 활성 상태 업데이트
				updates.participants = prev.participants.map(p => ({
					...p,
					isActive: p.id === serverState.active_pid,
				}))
				hasChanges = true
			}

			// 참가자별 꼬리질문 인덱스 업데이트
			if (serverState.participant_f_index) {
				const prevFIndex = prev.participantFIndex
				const newFIndex = serverState.participant_f_index

				// 변경사항이 있는지 확인
				const hasFIndexChanges = Object.keys(newFIndex).some(
					key => prevFIndex[key] !== newFIndex[key]
				)

				if (hasFIndexChanges) {
					console.log('🔄 참가자별 꼬리질문 인덱스 업데이트:', {
						이전: prevFIndex,
						새로운: newFIndex,
					})
					updates.participantFIndex = newFIndex
					hasChanges = true
				}
			}

			// 참가자 순서 업데이트
			if (serverState.order) {
				console.log('🔄 참가자 순서 업데이트:', serverState.order)
				// order에 따라 참가자 순서 업데이트
				updates.participants = prev.participants.map(p => ({
					...p,
					isActive: p.id === serverState.active_pid,
				}))
				hasChanges = true
			}

			// 면접 종료 확인
			if (serverState.type === 'finished') {
				console.log('🏁 면접 종료')
				updates.isFinished = true
				hasChanges = true
			}

			// 변경사항이 없으면 기존 상태 반환
			if (!hasChanges) {
				console.log('ℹ️ 상태 변경사항 없음')
				return prev
			}

			const newState = {
				...prev,
				...updates,
			}

			console.log('✅ 상태 업데이트 완료:', {
				currentIndex: newState.currentIndex,
				currentActivePid: newState.currentActivePid,
				participantFIndex: newState.participantFIndex,
				isFinished: newState.isFinished,
			})

			return newState
		})
	}, [])

	return {
		state,
		setParticipants,
		setActiveParticipant,
		advanceTurn,
		isCurrentParticipantActive,
		getCurrentParticipantFIndex,
		handleStateUpdate,
	}
}
