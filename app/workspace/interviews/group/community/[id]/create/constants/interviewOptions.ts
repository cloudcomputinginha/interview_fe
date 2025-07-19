import type { AiVoice } from '../types/interview'

export const AI_VOICE_OPTIONS: { value: AiVoice; label: string }[] = [
	{ value: 'female1', label: '여성 음성 1 (기본)' },
	{ value: 'female2', label: '여성 음성 2' },
	{ value: 'male1', label: '남성 음성 1' },
	{ value: 'male2', label: '남성 음성 2' },
]

export const QUESTION_COUNT_RANGE = { min: 5, max: 15, default: 10 }
export const DURATION_RANGE = { min: 1, max: 5, default: 2 }
