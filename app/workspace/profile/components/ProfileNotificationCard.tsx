import { Switch } from '@/components/ui/switch'
import type { UserProfile } from '../types/profile'

interface ProfileNotificationCardProps {
	userData: UserProfile
	formData: UserProfile
	isEditing: boolean
	handleNotificationChange: (
		field: keyof UserProfile['notifications'],
		value: boolean
	) => void
}

export function ProfileNotificationCard({
	userData,
	formData,
	isEditing,
	handleNotificationChange,
}: ProfileNotificationCardProps) {
	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<div>
					<p className="font-medium">이메일 알림</p>
					<p className="text-sm text-gray-500">
						면접 관련 이메일 알림을 받습니다.
					</p>
				</div>
				<Switch
					checked={
						isEditing
							? formData.notifications.email
							: userData.notifications.email
					}
					onCheckedChange={checked =>
						handleNotificationChange('email', checked)
					}
					disabled={!isEditing}
				/>
			</div>
			<div className="flex items-center justify-between">
				<div>
					<p className="font-medium">면접 알림</p>
					<p className="text-sm text-gray-500">
						예정된 면접에 대한 알림을 받습니다.
					</p>
				</div>
				<Switch
					checked={
						isEditing
							? formData.notifications.interview
							: userData.notifications.interview
					}
					onCheckedChange={checked =>
						handleNotificationChange('interview', checked)
					}
					disabled={!isEditing}
				/>
			</div>
			<div className="flex items-center justify-between">
				<div>
					<p className="font-medium">일정 리마인더</p>
					<p className="text-sm text-gray-500">
						면접 시작 10분 전에 알림을 받습니다.
					</p>
				</div>
				<Switch
					checked={
						isEditing
							? formData.notifications.reminder
							: userData.notifications.reminder
					}
					onCheckedChange={checked =>
						handleNotificationChange('reminder', checked)
					}
					disabled={!isEditing}
				/>
			</div>
			<div className="flex items-center justify-between">
				<div>
					<p className="font-medium">마케팅 알림</p>
					<p className="text-sm text-gray-500">
						새로운 기능 및 프로모션 정보를 받습니다.
					</p>
				</div>
				<Switch
					checked={
						isEditing
							? formData.notifications.marketing
							: userData.notifications.marketing
					}
					onCheckedChange={checked =>
						handleNotificationChange('marketing', checked)
					}
					disabled={!isEditing}
				/>
			</div>
		</div>
	)
}
