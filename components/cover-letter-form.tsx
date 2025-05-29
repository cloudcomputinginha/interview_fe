"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface CoverLetterFormProps {
  onSubmit: (data: {
    title: string
    content: { id: number; question: string; answer: string }[]
  }) => void
  onCancel: () => void
  initialData?: {
    title: string
    content: { id: number; question: string; answer: string }[]
  }
}

export function CoverLetterForm({ onSubmit, onCancel, initialData }: CoverLetterFormProps) {
  const [coverLetterTitle, setCoverLetterTitle] = useState(initialData?.title || "")
  const [questionAnswerPairs, setQuestionAnswerPairs] = useState(
    initialData?.content || [{ id: 1, question: "", answer: "" }],
  )
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit")

  const addQuestionAnswerPair = () => {
    setQuestionAnswerPairs([...questionAnswerPairs, { id: Date.now(), question: "", answer: "" }])
  }

  const removeQuestionAnswerPair = (id: number) => {
    if (questionAnswerPairs.length > 1) {
      setQuestionAnswerPairs(questionAnswerPairs.filter((pair) => pair.id !== id))
    }
  }

  const updateQuestionAnswerPair = (id: number, field: "question" | "answer", value: string) => {
    setQuestionAnswerPairs(questionAnswerPairs.map((pair) => (pair.id === id ? { ...pair, [field]: value } : pair)))
  }

  const handleSubmit = () => {
    onSubmit({
      title: coverLetterTitle,
      content: questionAnswerPairs,
    })
  }

  const isFormValid = () => {
    return coverLetterTitle && questionAnswerPairs.every((pair) => pair.question && pair.answer)
  }

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="coverLetterTitle" className="mb-2 block">
          자기소개서 제목
        </Label>
        <Input
          id="coverLetterTitle"
          value={coverLetterTitle}
          onChange={(e) => setCoverLetterTitle(e.target.value)}
          placeholder="예: 삼성전자 신입 공채 자기소개서"
        />
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "edit" | "preview")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="edit">편집</TabsTrigger>
          <TabsTrigger value="preview" disabled={!isFormValid()}>
            미리보기
          </TabsTrigger>
        </TabsList>

        <TabsContent value="edit" className="space-y-4">
          {questionAnswerPairs.map((pair, index) => (
            <div key={pair.id} className="p-4 border rounded-lg bg-gray-50">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">질문 {index + 1}</h4>
                {questionAnswerPairs.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                    onClick={() => removeQuestionAnswerPair(pair.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="space-y-3">
                <div>
                  <Label htmlFor={`question-${pair.id}`} className="mb-1 block text-sm">
                    질문
                  </Label>
                  <Input
                    id={`question-${pair.id}`}
                    value={pair.question}
                    onChange={(e) => updateQuestionAnswerPair(pair.id, "question", e.target.value)}
                    placeholder="예: 본인의 강점과 약점을 설명해주세요."
                  />
                </div>
                <div>
                  <Label htmlFor={`answer-${pair.id}`} className="mb-1 block text-sm">
                    답변
                  </Label>
                  <Textarea
                    id={`answer-${pair.id}`}
                    value={pair.answer}
                    onChange={(e) => updateQuestionAnswerPair(pair.id, "answer", e.target.value)}
                    placeholder="답변을 입력하세요..."
                    rows={4}
                  />
                </div>
              </div>
            </div>
          ))}
          <Button variant="outline" className="w-full border-dashed" onClick={addQuestionAnswerPair}>
            <Plus className="mr-2 h-4 w-4" /> 질문 추가
          </Button>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold mb-6">{coverLetterTitle}</h2>
              {questionAnswerPairs.map((pair, index) => (
                <div key={pair.id} className="mb-8">
                  <h3 className="font-medium text-lg mb-2">{pair.question}</h3>
                  <p className="text-gray-700 whitespace-pre-line">{pair.answer}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          <div className="text-right">
            <Button variant="outline" onClick={() => setActiveTab("edit")} className="gap-2">
              계속 편집하기
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          취소
        </Button>
        <Button className="bg-[#8FD694] hover:bg-[#7ac47f] text-white" onClick={handleSubmit} disabled={!isFormValid()}>
          저장
        </Button>
      </div>
    </div>
  )
}
