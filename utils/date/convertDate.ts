export const convertDate = (date: string) => {
  const dateObj = new Date(date);
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();

  // 현재 시간과 비교해서 오늘 날짜면 몇시간 전, 몇분 전, 몇초전 표시
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - dateObj.getTime());
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffTime / (1000 * 60));
  const diffSeconds = Math.floor(diffTime / 1000);

  if (diffSeconds < 60) {
    return `${diffSeconds}초 전`;
  } else if (diffMinutes < 60) {
    return `${diffMinutes}분 전`;
  } else if (diffHours < 24) {
    return `${diffHours}시간 전`;
  }

  return `${year}년 ${month}월 ${day}일`;
};
