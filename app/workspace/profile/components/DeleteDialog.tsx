import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from '@/components/ui/dialog'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteInterview } from '@/apis/interview'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useMemberSession } from '@/components/member-session-context'
import Loading from '../../loading'
import { PREPARE_FOR_DELETE_INTERVIEW } from '@/constant'

export default function DeleteDialog({
	open,
	onOpenChange,
	interview,
	onDeleted,
}: {
	open: boolean
	onOpenChange: (open: boolean) => void
	interview: any
	onDeleted: () => void
}) {
	const queryClient = useQueryClient()

	const { memberId } = useMemberSession()
	const { mutate, isPending } = useMutation({
		mutationFn: () => deleteInterview(interview?.interviewId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['myInterviewList', memberId] })
			onDeleted()
			toast.success('면접이 삭제되었습니다.')
		},
		onError: () => {
			toast.error('삭제에 실패했어요.')
		},
	})

	if (!interview) return null

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>면접 삭제</DialogTitle>
				</DialogHeader>
				<div>
					정말 <b>{interview.name}</b> 면접을 삭제하시겠어요?
					<br />
					삭제하면 복구할 수 없습니다.
				</div>
				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
						disabled={isPending}
					>
						취소
					</Button>
					<Button
						variant="destructive"
						onClick={() => toast.info(PREPARE_FOR_DELETE_INTERVIEW)}
						disabled={isPending}
					>
						{isPending ? <Loading /> : '삭제'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
