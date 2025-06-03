import { aiFetch } from "../utils/fetch/fetch";
import type { InterviewSession, QA } from "./types/interview-types";

function toCamelCaseQA(raw: any): QA {
  return {
    question: raw.question,
    audioPath: raw.audio_path,
    answer: raw.answer,
    followUpLength: raw.follow_up_length,
    followUps: raw.follow_ups?.map((f: any) => ({
      question: f.question,
      audioPath: f.audio_path,
      answer: f.answer,
    })),
    feedback: raw.feedback,
  };
}

function toCamelCaseInterviewSession(raw: any): InterviewSession {
  return {
    interviewId: raw.interview_id,
    memberInterviewId: raw.member_interview_id,
    sessionId: raw.session_id,
    cursor: raw.cursor,
    videoPath: raw.video_path,
    questionLength: raw.question_length,
    qaFlow: raw.qa_flow?.map?.(toCamelCaseQA) ?? [],
    finalReport: raw.final_report,
  };
}

// 1. 질문 생성
export async function generateQuestions(
  interviewId: string,
  memberInterviewId: string,
  payload?: any
): Promise<InterviewSession | boolean> {
  const res = await aiFetch.post<any>(
    `/interview/${interviewId}/${memberInterviewId}/generate_questions`,
    payload
  );
  if (typeof res === "boolean") return res;
  return toCamelCaseInterviewSession(res);
}

// 2. 메인 질문 답변
export async function answerMainQuestion(
  sessionId: string,
  index: number,
  payload: any
): Promise<any> {
  return aiFetch.patch<any>(
    `/interview/session/${sessionId}/qa/${index}/answer`,
    payload
  );
}

// 3. 후속 질문 생성
export async function generateFollowUpQuestions(
  sessionId: string,
  index: number,
  payload?: any
): Promise<InterviewSession | boolean> {
  const res = await aiFetch.post<any>(
    `/interview/session/${sessionId}/qa/${index}/generate_follow-ups`,
    payload
  );
  if (typeof res === "boolean") return res;
  return toCamelCaseInterviewSession(res);
}

// 4. 후속 질문 답변
export async function answerFollowUpQuestion(
  sessionId: string,
  index: number,
  fIndex: number,
  payload: any
): Promise<any> {
  const res = aiFetch.patch<any>(
    `/interview/session/${sessionId}/qa/${index}/follow-up/${fIndex}/answer`,
    payload
  );

  return toCamelCaseInterviewSession(res);
}

// 5. 피드백 생성
export async function generateFeedback(
  sessionId: string,
  index: number,
  payload?: any
): Promise<InterviewSession | boolean> {
  const res = await aiFetch.post<any>(
    `/interview/session/${sessionId}/qa/${index}/feedback`,
    payload
  );
  if (typeof res === "boolean") return res;
  return toCamelCaseInterviewSession(res);
}

// 6. 최종 리포트 생성
export async function generateFinalReport(
  sessionId: string,
  payload?: any
): Promise<InterviewSession | boolean> {
  const res = await aiFetch.post<any>(
    `/interview/session/${sessionId}/report`,
    payload
  );
  if (typeof res === "boolean") return res;
  return toCamelCaseInterviewSession(res);
}

// 7. 세션 전체 조회
export async function listAllSessions(): Promise<InterviewSession[]> {
  const res = await aiFetch.get<any[]>("/interview/sessions");
  return res.map(toCamelCaseInterviewSession);
}

// 9. 세션 단일 조회 (sessionId)
export async function getSessionById(
  sessionId: string
): Promise<InterviewSession> {
  const res = await aiFetch.get<any>(`/interview/session/${sessionId}`);
  return toCamelCaseInterviewSession(res);
}

// 11. 세션 단일 조회 (interviewId, memberInterviewId)
export async function getSessionByInterviewAndMember(
  interviewId: string,
  memberInterviewId: string
): Promise<InterviewSession> {
  const res = await aiFetch.get<any>(
    `/interview/session/${interviewId}/${memberInterviewId}`
  );
  return toCamelCaseInterviewSession(res);
}
