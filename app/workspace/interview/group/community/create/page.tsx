"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function CreateInterviewPostPage() {
  const [title, setTitle] = useState("")
  const [field, setField] = useState("")
  const [maxParticipants, setMaxParticipants] = useState("3")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [type, setType] = useState("technical")
  const [description, setDescription] = useState("")
  const [visibility, setVisibility] = useState("private")
  const [tags, setTags] = useState("")
  const [thumbnail, setThumbnail] = useState<File | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!title || !field || !date || !time) {
      alert("필수 항목을 모두 입력해주세요.")
      return
    }

    // In a real app, you would send this data to your backend
    console.log({
      title,
      field,
      maxParticipants,
      date,
      time,
      type,
      description,
    })

    // Redirect to the community page
    window.location.href = "/workspace/interview/group/community"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/workspace/interview/group/community"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> 다대다 면접 모집으로 돌아가기
          </Link>
          <h1 className="text-2xl font-bold">모집 글 작성</h1>
          <p className="text-gray-600 mt-2">다대다 면접에 참여할 다른 취업 준비생을 모집해보세요.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>면접 정보 입력</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  면접 제목 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="예: 삼성전자 상반기 공채 대비 모의면접"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              {/* Field */}
              <div className="space-y-2">
                <Label htmlFor="field" className="text-sm font-medium">
                  희망 직무 <span className="text-red-500">*</span>
                </Label>
                <Select value={field} onValueChange={setField} required>
                  <SelectTrigger id="field">
                    <SelectValue placeholder="직무를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="개발">개발</SelectItem>
                    <SelectItem value="마케팅">마케팅</SelectItem>
                    <SelectItem value="금융">금융</SelectItem>
                    <SelectItem value="디자인">디자인</SelectItem>
                    <SelectItem value="영업">영업</SelectItem>
                    <SelectItem value="인사">인사</SelectItem>
                    <SelectItem value="공공기관">공공기관</SelectItem>
                    <SelectItem value="기타">기타</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Max Participants */}
              <div className="space-y-2">
                <Label htmlFor="maxParticipants" className="text-sm font-medium">
                  모집 인원 수 <span className="text-red-500">*</span>
                </Label>
                <Select value={maxParticipants} onValueChange={setMaxParticipants} required>
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

              {/* Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-sm font-medium">
                    면접 날짜 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time" className="text-sm font-medium">
                    면접 시간 <span className="text-red-500">*</span>
                  </Label>
                  <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
                </div>
              </div>

              {/* Interview Type */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  진행 방식 <span className="text-red-500">*</span>
                </Label>
                <RadioGroup value={type} onValueChange={setType} className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="technical" id="technical" />
                    <Label htmlFor="technical">기술 면접</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="personality" id="personality" />
                    <Label htmlFor="personality">인성 면접</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* 공개 설정 */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  공개 설정 <span className="text-red-500">*</span>
                </Label>
                <RadioGroup value={visibility} onValueChange={setVisibility} className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="public" id="public" />
                    <Label htmlFor="public">공개</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="private" id="private" />
                    <Label htmlFor="private">비공개</Label>
                  </div>
                </RadioGroup>
                <p className="text-xs text-gray-500">공개로 설정하면 모든 사용자가 검색하여 참여할 수 있습니다.</p>
              </div>

              {/* 공개 시 추가 설정 */}
              {visibility === "public" && (
                <div className="space-y-4 p-4 border rounded-md bg-gray-50">
                  <h3 className="font-medium">공개 설정</h3>

                  <div className="space-y-2">
                    <Label htmlFor="publicTitle" className="text-sm font-medium">
                      공개 제목 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="publicTitle"
                      placeholder="검색 결과에 표시될 제목을 입력하세요"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags" className="text-sm font-medium">
                      태그 (선택사항)
                    </Label>
                    <Input
                      id="tags"
                      placeholder="예: #개발 #신입 #기술면접"
                      onChange={(e) => setTags(e.target.value)}
                    />
                    <p className="text-xs text-gray-500">태그를 입력하면 검색 시 더 쉽게 찾을 수 있습니다.</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="thumbnail" className="text-sm font-medium">
                      썸네일 이미지 (선택사항)
                    </Label>
                    <Input
                      id="thumbnail"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setThumbnail(e.target.files ? e.target.files[0] : null)}
                    />
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  추가 설명 (선택사항)
                </Label>
                <Textarea
                  id="description"
                  placeholder="면접 진행 방식이나 준비 사항 등 추가 정보를 입력하세요."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => window.history.back()}>
                취소
              </Button>
              <Button className="bg-[#8FD694] hover:bg-[#7ac47f] text-white" type="submit">
                모집 시작하기
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  )
}
