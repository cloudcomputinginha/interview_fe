import { aiFetch } from "../utils/fetch/fetch";

// 예시: AI 서버에 질문 생성 요청 (엔드포인트/타입은 실제 사용에 맞게 수정 필요)
export async function generateInterviewQuestions(payload: any) {
  return aiFetch.post<any, any>("/ai/interview/questions", payload);
}

// 추가적인 AI 인터뷰 관련 API 함수는 여기에 작성
