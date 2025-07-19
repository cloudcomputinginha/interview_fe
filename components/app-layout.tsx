'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { Home, FileText, Calendar, User, Settings, Users } from 'lucide-react'
import { HeaderWithNotifications } from '@/components/header-with-notifications'

interface AppLayoutProps {
	children: ReactNode
	activeItem?:
		| 'home'
		| 'community'
		| 'documents'
		| 'calendar'
		| 'profile'
		| 'settings'
}

export function AppLayout({ children, activeItem = 'home' }: AppLayoutProps) {
	const menuItems = [
		{
			name: '내 면접',
			href: '/workspace/interviews',
			icon: Home,
			id: 'home',
		},
		{
			name: '다대다 면접 모집',
			href: '/workspace/interviews/group/community',
			icon: Users,
			id: 'community',
		},
		{
			name: '이력서 / 자소서 관리',
			href: '/workspace',
			icon: FileText,
			id: 'documents',
		},
		// {
		//   name: "일정",
		//   href: "/workspace/calendar",
		//   icon: Calendar,
		//   id: "calendar",
		// },
		{
			name: '프로필',
			href: '/workspace/profile',
			icon: User,
			id: 'profile',
		},
		{
			name: '설정',
			href: '/workspace/settings',
			icon: Settings,
			id: 'settings',
		},
	]

	return (
		<div className="flex min-h-screen bg-gray-50 flex-col">
			<HeaderWithNotifications />
			<div className="flex flex-1">
				{/* Sidebar */}
				<aside className="w-64 bg-white border-r hidden md:block">
					<div className="p-4 border-b">
						<div className="flex items-center space-x-2">
							<div className="w-8 h-8 rounded-full bg-[#8FD694] flex items-center justify-center">
								<span className="text-white font-bold">AI</span>
							</div>
							{/* 로고 텍스트 제거 - 모든 페이지에서 일관성 유지 */}
						</div>
					</div>
					<nav className="p-4">
						<ul className="space-y-2">
							{menuItems.map(item => (
								<li key={item.id}>
									<Link
										href={item.href}
										className={`flex items-center space-x-3 p-2 rounded-md ${
											activeItem === item.id
												? 'bg-[#8FD694] bg-opacity-10 text-[#8FD694]'
												: 'text-gray-600 hover:bg-gray-100'
										}`}
									>
										<item.icon className="h-5 w-5" />
										<span>{item.name}</span>
									</Link>
								</li>
							))}
						</ul>
					</nav>
				</aside>

				{/* Main Content */}
				<main className="flex-1 overflow-auto">{children}</main>
			</div>
		</div>
	)
}
