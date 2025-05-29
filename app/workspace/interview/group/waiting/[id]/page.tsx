"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Clock, CheckCircle, AlertCircle, Info } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function InterviewWaitingRoomPage({ params }: { params: { id: string } }) {
  const interviewId = params.id
  const [countdown, setCountdown] = useState<{ minutes: number; seconds: number }>({ minutes: 5, seconds: 0 })
  const [isHost, setIsHost] = useState(true) // For demo purposes, set to true
  const [isStarting, setIsStarting] = useState(false)
  const [progressValue, setProgressValue] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Mock data for the interview
  const interview = {
    id: Number.parseInt(interviewId),
    title: "삼성전자 상반기 공채 대비 모의면접",
    scheduledTime: new Date(new Date().getTime() + 5 * 60 * 1000), // 5 minutes from now for demo
    participants: [
      { id: 1, name: "김지원", isHost: true, isJoined: true },
      { id: 2, name: "이민수", isHost: false, isJoined: true },
      { id: 3, name: "박서연", isHost: false, isJoined: false },
    ],
  }

  // 참가자 중 입장한 사람만 필터링
  const joinedParticipants = interview.participants.filter((p) => p.isJoined)

  // 타이머 참조를 위한 useRef 추가
  const timer = useRef<NodeJS.Timeout | null>(null)

  // Calculate countdown to interview start
  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date()
      const difference = interview.scheduledTime.getTime() - now.getTime()

      if (difference <= 0) {
        // Time to start the interview
        if (timerRef.current) {
          clearInterval(timerRef.current)
        }
        startInterview()
        return
      }

      const minutes = Math.floor(difference / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)
      setCountdown({ minutes, seconds })

      // Calculate progress for the progress bar (inverse)
      // Assuming the waiting room opens 10 minutes before the interview
      const totalWaitTime = 10 * 60 * 1000 // 10 minutes in milliseconds
      const elapsed = totalWaitTime - difference
      const progressPercentage = Math.min(100, Math.max(0, (elapsed / totalWaitTime) * 100))
      setProgressValue(progressPercentage)
    }

    calculateCountdown()
    timerRef.current = setInterval(calculateCountdown, 1000) // Update every second

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, []) // 빈 의존성 배열 사용 (컴포넌트 마운트 시 한 번만 실행)

  // 면접 시작 함수 수정
  const startInterview = useCallback(() => {
    // 참가자가 없으면 시작 불가
    if (joinedParticipants.length === 0) {
      alert("참가자가 없어 면접을 시작할 수 없습니다.")
      return
    }

    setIsStarting(true)

    // Show transition screen for 3 seconds
    setTimeout(() => {
      // Redirect to the interview session
      window.location.href = "/workspace/interview/group/session"
    }, 3000)
  }, [joinedParticipants.length])

  const handleEarlyStart = () => {
    if (confirm("면접을 지금 시작하시겠습니까? 모든 참가자에게 알림이 전송됩니다.")) {
      startInterview()
    }
  }

  // Format time for display
  function formatTime(minutes: number, seconds: number) {
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  // If the interview is starting, show transition screen
  if (isStarting) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-[#8FD694] bg-opacity-20 flex items-center justify-center mx-auto mb-4">
            <Clock className="h-8 w-8 text-[#8FD694]" />
          </div>
          <h1 className="text-2xl font-bold mb-2">면접이 시작됩니다...</h1>
          <p className="text-gray-600">잠시만 기다려주세요.</p>
          <div className="mt-6 w-64 mx-auto">
            <Progress value={progressValue} className="h-2" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/workspace/interviews"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> 내 면접으로 돌아가기
          </Link>
          <h1 className="text-2xl font-bold">면접 대기 중...</h1>
          <p className="text-gray-600 mt-2">{interview.title}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Countdown Card */}
          <div className="md:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>면접 시작 카운트다운</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <div className="w-24 h-24 rounded-full bg-[#8FD694] bg-opacity-20 flex items-center justify-center mb-6">
                  <Clock className="h-12 w-12 text-[#8FD694]" />
                </div>
                <div className="text-4xl font-bold mb-4">{formatTime(countdown.minutes, countdown.seconds)}</div>
                <p className="text-gray-600 mb-6">
                  {countdown.minutes > 0
                    ? `${countdown.minutes}분 ${countdown.seconds}초 후 시작 예정`
                    : `${countdown.seconds}초 후 시작 예정`}
                </p>
                <Progress value={progressValue} className="w-full max-w-md h-2" />
              </CardContent>
              <CardFooter className="flex justify-center border-t pt-6">
                {isHost && (
                  <Button className="bg-[#8FD694] hover:bg-[#7ac47f] text-white" onClick={handleEarlyStart}>
                    지금 시작하기
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>

          {/* Participants Card */}
          <div>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>참여자 목록</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {joinedParticipants.length > 0 ? (
                    joinedParticipants.map((participant) => (
                      <div key={participant.id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-3">
                            <AvatarFallback className="bg-[#8FD694] text-white">
                              {participant.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span>{participant.name}</span>
                        </div>
                        <div className="flex items-center">
                          {participant.isHost && <Badge className="bg-[#8FD694] hover:bg-[#8FD694] mr-2">호스트</Badge>}
                          <div className="flex items-center text-[#8FD694]">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            <span className="text-xs">입장</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      <p>아직 입장한 참가자가 없습니다.</p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <div className="w-full text-center text-sm text-gray-500">
                  <AlertCircle className="inline-block h-4 w-4 mr-1" />
                  모든 참가자가 입장해야 면접이 시작됩니다.
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>

        {/* Info Card */}
        <Card className="mt-6 bg-blue-50 border-blue-100">
          <CardContent className="p-4">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-700">면접 준비 안내</h3>
                <ul className="text-blue-600 text-sm mt-2 space-y-1 list-disc pl-5">
                  <li>카메라와 마이크가 정상적으로 작동하는지 확인해주세요.</li>
                  <li>조용한 환경에서 면접에 참여해주세요.</li>
                  <li>면접 시작 전에 자기소개서와 이력서를 다시 한번 검토해보세요.</li>
                  <li>면접은 예정된 시간에 자동으로 시작됩니다.</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
