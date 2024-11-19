import { startOfMonth, startOfWeek, differenceInCalendarWeeks, format } from 'date-fns';

export const dateToWeek = (date: Date | string) => {
  if (typeof date === 'string') {
    date = new Date(date); // 문자열일 경우 Date 객체로 변환
  }

  const startOfMonthDate = startOfMonth(date);
  const adjustedStartOfMonth = startOfWeek(startOfMonthDate, { weekStartsOn: 1 }); // 월요일 시작으로 설정
  const weekNumber = differenceInCalendarWeeks(date, adjustedStartOfMonth)+1;

  return `${format(date, 'yyyy년 M월')} ${weekNumber}주차`;
};
