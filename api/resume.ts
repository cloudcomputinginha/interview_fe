import { serverFetch } from "../utils/fetch/fetch";
import {
  ResumeCreateDTO,
  ApiResponseCreateResumeResultDTO,
  ApiResponsePresignedUploadDTO,
} from "./types/resume-types";

// presigned url 발급
export async function getPresignedUploadUrl(fileName: string) {
  return serverFetch.get<ApiResponsePresignedUploadDTO>("/resumes/upload", {
    fileName,
  });
}

// 이력서 메타데이터 저장
export async function saveResume(data: ResumeCreateDTO) {
  return serverFetch.post<ApiResponseCreateResumeResultDTO, ResumeCreateDTO>(
    "/resumes/upload",
    data
  );
}
