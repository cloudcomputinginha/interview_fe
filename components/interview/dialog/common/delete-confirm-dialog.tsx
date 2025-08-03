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

interface DeleteConfirmDialogProps {
	isOpen: boolean
	onOpenChange: (open: boolean) => void
	title: string
	description: string | React.ReactNode
	onConfirm: () => void
	onCancel?: () => void
	confirmText?: string
	cancelText?: string
	isPending?: boolean
	confirmButtonClassName?: string
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
