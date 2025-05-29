"use client"

import { useState } from "react"
import { useInterviewWizard } from "../InterviewWizardContext"
import { useInterviewStore } from "@/lib/stores/interview-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, FileText, Upload } from "lucide-react"

export function DataSelectionStep() {
  const { state, setState } = useInterviewWizard()
  const { resumes, coverLetters, addResume, addCoverLetter } = useInterviewStore()
  const [showNewResume, setShowNewResume] = useState(false)
  const [showNewCoverLetter, setShowNewCoverLetter] = useState(false)
  const [newResumeFile, setNewResumeFile] = useState("")
  const [newCoverLetter, setNewCoverLetter] = useState({
    representativeTitle: "",
    content: "",
  })

  const handleResumeSelect = (resumeId: string) => {
    setState({ resumeId })
  }

  const handleCoverLetterSelect = (coverLetterId: string) => {
    setState({ coverLetterId })
  }

  const handleNewResumeUpload = () => {
    if (!newResumeFile) return

    const resumeId = addResume({
      fileName: newResumeFile,
      url: `/static/resumes/${newResumeFile}`,
    })

    setState({ resumeId })
    setNewResumeFile("")
    setShowNewResume(false)
  }

  const handleNewCoverLetterSave = () => {
    if (!newCoverLetter.representativeTitle || !newCoverLetter.content) return

    const coverLetterId = addCoverLetter(newCoverLetter)

    setState({ coverLetterId })
    setNewCoverLetter({ representativeTitle: "", content: "" })
    setShowNewCoverLetter(false)
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold mb-2">면접 자료를 선택해주세요</h2>
        <p className="text-gray-600">이력서와 자기소개서를 선택하거나 새로 추가해주세요.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resume Selection */}
        {state.interviewType === "individual" && (
          <div className="space-y-4">
            <Label className="text-base font-medium">이력서 선택</Label>

            {!showNewResume ? (
              <div className="space-y-3">
                <Select value={state.resumeId} onValueChange={handleResumeSelect}>
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
        )}

        {/* Cover Letter Section */}
        <div className="space-y-4">
          <Label className="text-base font-medium">자기소개서 선택</Label>

          {!showNewCoverLetter ? (
            <div className="space-y-3">
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {coverLetters.map((coverLetter) => (
                  <Card
                    key={coverLetter.id}
                    className={`cursor-pointer transition-colors ${
                      state.coverLetterId === coverLetter.id ? "border-[#8FD694] bg-[#8FD694]/5" : "hover:bg-gray-50"
                    }`}
                    onClick={() => handleCoverLetterSelect(coverLetter.id)}
                  >
                    <CardContent className="p-4 flex items-center gap-3">
                      <FileText className="h-5 w-5 text-[#8FD694] flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{coverLetter.representativeTitle}</h4>
                        <p className="text-sm text-gray-600 truncate">{coverLetter.content.substring(0, 60)}...</p>
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
                    placeholder="예: 삼성전자 SW개발직군 자기소개서"
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
                    rows={8}
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
      </div>
    </div>
  )
}
