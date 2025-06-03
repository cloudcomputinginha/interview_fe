import { useState, useEffect, useCallback } from "react";
import type { InterviewSession, QA } from "@/api/types/interview-types";
import {
  generateQuestions,
  answerMainQuestion,
  generateFollowUpQuestions,
  answerFollowUpQuestion,
  getSessionById,
  generateFeedback,
  generateFinalReport,
} from "@/api/ai-interview";

const S3_URL = process.env.NEXT_PUBLIC_S3_URL || "";

async function preloadAudio(audioPath: string): Promise<string> {
  if (!audioPath) return "";
  const url = S3_URL + audioPath;
  const res = await fetch(url);
  if (!res.ok) throw new Error("오디오 프리로드 실패: " + url);
  const blob = await res.blob();
  return URL.createObjectURL(blob);
}

// index 기반 key로 audioUrlMap 생성 (이미 프리로드된 오디오는 제외)
async function preloadAllAudios(
  qaFlow: QA[],
  audioUrlMap: Record<string, string>
): Promise<Record<string, string>> {
  const entries: [string, string][] = [];

  for (let qIdx = 0; qIdx < qaFlow.length; qIdx++) {
    const q = qaFlow[qIdx];
    // 메인 질문
    const mainKey = `${qIdx}_-1`;
    if (q.audioPath) {
      if (audioUrlMap[mainKey]) {
        entries.push([mainKey, audioUrlMap[mainKey]]);
      } else {
        const blobUrl = await preloadAudio(q.audioPath);
        entries.push([mainKey, blobUrl]);
      }
    }
    // 팔로우업
    if (Array.isArray(q.followUps)) {
      for (let fIdx = 0; fIdx < q.followUps.length; fIdx++) {
        const f = q.followUps[fIdx];
        const followKey = `${qIdx}_${fIdx}`;
        if (f.audioPath) {
          if (audioUrlMap[followKey]) {
            entries.push([followKey, audioUrlMap[followKey]]);
          } else {
            const blobUrl = await preloadAudio(f.audioPath);
            entries.push([followKey, blobUrl]);
          }
        }
      }
    }
  }
  return Object.fromEntries(entries);
}

interface UseInterviewSessionResult {
  session: InterviewSession | null;
  qaFlow: QA[];
  currentQuestionIdx: number;
  currentFollowUpIdx: number;
  isLoading: boolean;
  isQuestionLoading: boolean;
  error: string | null;
  audioUrlMap: Record<string, string>;
  progressMessage: string;
  handleMainAnswerSubmit: (answer: string) => Promise<void>;
  handleFollowUpAnswerSubmit: (answer: string) => Promise<void>;
  isFeedbackLoading: boolean;
  isFinalReportLoading: boolean;
  finalReport: any;
  timer: number;
  setTimer: React.Dispatch<React.SetStateAction<number>>;
  isAudioPreloading: boolean;
}

export function useInterviewSession(
  interviewId: string,
  memberInterviewId: string
): UseInterviewSessionResult {
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [qaFlow, setQaFlow] = useState<QA[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [currentFollowUpIdx, setCurrentFollowUpIdx] = useState<number>(-1);
  const [isLoading, setIsLoading] = useState(true);
  const [isQuestionLoading, setIsQuestionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioUrlMap, setAudioUrlMap] = useState<Record<string, string>>({});
  const [isAudioPreloading, setIsAudioPreloading] = useState(true);
  const [progressMessage, setProgressMessage] = useState<string>("");
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(false);
  const [isFinalReportLoading, setIsFinalReportLoading] = useState(false);
  const [finalReport, setFinalReport] = useState<any>(null);
  const [timer, setTimer] = useState<number>(120);

  useEffect(() => {
    async function init() {
      setIsLoading(true);
      setProgressMessage("면접 세션을 생성하고 있어요...");
      try {
        let loadedSession: InterviewSession | null = null;
        if (session?.sessionId) {
          const result = await getSessionById(session.sessionId);
          loadedSession = result;
        } else {
          const result = await generateQuestions(
            interviewId,
            memberInterviewId
          );
          loadedSession = typeof result === "boolean" ? null : result;
        }
        if (!loadedSession) {
          window.location.href = "/workspace/interviews";
          alert("세션 정보를 불러오지 못했습니다.");
          setProgressMessage("");
          return;
        }
        setQaFlow(loadedSession.qaFlow);
        setSession(loadedSession);
        setCurrentQuestionIdx(0);
        setCurrentFollowUpIdx(-1);
        setProgressMessage("면접관 음성을 준비하고 있어요...");
        setIsAudioPreloading(true);
        const urlMap = await preloadAllAudios(
          loadedSession.qaFlow,
          audioUrlMap
        );
        setAudioUrlMap(urlMap);
        setIsAudioPreloading(false);
        setIsLoading(false);
        setProgressMessage("");
        return;
      } catch (e) {
        setError("세션 정보를 불러오지 못했습니다.");
        setProgressMessage("");
      }
    }
    init();
  }, []);

  const handleMainAnswerSubmit = useCallback(
    async (answer: string) => {
      if (!session || !session.sessionId) return;
      setIsQuestionLoading(true);
      try {
        await answerMainQuestion(session.sessionId, currentQuestionIdx, {
          answer,
        });

        const sessionWithFollowUp = await generateFollowUpQuestions(
          session.sessionId,
          currentQuestionIdx
        );

        setSession(sessionWithFollowUp as InterviewSession);
        setQaFlow((sessionWithFollowUp as InterviewSession).qaFlow);
        setCurrentFollowUpIdx((prev) => prev + 1);

        const urlMap = await preloadAllAudios(
          (sessionWithFollowUp as InterviewSession).qaFlow,
          audioUrlMap
        );
        setIsAudioPreloading(false);
        setAudioUrlMap((prev) => ({
          ...prev,
          ...urlMap,
        }));
        setIsAudioPreloading(false);
      } catch (e) {
        setError("답변 저장에 실패했습니다.");
      } finally {
        setIsQuestionLoading(false);
      }
    },
    [session, currentQuestionIdx, audioUrlMap]
  );

  const handleFollowUpAnswerSubmit = useCallback(
    async (answer: string) => {
      if (!session || !session.sessionId || currentFollowUpIdx === -1) return;
      try {
        if (
          qaFlow[currentQuestionIdx].followUps &&
          qaFlow[currentQuestionIdx].followUps.length - 1 === currentFollowUpIdx
        ) {
          setIsFeedbackLoading(true);
          await generateFeedback(session.sessionId, currentQuestionIdx);
          setIsFeedbackLoading(false);
          setCurrentFollowUpIdx(-1);
          setCurrentQuestionIdx((prev) => prev + 1);
        } else {
          setCurrentFollowUpIdx((prev) => prev + 1);
        }
      } catch (e) {
        setError("팔로우업 답변 저장에 실패했습니다.");
      } finally {
        setIsFeedbackLoading(false);
      }
    },
    [session, currentQuestionIdx, currentFollowUpIdx, qaFlow]
  );

  useEffect(() => {
    if (qaFlow && qaFlow.length === 0) return;
    async function createFinalReport() {
      if (session && qaFlow.length > 0 && currentQuestionIdx >= qaFlow.length) {
        setIsFinalReportLoading(true);
        const report = await generateFinalReport(session.sessionId!);
        setFinalReport(report);
        setIsFinalReportLoading(false);
      }
    }
    createFinalReport();
  }, [currentQuestionIdx, session]);

  return {
    session,
    qaFlow,
    currentQuestionIdx,
    currentFollowUpIdx,
    isLoading,
    isQuestionLoading,
    error,
    audioUrlMap,
    progressMessage,
    handleMainAnswerSubmit,
    handleFollowUpAnswerSubmit,
    isFeedbackLoading,
    isFinalReportLoading,
    finalReport,
    timer,
    setTimer,
    isAudioPreloading,
  };
}
