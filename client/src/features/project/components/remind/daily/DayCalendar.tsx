import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import styles from './DayCalendar.module.css';

interface DayCalendarProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const DayCalendar: React.FC<DayCalendarProps> = ({ selectedDate, onDateChange }) => {
  // 주말(토요일, 일요일) 비활성화
  const disableWeekends = ({ date }: { date: Date }) => {
    const day = date.getDay();
    return day === 0 || day === 6; // 일요일(0) 또는 토요일(6)일 경우 비활성화
  };

  return (
    <div className={styles.calendarWrapper}>
      <Calendar
        onChange={(date) => onDateChange(date as Date)}
        value={selectedDate}
        formatDay={(_, date) => moment(date).format('D')}
        formatYear={(_, date) => moment(date).format('YYYY')}
        calendarType="gregory"
        showNeighboringMonth={false}
        next2Label={null}
        prev2Label={null}
        minDetail="year"
        className={styles.dayCalendar}
        tileDisabled={disableWeekends} // 주말 비활성화 함수 추가
      />
    </div>
  );
};

export default DayCalendar;
