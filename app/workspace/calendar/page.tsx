'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CalendarIcon, Plus, Clock, Video, Search, Filter } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { CommunityLayout } from '@/components/community-layout'
import { HeaderWithNotifications } from '@/components/header-with-notifications'

export default function CalendarPage() {
	// 현재 날짜 정보
	const today = new Date()
	const [currentMonth, setCurrentMonth] = useState(today.getMonth())
	const [currentYear, setCurrentYear] = useState(today.getFullYear())
	const [selectedDate, setSelectedDate] = useState<Date | null>(today)
	const [typeFilter, setTypeFilter] = useState('all')

	// 일정 추가 다이얼로그 상태
	const [dialogOpen, setDialogOpen] = useState(false)
	const [eventForm, setEventForm] = useState({
		title: '',
		date: today.toISOString().split('T')[0],
		startTime: '09:00',
		endTime: '10:00',
		type: 'interview', // interview, practice, personal
		description: '',
	})

	// Mock data - 일정 데이터
	const [events, setEvents] = useState([
		{
			id: 1,
			title: '삼성전자 모의면접',
			date: new Date(2023, 5, 10, 14, 0),
			endTime: new Date(2023, 5, 10, 15, 30),
			type: 'interview',
			description: '삼성전자 개발직군 공채 대비 모의면접',
		},
		{
			id: 2,
			title: '네이버 자소서 작성',
			date: new Date(2023, 5, 15, 10, 0),
			endTime: new Date(2023, 5, 15, 12, 0),
			type: 'personal',
			description: '네이버 인턴십 지원 자기소개서 작성',
		},
		{
			id: 3,
			title: '기술면접 연습',
			date: new Date(2023, 5, 18, 16, 0),
			endTime: new Date(2023, 5, 18, 17, 0),
			type: 'practice',
			description: '알고리즘 및 자료구조 관련 기술면접 연습',
		},
		{
			id: 4,
			title: '카카오 실전 면접',
			date: new Date(2023, 5, 22, 13, 0),
			endTime: new Date(2023, 5, 22, 14, 30),
			type: 'interview',
			description: '카카오 개발직군 최종 면접',
		},
		{
			id: 5,
			title: 'LG 인적성 시험',
			date: new Date(2023, 5, 25, 9, 0),
			endTime: new Date(2023, 5, 25, 12, 0),
			type: 'personal',
			description: 'LG 공채 인적성 시험 준비',
		},
		{
			id: 6,
			title: '현대자동차 그룹 면접',
			date: new Date(2023, 5, 28, 15, 0),
			endTime: new Date(2023, 5, 28, 16, 30),
			type: 'interview',
			description: '현대자동차 그룹 신입 공채 면접',
		},
		{
			id: 7,
			title: '포트폴리오 업데이트',
			date: new Date(2023, 5, 30, 13, 0),
			endTime: new Date(2023, 5, 30, 18, 0),
			type: 'personal',
			description: '개인 포트폴리오 웹사이트 업데이트',
		},
		{
			id: 8,
			title: 'SK 하이닉스 모의면접',
			date: new Date(2023, 6, 5, 10, 0),
			endTime: new Date(2023, 6, 5, 11, 30),
			type: 'practice',
			description: '반도체 공정 관련 기술 면접 준비',
		},
	])

	// 선택된 날짜의 일정 필터링
	const getEventsForDate = (date: Date | null) => {
		if (!date) return []

		return events.filter(
			event =>
				event.date.getDate() === date.getDate() &&
				event.date.getMonth() === date.getMonth() &&
				event.date.getFullYear() === date.getFullYear() &&
				(typeFilter === 'all' || event.type === typeFilter)
		)
	}

	// 날짜 포맷팅 함수
	const formatDate = (date: Date) => {
		const options: Intl.DateTimeFormatOptions = {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			weekday: 'long',
		}
		return date.toLocaleDateString('ko-KR', options)
	}

	// 시간 포맷팅 함수
	const formatTime = (date: Date) => {
		const options: Intl.DateTimeFormatOptions = {
			hour: '2-digit',
			minute: '2-digit',
			hour12: true,
		}
		return date.toLocaleTimeString('ko-KR', options)
	}

	// 일정 추가 폼 핸들러
	const handleFormChange = (field: string, value: string) => {
		setEventForm(prev => ({
			...prev,
			[field]: value,
		}))
	}

	// 일정 추가 제출 핸들러
	const handleSubmit = () => {
		const { title, date, startTime, endTime, type, description } = eventForm

		if (!title || !date || !startTime || !endTime) {
			alert('제목, 날짜, 시작 시간, 종료 시간은 필수 입력 항목입니다.')
			return
		}

		const startDate = new Date(`${date}T${startTime}`)
		const endDate = new Date(`${date}T${endTime}`)

		if (startDate >= endDate) {
			alert('종료 시간은 시작 시간보다 늦어야 합니다.')
			return
		}

		const newEvent = {
			id: Date.now(),
			title,
			date: startDate,
			endTime: endDate,
			type,
			description,
		}

		setEvents([...events, newEvent])
		setDialogOpen(false)

		// 폼 초기화
		setEventForm({
			title: '',
			date: today.toISOString().split('T')[0],
			startTime: '09:00',
			endTime: '10:00',
			type: 'interview',
			description: '',
		})

		alert('일정이 추가되었습니다.')
	}

	// 선택된 날짜의 일정
	const selectedDateEvents = getEventsForDate(selectedDate)

	// 다가오는 일정 필터링
	const upcomingEvents = events
		.filter(
			event =>
				event.date > today &&
				(typeFilter === 'all' || event.type === typeFilter)
		)
		.sort((a, b) => a.date.getTime() - b.date.getTime())
		.slice(0, 6)

	return (
		<>
			<HeaderWithNotifications />
			<CommunityLayout activeItem="calendar">
				<div className="p-6 max-w-6xl mx-auto">
					<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
						<div>
							<h1 className="text-2xl font-bold">일정 관리</h1>
							<p className="text-gray-600 mt-1">
								면접 및 개인 일정을 관리하세요.
							</p>
						</div>
						<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
							<DialogTrigger asChild>
								<Button className="bg-[#8FD694] hover:bg-[#7ac47f] text-white">
									<Plus className="mr-2 h-4 w-4" /> 일정 추가
								</Button>
							</DialogTrigger>
							<DialogContent className="sm:max-w-[500px]">
								<DialogHeader>
									<DialogTitle>새 일정 추가</DialogTitle>
									<DialogDescription>
										면접 일정이나 개인 일정을 추가하세요.
									</DialogDescription>
								</DialogHeader>
								<div className="py-4 space-y-4">
									<div className="space-y-2">
										<Label htmlFor="title">일정 제목</Label>
										<Input
											id="title"
											placeholder="예: 삼성전자 모의면접"
											value={eventForm.title}
											onChange={e => handleFormChange('title', e.target.value)}
										/>
									</div>

									<div className="space-y-2">
										<Label htmlFor="date">날짜</Label>
										<Input
											id="date"
											type="date"
											value={eventForm.date}
											onChange={e => handleFormChange('date', e.target.value)}
										/>
									</div>

									<div className="grid grid-cols-2 gap-4">
										<div className="space-y-2">
											<Label htmlFor="startTime">시작 시간</Label>
											<Input
												id="startTime"
												type="time"
												value={eventForm.startTime}
												onChange={e =>
													handleFormChange('startTime', e.target.value)
												}
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="endTime">종료 시간</Label>
											<Input
												id="endTime"
												type="time"
												value={eventForm.endTime}
												onChange={e =>
													handleFormChange('endTime', e.target.value)
												}
											/>
										</div>
									</div>

									<div className="space-y-2">
										<Label htmlFor="type">일정 유형</Label>
										<Select
											value={eventForm.type}
											onValueChange={value => handleFormChange('type', value)}
										>
											<SelectTrigger>
												<SelectValue placeholder="일정 유형을 선택하세요" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="interview">면접</SelectItem>
												<SelectItem value="practice">연습</SelectItem>
												<SelectItem value="personal">개인 일정</SelectItem>
											</SelectContent>
										</Select>
									</div>

									<div className="space-y-2">
										<Label htmlFor="description">설명 (선택사항)</Label>
										<Textarea
											id="description"
											placeholder="일정에 대한 추가 정보를 입력하세요."
											value={eventForm.description}
											onChange={e =>
												handleFormChange('description', e.target.value)
											}
										/>
									</div>
								</div>
								<DialogFooter>
									<Button
										variant="outline"
										onClick={() => setDialogOpen(false)}
									>
										취소
									</Button>
									<Button
										className="bg-[#8FD694] hover:bg-[#7ac47f] text-white"
										onClick={handleSubmit}
									>
										저장
									</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					</div>

					{/* Search and Filters */}
					<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
						<div className="flex flex-col md:flex-row gap-4">
							<div className="relative flex-1">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
								<Input placeholder="일정 검색" className="pl-10" />
							</div>
							<div className="flex flex-wrap gap-2">
								<div className="flex items-center">
									<Filter className="mr-2 h-4 w-4 text-gray-500" />
									<span className="text-sm text-gray-500 mr-2">필터:</span>
								</div>
								<Select value={typeFilter} onValueChange={setTypeFilter}>
									<SelectTrigger className="w-[150px] h-9">
										<SelectValue placeholder="일정 유형" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">모든 일정</SelectItem>
										<SelectItem value="interview">면접</SelectItem>
										<SelectItem value="practice">연습</SelectItem>
										<SelectItem value="personal">개인 일정</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
					</div>

					{/* Selected Date Events */}
					{selectedDate && (
						<div className="mb-8">
							<h2 className="text-xl font-bold mb-4">
								{formatDate(selectedDate)}
							</h2>
							<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
								{selectedDateEvents.length > 0 ? (
									selectedDateEvents.map(event => (
										<Card
											key={event.id}
											className="hover:shadow-md transition-shadow cursor-pointer"
										>
											<CardContent className="p-5">
												<div className="flex justify-between items-start mb-3">
													<Badge
														className={`
                              ${
																event.type === 'interview'
																	? 'bg-blue-100 text-blue-800 hover:bg-blue-100'
																	: event.type === 'practice'
																		? 'bg-purple-100 text-purple-800 hover:bg-purple-100'
																		: 'bg-gray-100 text-gray-800 hover:bg-gray-100'
															}
                            `}
													>
														{event.type === 'interview'
															? '면접'
															: event.type === 'practice'
																? '연습'
																: '개인 일정'}
													</Badge>
												</div>
												<h3 className="font-medium text-lg mb-3">
													{event.title}
												</h3>
												<div className="flex items-center text-sm text-gray-500 mb-2">
													<Clock className="h-4 w-4 mr-1" />
													<span>
														{formatTime(event.date)} -{' '}
														{formatTime(event.endTime)}
													</span>
												</div>
												{event.description && (
													<p className="text-sm text-gray-600 line-clamp-2">
														{event.description}
													</p>
												)}
											</CardContent>
											<CardFooter className="px-5 py-3 border-t bg-gray-50 flex justify-end">
												{event.type === 'interview' && (
													<Button
														variant="outline"
														size="sm"
														className="text-xs flex items-center"
													>
														<Video className="h-3 w-3 mr-1" />
														면접 입장
													</Button>
												)}
											</CardFooter>
										</Card>
									))
								) : (
									<div className="col-span-full py-8 text-center text-gray-500">
										<CalendarIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
										<p>선택한 날짜에 일정이 없습니다.</p>
										<p className="text-sm mt-1">새 일정을 추가해보세요.</p>
										<Button
											className="mt-4 bg-[#8FD694] hover:bg-[#7ac47f] text-white"
											onClick={() => setDialogOpen(true)}
										>
											<Plus className="mr-2 h-4 w-4" /> 일정 추가
										</Button>
									</div>
								)}
							</div>
						</div>
					)}

					{/* Upcoming Events */}
					<div>
						<h2 className="text-xl font-bold mb-4">다가오는 일정</h2>
						<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
							{upcomingEvents.length > 0 ? (
								upcomingEvents.map(event => (
									<Card
										key={event.id}
										className="hover:shadow-md transition-shadow cursor-pointer"
									>
										<CardContent className="p-5">
											<div className="flex justify-between items-start mb-3">
												<Badge
													className={`
                            ${
															event.type === 'interview'
																? 'bg-blue-100 text-blue-800 hover:bg-blue-100'
																: event.type === 'practice'
																	? 'bg-purple-100 text-purple-800 hover:bg-purple-100'
																	: 'bg-gray-100 text-gray-800 hover:bg-gray-100'
														}
                          `}
												>
													{event.type === 'interview'
														? '면접'
														: event.type === 'practice'
															? '연습'
															: '개인 일정'}
												</Badge>
											</div>
											<h3 className="font-medium text-lg mb-3">
												{event.title}
											</h3>
											<div className="flex items-center text-sm text-gray-500 mb-2">
												<CalendarIcon className="h-4 w-4 mr-1" />
												<span>{formatDate(event.date).split('요일')[0]}</span>
											</div>
											<div className="flex items-center text-sm text-gray-500 mb-2">
												<Clock className="h-4 w-4 mr-1" />
												<span>
													{formatTime(event.date)} - {formatTime(event.endTime)}
												</span>
											</div>
										</CardContent>
										<CardFooter className="px-5 py-3 border-t bg-gray-50 flex justify-end">
											{event.type === 'interview' && (
												<Button
													variant="outline"
													size="sm"
													className="text-xs flex items-center"
												>
													<Video className="h-3 w-3 mr-1" />
													면접 입장
												</Button>
											)}
										</CardFooter>
									</Card>
								))
							) : (
								<div className="col-span-full py-8 text-center text-gray-500">
									<CalendarIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
									<p>다가오는 일정이 없습니다.</p>
									<p className="text-sm mt-1">새 일정을 추가해보세요.</p>
									<Button
										className="mt-4 bg-[#8FD694] hover:bg-[#7ac47f] text-white"
										onClick={() => setDialogOpen(true)}
									>
										<Plus className="mr-2 h-4 w-4" /> 일정 추가
									</Button>
								</div>
							)}
						</div>
					</div>
				</div>
			</CommunityLayout>
		</>
	)
}
