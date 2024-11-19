import { useNavigate, useParams } from 'react-router-dom';
import styles from './DayMyRemind.module.css';
import usePmIdStore from '@/features/project/stores/remind/usePmIdStore';
import { useDailyRemind } from '@/features/project/hooks/remind/useDailyRemind';
import { deleteDailyRemind } from '@/features/project/apis/remind/deleteDailyRemind';
import { ImPencil } from "react-icons/im";
import { RiDeleteBinFill } from "react-icons/ri";
import { format } from 'date-fns';
import { showToast } from '@/utils/toastUtils';

interface DayMyRemindProps {
  formattedSelectedDate: string | Date | number;
}

const DayMyRemind: React.FC<DayMyRemindProps> = ({ formattedSelectedDate }) => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const { pmId } = usePmIdStore();

  const { data: dailyRemindData, refetch } = useDailyRemind({
    projectId: Number(projectId),
    projectMemberId: Number(pmId),
  });

  const formattedDate = format(new Date(formattedSelectedDate), 'yyyy-MM-dd');

  const dayMyfilteredMessages = dailyRemindData?.filter(
    (item) => item.projectMemberId === pmId && item.dailyRemindDate === formattedDate
  ) || [];

  const extractSectionMessage = (msg: string, prefix: string, nextPrefix?: string) => {
    const startIndex = msg.indexOf(prefix);
    if (startIndex === -1) return null;
    const endIndex = nextPrefix ? msg.indexOf(nextPrefix) : msg.length;
    return msg.substring(startIndex + prefix.length, endIndex).trim();
  };

  const keepMessages = dayMyfilteredMessages
    .map((msg) => extractSectionMessage(msg.message, '🟢 Keep:', '🟠 Problem:'))
    .filter((msg): msg is string => msg !== null);

  const problemMessages = dayMyfilteredMessages
    .map((msg) => extractSectionMessage(msg.message, '🟠 Problem:', '🔵 Try:'))
    .filter((msg): msg is string => msg !== null);

  const tryMessages = dayMyfilteredMessages
    .map((msg) => extractSectionMessage(msg.message, '🔵 Try:'))
    .filter((msg): msg is string => msg !== null);

  const handleEditClick = () => {
    navigate(`/project/${projectId}/remind/create`,
      {
        state: { 
          myfilteredMessages: dayMyfilteredMessages,
          formattedSelectedDate,
        },
      }
    ); 
  };

  const handleDeleteClick = async () => {
    if (!projectId || !pmId) {
      console.error("프로젝트 ID나 PM ID가 없습니다.");
      return;
    }

    try {
      const dailyRemindId = dayMyfilteredMessages[0].dailyRemindId;
      await deleteDailyRemind(Number(projectId), dailyRemindId);

      await refetch();
      showToast.success('회고가 성공적으로 삭제되었습니다.');

    } catch (error) {
      console.error('삭제 중 오류 발생:', error);
      showToast.error('회고 삭제에 실패했습니다.');
    }
  };

  return (
    <div className={styles.myReviewContainer}>
      <div className={styles.myReview}>
        <div className={styles.keepSection}>
          <div className={styles.sectionTitle}>
            <h3 className={styles.h3}>Keep</h3>
          </div>
          <div className={styles.reviewContainer}>
            {keepMessages.length > 0 ? (
              keepMessages.map((msg, index) => (
                <p key={index} className={styles.p}>{msg}</p>
              ))
            ) : (
              <p className={styles.p}>해당 날짜에 작성된 Keep 회고가 없습니다.</p>
            )}
          </div>
        </div>

        <div className={styles.problemSection}>
          <div className={styles.sectionTitle}>
            <h3 className={styles.h3}>Problem</h3>
          </div>
          <div className={styles.reviewContainer}>
            {problemMessages.length > 0 ? (
              problemMessages.map((msg, index) => (
                <p key={index} className={styles.p}>{msg}</p>
              ))
            ) : (
              <p className={styles.p}>해당 날짜에 작성된 Problem 회고가 없습니다.</p>
            )}
          </div>
        </div>

        <div className={styles.trySection}>
          <div className={styles.sectionTitle}>
            <h3 className={styles.h3}>Try</h3>
          </div>
          <div className={styles.reviewContainer}>
            {tryMessages.length > 0 ? (
              tryMessages.map((msg, index) => (
                <p key={index} className={styles.p}>{msg}</p>
              ))
            ) : (
              <p className={styles.p}>해당 날짜에 작성된 Try 회고가 없습니다.</p>
            )}
          </div>
        </div>
      </div>
      {dayMyfilteredMessages.length > 0 && (
        <div className={styles.editbox}>
          <div className={styles.editButton} onClick={handleEditClick}>
            <ImPencil />
            <p className={styles.Text}>수정하기</p>
          </div>
          <div className={styles.deleteButton} onClick={handleDeleteClick}>
            <RiDeleteBinFill />
            <p className={styles.Text}>삭제하기</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DayMyRemind;
