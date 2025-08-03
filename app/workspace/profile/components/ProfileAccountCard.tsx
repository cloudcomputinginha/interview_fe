import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { PREPARE_FOR_RELEASE } from '@/constant'
import { useMutation } from '@tanstack/react-query'
import { deleteAccount } from '@/apis/member'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

export function ProfileAccountCard() {
	const router = useRouter()
	const [isOpen, setIsOpen] = useState(false)

	const { mutate, isPending } = useMutation({
		mutationFn: deleteAccount,
		onSuccess: () => {
			setIsOpen(false)
			router.push('/')
			toast.success('계정이 삭제되었습니다.')
		},
		onError: () => {
			toast.error('계정 삭제에 실패했습니다.')
		},
	})

	return (
		<div className="space-y-4">
			{/* <div className="flex items-center justify-between">
				<div>
					<p className="font-medium">비밀번호 변경</p>
					<p className="text-sm text-gray-500">계정 비밀번호를 변경합니다.</p>
				</div>
				<Button onClick={isNotReady} variant="outline" size="sm">
					변경하기
				</Button>
			</div> */}
			<div className="flex items-center justify-between">
				<div>
					<p className="font-medium text-red-600">계정 삭제</p>
					<p className="text-sm text-gray-500">
						계정과 모든 데이터를 영구적으로 삭제합니다.
					</p>
				</div>
				<AlertDialog open={isOpen} onOpenChange={setIsOpen}>
					<AlertDialogTrigger asChild>
						<Button variant="destructive" size="sm">
							계정 삭제
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>정말 계정을 삭제하시겠습니까?</AlertDialogTitle>
							<AlertDialogDescription>
								이 작업은 되돌릴 수 없습니다. 계정과 모든 데이터가 영구적으로
								삭제됩니다. 삭제된 데이터는 복구할 수 없으니 신중하게 결정해
								주세요.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>취소</AlertDialogCancel>
							<AlertDialogAction
								onClick={() => mutate()}
								disabled={isPending}
								className="bg-red-600 hover:bg-red-700"
							>
								{isPending ? '삭제 중...' : '계정 삭제'}
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</div>
		</div>
	)
}
