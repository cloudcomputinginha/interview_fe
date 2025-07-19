import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import type { Participant } from '../types/interview'

interface InterviewStep1Props {
	sessionName: string
	participants: Participant[]
	date: string
	time: string
	setField: (field: string, value: any) => void
	formatDateTime: (date: string, time: string) => string
}

export function InterviewStep1({
	sessionName,
	participants,
	date,
	time,
	setField,
	formatDateTime,
}: InterviewStep1Props) {
	return (
		<div className="space-y-6">
			<div className="bg-blue-50 p-4 rounded-lg">
				<div className="flex items-start">
					<span className="h-5 w-5 text-blue-500 mr-3 mt-0.5">ℹ️</span>
					<div>
						<h3 className="font-medium text-blue-700">면접 예약 안내</h3>
						<p className="text-blue-600 text-sm mt-1">
							설정한 날짜와 시간에 면접이 자동으로 시작됩니다. 모든 참가자는
							시작 시간 10분 전부터 대기실에 입장할 수 있습니다.
						</p>
					</div>
				</div>
			</div>
			<div className="space-y-2">
				<Label htmlFor="sessionName" className="text-sm font-medium">
					면접 제목
				</Label>
				<Input
					id="sessionName"
					value={sessionName}
					onChange={e => setField('sessionName', e.target.value)}
					placeholder="면접 제목을 입력하세요"
				/>
			</div>
			<div className="space-y-2">
				<Label className="text-sm font-medium">참여자 목록</Label>
				<div className="border rounded-lg p-4 space-y-3">
					{participants.map(participant => (
						<div
							key={participant.id}
							className="flex items-center justify-between"
						>
							<div className="flex items-center">
								<Avatar className="h-8 w-8 mr-3">
									<AvatarFallback className="bg-[#8FD694] text-white">
										{participant.name.charAt(0)}
									</AvatarFallback>
								</Avatar>
								<span>{participant.name}</span>
							</div>
							<div className="flex items-center space-x-2">
								{participant.hasSubmittedDocs ? (
									<Badge className="bg-green-100 text-green-800 hover:bg-green-100">
										자료 제출 완료
									</Badge>
								) : (
									<Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
										자료 미제출
									</Badge>
								)}
								{participant.isHost && (
									<Badge className="bg-[#8FD694] hover:bg-[#8FD694]">
										호스트
									</Badge>
								)}
							</div>
						</div>
					))}
				</div>
				<p className="text-sm text-gray-500 mt-1">
					참가자들은 면접 참여 신청 시 자신의 이력서와 자기소개서를 선택하게
					됩니다.
				</p>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label htmlFor="date" className="text-sm font-medium">
						면접 날짜 <span className="text-red-500">*</span>
					</Label>
					<div className="flex items-center">
						<span className="h-4 w-4 text-gray-500 mr-2">📅</span>
						<Input
							id="date"
							type="date"
							value={date}
							onChange={e => setField('date', e.target.value)}
							min={new Date().toISOString().split('T')[0]}
							required
						/>
					</div>
				</div>
				<div className="space-y-2">
					<Label htmlFor="time" className="text-sm font-medium">
						면접 시간 <span className="text-red-500">*</span>
					</Label>
					<div className="flex items-center">
						<span className="h-4 w-4 text-gray-500 mr-2">⏰</span>
						<Input
							id="time"
							type="time"
							value={time}
							onChange={e => setField('time', e.target.value)}
							required
						/>
					</div>
				</div>
			</div>
			{date && time && (
				<div className="p-3 bg-gray-50 rounded-lg text-center">
					<p className="text-sm text-gray-600">
						면접은{' '}
						<span className="font-medium">{formatDateTime(date, time)}</span>에
						시작됩니다.
					</p>
				</div>
			)}
		</div>
	)
}
