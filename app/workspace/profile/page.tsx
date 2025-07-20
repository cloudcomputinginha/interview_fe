'use client'

import { Button } from '@/components/ui/button'
import { Edit, User, Lock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { CommunityLayout } from '@/components/community-layout'
import { useProfileForm } from './hooks/useProfileForm'
import { ProfileBasicCard } from './components/ProfileBasicCard'
import { ProfileAccountCard } from './components/ProfileAccountCard'
import type { UserProfile } from './types/profile'
import { HeaderWithNotifications } from '@/components/header-with-notifications'
import { useMemberSession } from '@/components/member-session-context'
import { useQuery } from '@tanstack/react-query'
import { getMemberInfo } from '@/api/member'
import { useMemo } from 'react'

const INITIAL_PROFILE: UserProfile = {
	name: '이름 없음',
	email: '이메일 없음',
	phone: '전화번호 없음',
	company: '',
	position: '',
	bio: '자기소개 없음',
	jobField: '직무 없음',
	profileImage: '',
}

export default function ProfilePage() {
	const { memberId } = useMemberSession()

	const { data: memberInfo, isFetching } = useQuery({
		queryKey: ['member', memberId],
		queryFn: () => getMemberInfo(),
		enabled: !!memberId,
	})

	const initialProfileData = useMemo(
		() => ({
			name: memberInfo?.result?.name ?? INITIAL_PROFILE.name,
			email: memberInfo?.result?.email ?? INITIAL_PROFILE.email,
			phone: memberInfo?.result?.phone ?? INITIAL_PROFILE.phone,
			bio: memberInfo?.result?.introduction ?? INITIAL_PROFILE.bio,
			jobField: memberInfo?.result?.jobType ?? INITIAL_PROFILE.jobField,
			profileImage: '',
			company: '',
			position: '',
		}),
		[memberInfo?.result]
	)

	const {
		userData,
		formData,
		isEditing,
		setIsEditing,
		handleInputChange,
		handleSave,
		handleCancel,
	} = useProfileForm(initialProfileData)

	const profileCards = [
		{
			id: 1,
			title: '기본 정보',
			icon: User,
			content: (
				<ProfileBasicCard
					userData={memberInfo?.result ?? userData}
					formData={formData}
					isEditing={isEditing}
					handleInputChange={handleInputChange}
					isFetching={isFetching}
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
							</Card>
						))}
					</div>
				</div>
			</CommunityLayout>
		</>
	)
}
