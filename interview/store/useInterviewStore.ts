// useInterviewStore.ts
import { create } from 'zustand'

type SessionId = string
type MemberId = number

type Questions = Record<SessionId, string[]>
type FollowUpQuestions = Record<SessionId, Record<number, string[]>>
type QuestionAudio = Record<SessionId, Record<number, string>>
type FollowUpQuestionAudio = Record<
	SessionId,
	Record<number, Record<number, string>>
>

type DownloadingState = Record<
	SessionId,
	{
		q: Record<number, boolean>
		fq: Record<number, Record<number, boolean>>
	}
>

type SessionMemberMap = Record<SessionId, MemberId>

export type DownloadFn = (fileRoute: string) => string | Promise<string>

export type InterviewState = {
	// Data
	questions: Questions
	followUpQuestions: FollowUpQuestions
	questionAudio: QuestionAudio
	followUpQuestionAudio: FollowUpQuestionAudio

	// Pointer
	currentSessionId: SessionId | null
	currentQuestionIndex: number | null
	currentFollowUpQuestionIndex: number | null

	// Status
	downloading: DownloadingState

	// Mapping
	sessionMemberMap: SessionMemberMap

	bindSessionToMember: (sessionId: SessionId, memberId: MemberId) => void
	unbindSession: (sessionId: SessionId) => void

	setQuestions: (
		sessionId: SessionId,
		questions: string[],
		strategy?: 'replace' | 'append'
	) => void
	insertQuestion: (
		sessionId: SessionId,
		questionIndex: number,
		text: string
	) => void

	replaceFollowUps: (
		sessionId: SessionId,
		questionIndex: number,
		followUps: string[]
	) => void
	appendFollowUps: (
		sessionId: SessionId,
		questionIndex: number,
		followUps: string[],
		dedupe?: boolean
	) => void
	insertFollowUpQuestion: (
		sessionId: SessionId,
		questionIndex: number,
		followUpText: string,
		followUpIndex?: number
	) => void

	setCurrent: (
		sessionId: SessionId | null,
		qIndex: number | null,
		fIndex: number | null
	) => void

	generateAudioRoute: (
		sessionId: SessionId,
		questionIndex: number,
		followUpIndex?: number
	) => string
	isDownloadingAudio: (
		sessionId: SessionId,
		questionIndex: number,
		followUpIndex?: number
	) => boolean
	downloadAudio: (
		sessionId: SessionId,
		questionIndex: number,
		followUpIndex?: number,
		downloadFn?: DownloadFn
	) => Promise<string>
	downloadAudios: (
		items: Array<{
			sessionId: SessionId
			questionIndex: number
			followUpIndex?: number
		}>,
		downloadFn?: DownloadFn
	) => Promise<string[]>
}

const ensureSession = (s: InterviewState, sessionId: SessionId) => {
	if (!s.questions[sessionId]) s.questions[sessionId] = []
	if (!s.followUpQuestions[sessionId]) s.followUpQuestions[sessionId] = {}
	if (!s.questionAudio[sessionId]) s.questionAudio[sessionId] = {}
	if (!s.followUpQuestionAudio[sessionId])
		s.followUpQuestionAudio[sessionId] = {}
	if (!s.downloading[sessionId]) s.downloading[sessionId] = { q: {}, fq: {} }
}

export const useInterviewStore = create<InterviewState>()((set, get) => ({
	questions: {},
	followUpQuestions: {},
	questionAudio: {},
	followUpQuestionAudio: {},

	currentSessionId: null,
	currentQuestionIndex: null,
	currentFollowUpQuestionIndex: null,

	downloading: {},
	sessionMemberMap: {},

	bindSessionToMember: (sessionId, memberId) =>
		set((s: InterviewState) => {
			s.sessionMemberMap[sessionId] = memberId
			return s
		}),

	unbindSession: sessionId =>
		set(s => {
			delete s.sessionMemberMap[sessionId]
			return s
		}),

	setQuestions: (sessionId, qs, strategy = 'replace') =>
		set(s => {
			ensureSession(s, sessionId)
			if (strategy === 'replace') s.questions[sessionId] = [...qs]
			else s.questions[sessionId].push(...qs)
			return s
		}),

	insertQuestion: (sessionId, questionIndex, text) =>
		set(s => {
			ensureSession(s, sessionId)
			const list = s.questions[sessionId]
			while (list.length <= questionIndex) list.push('')
			list[questionIndex] = text
			return s
		}),

	replaceFollowUps: (sessionId, questionIndex, followUps) =>
		set(s => {
			ensureSession(s, sessionId)
			s.followUpQuestions[sessionId][questionIndex] = [...followUps]
			return s
		}),

	appendFollowUps: (sessionId, questionIndex, followUps, dedupe = false) =>
		set(s => {
			ensureSession(s, sessionId)
			const bucket = (s.followUpQuestions[sessionId][questionIndex] ||= [])
			const merged = dedupe
				? Array.from(new Set([...bucket, ...followUps]))
				: [...bucket, ...followUps]
			s.followUpQuestions[sessionId][questionIndex] = merged
			return s
		}),

	insertFollowUpQuestion: (
		sessionId,
		questionIndex,
		followUpText,
		followUpIndex
	) =>
		set(s => {
			ensureSession(s, sessionId)
			const bucket = (s.followUpQuestions[sessionId][questionIndex] ||= [])
			if (typeof followUpIndex === 'number') {
				while (bucket.length <= followUpIndex) bucket.push('')
				bucket[followUpIndex] = followUpText
			} else {
				bucket.push(followUpText)
			}
			return s
		}),

	setCurrent: (sessionId, qIndex, fIndex) =>
		set(s => {
			s.currentSessionId = sessionId
			s.currentQuestionIndex = qIndex
			s.currentFollowUpQuestionIndex = fIndex
			return s
		}),

	generateAudioRoute: (sessionId, questionIndex, followUpIndex) => {
		const base = `/audio/s${encodeURIComponent(sessionId)}/q${questionIndex}`
		return typeof followUpIndex === 'number'
			? `${base}_f${followUpIndex}.mp3`
			: `${base}.mp3`
	},

	isDownloadingAudio: (sessionId, questionIndex, followUpIndex) => {
		const d = get().downloading[sessionId]
		if (!d) return false
		if (typeof followUpIndex === 'number')
			return !!d.fq[questionIndex]?.[followUpIndex]
		return !!d.q[questionIndex]
	},

	downloadAudio: async (
		sessionId,
		questionIndex,
		followUpIndex,
		downloadFn
	) => {
		const { generateAudioRoute } = get()
		const route = generateAudioRoute(sessionId, questionIndex, followUpIndex)
		const already = get().isDownloadingAudio(
			sessionId,
			questionIndex,
			followUpIndex
		)
		if (already) return route

		// set downloading = true
		set(s => {
			ensureSession(s, sessionId)
			if (typeof followUpIndex === 'number') {
				const fq = (s.downloading[sessionId].fq[questionIndex] ||= {})
				fq[followUpIndex] = true
			} else {
				s.downloading[sessionId].q[questionIndex] = true
			}
			return s
		})

		try {
			const finalRoute = downloadFn ? await downloadFn(route) : route

			set(s => {
				ensureSession(s, sessionId)
				if (typeof followUpIndex === 'number') {
					const layer = (s.followUpQuestionAudio[sessionId][questionIndex] ||=
						{})
					layer[followUpIndex] = finalRoute
				} else {
					s.questionAudio[sessionId][questionIndex] = finalRoute
				}
				return s
			})

			return finalRoute
		} finally {
			// set downloading = false
			set(s => {
				ensureSession(s, sessionId)
				if (typeof followUpIndex === 'number') {
					const fq = (s.downloading[sessionId].fq[questionIndex] ||= {})
					fq[followUpIndex] = false
				} else {
					s.downloading[sessionId].q[questionIndex] = false
				}
				return s
			})
		}
	},

	downloadAudios: async (items, downloadFn) => {
		const { downloadAudio } = get()
		return Promise.all(
			items.map(it =>
				downloadAudio(
					it.sessionId,
					it.questionIndex,
					it.followUpIndex,
					downloadFn
				)
			)
		)
	},
}))

export const selectQuestionsBySession = (sessionId: SessionId) =>
	useInterviewStore(s => s.questions[sessionId] ?? [])

export const selectFollowUps = (sessionId: SessionId, questionIndex: number) =>
	useInterviewStore(s => s.followUpQuestions[sessionId]?.[questionIndex] ?? [])

export const selectQuestionAudio = (
	sessionId: SessionId,
	questionIndex: number
) => useInterviewStore(s => s.questionAudio[sessionId]?.[questionIndex] ?? null)

export const selectFollowUpAudio = (
	sessionId: SessionId,
	questionIndex: number,
	followUpIndex: number
) =>
	useInterviewStore(
		s =>
			s.followUpQuestionAudio[sessionId]?.[questionIndex]?.[followUpIndex] ??
			null
	)

export const selectDownloading = (
	sessionId: SessionId,
	questionIndex: number,
	followUpIndex?: number
) =>
	useInterviewStore(s =>
		typeof followUpIndex === 'number'
			? !!s.downloading[sessionId]?.fq[questionIndex]?.[followUpIndex]
			: !!s.downloading[sessionId]?.q[questionIndex]
	)

export const selectMemberIdBySession = (sessionId: SessionId) =>
	useInterviewStore(s => s.sessionMemberMap[sessionId] ?? null)
