export interface ResumeCreateDTO {
  memberId?: number;
  fileName: string;
  fileUrl: string;
  fileSize: number;
}

export interface CreateResumeResultDTO {
  resumeId?: number;
  createdAt?: string;
}

export interface ApiResponseCreateResumeResultDTO {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  result?: CreateResumeResultDTO;
}

export interface PresignedUploadDTO {
  presignedUrl?: string;
  key?: string;
  fileUrl?: string;
}

export interface ApiResponsePresignedUploadDTO {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  result?: PresignedUploadDTO;
}
