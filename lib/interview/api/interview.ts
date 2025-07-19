import axios from 'axios'
import { InterviewFormState } from '../types'

/** FastAPI 엔드포인트: POST /api/interviews */
export interface InterviewResponse {
	id: string
	createdAt: string
}

export const createInterview = (body: InterviewFormState) =>
	axios.post<InterviewResponse>('/api/interviews', body).then(r => r.data)

/* 🔄 백엔드가 준비되지 않았다면 Mock 버전을 사용해도 됩니다
export const createInterview = async (body: InterviewFormState) => {
  console.log(\"[MOCK] 인터뷰 전송 payload\", body)
  return { id: \"mock-\" + Date.now(), createdAt: new Date().toISOString() }
}
*/
