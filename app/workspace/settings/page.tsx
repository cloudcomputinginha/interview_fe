'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
	ArrowLeft,
	Bell,
	Mic,
	Clock,
	Users,
	Sun,
	Volume2,
	Languages,
	Shield,
	Lock,
	Eye,
	Smartphone,
	Laptop,
	HelpCircle,
} from 'lucide-react'

export default function SettingsPage() {
	const [interviewType, setInterviewType] = useState('technical')
	const [duration, setDuration] = useState(2)
	const [format, setFormat] = useState('1:1')
	const [theme, setTheme] = useState('system')
	const [language, setLanguage] = useState('ko')
	const [notifications, setNotifications] = useState(true)
	const [soundEffects, setSoundEffects] = useState(true)
	const [autoSave, setAutoSave] = useState(true)
	const [privacyMode, setPrivacyMode] = useState(false)

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-4xl mx-auto p-6">
				{/* Header */}
				<div className="mb-8">
					<Link
						href="/workspace"
						className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
					>
						<ArrowLeft className="h-4 w-4 mr-1" /> 워크스페이스로 돌아가기
					</Link>
					<h1 className="text-2xl font-bold">설정</h1>
					<p className="text-gray-600 mt-2">
						앱 설정 및 면접 기본 옵션을 관리합니다.
					</p>
				</div>

				{/* Settings Tabs */}
				<Tabs defaultValue="general" className="space-y-6">
					<TabsList className="grid grid-cols-3 w-full max-w-md">
						<TabsTrigger value="general">일반</TabsTrigger>
						<TabsTrigger value="interview">면접 설정</TabsTrigger>
						<TabsTrigger value="privacy">개인정보 및 보안</TabsTrigger>
					</TabsList>

					{/* General Settings */}
					<TabsContent value="general">
						<div className="grid gap-6">
							<Card>
								<CardHeader>
									<CardTitle>앱 설정</CardTitle>
									<CardDescription>
										앱의 기본 설정을 관리합니다.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-6">
									{/* Theme */}
									<div className="space-y-2">
										<div className="flex items-center justify-between">
											<div className="flex items-center space-x-2">
												<Sun className="h-5 w-5 text-gray-500" />
												<Label htmlFor="theme" className="text-base">
													테마
												</Label>
											</div>
											<Select value={theme} onValueChange={setTheme}>
												<SelectTrigger id="theme" className="w-[180px]">
													<SelectValue placeholder="테마 선택" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="light">라이트 모드</SelectItem>
													<SelectItem value="dark">다크 모드</SelectItem>
													<SelectItem value="system">
														시스템 설정 사용
													</SelectItem>
												</SelectContent>
											</Select>
										</div>
										<p className="text-sm text-gray-500 pl-7">
											앱의 테마를 변경합니다.
										</p>
									</div>

									<Separator />

									{/* Language */}
									<div className="space-y-2">
										<div className="flex items-center justify-between">
											<div className="flex items-center space-x-2">
												<Languages className="h-5 w-5 text-gray-500" />
												<Label htmlFor="language" className="text-base">
													언어
												</Label>
											</div>
											<Select value={language} onValueChange={setLanguage}>
												<SelectTrigger id="language" className="w-[180px]">
													<SelectValue placeholder="언어 선택" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="ko">한국어</SelectItem>
													<SelectItem value="en">English</SelectItem>
													<SelectItem value="ja">日本語</SelectItem>
													<SelectItem value="zh">中文</SelectItem>
												</SelectContent>
											</Select>
										</div>
										<p className="text-sm text-gray-500 pl-7">
											앱의 표시 언어를 변경합니다.
										</p>
									</div>

									<Separator />

									{/* Notifications */}
									<div className="space-y-2">
										<div className="flex items-center justify-between">
											<div className="flex items-center space-x-2">
												<Bell className="h-5 w-5 text-gray-500" />
												<Label htmlFor="notifications" className="text-base">
													알림
												</Label>
											</div>
											<Switch
												id="notifications"
												checked={notifications}
												onCheckedChange={setNotifications}
											/>
										</div>
										<p className="text-sm text-gray-500 pl-7">
											면접 알림 및 시스템 알림을 받습니다.
										</p>
									</div>

									<Separator />

									{/* Sound Effects */}
									<div className="space-y-2">
										<div className="flex items-center justify-between">
											<div className="flex items-center space-x-2">
												<Volume2 className="h-5 w-5 text-gray-500" />
												<Label htmlFor="soundEffects" className="text-base">
													소리 효과
												</Label>
											</div>
											<Switch
												id="soundEffects"
												checked={soundEffects}
												onCheckedChange={setSoundEffects}
											/>
										</div>
										<p className="text-sm text-gray-500 pl-7">
											앱 사용 중 소리 효과를 활성화합니다.
										</p>
									</div>

									<Separator />

									{/* Auto Save */}
									<div className="space-y-2">
										<div className="flex items-center justify-between">
											<div className="flex items-center space-x-2">
												<Laptop className="h-5 w-5 text-gray-500" />
												<Label htmlFor="autoSave" className="text-base">
													자동 저장
												</Label>
											</div>
											<Switch
												id="autoSave"
												checked={autoSave}
												onCheckedChange={setAutoSave}
											/>
										</div>
										<p className="text-sm text-gray-500 pl-7">
											작성 중인 내용을 자동으로 저장합니다.
										</p>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>기기 정보</CardTitle>
									<CardDescription>
										앱 버전 및 기기 정보를 확인합니다.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="flex justify-between items-center">
										<div className="flex items-center space-x-2">
											<Smartphone className="h-5 w-5 text-gray-500" />
											<span className="text-sm">앱 버전</span>
										</div>
										<span className="text-sm text-gray-500">1.2.3</span>
									</div>

									<div className="flex justify-between items-center">
										<div className="flex items-center space-x-2">
											<HelpCircle className="h-5 w-5 text-gray-500" />
											<span className="text-sm">지원</span>
										</div>
										<Button variant="link" className="p-0 h-auto text-sm">
											문의하기
										</Button>
									</div>
								</CardContent>
							</Card>
						</div>
					</TabsContent>

					{/* Interview Settings */}
					<TabsContent value="interview">
						<Card>
							<CardHeader>
								<CardTitle>면접 기본 설정</CardTitle>
								<CardDescription>
									면접 진행 시 기본적으로 적용될 설정입니다.
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								{/* AI Voice */}
								<div className="space-y-2">
									<div className="flex items-center space-x-2">
										<Mic className="h-5 w-5 text-[#8FD694]" />
										<Label htmlFor="aiVoice" className="text-base">
											AI 음성 선택
										</Label>
									</div>
									<Select defaultValue="female1">
										<SelectTrigger id="aiVoice" className="w-full">
											<SelectValue placeholder="AI 음성을 선택하세요" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="female1">
												여성 음성 1 (기본)
											</SelectItem>
											<SelectItem value="female2">여성 음성 2</SelectItem>
											<SelectItem value="male1">남성 음성 1</SelectItem>
											<SelectItem value="male2">남성 음성 2</SelectItem>
										</SelectContent>
									</Select>
									<p className="text-sm text-gray-500">
										면접관의 음성을 선택합니다. 실제 면접과 유사한 경험을 위해
										선택하세요.
									</p>
								</div>

								<Separator />

								{/* Interview Type */}
								<div className="space-y-2">
									<div className="flex items-center space-x-2">
										<Users className="h-5 w-5 text-[#8FD694]" />
										<Label className="text-base">면접 유형</Label>
									</div>
									<div className="flex items-center justify-between p-3 border rounded-md">
										<div className="flex items-center">
											<span className="mr-2">인성 면접</span>
										</div>
										<Switch
											checked={interviewType === 'technical'}
											onCheckedChange={checked =>
												setInterviewType(checked ? 'technical' : 'personality')
											}
										/>
										<div className="flex items-center">
											<span className="mr-2">기술 면접</span>
										</div>
									</div>
									<p className="text-sm text-gray-500">
										인성 면접은 인성, 가치관, 경험에 관한 질문 위주로
										진행됩니다. 기술 면접은 직무 관련 전문 지식과 문제 해결
										능력을 평가합니다.
									</p>
								</div>

								<Separator />

								{/* Answer Duration */}
								<div className="space-y-2">
									<div className="flex items-center space-x-2">
										<Clock className="h-5 w-5 text-[#8FD694]" />
										<Label className="text-base">답변 시간 설정</Label>
									</div>
									<div className="space-y-4">
										<div className="flex justify-between items-center">
											<span className="text-sm text-gray-500">답변 시간</span>
											<span className="font-medium">{duration}분</span>
										</div>
										<Slider
											value={[duration]}
											min={1}
											max={5}
											step={1}
											onValueChange={value => setDuration(value[0])}
											className="w-full"
										/>
										<div className="flex justify-between text-xs text-gray-500">
											<span>1분</span>
											<span>2분</span>
											<span>3분</span>
											<span>4분</span>
											<span>5분</span>
										</div>
									</div>
									<p className="text-sm text-gray-500">
										각 질문당 답변 시간을 설정합니다. 기본값은 2분입니다.
									</p>
								</div>

								<Separator />

								{/* Interview Format */}
								<div className="space-y-2">
									<div className="flex items-center space-x-2">
										<Users className="h-5 w-5 text-[#8FD694]" />
										<Label className="text-base">면접 방식</Label>
									</div>
									<RadioGroup
										value={format}
										onValueChange={setFormat}
										className="flex space-x-4"
									>
										<div className="flex items-center space-x-2">
											<RadioGroupItem value="1:1" id="format-1" />
											<Label htmlFor="format-1">1:1 면접</Label>
										</div>
										<div className="flex items-center space-x-2">
											<RadioGroupItem value="1:n" id="format-2" />
											<Label htmlFor="format-2">다수 면접관</Label>
										</div>
									</RadioGroup>
									<p className="text-sm text-gray-500">
										1:1은 단일 면접관, 다수 면접관은 여러 명의 면접관이 번갈아
										질문합니다.
									</p>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					{/* Privacy Settings */}
					<TabsContent value="privacy">
						<Card>
							<CardHeader>
								<CardTitle>개인정보 및 보안</CardTitle>
								<CardDescription>
									개인정보 보호 및 보안 설정을 관리합니다.
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								{/* Privacy Mode */}
								<div className="space-y-2">
									<div className="flex items-center justify-between">
										<div className="flex items-center space-x-2">
											<Eye className="h-5 w-5 text-gray-500" />
											<Label htmlFor="privacyMode" className="text-base">
												개인정보 보호 모드
											</Label>
										</div>
										<Switch
											id="privacyMode"
											checked={privacyMode}
											onCheckedChange={setPrivacyMode}
										/>
									</div>
									<p className="text-sm text-gray-500 pl-7">
										개인 정보를 보호하기 위해 민감한 정보를 자동으로 가립니다.
									</p>
								</div>

								<Separator />

								{/* Data Sharing */}
								<div className="space-y-2">
									<div className="flex items-center justify-between">
										<div className="flex items-center space-x-2">
											<Shield className="h-5 w-5 text-gray-500" />
											<Label htmlFor="dataSharing" className="text-base">
												데이터 공유
											</Label>
										</div>
										<Switch id="dataSharing" defaultChecked />
									</div>
									<p className="text-sm text-gray-500 pl-7">
										서비스 개선을 위해 익명화된 사용 데이터를 공유합니다.
									</p>
								</div>

								<Separator />

								{/* Account Security */}
								<div className="space-y-2">
									<div className="flex items-center justify-between">
										<div className="flex items-center space-x-2">
											<Lock className="h-5 w-5 text-gray-500" />
											<Label htmlFor="accountSecurity" className="text-base">
												계정 보안
											</Label>
										</div>
										<Button variant="outline" size="sm">
											변경
										</Button>
									</div>
									<p className="text-sm text-gray-500 pl-7">
										비밀번호 및 계정 보안 설정을 변경합니다.
									</p>
								</div>

								<Separator />

								{/* Data Management */}
								<div className="space-y-4 mt-4">
									<h3 className="text-base font-medium">데이터 관리</h3>
									<div className="grid grid-cols-2 gap-4">
										<Button variant="outline" className="w-full">
											데이터 내보내기
										</Button>
										<Button
											variant="outline"
											className="w-full text-red-500 hover:text-red-600"
										>
											데이터 삭제
										</Button>
									</div>
									<p className="text-sm text-gray-500">
										데이터 내보내기를 통해 모든 면접 기록과 자기소개서를
										다운로드할 수 있습니다. 데이터 삭제는 모든 개인 정보를
										영구적으로 제거합니다.
									</p>
								</div>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>

				{/* Save Button */}
				<div className="mt-8 flex justify-end">
					<Button className="bg-[#8FD694] hover:bg-[#7ac47f] text-white">
						설정 저장
					</Button>
				</div>
			</div>
		</div>
	)
}
