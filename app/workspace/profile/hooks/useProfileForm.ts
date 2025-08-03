'use client'

import { useEffect, useState } from 'react'
import type { UserProfile } from '../types/profile'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { UpdateInfoDTO } from '@/apis/types/member-types'
import { updateBasicInfo } from '@/apis/member'
import { useMemberSession } from '@/components/member-session-context'
import { toast } from 'sonner'

export function useProfileForm(initialData: UserProfile) {
	const queryClient = useQueryClient()

	const [userData, setUserData] = useState<UserProfile>(initialData)
	const [isEditing, setIsEditing] = useState(false)
	const [formData, setFormData] = useState<UserProfile>(initialData)

	useEffect(() => {
		setUserData(initialData)
		setFormData(initialData)
	}, [initialData])

	const { memberId } = useMemberSession()

	const { mutateAsync: updateMemberInfo } = useMutation({
		mutationFn: (data: UpdateInfoDTO) => updateBasicInfo(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['member', memberId] })
			toast.success('프로필이 성공적으로 저장되었습니다.')
			setIsEditing(false)
			setUserData(formData)
		},
	})

	const handleInputChange = (
		field: keyof UserProfile,
		value: string | boolean
	) => {
		setFormData(prev => ({
			...prev,
			[field]: value,
		}))
	}

	const handleSave = async () => {
		await updateMemberInfo({
			name: formData.name,
			phone: formData.phone,
			jobType: formData.jobField,
			introduction: formData.bio,
		})
	}

	const handleCancel = () => {
		setFormData(userData)
		setIsEditing(false)
	}

	return {
		userData,
		formData,
		isEditing,
		setIsEditing,
		handleInputChange,
		handleSave,
		handleCancel,
	}
}
