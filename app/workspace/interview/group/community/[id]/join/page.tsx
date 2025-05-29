"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Info } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export default function JoinGroupInterviewPage({ params }: { params: { id: string } }) {
  const postId = params.id
  const [selectedResume, setSelectedResume] = useState("")
  const [selectedCoverLetter, setSelectedCoverLetter] = useState("")

  // Mock data
  const interviewInfo = {
    title: "삼성전자 상반기 공채 대비 모의면접",
    date: "2023년 6월 10일 오후 2:00",
    host: "김지원",
    participants: 2,
    maxParticipants: 4,
  }

  const resumes = [
    { id: "1", name: "신입 개발자 이력서.pdf" },
    { id: "2", name: "포트폴리오_2023.pdf" },
    { id: "3", name: "경력기술서_최종.docx" },
  ]

  const coverLetters = [
    { id: "1", name: "삼성전자 자기소개서.pdf" },
    { id: "2", name: "네이버 지원 자소서.docx" },
    { id: "3", name: "카카오 인턴십 자소서" },
    { id: "4", name: "현대자동차 공채 지원서.pdf" },
  ]

  const handleSubmit = () => {
    if (!selectedResume || !selectedCoverLetter) {
      alert("이력서와 자기소개서를 모두 선택해주세요.")
      return
    }

    // 면접 참여 신청 처리
    alert("면접 참여 신청이 완료되었습니다. 면접은 예정된 시간에 자동으로 시작됩니다.")
    window.location.href = `/workspace/interview/group/community/${postId}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/workspace/interview/group/community/${postId}`}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> 모집글로 돌아가기
          </Link>
          <h1 className="text-2xl font-bold">면접 참여 신청</h1>
          <p className="text-gray-600 mt-2">{interviewInfo.title}</p>
        </div>

        {/* Main Content */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>면접 자료 선택</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-700">면접 참여 안내</h3>
                  <p className="text-blue-600 text-sm mt-1">
                    면접에 사용할 이력서와 자기소개서를 선택해주세요. 면접은 {interviewInfo.date}에 자동으로 시작됩니다.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">면접 정보</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">면접 제목</span>
                    <span className="text-sm font-medium">{interviewInfo.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">면접 일시</span>
                    <span className="text-sm font-medium">{interviewInfo.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">호스트</span>
                    <span className="text-sm font-medium">{interviewInfo.host}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">참가자</span>
                    <span className="text-sm font-medium">
                      {interviewInfo.participants}/{interviewInfo.maxParticipants}명
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">이력서 선택</Label>
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

                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">자기소개서 선택</Label>
                  <Select value={selectedCoverLetter} onValueChange={setSelectedCoverLetter}>
                    <SelectTrigger>
                      <SelectValue placeholder="자기소개서를 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {coverLetters.map((letter) => (
                        <SelectItem key={letter.id} value={letter.id}>
                          {letter.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => window.history.back()}>
              취소
            </Button>
            <Button
              className="bg-[#8FD694] hover:bg-[#7ac47f] text-white"
              onClick={handleSubmit}
              disabled={!selectedResume || !selectedCoverLetter}
            >
              면접 참여 신청
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        <div className="text-center text-sm text-gray-500">
          <p>
            면접 참여 신청 후에도 면접 시작 전까지 이력서와 자기소개서를 변경할 수 있습니다. 면접 시작 10분 전부터
            대기실에 입장할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  )
}
