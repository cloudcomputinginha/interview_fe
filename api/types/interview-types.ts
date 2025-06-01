export interface InterviewCreateDTO {
  name: string;
  description: string;
  sessionName?: string;
  corporateName: string;
  jobName: string;
  interviewFormat: "INDIVIDUAL" | "GROUP";
  interviewType: "PERSONALITY" | "TECHNICAL";
  voiceType:
    | "MALE20"
    | "MALE30"
    | "MALE40"
    | "MALE50"
    | "FEMALE20"
    | "FEMALE30"
    | "FEMALE40"
    | "FEMALE50";
  questionNumber: number;
  answerTime: number;
  startType?: "NOW" | "SCHEDULED";
  scheduledDate?: string;
  scheduledTime?: string;
  maxParticipants?: number;
  isOpen?: boolean;
  resumeId: number;
  resumeTitle?: string;
  coverLetterId: number;
  coverLetterTitle?: string;
  inviteEmailDTOList?: InviteEmailDTO[];
}

export interface InviteEmailDTO {
  id?: number;
  email?: string;
}

export interface ApiResponseInterviewCreateResultDTO {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  result?: InterviewCreateResultDTO;
}

export interface InterviewCreateResultDTO {
  interviewId?: number;
  name?: string;
  description?: string;
  corporateName?: string;
  jobName?: string;
  interviewFormat?: "INDIVIDUAL" | "GROUP";
  interviewType?: "PERSONALITY" | "TECHNICAL";
  startType?: "NOW" | "SCHEDULED";
  startedAt?: string;
  createdAt?: string;
}

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
