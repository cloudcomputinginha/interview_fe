'use client'

import { useState } from 'react'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

import { createInterview } from '@/apis/interview'
import type { InterviewCreateDTO } from '@/apis/types/interview-types'
import {
	initialFormState,
	type InterviewFormState,
} from '@/lib/interview/types'

const step1Schema = z.object({
	interviewType: z.enum(['individual', 'group']),
	company: z.string().min(1),
	position: z.string().min(1),
	title: z.string().min(1),
	sessionName: z.string().optional(),
})

const step2Schema = z.object({
	resumeId: z.string().min(1),
	coverLetterId: z.string().min(1),
	newCoverLetterTitle: z.string().optional(),
	newCoverLetterContent: z.string().optional(),
})

const convertDate = (string: string) => {
	const [year, month, day] = string
		.replace(/\./g, '')
		.trim()
		.split(' ')
		.map(val => val.padStart(2, '0'))

	const isoDate = `${year}-${month}-${day}`
	return isoDate
}

export function useInterviewWizard() {
	const [form, setForm] = useState<InterviewFormState>(initialFormState)
	const [step, setStep] = useState(1)
	const totalSteps = form.interviewType === 'individual' ? 5 : 6

	const router = useRouter()

	const { mutate: createInterviewMutation, isPending } = useMutation({
		mutationFn: createInterview,
		onSuccess: data => {
			const id = (data as any)?.result?.interviewId
			if (id) {
				alert('면접 생성이 완료되었습니다.')
				router.push(`/workspace/interviews`)
			} else {
				alert('면접 생성은 성공했으나, 인터뷰 ID를 찾을 수 없습니다.')
				console.error('[면접 생성 성공 but ID 없음]', data)
			}
		},
		onError: () =>
			alert('면접 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'),
	})

	const validate = (): boolean => {
		if (step === 1) return step1Schema.safeParse(form).success
		if (step === 2) return step2Schema.safeParse(form).success
		if (step === 4 && form.startType === 'scheduled')
			return !!form.scheduledDate && !!form.scheduledTime
		return true
	}

	const prev = () => (step > 1 ? setStep(step - 1) : undefined)

	const next = async (memberId?: string, router?: any) => {
		const ok = validate()
		if (!ok) return

		if (step < totalSteps) {
			setStep(step + 1)
			return
		}

		if (!memberId) {
			alert('로그인이 필요합니다.')
			return
		}
		if (!router) {
			alert('라우터가 필요합니다.')
			return
		}
		try {
			setForm(prev => ({ ...prev, submitting: true }))
			const payload: InterviewCreateDTO = {
				name: form.title,
				description: form.description,
				corporateName: form.company,
				jobName: form.position,
				interviewFormat:
					form.interviewType === 'individual' ? 'INDIVIDUAL' : 'GROUP',
				interviewType:
					form.interviewStyle === 'personality' ? 'PERSONALITY' : 'TECHNICAL',
				voiceType: (
					form.voiceType || ''
				).toUpperCase() as InterviewCreateDTO['voiceType'],
				questionNumber: form.questionCount,
				answerTime: form.answerDuration,
				startType: form.startType === 'now' ? 'NOW' : 'SCHEDULED',
				scheduledDate: convertDate(
					form.scheduledDate?.toLocaleDateString() || ''
				),
				scheduledTime: form.scheduledTime,
				maxParticipants: form.maxParticipants
					? Number(form.maxParticipants)
					: undefined,
				isOpen: form.visibility === 'public',
				resumeId: Number(form.resumeId),
				resumeTitle: form.resumeTitle,
				coverLetterId: Number(form.coverLetterId),
				coverLetterTitle: form.coverLetterTitle,
				inviteEmailDTOList:
					form.inviteEmails
						?.filter(e => e.email)
						.map(e => ({ email: e.email })) || [],
			}
			createInterviewMutation(payload)
		} catch (e) {
			alert('면접 생성 중 오류가 발생했습니다.')
		} finally {
			setForm(prev => ({ ...prev, submitting: false }))
		}
	}

	return {
		form,
		setForm,
		step,
		totalSteps,
		next,
		prev,
		submitting: isPending,
	}
}
