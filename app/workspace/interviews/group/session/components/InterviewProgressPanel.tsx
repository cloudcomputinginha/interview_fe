'use client'

import { useState, useEffect, useCallback } from 'react'
import { Progress } from '@/components/ui/progress'

interface InterviewProgressPanelProps {
	team: {
		index: number
		fIndexCurrent: number
		order: string[]
	} | null
	onAdvance: () => void
	isMyTurn: boolean
}

export default function InterviewProgressPanel({
	team,
	onAdvance,
	isMyTurn,
}: InterviewProgressPanelProps) {
	const [timer, setTimer] = useState(120) // 2분 타이머
	const [isTimerActive, setIsTimerActive] = useState(false)

	// 현재 질문 인덱스 계산
	const currentQuestionIdx = team?.index ?? 0
	const totalQuestions = team?.order?.length ?? 0
	const isFollowUp = team?.fIndexCurrent !== -1

	// 타이머 포맷팅 함수
	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60)
		const secs = seconds % 60
		return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
	}

	// 타이머 시작/정지 토글
	const toggleTimer = useCallback(() => {
		setIsTimerActive(prev => !prev)
	}, [])

	// 타이머 리셋
	const resetTimer = useCallback(() => {
		setTimer(120)
		setIsTimerActive(false)
	}, [])

	// 타이머가 끝나면 자동으로 advance
	useEffect(() => {
		if (timer <= 0 && isTimerActive) {
			setIsTimerActive(false)
			onAdvance()
			resetTimer()
		}
	}, [timer, isTimerActive, onAdvance, resetTimer])

	// 타이머 카운트다운
	useEffect(() => {
		if (!isTimerActive || timer <= 0) return

		const interval = setInterval(() => {
			setTimer(prev => prev - 1)
		}, 1000)

		return () => clearInterval(interval)
	}, [isTimerActive, timer])

	// 내 차례가 되면 자동으로 타이머 시작
	useEffect(() => {
		if (isMyTurn && !isTimerActive) {
			setIsTimerActive(true)
		} else if (!isMyTurn && isTimerActive) {
			setIsTimerActive(false)
		}
	}, [isMyTurn, isTimerActive])

	// 질문이 변경되면 타이머 리셋
	useEffect(() => {
		resetTimer()
	}, [currentQuestionIdx, team?.fIndexCurrent, resetTimer])

	// 진행률 계산 (꼬리질문 포함)
	const progressValue =
		totalQuestions > 0 ? ((currentQuestionIdx + 1) / totalQuestions) * 100 : 0

	// 타이머 진행률 계산
	const timerProgress = (timer / 120) * 100

	return (
		<div className="space-y-6">
			{/* 진행 상황 */}
			<div className="mb-6">
				<div className="flex justify-between items-center mb-2">
					<span className="text-sm text-gray-400">진행 상황</span>
					<span className="text-sm font-medium">
						{currentQuestionIdx + 1}/{totalQuestions}
						{isFollowUp && team && ` (꼬리질문 ${team.fIndexCurrent + 1})`}
					</span>
				</div>
				<Progress value={progressValue} className="h-2 bg-gray-700" />
			</div>

			{/* 타이머 */}
			<div className="mb-6">
				<div className="flex justify-between items-center mb-2">
					<span className="text-sm text-gray-400">남은 시간</span>
					<span
						className={`text-sm font-medium ${
							timer < 30 ? 'text-red-400' : ''
						}`}
					>
						{formatTime(timer)}
					</span>
				</div>
				<div className="w-full bg-gray-700 h-1 rounded-full overflow-hidden">
					<div
						className={`h-full ${timer < 30 ? 'bg-red-500' : 'bg-[#8FD694]'}`}
						style={{ width: `${timerProgress}%` }}
					></div>
				</div>

				{/* 타이머 컨트롤 */}
				<div className="flex gap-2 mt-3">
					<button
						onClick={toggleTimer}
						disabled={!isMyTurn}
						className={`px-3 py-1 text-xs rounded transition-colors ${
							isTimerActive
								? 'bg-red-600 hover:bg-red-700 text-white'
								: 'bg-[#8FD694] hover:bg-[#7ac47f] text-white'
						} ${!isMyTurn ? 'opacity-50 cursor-not-allowed' : ''}`}
					>
						{isTimerActive ? '일시정지' : '시작'}
					</button>
					<button
						onClick={resetTimer}
						disabled={!isMyTurn}
						className={`px-3 py-1 text-xs rounded bg-gray-600 hover:bg-gray-700 text-white transition-colors ${
							!isMyTurn ? 'opacity-50 cursor-not-allowed' : ''
						}`}
					>
						리셋
					</button>
				</div>
			</div>

			{/* 상태 표시 */}
			<div className="bg-gray-700 rounded-lg p-4">
				{!isTimerActive ? (
					<div className="flex items-center">
						<div className="w-2 h-2 rounded-full bg-gray-400 mr-2"></div>
						<p className="text-sm text-gray-300">
							{isMyTurn
								? '타이머를 시작하여 답변 시간을 관리하세요.'
								: '다른 참가자의 차례입니다.'}
						</p>
					</div>
				) : timer > 0 ? (
					<div className="flex items-center">
						<div className="w-2 h-2 rounded-full bg-[#8FD694] mr-2 animate-pulse"></div>
						<p className="text-sm text-[#8FD694]">
							답변 중입니다. 시간이 끝나면 자동으로 다음 단계로 넘어갑니다.
						</p>
					</div>
				) : (
					<div className="flex items-center">
						<div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
						<p className="text-sm text-red-400">
							답변 시간이 종료되었습니다. 자동으로 다음 단계로 넘어갑니다.
						</p>
					</div>
				)}
			</div>
		</div>
	)
}
