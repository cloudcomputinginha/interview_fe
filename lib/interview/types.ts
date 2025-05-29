/* 모든 스텝에서 공유하는 폼 데이터 타입 */

export interface InterviewFormState {
  /* step 1 */
  interviewType: "individual" | "group" | "";
  company: string;
  position: string;
  title: string;
  description: string;
  sessionName: string; // 그룹 면접 전용

  /* step 2 */
  resumeId: string | null;
  coverLetterId: string | null;
  newCoverLetterTitle: string;
  newCoverLetterContent: string;

  /* step 3 */
  voiceType: "female1" | "female2" | "male1" | "male2";
  interviewStyle: "personality" | "technical";
  answerDuration: number;
  questionCount: number;

  /* step 4 (공통) */
  startType: "now" | "scheduled";
  scheduledDate?: Date;
  scheduledTime: string;

  /* step 4 (그룹) */
  maxParticipants: string; // "2" | "3" | "4" | "5"
  visibility: "public" | "private";

  /* step 5 */
  inviteEmails: { id: number; email: string }[];
}

/* 폼 초기값 */
export const initialFormState: InterviewFormState = {
  interviewType: "",
  company: "",
  position: "",
  title: "",
  description: "",
  sessionName: "",

  resumeId: null,
  coverLetterId: null,
  newCoverLetterTitle: "",
  newCoverLetterContent: "",

  voiceType: "female1",
  interviewStyle: "personality",
  answerDuration: 3,
  questionCount: 10,

  startType: "now",
  scheduledDate: undefined,
  scheduledTime: "",

  maxParticipants: "4",
  visibility: "private",

  inviteEmails: [{ id: 1, email: "" }],
};
