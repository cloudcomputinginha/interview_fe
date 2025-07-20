'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Camera } from 'lucide-react'
import type { UserProfile } from '../types/profile'
import { JOB_FIELDS } from '../constants/jobFields'
import { MemberInfoResponseDTO } from '@/api/types/member-types'
import Loading from '../../loading'

interface ProfileBasicCardProps {
	userData: MemberInfoResponseDTO | undefined
	formData: UserProfile
	isEditing: boolean
	handleInputChange: (field: keyof UserProfile, value: string | boolean) => void
	isFetching: boolean
}

export function ProfileBasicCard({
	userData,
	formData,
	isEditing,
	handleInputChange,
	isFetching,
}: ProfileBasicCardProps) {
	return (
		<>
			<div className="flex flex-col items-center mb-4">
				{isFetching && <Loading />}
				<div className="relative mb-4">
					<Avatar className="w-24 h-24 border-2 border-[#8FD694]">
						<AvatarImage src={'/placeholder.svg?height=96&width=96'} />
						<AvatarFallback className="bg-[#8FD694] text-white text-2xl">
							{userData?.name ?? '이름 없음'}
						</AvatarFallback>
					</Avatar>
					{isEditing && (
						<Button
							variant="secondary"
							size="icon"
							className="absolute bottom-0 right-0 rounded-full h-8 w-8 bg-white border shadow-sm"
						>
							<Camera className="h-4 w-4" />
						</Button>
					)}
				</div>
				<h2 className="text-xl font-bold">{userData?.name ?? '이름 없음'}</h2>
				<p className="text-gray-500 text-sm">
					{userData?.email ?? '이메일 없음'}
				</p>
				<Badge className="mt-2 bg-[#8FD694] hover:bg-[#8FD694]">
					{userData?.jobType ?? '직무 없음'}
				</Badge>
			</div>
			<div className="space-y-4 mt-4">
				<div className="space-y-2">
					<Label htmlFor="name">이름</Label>
					{isEditing ? (
						<Input
							id="name"
							value={formData.name}
							onChange={e => handleInputChange('name', e.target.value)}
						/>
					) : (
						<p className="text-sm text-gray-700 p-2 border rounded-md bg-gray-50">
							{userData?.name ?? '이름 없음'}
						</p>
					)}
				</div>
				<div className="space-y-2">
					<Label htmlFor="email">이메일</Label>
					{isEditing ? (
						<Input
							id="email"
							type="email"
							value={formData.email}
							onChange={e => handleInputChange('email', e.target.value)}
						/>
					) : (
						<p className="text-sm text-gray-700 p-2 border rounded-md bg-gray-50">
							{userData?.email ?? '이메일 없음'}
						</p>
					)}
				</div>
				<div className="space-y-2">
					<Label htmlFor="phone">전화번호</Label>
					{isEditing ? (
						<Input
							id="phone"
							value={formData.phone}
							onChange={e => handleInputChange('phone', e.target.value)}
						/>
					) : (
						<p className="text-sm text-gray-700 p-2 border rounded-md bg-gray-50">
							{userData?.phone ?? '전화번호 없음'}
						</p>
					)}
				</div>
				<div className="space-y-2">
					<Label htmlFor="jobField">직무 분야</Label>
					{isEditing ? (
						<Select
							value={formData.jobField}
							onValueChange={value => handleInputChange('jobField', value)}
						>
							<SelectTrigger>
								<SelectValue placeholder="직무 분야를 선택하세요" />
							</SelectTrigger>
							<SelectContent>
								{JOB_FIELDS.map(field => (
									<SelectItem key={field.value} value={field.value}>
										{field.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					) : (
						<p className="text-sm text-gray-700 p-2 border rounded-md bg-gray-50">
							{userData?.jobType ?? '직무 없음'}
						</p>
					)}
				</div>
				<div className="space-y-2">
					<Label htmlFor="bio">자기소개</Label>
					{isEditing ? (
						<Textarea
							id="bio"
							value={formData.bio}
							onChange={e => handleInputChange('bio', e.target.value)}
							rows={4}
						/>
					) : (
						<p className="text-sm text-gray-700 p-2 border rounded-md bg-gray-50 whitespace-pre-wrap">
							{userData?.introduction ?? '자기소개 없음'}
						</p>
					)}
				</div>
			</div>
		</>
	)
}
