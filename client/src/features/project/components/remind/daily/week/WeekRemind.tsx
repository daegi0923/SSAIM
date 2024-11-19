import { startOfWeek, addDays, format } from 'date-fns';
import styles from './WeekRemind.module.css';

interface Message {
  dailyRemindId: number;
  projectMemberId: number;
  username: string;
  userImage: string;
  message: string;
  dailyRemindDate: string;
}

interface WeekRemindProps {
  messages: Message[];
  selectedWeekDate: Date;
  selectedMemberId?: number | null;
}

const daysOfWeekKor = ["월", "화", "수", "목", "금"];

const WeekRemind: React.FC<WeekRemindProps> = ({ messages, selectedWeekDate, selectedMemberId }) => {
  console.log("messages:", messages);
  console.log("selectedWeekDate:", selectedWeekDate);

  const weekDays = Array.from({ length: 5 }, (_, i) => {
    const date = addDays(startOfWeek(selectedWeekDate, { weekStartsOn: 1 }), i); // 월요일 기준으로 시작
    return {
      date, // Date 객체 그대로 저장
      day: format(date, 'dd'),         // 일자
      dayOfWeek: daysOfWeekKor[i],     // 요일을 한국어로 매핑
    };
  });

  return (
    <div className={styles.weekReview}>
      {weekDays.map((dayInfo, index) => {
        // 해당 날짜와 일치하는 messages를 필터링하여 전체 메시지와 멤버별 메시지를 각각 관리
        const filteredMessages = messages.filter(
          (message) => format(new Date(message.dailyRemindDate), 'yyyy-MM-dd') === format(dayInfo.date, 'yyyy-MM-dd')
        );

        const memberFilteredMessages = selectedMemberId
          ? filteredMessages.filter((message) => message.projectMemberId === selectedMemberId)
          : filteredMessages;

        return (
          <div key={index} className={styles[`${['Mon', 'Tus', 'Wed', 'Thu', 'Fri'][index]}Section`]}>
            <div className={styles.sectionTitle}>
              <p className={styles.h3}>{dayInfo.day}</p> {/* 날짜 렌더링 */}
              <p className={styles.h3}>{dayInfo.dayOfWeek}</p> {/* 요일 렌더링 (한국어) */}
            </div>
            <div className={styles.reviewContainer}>
              <div className={styles.reviewText}>
                {memberFilteredMessages.length > 0 ? (
                  memberFilteredMessages.map((msg) => (
                    <p key={msg.dailyRemindId} className={styles.p}>
                      {msg.message}
                    </p>
                  ))
                ) : (
                  <p className={styles.p}>해당 날짜에 회고가 없습니다.</p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WeekRemind;
