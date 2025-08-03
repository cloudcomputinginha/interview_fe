import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { checkHasConnectedInterview as checkResumeInterview } from '@/apis/resume'
import { checkHasConnectedInterview as checkCoverletterInterview } from '@/apis/coverletter'
import Loading from '@/components/loading'

interface DeleteConfirmWithInterviewCheckOptions {
	mutationFn: (id: number) => Promise<any>
	onSuccess?: () => void
	onError?: () => void
	successMessage?: string
	errorMessage?: string
	title?: string
	description?: string
	confirmText?: string
	cancelText?: string
	itemType: 'resume' | 'coverletter'
}

interface DeleteConfirmWithInterviewCheckReturn {
	isOpen: boolean
	openDialog: (item: { id: number; name: string }) => void
	closeDialog: () => void
	handleConfirm: () => void
	isPending: boolean
	itemToDelete: { id: number; name: string } | null
	hasConnectedInterviews: boolean
	isCheckingInterviews: boolean
	title: string
	description: string
	confirmText: string
	cancelText: string
}

export function useDeleteConfirmWithInterviewCheck({
	mutationFn,
	onSuccess,
	onError,
	successMessage = '삭제되었습니다.',
	errorMessage = '삭제에 실패했습니다.',
	title = '정말 삭제하시겠습니까?',
	description,
	confirmText = '삭제',
	cancelText = '취소',
	itemType,
}: DeleteConfirmWithInterviewCheckOptions): DeleteConfirmWithInterviewCheckReturn {
	const [isOpen, setIsOpen] = useState(false)
	const [itemToDelete, setItemToDelete] = useState<{
		id: number
		name: string
	} | null>(null)

	// 연결된 면접 확인 쿼리
	const { data: interviewData, isLoading: isCheckingInterviews } = useQuery({
		queryKey: ['connectedInterviews', itemToDelete?.id, itemType],
		queryFn: () => {
			if (!itemToDelete?.id) return null
			return itemType === 'resume'
				? checkResumeInterview(itemToDelete.id)
				: checkCoverletterInterview(itemToDelete.id)
		},
		enabled: !!itemToDelete?.id && isOpen,
	})

	const hasConnectedInterviews =
		interviewData?.result?.length && interviewData.result.length > 0

	const { mutate, isPending } = useMutation({
		mutationFn: (id: number) => mutationFn(id),
		onSuccess: () => {
			setIsOpen(false)
			setItemToDelete(null)
			toast.success(successMessage)
			onSuccess?.()
		},
		onError: () => {
			toast.error(errorMessage)
			onError?.()
		},
	})

	const openDialog = (item: { id: number; name: string }) => {
		setItemToDelete(item)
		setIsOpen(true)
	}

	const closeDialog = () => {
		setIsOpen(false)
		setItemToDelete(null)
	}

	const handleConfirm = () => {
		if (itemToDelete) {
			mutate(itemToDelete.id)
		}
	}

	const getDescription = () => {
		if (isCheckingInterviews) {
			return (
				<div className="flex items-center gap-2">
					<Loading variant="danger" />
					<span className="flex-1">연결된 면접을 확인하는 중...</span>
				</div>
			)
		}

		if (hasConnectedInterviews) {
			return `"${itemToDelete?.name}"에 연결된 면접이 있습니다. 삭제하면 연결된 면접에서도 해당 ${itemType === 'resume' ? '이력서' : '자기소개서'}를 사용할 수 없게 됩니다. 정말 삭제하시겠습니까?`
		}

		return (
			description ||
			`"${itemToDelete?.name}"을(를) 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`
		)
	}

	return {
		isOpen,
		openDialog,
		closeDialog,
		handleConfirm,
		isPending,
		itemToDelete,
		hasConnectedInterviews: hasConnectedInterviews || false,
		isCheckingInterviews,
		title,
		description: getDescription() || '',
		confirmText,
		cancelText,
	}
}
