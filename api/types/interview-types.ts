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

export interface InterviewOptionUpdateDTO {
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
}

export interface ApiResponseInterviewOptionUpdateResponseDTO {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  result?: InterviewOptionUpdateResponseDTO;
}

export interface InterviewOptionUpdateResponseDTO {
  interviewId?: number;
  interviewOptionId?: number;
  voiceType?:
    | "MALE20"
    | "MALE30"
    | "MALE40"
    | "MALE50"
    | "FEMALE20"
    | "FEMALE30"
    | "FEMALE40"
    | "FEMALE50";
  questionNumber?: number;
  answerTime?: number;
}

// 1대다(그룹) 면접 관련 타입
export interface ApiResponseListInterviewGroupCardDTO {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  result?: InterviewGroupCardDTO[];
}

export interface InterviewGroupCardDTO {
  interviewId?: number;
  name?: string;
  description?: string;
  sessionName?: string;
  jobName?: string;
  interviewType?: "PERSONALITY" | "TECHNICAL";
  currentParticipants?: number;
  maxParticipants?: number;
  startedAt?: string;
}

export interface ApiResponseGroupInterviewDetailDTO {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  result?: GroupInterviewDetailDTO;
}

export interface GroupInterviewDetailDTO {
  interviewId?: number;
  name?: string;
  description?: string;
  sessionName?: string;
  jobName?: string;
  interviewType?: "PERSONALITY" | "TECHNICAL";
  maxParticipants?: number;
  currentParticipants?: number;
  startedAt?: string;
  hostName?: string;
  groupInterviewParticipants?: GroupInterviewParticipantDTO[];
}

export interface GroupInterviewParticipantDTO {
  memberId?: number;
  name?: string;
  submitted?: boolean;
  host?: boolean;
}

// 면접 시작 관련 타입
export interface ApiResponseInterviewStartResponseDTO {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  result?: InterviewStartResponseDTO;
}

export interface InterviewStartResponseDTO {
  interviewId?: number;
  interview?: InterviewDTO;
  options?: InterviewOptionDTO;
  participants?: ParticipantDTO[];
}

export interface InterviewDTO {
  interviewId?: number;
  corporateName?: string;
  jobName?: string;
  startType?: "NOW" | "SCHEDULED";
  participantCount?: number;
}

export interface InterviewOptionDTO {
  interviewFormat?: "INDIVIDUAL" | "GROUP";
  interviewType?: "PERSONALITY" | "TECHNICAL";
  voiceType?:
    | "MALE20"
    | "MALE30"
    | "MALE40"
    | "MALE50"
    | "FEMALE20"
    | "FEMALE30"
    | "FEMALE40"
    | "FEMALE50";
  questionNumber?: number;
  answerTime?: number;
}

export interface ParticipantDTO {
  memberInterviewId?: number;
  resumeDTO?: ResumeSimpleDTO;
  coverLetterDTO?: any; // CoverletterDetailDTO 등 실제 타입에 맞게 수정 필요
}

export interface ResumeSimpleDTO {
  resumeId?: number;
  fileUrl?: string;
}
