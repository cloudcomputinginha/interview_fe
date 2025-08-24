'use client'

import { useState, useEffect, use, useRef } from 'react'
import { bootstrapInterview } from '@/interview/services/startInterview'
import { PollingStatus } from '@/interview/types'
import { useTeamSocket } from '@/interview/hooks/useTeamSocket'

import QuestionPanel from '@/interview/components/QuestionPanel'
import ParticipantsPanel from '@/interview/components/ParticipantPanel'
import { AudioIO } from '@/interview/components/AudioIO'
import { InterviewReady, InterviewProgressPanel } from './components'
import { useAutoPlayQuestionAudio } from '@/interview/hooks/useAutoPlayQuestionAudio'
import { useAutoPlayFollowUpAudio } from '@/interview/hooks/useAutoPlayFollowUpAudio'
import AudioOutlet from '@/interview/components/AudioOutlet'
import { useManySockets } from '@/interview/hooks/useManySockets'
import WsAudioProbe from '@/interview/components/WsAudioProbe'
import InterviewHeader from '@/interview/components/ui/InterviewHeader'
import VideoPanel from '@/interview/components/ui/video-panel/VideoPanel'

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

	const {
		team,
		status: socketStatus,
		advance,
	} = useTeamSocket(
		sessionsMap[String(minMemberInterviewId)] ?? '',
		String(myMemberInterviewId)
	)

	const { getRefByMember } = useManySockets(sessionsMap)

	const myId = String(myMemberInterviewId)
	const activeId = team?.activePid ?? ''

	const amActive = activeId === myId

	const autoplayEnabled =
		isReady && socketStatus === 'open' && status === 'complete'

	const sendRef = getRefByMember(myId)
	const playRef = getRefByMember(activeId)

	useAutoPlayQuestionAudio(sessionsMap, team ?? null, autoplayEnabled)

	const hydration = useAutoPlayFollowUpAudio(
		sessionsMap,
		team ?? null,
		autoplayEnabled
	)

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
			<div className="min-h-screen bg-gray-900 text-white flex flex-col">
				<InterviewHeader />

				<div className="flex-1 flex flex-col md:flex-row">
					<div className="flex-1 p-4 flex flex-col">
						<QuestionPanel
							activeMemberId={team?.activePid}
							sessionsMap={sessionsMap}
							team={team ?? null}
							followUpHydration={hydration}
						/>
						<VideoPanel
							sessionsMap={sessionsMap}
							team={team ?? null}
							myMemberInterviewId={String(myMemberInterviewId)}
						/>
					</div>
					<div className="w-full md:w-80 bg-gray-800 p-4 flex flex-col">
						<div className="md:col-span-1">
							<ParticipantsPanel
								sessionsMap={sessionsMap}
								activeMemberId={team?.activePid}
							/>
						</div>
						<InterviewProgressPanel
							team={team}
							onAdvance={advance}
							isMyTurn={amActive}
						/>
						{/* 다음 버튼 추가 */}
					</div>
				</div>
			</div>
			<AudioIO
				sendWsRef={sendRef}
				playWsRef={playRef}
				canSend={Boolean(sendRef.current) && amActive}
				canPlay={Boolean(playRef.current)}
			/>
			<WsAudioProbe wsRef={playRef} enabled={true} tag="ACTIVE-ROOM" />
			{autoplayEnabled && <AudioOutlet />}
		</>
	)
}
