import { serverFetch } from "../utils/fetch/fetch";
import {
  InterviewCreateDTO,
  ApiResponseInterviewCreateResultDTO,
  CreateMemberInterviewDTO,
  ApiResponseCreateMemberInterviewDTO,
  changeMemberStatusDTO,
  ApiResponseMemberInterviewStatusDTO,
  endInterviewRequestDTO,
  ApiResponseInterviewEndResultDTO,
  InterviewOptionUpdateDTO,
  ApiResponseInterviewOptionUpdateResponseDTO,
  ApiResponseListInterviewGroupCardDTO,
  ApiResponseGroupInterviewDetailDTO,
  ApiResponseInterviewStartResponseDTO,
  ApiResponseMyInterviewListDTO,
} from "./types/interview-types";

// 면접 생성
export async function createInterview(data: InterviewCreateDTO) {
  return serverFetch.post<
    ApiResponseInterviewCreateResultDTO,
    InterviewCreateDTO
  >("/interviews", data);
}

// 면접 참여 신청
export async function createMemberInterview(
  interviewId: number,
  data: CreateMemberInterviewDTO
) {
  return serverFetch.post<
    ApiResponseCreateMemberInterviewDTO,
    CreateMemberInterviewDTO
  >(`/interviews/${interviewId}`, data);
}

// 면접 옵션 수정
export async function updateInterviewOption(
  interviewId: number,
  memberId: number,
  data: InterviewOptionUpdateDTO
) {
  return serverFetch.patch<
    ApiResponseInterviewOptionUpdateResponseDTO,
    InterviewOptionUpdateDTO & { memberId: number }
  >(`/interviews/${interviewId}/option`, { ...data, memberId });
}

// 1대다 면접 모집글 리스트 조회
export async function getGroupInterviewCards() {
  return serverFetch.get<ApiResponseListInterviewGroupCardDTO>(
    "/interviews/group"
  );
}

// 1대다 면접 모집글 상세 조회
export async function getGroupInterviewDetail(interviewId: number) {
  return serverFetch.get<ApiResponseGroupInterviewDetailDTO>(
    `/interviews/group/${interviewId}`
  );
}

// 면접 시작 API
export async function startInterview(interviewId: number) {
  return serverFetch.get<ApiResponseInterviewStartResponseDTO>(
    `/interviews/${interviewId}/start`
  );
}

// 대기실 내 사용자 상태 변경
export async function changeParticipantsStatus(
  interviewId: number,
  data: changeMemberStatusDTO
) {
  return serverFetch.patch<
    ApiResponseMemberInterviewStatusDTO,
    changeMemberStatusDTO
  >(`/interviews/${interviewId}/waiting-room`, data);
}

// 면접 종료
export async function terminateInterview(
  interviewId: number,
  data: endInterviewRequestDTO
) {
  return serverFetch.patch<
    ApiResponseInterviewEndResultDTO,
    endInterviewRequestDTO
  >(`/interviews/${interviewId}/end`, data);
}

// 내 인터뷰 리스트 조회
export async function getMyInterviewList(memberId: number) {
  return serverFetch.get<ApiResponseMyInterviewListDTO>("/mypage/interviews", {
    memberId,
  });
}

// 면접 정보 수정
export async function updateInterview(
  interviewId: number,
  data: {
    title: string;
    startAt: string;
    isPublic: boolean;
    maxParticipants: string;
    participants: { id: number; email: string }[];
    resume: string;
    coverLetter: string;
  }
) {
  return serverFetch.put(`/interviews/${interviewId}`, data);
}

export async function getInterviewDetail(interviewId: number) {
  return serverFetch.get<ApiResponseInterviewStartResponseDTO>(
    `/interviews/${interviewId}/start`
  );
}
