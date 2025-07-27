'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Filter, Search, Clock, Users } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { HeaderWithNotifications } from '@/components/header-with-notifications'
import { CommunityLayout } from '@/components/community-layout'
import { getGroupInterviewCards } from '@/apis/interview'
import { useQuery } from '@tanstack/react-query'
import LoadingSpinner from '@/components/loading-full-screen'

export default function InterviewCommunityPage() {
	const { data, isLoading, error } = useQuery({
		queryKey: ['interviewPosts'],
		queryFn: () => getGroupInterviewCards(),
	})

	// API 데이터
	const posts = data?.result || []

	const [dateFilter, setDateFilter] = useState('all')
	const [fieldFilter, setFieldFilter] = useState('all')
	const [typeFilter, setTypeFilter] = useState('all')
	const [searchQuery, setSearchQuery] = useState('')

	const filteredPosts = posts.filter(post => {
		// 날짜 필터
		const matchesDate =
			dateFilter === 'all' ||
			(post.startedAt ? isDateMatch(post.startedAt, dateFilter) : false)
		// 유형 필터
		const matchesType =
			typeFilter === 'all' ||
			(typeFilter === 'technical' && post.interviewType === 'TECHNICAL') ||
			(typeFilter === 'personality' && post.interviewType === 'PERSONALITY')
		// 검색 (제목/직무)
		const matchesSearch =
			searchQuery === '' ||
			post.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
			post.jobName?.toLowerCase().includes(searchQuery.toLowerCase())

		return matchesDate && matchesType && matchesSearch
	})

	function isDateMatch(dateString: string, filter: string) {
		const postDate = new Date(dateString)
		const today = new Date()
		const tomorrow = new Date(today)
		tomorrow.setDate(today.getDate() + 1)
		const nextWeek = new Date(today)
		nextWeek.setDate(today.getDate() + 7)

		if (filter === 'today') {
			return (
				postDate.getDate() === today.getDate() &&
				postDate.getMonth() === today.getMonth() &&
				postDate.getFullYear() === today.getFullYear()
			)
		} else if (filter === 'tomorrow') {
			return (
				postDate.getDate() === tomorrow.getDate() &&
				postDate.getMonth() === tomorrow.getMonth() &&
				postDate.getFullYear() === tomorrow.getFullYear()
			)
		} else if (filter === 'thisWeek') {
			return postDate >= today && postDate <= nextWeek
		}
		return true
	}

	// Format date for display
	function formatDate(dateString?: string) {
		if (!dateString) return ''
		const options: Intl.DateTimeFormatOptions = {
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		}
		return new Date(dateString).toLocaleDateString('ko-KR', options)
	}

	return (
		<>
			<HeaderWithNotifications />
			<CommunityLayout activeItem="community">
				<div className="p-6 max-w-6xl mx-auto">
					<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
						<div>
							<h1 className="text-2xl font-bold">다대다 면접 모집</h1>
							<p className="text-gray-600 mt-1">
								다른 취업 준비생들과 함께 모의면접을 진행해보세요.
							</p>
						</div>
						<div className="flex gap-2">
							<Link href="/workspace/interviews/start">
								<Button className="bg-[#8FD694] hover:bg-[#7ac47f] text-white">
									<Plus className="mr-2 h-4 w-4" /> 새 면접 만들기
								</Button>
							</Link>
							{/* <Link href="/workspace/interview/group/community/create">
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" /> 모집 글 작성
                </Button>
              </Link> */}
						</div>
					</div>

					{/* Search and Filters */}
					<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
						<div className="flex flex-col md:flex-row gap-4">
							<div className="relative flex-1">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
								<Input
									placeholder="면접 주제, 직무 검색"
									className="pl-10"
									value={searchQuery}
									onChange={e => setSearchQuery(e.target.value)}
								/>
							</div>
							<div className="flex flex-wrap gap-2">
								<div className="flex items-center">
									<Filter className="mr-2 h-4 w-4 text-gray-500" />
									<span className="text-sm text-gray-500 mr-2">필터:</span>
								</div>
								<Select value={dateFilter} onValueChange={setDateFilter}>
									<SelectTrigger className="w-[110px] h-9">
										<SelectValue placeholder="날짜" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">전체 날짜</SelectItem>
										<SelectItem value="today">오늘</SelectItem>
										<SelectItem value="tomorrow">내일</SelectItem>
										<SelectItem value="thisWeek">이번 주</SelectItem>
									</SelectContent>
								</Select>
								<Select value={fieldFilter} onValueChange={setFieldFilter}>
									<SelectTrigger className="w-[110px] h-9">
										<SelectValue placeholder="분야" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">전체 분야</SelectItem>
										<SelectItem value="개발">개발</SelectItem>
										<SelectItem value="마케팅">마케팅</SelectItem>
										<SelectItem value="금융">금융</SelectItem>
										<SelectItem value="디자인">디자인</SelectItem>
										<SelectItem value="공공기관">공공기관</SelectItem>
									</SelectContent>
								</Select>
								<Select value={typeFilter} onValueChange={setTypeFilter}>
									<SelectTrigger className="w-[110px] h-9">
										<SelectValue placeholder="진행 방식" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">전체 유형</SelectItem>
										<SelectItem value="technical">기술 면접</SelectItem>
										<SelectItem value="personality">인성 면접</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
					</div>

					{/* Interview Posts */}
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
						{isLoading ? (
							<div className="col-span-full py-12 text-center text-gray-500">
								<LoadingSpinner />
							</div>
						) : error ? (
							<div className="col-span-full py-12 text-center text-red-500">
								모집글을 불러오지 못했습니다.
							</div>
						) : filteredPosts.length > 0 ? (
							filteredPosts.map(post => (
								<Link
									href={`/workspace/interviews/group/community/${post.interviewId}`}
									key={post.interviewId}
									className="block h-full"
								>
									<Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
										<CardContent className="p-5">
											<div className="flex justify-between items-start mb-3">
												<Badge
													className={
														post.interviewType === 'TECHNICAL'
															? 'bg-blue-100 text-blue-800 hover:bg-blue-100'
															: 'bg-purple-100 text-purple-800 hover:bg-purple-100'
													}
												>
													{post.interviewType === 'TECHNICAL'
														? '기술 면접'
														: '인성 면접'}
												</Badge>
												{post.jobName && (
													<Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
														{post.jobName}
													</Badge>
												)}
											</div>
											<h3 className="font-medium text-lg mb-3 line-clamp-2">
												{post.name}
											</h3>
											<div className="flex items-center text-sm text-gray-500 mb-2">
												<Clock className="h-4 w-4 mr-1" />
												<span>{formatDate(post.startedAt)}</span>
											</div>
										</CardContent>
										<CardFooter className="px-5 py-3 border-t bg-gray-50 flex justify-between items-center">
											<div className="flex items-center text-sm">
												<Users className="h-4 w-4 mr-1 text-gray-500" />
												<span>
													{post.currentParticipants}/{post.maxParticipants}명
													참여 중
												</span>
											</div>
											<Button
												variant="ghost"
												size="sm"
												className="text-[#8FD694] hover:text-white hover:bg-[#8FD694]"
												asChild
											>
												<Link
													href={`/workspace/interviews/group/community/${post.interviewId}`}
												>
													상세보기
												</Link>
											</Button>
										</CardFooter>
									</Card>
								</Link>
							))
						) : (
							<div className="col-span-full py-12 text-center text-gray-500">
								<Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
								<p className="text-lg font-medium mb-1">모집 글이 없습니다</p>
								<p className="mb-4">
									새로운 모집 글을 작성하거나 필터 조건을 변경해보세요.
								</p>
								{/* <Link href="/workspace/interview/group/community/create">
                  <Button className="bg-[#8FD694] hover:bg-[#7ac47f] text-white">
                    <Plus className="mr-2 h-4 w-4" /> 모집 글 작성
                  </Button>
                </Link> */}
							</div>
						)}
					</div>
				</div>
			</CommunityLayout>
		</>
	)
}
