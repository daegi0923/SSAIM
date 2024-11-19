import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import styles from './WeekCalendar.module.css';

interface WeekCalendarProps {
  selectedDate?: Date; // 선택적 프로퍼티로 변경
  onDateChange: (dateInfo: { checkDate: string; startDate: string; endDate: string }) => void;
}

const getMonday = (date: Date): Date => {
  const day = date.getDay();
  const difference = day === 0 ? -6 : 1 - day; // Adjust for Sunday (0) as start of the week
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + difference);
};

const getFriday = (date: Date): Date => {
  const monday = getMonday(date);
  return new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 4); // Friday is 4 days after Monday
};

const WeekCalendar: React.FC<WeekCalendarProps> = ({ selectedDate, onDateChange }) => {
  const [date, setDate] = useState<Date>(selectedDate || new Date()); // selectedDate가 없으면 오늘 날짜로 초기화

  // selectedDate가 변경될 때마다 날짜를 다시 설정
  useEffect(() => {
    if (selectedDate) {
      setDate(selectedDate); // selectedDate가 있을 경우 해당 날짜로 상태 업데이트
    }
  }, [selectedDate]);

  // 컴포넌트가 마운트될 때 오늘 날짜를 클릭한 것처럼 처리
  useEffect(() => {
    handleDateChange(new Date()); // 오늘 날짜를 자동으로 선택
  }, []); // 빈 배열을 넣어 컴포넌트 마운트 시 한 번만 실행되도록 설정

  const weekStart = getMonday(date);

  const handleDateChange = (date: Date) => {
    const monday = getMonday(date);
    const friday = getFriday(date);
    const dateInfo = {
      checkDate: moment(date).format('YYYY-MM-DD'),
      startDate: moment(monday).format('YYYY-MM-DD'),
      endDate: moment(friday).format('YYYY-MM-DD'),
    };

    setDate(date); // 새로운 날짜로 상태 업데이트
    onDateChange(dateInfo);
  };

  // 주말(토요일, 일요일) 비활성화
  const disableWeekends = ({ date }: { date: Date }) => {
    const day = date.getDay();
    return day === 0 || day === 6; // 일요일(0) 또는 토요일(6)일 경우 비활성화
  };

  return (
    <div className={styles.calendarWrapper}>
      <Calendar
        onChange={(date) => handleDateChange(date as Date)}
        value={date}  // state에서 관리하는 날짜 사용
        formatDay={(_, date) => moment(date).format('D')}
        formatYear={(_, date) => moment(date).format('YYYY')}
        calendarType="gregory"
        showNeighboringMonth={false}
        next2Label={null}
        prev2Label={null}
        minDetail="year"
        className={styles.customCalendar}
        tileDisabled={disableWeekends} // 주말 비활성화 함수 추가
        tileClassName={({ date }) => {
          const dayOfWeek = date.getDay();
          const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5; // 월~금
          const isCurrentWeek = moment(date).isSame(weekStart, 'week'); // 현재 주의 모든 평일 확인
          
          // 특정 날짜에 따라 스타일을 직접 적용합니다
          if (isWeekday && isCurrentWeek) {
            return `${styles.weekdayTile} ${date.getTime() === date.getTime() ? styles.activeTile : ''}`;
          }
          return '';
        }}
      />
    </div>
  );
};

export default WeekCalendar;
