'use client'
import React from 'react'
import AICard from './AICard'
import ParticipantCard from './ParticipantCard'

type Props = {
	sessionsMap: Record<string, string>
	team: any
	myMemberInterviewId: string
}

const VideoPanel = ({ sessionsMap, team, myMemberInterviewId }: Props) => {
	return (
		<div className="grid md:grid-cols-2 gap-4 mt-4">
			<AICard />
			{Object.keys(sessionsMap).map(memberId => {
				const isActive = team?.activePid === memberId
				const isMe = memberId === String(myMemberInterviewId)

				return (
					<ParticipantCard
						key={memberId}
						memberId={memberId}
						isActive={isActive}
						isMe={isMe}
						team={team}
					/>
				)
			})}
		</div>
	)
}

export default VideoPanel
