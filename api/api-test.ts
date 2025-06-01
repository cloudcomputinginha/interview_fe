import { getPresignedUploadUrl, saveResume } from "./resume";
import {
  createCoverletter,
  getCoverletterDetail,
  findMyCoverletter,
} from "./coverletter";
import {
  createMemberInterview,
  changeParticipantsStatus,
  terminateInterview,
} from "./interview";
import { generateInterviewQuestions } from "./ai-interview";

async function testApis() {
  try {
    // 1. 이력서 presigned url 발급
    const presigned = await getPresignedUploadUrl("test.pdf");
    console.log("presigned:", presigned);

    // 2. 이력서 메타데이터 저장
    const resumeResult = await saveResume({
      memberId: 1,
      fileName: "test.pdf",
      fileUrl: "https://example.com/test.pdf",
      fileSize: 12345,
    });
    console.log("resumeResult:", resumeResult);

    // 3. 자기소개서 생성
    const coverletterResult = await createCoverletter({
      memberId: 1,
      corporateName: "회사",
      jobName: "직무",
      qnaDTOList: [{ question: "Q1", answer: "A1" }],
    });
    console.log("coverletterResult:", coverletterResult);

    // 4. 자기소개서 상세 조회
    const coverletterDetail = await getCoverletterDetail(1);
    console.log("coverletterDetail:", coverletterDetail);

    // 5. 내 자기소개서 리스트 조회
    const myCoverletters = await findMyCoverletter(1);
    console.log("myCoverletters:", myCoverletters);

    // 6. 면접 참여 신청
    const interviewResult = await createMemberInterview(1, {
      memberId: 1,
      resumeId: 1,
      coverletterId: 1,
    });
    console.log("interviewResult:", interviewResult);

    // 7. 대기실 내 사용자 상태 변경
    const statusResult = await changeParticipantsStatus(1, {
      memberId: 1,
      status: "IN_PROGRESS",
    });
    console.log("statusResult:", statusResult);

    // 8. 면접 종료
    const endResult = await terminateInterview(1, {
      endedAt: new Date().toISOString(),
    });
    console.log("endResult:", endResult);

    // 9. AI 서버 인터뷰 질문 생성 (예시)
    const aiResult = await generateInterviewQuestions({
      prompt: "면접 질문 생성",
    });
    console.log("aiResult:", aiResult);
  } catch (err) {
    console.error("API 테스트 중 에러:", err);
  }
}

// 실제 테스트 시 아래 주석 해제
// testApis()
