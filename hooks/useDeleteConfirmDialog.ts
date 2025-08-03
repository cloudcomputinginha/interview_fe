import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

interface DeleteConfirmDialogOptions<T> {
	mutationFn: (id: number) => Promise<any>
	onSuccess?: () => void
	onError?: () => void
	successMessage?: string
	errorMessage?: string
	title?: string
	description?: string
	confirmText?: string
	cancelText?: string
}

interface DeleteConfirmDialogReturn {
	isOpen: boolean
	openDialog: (item: { id: number; name: string }) => void
	closeDialog: () => void
	handleConfirm: () => void
	isPending: boolean
	itemToDelete: { id: number; name: string } | null
}

export function useDeleteConfirmDialog<T>({
	mutationFn,
	onSuccess,
	onError,
	successMessage = '삭제되었습니다.',
	errorMessage = '삭제에 실패했습니다.',
	title = '정말 삭제하시겠습니까?',
	description,
	confirmText = '삭제',
	cancelText = '취소',
}: DeleteConfirmDialogOptions<T>): DeleteConfirmDialogReturn {
	const [isOpen, setIsOpen] = useState(false)
	const [itemToDelete, setItemToDelete] = useState<{
		id: number
		name: string
	} | null>(null)

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

	const defaultDescription = itemToDelete
		? `"${itemToDelete.name}"을(를) 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`
		: '이 작업은 되돌릴 수 없습니다.'

	return {
		isOpen,
		openDialog,
		closeDialog,
		handleConfirm,
		isPending,
		itemToDelete,
		dialogProps: {
			title,
			description: description || defaultDescription,
			confirmText,
			cancelText,
		},
	}
}
