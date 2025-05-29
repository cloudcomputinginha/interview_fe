"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Users, User, Edit, Play, FileText } from "lucide-react"
import { useInterviewStore } from "@/lib/stores/interview-store"

export function ScheduledInterviewsList() {
  const router = useRouter()
  const { getScheduledInterviews, getResumeById, getCoverLetterById, startInterview } = useInterviewStore()
  const scheduledInterviews = getScheduledInterviews()

  const handleStartInterview = (interviewId: string) => {
    startInterview(interviewId)
    router.push(`/workspace/interview/${interviewId}`)
  }

  const handleEditInterview = (interview: any) => {
    const editRoute =
      interview.kind === "individual"
        ? `/workspace/interview/new/individual?edit=${interview.id}`
        : `/workspace/interview/new/group?edit=${interview.id}`
    router.push(editRoute)
  }

  // Format date for display
  function formatDateTime(dateStr: string) {
    if (!dateStr) return ""

    const dateTime = new Date(dateStr)
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
    return dateTime.toLocaleDateString("ko-KR", options)
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">예약된 면접 ({scheduledInterviews.length})</h2>

      {scheduledInterviews.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">예약된 면접이 없습니다</h3>
            <p className="text-gray-600 mb-4">새로운 면접을 만들어보세요.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {scheduledInterviews.map((interview) => {
            const resume = interview.kind === "individual" ? getResumeById(interview.resumeId) : null
            const coverLetter = interview.kind === "individual" ? getCoverLetterById(interview.coverLetterId) : null

            return (
              <Card key={interview.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-[#8FD694] bg-opacity-20 flex items-center justify-center">
                          {interview.kind === "individual" ? (
                            <User className="h-4 w-4 text-[#8FD694]" />
                          ) : (
                            <Users className="h-4 w-4 text-[#8FD694]" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {interview.kind === "individual" ? interview.title : interview.sessionName}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>
                                {formatDateTime(
                                  interview.kind === "individual" ? interview.startAt : interview.scheduledAt,
                                )}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{interview.options?.answerDuration || 3}분 답변</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 mb-3">
                        <Badge variant="secondary">{interview.kind === "individual" ? "개인 면접" : "그룹 면접"}</Badge>
                        <Badge variant="outline">
                          {interview.options?.interviewStyle === "technical" ? "기술 면접" : "인성 면접"}
                        </Badge>
                        <Badge variant="outline">{interview.options?.voiceType || "한국어"}</Badge>
                      </div>

                      {interview.kind === "individual" && resume && coverLetter && (
                        <div className="text-sm text-gray-600 space-y-1">
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4" />
                            <span>이력서: {resume.fileName}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4" />
                            <span>자소서: {coverLetter.representativeTitle}</span>
                          </div>
                        </div>
                      )}

                      {interview.kind === "group" && (
                        <div className="text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4" />
                            <span>
                              참가자: {interview.participants?.filter((p: any) => p.status === "accepted").length || 0}/
                              {interview.maxParticipants || 5}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                interview.visibility === "public" ? "bg-green-400" : "bg-gray-400"
                              }`}
                            />
                            <span>{interview.visibility === "public" ? "공개" : "비공개"} 면접</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditInterview(interview)}>
                        <Edit className="h-4 w-4 mr-1" />
                        수정
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleStartInterview(interview.id)}
                        className="bg-[#8FD694] hover:bg-[#7ac47f]"
                      >
                        <Play className="h-4 w-4 mr-1" />
                        시작
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
