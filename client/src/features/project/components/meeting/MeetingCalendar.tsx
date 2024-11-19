import { useState } from 'react';
import Calendar, { CalendarProps } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import styles from './MeetingCalendar.module.css';

interface MeetingCalendarProps {
  onDateChange: (date: Date | null) => void;
}

const MeetingCalendar = ({ onDateChange }: MeetingCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleDateChange: CalendarProps['onChange'] = (value) => {
    if (value instanceof Date) {
      setSelectedDate(value); // 상태 업데이트
      onDateChange(value);
    } else {
      setSelectedDate(null); // 상태 초기화
      onDateChange(null);
    }
  };

  const tileClassName: CalendarProps['tileClassName'] = ({ date, view }) => {
    if (view === 'month' && selectedDate && moment(date).isSame(selectedDate, 'day')) {
      console.log('Selected date matched:', date); // 디버깅용 로그
      return 'react-calendar__tile selectedTile'; // 정확한 클래스 결합 반환
    }
    return '';
  };

  return (
    <div className={styles.calendar}>
      <Calendar
        onChange={handleDateChange}
        formatDay={(_, date) => moment(date).format('D')}
        formatYear={(_, date) => moment(date).format('YYYY')}
        calendarType="gregory"
        showNeighboringMonth={false}
        next2Label={null}
        prev2Label={null}
        minDetail="year"
        className={styles.dayCalendar}
        tileClassName={tileClassName} // 커스텀 클래스 적용
      />
    </div>
  );
};

export default MeetingCalendar;
