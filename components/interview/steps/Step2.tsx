// src/components/interview/steps/Step2.tsx
"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Plus, Upload } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import type { InterviewFormState } from "@/lib/interview/types"

interface Props {
    form: InterviewFormState
    setForm: React.Dispatch<React.SetStateAction<InterviewFormState>>
}

export default function Step2({ form, setForm }: Props) {
    /* 로컬 UI 토글 상태 (글로벌 폼에 저장할 필요 X) */
    const [showNewResume, setShowNewResume] = useState(false)
    const [showNewCoverLetter, setShowNewCoverLetter] = useState(false)
    const [newResumeFile, setNewResumeFile] = useState("")

    /* 임시 목록 (후에 React-Query 교체) */
    const resumes = [
        { id: "1", name: "신입 개발자 이력서.pdf" },
        { id: "2", name: "포트폴리오_2023.pdf" },
        { id: "3", name: "경력기술서_최종.docx" },
    ]
    const coverLetters = [
        {
            id: "1",
            title: "삼성전자 자기소개서",
            content: "삼성전자 SW개발직군에 지원하는...",
        },
        {
            id: "2",
            title: "네이버 지원 자소서",
            content: "네이버 백엔드 개발자에 지원하게 된...",
        },
        {
            id: "3",
            title: "카카오 인턴십 자소서",
            content: "사용자 경험을 최우선으로 하는...",
        },
    ]

    /* 편의 패치 함수 */
    const patch = (p: Partial<InterviewFormState>) =>
        setForm((f) => ({ ...f, ...p }))

    const handleNewResumeUpload = () => {
        if (!newResumeFile) return
        // TODO: API 호출 후 id 반환 → patch({ resumeId: returnedId })
        alert("이력서가 업로드되었습니다.")
        setNewResumeFile("")
        setShowNewResume(false)
    }

    const handleNewCoverLetterSave = () => {
        if (!form.newCoverLetterTitle || !form.newCoverLetterContent) return
        // TODO: API 저장 후 id 반환 → patch({ coverLetterId: returnedId, ... })
        alert("자기소개서가 저장되었습니다.")
        patch({ coverLetterId: null })
        setShowNewCoverLetter(false)
    }

    return (
        <div className="space-y-6">
            {/* 📑 이력서 */}
            <div className="space-y-4">
                <Label>이력서 선택 *</Label>
                {!showNewResume ? (
                    <div className="space-y-3">
                        <Select
                            value={form.resumeId ?? ""}
                            onValueChange={(v) => patch({ resumeId: v })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="이력서를 선택하세요" />
                            </SelectTrigger>
                            <SelectContent>
                                {resumes.map((r) => (
                                    <SelectItem key={r.id} value={r.id}>
                                        {r.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button
                            variant="outline"
                            onClick={() => setShowNewResume(true)}
                            className="w-full flex items-center gap-2"
                        >
                            <Plus className="h-4 w-4" /> 새 이력서 업로드
                        </Button>
                    </div>
                ) : (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">새 이력서 업로드</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Input
                                placeholder="예: resume.pdf"
                                value={newResumeFile}
                                onChange={(e) => setNewResumeFile(e.target.value)}
                            />
                            <div className="border-2 border-dashed rounded-lg p-6 text-center">
                                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-600">파일 선택 또는 드래그</p>
                            </div>
                            <div className="flex gap-2">
                                <Button className="flex-1" disabled={!newResumeFile} onClick={handleNewResumeUpload}>
                                    업로드
                                </Button>
                                <Button variant="outline" className="flex-1" onClick={() => setShowNewResume(false)}>
                                    취소
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* 📝 자기소개서 */}
            <div className="space-y-4">
                <Label>자기소개서 선택 *</Label>
                {!showNewCoverLetter ? (
                    <div className="space-y-3">
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            {coverLetters.map((l) => (
                                <Card
                                    key={l.id}
                                    className={`cursor-pointer transition ${form.coverLetterId === l.id ? "border-[#8FD694] bg-[#8FD694]/5" : "hover:bg-gray-50"
                                        }`}
                                    onClick={() => patch({ coverLetterId: l.id })}
                                >
                                    <CardContent className="p-4 flex items-center gap-3">
                                        <FileText className="h-5 w-5 text-[#8FD694]" />
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium truncate">{l.title}</h4>
                                            <p className="text-sm text-gray-600 truncate">{l.content.slice(0, 60)}...</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                        <Button
                            variant="outline"
                            className="w-full flex items-center gap-2"
                            onClick={() => setShowNewCoverLetter(true)}
                        >
                            <Plus className="h-4 w-4" /> 새 자기소개서 작성
                        </Button>
                    </div>
                ) : (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">새 자기소개서 작성</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Input
                                placeholder="제목"
                                value={form.newCoverLetterTitle}
                                onChange={(e) => patch({ newCoverLetterTitle: e.target.value })}
                            />
                            <Textarea
                                rows={8}
                                placeholder="내용"
                                value={form.newCoverLetterContent}
                                onChange={(e) => patch({ newCoverLetterContent: e.target.value })}
                            />
                            <div className="flex gap-2">
                                <Button
                                    className="flex-1"
                                    disabled={!form.newCoverLetterTitle || !form.newCoverLetterContent}
                                    onClick={handleNewCoverLetterSave}
                                >
                                    저장
                                </Button>
                                <Button variant="outline" className="flex-1" onClick={() => setShowNewCoverLetter(false)}>
                                    취소
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
