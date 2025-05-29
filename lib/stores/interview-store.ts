import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Resume {
  id: string
  ownerId: string
  fileName: string
  url: string
  uploadedAt: string
}

export interface CoverLetter {
  id: string
  ownerId: string
  representativeTitle: string
  content: string
  createdAt: string
}

export interface InterviewOptions {
  voiceType: "female1" | "female2" | "male1" | "male2"
  interviewStyle: "personality" | "technical"
  answerDuration: number
}

export type InterviewStatus = "scheduled" | "inProgress" | "finished"

export interface InterviewBase {
  id: string
  status: InterviewStatus
  options: InterviewOptions
  createdAt: string
}

export interface IndividualInterview extends InterviewBase {
  kind: "individual"
  title: string
  resumeId: string
  coverLetterId: string
  startType: "now" | "scheduled"
  startAt: string
}

export interface GroupInterview extends InterviewBase {
  kind: "group"
  sessionName: string
  maxParticipants: 2 | 3 | 4 | 5
  visibility: "public" | "private"
  participants: {
    email: string
    resumeId?: string
    coverLetterId?: string
    status: "invited" | "applied" | "accepted"
  }[]
  scheduledAt: string
}

export type Interview = IndividualInterview | GroupInterview

interface InterviewStore {
  resumes: Resume[]
  coverLetters: CoverLetter[]
  interviews: Interview[]

  // Actions
  addResume: (resume: Omit<Resume, "id" | "ownerId" | "uploadedAt">) => string
  addCoverLetter: (coverLetter: Omit<CoverLetter, "id" | "ownerId" | "createdAt">) => string
  addInterview: (interview: Omit<Interview, "id" | "createdAt">) => string
  updateInterview: (id: string, updates: Partial<Interview>) => void
  startInterview: (id: string) => void

  // Getters
  getResumeById: (id: string) => Resume | undefined
  getCoverLetterById: (id: string) => CoverLetter | undefined
  getInterviewById: (id: string) => Interview | undefined
  getScheduledInterviews: () => Interview[]
  getPublicGroupInterviews: () => GroupInterview[]
}

export const useInterviewStore = create<InterviewStore>()(
  persist(
    (set, get) => ({
      resumes: [
        {
          id: "resume-1",
          ownerId: "user-1",
          fileName: "신입개발자_이력서.pdf",
          url: "/static/resumes/신입개발자_이력서.pdf",
          uploadedAt: "2024-01-15T09:00:00Z",
        },
        {
          id: "resume-2",
          ownerId: "user-1",
          fileName: "포트폴리오_2024.pdf",
          url: "/static/resumes/포트폴리오_2024.pdf",
          uploadedAt: "2024-02-01T10:30:00Z",
        },
        {
          id: "resume-3",
          ownerId: "user-1",
          fileName: "경력기술서_최종.pdf",
          url: "/static/resumes/경력기술서_최종.pdf",
          uploadedAt: "2024-02-10T14:20:00Z",
        },
      ],

      coverLetters: [
        {
          id: "cl-1",
          ownerId: "user-1",
          representativeTitle: "삼성전자 SW개발직군 자기소개서",
          content:
            "안녕하세요. 삼성전자 SW개발직군에 지원하는 지원자입니다.\n\n저는 컴퓨터공학을 전공하며 다양한 프로젝트를 통해 개발 역량을 키워왔습니다. 특히 웹 개발과 앱 개발 분야에서 실무 경험을 쌓았으며, 팀 프로젝트를 통해 협업 능력도 기를 수 있었습니다.\n\n삼성전자에서 혁신적인 기술 개발에 기여하고 싶습니다.",
          createdAt: "2024-01-10T08:00:00Z",
        },
        {
          id: "cl-2",
          ownerId: "user-1",
          representativeTitle: "네이버 백엔드 개발자 자기소개서",
          content:
            "네이버 백엔드 개발자에 지원하게 된 이유는 사용자 중심의 서비스를 개발하고 싶기 때문입니다.\n\n대학 시절 다양한 웹 서비스를 개발하며 백엔드 아키텍처의 중요성을 깨달았습니다. Spring Boot와 Node.js를 활용한 API 개발 경험이 있으며, 데이터베이스 최적화와 성능 튜닝에도 관심이 많습니다.\n\n네이버의 기술력과 함께 성장하고 싶습니다.",
          createdAt: "2024-01-20T11:30:00Z",
        },
        {
          id: "cl-3",
          ownerId: "user-1",
          representativeTitle: "카카오 프론트엔드 개발자 자기소개서",
          content:
            "사용자 경험을 최우선으로 하는 카카오의 철학에 공감하여 지원하게 되었습니다.\n\nReact와 TypeScript를 주로 사용하여 웹 애플리케이션을 개발해왔으며, 반응형 디자인과 웹 접근성에 대한 이해도가 높습니다. 최근에는 Next.js를 활용한 SSR 프로젝트도 경험했습니다.\n\n카카오톡, 카카오맵 등 국민 앱의 프론트엔드 개발에 참여하고 싶습니다.",
          createdAt: "2024-02-05T16:45:00Z",
        },
      ],

      interviews: [
        {
          id: "interview-1",
          kind: "individual",
          status: "scheduled",
          title: "삼성전자 SW개발 모의면접",
          resumeId: "resume-1",
          coverLetterId: "cl-1",
          startType: "scheduled",
          startAt: "2024-03-15T14:00:00Z",
          options: {
            voiceType: "female1",
            interviewStyle: "technical",
            answerDuration: 3,
          },
          createdAt: "2024-03-10T09:00:00Z",
        },
        {
          id: "interview-2",
          kind: "group",
          status: "scheduled",
          sessionName: "네이버 신입 개발자 그룹 면접",
          maxParticipants: 4,
          visibility: "public",
          participants: [
            {
              email: "user1@example.com",
              resumeId: "resume-2",
              coverLetterId: "cl-2",
              status: "accepted",
            },
            {
              email: "user2@example.com",
              status: "applied",
            },
          ],
          scheduledAt: "2024-03-20T10:00:00Z",
          options: {
            voiceType: "male1",
            interviewStyle: "personality",
            answerDuration: 2,
          },
          createdAt: "2024-03-12T15:30:00Z",
        },
      ],

      addResume: (resume) => {
        const newResume: Resume = {
          ...resume,
          id: `resume-${Date.now()}`,
          ownerId: "user-1",
          uploadedAt: new Date().toISOString(),
        }
        set((state) => ({
          resumes: [...state.resumes, newResume],
        }))
        return newResume.id
      },

      addCoverLetter: (coverLetter) => {
        const newCoverLetter: CoverLetter = {
          ...coverLetter,
          id: `cl-${Date.now()}`,
          ownerId: "user-1",
          createdAt: new Date().toISOString(),
        }
        set((state) => ({
          coverLetters: [...state.coverLetters, newCoverLetter],
        }))
        return newCoverLetter.id
      },

      addInterview: (interview) => {
        const newInterview: Interview = {
          ...interview,
          id: `interview-${Date.now()}`,
          createdAt: new Date().toISOString(),
        }
        set((state) => ({
          interviews: [...state.interviews, newInterview],
        }))
        return newInterview.id
      },

      updateInterview: (id, updates) => {
        set((state) => ({
          interviews: state.interviews.map((interview) =>
            interview.id === id ? { ...interview, ...updates } : interview,
          ),
        }))
      },

      startInterview: (id) => {
        set((state) => ({
          interviews: state.interviews.map((interview) =>
            interview.id === id ? { ...interview, status: "inProgress" as InterviewStatus } : interview,
          ),
        }))
      },

      getResumeById: (id) => get().resumes.find((resume) => resume.id === id),
      getCoverLetterById: (id) => get().coverLetters.find((cl) => cl.id === id),
      getInterviewById: (id) => get().interviews.find((interview) => interview.id === id),
      getScheduledInterviews: () => get().interviews.filter((interview) => interview.status === "scheduled"),
      getPublicGroupInterviews: () =>
        get().interviews.filter(
          (interview) =>
            interview.kind === "group" && interview.visibility === "public" && interview.status === "scheduled",
        ) as GroupInterview[],
    }),
    {
      name: "interview-storage",
    },
  ),
)
