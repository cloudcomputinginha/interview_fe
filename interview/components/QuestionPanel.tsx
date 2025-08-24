// app/group/interview-session/components/QuestionPanel.tsx
'use client'

import { useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { useInterviewStore } from '@/interview/store/useInterviewStore'
import { EMPTY_STR_ARR } from '@/interview/utils/array'

export default function QuestionPanel({
	activeMemberId,
	sessionsMap,
	team,
	followUpHydration,
}: {
	activeMemberId?: string | null
	sessionsMap: Record<string, string>
	team: { index: number; fIndexCurrent: number } | null
	followUpHydration?: { hydrating: boolean; expected: number; current: number }
}) {
	const sessionId = activeMemberId ? sessionsMap[activeMemberId] : undefined
	const qIndex = team?.index ?? -1

	const selectQuestions = useCallback(
		(s: ReturnType<typeof useInterviewStore.getState>) =>
			sessionId ? (s.questions[sessionId] ?? EMPTY_STR_ARR) : EMPTY_STR_ARR,
		[sessionId]
	)
	const questions = useInterviewStore(selectQuestions)

	const selectFollowUps = useCallback(
		(s: ReturnType<typeof useInterviewStore.getState>) => {
			if (!sessionId || qIndex < 0) return EMPTY_STR_ARR
			return s.followUpQuestions[sessionId]?.[qIndex] ?? EMPTY_STR_ARR
		},
		[sessionId, qIndex]
	)
	const followUps = useInterviewStore(selectFollowUps)

	const currentQ = useMemo(
		() => (qIndex >= 0 ? questions[qIndex] : undefined),
		[questions, qIndex]
	)

	const fuGenerating =
		!!team &&
		(followUpHydration?.hydrating ||
			(!!followUpHydration?.expected &&
				(followUpHydration.current ?? 0) < followUpHydration.expected))

	// 현재 표시할 질문 결정
	const currentQuestionToShow = useMemo(() => {
		if (!team || qIndex < 0 || !currentQ) return null

		// 꼬리질문이 있고 현재 꼬리질문 인덱스가 유효한 경우
		if (
			followUps.length > 0 &&
			team.fIndexCurrent >= 0 &&
			team.fIndexCurrent < followUps.length
		) {
			return {
				type: 'followUp' as const,
				text: followUps[team.fIndexCurrent],
				number: `Q${qIndex + 1}-${team.fIndexCurrent + 1}`,
				isActive: true,
			}
		}

		// 메인 질문 표시
		return {
			type: 'main' as const,
			text: currentQ,
			number: `Q${qIndex + 1}`,
			isActive: true,
		}
	}, [team, qIndex, currentQ, followUps])

	return (
		<div className="space-y-4">
			<AnimatePresence mode="wait">
				{!team ? (
					<motion.div
						key="waiting"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.3 }}
						className="bg-gray-800 p-4 rounded-lg min-h-[120px] flex items-center justify-center"
					>
						<div className="text-sm text-gray-400">팀 상태 대기…</div>
					</motion.div>
				) : qIndex < 0 || !currentQ ? (
					<motion.div
						key="loading"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.3 }}
						className="bg-gray-800 p-4 rounded-lg min-h-[120px] flex items-center justify-center"
					>
						<div className="text-sm text-gray-400 mr-2">
							질문을 불러오는 중...
						</div>
						<Loader2 className="animate-spin w-6 h-6 text-[#8FD694]" />
					</motion.div>
				) : fuGenerating ? (
					<motion.div
						key="generating"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.3 }}
						className="bg-gray-800 p-4 rounded-lg min-h-[120px] flex items-center justify-center"
					>
						<div className="text-sm text-gray-400 mr-2">
							꼬리질문을 생성하고 있습니다...
						</div>
						<Loader2 className="animate-spin w-6 h-6 text-[#8FD694]" />
					</motion.div>
				) : currentQuestionToShow ? (
					<motion.div
						key={currentQuestionToShow.number}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.3 }}
						className={`p-4 rounded-lg min-h-[120px] flex flex-col justify-center ${
							currentQuestionToShow.type === 'main'
								? 'bg-gray-800 border-l-4 border-blue-500'
								: 'bg-gray-800 border-l-4 border-[#8FD694]'
						}`}
					>
						<div className="flex items-center text-sm text-gray-400 mb-2">
							<span className="font-medium">
								{currentQuestionToShow.number}
							</span>
						</div>
						<p className="text-lg font-medium text-gray-100">
							{currentQuestionToShow.text}
						</p>
					</motion.div>
				) : (
					<motion.div
						key="no-question"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.3 }}
						className="bg-gray-800 p-4 rounded-lg min-h-[120px] flex items-center justify-center"
					>
						<div className="text-sm text-gray-400">질문이 없습니다</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}
