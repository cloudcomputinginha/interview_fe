import { serverFetch } from "../utils/fetch/fetch";
import {
  CreateCoverletterDTO,
  ApiResponseCreateCoverletterDTO,
  ApiResponseCoverletterDetailDTO,
  ApiResponseMyCoverletterListDTO,
} from "./types/coverletter-types";

// 자기소개서 생성
export async function createCoverletter(data: CreateCoverletterDTO) {
  return serverFetch.post<
    ApiResponseCreateCoverletterDTO,
    CreateCoverletterDTO
  >("/coverletters", data);
}

// 자기소개서 상세 조회
export async function getCoverletterDetail(coverletterId: number) {
  return serverFetch.get<ApiResponseCoverletterDetailDTO>(
    `/coverletters/${coverletterId}`
  );
}

// 내 자기소개서 리스트 조회
export async function findMyCoverletter(memberId: number) {
  return serverFetch.get<ApiResponseMyCoverletterListDTO>("/coverletters/me", {
    memberId,
  });
}
