// app/group/interview-session/page.tsx
'use client'

import { useState, useEffect, use, useRef } from 'react'
import { bootstrapInterview } from '@/interview/services/startInterview'
import { PollingStatus } from '@/interview/types'
import { useTeamSocket } from '@/interview/hooks/useTeamSocket'

import InterviewStatusBar from '@/interview/components/InterviewStatusBar'
import InterviewControls from '@/interview/components/InterviewControls'
import QuestionPanel from '@/interview/components/QuestionPanel'
import ParticipantsPanel from '@/interview/components/ParticipantPanel'
import { AudioIO } from '@/interview/components/AudioIO'
import InterviewReady from '@/app/workspace/interviews/group/session/components/InterviewReady'
import { useAutoHydrateFollowUps } from '@/interview/hooks/useAutoHydrateFollowUps'

export default function GroupInterviewSessionPage({
	searchParams,
}: {
	searchParams: Promise<{ interviewId: string; myMemberInterviewId: string }>
}) {
	const { interviewId, myMemberInterviewId } = use(searchParams)
	const [sessionId, setSessionId] = useState<string | null>(null)
	const [sessionsMap, setSessionsMap] = useState<Record<string, string>>({})
	const [minMemberInterviewId, setMinMemberInterviewId] = useState<
		number | null
	>(null)
	const [status, setStatus] = useState<PollingStatus>('initial')
	const [isReady, setIsReady] = useState(false)
	const initRef = useRef(false)

	// 부트스트랩 1회
	useEffect(() => {
		if (initRef.current) return
		initRef.current = true
		;(async () => {
			try {
				const { sessions } = await bootstrapInterview(
					Number(interviewId),
					Number(myMemberInterviewId),
					newStatus => setStatus(newStatus)
				)
				setSessionsMap(sessions)
				setSessionId(sessions[String(myMemberInterviewId)])
				setMinMemberInterviewId(Math.min(...Object.keys(sessions).map(Number)))
			} catch (e) {
				console.error('[bootstrapInterview] failed', e)
				setStatus('failed')
			}
		})().catch(e => {
			console.error('[bootstrapInterview] unhandled promise rejection', e)
			setStatus('failed')
		})
	}, [interviewId, myMemberInterviewId])

	// team 소켓: 최소 멤버의 session으로 상태 공유(서버 제약 상)
	const {
		team,
		status: socketStatus,
		advance,
		wsRef,
	} = useTeamSocket(
		sessionsMap[String(minMemberInterviewId)] ?? '',
		String(myMemberInterviewId)
	)

	const amActive = team?.activePid === String(myMemberInterviewId)

	const hydration = useAutoHydrateFollowUps(sessionsMap, team ?? null, {
		intervalMs: 1000,
		maxAttempts: 12, // 12초까지 시도 (원하면 조절)
	})

	if (!isReady || status !== 'complete' || socketStatus !== 'open') {
		return (
			<InterviewReady
				status={status}
				socketStatus={socketStatus}
				onReady={() => setIsReady(true)}
			/>
		)
	}

	return (
		<>
			{amActive && <AudioIO wsRef={wsRef} canSend={true} canPlay={true} />}

			<div className="p-6">
				<div className="max-w-5xl mx-auto space-y-6">
					<div className="flex items-center justify-between">
						<h1 className="text-2xl font-bold">그룹 인터뷰 세션</h1>
						<InterviewStatusBar
							pollingStatus={status}
							socketStatus={socketStatus}
							isMyTurn={amActive}
						/>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div className="md:col-span-2 space-y-6">
							<div className="bg-white rounded-lg shadow p-6">
								<div className="grid grid-cols-2 gap-4 text-sm mb-4">
									<div>
										<span className="font-medium">인터뷰 ID:</span>{' '}
										{interviewId}
									</div>
									<div>
										<span className="font-medium">내 참가자 ID:</span>{' '}
										{myMemberInterviewId}
									</div>
									<div>
										<span className="font-medium">내 세션 ID:</span> {sessionId}
									</div>
									<div>
										<span className="font-medium">활성 참가자:</span>{' '}
										{team?.activePid || '없음'}
									</div>
									<div>
										<span className="font-medium">현재 질문 인덱스:</span>{' '}
										{team?.index ?? '-'}
									</div>
									<div>
										<span className="font-medium">현재 F 인덱스:</span>{' '}
										{team?.fIndexCurrent ?? '-'}
									</div>
								</div>

								<QuestionPanel
									activeMemberId={team?.activePid}
									sessionsMap={sessionsMap}
									team={team ?? null}
									followUpHydration={hydration}
								/>

								<div className="mt-6 pt-6 border-t">
									<h3 className="text-lg font-semibold mb-3">인터뷰 컨트롤</h3>
									<InterviewControls
										sessionId={sessionsMap[String(team?.activePid ?? '')] ?? ''}
										activeMemberId={team?.activePid}
										myMemberId={String(myMemberInterviewId)}
										team={team ?? null}
										onAdvance={advance}
									/>
								</div>
							</div>
						</div>

						<div className="md:col-span-1">
							<ParticipantsPanel
								sessionsMap={sessionsMap}
								activeMemberId={team?.activePid}
							/>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
