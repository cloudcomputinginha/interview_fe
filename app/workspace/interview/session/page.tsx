"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Mic, MicOff, Video, VideoOff, X, ChevronRight, AlertCircle } from "lucide-react"

export default function InterviewSessionPage() {
  const [isMicOn, setIsMicOn] = useState(true)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(1)
  const [timeLeft, setTimeLeft] = useState(120) // 2 minutes in seconds
  const [isRecording, setIsRecording] = useState(true)
  const [isAnswering, setIsAnswering] = useState(false)
  const [showRecordingConsent, setShowRecordingConsent] = useState(true)

  // Mock questions
  const questions = [
    "자기소개서에 언급하신 프로젝트에서 가장 어려웠던 점과 어떻게 해결했는지 설명해주세요.",
    "팀 프로젝트에서 갈등이 있었을 때 어떻게 해결했는지 구체적인 사례를 들어 설명해주세요.",
    "지원하신 직무에 필요한 역량이 무엇이라고 생각하시나요?",
    "5년 후 본인의 모습을 어떻게 그리고 계신가요?",
    "마지막으로 하고 싶은 말씀이 있으신가요?",
  ]

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout

    if (isAnswering && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [isAnswering, timeLeft])

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length) {
      setCurrentQuestion((prev) => prev + 1)
      setTimeLeft(120) // Reset timer
      setIsAnswering(false)
    } else {
      // End interview and go to report
      window.location.href = "/workspace/interview/report"
    }
  }

  const startAnswering = () => {
    setIsAnswering(true)
  }

  const handleRecordingConsent = (consent: boolean) => {
    setIsRecording(consent)
    setShowRecordingConsent(false)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Recording Consent Modal */}
      {showRecordingConsent && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white text-gray-900 rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold mb-2">면접 녹화 동의</h3>
            <p className="text-gray-600 mb-4">
              면접 과정을 녹화하여 더 정확한 피드백을 제공해 드립니다. 녹화된 내용은 피드백 생성 후 자동으로 삭제됩니다.
            </p>
            <div className="flex space-x-3">
              <Button variant="outline" className="flex-1" onClick={() => handleRecordingConsent(false)}>
                녹음만 진행
              </Button>
              <Button
                className="flex-1 bg-[#8FD694] hover:bg-[#7ac47f] text-white"
                onClick={() => handleRecordingConsent(true)}
              >
                녹화 동의
              </Button>
            </div>
          </div>
        </div>
      )}

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
            if (confirm("면접을 종료하시겠습니까? 지금까지의 진행 상황은 저장되지 않습니다.")) {
              window.location.href = "/workspace"
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
          {/* Current Question */}
          <div className="bg-gray-800 p-4 rounded-lg mb-4">
            <div className="flex items-center text-sm text-gray-400 mb-2">
              <span>
                질문 {currentQuestion}/{questions.length}
              </span>
            </div>
            <p className="text-lg font-medium">{questions[currentQuestion - 1]}</p>
          </div>

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
              {isVideoOn ? (
                <div className="w-full h-full bg-gray-700 rounded-lg flex items-center justify-center">
                  <img
                    src="/placeholder.svg?height=300&width=400"
                    alt="User Video"
                    className="max-w-full max-h-full rounded-lg"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center">
                  <span className="text-gray-400 text-4xl font-bold">Me</span>
                </div>
              )}

              {/* Recording Indicator */}
              {isRecording && isAnswering && (
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
                {currentQuestion}/{questions.length}
              </span>
            </div>
            <Progress value={(currentQuestion / questions.length) * 100} className="h-2 bg-gray-700" />
          </div>

          {/* Timer */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-400">남은 시간</span>
              <span className={`text-sm font-medium ${timeLeft < 30 ? "text-red-400" : ""}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
            <div className="w-full bg-gray-700 h-1 rounded-full overflow-hidden">
              <div
                className={`h-full ${timeLeft < 30 ? "bg-red-500" : "bg-[#8FD694]"}`}
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

          {/* Recording Toggle */}
          <div className="mb-6">
            <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <span className="text-sm">답변 녹음</span>
              <div
                className={`w-12 h-6 rounded-full flex items-center p-1 cursor-pointer ${
                  isRecording ? "bg-[#8FD694]" : "bg-gray-600"
                }`}
                onClick={() => setIsRecording(!isRecording)}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transform transition-transform ${
                    isRecording ? "translate-x-6" : "translate-x-0"
                  }`}
                ></div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-auto">
            {!isAnswering ? (
              <Button className="w-full bg-[#8FD694] hover:bg-[#7ac47f] text-white" onClick={startAnswering}>
                답변 시작
              </Button>
            ) : (
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={handleNextQuestion}>
                다음 질문 <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
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
            className={`rounded-full w-12 h-12 ${
              isMicOn ? "bg-gray-700 hover:bg-gray-600" : "bg-red-500 hover:bg-red-600"
            }`}
            onClick={() => setIsMicOn(!isMicOn)}
          >
            {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </Button>
          <Button
            variant="outline"
            size="icon"
            className={`rounded-full w-12 h-12 ${
              isVideoOn ? "bg-gray-700 hover:bg-gray-600" : "bg-red-500 hover:bg-red-600"
            }`}
            onClick={() => setIsVideoOn(!isVideoOn)}
          >
            {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
          </Button>
          <Button
            variant="destructive"
            size="icon"
            className="rounded-full w-12 h-12"
            onClick={() => {
              if (confirm("면접을 종료하시겠습니까? 지금까지의 진행 상황은 저장되지 않습니다.")) {
                window.location.href = "/workspace"
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
