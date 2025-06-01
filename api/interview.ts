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
export async function getMyInterviewList() {
  return serverFetch.get<any>("/interviews");
}
