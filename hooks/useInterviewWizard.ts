"use client";

import { useState } from "react";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { createInterview } from "@/lib/interview/api/interview";
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
  sessionName: z.string().min(1).optional(),
});

const step2Schema = z.object({
  resumeId: z.string().min(1),
  coverLetterId: z.string().min(1).optional(),
  newCoverLetterTitle: z.string().min(1).optional(),
  newCoverLetterContent: z.string().min(1).optional(),
});

/* ───────────────── 훅 본체 ───────────────── */
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
      router.push(`/workspace/interviews/${data.id}`);
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
    if (!validate()) return;
    if (step < totalSteps) setStep(step + 1);
    else submitMu.mutate(form); // 🔥 최종 제출
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
