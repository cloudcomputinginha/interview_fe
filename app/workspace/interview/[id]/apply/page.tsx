"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Users, ArrowLeft, Plus } from "lucide-react"
import { useInterviewStore } from "@/lib/stores/interview-store"

export default function InterviewApplyPage() {
  const params = useParams()
  const router = useRouter()
  const interviewId = params.id as string

  const { getInterviewById, resumes, coverLetters, addResume, addCoverLetter, updateInterview } = useInterviewStore()
  const interview = getInterviewById(interviewId)

  const [selectedResumeId, setSelectedResumeId] = useState("")
  const [selectedCoverLetterId, setSelectedCoverLetterId] = useState("")
  const [showNewResume, setShowNewResume] = useState(false)
  const [showNewCoverLetter, setShowNewCoverLetter] = useState(false)
  const [newResumeFile, setNewResumeFile] = useState("")
  const [newCoverLetter, setNewCoverLetter] = useState({
    representativeTitle: "",
    content: "",
  })
  const [applicantEmail, setApplicantEmail] = useState("")

  const handleNewResumeUpload = () => {
    if (!newResumeFile) return

    const resumeId = addResume({
      fileName: newResumeFile,
      url: `/static/resumes/${newResumeFile}`,
    })

    setSelectedResumeId(resumeId)
    setNewResumeFile("")
    setShowNewResume(false)
  }

  const handleNewCoverLetterSave = () => {
    if (!newCoverLetter.representativeTitle || !newCoverLetter.content) return

    const coverLetterId = addCoverLetter(newCoverLetter)

    setSelectedCoverLetterId(coverLetterId)
    setNewCoverLetter({ representativeTitle: "", content: "" })
    setShowNewCoverLetter(false)
  }

  const handleApply = () => {
    if (!applicantEmail || !selectedResumeId || !selectedCoverLetterId) {
      alert("모든 필드를 입력해주세요.")
      return
    }

    if (interview && interview.kind === "group") {
      const updatedParticipants = [
        ...interview.participants,
        {
          email: applicantEmail,
          resumeId: selectedResumeId,
          coverLetterId: selectedCoverLetterId,
          status: "applied" as const,
        },
      ]

      updateInterview(interviewId, {
        participants: updatedParticipants,
      })

      alert("면접 신청이 완료되었습니다!")
      router.push("/workspace/interview/group/community")
    }
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (!interview || interview.kind !== "group") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">면접을 찾을 수 없습니다</h2>
          <Button onClick={() => router.push("/workspace/interview/group/community")}>커뮤니티로 돌아가기</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            돌아가기
          </Button>

          <h1 className="text-3xl font-bold mb-2">면접 신청하기</h1>
          <p className="text-gray-600">그룹 면접에 참여하기 위한 정보를 입력해주세요.</p>
        </div>

        {/* Interview Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Users className="h-5 w-5 text-[#8FD694]" />
              {interview.sessionName}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>{formatDateTime(interview.scheduledAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span>{interview.options.answerDuration}분 답변</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-500" />
                <span>최대 {interview.maxParticipants}명</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {interview.options.interviewStyle === "technical" ? "기술 면접" : "인성 면접"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Application Form */}
        <Card>
          <CardHeader>
            <CardTitle>신청 정보 입력</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Email */}
            <div>
              <Label htmlFor="email">이메일 *</Label>
              <Input
                id="email"
                type="email"
                value={applicantEmail}
                onChange={(e) => setApplicantEmail(e.target.value)}
                placeholder="your@email.com"
              />
            </div>

            {/* Resume Selection */}
            <div>
              <Label className="text-base font-medium">이력서 *</Label>

              {!showNewResume ? (
                <div className="space-y-3">
                  <Select value={selectedResumeId} onValueChange={setSelectedResumeId}>
                    <SelectTrigger>
                      <SelectValue placeholder="이력서를 선택해주세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {resumes.map((resume) => (
                        <SelectItem key={resume.id} value={resume.id}>
                          {resume.fileName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    variant="outline"
                    onClick={() => setShowNewResume(true)}
                    className="w-full flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />새 이력서 업로드
                  </Button>
                </div>
              ) : (
                <Card className="mt-2">
                  <CardContent className="p-4 space-y-4">
                    <div>
                      <Label htmlFor="resume-file">파일명</Label>
                      <Input
                        id="resume-file"
                        value={newResumeFile}
                        onChange={(e) => setNewResumeFile(e.target.value)}
                        placeholder="예: 신입개발자_이력서.pdf"
                      />
                    </div>

                    <div className="flex space-x-2">
                      <Button onClick={handleNewResumeUpload} disabled={!newResumeFile} className="flex-1">
                        업로드
                      </Button>
                      <Button variant="outline" onClick={() => setShowNewResume(false)} className="flex-1">
                        취소
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Cover Letter Selection */}
            <div>
              <Label className="text-base font-medium">자기소개서 *</Label>

              {!showNewCoverLetter ? (
                <div className="space-y-3">
                  <Select value={selectedCoverLetterId} onValueChange={setSelectedCoverLetterId}>
                    <SelectTrigger>
                      <SelectValue placeholder="자기소개서를 선택해주세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {coverLetters.map((coverLetter) => (
                        <SelectItem key={coverLetter.id} value={coverLetter.id}>
                          {coverLetter.representativeTitle}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    variant="outline"
                    onClick={() => setShowNewCoverLetter(true)}
                    className="w-full flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />새 자기소개서 작성
                  </Button>
                </div>
              ) : (
                <Card className="mt-2">
                  <CardContent className="p-4 space-y-4">
                    <div>
                      <Label htmlFor="title">대표 제목</Label>
                      <Input
                        id="title"
                        value={newCoverLetter.representativeTitle}
                        onChange={(e) =>
                          setNewCoverLetter((prev) => ({
                            ...prev,
                            representativeTitle: e.target.value,
                          }))
                        }
                        placeholder="예: 네이버 백엔드 개발자 자기소개서"
                      />
                    </div>

                    <div>
                      <Label htmlFor="content">내용</Label>
                      <Textarea
                        id="content"
                        value={newCoverLetter.content}
                        onChange={(e) =>
                          setNewCoverLetter((prev) => ({
                            ...prev,
                            content: e.target.value,
                          }))
                        }
                        placeholder="자기소개서 내용을 입력해주세요..."
                        rows={6}
                      />
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        onClick={handleNewCoverLetterSave}
                        disabled={!newCoverLetter.representativeTitle || !newCoverLetter.content}
                        className="flex-1"
                      >
                        저장
                      </Button>
                      <Button variant="outline" onClick={() => setShowNewCoverLetter(false)} className="flex-1">
                        취소
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleApply}
              disabled={!applicantEmail || !selectedResumeId || !selectedCoverLetterId}
              className="w-full bg-[#8FD694] hover:bg-[#7ac47f] text-white py-3"
            >
              면접 신청하기
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
