"use client"

import type React from "react"

import { useState } from "react"
import { useInterviewWizard } from "../InterviewWizardContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, X, Mail, Users } from "lucide-react"

export function ParticipantInviteStep() {
  const { state, setState } = useInterviewWizard()
  const [newEmail, setNewEmail] = useState("")
  const [emailError, setEmailError] = useState("")

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const addParticipant = () => {
    if (!newEmail.trim()) {
      setEmailError("이메일을 입력해주세요.")
      return
    }

    if (!validateEmail(newEmail)) {
      setEmailError("올바른 이메일 형식이 아닙니다.")
      return
    }

    const participants = state.participants || []
    if (participants.some((p) => p.email === newEmail)) {
      setEmailError("이미 추가된 이메일입니다.")
      return
    }

    if (participants.length >= (state.maxParticipants || 5) - 1) {
      setEmailError(`최대 ${(state.maxParticipants || 5) - 1}명까지 초대할 수 있습니다.`)
      return
    }

    setState({
      participants: [...participants, { email: newEmail }],
    })
    setNewEmail("")
    setEmailError("")
  }

  const removeParticipant = (emailToRemove: string) => {
    const participants = state.participants || []
    setState({
      participants: participants.filter((p) => p.email !== emailToRemove),
    })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addParticipant()
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold mb-2">참가자를 초대해주세요</h2>
        <p className="text-gray-600">그룹 면접에 참여할 사람들의 이메일을 입력해주세요.</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-[#8FD694]" />
              <span className="font-medium">
                참가자 추가 ({(state.participants?.length || 0) + 1}/{state.maxParticipants}명)
              </span>
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  type="email"
                  placeholder="참가자 이메일을 입력해주세요"
                  value={newEmail}
                  onChange={(e) => {
                    setNewEmail(e.target.value)
                    setEmailError("")
                  }}
                  onKeyPress={handleKeyPress}
                  className={emailError ? "border-red-500" : ""}
                />
                {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
              </div>
              <Button onClick={addParticipant} className="bg-[#8FD694] hover:bg-[#7ac47f] text-white">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {state.participants && state.participants.length > 0 && (
              <div className="space-y-3 mt-6">
                <Label className="text-base font-medium">초대된 참가자</Label>
                <div className="space-y-2">
                  {state.participants.map((participant, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span>{participant.email}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeParticipant(participant.email)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-blue-50 p-4 rounded-lg mt-4">
              <p className="text-sm text-blue-800">💡 초대된 참가자들에게는 면접 시작 전에 이메일 알림이 발송됩니다.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
