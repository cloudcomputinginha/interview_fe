import { useState, useEffect, useCallback } from "react";

// 타입 정의
interface FollowUp {
  question: string;
  answer: string | null;
}

interface QaItem {
  question: string;
  answer: string | null;
  follow_ups: FollowUp[];
  feedback: string | null;
}

interface InterviewSession {
  interview_id: string;
  member_interview_id: string;
  session_id: string;
  video_path: string | null;
  qa_flow: QaItem[];
  final_report: string | null;
}

interface UseInterviewSessionResult {
  session: InterviewSession | null;
  qaFlow: QaItem[];
  currentQuestionIdx: number;
  currentFollowUpIdx: number | null;
  isLoading: boolean;
  isQuestionLoading: boolean;
  error: string | null;
  handleMainAnswerSubmit: (answer: string) => Promise<void>;
  handleFollowUpAnswerSubmit: (answer: string) => Promise<void>;
  handleNext: () => void;
}

const BASE_URL = "http://0.0.0.0:8000";

async function generateQuestions(
  interviewId: string,
  memberInterviewId: string
): Promise<InterviewSession> {
  const res = await fetch(
    `${BASE_URL}/interview/${interviewId}/${memberInterviewId}/generate_questions`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }
  );
  if (!res.ok) throw new Error("질문 생성 실패");
  return await res.json();
}

async function fetchSessionById(
  sessionId: string
): Promise<InterviewSession | null> {
  const res = await fetch(`${BASE_URL}/interview/session/${sessionId}`);
  if (!res.ok) return null;
  return await res.json();
}

async function createSessionAndQuestions(
  interviewId: string,
  memberInterviewId: string
): Promise<InterviewSession> {
  const res = await fetch(
    `${BASE_URL}/interview/${interviewId}/${memberInterviewId}/generate_questions`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }
  );
  if (!res.ok) throw new Error("질문 생성 실패");
  return await res.json();
}

async function patchMainAnswer(
  sessionId: string,
  index: number,
  answer: string
): Promise<InterviewSession> {
  const url = `${BASE_URL}/interview/session/${sessionId}/qa/${index}/answer?answer=${encodeURIComponent(
    answer
  )}`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("답변 저장 실패");
  return await res.json();
}

async function generateFollowUps(
  sessionId: string,
  index: number
): Promise<InterviewSession> {
  const res = await fetch(
    `${BASE_URL}/interview/session/${sessionId}/qa/${index}/generate_follow-ups`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }
  );
  if (!res.ok) throw new Error("팔로우업 생성 실패");
  return await res.json();
}

async function patchFollowUpAnswer(
  sessionId: string,
  index: number,
  fIndex: number,
  answer: string
): Promise<InterviewSession> {
  const url = `${BASE_URL}/interview/session/${sessionId}/qa/${index}/follow-up/${fIndex}/answer?answer=${encodeURIComponent(
    answer
  )}`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("팔로우업 답변 저장 실패");
  return await res.json();
}

export function useInterviewSession(
  interviewId: string,
  memberInterviewId: string,
  sessionId?: string
): UseInterviewSessionResult {
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [qaFlow, setQaFlow] = useState<QaItem[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [currentFollowUpIdx, setCurrentFollowUpIdx] = useState<number | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isQuestionLoading, setIsQuestionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 세션 생성/조회 및 질문 리스트 세팅
  useEffect(() => {
    async function init() {
      setIsLoading(true);
      try {
        let loadedSession: InterviewSession | null = null;
        const res = await fetch(`${BASE_URL}/interview/session/${sessionId}`);
        if (res.status === 200) {
          loadedSession = await res.json();
        } else if (res.status === 404) {
          // 세션이 없으면 generate
          loadedSession = await generateQuestions(
            interviewId,
            memberInterviewId
          );
        } else {
          throw new Error("세션 조회 실패");
        }
        if (!loadedSession) {
          window.location.href = "/workspace/interviews";
          alert("세션 정보를 불러오지 못했습니다.");
          throw new Error("세션 정보를 불러오지 못했습니다.");
        }
        setQaFlow(loadedSession.qa_flow);
        setSession(loadedSession);
        setCurrentQuestionIdx(0);
        setCurrentFollowUpIdx(null);
        setIsLoading(false);
        return;
      } catch (e) {
        setError("세션 정보를 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    }
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interviewId, memberInterviewId, sessionId]);

  // 메인 질문 답변 저장
  const handleMainAnswerSubmit = useCallback(
    async (answer: string) => {
      if (!session) return;
      setIsQuestionLoading(true);
      try {
        const updatedSession = await patchMainAnswer(
          session.session_id,
          currentQuestionIdx,
          answer
        );
        setSession(updatedSession);
        setQaFlow(updatedSession.qa_flow);
        // 팔로우업 생성(무조건 1개만)
        const sessionWithFollowUp = await generateFollowUps(
          session.session_id,
          currentQuestionIdx
        );
        setSession(sessionWithFollowUp);
        setQaFlow(sessionWithFollowUp.qa_flow);
        const hasFollowUp =
          sessionWithFollowUp.qa_flow[currentQuestionIdx]?.follow_ups?.length >
          0;
        if (hasFollowUp) {
          setCurrentFollowUpIdx(0);
        } else {
          setCurrentQuestionIdx((prev) => prev + 1);
          setCurrentFollowUpIdx(null);
        }
      } catch (e) {
        setError("답변 저장에 실패했습니다.");
      } finally {
        setIsQuestionLoading(false);
      }
    },
    [session, currentQuestionIdx]
  );

  // 팔로우업 답변 저장(한 번만)
  const handleFollowUpAnswerSubmit = useCallback(
    async (answer: string) => {
      if (!session || currentFollowUpIdx === null) return;
      setIsQuestionLoading(true);
      try {
        const updatedSession = await patchFollowUpAnswer(
          session.session_id,
          currentQuestionIdx,
          currentFollowUpIdx,
          answer
        );
        setSession(updatedSession);
        setQaFlow(updatedSession.qa_flow);
        // 팔로우업은 한 번만, 무조건 다음 메인 질문으로 이동
        setCurrentFollowUpIdx(null);
        setCurrentQuestionIdx((prev) => prev + 1);
      } catch (e) {
        setError("팔로우업 답변 저장에 실패했습니다.");
      } finally {
        setIsQuestionLoading(false);
      }
    },
    [session, currentQuestionIdx, currentFollowUpIdx]
  );

  // 다음 질문으로 이동
  const handleNext = useCallback(() => {
    setCurrentFollowUpIdx(null);
    setCurrentQuestionIdx((prev) => prev + 1);
  }, []);

  return {
    session,
    qaFlow,
    currentQuestionIdx,
    currentFollowUpIdx,
    isLoading,
    isQuestionLoading,
    error,
    handleMainAnswerSubmit,
    handleFollowUpAnswerSubmit,
    handleNext,
  };
}
