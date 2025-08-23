// app/group/interview-session/components/QuestionPanel.tsx
'use client'

import { useCallback, useMemo } from 'react'
import { useInterviewStore } from '@/interview/store/useInterviewStore'
import { EMPTY_STR_ARR } from '@/interview/utils/array'

export default function QuestionPanel({
	activeMemberId,
	sessionsMap,
	team,
}: {
	activeMemberId?: string | null
	sessionsMap: Record<string, string>
	team: { index: number; fIndexCurrent: number } | null
}) {
	const sessionId = activeMemberId ? sessionsMap[activeMemberId] : undefined
	const qIndex = team?.index ?? -1

	// ✅ selector는 useCallback으로 고정 + 빈배열은 상수 레퍼런스
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
		!!team && team.fIndexCurrent >= 0 && followUps.length === 0

	return (
		<div className="space-y-3">
			<div>
				<h2 className="text-lg font-semibold mb-2">현재 질문</h2>
				{qIndex >= 0 && currentQ ? (
					<div className="p-3 rounded border bg-white">
						<div className="text-sm text-gray-500 mb-1">Q{qIndex + 1}</div>
						<div className="font-medium">{currentQ}</div>
					</div>
				) : (
					<div className="p-3 rounded border bg-white text-gray-500">
						{team ? '질문을 불러오는 중…' : '팀 상태 대기…'}
					</div>
				)}
			</div>

			<div>
				<h3 className="text-base font-semibold mb-2">꼬리질문</h3>
				{fuGenerating && (
					<div className="text-sm text-gray-500 animate-pulse">생성 중… ⏳</div>
				)}
				{followUps.length > 0 ? (
					<ol className="list-decimal pl-5 space-y-1">
						{followUps.map((f, i) => (
							<li
								key={i}
								className={team?.fIndexCurrent === i ? 'font-semibold' : ''}
							>
								{f}
							</li>
						))}
					</ol>
				) : !fuGenerating ? (
					<div className="text-sm text-gray-500">아직 없음</div>
				) : null}
			</div>
		</div>
	)
}
