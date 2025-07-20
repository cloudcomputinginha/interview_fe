import { Button } from '@/components/ui/button'
import { isNotReady } from '@/utils/isNotReady'

export function ProfileAccountCard() {
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
				<Button onClick={isNotReady} variant="destructive" size="sm">
					계정 삭제
				</Button>
			</div>
		</div>
	)
}
