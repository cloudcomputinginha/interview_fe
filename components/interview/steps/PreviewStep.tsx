"use client"

import { useInterviewWizard } from "../InterviewWizardContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, Brain, FileText } from "lucide-react"

export function PreviewStep() {
  const { state } = useInterviewWizard()

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "미설정"
    return new Date(dateString).toLocaleString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const voiceLabels = {
    female1: "여성 음성 1",
    female2: "여성 음성 2",
    male1: "남성 음성 1",
    male2: "남성 음성 2",
  }

  const styleLabels = {
    personality: "인성 면접",
    technical: "기술 면접",
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold mb-2">면접 정보를 확인해주세요</h2>
        <p className="text-gray-600">설정한 내용을 검토하고 면접을 생성하세요.</p>
      </div>

      <div className="space-y-4">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              기본 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">면접 유형:</span>
              <Badge className="bg-[#8FD694] text-white">
                {state.interviewType === "individual" ? "1:1 개인 면접" : "그룹 면접"}
              </Badge>
            </div>

            {state.interviewType === "individual" && state.title && (
              <div className="flex justify-between">
                <span className="text-gray-600">면접 제목:</span>
                <span>{state.title}</span>
              </div>
            )}

            {state.interviewType === "group" && state.sessionName && (
              <div className="flex justify-between">
                <span className="text-gray-600">세션 이름:</span>
                <span>{state.sessionName}</span>
              </div>
            )}

            {state.interviewType === "group" && (
              <div className="flex justify-between">
                <span className="text-gray-600">최대 참가자:</span>
                <span>{state.maxParticipants}명</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Schedule Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              일정 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {state.interviewType === "individual" && (
              <div className="flex justify-between">
                <span className="text-gray-600">시작 방식:</span>
                <Badge variant={state.startType === "now" ? "default" : "secondary"}>
                  {state.startType === "now" ? "즉시 시작" : "예약"}
                </Badge>
              </div>
            )}

            {((state.interviewType === "individual" && state.startType === "scheduled") ||
              state.interviewType === "group") && (
              <div className="flex justify-between">
                <span className="text-gray-600">예약 시간:</span>
                <span>{formatDateTime(state.interviewType === "individual" ? state.startAt : state.scheduledAt)}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cover Letter Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              자기소개서
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <span className="text-gray-600 block mb-1">제목:</span>
              <span className="font-medium">{state.coverLetter.representativeTitle || "미입력"}</span>
            </div>
            <div>
              <span className="text-gray-600 block mb-1">내용:</span>
              <p className="text-sm bg-gray-50 p-3 rounded max-h-32 overflow-y-auto">
                {state.coverLetter.content || "미입력"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Interview Options */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              면접 옵션
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">AI 음성:</span>
              <span>{voiceLabels[state.options.voiceType]}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">면접 스타일:</span>
              <span>{styleLabels[state.options.interviewStyle]}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">답변 시간:</span>
              <span>{state.options.answerDuration}분</span>
            </div>
          </CardContent>
        </Card>

        {/* Participants (Group only) */}
        {state.interviewType === "group" && state.participants && state.participants.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                참가자 목록
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {state.participants.map((participant, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#8FD694] rounded-full"></div>
                    <span>{participant.email}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
