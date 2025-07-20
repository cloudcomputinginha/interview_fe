'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Bell, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import useSseNotifications from '@/hooks/useSseNotifications'
import { convertDate } from '@/utils/date/convertDate'
import { logout } from '@/api/auth'

interface Notification {
	type:
		| 'ROOM_ENTRY'
		| 'ROOM_INVITE'
		| 'INTERVIEW_REMINDER_1D'
		| 'INTERVIEW_REMINDER_30M'
		| 'FEEDBACK_RECEIVED'
	message: string
	url: string
	createdAt: string
}

export function HeaderWithNotifications() {
	const [notifications, setNotifications] = useState<any[]>([])
	const [unreadCount, setUnreadCount] = useState(0)
	const { notifications: sseNotifications, sseConnected } =
		useSseNotifications()

	// SSE 알림이 오면 위에 추가
	useEffect(() => {
		if (sseNotifications.length > 0) {
			setNotifications(prev => {
				const newList = [
					...sseNotifications.map((n, idx) => ({
						...n,
						id: `sse-${Date.now()}-${idx}`,
						read: false,
					})),
					...prev,
				]
				return newList
			})
			setUnreadCount(prev => prev + sseNotifications.length)
		}
	}, [sseNotifications])

	const markAsRead = (id: any) => {
		setNotifications(prev =>
			prev.map(notification =>
				notification.id === id ? { ...notification, read: true } : notification
			)
		)
		setUnreadCount(prev => Math.max(0, prev - 1))
	}

	const markAllAsRead = () => {
		setNotifications(prev =>
			prev.map(notification => ({ ...notification, read: true }))
		)
		setUnreadCount(0)
	}

	return (
		<header className="border-b bg-white">
			<div className="px-4 py-3 flex justify-between items-center">
				<div className="flex items-center space-x-2">
					<Link href="/workspace">
						<div className="flex items-center space-x-2">
							<div className="flex items-center space-x-2">
								<div className="w-8 h-8 rounded-full bg-[#8FD694] flex items-center justify-center">
									<span className="text-white font-bold">In</span>
								</div>
								<span className="font-bold text-lg">job</span>
							</div>
						</div>
					</Link>
				</div>
				<div className="flex items-center space-x-4">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon" className="relative">
								<Bell className="h-5 w-5" />
								{unreadCount > 0 && (
									<Badge className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[1.25rem] h-5 bg-red-500 hover:bg-red-500">
										{unreadCount}
									</Badge>
								)}
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-80">
							<div className="flex items-center justify-between p-2 border-b">
								<h3 className="font-medium">알림</h3>
								{unreadCount > 0 && (
									<Button
										variant="ghost"
										size="sm"
										className="text-xs h-7"
										onClick={markAllAsRead}
									>
										모두 읽음 표시
									</Button>
								)}
							</div>
							<div className="max-h-[300px] overflow-y-auto">
								{notifications.length > 0 ? (
									notifications.map(notification => (
										<DropdownMenuItem
											key={notification.id}
											className={`p-3 cursor-pointer ${!notification.read ? 'bg-blue-50' : ''}`}
											onClick={() => {
												markAsRead(notification.id)
												window.location.href = notification.url
											}}
										>
											<div className="flex flex-col w-full">
												<div className="flex justify-between items-start">
													<span className="font-medium text-sm">
														{notification.type === 'ROOM_ENTRY'
															? '입장 알림'
															: notification.type === 'ROOM_INVITE'
																? '초대 알림'
																: notification.type ===
																			'INTERVIEW_REMINDER_1D' ||
																	  notification.type ===
																			'INTERVIEW_REMINDER_30M'
																	? '면접 알림'
																	: notification.type === 'FEEDBACK_RECEIVED'
																		? '피드백 알림'
																		: '알림'}
													</span>
													<span className="text-xs text-gray-500">
														{convertDate(notification.createdAt)}
													</span>
												</div>
												<p className="text-sm mt-1">{notification.message}</p>
											</div>
										</DropdownMenuItem>
									))
								) : (
									<div className="p-4 text-center text-gray-500">
										<p>새로운 알림이 없습니다.</p>
									</div>
								)}
							</div>
						</DropdownMenuContent>
					</DropdownMenu>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon" className="relative">
								<User className="h-5 w-5" />
								<span
									className={`absolute w-3 h-3 border-2 border-white rounded-full right-0 bottom-0 ${sseConnected ? 'bg-green-500' : 'bg-gray-400'}`}
								/>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem>
								<Link href="/workspace/profile" className="w-full">
									프로필
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Link href="/workspace/settings" className="w-full">
									설정
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Link
									href="/login"
									className="w-full"
									onClick={() => {
										logout()
									}}
								>
									로그아웃
								</Link>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</header>
	)
}
