"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Mic, MicOff, Video, VideoOff, SkipForward, StopCircle } from "lucide-react"
import { useInterviewStore } from "@/lib/stores/interview-store"

// Mock questions for interview
const MOCK_QUESTIONS = [
  "자기소개를 해주세요.",
  "지원 동기를 말씀해주세요.",
  "본인의 강점과 약점은 무엇인가요?",
  "가장 어려웠던 프로젝트 경험을 말씀해주세요.",
  "5년 후 본인의 모습을 그려보세요.",
]

export default function InterviewRoom() {
  const params = useParams()
  const router = useRouter()
  const interviewId = params.id as string

  const { getInterviewById } = useInterviewStore()
  const interview = getInterviewById(interviewId)

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [isMicOn, setIsMicOn] = useState(true)
  const [isCameraOn, setIsCameraOn] = useState(true)
  const [timeLeft, setTimeLeft] = useState(0)
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([])

  const videoRef = useRef<HTMLVideoElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!interview) {
      router.push("/workspace/interviews")
      return
    }

    initializeMedia()
    setTimeLeft(interview.options.answerDuration * 60) // Convert minutes to seconds

    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop())
      }
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [interview])

  const initializeMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })

      setMediaStream(stream)

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      console.error("Error accessing media devices:", error)
      alert("카메라와 마이크 접근 권한이 필요합니다.")
    }
  }

  const startRecording = () => {
    if (!mediaStream) return

    const recorder = new MediaRecorder(mediaStream)
    const chunks: Blob[] = []

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data)
      }
    }

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" })
      setRecordedChunks((prev) => [...prev, blob])
      saveRecordingToIndexedDB(blob, currentQuestionIndex)
    }

    recorder.start()
    setMediaRecorder(recorder)
    setIsRecording(true)

    // Start timer
    const duration = interview!.options.answerDuration * 60
    setTimeLeft(duration)

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          stopRecording()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop()
      setIsRecording(false)

      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }

  const saveRecordingToIndexedDB = async (blob: Blob, questionIndex: number) => {
    try {
      // This would typically use idb-keyval
      const questionId = `question-${questionIndex + 1}`

      // Mock API call
      const response = await fetch(`/api/v1/interviews/${interviewId}/answers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionId,
          blobUrl: `indexeddb://interview-${interviewId}-question-${questionIndex + 1}`,
        }),
      })

      console.log("Answer uploaded:", questionId)
    } catch (error) {
      console.error("Error saving recording:", error)
    }
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < MOCK_QUESTIONS.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
      setTimeLeft(interview!.options.answerDuration * 60)
    } else {
      // Interview completed
      router.push(`/workspace/interview/${interviewId}/result`)
    }
  }

  const toggleMic = () => {
    if (mediaStream) {
      const audioTrack = mediaStream.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        setIsMicOn(audioTrack.enabled)
      }
    }
  }

  const toggleCamera = () => {
    if (mediaStream) {
      const videoTrack = mediaStream.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        setIsCameraOn(videoTrack.enabled)
      }
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const progressPercentage = ((currentQuestionIndex + 1) / MOCK_QUESTIONS.length) * 100

  if (!interview) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">면접을 찾을 수 없습니다</h2>
          <Button onClick={() => router.push("/workspace/interviews")}>면접 목록으로 돌아가기</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">
              {interview.kind === "individual" ? interview.title : interview.sessionName}
            </h1>
            <div className="flex items-center space-x-4 mt-1">
              <Badge variant="secondary">
                질문 {currentQuestionIndex + 1}/{MOCK_QUESTIONS.length}
              </Badge>
              <span className="text-sm text-gray-300">
                {interview.options.interviewStyle === "technical" ? "기술 면접" : "인성 면접"}
              </span>
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl font-mono">{formatTime(timeLeft)}</div>
            <div className="text-sm text-gray-300">남은 시간</div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-4">
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Section */}
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Local Video */}
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="relative">
                    <video ref={videoRef} autoPlay muted className="w-full h-48 bg-gray-900 rounded-lg object-cover" />
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-sm">나</div>
                    {/* Timer Ring */}
                    <div className="absolute top-2 right-2">
                      <div
                        className="w-12 h-12 rounded-full border-4 border-[#8FD694] flex items-center justify-center text-xs font-bold"
                        style={{
                          background: `conic-gradient(#8FD694 ${(timeLeft / (interview.options.answerDuration * 60)) * 360}deg, transparent 0deg)`,
                        }}
                      >
                        {Math.ceil(timeLeft / 60)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* AI Video Placeholder */}
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="w-full h-48 bg-gray-900 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-[#8FD694] rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-2xl font-bold text-white">AI</span>
                      </div>
                      <div className="text-sm text-gray-300">AI 면접관</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Controls */}
            <div className="flex justify-center space-x-4">
              <Button
                variant={isMicOn ? "default" : "destructive"}
                size="lg"
                onClick={toggleMic}
                className="w-16 h-16 rounded-full"
              >
                {isMicOn ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
              </Button>

              <Button
                variant={isCameraOn ? "default" : "destructive"}
                size="lg"
                onClick={toggleCamera}
                className="w-16 h-16 rounded-full"
              >
                {isCameraOn ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
              </Button>

              {!isRecording ? (
                <Button
                  size="lg"
                  onClick={startRecording}
                  className="bg-red-600 hover:bg-red-700 w-20 h-16 rounded-full"
                >
                  <div className="w-6 h-6 bg-white rounded-full" />
                </Button>
              ) : (
                <Button
                  size="lg"
                  onClick={stopRecording}
                  className="bg-red-600 hover:bg-red-700 w-20 h-16 rounded-full"
                >
                  <StopCircle className="h-6 w-6" />
                </Button>
              )}
            </div>
          </div>

          {/* Question Panel */}
          <div className="space-y-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-[#8FD694]">면접 질문</h3>
                <div className="text-lg leading-relaxed mb-6">{MOCK_QUESTIONS[currentQuestionIndex]}</div>

                <div className="space-y-3">
                  <div className="text-sm text-gray-300">답변 시간: {interview.options.answerDuration}분</div>

                  {!isRecording ? (
                    <Button
                      onClick={startRecording}
                      className="w-full bg-[#8FD694] hover:bg-[#7ac47f]"
                      disabled={currentQuestionIndex >= MOCK_QUESTIONS.length}
                    >
                      답변 시작하기
                    </Button>
                  ) : (
                    <div className="space-y-2">
                      <Button onClick={stopRecording} variant="outline" className="w-full">
                        답변 완료
                      </Button>
                      <div className="text-xs text-center text-gray-400">
                        녹화 중... 시간이 지나면 자동으로 종료됩니다
                      </div>
                    </div>
                  )}

                  {!isRecording && currentQuestionIndex < MOCK_QUESTIONS.length - 1 && (
                    <Button onClick={nextQuestion} variant="outline" className="w-full">
                      <SkipForward className="h-4 w-4 mr-2" />
                      다음 질문
                    </Button>
                  )}

                  {!isRecording && currentQuestionIndex === MOCK_QUESTIONS.length - 1 && (
                    <Button
                      onClick={() => router.push(`/workspace/interview/${interviewId}/result`)}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      면접 완료
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <h4 className="font-medium mb-2 text-[#8FD694]">면접 팁</h4>
                <div className="text-sm text-gray-300 space-y-1">
                  <p>• 카메라를 바라보며 답변하세요</p>
                  <p>• 명확하고 간결하게 답변하세요</p>
                  <p>• 구체적인 예시를 들어 설명하세요</p>
                  <p>• 시간을 효율적으로 활용하세요</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
