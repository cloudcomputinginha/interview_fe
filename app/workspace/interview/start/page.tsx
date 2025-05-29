"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Upload, FileText, Plus, X, CalendarIcon, Clock, Users, User, Brain, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Calendar } from "@/components/ui/calendar"
import { HeaderWithNotifications } from "@/components/header-with-notifications"

export default function InterviewStartPage() {
  const [step, setStep] = useState(1)
  const [interviewType, setInterviewType] = useState("")
  const [company, setCompany] = useState("")
  const [position, setPosition] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [sessionName, setSessionName] = useState("")

  // 자료 선택
  const [selectedResume, setSelectedResume] = useState("")
  const [selectedCoverLetter, setSelectedCoverLetter] = useState("")
  const [showNewResume, setShowNewResume] = useState(false)
  const [showNewCoverLetter, setShowNewCoverLetter] = useState(false)
  const [newResumeFile, setNewResumeFile] = useState("")
  const [newCoverLetter, setNewCoverLetter] = useState({
    title: "",
    content: "",
  })

  // 면접 옵션
  const [voiceType, setVoiceType] = useState("female1")
  const [interviewStyle, setInterviewStyle] = useState("personality")
  const [answerDuration, setAnswerDuration] = useState(3)
  const [questionCount, setQuestionCount] = useState(10)
  const [format, setFormat] = useState("1:1")

  // 스케줄링
  const [startType, setStartType] = useState("now")
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined)
  const [scheduledTime, setScheduledTime] = useState("")

  // 그룹 면접 설정
  const [maxParticipants, setMaxParticipants] = useState("4")
  const [visibility, setVisibility] = useState("private")
  const [inviteEmails, setInviteEmails] = useState([{ id: 1, email: "" }])

  const companies = [
    "삼성전자",
    "네이버",
    "카카오",
    "LG전자",
    "현대자동차",
    "SK하이닉스",
    "NCSOFT",
    "넥슨",
    "쿠팡",
    "배달의민족",
    "토스",
    "라인",
    "기타",
  ]
  const positions = [
    "SW개발",
    "백엔드개발",
    "프론트엔드개발",
    "풀스택개발",
    "모바일개발",
    "데이터분석",
    "AI/ML엔지니어",
    "DevOps",
    "QA엔지니어",
    "UI/UX디자인",
    "제품기획",
    "마케팅",
    "영업",
    "인사",
    "재무",
    "기타",
  ]

  const resumes = [
    { id: "1", name: "신입 개발자 이력서.pdf" },
    { id: "2", name: "포트폴리오_2023.pdf" },
    { id: "3", name: "경력기술서_최종.docx" },
  ]

  const coverLetters = [
    { id: "1", title: "삼성전자 자기소개서", content: "삼성전자 SW개발직군에 지원하는..." },
    { id: "2", title: "네이버 지원 자소서", content: "네이버 백엔드 개발자에 지원하게 된..." },
    { id: "3", title: "카카오 인턴십 자소서", content: "사용자 경험을 최우선으로 하는..." },
  ]

  const addInviteEmail = () => {
    if (inviteEmails.length < 5) {
      setInviteEmails([...inviteEmails, { id: Date.now(), email: "" }])
    }
  }

  const removeInviteEmail = (id: number) => {
    if (inviteEmails.length > 1) {
      setInviteEmails(inviteEmails.filter((item) => item.id !== id))
    }
  }

  const updateInviteEmail = (id: number, email: string) => {
    setInviteEmails(inviteEmails.map((item) => (item.id === id ? { ...item, email } : item)))
  }

  const handleNewResumeUpload = () => {
    if (!newResumeFile) return
    // 실제로는 파일 업로드 API 호출
    alert("이력서가 업로드되었습니다.")
    setNewResumeFile("")
    setShowNewResume(false)
  }

  const handleNewCoverLetterSave = () => {
    if (!newCoverLetter.title || !newCoverLetter.content) return
    // 실제로는 자기소개서 저장 API 호출
    alert("자기소개서가 저장되었습니다.")
    setNewCoverLetter({ title: "", content: "" })
    setShowNewCoverLetter(false)
  }

  const nextStep = () => {
    if (step === 1) {
      if (!interviewType || !company || !position || !title) {
        alert("모든 필수 항목을 입력해주세요.")
        return
      }
      if (interviewType === "group" && !sessionName) {
        alert("세션 이름을 입력해주세요.")
        return
      }
    }

    if (step === 2) {
      if (!selectedResume || (!selectedCoverLetter && (!newCoverLetter.title || !newCoverLetter.content))) {
        alert("이력서와 자기소개서를 선택하거나 입력해주세요.")
        return
      }
    }

    if (step === 4 && interviewType === "individual" && startType === "scheduled") {
      if (!scheduledDate || !scheduledTime) {
        alert("예약 날짜와 시간을 선택해주세요.")
        return
      }
    }

    if (step === 4 && interviewType === "group") {
      if (!scheduledDate || !scheduledTime) {
        alert("면접 날짜와 시간을 선택해주세요.")
        return
      }
    }

    const totalSteps = interviewType === "individual" ? 5 : 6
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      // 면접 생성 완료
      alert("면접이 성공적으로 생성되었습니다!")
      window.location.href = "/workspace/interviews"
    }
  }

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    } else {
      window.location.href = "/workspace/interviews"
    }
  }

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "면접 유형 및 기본 정보"
      case 2:
        return "자료 선택하기"
      case 3:
        return "면접 옵션 설정"
      case 4:
        if (interviewType === "individual") return "시작 옵션 선택"
        return "면접 예약"
      case 5:
        if (interviewType === "individual") return "미리보기 및 완료"
        return "참가자 초대"
      case 6:
        return "미리보기 및 완료"
      default:
        return ""
    }
  }

  const getTotalSteps = () => (interviewType === "individual" ? 5 : 6)

  return (
    <>
      <HeaderWithNotifications />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto p-6">
          {/* Header */}
          <div className="mb-8">
            <button onClick={prevStep} className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
              <ArrowLeft className="h-4 w-4 mr-1" /> 내 면접으로 돌아가기
            </button>
            <h1 className="text-2xl font-bold">새 면접 만들기</h1>
            <p className="text-gray-600 mt-2">면접을 시작하기 위한 정보를 입력해주세요.</p>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-[#8FD694] font-medium">
                단계 {step}/{getTotalSteps()}
              </span>
              <span className="text-gray-500">{getStepTitle()}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-[#8FD694] h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / getTotalSteps()) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Step Content */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{getStepTitle()}</CardTitle>
            </CardHeader>
            <CardContent>
              {step === 1 && (
                <div className="space-y-6">
                  {/* 기업 및 직무 정보 */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company">지원 기업 *</Label>
                      <Select value={company} onValueChange={setCompany}>
                        <SelectTrigger>
                          <SelectValue placeholder="기업을 선택하세요" />
                        </SelectTrigger>
                        <SelectContent>
                          {companies.map((comp) => (
                            <SelectItem key={comp} value={comp}>
                              {comp}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {company === "기타" && (
                        <Input
                          placeholder="기업명을 직접 입력하세요"
                          onChange={(e) => setCompany(e.target.value)}
                          className="mt-2"
                        />
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="position">지원 직무 *</Label>
                      <Select value={position} onValueChange={setPosition}>
                        <SelectTrigger>
                          <SelectValue placeholder="직무를 선택하세요" />
                        </SelectTrigger>
                        <SelectContent>
                          {positions.map((pos) => (
                            <SelectItem key={pos} value={pos}>
                              {pos}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {position === "기타" && (
                        <Input
                          placeholder="직무를 직접 입력하세요"
                          onChange={(e) => setPosition(e.target.value)}
                          className="mt-2"
                        />
                      )}
                    </div>
                  </div>

                  {/* 면접 유형 선택 */}
                  <div className="space-y-4">
                    <Label>면접 유형 *</Label>
                    <div className="grid md:grid-cols-2 gap-4">
                      <Card
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          interviewType === "individual" ? "ring-2 ring-[#8FD694] bg-green-50" : "hover:bg-gray-50"
                        }`}
                        onClick={() => setInterviewType("individual")}
                      >
                        <CardContent className="p-6 text-center">
                          <User className="h-12 w-12 mx-auto mb-4 text-[#8FD694]" />
                          <h3 className="font-semibold mb-2">1:1 개인 면접</h3>
                          <p className="text-sm text-gray-600">AI와 함께하는 개인 맞춤형 면접 연습</p>
                        </CardContent>
                      </Card>

                      <Card
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          interviewType === "group" ? "ring-2 ring-[#8FD694] bg-green-50" : "hover:bg-gray-50"
                        }`}
                        onClick={() => setInterviewType("group")}
                      >
                        <CardContent className="p-6 text-center">
                          <Users className="h-12 w-12 mx-auto mb-4 text-[#8FD694]" />
                          <h3 className="font-semibold mb-2">그룹 면접</h3>
                          <p className="text-sm text-gray-600">여러 참가자와 함께하는 그룹 면접 연습</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* 면접 제목 */}
                  <div className="space-y-2">
                    <Label htmlFor="title">면접 제목 *</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="예: 삼성전자 상반기 공채 모의면접"
                    />
                  </div>

                  {/* 면접 설명 */}
                  <div className="space-y-2">
                    <Label htmlFor="description">면접 설명</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="면접에 대한 추가 설명을 입력하세요..."
                      rows={3}
                    />
                  </div>

                  {/* 그룹 면접 세션명 */}
                  {interviewType === "group" && (
                    <div className="space-y-2">
                      <Label htmlFor="sessionName">세션 이름 *</Label>
                      <Input
                        id="sessionName"
                        value={sessionName}
                        onChange={(e) => setSessionName(e.target.value)}
                        placeholder="예: 2023 상반기 공채 모의면접"
                      />
                      <p className="text-xs text-gray-500">다른 참가자들이 볼 수 있는 세션 이름입니다.</p>
                    </div>
                  )}
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  {/* 이력서 선택 */}
                  <div className="space-y-4">
                    <Label>이력서 선택 *</Label>
                    {!showNewResume ? (
                      <div className="space-y-3">
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
                        <Button
                          variant="outline"
                          onClick={() => setShowNewResume(true)}
                          className="w-full flex items-center gap-2"
                        >
                          <Plus className="h-4 w-4" />새 이력서 업로드
                        </Button>
                      </div>
                    ) : (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">새 이력서 업로드</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <Label htmlFor="resume-file">파일명</Label>
                            <Input
                              id="resume-file"
                              value={newResumeFile}
                              onChange={(e) => setNewResumeFile(e.target.value)}
                              placeholder="예: 신입개발자_이력서.pdf"
                            />
                          </div>
                          <div className="border-2 border-dashed rounded-lg p-6 text-center">
                            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">파일을 선택하거나 드래그해주세요</p>
                            <p className="text-xs text-gray-500 mt-1">PDF, DOCX 파일 지원 (최대 5MB)</p>
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

                  {/* 자기소개서 선택 */}
                  <div className="space-y-4">
                    <Label>자기소개서 선택 *</Label>
                    {!showNewCoverLetter ? (
                      <div className="space-y-3">
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {coverLetters.map((letter) => (
                            <Card
                              key={letter.id}
                              className={`cursor-pointer transition-colors ${
                                selectedCoverLetter === letter.id
                                  ? "border-[#8FD694] bg-[#8FD694]/5"
                                  : "hover:bg-gray-50"
                              }`}
                              onClick={() => setSelectedCoverLetter(letter.id)}
                            >
                              <CardContent className="p-4 flex items-center gap-3">
                                <FileText className="h-5 w-5 text-[#8FD694] flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium truncate">{letter.title}</h4>
                                  <p className="text-sm text-gray-600 truncate">{letter.content.substring(0, 60)}...</p>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => setShowNewCoverLetter(true)}
                          className="w-full flex items-center gap-2"
                        >
                          <Plus className="h-4 w-4" />새 자기소개서 작성
                        </Button>
                      </div>
                    ) : (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">새 자기소개서 작성</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <Label htmlFor="cover-title">제목</Label>
                            <Input
                              id="cover-title"
                              value={newCoverLetter.title}
                              onChange={(e) => setNewCoverLetter((prev) => ({ ...prev, title: e.target.value }))}
                              placeholder="예: 삼성전자 SW개발직군 자기소개서"
                            />
                          </div>
                          <div>
                            <Label htmlFor="cover-content">내용</Label>
                            <Textarea
                              id="cover-content"
                              value={newCoverLetter.content}
                              onChange={(e) => setNewCoverLetter((prev) => ({ ...prev, content: e.target.value }))}
                              placeholder="자기소개서 내용을 입력해주세요..."
                              rows={8}
                            />
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              onClick={handleNewCoverLetterSave}
                              disabled={!newCoverLetter.title || !newCoverLetter.content}
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
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  {/* AI 음성 */}
                  <div className="space-y-2">
                    <Label>AI 음성</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: "female1", label: "여성 음성 1", sample: "안녕하세요! 면접을 시작하겠습니다." },
                        { value: "female2", label: "여성 음성 2", sample: "안녕하세요! 준비되셨나요?" },
                        { value: "male1", label: "남성 음성 1", sample: "안녕하세요! 편안하게 답변해주세요." },
                        { value: "male2", label: "남성 음성 2", sample: "안녕하세요! 좋은 면접이 되길 바랍니다." },
                      ].map((voice) => (
                        <Card
                          key={voice.value}
                          className={`cursor-pointer transition-all hover:shadow-md ${
                            voiceType === voice.value ? "ring-2 ring-[#8FD694] bg-green-50" : "hover:bg-gray-50"
                          }`}
                          onClick={() => setVoiceType(voice.value)}
                        >
                          <CardContent className="p-4 text-center">
                            <h3 className="font-semibold mb-2">{voice.label}</h3>
                            <p className="text-xs text-gray-600 italic">"{voice.sample}"</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500">
                      면접관의 음성을 선택합니다. 실제 면접과 유사한 경험을 위해 선택하세요.
                    </p>
                  </div>

                  {/* 면접 스타일 */}
                  <div className="space-y-2">
                    <Label>면접 스타일</Label>
                    <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-lg">
                      <Button
                        variant={interviewStyle === "personality" ? "default" : "ghost"}
                        onClick={() => setInterviewStyle("personality")}
                        className={`${interviewStyle === "personality" ? "bg-white shadow-sm text-black hover:bg-white hover :shadow-sm hover:text-black" : ""}`}
                      >
                        인성 면접
                      </Button>
                      <Button
                        variant={interviewStyle === "technical" ? "default" : "ghost"}
                        onClick={() => setInterviewStyle("technical")}
                        className={`${interviewStyle === "technical" ? "bg-white shadow-sm text-black hover:bg-white hover :shadow-sm hover:text-black" : ""}`}
                      >
                        기술 면접
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">
                      인성 면접은 가치관과 경험, 기술 면접은 직무 관련 전문 지식을 평가합니다.
                    </p>
                  </div>

                  {/* 질문 수 */}
                  <div className="space-y-4">
                    <Label>질문 수: {questionCount}개</Label>
                    <Slider
                      value={[questionCount]}
                      onValueChange={(value) => setQuestionCount(value[0])}
                      max={15}
                      min={5}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>5개</span>
                      <span>10개</span>
                      <span>15개</span>
                    </div>
                  </div>

                  {/* 답변 시간 */}
                  <div className="space-y-4">
                    <Label>답변 시간: {answerDuration}분</Label>
                    <Slider
                      value={[answerDuration]}
                      onValueChange={(value) => setAnswerDuration(value[0])}
                      max={5}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>1분</span>
                      <span>3분</span>
                      <span>5분</span>
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && interviewType === "individual" && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-xl font-semibold mb-2">면접 시작 옵션</h2>
                    <p className="text-gray-600">지금 시작하거나 예약할 시간을 선택해주세요.</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <Card
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        startType === "now" ? "ring-2 ring-[#8FD694] bg-green-50" : "hover:bg-gray-50"
                      }`}
                      onClick={() => setStartType("now")}
                    >
                      <CardContent className="p-6 text-center">
                        <Clock className="h-8 w-8 mx-auto mb-3 text-[#8FD694]" />
                        <h3 className="font-semibold mb-2">지금 시작</h3>
                        <p className="text-sm text-gray-600">바로 면접을 시작합니다</p>
                      </CardContent>
                    </Card>

                    <Card
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        startType === "scheduled" ? "ring-2 ring-[#8FD694] bg-green-50" : "hover:bg-gray-50"
                      }`}
                      onClick={() => setStartType("scheduled")}
                    >
                      <CardContent className="p-6 text-center">
                        <CalendarIcon className="h-8 w-8 mx-auto mb-3 text-[#8FD694]" />
                        <h3 className="font-semibold mb-2">예약하기</h3>
                        <p className="text-sm text-gray-600">원하는 시간에 면접을 예약합니다</p>
                      </CardContent>
                    </Card>
                  </div>

                  {startType === "scheduled" && (
                    <div className="grid md:grid-cols-2 gap-6 mt-6">
                      <div>
                        <Label className="text-base font-medium mb-3 block">날짜 선택</Label>
                        <Calendar
                          mode="single"
                          selected={scheduledDate}
                          onSelect={(date) => {
                            if (date) {
                              const today = new Date()
                              today.setHours(0, 0, 0, 0)
                              if (date >= today) {
                                setScheduledDate(date)
                              }
                            }
                          }}
                          disabled={(date) => {
                            const today = new Date()
                            today.setHours(0, 0, 0, 0)
                            return date < today
                          }}
                          className="rounded-md border"
                        />
                      </div>

                      <div>
                        <Label className="text-base font-medium mb-3 block">시간 선택</Label>
                        <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                          {[
                            "09:00",
                            "09:30",
                            "10:00",
                            "10:30",
                            "11:00",
                            "11:30",
                            "12:00",
                            "12:30",
                            "13:00",
                            "13:30",
                            "14:00",
                            "14:30",
                            "15:00",
                            "15:30",
                            "16:00",
                            "16:30",
                            "17:00",
                            "17:30",
                            "18:00",
                            "18:30",
                            "19:00",
                            "19:30",
                            "20:00",
                            "20:30",
                          ].map((time) => (
                            <Button
                              key={time}
                              variant={scheduledTime === time ? "default" : "outline"}
                              size="sm"
                              onClick={() => setScheduledTime(time)}
                              className={scheduledTime === time ? "bg-[#8FD694] hover:bg-[#7ac47f]" : ""}
                            >
                              {time}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {step === 4 && interviewType === "group" && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-xl font-semibold mb-2">면접 예약</h2>
                    <p className="text-gray-600">그룹 면접 일정을 선택해주세요.</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="maxParticipants">최대 참가자 수</Label>
                      <Select value={maxParticipants} onValueChange={setMaxParticipants}>
                        <SelectTrigger>
                          <SelectValue placeholder="인원 수를 선택하세요" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2">2명</SelectItem>
                          <SelectItem value="3">3명</SelectItem>
                          <SelectItem value="4">4명</SelectItem>
                          <SelectItem value="5">5명</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>공개 설정</Label>
                      <div className="grid md:grid-cols-2 gap-4 mt-2">
                        <Card
                          className={`cursor-pointer transition-all hover:shadow-md ${
                            visibility === "public" ? "ring-2 ring-[#8FD694] bg-green-50" : "hover:bg-gray-50"
                          }`}
                          onClick={() => setVisibility("public")}
                        >
                          <CardContent className="p-4 text-center">
                            <h3 className="font-semibold mb-2">🌐 공개</h3>
                            <p className="text-sm text-gray-600">모든 사용자가 검색하여 참여할 수 있습니다</p>
                          </CardContent>
                        </Card>

                        <Card
                          className={`cursor-pointer transition-all hover:shadow-md ${
                            visibility === "private" ? "ring-2 ring-[#8FD694] bg-green-50" : "hover:bg-gray-50"
                          }`}
                          onClick={() => setVisibility("private")}
                        >
                          <CardContent className="p-4 text-center">
                            <h3 className="font-semibold mb-2">🔒 비공개</h3>
                            <p className="text-sm text-gray-600">초대받은 사용자만 참여할 수 있습니다</p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label className="text-base font-medium mb-3 block">날짜 선택</Label>
                        <Calendar
                          mode="single"
                          selected={scheduledDate}
                          onSelect={(date) => {
                            if (date) {
                              const today = new Date()
                              today.setHours(0, 0, 0, 0)
                              if (date >= today) {
                                setScheduledDate(date)
                              }
                            }
                          }}
                          disabled={(date) => {
                            const today = new Date()
                            today.setHours(0, 0, 0, 0)
                            return date < today
                          }}
                          className="rounded-md border"
                        />
                      </div>

                      <div>
                        <Label className="text-base font-medium mb-3 block">시간 선택</Label>
                        <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                          {[
                            "09:00",
                            "09:30",
                            "10:00",
                            "10:30",
                            "11:00",
                            "11:30",
                            "12:00",
                            "12:30",
                            "13:00",
                            "13:30",
                            "14:00",
                            "14:30",
                            "15:00",
                            "15:30",
                            "16:00",
                            "16:30",
                            "17:00",
                            "17:30",
                            "18:00",
                            "18:30",
                            "19:00",
                            "19:30",
                            "20:00",
                            "20:30",
                          ].map((time) => (
                            <Button
                              key={time}
                              variant={scheduledTime === time ? "default" : "outline"}
                              size="sm"
                              onClick={() => setScheduledTime(time)}
                              className={scheduledTime === time ? "bg-[#8FD694] hover:bg-[#7ac47f]" : ""}
                            >
                              {time}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 5 && interviewType === "group" && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-xl font-semibold mb-2">참가자 초대</h2>
                    <p className="text-gray-600">그룹 면접에 참여할 사람들의 이메일을 입력해주세요.</p>
                  </div>

                  <div className="space-y-4">
                    <Label>참가자 이메일 ({inviteEmails.length}/5)</Label>
                    {inviteEmails.map((item, index) => (
                      <div key={item.id} className="flex items-center space-x-2">
                        <Input
                          placeholder={`참가자 ${index + 1} 이메일`}
                          type="email"
                          value={item.email}
                          onChange={(e) => updateInviteEmail(item.id, e.target.value)}
                        />
                        {inviteEmails.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeInviteEmail(item.id)}
                            className="h-8 w-8 text-red-500"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}

                    {inviteEmails.length < 5 && (
                      <Button type="button" variant="outline" size="sm" onClick={addInviteEmail} className="mt-2">
                        <Plus className="h-4 w-4 mr-2" />
                        참가자 추가
                      </Button>
                    )}

                    <p className="text-sm text-gray-500 mt-2">
                      참가자들에게는 면접 시작 전에 이메일 알림이 발송됩니다.
                    </p>
                  </div>
                </div>
              )}

              {((step === 5 && interviewType === "individual") || (step === 6 && interviewType === "group")) && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-xl font-semibold mb-2">면접 정보 확인</h2>
                    <p className="text-gray-600">설정한 내용을 검토하고 면접을 생성하세요.</p>
                  </div>

                  <div className="grid gap-6">
                    {/* 기본 정보 카드 */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-[#8FD694]" />
                          기본 정보
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">지원 기업:</span>
                          <span className="font-medium">{company}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">지원 직무:</span>
                          <span className="font-medium">{position}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">면접 유형:</span>
                          <div className="flex items-center gap-2">
                            {interviewType === "individual" ? (
                              <User className="h-4 w-4 text-[#8FD694]" />
                            ) : (
                              <Users className="h-4 w-4 text-[#8FD694]" />
                            )}
                            <span className="font-medium">
                              {interviewType === "individual" ? "1:1 개인 면접" : "그룹 면접"}
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">면접 제목:</span>
                          <span className="font-medium">{title}</span>
                        </div>
                        {description && (
                          <div className="pt-2 border-t">
                            <span className="text-gray-600 block mb-1">설명:</span>
                            <p className="text-sm bg-gray-50 p-3 rounded">{description}</p>
                          </div>
                        )}
                        {interviewType === "group" && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">세션 이름:</span>
                            <span className="font-medium">{sessionName}</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* 일정 정보 카드 */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <CalendarIcon className="h-5 w-5 text-[#8FD694]" />
                          일정 정보
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {interviewType === "individual" && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">시작 방식:</span>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-[#8FD694]" />
                              <span className="font-medium">{startType === "now" ? "즉시 시작" : "예약"}</span>
                            </div>
                          </div>
                        )}
                        {((interviewType === "individual" && startType === "scheduled") ||
                          interviewType === "group") && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">예약 시간:</span>
                            <span className="font-medium">
                              {scheduledDate && scheduledTime
                                ? new Date(
                                    `${scheduledDate.toISOString().split("T")[0]}T${scheduledTime}`,
                                  ).toLocaleString("ko-KR", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                : "미설정"}
                            </span>
                          </div>
                        )}
                        {interviewType === "group" && (
                          <>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">최대 참가자:</span>
                              <span className="font-medium">{maxParticipants}명</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">공개 설정:</span>
                              <span className="font-medium">{visibility === "public" ? "🌐 공개" : "🔒 비공개"}</span>
                            </div>
                          </>
                        )}
                      </CardContent>
                    </Card>

                    {/* 면접 옵션 카드 */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Brain className="h-5 w-5 text-[#8FD694]" />
                          면접 옵션
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="grid md:grid-cols-2 gap-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 text-sm">AI 음성:</span>
                          <span className="font-medium text-sm">
                            {voiceType === "female1" && "여성 음성 1"}
                            {voiceType === "female2" && "여성 음성 2"}
                            {voiceType === "male1" && "남성 음성 1"}
                            {voiceType === "male2" && "남성 음성 2"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 text-sm">면접 스타일:</span>
                          <span className="font-medium text-sm">
                            {interviewStyle === "personality" ? "인성 면접" : "기술 면접"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 text-sm">질문 수:</span>
                          <span className="font-medium text-sm">{questionCount}개</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 text-sm">답변 시간:</span>
                          <span className="font-medium text-sm">{answerDuration}분</span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* 자료 정보 카드 */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Upload className="h-5 w-5 text-[#8FD694]" />
                          자료 정보
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">이력서:</span>
                          <span className="font-medium">
                            {resumes.find((r) => r.id === selectedResume)?.name || "미선택"}
                          </span>
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-600">자기소개서:</span>
                            <span className="font-medium">
                              {selectedCoverLetter
                                ? coverLetters.find((c) => c.id === selectedCoverLetter)?.title
                                : newCoverLetter.title || "직접 입력"}
                            </span>
                          </div>
                          <div className="text-sm bg-gray-50 p-3 rounded max-h-24 overflow-y-auto">
                            {selectedCoverLetter
                              ? coverLetters.find((c) => c.id === selectedCoverLetter)?.content
                              : newCoverLetter.content}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* 그룹 면접 참가자 카드 */}
                    {interviewType === "group" && inviteEmails.some((email) => email.email) && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-[#8FD694]" />
                            초대된 참가자 ({inviteEmails.filter((e) => e.email).length}명)
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {inviteEmails
                              .filter((e) => e.email)
                              .map((participant, index) => (
                                <div key={participant.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                                  <div className="w-2 h-2 bg-[#8FD694] rounded-full"></div>
                                  <span className="text-sm">{participant.email}</span>
                                </div>
                              ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  {/* 최종 전송 데이터 미리보기 */}
                  <Card className="border-2 border-dashed border-gray-300">
                    <CardHeader>
                      <CardTitle className="text-sm text-gray-600">📤 API 전송 데이터 (개발자용)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <pre className="text-xs bg-gray-100 p-3 rounded overflow-x-auto whitespace-pre-wrap">
                        {JSON.stringify(
                          {
                            // 공통 필드
                            company,
                            position,
                            title,
                            description,
                            interviewType,
                            resumeId: selectedResume,
                            coverLetter: selectedCoverLetter
                              ? coverLetters.find((c) => c.id === selectedCoverLetter)
                              : { title: newCoverLetter.title, content: newCoverLetter.content },
                            options: {
                              voiceType,
                              interviewStyle,
                              answerDuration,
                              questionCount,
                            },

                            // 개인 면접 필드
                            ...(interviewType === "individual" && {
                              startType,
                              ...(startType === "scheduled" &&
                                scheduledDate && {
                                  scheduledAt: `${scheduledDate.toISOString().split("T")[0]}T${scheduledTime}:00`,
                                }),
                            }),

                            // 그룹 면접 필드
                            ...(interviewType === "group" && {
                              sessionName,
                              maxParticipants: Number.parseInt(maxParticipants),
                              visibility,
                              ...(scheduledDate && {
                                scheduledAt: `${scheduledDate.toISOString().split("T")[0]}T${scheduledTime}:00`,
                              }),
                              participants: inviteEmails.filter((e) => e.email).map((e) => ({ email: e.email })),
                            }),
                          },
                          null,
                          2,
                        )}
                      </pre>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
          {/* Navigation */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={prevStep}>
              {step === 1 ? "취소" : "이전"}
            </Button>
            <Button className="bg-[#8FD694] hover:bg-[#7ac47f] text-white" onClick={nextStep}>
              {step === getTotalSteps() ? "면접 생성" : "다음"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
