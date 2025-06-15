"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Mail, Calendar, Clock, Users, Play } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CommunityLayout } from "@/components/community-layout"
import { HeaderWithNotifications } from "@/components/header-with-notifications"
import { getMyInterviewList } from '@/api/interview'
import { useQuery } from '@tanstack/react-query'
import { useMemberSession } from '@/components/member-session-context'
import { useRouter } from "next/navigation"
import { InterviewCardDTO, MyInterviewDTO, MyInterviewListDTO } from "@/api/types/interview-types"

export default function InterviewsPage() {
  const router = useRouter()
  const { memberId } = useMemberSession()
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [selectedInterview, setSelectedInterview] = useState<any>(null)
  const [inviteEmail, setInviteEmail] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [interviewToDelete, setInterviewToDelete] = useState<any>(null)

  const {
    data,
    isLoading: loading,
    error: queryError,
  } = useQuery({
    queryKey: ['myInterviewList', memberId],
    queryFn: () => getMyInterviewList(memberId!),
    enabled: !!memberId,
    select: (res) => res.result.myInterviews,
  })

  const interviews = data || []

  const handleInvite = (interview: any) => {
    setSelectedInterview(interview)
    setInviteDialogOpen(true)
  }

  const sendInvite = () => {
    if (!inviteEmail.trim()) {
      alert("이메일 주소를 입력해주세요.")
      return
    }

    alert(`${inviteEmail}로 초대 이메일이 성공적으로 발송되었습니다.`)
    setInviteEmail("")
    setInviteDialogOpen(false)
  }

  const handleDelete = (interview: any) => {
    setInterviewToDelete(interview)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    console.log("Deleting interview:", interviewToDelete)
    alert("면접이 성공적으로 삭제되었습니다.")
    setDeleteDialogOpen(false)
  }

  const handleStartInterview = ({
    interview,
    interviewFormat
  }: {
    interview: InterviewCardDTO,
    interviewFormat: 'GROUP' | 'INDIVIDUAL'
  }) => {
    if (interviewFormat === 'GROUP') {
      router.push(`/workspace/interview/group/waiting/${interview.interviewId}`)
    } else {
      router.push(`/workspace/interview/individual/waiting/${interview.interviewId}`)
    }
  }

  // Format date for display
  function formatDate(dateString: string) {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
    return new Date(dateString).toLocaleDateString("ko-KR", options)
  }

  if (loading) return <div className="p-6">로딩 중...</div>
  if (queryError) return <div className="p-6 text-red-500">{queryError instanceof Error ? queryError.message : '에러 발생'}</div>

  const upcomingInterviews = interviews.filter(
    (i) => i.memberInterviewStatusDTO.status === 'SCHEDULED' || i.memberInterviewStatusDTO.status === 'IN_PROGRESS'
  )
  const pastInterviews = interviews.filter(
    (i) => i.memberInterviewStatusDTO.status === 'DONE' || i.memberInterviewStatusDTO.status === 'NO_SHOW'
  )

  return (
    <>
      <HeaderWithNotifications />
      <CommunityLayout activeItem="home">
        <div className="p-6 max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold">내 면접 목록</h1>
              <p className="text-gray-600 mt-1">예정된 면접과 과거 면접 기록을 확인하세요.</p>
            </div>
            <Link href="/workspace/interview/start">
              <Button className="bg-[#8FD694] hover:bg-[#7ac47f] text-white">
                <Plus className="mr-2 h-4 w-4" /> 새 면접 만들기
              </Button>
            </Link>
          </div>

          {/* Upcoming Interviews */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">예정된 면접</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingInterviews.length === 0 && <div className="col-span-3 text-gray-400">예정된 면접이 없습니다.</div>}
              {upcomingInterviews.map(({ myInterviewCardDTO, interviewOptionPreviewDTO }) => (
                <Card key={myInterviewCardDTO.interviewId} className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <Badge
                        className={
                          interviewOptionPreviewDTO.interviewFormat === 'INDIVIDUAL'
                            ? 'bg-blue-100 text-blue-800 hover:bg-blue-100'
                            : 'bg-purple-100 text-purple-800 hover:bg-purple-100'
                        }
                      >
                        {interviewOptionPreviewDTO.interviewFormat === 'INDIVIDUAL' ? '개인 면접' : '그룹 면접'}
                      </Badge>
                      <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">{myInterviewCardDTO.corporateName}</Badge>
                    </div>
                    <h3 className="font-medium text-lg mb-2 line-clamp-2">{myInterviewCardDTO.name}</h3>
                    <div className="text-sm text-gray-600 mb-3">
                      <p>
                        {myInterviewCardDTO.corporateName} • {myInterviewCardDTO.jobName}
                      </p>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{formatDate(myInterviewCardDTO.startedAt)}</span>
                    </div>
                    {interviewOptionPreviewDTO.interviewFormat === 'GROUP' && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="h-4 w-4 mr-1" />
                        <span>
                          {myInterviewCardDTO.currentParticipants}/{myInterviewCardDTO.maxParticipants}명 참여 중
                        </span>
                      </div>
                    )}
                    {interviewOptionPreviewDTO.interviewFormat === 'INDIVIDUAL' && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="h-4 w-4 mr-1" />
                        <span>
                          개인
                        </span>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="px-5 py-3 border-t bg-gray-50 flex justify-between items-center">
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-1 text-gray-500" />
                      <span>예약됨</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        className="bg-[#8FD694] hover:bg-[#7ac47f] text-white"
                        onClick={() => handleStartInterview({
                          interview: myInterviewCardDTO,
                          interviewFormat: interviewOptionPreviewDTO.interviewFormat
                        })}
                      >
                        <Play className="h-4 w-4 mr-1" />
                        입장하기
                      </Button>
                      <Link href={`/workspace/interviews/edit/${myInterviewCardDTO.interviewId}`}>
                        <Button variant="outline" size="sm">
                          수정
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(myInterviewCardDTO)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>

          {/* Past Interviews */}
          <div>
            <h2 className="text-xl font-bold mb-4">과거 면접</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pastInterviews.length === 0 && <div className="col-span-3 text-gray-400">과거 면접이 없습니다.</div>}
              {pastInterviews.map(({ myInterviewCardDTO }) => (
                <Card key={myInterviewCardDTO.interviewId} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">과거 면접</Badge>
                    </div>
                    <h3 className="font-medium text-lg mb-2">{myInterviewCardDTO.name}</h3>
                    <div className="text-sm text-gray-600 mb-3">
                      <p>
                        {myInterviewCardDTO.corporateName} • {myInterviewCardDTO.jobName}
                      </p>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{myInterviewCardDTO.startedAt}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="px-5 py-3 border-t bg-gray-50 flex justify-end">
                    <Button variant="ghost" size="sm" className="text-[#8FD694] hover:text-[#7ac47f]">
                      결과 보기
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* 초대 다이얼로그 */}
        <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>면접 참가자 초대</DialogTitle>
              <DialogDescription>참가자의 이메일 주소를 입력하여 면접에 초대하세요.</DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="inviteEmail" className="text-sm font-medium">
                이메일 주소
              </Label>
              <Input
                id="inviteEmail"
                type="email"
                placeholder="example@email.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="mt-2"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>
                취소
              </Button>
              <Button className="bg-[#8FD694] hover:bg-[#7ac47f] text-white" onClick={sendInvite}>
                초대 보내기
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 삭제 확인 다이얼로그 */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>면접 삭제 확인</DialogTitle>
              <DialogDescription>정말로 이 면접을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                취소
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                삭제
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CommunityLayout>
    </>
  )
}
