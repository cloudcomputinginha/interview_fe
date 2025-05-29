"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Upload, AlertCircle, Calendar, Clock, Users, Globe, Lock, Save } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function EditInterviewPage({ params }: { params: { id: string } }) {
  const interviewId = params.id

  // 면접 정보 상태
  const [interview, setInterview] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("general")

  // 일반 정보 상태
  const [title, setTitle] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [isPublic, setIsPublic] = useState(false)

  // 참가자 정보 상태
  const [participants, setParticipants] = useState<{ id: number; email: string }[]>([])
  const [maxParticipants, setMaxParticipants] = useState("3")

  // 자료 정보 상태
  const [selectedResume, setSelectedResume] = useState("")
  const [selectedCoverLetter, setSelectedCoverLetter] = useState("")

  // Mock data
  const resumes = [
    { id: "1", name: "신입 개발자 이력서.pdf" },
    { id: "2", name: "포트폴리오_2023.pdf" },
    { id: "3", name: "경력기술서_최종.docx" },
  ]

  const coverLetters = [
    { id: "1", name: "삼성전자 자기소개서.pdf", type: "file" },
    { id: "2", name: "네이버 지원 자소서.docx", type: "file" },
    { id: "3", name: "카카오 인턴십 자소서", type: "manual" },
    { id: "4", name: "현대자동차 공채 지원서.pdf", type: "file" },
  ]

  // 면접 데이터 가져오기 (Mock)
  useEffect(() => {
    // 실제 구현에서는 API 호출로 대체
    const fetchInterview = async () => {
      try {
        // Mock 데이터
        const mockInterview = {
          id: interviewId,
          title: "삼성전자 상반기 공채 대비 모의면접",
          type: "group", // "individual" 또는 "group"
          date: "2023-06-10",
          time: "14:00",
          isPublic: true,
          maxParticipants: "4",
          participants: [
            { id: 1, email: "user1@example.com" },
            { id: 2, email: "user2@example.com" },
            { id: 3, email: "user3@example.com" },
          ],
          resume: "1",
          coverLetter: "1",
        }

        setInterview(mockInterview)

        // 상태 업데이트
        setTitle(mockInterview.title)
        setDate(mockInterview.date)
        setTime(mockInterview.time)
        setIsPublic(mockInterview.isPublic)
        setMaxParticipants(mockInterview.maxParticipants)
        setParticipants(mockInterview.participants)
        setSelectedResume(mockInterview.resume)
        setSelectedCoverLetter(mockInterview.coverLetter)

        setLoading(false)
      } catch (error) {
        console.error("Error fetching interview:", error)
        setLoading(false)
      }
    }

    fetchInterview()
  }, [interviewId])

  const addParticipant = () => {
    if (participants.length < 5) {
      setParticipants([...participants, { id: Date.now(), email: "" }])
    }
  }

  const removeParticipant = (id: number) => {
    if (participants.length > 1) {
      setParticipants(participants.filter((p) => p.id !== id))
    }
  }

  const updateParticipant = (id: number, email: string) => {
    setParticipants(participants.map((p) => (p.id === id ? { ...p, email } : p)))
  }

  const handleSave = () => {
    // 데이터 검증
    if (!title) {
      alert("면접 제목을 입력해주세요.")
      return
    }

    if (!date || !time) {
      alert("면접 날짜와 시간을 선택해주세요.")
      return
    }

    if (interview.type === "group" && participants.filter((p) => p.email.trim() !== "").length === 0) {
      alert("최소 1명의 참가자 이메일을 입력해주세요.")
      return
    }

    // 면접 정보 업데이트 (실제 구현에서는 API 호출)
    const updatedInterview = {
      ...interview,
      title,
      date,
      time,
      isPublic,
      maxParticipants,
      participants,
      resume: selectedResume,
      coverLetter: selectedCoverLetter,
    }

    console.log("Updated interview:", updatedInterview)

    // 성공 메시지 표시
    alert("면접 정보가 성공적으로 업데이트되었습니다.")

    // 면접 목록 페이지로 이동
    window.location.href = "/workspace/interviews"
  }

  // Format date for display
  function formatDateTime(dateStr: string, timeStr: string) {
    if (!dateStr || !timeStr) return ""

    const dateTime = new Date(`${dateStr}T${timeStr}`)
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
    return dateTime.toLocaleDateString("ko-KR", options)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8FD694] mx-auto"></div>
          <p className="mt-4 text-gray-600">면접 정보를 불러오는 중...</p>
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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">면접 수정</h1>
              <p className="text-gray-600 mt-2">면접 정보를 수정합니다.</p>
            </div>
            <Button className="bg-[#8FD694] hover:bg-[#7ac47f] text-white" onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" /> 변경사항 저장
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="general">일반 정보</TabsTrigger>
            <TabsTrigger value="participants">참가자</TabsTrigger>
            <TabsTrigger value="materials">자료</TabsTrigger>
          </TabsList>

          {/* 일반 정보 탭 */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>일반 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium">
                    면접 제목 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="면접 제목을 입력하세요"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date" className="text-sm font-medium">
                      면접 날짜 <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                      <Input
                        id="date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time" className="text-sm font-medium">
                      면접 시간 <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-500 mr-2" />
                      <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
                    </div>
                  </div>
                </div>

                {date && time && (
                  <div className="p-3 bg-gray-50 rounded-lg text-center">
                    <p className="text-sm text-gray-600">
                      면접은 <span className="font-medium">{formatDateTime(date, time)}</span>에 시작됩니다.
                    </p>
                  </div>
                )}

                {interview.type === "group" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="maxParticipants" className="text-sm font-medium">
                        최대 참가자 수
                      </Label>
                      <Select value={maxParticipants} onValueChange={setMaxParticipants}>
                        <SelectTrigger id="maxParticipants">
                          <SelectValue placeholder="인원 수를 선택하세요" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2">2명</SelectItem>
                          <SelectItem value="3">3명</SelectItem>
                          <SelectItem value="4">4명</SelectItem>
                          <SelectItem value="5">5명</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500">최대 5명까지 참여할 수 있습니다. (본인 포함)</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="isPublic" className="text-sm font-medium">
                          커뮤니티에 공개
                        </Label>
                        <Switch id="isPublic" checked={isPublic} onCheckedChange={setIsPublic} />
                      </div>
                      <p className="text-xs text-gray-500">
                        공개 설정 시 다대다 면접 모집 커뮤니티에 게시되어 다른 사용자들이 참여 신청할 수 있습니다.
                      </p>
                      <div className="flex items-center mt-2 p-2 rounded-md bg-blue-50">
                        {isPublic ? (
                          <div className="flex items-center text-blue-700">
                            <Globe className="h-4 w-4 mr-2" />
                            <span className="text-sm">공개 면접</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-gray-700">
                            <Lock className="h-4 w-4 mr-2" />
                            <span className="text-sm">비공개 면접</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 참가자 탭 */}
          <TabsContent value="participants">
            <Card>
              <CardHeader>
                <CardTitle>참가자 관리</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {interview.type === "group" ? (
                  <>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
                        <div>
                          <h3 className="font-medium text-blue-700">참가자 초대 안내</h3>
                          <p className="text-blue-600 text-sm mt-1">
                            참가자들에게 이메일로 초대장이 발송됩니다. 참가자들은 초대를 수락하고 자신의 이력서와
                            자기소개서를 선택할 수 있습니다.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label className="text-sm font-medium">참가자 이메일</Label>
                        <span className="text-sm text-gray-500">{participants.length}/5</span>
                      </div>

                      {participants.map((participant, index) => (
                        <div key={participant.id} className="flex items-center space-x-2">
                          <Input
                            placeholder={`참가자 ${index + 1} 이메일`}
                            type="email"
                            value={participant.email}
                            onChange={(e) => updateParticipant(participant.id, e.target.value)}
                          />
                          {participants.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeParticipant(participant.id)}
                              className="h-8 w-8 text-red-500"
                            >
                              -
                            </Button>
                          )}
                        </div>
                      ))}

                      {participants.length < 5 && (
                        <Button type="button" variant="outline" size="sm" onClick={addParticipant} className="mt-2">
                          + 참가자 추가
                        </Button>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-center p-6">
                    <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-700">개인 면접</h3>
                    <p className="text-gray-500 mt-2">
                      개인 면접은 참가자 관리가 필요하지 않습니다. AI 면접관과 1:1로 진행됩니다.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 자료 탭 */}
          <TabsContent value="materials">
            <Card>
              <CardHeader>
                <CardTitle>자료 관리</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">이력서 선택</label>
                  <Select value={selectedResume} onValueChange={setSelectedResume}>
                    <SelectTrigger>
                      <SelectValue placeholder="이력서를 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {resumes.map((resume) => (
                        <SelectItem key={resume.id} value={resume.id}>
                          {resume.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-2">또는</p>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                    <div className="mx-auto w-12 h-12 bg-[#8FD694] bg-opacity-10 rounded-full flex items-center justify-center mb-3">
                      <Upload className="h-6 w-6 text-[#8FD694]" />
                    </div>
                    <p className="text-sm font-medium mb-1">새 이력서 업로드</p>
                    <p className="text-xs text-gray-500">PDF, DOCX, TXT 파일 (최대 5MB)</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">자기소개서 선택</label>
                  <Select value={selectedCoverLetter} onValueChange={setSelectedCoverLetter}>
                    <SelectTrigger>
                      <SelectValue placeholder="자기소개서를 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {coverLetters.map((letter) => (
                        <SelectItem key={letter.id} value={letter.id}>
                          {letter.name} {letter.type === "manual" ? "(직접 입력)" : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-2">또는</p>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                    <div className="mx-auto w-12 h-12 bg-[#8FD694] bg-opacity-10 rounded-full flex items-center justify-center mb-3">
                      <Upload className="h-6 w-6 text-[#8FD694]" />
                    </div>
                    <p className="text-sm font-medium mb-1">새 자기소개서 추가</p>
                    <p className="text-xs text-gray-500">파일 업로드 또는 직접 입력</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={() => (window.location.href = "/workspace/interviews")}>
            취소
          </Button>
          <Button className="bg-[#8FD694] hover:bg-[#7ac47f] text-white" onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" /> 변경사항 저장
          </Button>
        </div>
      </div>
    </div>
  )
}
