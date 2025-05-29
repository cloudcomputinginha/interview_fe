"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Mic, MicOff, X, ChevronRight, AlertCircle, User } from "lucide-react"

export default function GroupInterviewSessionPage() {
  // 이 데이터는 실제로는 이전 페이지에서 전달받거나 상태 관리 라이브러리에서 가져옴
  const sessionName = "2023 상반기 공채 모의면접"
  const [participants, setParticipants] = useState([
    { id: 1, name: "김지원", isMuted: false, isActive: true },
    { id: 2, name: "이민수", isMuted: false, isActive: false },
    { id: 3, name: "박서연", isMuted: false, isActive: false },
  ])

  const [currentQuestion, setCurrentQuestion] = useState(1)
  const [timeLeft, setTimeLeft] = useState(120) // 2 minutes in seconds
  const [isRecording, setIsRecording] = useState(true)
  const [isAnswering, setIsAnswering] = useState(false)
  const [currentParticipantIndex, setCurrentParticipantIndex] = useState(0)

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

  const nextParticipant = () => {
    // 현재 참가자의 답변 종료
    setIsAnswering(false)

    // 다음 참가자로 이동
    const nextIndex = (currentParticipantIndex + 1) % participants.length

    // 참가자 상태 업데이트
    const updatedParticipants = participants.map((p, idx) => ({
      ...p,
      isActive: idx === nextIndex,
    }))

    setParticipants(updatedParticipants)
    setCurrentParticipantIndex(nextIndex)
    setTimeLeft(120) // 타이머 리셋
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length) {
      setCurrentQuestion((prev) => prev + 1)
      setTimeLeft(120) // 타이머 리셋
      setIsAnswering(false)

      // 첫 번째 참가자로 돌아감
      const updatedParticipants = participants.map((p, idx) => ({
        ...p,
        isActive: idx === 0,
      }))

      setParticipants(updatedParticipants)
      setCurrentParticipantIndex(0)
    } else {
      // 면접 종료 및 결과 페이지로 이동
      if (confirm("모든 질문이 끝났습니다. 면접을 종료하시겠습니까?")) {
        window.location.href = "/workspace/interview/group/report"
      }
    }
  }

  const startAnswering = () => {
    setIsAnswering(true)
  }

  const toggleMute = (participantId: number) => {
    setParticipants(participants.map((p) => (p.id === participantId ? { ...p, isMuted: !p.isMuted } : p)))
  }

  const endInterview = () => {
    if (confirm("면접을 종료하시겠습니까? 지금까지의 진행 상황은 저장됩니다.")) {
      window.location.href = "/workspace/interview/group/report"
    }
  }

  const currentParticipant = participants.find((p) => p.isActive) || participants[0]

  // 다음 참가자 또는 다음 질문으로 이동하는 함수
  const handleNext = () => {
    // 현재 참가자가 마지막 참가자인 경우
    if (currentParticipantIndex === participants.length - 1) {
      // 다음 질문으로 이동
      nextQuestion()
    } else {
      // 다음 참가자로 이동
      nextParticipant()
    }
  }

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
          <span className="text-sm text-gray-400">
            {sessionName} - 질문 {currentQuestion}/{questions.length}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
          onClick={endInterview}
        >
          <X className="h-5 w-5 mr-1" /> 종료
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left Sidebar - Participants */}
        <div className="w-full md:w-64 bg-gray-800 p-4 md:border-r md:border-gray-700">
          <h3 className="text-sm font-medium text-gray-400 mb-3">참가자 목록</h3>
          <div className="space-y-2">
            {participants.map((participant) => (
              <div
                key={participant.id}
                className={`flex items-center justify-between p-2 rounded-md ${
                  participant.isActive ? "bg-[#8FD694] bg-opacity-20" : ""
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                      participant.isActive ? "bg-[#8FD694] text-white" : "bg-gray-700 text-gray-400"
                    }`}
                  >
                    <User className="h-4 w-4" />
                  </div>
                  <span className={`${participant.isActive ? "font-medium text-[#8FD694]" : ""}`}>
                    {participant.name}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-7 w-7 p-0 ${participant.isMuted ? "text-red-500" : "text-gray-400"}`}
                  onClick={() => toggleMute(participant.id)}
                >
                  {participant.isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Center Area - Current Question */}
        <div className="flex-1 p-4 flex flex-col">
          {/* Current Question */}
          <div className="bg-gray-800 p-6 rounded-lg mb-4">
            <div className="flex items-center text-sm text-gray-400 mb-2">
              <span>
                질문 {currentQuestion}/{questions.length}
              </span>
            </div>
            <p className="text-xl font-medium">{questions[currentQuestion - 1]}</p>
          </div>

          {/* Current Participant */}
          <div className="bg-gray-800 p-4 rounded-lg mb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-[#8FD694] bg-opacity-20 flex items-center justify-center mr-3">
                <User className="h-5 w-5 text-[#8FD694]" />
              </div>
              <div>
                <p className="text-sm text-gray-400">현재 답변자</p>
                <p className="font-medium">{currentParticipant.name}</p>
              </div>
            </div>
          </div>

          {/* Timer */}
          <div className="bg-gray-800 p-4 rounded-lg mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-400">남은 시간</span>
              <span className={`text-lg font-medium ${timeLeft < 30 ? "text-red-400" : ""}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
            <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
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
                <p className="text-sm">답변 시간이 종료되었습니다.</p>
              </div>
            )}
          </div>

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

          {/* Action Buttons */}
          <div className="mt-auto">
            {!isAnswering ? (
              <Button className="w-full bg-[#8FD694] hover:bg-[#7ac47f] text-white" onClick={startAnswering}>
                답변 시작
              </Button>
            ) : (
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={handleNext}>
                {currentParticipantIndex === participants.length - 1 ? "다음 질문으로" : "다음 참가자로"}
                <ChevronRight className="ml-1 h-4 w-4" />
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
              isRecording ? "bg-gray-700 hover:bg-gray-600" : "bg-red-500 hover:bg-red-600"
            }`}
            onClick={() => setIsRecording(!isRecording)}
          >
            {isRecording ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </Button>
          <Button variant="destructive" size="icon" className="rounded-full w-12 h-12" onClick={endInterview}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
