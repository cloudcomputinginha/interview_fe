export const convertDate = (raw: string | Date): string => {
  /** 1) 파싱 및 유효성 검사 */
  const utcDate = raw instanceof Date ? raw : new Date(raw);
  if (isNaN(utcDate.getTime())) return ""; // 잘못된 입력이면 빈 문자열 반환

  /** 2) KST(UTC+9)로 보정 */
  const KST_OFFSET = 9 * 60 * 60 * 1000; // 9h in ms
  const kstDate = new Date(utcDate.getTime());
  const nowKst = new Date(Date.now() + KST_OFFSET);

  /** 3) 상대 시간 계산 (KST 기준) */
  const diffSec = Math.floor((nowKst.getTime() - kstDate.getTime()) / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);

  if (diffSec < 60) return `${diffSec}초 전`;
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHr < 24) return `${diffHr}시간 전`;

  /** 4) 절대 날짜(YYYY년 M월 D일) */
  return `${kstDate.getFullYear()}년 ${
    kstDate.getMonth() + 1
  }월 ${kstDate.getDate()}일`;
};
