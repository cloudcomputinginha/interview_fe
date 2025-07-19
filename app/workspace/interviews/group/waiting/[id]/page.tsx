'use client'

import { useState, useEffect, useRef, useCallback, use } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Clock, AlertCircle, Info } from 'lucide-react'
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useQuery } from '@tanstack/react-query'
import { getGroupInterviewDetail } from '@/api/interview'
import { useRouter } from 'next/navigation'
import { useMemberSession } from '@/components/member-session-context'
import { useWaitingRoomSocket } from '@/utils/socket/use-waiting-room-socket'
import { Badge } from '@/components/ui/badge'
import { Users, User, Brain } from 'lucide-react'
import { formatCountdownString } from '@/utils/date/convertAllDate'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { CheckCircle } from 'lucide-react'

export default function InterviewWaitingRoomPage({
	params,
}: {
	params: Promise<{ id: string }>
}) {
	const { id: interviewId } = use(params) as { id: string }
	const { memberId } = useMemberSession()
	const { participants, error: socketError } = useWaitingRoomSocket(
		Number(interviewId),
		Number(memberId)
	)
	const [countdown, setCountdown] = useState<{
		minutes: number
		seconds: number
	}>({ minutes: 5, seconds: 0 })
	const [isStarting, setIsStarting] = useState(false)
	const [progressValue, setProgressValue] = useState(0)
	const timerRef = useRef<NodeJS.Timeout | null>(null)
	const router = useRouter()

	const { data: interview } = useQuery({
		queryKey: ['interview', interviewId],
		queryFn: () => getGroupInterviewDetail(Number(interviewId)),
		select: data => data.result,
		enabled: !!interviewId,
	})

	const isHost =
		interview?.groupInterviewParticipants?.find(p => p.host)?.memberId ===
		memberId

	// 인터뷰 시간으로 이미 종료된 면접인지, 아닌지 판단하기
	if (interview?.startedAt && new Date(interview.startedAt) < new Date()) {
		alert('이미 시작된 면접이거나, 종료된 면접입니다.')
		router.replace('/workspace/interviews')
		return
	}

	useEffect(() => {
		if (socketError) {
			alert(socketError)
			if (socketError === '해당하는 사용자 인터뷰를 찾을 수 없습니다.') {
				router.replace('/workspace/interviews')
			}

			if (socketError === '인터뷰가 이미 시작되어 입장할 수 없습니다.') {
				router.replace('/workspace/interviews')
			} else {
				console.error(socketError)
			}
		}
	}, [socketError])

	// Calculate countdown to interview start
	useEffect(() => {
		if (!interview?.startedAt) return

		const calculateCountdown = () => {
			const now = new Date()
			const difference = interview?.startedAt
				? new Date(interview.startedAt).getTime() - now.getTime()
				: 0

			if (difference <= 0) {
				// Time to start the interview
				if (timerRef.current) {
					clearInterval(timerRef.current)
				}
				startInterview()
				return
			}

			const minutes = Math.floor(difference / (1000 * 60))
			const seconds = Math.floor((difference % (1000 * 60)) / 1000)
			setCountdown({ minutes, seconds })

			// Calculate progress for the progress bar (inverse)
			// Assuming the waiting room opens 10 minutes before the interview
			const totalWaitTime = 10 * 60 * 1000 // 10 minutes in milliseconds
			const elapsed = totalWaitTime - difference
			const progressPercentage = Math.min(
				100,
				Math.max(0, (elapsed / totalWaitTime) * 100)
			)
			setProgressValue(progressPercentage)
		}

		calculateCountdown()
		timerRef.current = setInterval(calculateCountdown, 1000) // Update every second

		return () => {
			if (timerRef.current) {
				clearInterval(timerRef.current)
			}
		}
	}, [interview?.startedAt]) // 빈 의존성 배열 사용 (컴포넌트 마운트 시 한 번만 실행)

	// 면접 시작 함수 수정
	const startInterview = useCallback(() => {
		// 참가자가 없으면 시작 불가
		if (participants?.length === 0) {
			alert('참가자가 없어 면접을 시작할 수 없습니다.')
			return
		}

		setIsStarting(true)

		// Show transition screen for 3 seconds
		setTimeout(() => {
			// Redirect to the interview session
			window.location.href = '/workspace/interview/group/session'
		}, 3000)
	}, [participants?.length])

	const handleEarlyStart = () => {
		if (!isHost) {
			alert('면접 호스트만 면접을 시작할 수 있습니다.')
			return
		}

		if (
			confirm(
				'면접을 지금 시작하시겠습니까? 모든 참가자에게 알림이 전송됩니다.'
			)
		) {
			startInterview()
		}
	}

	// Format time for display
	function formatTime(minutes: number, seconds: number) {
		return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
	}

	// If the interview is starting, show transition screen
	if (isStarting) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="w-16 h-16 rounded-full bg-[#8FD694] bg-opacity-20 flex items-center justify-center mx-auto mb-4">
						<Clock className="h-8 w-8 text-[#8FD694]" />
					</div>
					<h1 className="text-2xl font-bold mb-2">면접이 시작됩니다...</h1>
					<p className="text-gray-600">잠시만 기다려주세요.</p>
					<div className="mt-6 w-64 mx-auto">
						<Progress value={progressValue} className="h-2" />
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-4xl mx-auto p-6">
				{/* Header */}
				<div className="mb-8">
					<Link
						href="/workspace/interviews"
						className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
					>
						<ArrowLeft className="h-4 w-4 mr-1" /> 내 면접으로 돌아가기
					</Link>
					<h1 className="text-2xl font-bold">{interview?.name ?? '-'}</h1>
					<div className="text-gray-600 mt-2 text-sm">
						<div className="mb-1">{interview?.description ?? ''}</div>
						<div className="flex flex-wrap gap-2 mt-2 items-center">
							{/* 면접 형태 뱃지들 */}
							{interview?.interviewType && (
								<Badge variant="secondary" className="flex items-center gap-1">
									<Brain className="h-3 w-3 mr-1 text-[#8FD694]" />
									{interview?.interviewType === 'PERSONALITY'
										? '인성 면접'
										: interview?.interviewType === 'TECHNICAL'
											? '기술 면접'
											: '-'}
								</Badge>
							)}
							{interview?.maxParticipants === 1 ? (
								<Badge variant="outline" className="flex items-center gap-1">
									<User className="h-3 w-3 mr-1 text-gray-400" />
									개인 면접
								</Badge>
							) : (
								<Badge variant="outline" className="flex items-center gap-1">
									<Users className="h-3 w-3 mr-1 text-gray-400" />
									그룹 면접
								</Badge>
							)}
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{/* Countdown Card */}
					<div className="md:col-span-2">
						<Card className="h-full">
							<CardHeader>
								<CardTitle>면접 시작</CardTitle>
							</CardHeader>
							<CardContent className="flex flex-col items-center justify-center py-8">
								<div className="w-24 h-24 rounded-full bg-[#8FD694] bg-opacity-20 flex items-center justify-center mb-6">
									<Clock className="h-12 w-12 text-[#8FD694]" />
								</div>
								<div className="text-4xl font-bold mb-4">
									{formatCountdownString(
										countdown.minutes * 60 + countdown.seconds
									)}
								</div>
								<div className="flex items-center gap-1 text-gray-400 mb-4">
									<Clock className="h-3 w-3 mr-1" />
									시작시간:{' '}
									{interview?.startedAt
										? new Date(interview.startedAt).toLocaleString('ko-KR')
										: '-'}
								</div>
								<Progress
									value={progressValue}
									className="w-full max-w-md h-2"
								/>
							</CardContent>
							<CardFooter className="flex justify-center border-t pt-6">
								<Button
									className={`bg-[#8FD694] hover:bg-[#7ac47f] text-white ${!isHost ? 'opacity-50 cursor-not-allowed' : ''}`}
									onClick={handleEarlyStart}
								>
									지금 시작하기
								</Button>
							</CardFooter>
						</Card>
					</div>

					{/* Participants Card */}
					<div>
						<Card className="h-full">
							<CardHeader>
								<CardTitle>참여자 목록</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{interview?.groupInterviewParticipants &&
									interview.groupInterviewParticipants.length > 0 ? (
										interview.groupInterviewParticipants.map(p => {
											const isEntered =
												typeof p.memberId === 'number' &&
												participants?.includes(p.memberId)
											return (
												<div
													key={p.memberId}
													className="flex items-center justify-between"
												>
													<div className="flex items-center">
														<Avatar className="h-8 w-8 mr-3">
															<AvatarFallback className="bg-[#8FD694] text-white">
																{p.name?.charAt(0)}
															</AvatarFallback>
														</Avatar>
														<span>{p.name}</span>
													</div>
													<div className="flex items-center">
														{p.host && (
															<Badge className="bg-[#8FD694] hover:bg-[#8FD694] mr-2">
																호스트
															</Badge>
														)}
														{isEntered ? (
															<div className="flex items-center text-[#8FD694]">
																<CheckCircle className="h-4 w-4 mr-1" />
																<span className="text-xs">입장</span>
															</div>
														) : (
															<div className="flex items-center text-gray-400">
																<CheckCircle className="h-4 w-4 mr-1" />
																<span className="text-xs">미입장</span>
															</div>
														)}
													</div>
												</div>
											)
										})
									) : (
										<div className="text-center py-4 text-gray-500">
											<p>아직 참가자가 없습니다.</p>
										</div>
									)}
								</div>
							</CardContent>
							<CardFooter className="border-t pt-4">
								<div className="w-full text-center text-sm text-gray-500">
									<AlertCircle className="inline-block h-4 w-4 mr-1" />
									모든 참가자가 입장해야 면접이 시작됩니다.
								</div>
							</CardFooter>
						</Card>
					</div>
				</div>

				{/* Info Card */}
				<Card className="mt-6 bg-blue-50 border-blue-100">
					<CardContent className="p-4">
						<div className="flex items-start">
							<Info className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
							<div>
								<h3 className="font-medium text-blue-700">면접 준비 안내</h3>
								<ul className="text-blue-600 text-sm mt-2 space-y-1 list-disc pl-5">
									<li>카메라와 마이크가 정상적으로 작동하는지 확인해주세요.</li>
									<li>조용한 환경에서 면접에 참여해주세요.</li>
									<li>
										면접 시작 전에 자기소개서와 이력서를 다시 한번 검토해보세요.
									</li>
									<li>면접은 예정된 시간에 자동으로 시작됩니다.</li>
								</ul>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
