"use client"

import { useState, use as usePromise } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Info } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useQuery, useMutation } from '@tanstack/react-query'
import { getGroupInterviewDetail } from '@/api/interview'
import { getResumeList } from '@/api/resume'
import { findMyCoverletter } from '@/api/coverletter'
import { createMemberInterview } from '@/api/interview'
import { useMemberSession } from '@/components/member-session-context'

export default function JoinGroupInterviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: postId } = usePromise(params)
  const { memberId } = useMemberSession()
  const [selectedResume, setSelectedResume] = useState("")
  const [selectedCoverLetter, setSelectedCoverLetter] = useState("")

  // 면접 상세정보
  const { data: interviewData, isLoading: interviewLoading, error: interviewError } =
    useQuery({
      queryKey: ['groupInterviewDetail', postId],
      queryFn: () => getGroupInterviewDetail(Number(postId)),
    })
  const post = interviewData?.result

  // 이력서 리스트
  const { data: resumeData, isLoading: resumeLoading, error: resumeError } =
    useQuery({
      queryKey: ['resumeList', memberId],
      queryFn: () => getResumeList(memberId!),
      enabled: !!memberId,
    })
  const resumes = resumeData?.result?.resumes || []

  // 자기소개서 리스트
  const { data: coverletterData, isLoading: coverletterLoading, error: coverletterError } =
    useQuery({
      queryKey: ['coverletterList', memberId],
      queryFn: () => findMyCoverletter(memberId!),
      enabled: !!memberId,
    })
  const coverLetters = coverletterData?.result?.coverletters || []

  // 본인 신청 여부 확인
  const isAlreadyApplied = post?.groupInterviewParticipants?.some(
    (p) => p.memberId === memberId
  )

  // 신청 mutation
  const mutation = useMutation({
    mutationFn: async () => {
      if (!memberId) throw new Error('로그인이 필요합니다.')
      if (!selectedResume || !selectedCoverLetter) throw new Error('이력서와 자기소개서를 모두 선택해주세요.')
      return createMemberInterview(Number(postId), {
        memberId,
        resumeId: Number(selectedResume),
        coverletterId: Number(selectedCoverLetter),
      })
    },
    onSuccess: () => {
      alert('면접 참여 신청이 완료되었습니다. 면접은 예정된 시간에 자동으로 시작됩니다.')
      window.location.href = `/workspace/interview/group/community/${postId}`
    },
    onError: (err: any) => {
      alert(err?.message || '면접 참여 신청에 실패했습니다.')
    },
  })

  // 로딩/에러 처리
  if (interviewLoading || resumeLoading || coverletterLoading)
    return <div className="p-10 text-center">로딩 중...</div>
  if (interviewError || resumeError || coverletterError)
    return <div className="p-10 text-center text-red-500">데이터를 불러오지 못했습니다.</div>
  if (!post) return <div className="p-10 text-center text-red-500">면접 정보를 찾을 수 없습니다.</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/workspace/interview/group/community/${postId}`}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> 모집글로 돌아가기
          </Link>
          <h1 className="text-2xl font-bold">면접 참여 신청</h1>
          <p className="text-gray-600 mt-2">{post.name}</p>
        </div>

        {/* Main Content */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>면접 자료 선택</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-700">면접 참여 안내</h3>
                  <p className="text-blue-600 text-sm mt-1">
                    면접에 사용할 이력서와 자기소개서를 선택해주세요. 면접은 {post.startedAt && new Date(post.startedAt).toLocaleString('ko-KR')}에 자동으로 시작됩니다.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">면접 정보</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">면접 제목</span>
                    <span className="text-sm font-medium">{post.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">면접 일시</span>
                    <span className="text-sm font-medium">{post.startedAt && new Date(post.startedAt).toLocaleString('ko-KR')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">호스트</span>
                    <span className="text-sm font-medium">{post.hostName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">참가자</span>
                    <span className="text-sm font-medium">
                      {post.currentParticipants}/{post.maxParticipants}명
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">이력서 선택</Label>
                  <Select value={selectedResume} onValueChange={setSelectedResume}>
                    <SelectTrigger>
                      <SelectValue placeholder="이력서를 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {resumes.length === 0 ? (
                        <SelectItem value="" disabled>이력서가 없습니다</SelectItem>
                      ) : (
                        resumes.map((resume) => (
                          <SelectItem key={resume.resumeId} value={String(resume.resumeId)}>
                            {resume.fileName}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">자기소개서 선택</Label>
                  <Select value={selectedCoverLetter} onValueChange={setSelectedCoverLetter}>
                    <SelectTrigger>
                      <SelectValue placeholder="자기소개서를 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {coverLetters.length === 0 ? (
                        <SelectItem value="" disabled>자기소개서가 없습니다</SelectItem>
                      ) : (
                        coverLetters.map((letter) => (
                          <SelectItem key={letter.coverletterId} value={String(letter.coverletterId)}>
                            {letter.corporateName} {letter.jobName}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => window.history.back()}>
              취소
            </Button>
            <div className="mt-8 flex justify-end">
              {isAlreadyApplied ? (
                <Button
                  className="bg-[#8FD694] hover:bg-[#7ac47f] text-white"
                  onClick={() => alert('자료 수정 기능은 추후 지원됩니다.')}
                >
                  자료 수정
                </Button>
              ) : (
                <Button
                  className="bg-[#8FD694] hover:bg-[#7ac47f] text-white"
                  onClick={() => mutation.mutate()}
                  disabled={!selectedResume || !selectedCoverLetter || mutation.status === 'pending'}
                >
                  {mutation.status === 'pending' ? '신청 중...' : '면접 참여 신청'}
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>

        <div className="text-center text-sm text-gray-500">
          <p>
            면접 참여 신청 후에도 면접 시작 전까지 이력서와 자기소개서를 변경할 수 있습니다. 면접 시작 10분 전부터
            대기실에 입장할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  )
}
