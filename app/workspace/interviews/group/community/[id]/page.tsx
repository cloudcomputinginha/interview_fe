'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Calendar, Clock, Users, ChevronRight } from 'lucide-react'
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { HeaderWithNotifications } from '@/components/header-with-notifications'
import { getGroupInterviewDetail } from '@/apis/interview'
import type { GroupInterviewDetailDTO } from '@/apis/types/interview-types'
import { useQuery } from '@tanstack/react-query'
import { useMemberSession } from '@/components/member-session-context'
import { use as usePromise } from 'react'
import LoadingSpinner from '@/components/loading'

export default function InterviewPostDetailPage({
	params,
}: {
	params: Promise<{ id: string }>
}) {
	const { id: postId } = usePromise(params)

	const { data, isLoading, error } = useQuery({
		queryKey: ['groupInterviewDetail', postId],
		queryFn: () => getGroupInterviewDetail(Number(postId)),
		retry: false,
	})
	const post: GroupInterviewDetailDTO | null = data?.result ?? null

	// 로그인 유저 정보
	const { memberId } = useMemberSession()
	// 호스트 판별: hostName(닉네임/이름) 비교만 사용
	const isHost = !!(
		memberId &&
		post &&
		post.hostName &&
		String(memberId) === post.hostName
	)

	const [timeLeft, setTimeLeft] = useState('')

	// 본인 신청 여부 확인
	const isAlreadyApplied = post?.groupInterviewParticipants?.some(
		p => p.memberId === memberId
	)

	// 에러 처리
	useEffect(() => {
		if (error) {
			window.location.href = '/workspace/interviews/group/community'
			alert(error.message)
		}
	}, [error])

	// 면접까지 남은 시간 계산
	useEffect(() => {
		if (!post?.startedAt) return
		const calculateTimeLeft = () => {
			const interviewDate = new Date(post.startedAt!)
			const now = new Date()
			const difference = interviewDate.getTime() - now.getTime()
			if (difference <= 0) {
				setTimeLeft('면접 시간이 지났습니다')
				return
			}
			const days = Math.floor(difference / (1000 * 60 * 60 * 24))
			const hours = Math.floor(
				(difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
			)
			const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
			if (days > 0) {
				setTimeLeft(`${days}일 ${hours}시간 남음`)
			} else if (hours > 0) {
				setTimeLeft(`${hours}시간 ${minutes}분 남음`)
			} else {
				setTimeLeft(`${minutes}분 남음`)
			}
		}
		calculateTimeLeft()
		const timer = setInterval(calculateTimeLeft, 60000)
		return () => clearInterval(timer)
	}, [post?.startedAt])

	function formatDate(dateString?: string) {
		if (!dateString) return ''
		const options: Intl.DateTimeFormatOptions = {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		}
		return new Date(dateString).toLocaleDateString('ko-KR', options)
	}

	const handleJoin = () => {
		window.location.href = `/workspace/interview/group/community/${postId}/join`
	}
	const handleCreateInterview = () => {
		window.location.href = `/workspace/interview/group/community/create`
	}

	// 추천 모집글 mock 유지
	const recommendedPosts = [
		{
			id: 3,
			title: '금융권 취업 준비 모임',
			field: '금융',
			date: '2023-06-15T10:00:00',
			currentParticipants: 3,
			maxParticipants: 5,
		},
		{
			id: 5,
			title: 'IT 대기업 기술면접 대비',
			field: '개발',
			date: '2023-06-14T16:00:00',
			currentParticipants: 2,
			maxParticipants: 5,
		},
	]

	if (isLoading || !post) return <LoadingSpinner />

	return (
		<>
			<HeaderWithNotifications />
			<div className="min-h-screen bg-gray-50">
				<div className="max-w-6xl mx-auto p-6">
					{/* Header */}
					<div className="mb-8">
						<Link
							href="/workspace/interview/group/community"
							className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
						>
							<ArrowLeft className="h-4 w-4 mr-1" /> 다대다 면접 모집으로
							돌아가기
						</Link>
						<h1 className="text-2xl font-bold">{post.name}</h1>
						<div className="flex flex-wrap items-center gap-2 mt-2">
							<Badge
								className={
									post.interviewType === 'TECHNICAL'
										? 'bg-blue-100 text-blue-800 hover:bg-blue-100'
										: 'bg-purple-100 text-purple-800 hover:bg-purple-100'
								}
							>
								{post.interviewType === 'TECHNICAL' ? '기술 면접' : '인성 면접'}
							</Badge>
							{post.jobName && (
								<Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
									{post.jobName}
								</Badge>
							)}
							{post.hostName && (
								<span className="text-gray-500 text-sm">
									• 작성자: <span className="font-medium">{post.hostName}</span>
								</span>
							)}
						</div>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
						{/* Main Content */}
						<div className="lg:col-span-2 space-y-6">
							{/* Interview Details */}
							<Card>
								<CardHeader>
									<CardTitle>면접 정보</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="flex items-start">
										<Calendar className="h-5 w-5 text-[#8FD694] mr-3 mt-0.5" />
										<div>
											<h3 className="font-medium">면접 일시</h3>
											<p className="text-gray-600">
												{formatDate(post.startedAt)}
											</p>
										</div>
									</div>
									<div className="flex items-start">
										<Clock className="h-5 w-5 text-[#8FD694] mr-3 mt-0.5" />
										<div>
											<h3 className="font-medium">남은 시간</h3>
											<p className="text-gray-600">{timeLeft}</p>
										</div>
									</div>
									<div className="flex items-start">
										<Users className="h-5 w-5 text-[#8FD694] mr-3 mt-0.5" />
										<div>
											<h3 className="font-medium">참여 인원</h3>
											<p className="text-gray-600">
												{post.currentParticipants}/{post.maxParticipants}명 참여
												중
											</p>
										</div>
									</div>
									{post.description && (
										<div className="pt-4 border-t">
											<h3 className="font-medium mb-2">상세 설명</h3>
											<p className="text-gray-600 whitespace-pre-line">
												{post.description}
											</p>
										</div>
									)}
								</CardContent>
								<CardFooter className="flex justify-between border-t pt-6">
									<Button
										variant="outline"
										onClick={() => window.history.back()}
									>
										뒤로 가기
									</Button>
									{isHost ? (
										<Button
											className="bg-[#8FD694] hover:bg-[#7ac47f] text-white"
											onClick={handleCreateInterview}
										>
											{post.currentParticipants && post.currentParticipants > 0
												? '면접 설정 수정'
												: '면접 만들기'}
										</Button>
									) : isAlreadyApplied ? (
										<Button
											className="bg-[#8FD694] hover:bg-[#7ac47f] text-white"
											onClick={() => alert('자료 수정 기능은 추후 지원됩니다.')}
										>
											자료 수정
										</Button>
									) : post.currentParticipants &&
									  post.maxParticipants &&
									  post.currentParticipants < post.maxParticipants ? (
										<Button
											className="bg-[#8FD694] hover:bg-[#7ac47f] text-white"
											onClick={handleJoin}
										>
											면접 참여 신청
										</Button>
									) : (
										<Button disabled>모집 마감</Button>
									)}
								</CardFooter>
							</Card>

							{/* Participants */}
							<Card>
								<CardHeader>
									<CardTitle>참여자 목록</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-3">
										{post.groupInterviewParticipants &&
										post.groupInterviewParticipants.length > 0 ? (
											post.groupInterviewParticipants.map(
												(participant, idx) => (
													<div
														key={participant.memberId || idx}
														className="flex items-center justify-between"
													>
														<div className="flex items-center">
															<Avatar className="h-8 w-8 mr-3">
																<AvatarFallback className="bg-[#8FD694] text-white">
																	{participant.name?.charAt(0) || '?'}
																</AvatarFallback>
															</Avatar>
															<span>{participant.name}</span>
														</div>
														<div className="flex items-center space-x-2">
															{/* 제출 여부는 submitted로 표시 */}
															{participant.submitted ? (
																<Badge className="bg-green-100 text-green-800 hover:bg-green-100">
																	자료 제출 완료
																</Badge>
															) : (
																<Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
																	자료 미제출
																</Badge>
															)}
															{participant.host && (
																<Badge className="bg-[#8FD694] hover:bg-[#8FD694]">
																	호스트
																</Badge>
															)}
														</div>
													</div>
												)
											)
										) : (
											<div className="text-gray-400 text-sm">
												아직 참여자가 없습니다.
											</div>
										)}
									</div>
								</CardContent>
							</Card>
						</div>

						{/* Sidebar */}
						<div className="space-y-6">
							{/* Join Card */}
							<Card className="bg-[#8FD694] bg-opacity-5 border-[#8FD694] border-opacity-20">
								<CardHeader>
									<CardTitle className="text-[#8FD694]">
										면접 참여하기
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-gray-600 mb-4">
										이 면접에 참여하면 다른 취업 준비생들과 함께 모의면접을
										진행할 수 있습니다.
									</p>
									<div className="flex items-center text-sm text-gray-500 mb-4">
										<Clock className="h-4 w-4 mr-1" />
										<span>{timeLeft}</span>
									</div>
									<p className="text-sm text-gray-500">
										면접은{' '}
										<span className="font-medium">
											{formatDate(post.startedAt)}
										</span>
										에 자동으로 시작됩니다.
									</p>
								</CardContent>
								<CardFooter>
									{isHost ? (
										<Button
											className="w-full bg-[#8FD694] hover:bg-[#7ac47f] text-white"
											onClick={handleCreateInterview}
										>
											{post.currentParticipants && post.currentParticipants > 0
												? '면접 설정 수정'
												: '면접 만들기'}
										</Button>
									) : isAlreadyApplied ? (
										<Button
											className="w-full bg-[#8FD694] hover:bg-[#7ac47f] text-white"
											onClick={() => alert('자료 수정 기능은 추후 지원됩니다.')}
										>
											자료 수정
										</Button>
									) : post.currentParticipants &&
									  post.maxParticipants &&
									  post.currentParticipants < post.maxParticipants ? (
										<Button
											className="w-full bg-[#8FD694] hover:bg-[#7ac47f] text-white"
											onClick={handleJoin}
										>
											면접 참여 신청
										</Button>
									) : (
										<Button className="w-full" disabled>
											모집 마감
										</Button>
									)}
								</CardFooter>
							</Card>

							{/* Recommended Posts */}
							<Card>
								<CardHeader>
									<CardTitle>추천 모집글</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									{recommendedPosts.map(recPost => (
										<Link
											href={`/workspace/interview/group/community/${recPost.id}`}
											key={recPost.id}
											className="block"
										>
											<div className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
												<h3 className="font-medium mb-2 line-clamp-1">
													{recPost.title}
												</h3>
												<div className="flex justify-between text-sm text-gray-500">
													<span>{recPost.field}</span>
													<span>
														{recPost.currentParticipants}/
														{recPost.maxParticipants}명
													</span>
												</div>
											</div>
										</Link>
									))}
								</CardContent>
								<CardFooter className="border-t pt-4">
									<Link
										href="/workspace/interview/group/community"
										className="w-full text-center text-sm text-gray-500 hover:text-gray-700"
									>
										더 많은 모집글 보기{' '}
										<ChevronRight className="inline h-4 w-4" />
									</Link>
								</CardFooter>
							</Card>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
