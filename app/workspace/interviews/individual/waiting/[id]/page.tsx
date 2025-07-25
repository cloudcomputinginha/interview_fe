'use client'

import { useState, useEffect, useRef, use } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Clock, User, Info } from 'lucide-react'
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useQuery } from '@tanstack/react-query'
import { getGroupInterviewDetail } from '@/apis/interview'
import { useRouter } from 'next/navigation'
import { formatCountdownString } from '@/utils/date/convertAllDate'
import LoadingSpinner from '@/components/loading'
import { toast } from 'sonner'

export default function IndividualInterviewWaitingRoomPage({
	params,
}: {
	params: Promise<{ id: string }>
}) {
	const { id: interviewId } = use(params) as { id: string }
	const [countdown, setCountdown] = useState<{
		minutes: number
		seconds: number
	}>({ minutes: 5, seconds: 0 })
	const [isStarting, setIsStarting] = useState(false)
	const [progressValue, setProgressValue] = useState(0)
	const timerRef = useRef<NodeJS.Timeout | null>(null)
	const router = useRouter()

	const {
		data: interview,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ['interview', interviewId],
		queryFn: () => getGroupInterviewDetail(Number(interviewId)),
		select: data => data.result,
		enabled: !!interviewId,
	})

	useEffect(() => {
		if (!interview?.startedAt) return
		const calculateCountdown = () => {
			const now = new Date()
			const difference = interview?.startedAt
				? new Date(interview.startedAt).getTime() - now.getTime()
				: 0
			if (difference <= 0) {
				if (timerRef.current) clearInterval(timerRef.current)
				startInterview()
				return
			}
			const minutes = Math.floor(difference / (1000 * 60))
			const seconds = Math.floor((difference % (1000 * 60)) / 1000)
			setCountdown({ minutes, seconds })
			const totalWaitTime = 10 * 60 * 1000
			const elapsed = totalWaitTime - difference
			const progressPercentage = Math.min(
				100,
				Math.max(0, (elapsed / totalWaitTime) * 100)
			)
			setProgressValue(progressPercentage)
		}
		calculateCountdown()
		timerRef.current = setInterval(calculateCountdown, 1000)
		return () => {
			if (timerRef.current) clearInterval(timerRef.current)
		}
	}, [interview?.startedAt])

	if (interview?.startedAt && new Date(interview.startedAt) < new Date()) {
		toast.error('이미 시작된 면접이거나, 종료된 면접입니다.')
		router.replace('/workspace/interviews')
		return null
	}

	const startInterview = () => {
		if (confirm('면접을 바로 시작하시겠습니까?')) {
			setIsStarting(true)
			setTimeout(() => {
				router.replace(`/workspace/interviews/session/${interviewId}`)
			}, 2000)
		}
	}

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gray-50 flex gap-2 items-center justify-center">
				<LoadingSpinner infoText="면접 정보를 불러오는 중이에요..." />
			</div>
		)
	}

	if (isError) {
		alert('면접 정보를 불러오는 중 오류가 발생했어요.')
		router.replace('/workspace/interviews')
		return null
	}

	if (isStarting) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="w-16 h-16 rounded-full bg-[#8FD694] bg-opacity-20 flex items-center justify-center mx-auto mb-4">
						<Clock className="h-8 w-8 text-[#8FD694]" />
					</div>
					<h1 className="text-2xl font-bold mb-2">면접이 곧 시작됩니다...</h1>
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
			<div className="max-w-2xl mx-auto p-6">
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
							<span className="flex items-center gap-1">
								<User className="h-3 w-3 mr-1 text-[#8FD694]" />
								{interview?.jobName ?? '-'}
							</span>
							<span className="flex items-center gap-1">
								<Clock className="h-3 w-3 mr-1 text-gray-400" />
								{interview?.startedAt
									? new Date(interview.startedAt).toLocaleString('ko-KR', {
											timeZone: undefined,
										})
									: '-'}
							</span>
						</div>
					</div>
				</div>

				<Card>
					<CardHeader>
						<CardTitle>면접 대기실</CardTitle>
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
						<span className="flex items-center gap-1 mb-4 text-gray-400">
							<Clock className="h-3 w-3 mr-1 text-gray-400" />
							{interview?.startedAt
								? new Date(interview.startedAt).toLocaleString('ko-KR', {
										timeZone: undefined,
									})
								: '-'}
						</span>
						<Progress value={progressValue} className="w-full max-w-md h-2" />
					</CardContent>
					<CardFooter className="flex justify-center border-t pt-6">
						<Button
							className="bg-[#8FD694] hover:bg-[#7ac47f] text-white"
							onClick={startInterview}
						>
							지금 시작하기
						</Button>
					</CardFooter>
				</Card>

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
