'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function MultiSessionTestPage() {
	const [sessionId, setSessionId] = useState('test_session_123')
	const [participantId, setParticipantId] = useState('participant_1')
	const [isStarted, setIsStarted] = useState(false)
	const [interviewId, setInterviewId] = useState('1')
	if (!isStarted) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
				<Card className="w-96 bg-gray-800 border-gray-700">
					<CardHeader>
						<CardTitle className="text-white">멀티 세션 테스트</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<Label htmlFor="sessionId" className="text-white">
								세션 ID
							</Label>
							<Input
								id="sessionId"
								value={sessionId}
								onChange={e => setSessionId(e.target.value)}
								className="bg-gray-700 border-gray-600 text-white"
							/>
						</div>
						<div>
							<Label htmlFor="participantId" className="text-white">
								참가자 ID
							</Label>
							<Input
								id="participantId"
								value={participantId}
								onChange={e => setParticipantId(e.target.value)}
								className="bg-gray-700 border-gray-600 text-white"
							/>
						</div>
						<div>
							<Label htmlFor="interviewId" className="text-white">
								면접 ID
							</Label>
							<Input
								id="interviewId"
								value={interviewId}
								onChange={e => setInterviewId(e.target.value)}
								className="bg-gray-700 border-gray-600 text-white"
							/>
						</div>
						<Button
							onClick={() => setIsStarted(true)}
							className="w-full bg-[#8FD694] hover:bg-[#7ac47f]"
						>
							테스트 시작
						</Button>
					</CardContent>
				</Card>
			</div>
		)
	}

	// URL 파라미터로 테스트 페이지로 이동
	const testUrl = `/workspace/interviews/group/session/${interviewId ?? 1}?sessionId=${sessionId}&participantId=${participantId}`
	window.location.href = testUrl

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
			<div className="text-center">
				<div className="text-xl mb-4">테스트 페이지로 이동 중...</div>
				<div className="text-sm text-gray-400">
					세션: {sessionId}
					<br />
					참가자: {participantId}
				</div>
			</div>
		</div>
	)
}
