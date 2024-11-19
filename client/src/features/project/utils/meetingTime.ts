export function formatMeetingTime(meetingCreateTime: string): string {
    const date = new Date(meetingCreateTime);
  
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
    const dayName = dayNames[date.getDay()];
  
    const hours = date.getHours();
    const period = hours >= 12 ? "오후" : "오전";
    const formattedHours = (hours % 12 || 12).toString(); // 12시간제로 변환
    const minutes = date.getMinutes().toString().padStart(2, '0');
  
    return `${month}.${day} (${dayName}) ${period} ${formattedHours}:${minutes}`;
  }

  export function formatMeetingDuration(totalSeconds: number): string {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    // 조건에 따라 포맷팅
    if (minutes === 0) {
        return `${seconds}초`;
    } else {
        return `${minutes}분 ${seconds}초`;
    }
}