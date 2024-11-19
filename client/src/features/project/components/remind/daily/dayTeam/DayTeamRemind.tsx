import styles from './DayTeamRemind.module.css';
import DayTeamRemindCard from './DayTeamRemindCard';
import { useDailyRemind } from '@/features/project/hooks/remind/useDailyRemind';


interface DayTeamRemindProps {
  formattedSelectedDate: string;
  projectId: number;
}

const DayTeamRemind: React.FC<DayTeamRemindProps> = ({ formattedSelectedDate, projectId }) => {
  const { data: dailyRemindData, isLoading, isError, error } = useDailyRemind({
    projectId,
  });

  if (isLoading) {
    return <p>데이터를 불러오는 중...</p>;
  }

  if (isError) {
    console.error('Error fetching daily remind:', error);
    return <p>데이터를 불러오는 중 오류가 발생했습니다.</p>;
  }

  const dayTeamFilteredMessages = dailyRemindData?.filter(
    (item) => item.dailyRemindDate === formattedSelectedDate
  ) || [];

  const extractSectionMessage = (msg: string, prefix: string, nextPrefix?: string) => {
    const startIndex = msg.indexOf(prefix);
    if (startIndex === -1) return null;
    const endIndex = nextPrefix ? msg.indexOf(nextPrefix) : msg.length;
    return msg.substring(startIndex + prefix.length, endIndex).trim();
  };

  const keepMessages = dayTeamFilteredMessages
    .map((msg) => extractSectionMessage(msg.message, '🟢 Keep:', '🟠 Problem:'))
    .filter((msg): msg is string => msg !== null);

  const problemMessages = dayTeamFilteredMessages
    .map((msg) => extractSectionMessage(msg.message, '🟠 Problem:', '🔵 Try:'))
    .filter((msg): msg is string => msg !== null);

  const tryMessages = dayTeamFilteredMessages
    .map((msg) => extractSectionMessage(msg.message, '🔵 Try:'))
    .filter((msg): msg is string => msg !== null);

  return (
    <div className={styles.teamReview}>
      <div className={styles.keepSection}>
        <div className={styles.sectionTitle}>
          <div className={styles.sectionTitleStart}></div>
          <h3 className={styles.h3}>Keep</h3>
        </div>
        <div className={styles.reviewCardContainer}>
          {keepMessages.length > 0 ? (
            keepMessages.map((msg, index) => {
              const message = dayTeamFilteredMessages[index]; // 해당 메시지에서 사용자 정보를 가져옴
              return (
                <DayTeamRemindCard
                  key={index}
                  userName={message.username} // userName 연결
                  userImage={message.userImage} // userImage 연결
                  reviewText={msg} // reviewText는 추출된 Keep 메시지
                />
              );
            })
          ) : (
            <p className={styles.p}>해당 날짜에 작성된 Keep 회고가 없습니다.</p>
          )}
        </div>
      </div>

      <div className={styles.problemSection}>
        <div className={styles.sectionTitle}>
          <div className={styles.sectionTitleStart}></div>
          <h3 className={styles.h3}>Problem</h3>
        </div>
        <div className={styles.reviewCardContainer}>
          {problemMessages.length > 0 ? (
            problemMessages.map((msg, index) => {
              const message = dayTeamFilteredMessages[index]; // 해당 메시지에서 사용자 정보를 가져옴
              return (
                <DayTeamRemindCard
                  key={index}
                  userName={message.username} // userName 연결
                  userImage={message.userImage} // userImage 연결
                  reviewText={msg} // reviewText는 추출된 Problem 메시지
                />
              );
            })
          ) : (
            <p className={styles.p}>해당 날짜에 작성된 Problem 회고가 없습니다.</p>
          )}
        </div>
      </div>

      <div className={styles.trySection}>
        <div className={styles.sectionTitle}>
          <div className={styles.sectionTitleStart}></div>
          <h3 className={styles.h3}>Try</h3>
        </div>
        <div className={styles.reviewCardContainer}>
          {tryMessages.length > 0 ? (
            tryMessages.map((msg, index) => {
              const message = dayTeamFilteredMessages[index]; // 해당 메시지에서 사용자 정보를 가져옴
              return (
                <DayTeamRemindCard
                  key={index}
                  userName={message.username} // userName 연결
                  userImage={message.userImage} // userImage 연결
                  reviewText={msg} // reviewText는 추출된 Try 메시지
                />
              );
            })
          ) : (
            <p className={styles.p}>해당 날짜에 작성된 Try 회고가 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DayTeamRemind;
