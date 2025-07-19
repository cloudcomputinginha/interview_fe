'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
	Camera,
	Mail,
	Phone,
	Edit,
	User,
	Shield,
	Lock,
	Bell,
} from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { CommunityLayout } from '@/components/community-layout'
import { useProfileForm } from './hooks/useProfileForm'
import { ProfileBasicCard } from './components/ProfileBasicCard'
import { ProfileNotificationCard } from './components/ProfileNotificationCard'
import { ProfilePrivacyCard } from './components/ProfilePrivacyCard'
import { ProfileAccountCard } from './components/ProfileAccountCard'
import type { UserProfile } from './types/profile'
import { HeaderWithNotifications } from '@/components/header-with-notifications'

const INITIAL_PROFILE: UserProfile = {
	name: '김지원',
	email: 'jiwon.kim@example.com',
	phone: '010-1234-5678',
	company: '',
	position: '',
	bio: '안녕하세요! 신입 개발자를 꿈꾸는 김지원입니다. 프론트엔드 개발에 관심이 많으며, React와 TypeScript를 주로 사용합니다.',
	jobField: '개발',
	profileImage: '',
	notifications: {
		email: true,
		interview: true,
		reminder: true,
		marketing: false,
	},
	privacy: {
		showProfile: true,
		showActivity: false,
	},
}

export default function ProfilePage() {
	const {
		userData,
		formData,
		isEditing,
		setIsEditing,
		handleInputChange,
		handleNotificationChange,
		handlePrivacyChange,
		handleSave,
		handleCancel,
	} = useProfileForm(INITIAL_PROFILE)

	// Job fields options
	const jobFields = [
		{ value: '개발', label: '개발' },
		{ value: '디자인', label: '디자인' },
		{ value: '마케팅', label: '마케팅' },
		{ value: '영업', label: '영업' },
		{ value: '인사', label: '인사' },
		{ value: '금융', label: '금융' },
		{ value: '공공기관', label: '공공기관' },
		{ value: '기타', label: '기타' },
	]

	const profileCards = [
		{
			id: 1,
			title: '기본 정보',
			icon: User,
			content: (
				<ProfileBasicCard
					userData={userData}
					formData={formData}
					isEditing={isEditing}
					handleInputChange={handleInputChange}
				/>
			),
		},
		{
			id: 2,
			title: '알림 설정',
			icon: Bell,
			content: (
				<ProfileNotificationCard
					userData={userData}
					formData={formData}
					isEditing={isEditing}
					handleNotificationChange={handleNotificationChange}
				/>
			),
		},
		{
			id: 3,
			title: '개인정보 설정',
			icon: Shield,
			content: (
				<ProfilePrivacyCard
					userData={userData}
					formData={formData}
					isEditing={isEditing}
					handlePrivacyChange={handlePrivacyChange}
				/>
			),
		},
		{
			id: 4,
			title: '계정 관리',
			icon: Lock,
			content: <ProfileAccountCard />,
		},
	]

	return (
		<>
			<HeaderWithNotifications />
			<CommunityLayout activeItem="profile">
				<div className="p-6 max-w-6xl mx-auto">
					<div className="flex justify-between items-center mb-8">
						<div>
							<h1 className="text-2xl font-bold">내 프로필</h1>
							<p className="text-gray-600 mt-1">
								개인 정보와 설정을 관리하세요.
							</p>
						</div>
						{!isEditing ? (
							<Button
								className="bg-[#8FD694] hover:bg-[#7ac47f] text-white"
								onClick={() => setIsEditing(true)}
							>
								<Edit className="mr-2 h-4 w-4" /> 프로필 수정
							</Button>
						) : (
							<div className="flex space-x-2">
								<Button variant="outline" onClick={handleCancel}>
									취소
								</Button>
								<Button
									className="bg-[#8FD694] hover:bg-[#7ac47f] text-white"
									onClick={handleSave}
								>
									저장
								</Button>
							</div>
						)}
					</div>
					<div className="grid md:grid-cols-2 gap-6">
						{profileCards.map(card => (
							<Card key={card.id} className="hover:shadow-md transition-shadow">
								<CardContent className="p-5">
									<div className="flex items-center mb-4">
										<div className="w-8 h-8 rounded-full bg-[#8FD694] bg-opacity-20 flex items-center justify-center mr-3">
											<card.icon className="h-5 w-5 text-[#8FD694]" />
										</div>
										<h3 className="font-medium text-lg">{card.title}</h3>
									</div>
									{card.content}
								</CardContent>
								{card.id === 1 && (
									<CardFooter className="px-5 py-3 border-t bg-gray-50 flex justify-between items-center">
										<div className="flex items-center text-sm">
											<Mail className="h-4 w-4 mr-1 text-gray-500" />
											<span>{userData.email}</span>
										</div>
										{userData.phone && (
											<div className="flex items-center text-sm">
												<Phone className="h-4 w-4 mr-1 text-gray-500" />
												<span>{userData.phone}</span>
											</div>
										)}
									</CardFooter>
								)}
							</Card>
						))}
					</div>
				</div>
			</CommunityLayout>
		</>
	)
}
