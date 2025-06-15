"use client";

import { useState } from "react";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { createInterview } from "@/api/interview";
import type { InterviewCreateDTO } from "@/api/types/interview-types";
import {
  initialFormState,
  type InterviewFormState,
} from "@/lib/interview/types";

/* ───────────────── 스텝별 검증 스키마 예시 ───────────────── */
const step1Schema = z.object({
  interviewType: z.enum(["individual", "group"]),
  company: z.string().min(1),
  position: z.string().min(1),
  title: z.string().min(1),
  sessionName: z.string().optional(),
});

const step2Schema = z.object({
  resumeId: z.string().min(1),
  coverLetterId: z.string().min(1),
  newCoverLetterTitle: z.string().optional(),
  newCoverLetterContent: z.string().optional(),
});

const convertDate = (string: string) => {
  const localeDate = "2025. 6. 16.";
  const [year, month, day] = localeDate
    .replace(/\./g, "") // 점 제거
    .trim() // 양쪽 공백 제거
    .split(" ") // 공백으로 분리
    .map((val) => val.padStart(2, "0")); // 자리수 보정

  const isoDate = `${year}-${month}-${day}`;
  return isoDate;
};

export function useInterviewWizard() {
  /* 폼 상태 & 스텝 번호 */
  const [form, setForm] = useState<InterviewFormState>(initialFormState);
  const [step, setStep] = useState(1);
  const totalSteps = form.interviewType === "individual" ? 5 : 6;

  /* 라우터 */
  const router = useRouter();

  /* 최종 제출 mutation */
  const submitMu = useMutation({
    mutationFn: createInterview,
    onSuccess: (data) => {
      const id = (data as any)?.result?.interviewId;
      if (id) {
        alert("면접 생성이 완료되었습니다.");
        console.log("🧪 면접 생성 성공", data);
        router.push(`/workspace/interviews`);
      } else {
        alert("면접 생성은 성공했으나, 인터뷰 ID를 찾을 수 없습니다.");
        console.error("[면접 생성 성공 but ID 없음]", data);
      }
    },
    onError: () =>
      alert("면접 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."),
  });

  /* 스텝별 검증 */
  const validate = (): boolean => {
    if (step === 1) return step1Schema.safeParse(form).success;
    if (step === 2) return step2Schema.safeParse(form).success;
    if (step === 4 && form.startType === "scheduled")
      return !!form.scheduledDate && !!form.scheduledTime;
    return true;
  };

  /* 네비게이션 */
  const next = () => {
    const ok = validate();
    console.log("🧪 validate", step, ok, form); // ← 추가
    if (!ok) return;
    if (step < totalSteps) setStep(step + 1);
    else {
      // 🔥 최종 제출: InterviewCreateDTO 변환 및 예외 로깅
      try {
        if (!form.resumeId || !form.coverLetterId)
          throw new Error("이력서/자기소개서가 선택되지 않았습니다.");
        const payload: InterviewCreateDTO = {
          name: form.title,
          description: form.description,
          corporateName: form.company,
          jobName: form.position,
          interviewFormat:
            form.interviewType === "individual" ? "INDIVIDUAL" : "GROUP",
          interviewType:
            form.interviewStyle === "personality" ? "PERSONALITY" : "TECHNICAL",
          voiceType: (
            form.voiceType || ""
          ).toUpperCase() as InterviewCreateDTO["voiceType"],
          questionNumber: form.questionCount,
          answerTime: form.answerDuration,
          startType: form.startType === "now" ? "NOW" : "SCHEDULED",
          scheduledDate: convertDate(
            form.scheduledDate?.toLocaleDateString() || ""
          ),
          scheduledTime: form.scheduledTime,
          maxParticipants: form.maxParticipants
            ? Number(form.maxParticipants)
            : undefined,
          isOpen: form.visibility === "public",
          resumeId: Number(form.resumeId),
          resumeTitle: form.resumeTitle,
          coverLetterId: Number(form.coverLetterId),
          coverLetterTitle: form.coverLetterTitle,
          inviteEmailDTOList:
            form.inviteEmails
              ?.filter((e) => e.email)
              .map((e) => ({ email: e.email })) || [],
        };
        console.log("[면접 생성 payload]", payload);
        submitMu.mutate(payload);
      } catch (err) {
        alert(
          "면접 생성 데이터 변환 중 오류가 발생했습니다. 콘솔을 확인해주세요."
        );
        console.error("[면접 생성 변환 에러]", err, form);
      }
    }
  };

  const prev = () => (step > 1 ? setStep(step - 1) : router.back());

  /* 공개 API */
  return {
    form,
    setForm,
    step,
    totalSteps,
    next,
    prev,
    submitting: submitMu.isPending,
  };
}
