"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, MoreVertical, Trash2, Edit, Download, FileText, Search, Filter } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CoverLetterForm } from "@/components/cover-letter-form"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CommunityLayout } from "@/components/community-layout"
import { HeaderWithNotifications } from '@/components/header-with-notifications'

export default function WorkspacePage() {
  const [activeTab, setActiveTab] = useState("resume")
  const [coverLetterType, setCoverLetterType] = useState<"file" | "manual">("file")
  const [coverLetterTitle, setCoverLetterTitle] = useState("")
  const [questionAnswerPairs, setQuestionAnswerPairs] = useState([{ id: 1, question: "", answer: "" }])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")

  // Mock data for resumes and cover letters
  const resumes = [
    { id: 1, name: "신입 개발자 이력서.pdf", date: "2023-05-15", size: "1.2MB", type: "resume" },
    { id: 2, name: "포트폴리오_2023.pdf", date: "2023-04-22", size: "3.5MB", type: "resume" },
    { id: 3, name: "경력기술서_최종.docx", date: "2023-03-10", size: "890KB", type: "resume" },
  ]

  const coverLetters = [
    {
      id: 1,
      name: "삼성전자 자기소개서.pdf",
      date: "2023-05-10",
      size: "520KB",
      type: "file",
      category: "coverLetter",
    },
    {
      id: 2,
      name: "네이버 지원 자소서.docx",
      date: "2023-04-18",
      size: "450KB",
      type: "file",
      category: "coverLetter",
    },
    { id: 3, name: "카카오 인턴십 자소서", date: "2023-03-05", type: "manual", questions: 4, category: "coverLetter" },
    {
      id: 4,
      name: "현대자동차 공채 지원서.pdf",
      date: "2023-02-20",
      size: "410KB",
      type: "file",
      category: "coverLetter",
    },
  ]

  const addQuestionAnswerPair = () => {
    setQuestionAnswerPairs([...questionAnswerPairs, { id: questionAnswerPairs.length + 1, question: "", answer: "" }])
  }

  const removeQuestionAnswerPair = (id: number) => {
    if (questionAnswerPairs.length > 1) {
      setQuestionAnswerPairs(questionAnswerPairs.filter((pair) => pair.id !== id))
    }
  }

  const updateQuestionAnswerPair = (id: number, field: "question" | "answer", value: string) => {
    setQuestionAnswerPairs(questionAnswerPairs.map((pair) => (pair.id === id ? { ...pair, [field]: value } : pair)))
  }

  // Filter documents based on search and type
  const filteredDocuments = [...resumes, ...coverLetters].filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType =
      typeFilter === "all" ||
      (typeFilter === "resume" && "type" in doc && doc.type === "resume") ||
      (typeFilter === "coverLetter" && "category" in doc && doc.category === "coverLetter")
    return matchesSearch && matchesType
  })

  return (
    <>
      <HeaderWithNotifications />
      <CommunityLayout activeItem="documents">
        <div className="p-6 max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-2xl font-bold">이력서 / 자소서 관리</h1>
              <p className="text-gray-600 mt-1">이력서와 자기소개서를 관리하고 면접에 활용하세요.</p>
            </div>
            <div className="flex space-x-2">
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="text-sm">
                    <Plus className="mr-2 h-4 w-4" /> 자소서 추가
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>자기소개서 추가</DialogTitle>
                    <DialogDescription>질문과 답변을 직접 입력하세요.</DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <CoverLetterForm
                      onSubmit={(data) => {
                        console.log("Form submitted:", data)
                        // 실제 저장 로직은 여기에 구현
                        setDialogOpen(false)
                      }}
                      onCancel={() => setDialogOpen(false)}
                    />
                  </div>
                </DialogContent>
              </Dialog>
              <Button variant="outline" className="text-sm">
                <Plus className="mr-2 h-4 w-4" /> 이력서 업로드
              </Button>
              <Button
                className="bg-[#8FD694] hover:bg-[#7ac47f] text-white"
                onClick={() => (window.location.href = "/workspace/interview/start")}
              >
                <Plus className="mr-2 h-4 w-4" /> 새 면접 시작
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="문서 검색"
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500 mr-2">필터:</span>
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[150px] h-9">
                    <SelectValue placeholder="문서 유형" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">모든 문서</SelectItem>
                    <SelectItem value="resume">이력서</SelectItem>
                    <SelectItem value="coverLetter">자기소개서</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Documents Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocuments.length > 0 ? (
              filteredDocuments.map((doc) => (
                <Card key={doc.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <Badge
                        className={
                          "type" in doc && doc.type === "resume"
                            ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                            : "bg-purple-100 text-purple-800 hover:bg-purple-100"
                        }
                      >
                        {"type" in doc && doc.type === "resume" ? "이력서" : "자기소개서"}
                      </Badge>
                      <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
                        {"type" in doc && doc.type === "manual" ? "직접 입력" : "파일"}
                      </Badge>
                    </div>
                    <div className="flex items-center mb-3">
                      <FileText className="h-5 w-5 text-gray-400 mr-2" />
                      <h3 className="font-medium text-lg line-clamp-1">{doc.name}</h3>
                    </div>
                    <div className="text-sm text-gray-500">
                      <p>마지막 수정: {doc.date}</p>
                      {"size" in doc && <p>크기: {doc.size}</p>}
                      {"questions" in doc && <p>질문 수: {doc.questions}개</p>}
                    </div>
                  </CardContent>
                  <CardFooter className="px-5 py-3 border-t bg-gray-50 flex justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {"type" in doc && doc.type === "file" ? (
                          <DropdownMenuItem className="flex items-center">
                            <Download className="mr-2 h-4 w-4" />
                            <span>다운로드</span>
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem className="flex items-center">
                            <FileText className="mr-2 h-4 w-4" />
                            <span>상세 보기</span>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="flex items-center">
                          <Edit className="mr-2 h-4 w-4" />
                          <span>수정</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>삭제</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="text-lg font-medium mb-1">문서가 없습니다</p>
                <p className="mb-4">새 이력서나 자기소개서를 추가해보세요.</p>
                <div className="flex justify-center space-x-2">
                  <Button variant="outline">
                    <Plus className="mr-2 h-4 w-4" /> 이력서 업로드
                  </Button>
                  <Button variant="outline" onClick={() => setDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> 자소서 추가
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CommunityLayout>
    </>
  )
}
