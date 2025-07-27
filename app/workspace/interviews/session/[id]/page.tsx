'use client'

import React, { useState, useEffect, useRef, useCallback, use } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { X, AlertCircle, Loader2 } from 'lucide-react'
import { useInterviewSession } from '../hooks/interview'
import { AnimatePresence, motion } from 'framer-motion'
import { RealtimeProvider, useInterviewRealtime } from '../hooks/interview'
import { WebcamView } from './webcam-view'
import { useInterviewWebSocket } from '../hooks/interview'

export default function InterviewSessionPage({
	params,
}: {
	params: Promise<{ id: string }>
}) {
	const { id: interviewId } = use(params) as { id: string }

	const sessionCtx = useInterviewSession(interviewId)
	const socketCtx = useInterviewWebSocket(sessionCtx)

	if (sessionCtx.isLoading) {
		// 로딩 메시지/애니메이션
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
				<AnimatePresence mode="wait">
					<motion.div
						key={sessionCtx.progressMessage}
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						transition={{ duration: 0.4 }}
						className="text-xl font-semibold"
					>
						{sessionCtx.progressMessage}
					</motion.div>
				</AnimatePresence>
			</div>
		)
	}

	if (!socketCtx.isStarted) {
		// "면접 시작" 버튼만 노출
		return (
			<div className="min-h-screen flex flex-col gap-3 items-center justify-center bg-gray-900 text-white">
				<div className="text-xl font-semibold mb-4">
					면접이 모두 준비되었어요.
				</div>
				<div className="text-sm text-gray-400 mb-4">
					면접을 시작하려면 아래 버튼을 클릭하세요.
				</div>
				<Button
					className="text-sm px-8 py-4 bg-[#8FD694]"
					onClick={() => socketCtx.setIsStarted(true)}
				>
					면접 시작
				</Button>
			</div>
		)
	}
	return (
		<RealtimeProvider
			wsRef={socketCtx.wsRef ?? null}
			connectWsAsync={socketCtx.connectWsAsync}
		>
			<InterviewSessionContent sessionCtx={sessionCtx} socketCtx={socketCtx} />
		</RealtimeProvider>
	)
}

function InterviewSessionContent({
	sessionCtx,
	socketCtx,
}: {
	sessionCtx: ReturnType<typeof useInterviewSession>
	socketCtx: ReturnType<typeof useInterviewWebSocket>
}) {
	const {
		session,
		currentQuestionIdx,
		currentFollowUpIdx,
		isQuestionLoading,
		isFeedbackLoading,
		isFinalReportLoading,
		finalReport,
		audioUrlMap,
		timer,
		setTimer,
		handleMainAnswerSubmit,
		handleFollowUpAnswerSubmit,
		isAudioPreloading,
	} = sessionCtx

	const {
		voiceAnswerText,
		setVoiceAnswerText,
		isProcessing,
		setIsProcessing,
		connectWsAsync,
	} = socketCtx

	const { isAnswering, handleStartAnswering, stopAnswering } =
		useInterviewRealtime()

	useEffect(() => {
		if (finalReport) {
			alert('면접이 종료되었습니다. 면접 결과를 확인해주세요.')
			window.location.href =
				'/workspace/interviews/session/report/' +
				sessionCtx.session?.interviewId +
				'_' +
				sessionCtx.session?.memberInterviewId +
				'_' +
				sessionCtx.session?.sessionId
		}
	}, [finalReport])

	const [isSubmitting, setIsSubmitting] = useState(false)
	const [answerText, setAnswerText] = useState('')

	useEffect(() => {
		if (isAnswering && timer === 0 && !isSubmitting) {
			handleSubmit()
		}
	}, [isAnswering, timer, isSubmitting])

	// 버튼 활성화 조건
	const canSubmit =
		(!!voiceAnswerText && voiceAnswerText.trim().length > 0) ||
		((!voiceAnswerText || voiceAnswerText.trim().length === 0) &&
			!!answerText &&
			answerText.trim().length > 0)

	const handleSubmit = async () => {
		setIsSubmitting(true)

		const IS_TEXT_ANSWER = true

		try {
			if (answerText.trim() === '' && voiceAnswerText.trim() === '') {
				alert('답변을 말해주세요.')
				return
			} else {
				if (currentFollowUpIdx === -1) {
					if (voiceAnswerText.trim() === '') {
						handleMainAnswerSubmit(answerText, IS_TEXT_ANSWER)
					} else {
						handleMainAnswerSubmit(voiceAnswerText)
					}
				} else {
					if (voiceAnswerText.trim() === '') {
						handleFollowUpAnswerSubmit(answerText, IS_TEXT_ANSWER)
					} else {
						handleFollowUpAnswerSubmit(voiceAnswerText)
					}
				}
			}
			stopAnswering()
			setAnswerText('')
			setVoiceAnswerText('')
			setTimer(120)
		} catch (e) {
			console.error(e)
		} finally {
			setIsProcessing(true)
			setIsSubmitting(false)
		}
	}

	const processedQaFlow = session?.qaFlow?.map(q => ({
		...q,
		followUps: q.followUps || [],
	}))
	const currentQa = processedQaFlow?.[currentQuestionIdx]
	const isFollowUp = currentFollowUpIdx !== -1
	const currentQuestionText = isFollowUp
		? currentQa?.followUps?.[currentFollowUpIdx]?.question
		: currentQa?.question
	const questionNumber = isFollowUp
		? `${currentQuestionIdx + 1}-${currentFollowUpIdx + 1}`
		: `${currentQuestionIdx + 1}`
	const formatTime = (s: number) =>
		`${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

	const currentAudioPath = `${currentQuestionIdx}_${currentFollowUpIdx}`
	const audioUrl = currentAudioPath ? audioUrlMap[currentAudioPath] : null
	const audioRef = useRef<HTMLAudioElement | null>(null)

	useEffect(() => {
		if (audioUrl) {
			if (audioRef.current) {
				audioRef.current.pause()
				audioRef.current.currentTime = 0
			}
			audioRef.current = new window.Audio(audioUrl)
			audioRef.current.play().catch(e => console.error('오디오 재생 에러:', e))
		}
		return () => {
			if (audioRef.current) {
				audioRef.current.pause()
				audioRef.current.currentTime = 0
			}
		}
	}, [audioUrl])

	useEffect(() => {
		if (isAnswering) {
			if (socketCtx.wsRef?.current === null) {
				connectWsAsync()
			}
		}
	}, [isAnswering])

	useEffect(() => {
		if (!isAnswering) return
		if (timer <= 0) return
		const interval = setInterval(() => {
			setTimer(t => (t > 0 ? t - 1 : 0))
		}, 1000)
		return () => clearInterval(interval)
	}, [isAnswering, timer, setTimer])

	if (isFinalReportLoading) {
		return (
			<div className="flex items-center justify-center h-full text-lg">
				최종 리포트를 생성하고 있습니다...
			</div>
		)
	}

	return (
		<>
			<div className="min-h-screen bg-gray-900 text-white flex flex-col">
				<div className="p-4 border-b border-gray-800 flex justify-between items-center">
					<div className="flex items-center">
						<div className="w-8 h-8 rounded-full bg-[#8FD694] flex items-center justify-center mr-2">
							<span className="text-white font-bold">In</span>
						</div>
						<span className="font-bold">job</span>
					</div>
					<div className="text-center">
						<span className="text-sm text-gray-400">면접 진행 중</span>
					</div>
					<Button
						variant="ghost"
						size="sm"
						className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
						onClick={() => {
							if (
								confirm(
									'면접을 종료하시겠습니까? 지금까지의 진행 상황은 저장되지 않습니다.'
								)
							) {
								window.location.href = '/workspace'
							}
						}}
					>
						<X className="h-5 w-5 mr-1" /> 종료
					</Button>
				</div>

				<div className="flex-1 flex flex-col md:flex-row">
					<div className="flex-1 p-4 flex flex-col">
						<AnimatePresence mode="wait">
							<motion.div
								key={questionNumber + currentQuestionText}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								transition={{ duration: 0.3 }}
								className="bg-gray-800 p-4 rounded-lg mb-4 min-h-[120px] flex flex-col justify-center"
							>
								{isFeedbackLoading ? (
									<div className="flex items-center justify-center h-24">
										<div className="text-sm text-gray-400 mr-2">
											피드백을 생성하고 있습니다...
										</div>
										<Loader2 className="animate-spin w-8 h-8 text-[#8FD694]" />
									</div>
								) : isAudioPreloading ? (
									<div className="flex items-center justify-center h-24">
										<div className="text-sm text-gray-400 mr-2">
											오디오를 로드하고 있습니다...
										</div>
										<Loader2 className="animate-spin w-8 h-8 text-[#8FD694]" />
									</div>
								) : isQuestionLoading ? (
									<div className="flex items-center justify-center h-24">
										<div className="text-sm text-gray-400 mr-2">
											질문을 생성하고 있습니다...
										</div>
										<Loader2 className="animate-spin w-8 h-8 text-[#8FD694]" />
									</div>
								) : (
									<>
										<div className="flex items-center text-sm text-gray-400 mb-2">
											<span>
												질문 {questionNumber}/
												{isFollowUp
													? currentQa?.followUps?.length
													: session?.qaFlow?.length}
											</span>
										</div>
										<p className="text-lg font-medium">{currentQuestionText}</p>
									</>
								)}
							</motion.div>
						</AnimatePresence>

						<div className="flex-1 flex">
							<div className="flex-1 bg-gray-800 rounded-lg mr-2 flex flex-col items-center justify-center relative">
								<div className="absolute top-3 left-3 bg-gray-900/50 px-2 py-1 rounded text-xs">
									면접관
								</div>
								<div className="w-24 h-24 rounded-full bg-[#8FD694] bg-opacity-20 flex items-center justify-center">
									<span className="text-[#8FD694] text-4xl font-bold">AI</span>
								</div>
							</div>

							<div className="flex-1 bg-gray-800 rounded-lg flex flex-col items-center justify-center relative">
								<div className="absolute top-3 left-3 bg-gray-900/50 px-2 py-1 rounded text-xs">
									나
								</div>
								<WebcamView />
							</div>
						</div>
						{/* 
            <Button size="sm" className="ml-2 bg-[#8FD694] text-white" onClick={handlePlayAudio}>
              질문 읽어주기
            </Button> */}
					</div>

					<div className="w-full md:w-80 bg-gray-800 p-4 flex flex-col">
						<div className="mb-6">
							<div className="flex justify-between items-center mb-2">
								<span className="text-sm text-gray-400">진행 상황</span>
								<span className="text-sm font-medium">
									{currentQuestionIdx + 1}/{session?.qaFlow?.length}
								</span>
							</div>
							<Progress
								value={
									((currentQuestionIdx + 1) / (session?.qaFlow?.length || 0)) *
									100
								}
								className="h-2 bg-gray-700"
							/>
						</div>

						<div className="mb-6">
							<div className="flex justify-between items-center mb-2">
								<span className="text-sm text-gray-400">남은 시간</span>
								<span
									className={`text-sm font-medium ${timer < 30 ? 'text-red-400' : ''}`}
								>
									{formatTime(timer)}
								</span>
							</div>
							<div className="w-full bg-gray-700 h-1 rounded-full overflow-hidden">
								<div
									className={`h-full ${timer < 30 ? 'bg-red-500' : 'bg-[#8FD694]'}`}
									style={{ width: `${(timer / 120) * 100}%` }}
								></div>
							</div>
						</div>

						{/* Status */}
						<div className="bg-gray-700 rounded-lg p-4 mb-6">
							{!isAnswering ? (
								<div className="flex items-center">
									<AlertCircle className="h-5 w-5 text-[#8FD694] mr-2" />
									<p className="text-sm">
										준비가 되면 "답변 시작" 버튼을 클릭하세요.
									</p>
								</div>
							) : timer > 0 ? (
								<div className="flex items-center">
									<div className="w-2 h-2 rounded-full bg-[#8FD694] mr-2"></div>
									<p className="text-sm">
										답변 중입니다. 마이크가 켜져 있는지 확인하세요.
									</p>
								</div>
							) : (
								<div className="flex items-center">
									<AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
									<p className="text-sm">
										답변 시간이 종료되었습니다. 다음 질문으로 넘어가세요.
									</p>
								</div>
							)}
						</div>

						{/* Action Buttons & 녹음/녹화 상태 표시 */}
						<div className="mt-auto">
							{!isAnswering ? (
								<Button
									className="w-full bg-[#8FD694] hover:bg-[#7ac47f] text-white"
									disabled={isFeedbackLoading || isQuestionLoading}
									onClick={async () => {
										if (
											socketCtx.wsRef?.current &&
											socketCtx.wsRef.current.isConnected()
										) {
											handleStartAnswering()
										} else {
											await connectWsAsync()
											handleStartAnswering()
										}
									}}
								>
									답변 시작
								</Button>
							) : (
								<>
									<div className="mb-2 text-center text-sm text-[#8FD694]">
										음성 인식 결과 : {voiceAnswerText}
									</div>
									<textarea
										className="w-full p-2 rounded bg-gray-900 text-white border border-gray-700 mb-2 resize-none"
										rows={3}
										placeholder="답변을 텍스트로 입력해도 좋아요!"
										value={answerText}
										onChange={e => {
											setAnswerText(e.target.value)
											setIsProcessing(false)
										}}
										disabled={isSubmitting}
									/>
									<Button
										className="w-full bg-blue-600 hover:bg-blue-700 text-white"
										onClick={handleSubmit}
										disabled={
											isSubmitting ||
											isProcessing ||
											!canSubmit ||
											isFeedbackLoading ||
											isQuestionLoading
										}
									>
										{isSubmitting ? (
											<Loader2 className="animate-spin w-4 h-4 mr-2" />
										) : null}
										답변 제출
									</Button>
								</>
							)}
						</div>
					</div>
				</div>

				{/* Bottom Controls */}
				<div className="p-4 border-t border-gray-800 flex justify-center">
					<div className="flex space-x-4">
						<Button
							variant="destructive"
							size="icon"
							className="rounded-full w-12 h-12"
							onClick={() => {
								if (
									confirm(
										'면접을 종료하시겠습니까? 지금까지의 진행 상황은 저장되지 않습니다.'
									)
								) {
									window.location.href = '/workspace'
								}
							}}
						>
							<X className="h-5 w-5" />
						</Button>
					</div>
				</div>
			</div>
			{/* 3. 최종 리포트 다이얼로그
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>최종 면접 리포트</DialogHeader>
          <pre className="text-xs whitespace-pre-wrap max-h-96 overflow-auto">{JSON.stringify(finalReport, null, 2)}</pre>
          <DialogFooter>
            <Button onClick={() => {
              setOpen(false)
              alert('면접이 종료되었습니다. 면접 결과를 확인해주세요.')
              window.location.href = '/workspace'
            }}>닫기</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
		</>
	)
}
