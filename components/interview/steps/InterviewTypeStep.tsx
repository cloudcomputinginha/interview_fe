"use client"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, User } from "lucide-react"
import { useInterviewWizard } from "../InterviewWizardContext"

const COMPANIES = [
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

const POSITIONS = [
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

export function InterviewTypeStep() {
  const { state, setState } = useInterviewWizard()

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold mb-2">면접 정보를 입력해주세요</h2>
        <p className="text-gray-600">면접 유형과 기본 정보를 선택해주세요.</p>
      </div>

      {/* 기업 및 직무 정보 */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="space-y-2">
          <Label htmlFor="company" className="text-sm font-medium">
            지원 기업 <span className="text-red-500">*</span>
          </Label>
          <Select value={state.company} onValueChange={(value) => setState({ company: value })}>
            <SelectTrigger>
              <SelectValue placeholder="기업을 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              {COMPANIES.map((company) => (
                <SelectItem key={company} value={company}>
                  {company}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {state.company === "기타" && (
            <Input
              placeholder="기업명을 직접 입력하세요"
              value={state.company === "기타" ? "" : state.company}
              onChange={(e) => setState({ company: e.target.value })}
              className="mt-2"
            />
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="position" className="text-sm font-medium">
            지원 직무 <span className="text-red-500">*</span>
          </Label>
          <Select value={state.position} onValueChange={(value) => setState({ position: value })}>
            <SelectTrigger>
              <SelectValue placeholder="직무를 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              {POSITIONS.map((position) => (
                <SelectItem key={position} value={position}>
                  {position}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {state.position === "기타" && (
            <Input
              placeholder="직무를 직접 입력하세요"
              value={state.position === "기타" ? "" : state.position}
              onChange={(e) => setState({ position: e.target.value })}
              className="mt-2"
            />
          )}
        </div>
      </div>

      {/* 면접 유형 선택 */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${
            state.interviewType === "individual" ? "ring-2 ring-[#8FD694] bg-green-50" : "hover:bg-gray-50"
          }`}
          onClick={() => setState({ interviewType: "individual" })}
        >
          <CardContent className="p-6 text-center">
            <User className="h-12 w-12 mx-auto mb-4 text-[#8FD694]" />
            <h3 className="font-semibold mb-2">1:1 개인 면접</h3>
            <p className="text-sm text-gray-600">AI와 함께하는 개인 맞춤형 면접 연습</p>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${
            state.interviewType === "group" ? "ring-2 ring-[#8FD694] bg-green-50" : "hover:bg-gray-50"
          }`}
          onClick={() => setState({ interviewType: "group" })}
        >
          <CardContent className="p-6 text-center">
            <Users className="h-12 w-12 mx-auto mb-4 text-[#8FD694]" />
            <h3 className="font-semibold mb-2">그룹 면접</h3>
            <p className="text-sm text-gray-600">여러 참가자와 함께하는 그룹 면접 연습</p>
          </CardContent>
        </Card>
      </div>

      {/* 면접 제목/세션명 입력 */}
      {state.interviewType === "individual" && (
        <div className="p-4 border rounded-lg bg-gray-50">
          <div className="space-y-2">
            <Label htmlFor="interviewTitle" className="text-sm font-medium">
              면접 제목 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="interviewTitle"
              placeholder="예: 삼성전자 상반기 공채 모의면접"
              value={state.title || ""}
              onChange={(e) => setState({ title: e.target.value })}
            />
            <p className="text-xs text-gray-500">면접 제목은 나중에 내 면접 목록에서 확인할 수 있습니다.</p>
          </div>
        </div>
      )}

      {state.interviewType === "group" && (
        <div className="p-4 border rounded-lg bg-gray-50">
          <div className="space-y-2">
            <Label htmlFor="sessionName" className="text-sm font-medium">
              면접 세션 이름 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="sessionName"
              placeholder="예: 2023 상반기 공채 모의면접"
              value={state.sessionName || ""}
              onChange={(e) => setState({ sessionName: e.target.value })}
            />
            <p className="text-xs text-gray-500">다른 참가자들이 볼 수 있는 세션 이름입니다.</p>
          </div>
        </div>
      )}
    </div>
  )
}
