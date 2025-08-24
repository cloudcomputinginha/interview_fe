import { useQueries } from '@tanstack/react-query'
import { preloadAudio } from '@/utils/audio'
import type { QA } from '@/apis/types/interview-types'
import { useEffect, useState, useCallback } from 'react'

interface UseAudioQueriesProps {
	qaFlow: QA[]
}

interface AudioFile {
	key: string
	path: string
}

export function useAudioQueries({ qaFlow }: UseAudioQueriesProps) {
	const [audioUrlMap, setAudioUrlMap] = useState<Record<string, string>>({})
	const [loadedAudioKeys, setLoadedAudioKeys] = useState<Set<string>>(new Set())
	const [pendingAudioKeys, setPendingAudioKeys] = useState<Set<string>>(
		new Set()
	)

	// 오디오 파일 목록 생성
	const getAudioFiles = useCallback((qaFlow: QA[]): AudioFile[] => {
		if (!qaFlow || !Array.isArray(qaFlow) || qaFlow.length === 0) {
			return []
		}

		return qaFlow.flatMap((q, qIdx) => {
			const files: AudioFile[] = []

			// 메인 질문 오디오
			if (q.audioPath) {
				files.push({
					key: `${qIdx}_-1`,
					path: q.audioPath,
				})
			}

			// 팔로우업 오디오들
			if (Array.isArray(q.followUps)) {
				q.followUps.forEach((f, fIdx) => {
					if (f.audioPath) {
						files.push({
							key: `${qIdx}_${fIdx}`,
							path: f.audioPath,
						})
					}
				})
			}

			return files
		})
	}, [])

	// 특정 오디오 키들을 병렬로 로드하는 함수
	const loadAudioKeys = useCallback(
		async (keys: string[]) => {
			if (!qaFlow || !Array.isArray(qaFlow) || qaFlow.length === 0) {
				return audioUrlMap
			}

			const audioFiles = getAudioFiles(qaFlow)
			const targetFiles = audioFiles.filter(file => keys.includes(file.key))

			// 이미 로드되었거나 로딩 중인 파일은 제외
			const newFiles = targetFiles.filter(
				file =>
					!loadedAudioKeys.has(file.key) && !pendingAudioKeys.has(file.key)
			)

			if (newFiles.length === 0) {
				return audioUrlMap
			}

			// 로딩 중인 키들 추가
			setPendingAudioKeys(prev => new Set([...prev, ...keys]))

			try {
				// 병렬로 오디오 로드
				const loadPromises = newFiles.map(async file => {
					try {
						const blobUrl = await preloadAudio(file.path)
						return { key: file.key, url: blobUrl }
					} catch (error) {
						console.error(`오디오 로드 실패: ${file.key}`, error)
						return null
					}
				})

				const results = await Promise.all(loadPromises)
				const newAudioMap: Record<string, string> = {}

				results.forEach(result => {
					if (result) {
						newAudioMap[result.key] = result.url
					}
				})

				// 상태 업데이트
				setAudioUrlMap(prev => ({
					...prev,
					...newAudioMap,
				}))

				setLoadedAudioKeys(
					prev => new Set([...prev, ...Object.keys(newAudioMap)])
				)
				setPendingAudioKeys(prev => {
					const newSet = new Set(prev)
					Object.keys(newAudioMap).forEach(key => newSet.delete(key))
					return newSet
				})

				return newAudioMap
			} catch (error) {
				console.error('오디오 로드 실패:', error)
				setPendingAudioKeys(prev => {
					const newSet = new Set(prev)
					keys.forEach(key => newSet.delete(key))
					return newSet
				})
				return {}
			}
		},
		[qaFlow, getAudioFiles, loadedAudioKeys, pendingAudioKeys, audioUrlMap]
	)

	// 특정 질문의 팔로우업 오디오들을 병렬로 로드하는 함수
	const loadFollowUpAudios = useCallback(
		async (questionIdx: number) => {
			if (!qaFlow || !Array.isArray(qaFlow) || qaFlow.length === 0) {
				return {}
			}

			const question = qaFlow[questionIdx]
			if (!question?.followUps) return {}

			const followUpKeys = question.followUps
				.map((_, fIdx) => `${questionIdx}_${fIdx}`)
				.filter(key => !loadedAudioKeys.has(key) && !pendingAudioKeys.has(key))

			if (followUpKeys.length === 0) return {}

			console.log(`팔로우업 오디오 병렬 로드 시작: ${followUpKeys.join(', ')}`)
			return await loadAudioKeys(followUpKeys)
		},
		[qaFlow, loadedAudioKeys, pendingAudioKeys, loadAudioKeys]
	)

	// 전체 오디오 파일 목록
	const allAudioFiles = getAudioFiles(qaFlow)

	// 아직 로드되지 않은 오디오들 (로딩 중인 것 제외)
	const unloadedAudioFiles = allAudioFiles.filter(
		file => !loadedAudioKeys.has(file.key) && !pendingAudioKeys.has(file.key)
	)

	// useQueries로 병렬 로딩 (초기 로딩용)
	const queries = useQueries({
		queries:
			unloadedAudioFiles.length > 0
				? unloadedAudioFiles.map(file => ({
						queryKey: ['audio', file.key, file.path],
						queryFn: () => preloadAudio(file.path),
						enabled:
							!!file.path &&
							!loadedAudioKeys.has(file.key) &&
							!pendingAudioKeys.has(file.key),
						staleTime: 10 * 60 * 1000, // 10분간 캐시
						gcTime: 30 * 60 * 1000, // 30분간 가비지 컬렉션 방지
					}))
				: [],
	})

	// 쿼리 결과를 audioUrlMap에 반영
	useEffect(() => {
		if (unloadedAudioFiles.length === 0) return

		const newAudioMap: Record<string, string> = {}
		const newLoadedKeys: string[] = []

		unloadedAudioFiles.forEach((file, index) => {
			const query = queries[index]
			if (query.data) {
				newAudioMap[file.key] = query.data
				newLoadedKeys.push(file.key)
			}
		})

		if (Object.keys(newAudioMap).length > 0) {
			setAudioUrlMap(prev => ({
				...prev,
				...newAudioMap,
			}))
			setLoadedAudioKeys(prev => new Set([...prev, ...newLoadedKeys]))
		}
	}, [queries, unloadedAudioFiles])

	// 오디오 재생 함수
	const playAudio = useCallback(
		(key: string) => {
			const audioUrl = audioUrlMap[key]
			if (!audioUrl) {
				console.warn(`오디오를 찾을 수 없습니다: ${key}`)
				return null
			}

			const audio = new Audio(audioUrl)
			audio.play().catch(error => {
				console.error(`오디오 재생 실패: ${key}`, error)
			})

			return audio
		},
		[audioUrlMap]
	)

	// 특정 오디오가 로드되었는지 확인
	const isAudioLoaded = useCallback(
		(key: string) => {
			return loadedAudioKeys.has(key) && !!audioUrlMap[key]
		},
		[loadedAudioKeys, audioUrlMap]
	)

	// 특정 오디오가 로딩 중인지 확인
	const isAudioLoading = useCallback(
		(key: string) => {
			return pendingAudioKeys.has(key)
		},
		[pendingAudioKeys]
	)

	// 특정 질문의 모든 오디오가 로드되었는지 확인
	const isQuestionAudioLoaded = useCallback(
		(questionIdx: number) => {
			const question = qaFlow[questionIdx]
			if (!question) return false

			// 메인 질문 확인
			const mainKey = `${questionIdx}_-1`
			if (question.audioPath && !isAudioLoaded(mainKey)) return false

			// 팔로우업 질문들 확인
			if (Array.isArray(question.followUps)) {
				for (let fIdx = 0; fIdx < question.followUps.length; fIdx++) {
					const followKey = `${questionIdx}_${fIdx}`
					if (question.followUps[fIdx].audioPath && !isAudioLoaded(followKey)) {
						return false
					}
				}
			}

			return true
		},
		[qaFlow, isAudioLoaded]
	)

	return {
		audioUrlMap,
		isLoading:
			queries.some(query => query.isLoading) || pendingAudioKeys.size > 0,
		error: queries.find(query => query.error)?.error,
		progress: queries.filter(query => query.isSuccess).length / queries.length,
		loadedAudioKeys: Array.from(loadedAudioKeys),
		pendingAudioKeys: Array.from(pendingAudioKeys),
		loadAudioKeys,
		loadFollowUpAudios,
		playAudio,
		isAudioLoaded,
		isAudioLoading,
		isQuestionAudioLoaded,
	}
}
