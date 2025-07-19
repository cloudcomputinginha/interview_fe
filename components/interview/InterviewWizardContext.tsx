'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'

export interface InterviewWizardState {
	// 기본 정보
	interviewType: 'individual' | 'group' | ''
	title: string
	sessionName: string
	company: string
	position: string

	// 데이터 선택
	resumeId: string
	coverLetterId: string

	// 면접 옵션
	voiceType: 'female1' | 'female2' | 'male1' | 'male2'
	interviewStyle: 'personality' | 'technical'
	answerDuration: number

	// 스케줄링
	startType: 'now' | 'scheduled'
	scheduledDate: string
	scheduledTime: string

	// 그룹 면접 설정
	maxParticipants: 2 | 3 | 4 | 5
	visibility: 'public' | 'private'
	inviteEmails: string[]
}

interface InterviewWizardContextType {
	state: InterviewWizardState
	setState: (updates: Partial<InterviewWizardState>) => void
	currentStep: number
	setCurrentStep: (step: number) => void
	isStepValid: (step: number) => boolean
	getTotalSteps: () => number
}

const InterviewWizardContext = createContext<
	InterviewWizardContextType | undefined
>(undefined)

const initialState: InterviewWizardState = {
	interviewType: '',
	title: '',
	sessionName: '',
	company: '',
	position: '',
	resumeId: '',
	coverLetterId: '',
	voiceType: 'female1',
	interviewStyle: 'personality',
	answerDuration: 3,
	startType: 'now',
	scheduledDate: '',
	scheduledTime: '',
	maxParticipants: 4,
	visibility: 'public',
	inviteEmails: [],
}

export function InterviewWizardProvider({ children }: { children: ReactNode }) {
	const [state, setStateInternal] = useState<InterviewWizardState>(initialState)
	const [currentStep, setCurrentStep] = useState(1)

	const setState = (updates: Partial<InterviewWizardState>) => {
		setStateInternal(prev => ({ ...prev, ...updates }))
	}

	const isStepValid = (step: number): boolean => {
		switch (step) {
			case 1: // 면접 유형 및 기본 정보
				if (!state.interviewType) return false
				if (!state.company || !state.position) return false
				if (state.interviewType === 'individual' && !state.title) return false
				if (state.interviewType === 'group' && !state.sessionName) return false
				return true
			case 2: // 데이터 선택
				return state.resumeId !== '' && state.coverLetterId !== ''
			case 3: // 면접 옵션
				return true // 기본값이 있으므로 항상 유효
			case 4: // 스케줄링
				if (state.startType === 'scheduled') {
					return state.scheduledDate !== '' && state.scheduledTime !== ''
				}
				return true
			case 5: // 그룹 면접 설정 (그룹 면접인 경우만)
				if (state.interviewType === 'group') {
					return state.visibility !== ''
				}
				return true
			case 6: // 미리보기
				return true
			default:
				return false
		}
	}

	const getTotalSteps = (): number => {
		if (state.interviewType === 'individual') {
			return 5 // 유형선택, 데이터선택, 옵션, 스케줄링, 미리보기
		} else if (state.interviewType === 'group') {
			return 6 // 유형선택, 데이터선택, 옵션, 스케줄링, 그룹설정, 미리보기
		}
		return 6
	}

	return (
		<InterviewWizardContext.Provider
			value={{
				state,
				setState,
				currentStep,
				setCurrentStep,
				isStepValid,
				getTotalSteps,
			}}
		>
			{children}
		</InterviewWizardContext.Provider>
	)
}

export function useInterviewWizard() {
	const context = useContext(InterviewWizardContext)
	if (context === undefined) {
		throw new Error(
			'useInterviewWizard must be used within an InterviewWizardProvider'
		)
	}
	return context
}
