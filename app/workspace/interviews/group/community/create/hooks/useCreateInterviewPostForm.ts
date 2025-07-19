import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import type { CreateInterviewPostForm } from '../types/create-interview-post'

const INITIAL_FORM: CreateInterviewPostForm = {
	title: '',
	field: '',
	maxParticipants: '3',
	date: '',
	time: '',
	type: 'technical',
	description: '',
	visibility: 'private',
	tags: '',
	thumbnail: null,
}

export function useCreateInterviewPostForm() {
	const [form, setForm] = useState<CreateInterviewPostForm>(INITIAL_FORM)
	const [error, setError] = useState<string | null>(null)

	const handleChange = (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target
		setForm(prev => ({ ...prev, [name]: value }))
	}

	const handleSelect = (name: keyof CreateInterviewPostForm, value: string) => {
		setForm(prev => ({ ...prev, [name]: value }))
	}

	const handleFile = (file: File | null) => {
		setForm(prev => ({ ...prev, thumbnail: file }))
	}

	const validate = () => {
		if (!form.title || !form.field || !form.date || !form.time) {
			setError('필수 항목을 모두 입력해주세요.')
			return false
		}
		setError(null)
		return true
	}

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault()
		if (!validate()) return
		// TODO: API 연동 및 전송
		window.location.href = '/workspace/interview/group/community'
	}

	return {
		form,
		setForm,
		error,
		handleChange,
		handleSelect,
		handleFile,
		handleSubmit,
	}
}
