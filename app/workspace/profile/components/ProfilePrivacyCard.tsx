import { Switch } from '@/components/ui/switch'
import type { UserProfile } from '../types/profile'

interface ProfilePrivacyCardProps {
	userData: UserProfile
	formData: UserProfile
	isEditing: boolean
	handlePrivacyChange: (
		field: keyof UserProfile['privacy'],
		value: boolean
	) => void
}

export function ProfilePrivacyCard({
	userData,
	formData,
	isEditing,
	handlePrivacyChange,
}: ProfilePrivacyCardProps) {
	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<div>
					<p className="font-medium">프로필 공개</p>
					<p className="text-sm text-gray-500">
						다른 사용자에게 내 프로필을 공개합니다.
					</p>
				</div>
				<Switch
					checked={
						isEditing
							? formData.privacy.showProfile
							: userData.privacy.showProfile
					}
					onCheckedChange={checked =>
						handlePrivacyChange('showProfile', checked)
					}
					disabled={!isEditing}
				/>
			</div>
			<div className="flex items-center justify-between">
				<div>
					<p className="font-medium">활동 내역 공개</p>
					<p className="text-sm text-gray-500">
						다른 사용자에게 내 활동 내역을 공개합니다.
					</p>
				</div>
				<Switch
					checked={
						isEditing
							? formData.privacy.showActivity
							: userData.privacy.showActivity
					}
					onCheckedChange={checked =>
						handlePrivacyChange('showActivity', checked)
					}
					disabled={!isEditing}
				/>
			</div>
		</div>
	)
}
