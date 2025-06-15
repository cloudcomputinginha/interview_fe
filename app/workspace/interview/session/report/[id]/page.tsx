"use client"

import { use } from 'react'
import { CheckCircle, MessageSquareQuote, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { terminateInterview } from '@/api/interview'
import { useMutation } from '@tanstack/react-query'

const result = {
    "interviewId": "1",
    "memberInterviewId": "1",
    "sessionId": "sess_1e1cfd6a",
    "member": {
        "name": "홍길동",
        "profileImage": "https://randomuser.me/api/portraits/men/32.jpg",
    },
    "cursor": {
        "q_idx": 5,
        "f_idx": -1
    },
    "videoPath": null,
    "questionLength": 5,
    "qaFlow": [
        {
            "question": "디자인 프로세스를 어떻게 진행하나요?",
            "audioPath": "sess_1e1cfd6a_0.mp3",
            "answer": "{\"answer\":\"아주 잘 진행합니다.\"}",
            "followUpLength": 2,
            "followUps": [
                {
                    "question": "디자인 프로세스 중 가장 중요하다고 생각하는 단계는 무엇인가요?",
                    "audioPath": "sess_1e1cfd6a_0_0.mp3",
                    "answer": "{\"answer\":\"없습니다.\"}"
                },
                {
                    "question": "프로세스를 진행하면서 가장 어려웠던 점은 무엇이었나요?",
                    "audioPath": "sess_1e1cfd6a_0_1.mp3",
                    "answer": "{\"answer\":\"없습니다.\"}"
                }
            ],
            "feedback": "제공된 답변은 디자인 프로세스에 대한 구체적인 설명이 부족합니다. 디자인 프로세스의 각 단계와 그 중요성, 어려웠던 점 등을 상세히 설명하지 않고 단답형으로 답변하였습니다. 면접관은 디자인 프로세스에 대한 지식과 경험을 파악하고자 하는데, 이런 간단한 답변으로는 부족합니다. 디자인 프로세스의 세부 단계, 각 단계의 역할과 중요성, 실제 경험에서 어려웠던 점 등을 구체적으로 설명할 필요가 있습니다."
        },
        {
            "question": "어려웠던 디자인 프로젝트와 그 극복 과정은 무엇인가요?",
            "audioPath": "sess_1e1cfd6a_1.mp3",
            "answer": "{\"answer\":\"없습니다.\"}",
            "followUpLength": 2,
            "followUps": [
                {
                    "question": "그 프로젝트에서 어떤 어려움이 있었나요?",
                    "audioPath": "sess_1e1cfd6a_1_0.mp3",
                    "answer": "{\"answer\":\"없습니다.\"}"
                },
                {
                    "question": "극복하는 과정에서 어떤 교훈을 얻었나요?",
                    "audioPath": "sess_1e1cfd6a_1_1.mp3",
                    "answer": "{\"answer\":\"없습니다.\"}"
                }
            ],
            "feedback": "답변이 매우 부족합니다. 지원자는 어려웠던 실제 디자인 프로젝트 사례를 제시하고, 그 프로젝트에서 경험한 구체적인 어려움과 극복 과정, 배운 교훈을 상세히 설명해야 합니다. 단순히 \"없습니다\"라고 답변하는 것은 문제 해결 능력과 디자인 경험을 보여주지 못합니다. 지원자는 자신의 디자인 역량을 보여줄 수 있는 실제 사례를 준비해야 하며, 그 과정에서 배운 점을 명확히 언급해야 합니다."
        },
        {
            "question": "디자인 트렌드를 어떻게 파악하고 반영하나요?",
            "audioPath": "sess_1e1cfd6a_2.mp3",
            "answer": "{\"answer\":\"반영하지 않습니다.\"}",
            "followUpLength": 2,
            "followUps": [
                {
                    "question": "어떤 디자인 트렌드가 가장 영향력 있다고 생각하시나요?",
                    "audioPath": "sess_1e1cfd6a_2_0.mp3",
                    "answer": "{\"answer\":\"제가 만든 디자인이 가장 영향력이 있습니다.\"}"
                },
                {
                    "question": "디자인 트렌드를 반영할 때 고객의 니즈와 어떻게 균형을 맞추시나요?",
                    "audioPath": "sess_1e1cfd6a_2_1.mp3",
                    "answer": "{\"answer\":\"저만의 길을 따라갑니다.\"}"
                }
            ],
            "feedback": "면접자의 응답은 디자인 트렌드와 고객 니즈를 무시하고 있습니다. 이는 디자이너로서 바람직하지 않은 태도입니다. 디자인은 고객의 요구사항과 트렌드를 반영하여 최선의 결과물을 만들어내는 것이 중요합니다. 디자이너 개인의 스타일만을 고집하는 것은 고객 만족도를 떨어뜨릴 수 있습니다. 디자이너는 열린 자세로 트렌드를 수용하고 고객의 니즈를 이해하려는 노력이 필요합니다. 또한 자신만의 독창성을 발휘하여 트렌드와 고객 니즈를 균형있게 반영한 디자인을 제시해야 합니다."
        },
        {
            "question": "디자인 의사소통을 위해 어떤 노력을 하나요?",
            "audioPath": "sess_1e1cfd6a_3.mp3",
            "answer": "{\"answer\":\"의사소통하지 않습니다.\"}",
            "followUpLength": 2,
            "followUps": [
                {
                    "question": "디자인 의사소통을 위해 어떤 도구나 기술을 활용하시나요?",
                    "audioPath": "sess_1e1cfd6a_3_0.mp3",
                    "answer": "{\"answer\":\"노션을 사용하고 있습니다.\"}"
                },
                {
                    "question": "디자인 의사소통 시 가장 어려운 점은 무엇인가요?",
                    "audioPath": "sess_1e1cfd6a_3_1.mp3",
                    "answer": "{\"answer\":\"없습니다.\"}"
                }
            ],
            "feedback": "디자인 의사소통에 대한 지원자의 대답은 상당히 부족합니다. 의사소통의 중요성과 어려움에 대한 인식이 부족해 보입니다. 좋은 디자인 의사소통을 위해서는 효과적인 도구와 프로세스뿐만 아니라 팀원 간의 이해와 소통 능력이 중요합니다. 디자인 의사소통의 어려움으로는 시각적 요소와 개념을 명확히 전달하는 것, 다양한 배경을 가진 이해관계자들의 요구를 조율하는 것 등이 있습니다. 지원자는 디자인 의사소통의 본질과 중요성에 대한 이해가 부족한 것으로 보입니다."
        },
        {
            "question": "디자인 분야에서 가장 큰 영감을 얻는 곳은 어디인가요?",
            "audioPath": "sess_1e1cfd6a_4.mp3",
            "answer": "{\"answer\":\"없습니다.\"}",
            "followUpLength": 2,
            "followUps": [
                {
                    "question": "디자인 분야에서 영감을 얻기 위해 어떤 활동을 하시나요?",
                    "audioPath": "sess_1e1cfd6a_4_0.mp3",
                    "answer": "{\"answer\":\"안합니다.\"}"
                },
                {
                    "question": "디자인 영감을 얻는 과정에서 어려운 점은 무엇인가요?",
                    "audioPath": "sess_1e1cfd6a_4_1.mp3",
                    "answer": "{\"answer\":\"없습니다.\"}"
                }
            ],
            "feedback": "응답이 매우 부정적이고 비생산적입니다. 디자인 영감을 얻는 과정에 대해 열정적으로 대화하지 않고 단호하게 거부하는 태도는 바람직하지 않습니다. 디자이너로서 영감을 얻는 활동과 과정을 공유하고, 어려운 점이 있다면 극복 방안을 제시하는 것이 좋습니다. 면접관의 질문에 열린 자세로 임하고 긍정적인 태도를 보이는 것이 중요합니다."
        }
    ],
    "finalReport": "이 지원자의 답변은 매우 부족합니다. 디자인 프로세스나 방법론에 대한 이해가 전혀 없으며, 어려웠던 프로젝트 경험이나 극복 과정, 디자인 트렌드 반영 방식 등 실무 경험을 보여주지 못했습니다. 또한 디자인 의사소통 노력이나 도구 활용, 영감을 얻는 방법에 대해서도 무성의한 답변을 했습니다. 전반적으로 디자이너로서의 자질이나 열정, 실력을 엿볼 수 없는 수준으로, 이 지원자에 대해서는 부적격 평가를 내리겠습니다."
}

// 조회 페이지

export default function ReportPage({ params }: { params: Promise<{ id: string }> }) {

    // Param으로 넘겨줄 때 interviewId, memberInterviewId, sessionId 순으로 넘겨줌

    const { id: ids } = use(params);

    const [interviewId, memberInterviewId, sessionId] = ids.split("_");

    const router = useRouter();

    // const { data: interviewData, isError, error } = useQuery({
    //     queryKey: ['interview', sessionId],
    //     queryFn: () => aiFetch.get(`/interview/session/${sessionId}`),
    //     enabled: !!sessionId,
    //     onError: (error: any) => {
    //         if (error.response.status === 404) {
    //             alert("면접 세션을 찾을 수 없습니다.")
    //             router.replace("/workspace/interviews")
    //         }
    //     }
    // })

    const { mutateAsync: endInterview } = useMutation({
        mutationFn: () => terminateInterview(Number(interviewId), {
            endedAt: new Date().toISOString()
        })
    })

    const closeInterview = async () => {
        if (confirm("면접을 종료하시겠습니까?")) {
            if (memberInterviewId) {
                await endInterview();
            }
            router.replace("/workspace/interviews")
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto p-6">
                {/* 멤버 정보 및 인사 멘트 */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 rounded-full mb-2 border border-gray-200 bg-white flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-[#8FD694]" />
                    </div>
                    <div className="text-lg font-semibold text-gray-800 mb-1">수고하셨습니다, {result.member.name}님!</div>
                </div>
                {/* 최종 평가 */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8 text-center">
                    <div className="flex flex-col items-center mb-2">
                        <CheckCircle className="h-8 w-8 text-[#8FD694] mb-2" />
                        <h2 className="text-2xl font-bold mb-2">최종 평가</h2>
                    </div>
                    <p className="text-gray-700 text-base leading-relaxed max-w-2xl mx-auto">{result.finalReport}</p>
                </div>

                {/* 질문별 피드백 */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-4">질문별 피드백</h2>
                    <div className="space-y-6">
                        {result.qaFlow.map((qa, idx) => (
                            <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                                <div className="flex items-center mb-2">
                                    <MessageSquareQuote className="h-5 w-5 text-[#8FD694] mr-2" />
                                    <span className="font-medium text-lg text-gray-900">Q{idx + 1}. {qa.question}</span>
                                </div>
                                <div className="ml-7 mb-1 text-gray-700">
                                    <span className="font-semibold">답변:</span> {JSON.parse(qa.answer).answer}
                                </div>
                                {qa.followUps && qa.followUps.length > 0 && (
                                    <div className="ml-7 mb-2 space-y-1">
                                        {qa.followUps.map((fu, fidx) => (
                                            <div key={fidx} className="pl-4 border-l-2 border-[#8FD694] text-gray-600 text-sm">
                                                <span className="font-semibold">└ 추가질문:</span> {fu.question}<br />
                                                <span className="font-semibold">└ 답변:</span> {JSON.parse(fu.answer).answer}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div className="ml-7 mt-2 text-gray-500 text-sm">
                                    <span className="font-semibold">피드백:</span> {qa.feedback}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* 면접 종료하기 버튼 */}
                <div className="flex justify-center mt-10 mb-4">
                    <div>

                    </div>
                    <Button
                        className="bg-[#8FD694] hover:bg-[#7ac47f] text-white px-8 py-2 text-base font-semibold"
                        onClick={closeInterview}
                    >
                        면접 종료하기
                    </Button>
                </div>
            </div>
        </div>
    )
}
