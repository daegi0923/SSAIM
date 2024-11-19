import { useMemo } from 'react';
import { FaRegClock } from "react-icons/fa6";
import styles from './CreateRight.module.css';
import CreateCalendar from './CreateCalendar';
import { useDailyRemind } from '@/features/project/hooks/remind/useDailyRemind';

interface CreateRightProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  formattedDate: string;
  projectId: number;
  pmId: number;
}

const CreateRight: React.FC<CreateRightProps> = ({
  selectedDate,
  setSelectedDate,
  formattedDate,
  projectId,
  pmId,
}) => {
  const { data: dailyRemindData } = useDailyRemind({ projectId });

  const myfilteredMessages = useMemo(() => {
    if (!dailyRemindData) return [];
    return dailyRemindData.filter((item) => item.projectMemberId === pmId);
  }, [dailyRemindData, pmId]);

  const matchingMessage = useMemo(() => {
    return myfilteredMessages.find((message) => {
      const messageDate = new Date(message.dailyRemindDate);
      return messageDate.toLocaleDateString('ko-KR') === selectedDate.toLocaleDateString('ko-KR');
    }) || null;
  }, [myfilteredMessages, selectedDate]);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <div className={styles.right}>
      <p className={styles.description}>
        이전에 작성했던 회고를 {'\n'}조회할 날짜를 선택해주세요
      </p>
      <CreateCalendar selectedDate={selectedDate} onDateChange={handleDateChange} />
      <div className={styles.remindBox}>
        <div className={styles.dateSubTitle}>
          <FaRegClock style={{ strokeWidth: 2, color: "#007bff" }} />
          {formattedDate}
        </div>
        <div className={styles.remindText}>
          {matchingMessage ? (
            <>
              {matchingMessage.message}
            </>
          ) : (
            '선택한 날짜에 대한 회고가 없습니다.'
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateRight;
