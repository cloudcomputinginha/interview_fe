import { useState } from "react";
import type {
  InterviewFormState,
  Participant,
  Resume,
  CoverLetter,
} from "../types/interview";
import {
  QUESTION_COUNT_RANGE,
  DURATION_RANGE,
  AI_VOICE_OPTIONS,
} from "../constants/interviewOptions";

const MOCK_PARTICIPANTS: Participant[] = [
  { id: 1, name: "김지원", isHost: true, hasSubmittedDocs: false },
  { id: 2, name: "이민수", isHost: false, hasSubmittedDocs: false },
];

const MOCK_RESUMES: Resume[] = [
  { id: "1", name: "신입 개발자 이력서.pdf" },
  { id: "2", name: "포트폴리오_2023.pdf" },
  { id: "3", name: "경력기술서_최종.docx" },
];

const MOCK_COVER_LETTERS: CoverLetter[] = [
  { id: "1", name: "삼성전자 자기소개서.pdf" },
  { id: "2", name: "네이버 지원 자소서.docx" },
  { id: "3", name: "카카오 인턴십 자소서" },
  { id: "4", name: "현대자동차 공채 지원서.pdf" },
];

const INITIAL_FORM: InterviewFormState = {
  step: 1,
  sessionName: "삼성전자 상반기 공채 대비 모의면접",
  participants: MOCK_PARTICIPANTS,
  date: "2023-06-10",
  time: "14:00",
  selectedResume: "",
  selectedCoverLetter: "",
  aiVoice: "female1",
  interviewType: "technical",
  questionCount: QUESTION_COUNT_RANGE.default,
  duration: DURATION_RANGE.default,
};

export function useInterviewCreateForm() {
  const [form, setForm] = useState<InterviewFormState>(INITIAL_FORM);

  const setField = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (form.step === 1) {
      if (!form.date || !form.time) {
        alert("면접 날짜와 시간을 선택해주세요.");
        return;
      }
    } else if (form.step === 2) {
      if (!form.selectedResume || !form.selectedCoverLetter) {
        alert("호스트의 이력서와 자기소개서를 선택해주세요.");
        return;
      }
    }
    if (form.step < 2) {
      setForm((prev) => ({ ...prev, step: prev.step + 1 }));
    } else {
      // 예약 완료 처리 (API 연동 필요)
      const interviewDateTime = new Date(`${form.date}T${form.time}`);
      alert(
        `면접이 ${formatDateTime(
          form.date,
          form.time
        )}에 예약되었습니다. 참가자들에게 알림이 전송되었습니다.`
      );
      window.location.href = "/workspace/interviews";
    }
  };

  const prevStep = (postId: string) => {
    if (form.step > 1) {
      setForm((prev) => ({ ...prev, step: prev.step - 1 }));
    } else {
      window.location.href = `/workspace/interview/group/community/${postId}`;
    }
  };

  function formatDateTime(dateStr: string, timeStr: string) {
    if (!dateStr || !timeStr) return "";
    const dateTime = new Date(`${dateStr}T${timeStr}`);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return dateTime.toLocaleDateString("ko-KR", options);
  }

  return {
    form,
    setField,
    nextStep,
    prevStep,
    formatDateTime,
    MOCK_RESUMES,
    MOCK_COVER_LETTERS,
  };
}
