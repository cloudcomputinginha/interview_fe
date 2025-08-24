import React, { useState, useEffect, useCallback } from 'react'
import type { InterviewSession } from '@/apis/types/interview-types'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useMultiSessionInterviewDetail } from './useMultiSessionInterviewDetail'
import { InterviewState } from '@/types/interview/interview'
import { useGenerateFinalReport } from './useGenerateFinalReport'
import { useSubmitMultiSessionAnswer } from './useSubmitMultiSessionAnswer'
import { useGenerateOrGetMultiSession } from './useGenerateOrGetMultiSession'
import { useAudioQueries } from './useAudioQueries'

interface UseMultiSessionInterviewResult {
	session: InterviewSession | null
	currentQuestionIdx: number
	currentFollowUpIdx: number
	isLoading: boolean
	isQuestionLoading: boolean
	error: string | null
	audioUrlMap: Record<string, string>
	progressMessage: string | null
	handleMultiSessionMainAnswerSubmit: (
		answer: string,
		isText?: boolean
	) => Promise<void>
	handleMultiSessionFollowUpAnswerSubmit: (
		answer: string,
		isText?: boolean
	) => Promise<void>
	isFeedbackLoading: boolean
	isFinalReportLoading: boolean
	finalReport: any
	timer: number
	setTimer: React.Dispatch<React.SetStateAction<number>>
	isAudioPreloading: boolean
	audioProgress: number
	playAudio: (key: string) => HTMLAudioElement | null
	loadFollowUpAudios: (questionIdx: number) => Promise<Record<string, string>>
	isAudioLoaded: (key: string) => boolean
	isAudioLoading: (key: string) => boolean
	isQuestionAudioLoaded: (questionIdx: number) => boolean
}

const readyStatusMessageMap: Record<
	Exclude<InterviewState['readyStatus'], 'ERROR'>,
	string
> = {
	INIT: '안녕하세요, 멀티 세션 면접을 준비하고 있어요',
	FETCHING_INTERVIEW_DETAIL: '멀티 세션 면접 정보를 불러오는 중이에요...',
	GENERATING_SESSION: '멀티 세션을 생성하고 있어요...',
	PRELOADING_AUDIO: '면접관 음성을 준비하고 있어요...',
	INTERVIEW_READY: '멀티 세션 면접을 시작하고 있어요...',
	INTERVIEW_FINISHED: '멀티 세션 면접이 종료되었어요.',
}

export function useMultiSessionInterview(
	interviewId: string,
	participantId: number,
	sessionCtx?: {
		state: { currentIndex: number; participantFIndex: Record<string, number> }
	}
) {
	const [interviewState, setInterviewState] = useState<InterviewState>({
		session: null,
		currentQuestionIdx: 0,
		currentFollowUpIdx: -1,
		readyStatus: 'INIT',
		isLoading: true,
		isQuestionLoading: false,
		error: null,
		isAudioPreloading: false,
		isFeedbackLoading: false,
		isFinalReportLoading: false,
		finalReport: null,
		timer: 120,
	})

	const router = useRouter()

	// 면접 상세 정보 조회
	const { interviewDetail, interviewDetailLoading, interviewDetailError } =
		useMultiSessionInterviewDetail(interviewId)

	// 세션 생성 또는 조회
	const { handleGenerateOrGetSession } = useGenerateOrGetMultiSession({
		interviewId,
		interviewState,
		setInterviewState,
	})

	// 오디오 프리로딩을 useQueries로 관리
	const {
		audioUrlMap,
		isLoading: isAudioLoading,
		progress: audioProgress,
		playAudio,
		loadFollowUpAudios,
		isAudioLoaded,
		isAudioLoading: isSpecificAudioLoading,
		isQuestionAudioLoaded,
	} = useAudioQueries({
		qaFlow: interviewState.session?.qaFlow || [],
	})

	// 답변 제출 관련 훅
	const {
		handleMultiSessionMainAnswerSubmit,
		handleMultiSessionFollowUpAnswerSubmit,
	} = useSubmitMultiSessionAnswer({
		interviewState,
		setInterviewState,
		audioUrlMap,
		loadFollowUpAudios,
		participantId: participantId.toString(),
	})

	// 최종 리포트 생성
	const generateFinalReportMutation = useGenerateFinalReport({
		interviewState,
		setInterviewState,
	})

	// 서버의 index와 동기화 - 서버 상태를 우선으로 사용
	useEffect(() => {
		if (sessionCtx?.state?.currentIndex !== undefined) {
			const serverIndex = sessionCtx.state.currentIndex
			const serverParticipantFIndex =
				sessionCtx.state.participantFIndex[participantId.toString()] || -1

			console.log('서버 상태와 동기화:', {
				기존_질문: interviewState.currentQuestionIdx,
				서버_질문: serverIndex,
				기존_꼬리질문: interviewState.currentFollowUpIdx,
				서버_꼬리질문: serverParticipantFIndex,
			})

			// 서버 상태가 로컬 상태와 다를 때만 업데이트
			if (
				interviewState.currentQuestionIdx !== serverIndex ||
				interviewState.currentFollowUpIdx !== serverParticipantFIndex
			) {
				setInterviewState(prev => ({
					...prev,
					currentQuestionIdx: serverIndex,
					currentFollowUpIdx: serverParticipantFIndex,
				}))
			}
		}
	}, [
		sessionCtx?.state?.currentIndex,
		sessionCtx?.state?.participantFIndex,
		participantId,
	])

	// 로딩 상태 동기화
	useEffect(() => {
		setInterviewState(prev => ({
			...prev,
			isAudioPreloading: isAudioLoading,
		}))
	}, [isAudioLoading])

	// 초기화 로직
	useEffect(() => {
		async function init() {
			console.log('멀티 세션 초기화:', { interviewId, participantId })

			if (!interviewId) {
				console.error('interviewId가 없습니다.')
				toast.error('면접 ID가 없습니다.')
				router.replace('/workspace/interviews')
				return
			}

			if (interviewDetailLoading) {
				setInterviewState(prev => ({
					...prev,
					isLoading: true,
					readyStatus: 'FETCHING_INTERVIEW_DETAIL',
				}))
				return
			}

			if (!interviewDetail) {
				toast.error('멀티 세션 면접 정보를 불러오지 못했습니다.', {
					description: interviewDetailError?.message,
				})
				router.replace('/workspace/interviews')
				return
			}

			// 멀티 세션에서는 participantId를 그대로 사용
			const memberInterviewId = participantId.toString()

			if (!memberInterviewId) {
				toast.error('참가자 정보를 찾을 수 없습니다.')
				router.replace('/workspace/interviews')
				return
			}

			setInterviewState(prev => ({
				...prev,
				readyStatus: 'GENERATING_SESSION',
			}))

			// 세션 생성 또는 조회
			await handleGenerateOrGetSession(memberInterviewId, interviewDetail)
		}

		init()
	}, [
		interviewId,
		interviewDetail,
		interviewDetailLoading,
		interviewDetailError,
		participantId,
	])

	// 최종 리포트 생성 트리거 - 서버 상태 기반으로 수정
	useEffect(() => {
		const { session } = interviewState
		const serverQuestionIdx = sessionCtx?.state?.currentIndex || 0

		if (
			session?.qaFlow &&
			session.qaFlow.length > 0 &&
			serverQuestionIdx >= session.qaFlow.length &&
			!interviewState.isFinalReportLoading &&
			!interviewState.finalReport
		) {
			console.log('최종 리포트 생성 트리거:', {
				서버_질문_인덱스: serverQuestionIdx,
				총_질문_수: session.qaFlow.length,
			})
			setInterviewState(prev => ({
				...prev,
				isFinalReportLoading: true,
			}))
			generateFinalReportMutation.mutate()
		}
	}, [sessionCtx?.state?.currentIndex, interviewState.session])

	const setTimer = useCallback((value: React.SetStateAction<number>) => {
		setInterviewState(prev => ({
			...prev,
			timer: typeof value === 'function' ? value(prev.timer) : value,
		}))
	}, [])

	// 서버 상태를 우선으로 하는 currentQuestionIdx와 currentFollowUpIdx 반환
	const currentQuestionIdx =
		sessionCtx?.state?.currentIndex ?? interviewState.currentQuestionIdx
	const currentFollowUpIdx =
		sessionCtx?.state?.participantFIndex?.[participantId] ??
		interviewState.currentFollowUpIdx

	return {
		session: interviewState.session,
		currentQuestionIdx,
		currentFollowUpIdx,
		isLoading: interviewState.isLoading,
		isQuestionLoading: interviewState.isQuestionLoading,
		error: interviewState.error,
		audioUrlMap,
		progressMessage:
			readyStatusMessageMap[
				interviewState.readyStatus as Exclude<
					InterviewState['readyStatus'],
					'ERROR'
				>
			],
		handleMultiSessionMainAnswerSubmit,
		handleMultiSessionFollowUpAnswerSubmit,
		isFeedbackLoading: interviewState.isFeedbackLoading,
		isFinalReportLoading: interviewState.isFinalReportLoading,
		finalReport: interviewState.finalReport,
		timer: interviewState.timer,
		setTimer,
		isAudioPreloading: interviewState.isAudioPreloading,
		audioProgress,
		playAudio,
		loadFollowUpAudios,
		isAudioLoaded,
		isAudioLoading: isSpecificAudioLoading,
		isQuestionAudioLoaded,
	}
}
