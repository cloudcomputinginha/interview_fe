/**
 * 면접 참가자 정보를 나타내는 타입
 */
export interface Participant {
  id: string;
  name: string;
  score: string;
}

/**
 * 카테고리별 피드백 정보를 나타내는 타입
 */
export interface CategoryFeedback {
  name: string;
  score: string;
  feedback: string;
}

/**
 * 한 명의 참가자 리포트 전체 정보를 나타내는 타입
 */
export interface ParticipantReport {
  name: string;
  overallScore: string;
  categories: CategoryFeedback[];
  goodPoints: string[];
  improvementPoints: string[];
}

/**
 * 참가자 id별 리포트 매핑 타입
 */
export type ParticipantReports = Record<string, ParticipantReport>;
