import { serverFetch } from './fetch/fetch'
import { ApiResponseListInterviewGroupCardDTO } from '../apis/types/interview-types'

/**
 * 엔티티에 연결된 면접 목록을 조회하는 공통 함수
 * @param entityType - 엔티티 타입 ('resumes' 또는 'coverletters')
 * @param entityId - 엔티티 ID
 * @returns 연결된 면접 목록
 */
export async function checkEntityInterviewConnections(
	entityType: 'resumes' | 'coverletters',
	entityId: number
) {
	return serverFetch.get<ApiResponseListInterviewGroupCardDTO>(
		`/${entityType}/${entityId}/interviews`
	)
}
