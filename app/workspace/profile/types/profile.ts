export interface NotificationSettings {
	email: boolean
	interview: boolean
	reminder: boolean
	marketing: boolean
}

export interface PrivacySettings {
	showProfile: boolean
	showActivity: boolean
}

export interface UserProfile {
	name: string
	email: string
	phone: string
	company: string
	position: string
	bio: string
	jobField: string
	profileImage: string
	notifications: NotificationSettings
	privacy: PrivacySettings
}
