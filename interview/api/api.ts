export type FollowUpQA = {
	question: string
	audio_path: string
	answer?: string | null
}
export type QA = {
	question: string
	audio_path: string
	answer?: string | null
	follow_up_length: number
	follow_ups?: FollowUpQA[] | null
	feedback?: string | null
}
export type Cursor = { q_idx: number; f_idx: number }
export type InterviewSession = {
	interview_id: string
	member_interview_id: string
	session_id: string
	cursor: Cursor
	question_length: number
	qa_flow: QA[]
	final_report?: string | null
}

export async function aiGetSessionByPair(
	interviewId: string | number,
	memberInterviewId: string | number
) {
	const r = await fetch(
		`${process.env.NEXT_PUBLIC_AI_SERVER_URL}/interview/session/${interviewId}/${memberInterviewId}`
	)
	if (!r.ok) throw new Error('aiGetSessionByPair failed')
	return (await r.json()) as InterviewSession
}

export async function aiGetSession(sessionId: string) {
	const r = await fetch(
		`${process.env.NEXT_PUBLIC_AI_SERVER_URL}/interview/session/${sessionId}`
	)
	if (!r.ok) throw new Error('aiGetSession failed')
	return (await r.json()) as InterviewSession
}

export async function aiGenerateQuestions(infoPayload: unknown) {
	const r = await fetch(
		`${process.env.NEXT_PUBLIC_AI_SERVER_URL}/interview/generate_questions`,
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(infoPayload),
		}
	)
	if (!r.ok) throw new Error('aiGenerateQuestions failed')
	return (await r.json()) as InterviewSession[]
}

export async function aiGenerateFollowUps(sessionId: string, index: number) {
	const r = await fetch(
		`${process.env.NEXT_PUBLIC_AI_SERVER_URL}/interview/session/${sessionId}/qa/${index}/generate_follow-ups`,
		{
			method: 'POST',
		}
	)
	if (!r.ok) throw new Error('aiGenerateFollowUps failed')
	return (await r.json()) as InterviewSession
}
