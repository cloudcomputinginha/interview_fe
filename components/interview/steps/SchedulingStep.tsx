"use client"

import { useInterviewWizard } from "../InterviewWizardContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Play } from "lucide-react"
import { useState } from "react"

export function SchedulingStep() {
  const { state, setState } = useInterviewWizard()
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState<string>("")

  const handleDateTimeChange = () => {
    if (selectedDate && selectedTime) {
      const [hours, minutes] = selectedTime.split(":")
      const dateTime = new Date(selectedDate)
      dateTime.setHours(Number.parseInt(hours), Number.parseInt(minutes))

      if (state.interviewType === "individual") {
        setState({ startAt: dateTime.toISOString() })
      } else {
        setState({ scheduledAt: dateTime.toISOString() })
      }
    }
  }

  const timeSlots = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
  ]

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold mb-2">
          {state.interviewType === "individual" ? "면접 시작 옵션" : "면접 예약"}
        </h2>
        <p className="text-gray-600">
          {state.interviewType === "individual"
            ? "지금 시작하거나 예약할 시간을 선택해주세요."
            : "그룹 면접 일정을 선택해주세요."}
        </p>
      </div>

      {state.interviewType === "individual" && (
        <div className="space-y-4">
          <Label className="text-base font-medium">시작 옵션</Label>
          <div className="grid md:grid-cols-2 gap-4">
            <Card
              className={`cursor-pointer transition-all hover:shadow-md ${
                state.startType === "now" ? "ring-2 ring-[#8FD694] bg-green-50" : "hover:bg-gray-50"
              }`}
              onClick={() => setState({ startType: "now" })}
            >
              <CardContent className="p-6 text-center">
                <Play className="h-8 w-8 mx-auto mb-3 text-[#8FD694]" />
                <h3 className="font-semibold mb-2">지금 시작</h3>
                <p className="text-sm text-gray-600">바로 면접을 시작합니다</p>
              </CardContent>
            </Card>

            <Card
              className={`cursor-pointer transition-all hover:shadow-md ${
                state.startType === "scheduled" ? "ring-2 ring-[#8FD694] bg-green-50" : "hover:bg-gray-50"
              }`}
              onClick={() => setState({ startType: "scheduled" })}
            >
              <CardContent className="p-6 text-center">
                <CalendarIcon className="h-8 w-8 mx-auto mb-3 text-[#8FD694]" />
                <h3 className="font-semibold mb-2">예약하기</h3>
                <p className="text-sm text-gray-600">원하는 시간에 면접을 예약합니다</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {((state.interviewType === "individual" && state.startType === "scheduled") ||
        state.interviewType === "group") && (
        <div className="space-y-6">
          {state.interviewType === "group" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="sessionName">세션 이름</Label>
                <Input
                  id="sessionName"
                  value={state.sessionName || ""}
                  onChange={(e) => setState({ sessionName: e.target.value })}
                  placeholder="그룹 면접 세션 이름을 입력해주세요"
                />
              </div>

              <div>
                <Label htmlFor="maxParticipants">최대 참가자 수</Label>
                <Select
                  value={state.maxParticipants?.toString()}
                  onValueChange={(value) => setState({ maxParticipants: Number.parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="최대 참가자 수를 선택해주세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {[2, 3, 4, 5].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}명
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label className="text-base font-medium mb-3 block">날짜 선택</Label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date)
                  if (date && selectedTime) {
                    handleDateTimeChange()
                  }
                }}
                disabled={(date) => date < new Date()}
                className="rounded-md border"
              />
            </div>

            <div>
              <Label className="text-base font-medium mb-3 block">시간 선택</Label>
              <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                {timeSlots.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setSelectedTime(time)
                      if (selectedDate) {
                        handleDateTimeChange()
                      }
                    }}
                    className={selectedTime === time ? "bg-[#8FD694] hover:bg-[#7ac47f]" : ""}
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
