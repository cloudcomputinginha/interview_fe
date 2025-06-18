// src/components/interview/steps/Step1.tsx
"use client"

import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { User, Users } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import type { InterviewFormState } from "@/lib/interview/types"
import { useState } from "react"

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

interface Props {
    form: InterviewFormState
    setForm: React.Dispatch<React.SetStateAction<InterviewFormState>>
}

export default function Step1({ form, setForm }: Props) {
    const set = (patch: Partial<InterviewFormState>) =>
        setForm((f) => ({ ...f, ...patch }))

    const [noticeUrl, setNoticeUrl] = useState("")

    return (
        <div className="space-y-6">
            {/* 기업 & 직무 */}
            <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>지원 기업 *</Label>
                    <Select value={form.company} onValueChange={(v) => set({ company: v })}>
                        <SelectTrigger>
                            <SelectValue placeholder="기업을 선택하세요" />
                        </SelectTrigger>
                        <SelectContent>
                            {companies.map((c) => (
                                <SelectItem key={c} value={c}>
                                    {c}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {form.company === "기타" && (
                        <Input
                            placeholder="기업명을 직접 입력하세요"
                            value={form.company}
                            onChange={(e) => set({ company: e.target.value })}
                            className="mt-2"
                        />
                    )}
                </div>
                <div className="space-y-2">
                    <Label>지원 직무 *</Label>
                    <Select value={form.position} onValueChange={(v) => set({ position: v })}>
                        <SelectTrigger>
                            <SelectValue placeholder="직무를 선택하세요" />
                        </SelectTrigger>
                        <SelectContent>
                            {positions.map((p) => (
                                <SelectItem key={p} value={p}>
                                    {p}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {form.position === "기타" && (
                        <Input
                            placeholder="직무를 직접 입력하세요"
                            value={form.position}
                            onChange={(e) => set({ position: e.target.value })}
                            className="mt-2"
                        />
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <Label>채용 공고 링크</Label>
                <Input
                    value={noticeUrl}
                    onChange={(e) => setNoticeUrl(e.target.value)}
                    placeholder="예: https://recruit.hyundai.com/..."
                />
            </div>

            {/* 면접 유형 */}
            <div className="space-y-4">
                <Label>면접 유형 *</Label>
                <div className="grid md:grid-cols-2 gap-4">
                    <Card
                        onClick={() => set({ interviewType: "individual" })}
                        className={`cursor-pointer transition hover:shadow ${form.interviewType === "individual" ? "ring-2 ring-[#8FD694] bg-green-50" : "hover:bg-gray-50"
                            }`}
                    >
                        <CardContent className="p-6 text-center">
                            <User className="h-12 w-12 mx-auto mb-4 text-[#8FD694]" />
                            <h3 className="font-semibold mb-2">1:1 개인 면접</h3>
                            <p className="text-sm text-gray-600">AI와 함께하는 개인 맞춤형 면접 연습</p>
                        </CardContent>
                    </Card>
                    <Card
                        onClick={() => set({ interviewType: "group" })}
                        className={`cursor-pointer transition hover:shadow ${form.interviewType === "group" ? "ring-2 ring-[#8FD694] bg-green-50" : "hover:bg-gray-50"
                            }`}
                    >
                        <CardContent className="p-6 text-center">
                            <Users className="h-12 w-12 mx-auto mb-4 text-[#8FD694]" />
                            <h3 className="font-semibold mb-2">그룹 면접</h3>
                            <p className="text-sm text-gray-600">여러 참가자와 함께하는 그룹 면접 연습</p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* 제목 & 설명 */}
            <div className="space-y-2">
                <Label>면접 제목 *</Label>
                <Input
                    value={form.title}
                    onChange={(e) => set({ title: e.target.value })}
                    placeholder="예: 삼성전자 상반기 공채 모의면접"
                />
            </div>
            <div className="space-y-2">
                <Label>면접 설명</Label>
                <Textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) => set({ description: e.target.value })}
                    placeholder="면접에 대한 추가 설명을 입력하세요..."
                />
            </div>

            {/* 그룹 세션명 */}
            {form.interviewType === "group" && (
                <div className="space-y-2">
                    <Label>세션 이름 *</Label>
                    <Input
                        value={form.sessionName}
                        onChange={(e) => set({ sessionName: e.target.value })}
                        placeholder="예: 2023 상반기 공채 모의면접"
                    />
                    <p className="text-xs text-gray-500">다른 참가자들이 볼 수 있는 세션 이름입니다.</p>
                </div>
            )}
        </div>
    )
}
