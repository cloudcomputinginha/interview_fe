import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import Loading from '@/components/loading'
import { ConnectedInterviewsList } from './connected-interviews-list'
import type { InterviewGroupCardDTO } from '@/apis/types/interview-types'

interface DeleteConfirmDialogProps {
	isOpen: boolean
	onOpenChange: (open: boolean) => void
	title: string
	description: string
	onConfirm: () => void
	onCancel?: () => void
	confirmText?: string
	cancelText?: string
	isPending?: boolean
	confirmButtonClassName?: string
	connectedInterviews?: InterviewGroupCardDTO[]
	itemName?: string
	itemType?: 'resume' | 'coverletter'
}

export function DeleteConfirmDialog({
	isOpen,
	onOpenChange,
	title,
	description,
	onConfirm,
	onCancel,
	confirmText = '삭제',
	cancelText = '취소',
	isPending = false,
	confirmButtonClassName = 'bg-red-600 hover:bg-red-700',
	connectedInterviews,
	itemName,
	itemType,
}: DeleteConfirmDialogProps) {
	const handleCancel = () => {
		onCancel?.()
		onOpenChange(false)
	}

	return (
		<AlertDialog open={isOpen} onOpenChange={onOpenChange}>
			<AlertDialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					<AlertDialogDescription className="space-y-4">
						{description}

						{connectedInterviews &&
							connectedInterviews.length > 0 &&
							itemName &&
							itemType && (
								<ConnectedInterviewsList
									interviews={connectedInterviews}
									itemName={itemName}
									itemType={itemType}
								/>
							)}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={handleCancel}>
						{cancelText}
					</AlertDialogCancel>
					<AlertDialogAction
						onClick={onConfirm}
						disabled={isPending}
						className={confirmButtonClassName}
					>
						{isPending ? <Loading variant="danger" /> : confirmText}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
