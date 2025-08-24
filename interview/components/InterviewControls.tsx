// app/group/interview-session/components/InterviewControls.tsx
'use client'

import { useState, useCallback } from 'react'
import { ensureFollowUps } from '@/interview/services/sessionSync'

export default function InterviewControls({
	sessionId,
	activeMemberId,
	myMemberId,
	team,
	onAdvance,
}: {
	sessionId: string
	activeMemberId?: string | null
	myMemberId: string
	team: { index: number; fIndexCurrent: number } | null
	onAdvance: () => void
}) {
	const [loadingFU, setLoadingFU] = useState(false)
	const isMyTurn = activeMemberId === myMemberId
	const disabled = !isMyTurn || !team || loadingFU

	const handleAdvance = useCallback(async () => {
		if (!team) return
		// 메인(-1)에서 f0로 넘어가는 첫 advance 전에 팔로우업 보장
		if (team.fIndexCurrent === -1) {
			setLoadingFU(true)
			try {
				await ensureFollowUps(sessionId, team.index)
			} finally {
				setLoadingFU(false)
			}
		}
		onAdvance()
	}, [sessionId, team, onAdvance])

	return (
		<div className="flex items-center gap-3">
			<button
				onClick={handleAdvance}
				disabled={disabled}
				className={`px-4 py-2 rounded text-white transition-colors ${
					disabled
						? 'bg-gray-300 cursor-not-allowed'
						: 'bg-blue-600 hover:bg-blue-700'
				}`}
			>
				다음 단계로
			</button>
			{loadingFU && (
				<span className="text-sm text-gray-600 animate-pulse">
					꼬리질문 생성 중… ⏳
				</span>
			)}
			{!isMyTurn && (
				<span className="text-sm text-gray-500">내 차례가 아닙니다</span>
			)}
		</div>
	)
}
