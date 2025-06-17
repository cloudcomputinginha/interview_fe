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
  const prev = () => (step > 1 ? setStep(step - 1) : undefined);

  /**
   * 다음 단계로 이동하거나, 마지막 단계에서는 면접 생성 및 분기까지 모두 처리
   * @param memberId 로그인된 사용자 ID (필수)
   * @param router next/navigation의 router 인스턴스 (필수)
   */
  const next = async (memberId?: string, router?: any) => {
    const ok = validate();
    if (!ok) return;

    if (step < totalSteps) {
      setStep(step + 1);
      return;
    }

    // 최종 제출 단계
    if (!memberId) {
      alert("로그인이 필요합니다.");
      return;
    }
    if (!router) {
      alert("라우터가 필요합니다.");
      return;
    }
    try {
      setForm((prev) => ({ ...prev, submitting: true }));
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
      const interviewRes = await createInterview(payload);
      const interviewId = interviewRes?.result?.interviewId;
      const interviewFormat =
        form.interviewType === "individual" ? "INDIVIDUAL" : "GROUP";
      const startType = form.startType === "now" ? "NOW" : "SCHEDULED";
      if (
        interviewFormat === "INDIVIDUAL" &&
        startType === "NOW" &&
        interviewId
      ) {
        // 바로 참여 신청
        // createMemberInterview는 외부에서 import 필요
        // memberId, resumeId, coverLetterId 모두 number로 변환
        if (typeof window !== "undefined") {
          const { createMemberInterview } = await import("@/api/interview");
          await createMemberInterview(interviewId, {
            memberId: Number(memberId),
            resumeId: Number(form.resumeId),
            coverletterId: Number(form.coverLetterId),
          });
        }
        router.push(`/workspace/interview/session/${interviewId}`);
        return;
      }
      alert("면접 생성이 완료되었습니다.");
      router.push("/workspace/interviews");
    } catch (e) {
      alert("면접 생성 중 오류가 발생했습니다.");
    } finally {
      setForm((prev) => ({ ...prev, submitting: false }));
    }
  };

  /* 공개 API */
  return {
    form,
    setForm,
    step,
    totalSteps,
    next,
    prev,
    submitting: form.submitting,
  };
}
