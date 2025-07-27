import React, { useState, useEffect, useCallback } from 'react'
import type { InterviewSession } from '@/apis/types/interview-types'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useInterviewDetail } from './useInterviewDetail'
import { InterviewState } from '@/types/interview/interview'
import { useGenerateFinalReport } from './useGenerateFinalReport'
import { useSubmitAnswer } from './useSubmitAnswer'
import { useGenerateOrGetSession } from './useGenerateOrGetSession'
import { useAudioQueries } from './useAudioQueries'

interface UseInterviewSessionResult {
	session: InterviewSession | null
	currentQuestionIdx: number
	currentFollowUpIdx: number
	isLoading: boolean
	isQuestionLoading: boolean
	error: string | null
	audioUrlMap: Record<string, string>
	progressMessage: string | null
	handleMainAnswerSubmit: (answer: string, isText?: boolean) => Promise<void>
	handleFollowUpAnswerSubmit: (
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
	INIT: '안녕하세요,  Injob이 면접을 준비하고 있어요',
	FETCHING_INTERVIEW_DETAIL: '면접 정보를 불러오는 중이에요...',
	GENERATING_SESSION: '면접 세션을 생성하고 있어요...',
	PRELOADING_AUDIO: '면접관 음성을 준비하고 있어요...',
	INTERVIEW_READY: '면접을 시작하고 있어요...',
	INTERVIEW_FINISHED: '면접이 종료되었어요.',
}

export function useInterviewSession(interviewId: string) {
	// 통합된 상태 관리
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
		useInterviewDetail(interviewId)

	// 세션 생성 또는 조회
	const { handleGenerateOrGetSession } = useGenerateOrGetSession({
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

	// 오디오 로딩 상태 동기화
	useEffect(() => {
		if (interviewState.session && isAudioLoading) {
			setInterviewState(prev => ({
				...prev,
				isAudioPreloading: true,
				readyStatus: 'PRELOADING_AUDIO',
			}))
		} else if (
			interviewState.session &&
			!isAudioLoading &&
			audioProgress === 1
		) {
			setInterviewState(prev => ({
				...prev,
				isAudioPreloading: false,
				readyStatus: 'INTERVIEW_READY',
			}))
		}
	}, [interviewState.session, isAudioLoading, audioProgress])

	const { handleMainAnswerSubmit, handleFollowUpAnswerSubmit } =
		useSubmitAnswer({
			interviewState,
			setInterviewState,
			audioUrlMap,
			loadFollowUpAudios,
		})

	// 최종 리포트 생성
	const generateFinalReportMutation = useGenerateFinalReport({
		interviewState,
		setInterviewState,
	})

	// 초기화 로직
	useEffect(() => {
		async function init() {
			if (interviewDetailLoading) {
				setInterviewState(prev => ({
					...prev,
					isLoading: true,
					readyStatus: 'FETCHING_INTERVIEW_DETAIL',
				}))
				return
			}

			if (!interviewDetail) {
				toast.error('면접 정보를 불러오지 못했습니다.', {
					description: interviewDetailError?.message,
				})
				router.replace('/workspace/interviews')
				return
			}

			const memberInterviewId =
				interviewDetail?.result?.participants?.[0]?.memberInterviewId

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
	}, [interviewDetail, interviewDetailLoading, interviewDetailError])

	// 최종 리포트 생성 트리거
	useEffect(() => {
		const { session, currentQuestionIdx, isFinalReportLoading } = interviewState

		if (
			session?.qaFlow &&
			session.qaFlow.length > 0 &&
			currentQuestionIdx >= session.qaFlow.length &&
			!isFinalReportLoading &&
			!interviewState.finalReport
		) {
			setInterviewState(prev => ({
				...prev,
				isFinalReportLoading: true,
			}))
			generateFinalReportMutation.mutate()
		}
	}, [interviewState.currentQuestionIdx, interviewState.session])

	const setTimer = useCallback((value: React.SetStateAction<number>) => {
		setInterviewState(prev => ({
			...prev,
			timer: typeof value === 'function' ? value(prev.timer) : value,
		}))
	}, [])

	return {
		session: interviewState.session,
		currentQuestionIdx: interviewState.currentQuestionIdx,
		currentFollowUpIdx: interviewState.currentFollowUpIdx,
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
		handleMainAnswerSubmit,
		handleFollowUpAnswerSubmit,
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
