"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Share2, CheckCircle, XCircle, BarChart, Play, User } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function GroupInterviewReportPage() {
  // 이 데이터는 실제로는 API에서 가져오거나 상태 관리 라이브러리에서 가져옴
  const sessionName = "2023 상반기 공채 모의면접"
  const participants = [
    { id: "1", name: "김지원", score: "A" },
    { id: "2", name: "이민수", score: "B+" },
    { id: "3", name: "박서연", score: "A-" },
  ]

  const [selectedParticipant, setSelectedParticipant] = useState(participants[0].id)

  // Mock data for the report
  const participantReports = {
    "1": {
      name: "김지원",
      overallScore: "A",
      categories: [
        {
          name: "내용 전달력",
          score: "A",
          feedback:
            "질문의 핵심을 정확히 파악하고 논리적으로 답변했습니다. 특히 프로젝트 경험을 설명할 때 STAR 기법을 잘 활용했습니다.",
        },
        {
          name: "논리성",
          score: "A-",
          feedback: "전반적으로 논리적인 구조를 갖추었으나, 일부 답변에서 주제 간 연결이 부족했습니다.",
        },
        {
          name: "태도",
          score: "A+",
          feedback:
            "면접 내내 적절한 자세와 시선 처리를 유지했습니다. 자신감 있는 목소리 톤과 밝은 표정이 인상적이었습니다.",
        },
      ],
      goodPoints: [
        "자기소개서와 일관된 답변으로 신뢰감을 주었습니다.",
        "구체적인 경험과 수치를 활용한 답변이 설득력 있었습니다.",
      ],
      improvementPoints: ["일부 답변이 너무 길었습니다. 핵심을 더 간결하게 전달하면 좋겠습니다."],
    },
    "2": {
      name: "이민수",
      overallScore: "B+",
      categories: [
        {
          name: "내용 전달력",
          score: "B+",
          feedback: "답변 내용은 좋았으나, 전달 방식에서 간간이 불필요한 반복이 있었습니다.",
        },
        {
          name: "논리성",
          score: "A-",
          feedback: "논리적 구조는 잘 갖추었으나, 일부 예시가 주제와 직접적인 연관성이 부족했습니다.",
        },
        {
          name: "태도",
          score: "B",
          feedback: "전반적으로 무난했으나, 더 적극적인 자세와 표정 관리가 필요합니다.",
        },
      ],
      goodPoints: ["기술적 지식이 풍부하고 전문성이 돋보였습니다.", "질문에 대한 이해도가 높았습니다."],
      improvementPoints: [
        "답변 시 목소리 톤의 변화가 적어 단조로운 느낌이 들었습니다.",
        "더 구체적인 사례를 준비하면 좋겠습니다.",
      ],
    },
    "3": {
      name: "박서연",
      overallScore: "A-",
      categories: [
        {
          name: "내용 전달력",
          score: "A",
          feedback: "명확하고 간결한 답변으로 핵심을 잘 전달했습니다.",
        },
        {
          name: "논리성",
          score: "B+",
          feedback: "대체로 논리적이었으나, 일부 답변에서 근거가 부족했습니다.",
        },
        {
          name: "태도",
          score: "A",
          feedback: "자신감 있는 태도와 적절한 제스처가 인상적이었습니다.",
        },
      ],
      goodPoints: ["간결하면서도 핵심을 놓치지 않는 답변이 좋았습니다.", "어려운 질문에도 침착하게 대응했습니다."],
      improvementPoints: [
        "일부 기술적 질문에 대한 깊이 있는 답변이 부족했습니다.",
        "답변 시간을 더 효율적으로 활용하면 좋겠습니다.",
      ],
    },
  }

  const currentReport = participantReports[selectedParticipant as keyof typeof participantReports]

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
              <h1 className="text-2xl font-bold">{sessionName} - 결과 리포트</h1>
              <p className="text-gray-600 mt-1">2023년 5월 16일 진행된 다대다 모의 면접 결과입니다.</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="flex items-center">
                <Download className="h-4 w-4 mr-1" /> PDF 저장
              </Button>
              <Button variant="outline" size="sm" className="flex items-center">
                <Share2 className="h-4 w-4 mr-1" /> 공유
              </Button>
            </div>
          </div>
        </div>

        {/* Participant Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">참가자 선택</label>
          <div className="flex space-x-2">
            <Select value={selectedParticipant} onValueChange={setSelectedParticipant}>
              <SelectTrigger className="w-full max-w-xs">
                <SelectValue placeholder="참가자를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {participants.map((participant) => (
                  <SelectItem key={participant.id} value={participant.id}>
                    {participant.name} ({participant.score})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Tabs value={selectedParticipant} onValueChange={setSelectedParticipant} className="hidden md:flex">
              <TabsList>
                {participants.map((participant) => (
                  <TabsTrigger key={participant.id} value={participant.id} className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    {participant.name}
                    <span
                      className={`ml-2 px-1.5 py-0.5 rounded-full text-xs font-medium ${
                        participant.score.startsWith("A+")
                          ? "bg-purple-100 text-purple-800"
                          : participant.score.startsWith("A")
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {participant.score}
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Overall Score */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6 text-center">
          <div className="inline-flex flex-col items-center">
            <div className="text-6xl font-bold text-[#8FD694] mb-2">{currentReport.overallScore}</div>
            <div className="text-gray-600">종합 평가</div>
          </div>
          <p className="mt-4 text-gray-700 max-w-2xl mx-auto">
            {currentReport.name}님은 전반적으로 우수한 면접 수행을 보여주셨습니다. 특히 자기소개서와 일관된 답변과
            구체적인 경험 사례가 돋보였습니다. 일부 개선이 필요한 부분이 있으나, 충분히 경쟁력 있는 면접 역량을 갖추고
            있습니다.
          </p>
        </div>

        {/* Category Feedback */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">카테고리별 피드백</h2>
          <div className="space-y-4">
            {currentReport.categories.map((category, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium text-lg flex items-center">
                    <BarChart className="h-5 w-5 text-[#8FD694] mr-2" />
                    {category.name}
                  </h3>
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      category.score.startsWith("A+")
                        ? "bg-purple-100 text-purple-800"
                        : category.score.startsWith("A")
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {category.score}
                  </div>
                </div>
                <p className="text-gray-700">{category.feedback}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Good Points & Improvements */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Good Points */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-medium text-lg flex items-center mb-4">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              잘한 점
            </h3>
            <ul className="space-y-3">
              {currentReport.goodPoints.map((point, index) => (
                <li key={index} className="flex items-start">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5 mr-2 flex-shrink-0">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                  </div>
                  <span className="text-gray-700">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Improvements */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-medium text-lg flex items-center mb-4">
              <XCircle className="h-5 w-5 text-red-500 mr-2" />
              개선할 점
            </h3>
            <ul className="space-y-3">
              {currentReport.improvementPoints.map((point, index) => (
                <li key={index} className="flex items-start">
                  <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center mt-0.5 mr-2 flex-shrink-0">
                    <XCircle className="h-3 w-3 text-red-500" />
                  </div>
                  <span className="text-gray-700">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Question-by-Question */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">질문별 분석</h2>
          <p className="text-gray-600 mb-4">{currentReport.name}님의 각 질문에 대한 상세 피드백과 점수를 확인하세요.</p>
          <div className="space-y-4">
            {[1, 2, 3].map((questionNum) => (
              <div
                key={questionNum}
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">질문 {questionNum}</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#8FD694] hover:text-[#7ac47f] hover:bg-[#8FD694]/10"
                  >
                    <Play className="h-4 w-4 mr-1" /> 답변 듣기
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {questionNum === 1
                    ? "자기소개서에 언급하신 프로젝트에서 가장 어려웠던 점과 어떻게 해결했는지 설명해주세요."
                    : questionNum === 2
                      ? "팀 프로젝트에서 갈등이 있었을 때 어떻게 해결했는지 구체적인 사례를 들어 설명해주세요."
                      : "지원하신 직무에 필요한 역량이 무엇이라고 생각하시나요?"}
                </p>
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <Button variant="outline">모든 질문 보기 (총 5개)</Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => (window.location.href = "/workspace/interviews")}>
            내 면접으로 돌아가기
          </Button>
          <Button
            className="bg-[#8FD694] hover:bg-[#7ac47f] text-white"
            onClick={() => (window.location.href = "/workspace/interview/start")}
          >
            새 면접 시작하기
          </Button>
        </div>
      </div>
    </div>
  )
}
