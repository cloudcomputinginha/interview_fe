'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, Calendar, Clock, Users, Play } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CommunityLayout } from '@/components/community-layout'
import { HeaderWithNotifications } from '@/components/header-with-notifications'
import { getMyInterviewList } from '@/apis/interview'
import { useQuery } from '@tanstack/react-query'
import { useMemberSession } from '@/components/member-session-context'
import { useRouter } from 'next/navigation'
import type {
	InterviewCardDTO,
	MyInterviewDTO,
} from '@/apis/types/interview-types'
import LoadingSpinner from '@/components/loading-full-screen'
import { toast } from 'sonner'
import DeleteDialog from '../profile/components/DeleteDialog'
import { PREPARE_FOR_RELEASE } from '@/constant'

export default function InterviewsPage() {
	const router = useRouter()
	const { memberId } = useMemberSession()
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
	const [interviewToDelete, setInterviewToDelete] = useState<any>(null)

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ['myInterviewList', memberId],
		queryFn: () => getMyInterviewList(memberId!),
		enabled: !!memberId,
		select: res => res.result.myInterviews,
	})

	const interviews = data || []

	const handleDelete = (interview: any) => {
		setInterviewToDelete(interview)
		setDeleteDialogOpen(true)
	}

	const handleStartInterview = ({
		interview,
		interviewFormat,
	}: {
		interview: InterviewCardDTO
		interviewFormat: 'GROUP' | 'INDIVIDUAL'
	}) => {
		if (interviewFormat === 'GROUP') {
			router.push(
				`/workspace/interviews/group/waiting/${interview.interviewId}`
			)
		} else {
			router.push(
				`/workspace/interviews/individual/waiting/${interview.interviewId}`
			)
		}
	}

	function formatDate(dateString: string) {
		const options: Intl.DateTimeFormatOptions = {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		}
		return new Date(dateString).toLocaleDateString('ko-KR', options)
	}

	if (isLoading)
		return <LoadingSpinner infoText="면접 목록을 불러오는 중이에요" />
	if (isError)
		return (
			<div className="p-6 text-red-500">
				{error instanceof Error ? error.message : '에러가 발생했어요.'}
			</div>
		)

	const isUpcomingIndivdualInterview = (interview: MyInterviewDTO) => {
		return (
			interview.interviewOptionPreviewDTO.interviewFormat === 'INDIVIDUAL' &&
			new Date(interview.myInterviewCardDTO.startedAt) > new Date()
		)
	}

	const isUpcomingGroupInterview = (interview: MyInterviewDTO) => {
		return (
			interview.interviewOptionPreviewDTO.interviewFormat === 'GROUP' &&
			(interview.memberInterviewStatusDTO.status === 'SCHEDULED' ||
				interview.memberInterviewStatusDTO.status === 'IN_PROGRESS') &&
			new Date(interview.myInterviewCardDTO.startedAt) > new Date()
		)
	}

	const upcomingInterviews = interviews.filter(
		i => isUpcomingIndivdualInterview(i) || isUpcomingGroupInterview(i)
	)
	const pastInterviews = interviews.filter(
		i => new Date(i.myInterviewCardDTO.startedAt) < new Date()
	)

	return (
		<>
			<HeaderWithNotifications />
			<CommunityLayout activeItem="home">
				<div className="p-6 max-w-6xl mx-auto">
					<div className="flex justify-between items-center mb-8">
						<div>
							<h1 className="text-2xl font-bold">내 면접 목록</h1>
							<p className="text-gray-600 mt-1">
								예정된 면접과 과거 면접 기록을 확인하세요.
							</p>
						</div>
						<Link href="/workspace/interviews/start">
							<Button className="bg-[#8FD694] hover:bg-[#7ac47f] text-white">
								<Plus className="mr-2 h-4 w-4" /> 새 면접 만들기
							</Button>
						</Link>
					</div>
					{/* Upcoming Interviews */}
					<div className="mb-8">
						<h2 className="text-xl font-bold mb-4">예정된 면접</h2>
						<div className="grid lg:grid-cols-2 gap-4">
							{upcomingInterviews.length === 0 && (
								<div className="col-span-3 text-gray-400">
									예정된 면접이 없습니다.
								</div>
							)}
							{upcomingInterviews.map(
								({ myInterviewCardDTO, interviewOptionPreviewDTO }) => (
									<>
										<Card
											key={myInterviewCardDTO.interviewId}
											className="h-full hover:shadow-md transition-shadow"
										>
											<CardContent className="p-5">
												<div className="flex justify-between items-start mb-3">
													<Badge
														className={
															interviewOptionPreviewDTO.interviewFormat ===
															'INDIVIDUAL'
																? 'bg-blue-100 text-blue-800 hover:bg-blue-100'
																: 'bg-purple-100 text-purple-800 hover:bg-purple-100'
														}
													>
														{interviewOptionPreviewDTO.interviewFormat ===
														'INDIVIDUAL'
															? '개인 면접'
															: '그룹 면접'}
													</Badge>
													<Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
														{myInterviewCardDTO.corporateName}
													</Badge>
												</div>
												<h3 className="font-medium text-lg mb-2 line-clamp-2">
													{myInterviewCardDTO.name}
												</h3>
												<div className="text-sm text-gray-600 mb-3">
													<p>
														{myInterviewCardDTO.corporateName} {'\u2022'}{' '}
														{myInterviewCardDTO.jobName}
													</p>
												</div>
												<div className="flex items-center text-sm text-gray-500 mb-2">
													<Calendar className="h-4 w-4 mr-1" />
													<span>
														{formatDate(myInterviewCardDTO.startedAt)}
													</span>
												</div>
												{interviewOptionPreviewDTO.interviewFormat ===
													'GROUP' && (
													<div className="flex items-center text-sm text-gray-500">
														<Users className="h-4 w-4 mr-1" />
														<span>
															{myInterviewCardDTO.currentParticipants}/
															{myInterviewCardDTO.maxParticipants}명 참여 중
														</span>
													</div>
												)}
												{interviewOptionPreviewDTO.interviewFormat ===
													'INDIVIDUAL' && (
													<div className="flex items-center text-sm text-gray-500">
														<Users className="h-4 w-4 mr-1" />
														<span>개인</span>
													</div>
												)}
											</CardContent>
											<CardFooter className="px-5 py-3 border-t bg-gray-50 flex justify-between items-center">
												<div className="flex items-center text-sm">
													<Clock className="h-4 w-4 mr-1 text-gray-500" />
													<span>예약됨</span>
												</div>
												<div className="flex space-x-2">
													<Button
														size="sm"
														className="bg-[#8FD694] hover:bg-[#7ac47f] text-white"
														onClick={() =>
															handleStartInterview({
																interview: myInterviewCardDTO,
																interviewFormat:
																	interviewOptionPreviewDTO.interviewFormat,
															})
														}
													>
														<Play className="h-4 w-4 mr-1" />
														입장하기
													</Button>
													<Link
														href={`/workspace/interviews/edit/${myInterviewCardDTO.interviewId}`}
													>
														<Button variant="outline" size="sm">
															수정
														</Button>
													</Link>
													<Button
														variant="ghost"
														size="sm"
														className="text-red-600 hover:text-red-700"
														onClick={() => handleDelete(myInterviewCardDTO)}
													>
														<Trash2 className="h-4 w-4" />
													</Button>
												</div>
											</CardFooter>
										</Card>
									</>
								)
							)}
						</div>
					</div>
					{/* Past Interviews */}
					<div>
						<h2 className="text-xl font-bold mb-4">과거 면접</h2>
						<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
							{pastInterviews.length === 0 && (
								<div className="col-span-3 text-gray-400">
									과거 면접이 없습니다.
								</div>
							)}
							{pastInterviews.map(({ myInterviewCardDTO }) => (
								<Card
									key={myInterviewCardDTO.interviewId}
									className="hover:shadow-md transition-shadow cursor-pointer"
								>
									<CardContent className="p-5">
										<div className="flex justify-between items-start mb-3">
											<Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
												과거 면접
											</Badge>
										</div>
										<h3 className="font-medium text-lg mb-2">
											{myInterviewCardDTO.name}
										</h3>
										<div className="text-sm text-gray-600 mb-3">
											<p>
												{myInterviewCardDTO.corporateName} {'•'}{' '}
												{myInterviewCardDTO.jobName}
											</p>
										</div>
										<div className="flex items-center text-sm text-gray-500">
											<Calendar className="h-4 w-4 mr-1" />
											<span>{formatDate(myInterviewCardDTO.startedAt)}</span>
										</div>
									</CardContent>
									<CardFooter className="px-5 py-3 border-t bg-gray-50 flex justify-end">
										<Button
											variant="ghost"
											size="sm"
											className="text-[#8FD694] hover:text-[#7ac47f]"
											onClick={() => toast.info(PREPARE_FOR_RELEASE)}
										>
											{`결과 보기`}
										</Button>
									</CardFooter>
								</Card>
							))}
						</div>
					</div>
				</div>
			</CommunityLayout>
			<DeleteDialog
				open={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
				interview={interviewToDelete}
				onDeleted={() => {
					setDeleteDialogOpen(false)
					setInterviewToDelete(null)
				}}
			/>
		</>
	)
}
