// src/components/interview/steps/Step2.tsx
"use client"

import { useState, useRef } from "react"
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
import { z } from 'zod'

interface Props {
    form: InterviewFormState
    setForm: React.Dispatch<React.SetStateAction<InterviewFormState>>
}

export default function Step2({ form, setForm }: Props) {
    /* 로컬 UI 토글 상태 (글로벌 폼에 저장할 필요 X) */
    const [showNewResume, setShowNewResume] = useState(false)
    const [showNewCoverLetter, setShowNewCoverLetter] = useState(false)
    const [newResumeFile, setNewResumeFile] = useState('')

    // 이력서 리스트를 상태로 관리 (업로드 시 추가)
    const [resumes, setResumes] = useState([
        { id: '1', name: '신입 개발자 이력서.pdf', url: 'https://mock-resume.com/1.pdf' },
        { id: '2', name: '포트폴리오_2023.pdf', url: 'https://mock-resume.com/2.pdf' },
        { id: '3', name: '경력기술서_최종.docx', url: 'https://mock-resume.com/3.docx' },
    ])
    const [coverLetters, setCoverLetters] = useState([
        {
            id: '1',
            representativeTitle: '삼성전자 SW개발직군 자기소개서',
            items: [
                { title: '성장과정', content: '저는 컴퓨터공학을 전공하며...' },
                { title: '지원동기', content: '삼성전자에서 혁신적인 기술 개발에...' },
            ],
        },
        {
            id: '2',
            representativeTitle: '네이버 백엔드 개발자 자기소개서',
            items: [
                { title: '경험', content: '다양한 웹 서비스를 개발하며...' },
                { title: '포부', content: '네이버의 기술력과 함께 성장하고 싶습니다.' },
            ],
        },
    ])

    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isDragActive, setIsDragActive] = useState(false)

    // 자기소개서 작성 상태
    const [newCoverLetterRepTitle, setNewCoverLetterRepTitle] = useState('')
    const [newCoverLetterItems, setNewCoverLetterItems] = useState([
        { title: '', content: '' },
    ])

    // Zod 스키마 (대표제목, items: [{title, content}])
    const coverLetterSchema = z.object({
        representativeTitle: z.string().min(1, '대표 제목을 입력하세요.'),
        items: z.array(
            z.object({
                title: z.string().min(1, '제목을 입력하세요.'),
                content: z.string().min(1, '내용을 입력하세요.'),
            })
        ).min(1, '최소 1개 항목 필요'),
    })

    /* 편의 패치 함수 */
    const patch = (p: Partial<InterviewFormState>) =>
        setForm((f) => ({ ...f, ...p }))

    // 이력서 mock 업로드 함수
    const handleNewResumeUpload = () => {
        if (!newResumeFile) return
        // mock id/url 생성
        const newId = `mock-${Date.now()}`
        const newUrl = `https://mock-resume.com/${newId}.pdf`
        const newResume = { id: newId, name: newResumeFile, url: newUrl }
        setResumes((prev) => [...prev, newResume])
        patch({ resumeId: newId, resumeTitle: newResumeFile }) // id와 파일명 모두 저장
        alert(`이력서가 업로드되었습니다.\n링크: ${newUrl}`)
        setNewResumeFile('')
        setShowNewResume(false)
    }

    const handleNewCoverLetterSave = () => {
        const parsed = coverLetterSchema.safeParse({
            representativeTitle: newCoverLetterRepTitle,
            items: newCoverLetterItems,
        })
        if (!parsed.success) {
            alert(parsed.error.errors[0].message)
            return
        }
        const newId = `mock-cl-${Date.now()}`
        const newCoverLetter = {
            id: newId,
            representativeTitle: newCoverLetterRepTitle,
            items: newCoverLetterItems,
        }
        setCoverLetters((prev) => [...prev, newCoverLetter])
        patch({ coverLetterId: newId, coverLetterTitle: newCoverLetterRepTitle }) // id와 대표제목 모두 저장
        alert('자기소개서가 저장되었습니다.')
        setNewCoverLetterRepTitle('')
        setNewCoverLetterItems([{ title: '', content: '' }])
        setShowNewCoverLetter(false)
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setNewResumeFile(file.name)
        }
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragActive(false)
        const file = e.dataTransfer.files?.[0]
        if (file) {
            setNewResumeFile(file.name)
        }
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragActive(true)
    }

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragActive(false)
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
                            onValueChange={(v) => {
                                const selected = resumes.find(r => r.id === v)
                                patch({ resumeId: v, resumeTitle: selected ? selected.name : '' })
                            }}
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
                            <input
                                type="file"
                                accept=".pdf,.doc,.docx,.txt"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                            />
                            <div
                                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragActive ? 'bg-green-50 border-[#8FD694]' : ''}`}
                                onClick={() => fileInputRef.current?.click()}
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                            >
                                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-600">
                                    파일 선택 또는 드래그
                                </p>
                                {newResumeFile && (
                                    <p className="text-xs text-gray-500 mt-2">{newResumeFile}</p>
                                )}
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
                            {coverLetters.map((cl) => (
                                <Card
                                    key={cl.id}
                                    className={`cursor-pointer transition ${form.coverLetterId === cl.id ? 'border-[#8FD694] bg-[#8FD694]/5' : 'hover:bg-gray-50'}`}
                                    onClick={() => patch({ coverLetterId: cl.id, coverLetterTitle: cl.representativeTitle })}
                                >
                                    <CardContent className="p-4">
                                        <h4 className="font-medium truncate">{cl.representativeTitle}</h4>
                                        <ul className="mt-2 space-y-1 text-xs text-gray-600">
                                            {cl.items.map((item, idx) => (
                                                <li key={idx}>
                                                    <span className="font-semibold">[{item.title}]</span> {item.content.slice(0, 30)}...
                                                </li>
                                            ))}
                                        </ul>
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
                                placeholder="대표 제목"
                                value={newCoverLetterRepTitle}
                                onChange={(e) => setNewCoverLetterRepTitle(e.target.value)}
                            />
                            {newCoverLetterItems.map((item, idx) => (
                                <div key={idx} className="flex flex-col gap-2 mb-2 w-full">
                                    <Input
                                        placeholder="제목"
                                        value={item.title}
                                        onChange={(e) => {
                                            const next = [...newCoverLetterItems]
                                            next[idx].title = e.target.value
                                            setNewCoverLetterItems(next)
                                        }}
                                    />
                                    <Textarea
                                        rows={3}
                                        placeholder="내용"
                                        value={item.content}
                                        onChange={(e) => {
                                            const next = [...newCoverLetterItems]
                                            next[idx].content = e.target.value
                                            setNewCoverLetterItems(next)
                                        }}
                                    />
                                    <Button
                                        variant="ghost"
                                        disabled={newCoverLetterItems.length === 1}
                                        onClick={() => setNewCoverLetterItems(items => items.length > 1 ? items.filter((_, i) => i !== idx) : items)}
                                        className="self-start text-xs text-red-400"
                                    >
                                        삭제
                                    </Button>
                                </div>
                            ))}
                            <Button
                                variant="outline"
                                onClick={() => setNewCoverLetterItems(items => [...items, { title: '', content: '' }])}
                                className="w-full mb-2"
                            >
                                + 항목 추가
                            </Button>
                            <div className="flex gap-2">
                                <Button
                                    className="flex-1"
                                    disabled={!newCoverLetterRepTitle || newCoverLetterItems.some(i => !i.title || !i.content)}
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
