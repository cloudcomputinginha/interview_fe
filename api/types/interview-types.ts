export interface CreateMemberInterviewDTO {
  memberId: number;
  resumeId: number;
  coverletterId: number;
}

export interface ApiResponseCreateMemberInterviewDTO {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  result?: CreateMemberInterviewDTO;
}

export interface CreateMemberInterviewResultDTO {
  memberInterviewId?: number;
  createdAt?: string;
}

export interface changeMemberStatusDTO {
  memberId: number;
  status: "NO_SHOW" | "SCHEDULED" | "IN_PROGRESS" | "DONE";
}

export interface ApiResponseMemberInterviewStatusDTO {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  result?: MemberInterviewStatusDTO;
}

export interface MemberInterviewStatusDTO {
  memberInterviewId?: number;
  status?: "NO_SHOW" | "SCHEDULED" | "IN_PROGRESS" | "DONE";
  updatedAt?: string;
}

export interface endInterviewRequestDTO {
  endedAt: string;
}

export interface ApiResponseInterviewEndResultDTO {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  result?: InterviewEndResultDTO;
}

export interface InterviewEndResultDTO {
  interviewId?: number;
  endedAt?: string;
}
