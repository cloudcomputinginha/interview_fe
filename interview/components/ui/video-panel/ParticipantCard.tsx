'use client'
import React from 'react'

type Props = {
	memberId: string
	isActive: boolean
	isMe: boolean
	team: any
}

const ParticipantCard = ({ memberId, isActive, isMe, team }: Props) => {
	return (
		<div
			key={memberId}
			className={`flex-1 min-w-[200px] bg-gray-800 rounded-lg flex flex-col items-center justify-center relative p-4 ${
				isActive ? 'ring-2 ring-blue-500' : ''
			}`}
		>
			<div className="absolute top-3 left-3 bg-gray-900/50 px-2 py-1 rounded text-xs">
				{isMe ? '나' : `참가자 ${memberId}`}
			</div>

			{/* 활성 상태 표시 */}
			{isActive && (
				<div className="absolute top-3 right-3 bg-blue-500 px-2 py-1 rounded text-xs animate-pulse">
					진행중
				</div>
			)}

			{/* 참가자 아바타 */}
			<div
				className={`w-24 h-24 rounded-full flex items-center justify-center ${
					isMe ? 'bg-blue-600 bg-opacity-20' : 'bg-gray-600 bg-opacity-20'
				}`}
			>
				<span
					className={`text-4xl font-bold ${
						isMe ? 'text-blue-400' : 'text-gray-400'
					}`}
				>
					{isMe ? '나' : memberId}
				</span>
			</div>

			{/* 참가자 정보 */}
			<div className="mt-2 text-center">
				<div className="text-sm font-medium text-gray-300">
					{isMe ? '나' : `참가자 ${memberId}`}
				</div>
				<div className="text-xs text-gray-500">
					{isActive ? '답변 중' : '대기 중'}
				</div>
				{team?.participantFIndex &&
					team.participantFIndex[memberId] !== undefined && (
						<div className="text-xs text-gray-400 mt-1">
							꼬리질문: {team.participantFIndex[memberId] + 1}
						</div>
					)}
			</div>
		</div>
	)
}

export default ParticipantCard
