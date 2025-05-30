"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Mic, MicOff, Video, VideoOff, X, ChevronRight, AlertCircle, Loader2 } from "lucide-react"
import { useInterviewSession } from './hooks/use-interview-session'
import { useToast } from '@/components/ui/use-toast'
import { AnimatePresence, motion } from 'framer-motion'

/**
 * InterviewSessionPage
 * --------------------
 * 주요 수정 사항
 * 1. 마이크 토글(isMicOn)에 대한 실제 오디오 트랙 enable/disable 로직 추가
 * 2. 비디오 스트림이 연결된 후 video.play() 호출하여 Safari 등 autoplay 제한 우회
 * 3. getUserMedia, SpeechRecognition 호출 시 HTTPS / localhost 체크 및 상세 에러 노출
 * 4. 컴포넌트 언마운트 시 스트림 및 음성인식 정리
 */
export default function InterviewSessionPage() {
  /* ------------------------------ 인터뷰 진행 로직 ------------------------------ */
  const {
    session,
    qaFlow,
    currentQuestionIdx,
    currentFollowUpIdx,
    isLoading,
    isQuestionLoading,
    error,
    handleMainAnswerSubmit,
    handleFollowUpAnswerSubmit,
    handleNext,
  } = useInterviewSession("1", "1")

  /* ------------------------------ 상태 ------------------------------ */
  const [isMicOn, setIsMicOn] = useState(true)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [mediaError, setMediaError] = useState<string | null>(null)
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null)
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null)
  const [answerText, setAnswerText] = useState('')
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [interimTranscript, setInterimTranscript] = useState('')
  const [submittedAnswer, setSubmittedAnswer] = useState('')
  const [timeLeft, setTimeLeft] = useState(120)
  const [isAnswering, setIsAnswering] = useState(false)
  const [isUploadingAudio, setIsUploadingAudio] = useState(false)
  const [isUploadingVideo, setIsUploadingVideo] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const audioRecorderRef = useRef<MediaRecorder | null>(null)
  const videoRecorderRef = useRef<MediaRecorder | null>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    async function getPermissions() {
      const isLocalhost = ['localhost', '127.0.0.1', '0.0.0.0'].includes(window.location.hostname)
      if (window.location.protocol !== 'https:' && !isLocalhost) {
        setMediaError('보안 제한으로 인해 HTTPS 환경 또는 localhost/127.0.0.1/0.0.0.0 에서만 카메라/마이크를 사용할 수 있습니다.')
        return
      }
      try {
        navigator.mediaDevices.enumerateDevices().then(devices => {
          console.log('장치 목록:', devices)
        })
        const baseStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
        setAudioStream(new MediaStream(baseStream.getAudioTracks()))
        setVideoStream(new MediaStream(baseStream.getVideoTracks()))
      } catch (e) {
        console.error(e)
        setMediaError('카메라/마이크 권한이 거부되었습니다. 브라우저 설정을 확인해주세요.')
      }
    }
    getPermissions()
  }, [])

  /* ------------------------------ 타이머 처리 ------------------------------ */
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isAnswering && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000)
    }
    return () => timer && clearInterval(timer)
  }, [isAnswering, timeLeft])

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  /* ------------------------------ MediaRecorder 제어 ------------------------------ */
  const startRecorders = useCallback(() => {
    if (audioStream && !audioRecorderRef.current) {
      const chunks: Blob[] = []
      const rec = new MediaRecorder(audioStream)
      rec.ondataavailable = e => e.data.size && chunks.push(e.data)
      rec.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' })
        setAudioBlob(blob)
        setAudioUrl(URL.createObjectURL(blob))
      }
      rec.start()
      audioRecorderRef.current = rec
    }
    if (videoStream && !videoRecorderRef.current) {
      const chunks: Blob[] = []
      const rec = new MediaRecorder(videoStream)
      rec.ondataavailable = e => e.data.size && chunks.push(e.data)
      rec.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' })
        setVideoBlob(blob)
        setVideoUrl(URL.createObjectURL(blob))
      }
      rec.start()
      videoRecorderRef.current = rec
    }
  }, [audioStream, videoStream])

  const stopRecorders = useCallback(() => {
    audioRecorderRef.current?.state !== 'inactive' && audioRecorderRef.current?.stop()
    videoRecorderRef.current?.state !== 'inactive' && videoRecorderRef.current?.stop()
    audioRecorderRef.current = null
    videoRecorderRef.current = null
  }, [])

  const startSTT = useCallback(() => {
    stopSTT()
    const SpeechRecognition: any = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    if (!SpeechRecognition) {
      toast({ title: '음성 인식 미지원', description: '현재 브라우저에서 음성 인식을 지원하지 않습니다.', variant: 'destructive' })
      return
    }
    const recog = new SpeechRecognition()
    recog.lang = 'ko-KR'
    recog.interimResults = true
    recog.onresult = (event: any) => {
      let interim = ''
      let final = ''
      for (let i = 0; i < event.results.length; i++) {
        const res = event.results[i]
        res.isFinal ? (final += res[0].transcript) : (interim += res[0].transcript)
      }
      setAnswerText(final)
      setInterimTranscript(interim)
    }
    recog.onend = () => isAnswering && startSTT() // 재시작
    recog.start()
    recognitionRef.current = recog
    setIsTranscribing(true)
  }, [isAnswering, toast])

  const stopSTT = useCallback(() => {
    recognitionRef.current?.stop()
    recognitionRef.current = null
    setIsTranscribing(false)
  }, [])

  /* ------------------------------ 미디어 토글 ------------------------------ */
  useEffect(() => {
    if (audioStream) audioStream.getAudioTracks().forEach(t => (t.enabled = isMicOn))
  }, [isMicOn, audioStream])

  useEffect(() => {
    if (videoStream) videoStream.getVideoTracks().forEach(t => (t.enabled = isVideoOn))
  }, [isVideoOn, videoStream])

  /* ------------------------------ video element 스트림 연결 ------------------------------ */
  useEffect(() => {
    if (videoRef.current && videoStream) {
      videoRef.current.srcObject = videoStream
      videoRef.current.onloadedmetadata = () => videoRef.current?.play().catch(() => { })
    }
  }, [videoStream])

  /* ------------------------------ 컴포넌트 언마운트 정리 ------------------------------ */
  useEffect(() => () => {
    stopSTT()
    stopRecorders()
    audioStream?.getTracks().forEach(t => t.stop())
    videoStream?.getTracks().forEach(t => t.stop())
  }, [audioStream, videoStream, stopRecorders, stopSTT])

  /* ------------------------------ 질문 및 팔로우업 가공 ------------------------------ */
  const processedQaFlow = qaFlow.map(q => ({ ...q, follow_ups: q.follow_ups?.slice(0, 1) || [] }))
  const currentQa = processedQaFlow[currentQuestionIdx]
  const isFollowUp = currentFollowUpIdx !== null
  const currentQuestionText = isFollowUp ? currentQa?.follow_ups?.[0]?.question : currentQa?.question
  const questionNumber = isFollowUp ? `${currentQuestionIdx + 1}-1` : `${currentQuestionIdx + 1}`

  /* ------------------------------ 업로드 헬퍼 ------------------------------ */
  async function uploadFile(blob: Blob, type: 'audio' | 'video') {
    type === 'audio' ? setIsUploadingAudio(true) : setIsUploadingVideo(true)
    const formData = new FormData()
    formData.append('file', blob, `answer.${type === 'audio' ? 'webm' : 'webm'}`)
    try {
      const res = await fetch(`/api/upload/${type}`, { method: 'POST', body: formData })
      if (!res.ok) throw new Error(`${type} 업로드 실패`)
      const { url, filename } = await res.json()
      toast({ title: `${type === 'audio' ? '오디오' : '비디오'} 업로드 완료`, description: '성공적으로 업로드되었습니다.' })
      return url || filename || ''
    } finally {
      type === 'audio' ? setIsUploadingAudio(false) : setIsUploadingVideo(false)
    }
  }

  /* ------------------------------ UI 이벤트 ------------------------------ */
  const handleStartAnswering = () => {
    setAnswerText('')
    setInterimTranscript('')
    setSubmitted(false)
    setIsAnswering(true)
    setTimeLeft(120)
    startRecorders()
    startSTT()
  }

  const handleSubmit = async () => {
    stopSTT()
    stopRecorders()
    let uploadedAudioUrl = ''
    let uploadedVideoUrl = ''
    if (audioBlob) uploadedAudioUrl = await uploadFile(audioBlob, 'audio')
    if (videoBlob) uploadedVideoUrl = await uploadFile(videoBlob, 'video')
    const payload = JSON.stringify({ text: answerText, audioUrl: uploadedAudioUrl, videoUrl: uploadedVideoUrl })
    isFollowUp ? await handleFollowUpAnswerSubmit(payload) : await handleMainAnswerSubmit(payload)
    setIsAnswering(false)
    setSubmitted(true)
    setSubmittedAnswer(answerText)
    toast({ title: '답변 제출 완료', description: '답변이 성공적으로 제출되었습니다.' })
  }

  // 질문을 음성으로 읽어주는 함수 (TTS)
  function speakQuestion(question: string) {
    if (typeof window === 'undefined') return
    const synth = window.speechSynthesis
    if (!synth) return
    const utter = new window.SpeechSynthesisUtterance(question)
    utter.lang = 'ko-KR'
    synth.speak(utter)
  }

  /* ------------------------------ 렌더 ------------------------------ */
  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">로딩 중...</div>
  if (error || mediaError) return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-red-400">{error || mediaError}</div>

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Top Bar */}
      <div className="p-4 border-b border-gray-800 flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-[#8FD694] flex items-center justify-center mr-2">
            <span className="text-white font-bold">AI</span>
          </div>
          <span className="font-bold">InterviewPro</span>
        </div>
        <div className="text-center">
          <span className="text-sm text-gray-400">면접 진행 중</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
          onClick={() => {
            if (confirm('면접을 종료하시겠습니까? 지금까지의 진행 상황은 저장되지 않습니다.')) {
              window.location.href = '/workspace'
            }
          }}
        >
          <X className="h-5 w-5 mr-1" /> 종료
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Video Area */}
        <div className="flex-1 p-4 flex flex-col">
          {/* Current Question + TTS 버튼 + 애니메이션 + 질문 로딩 스피너 */}
          <AnimatePresence mode="wait">
            <motion.div
              key={questionNumber + currentQuestionText}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-800 p-4 rounded-lg mb-4 min-h-[120px] flex flex-col justify-center"
            >
              {isQuestionLoading ? (
                <div className="flex items-center justify-center h-24">
                  <Loader2 className="animate-spin w-8 h-8 text-[#8FD694]" />
                </div>
              ) : (
                <>
                  <div className="flex items-center text-sm text-gray-400 mb-2">
                    <span>
                      질문 {questionNumber}/{processedQaFlow.length}
                    </span>
                    <Button size="sm" className="ml-2 bg-[#8FD694] text-white" onClick={() => speakQuestion(currentQuestionText)}>
                      질문 읽어주기
                    </Button>
                  </div>
                  <p className="text-lg font-medium">{currentQuestionText}</p>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Video Container */}
          <div className="flex-1 flex">
            {/* AI Interviewer */}
            <div className="flex-1 bg-gray-800 rounded-lg mr-2 flex flex-col items-center justify-center relative">
              <div className="absolute top-3 left-3 bg-gray-900/50 px-2 py-1 rounded text-xs">면접관</div>
              <div className="w-24 h-24 rounded-full bg-[#8FD694] bg-opacity-20 flex items-center justify-center">
                <span className="text-[#8FD694] text-4xl font-bold">AI</span>
              </div>
            </div>

            {/* User Video */}
            <div className="flex-1 bg-gray-800 rounded-lg flex flex-col items-center justify-center relative">
              <div className="absolute top-3 left-3 bg-gray-900/50 px-2 py-1 rounded text-xs">나</div>
              {isVideoOn && videoStream ? (
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center">
                  <span className="text-gray-400 text-4xl font-bold">Me</span>
                </div>
              )}

              {/* Recording Indicator (항상 true) */}
              {isAnswering && (
                <div className="absolute top-3 right-3 flex items-center bg-red-900/50 px-2 py-1 rounded">
                  <div className="w-2 h-2 rounded-full bg-red-500 mr-1"></div>
                  <span className="text-xs">REC</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-80 bg-gray-800 p-4 flex flex-col">
          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-400">진행 상황</span>
              <span className="text-sm font-medium">
                {currentQuestionIdx + 1}/{qaFlow.length}
              </span>
            </div>
            <Progress value={((currentQuestionIdx + 1) / qaFlow.length) * 100} className="h-2 bg-gray-700" />
          </div>

          {/* Timer */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-400">남은 시간</span>
              <span className={`text-sm font-medium ${timeLeft < 30 ? 'text-red-400' : ''}`}>{formatTime(timeLeft)}</span>
            </div>
            <div className="w-full bg-gray-700 h-1 rounded-full overflow-hidden">
              <div
                className={`h-full ${timeLeft < 30 ? 'bg-red-500' : 'bg-[#8FD694]'}`}
                style={{ width: `${(timeLeft / 120) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Status */}
          <div className="bg-gray-700 rounded-lg p-4 mb-6">
            {!isAnswering ? (
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-[#8FD694] mr-2" />
                <p className="text-sm">준비가 되면 "답변 시작" 버튼을 클릭하세요.</p>
              </div>
            ) : timeLeft > 0 ? (
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-[#8FD694] mr-2"></div>
                <p className="text-sm">답변 중입니다. 마이크가 켜져 있는지 확인하세요.</p>
              </div>
            ) : (
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
                <p className="text-sm">답변 시간이 종료되었습니다. 다음 질문으로 넘어가세요.</p>
              </div>
            )}
          </div>

          {/* Action Buttons & 녹음/녹화 상태 표시 */}
          <div className="mt-auto">
            {!isAnswering ? (
              <Button className="w-full bg-[#8FD694] hover:bg-[#7ac47f] text-white" onClick={handleStartAnswering}>
                답변 시작
              </Button>
            ) : (
              <>
                <div className="mb-2 text-center text-sm text-[#8FD694]">녹음/녹화 중... (음성 인식도 동작 중)</div>
                <div className="flex gap-2 mb-2 justify-center">
                  <Button size="sm" variant="outline" onClick={startSTT} disabled={submitted}>
                    이어 말하기
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => { setAnswerText(''); setInterimTranscript(''); startSTT() }} disabled={submitted}>
                    답변 다시하기
                  </Button>
                </div>
                {isTranscribing && (
                  <div className="flex items-center text-xs text-yellow-400">
                    <Loader2 className="animate-spin w-4 h-4 mr-1" /> 음성 인식 중...
                  </div>
                )}
                {isUploadingAudio && (
                  <div className="flex items-center text-xs text-yellow-400">
                    <Loader2 className="animate-spin w-4 h-4 mr-1" /> 오디오 업로드 중...
                  </div>
                )}
                {isUploadingVideo && (
                  <div className="flex items-center text-xs text-yellow-400">
                    <Loader2 className="animate-spin w-4 h-4 mr-1" /> 비디오 업로드 중...
                  </div>
                )}
                {interimTranscript && (
                  <div className="text-xs text-[#8FD694] mb-1">실시간 인식: {interimTranscript}</div>
                )}
                <textarea
                  className="w-full p-2 rounded bg-gray-900 text-white border border-gray-700 mb-2 resize-none"
                  rows={3}
                  placeholder="답변을 텍스트로 입력해도 좋아요!"
                  value={answerText}
                  onChange={e => setAnswerText(e.target.value)}
                  disabled={submitted}
                />
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSubmit} disabled={submitted}>
                  {timeLeft > 0 ? '답변 제출' : '다음 질문'} <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </>
            )}
            {audioUrl && (
              <div className="mt-4">
                <audio controls src={audioUrl} className="w-full" />
                <div className="text-xs text-gray-400 mt-1">녹음 미리듣기</div>
              </div>
            )}
            {videoUrl && (
              <div className="mt-4">
                <video controls src={videoUrl} className="w-full" />
                <div className="text-xs text-gray-400 mt-1">녹화 미리보기</div>
              </div>
            )}
            {submittedAnswer && (
              <div className="text-xs text-blue-400 mt-2">제출된 답변: {submittedAnswer}</div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="p-4 border-t border-gray-800 flex justify-center">
        <div className="flex space-x-4">
          <Button
            variant="outline"
            size="icon"
            className={`rounded-full w-12 h-12 ${isMicOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-600'}`}
            onClick={() => setIsMicOn(!isMicOn)}
          >
            {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </Button>
          <Button
            variant="outline"
            size="icon"
            className={`rounded-full w-12 h-12 ${isVideoOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-600'}`}
            onClick={() => setIsVideoOn(!isVideoOn)}
          >
            {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
          </Button>
          <Button
            variant="destructive"
            size="icon"
            className="rounded-full w-12 h-12"
            onClick={() => {
              if (confirm('면접을 종료하시겠습니까? 지금까지의 진행 상황은 저장되지 않습니다.')) {
                window.location.href = '/workspace'
              }
            }}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
