import { useState, useEffect  } from 'react';
import { useNavigate, useParams, useLocation  } from 'react-router-dom'; 
import styles from './DayMyCreate.module.css';
import { FaRegClock } from "react-icons/fa6";
import { ImPencil } from "react-icons/im";
import Button from '../../../../../../components/button/Button';
import CreateCalendar from './CreateCalendar';
import CreateRight from './CreateRight';
import { createDailyRemind }from '@features/project/apis/remind/createDailyRemind';
import { editDailyRemind } from '@features/project/apis/remind/editDailyRemind';
import { DailyRemindPostDTO, DailyRemindPutDTO  } from '@features/project/types/remind/DailyRemindDTO';
import usePmIdStore from '@/features/project/stores/remind/usePmIdStore';
import { showToast } from '@/utils/toastUtils';


const DayMyCreate = () => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const { pmId } = usePmIdStore();

  const location = useLocation();
  const { myfilteredMessages, formattedSelectedDate } = location.state || {};

  const [keepText, setKeepText] = useState("");
  const [problemText, setProblemText] = useState("");
  const [tryText, setTryText] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  

  const formattedDate = new Intl.DateTimeFormat('ko', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  }).format(selectedDate).replace(/ (\S+)$/, ' ($1)');

  const formattedCurrentDate = new Intl.DateTimeFormat('ko', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  }).format(currentDate).replace(/ (\S+)$/, ' ($1)');

  interface DailyRemindMessage {
    dailyRemindDate: string;
    message: string;
    dailyRemindId?: number;
  }

  // 섹션별 메시지를 추출하는 함수
  const extractSectionMessage = (msg: string, prefix: string, nextPrefix?: string) => {
    const startIndex = msg.indexOf(prefix);
    if (startIndex === -1) return null;
    const endIndex = nextPrefix ? msg.indexOf(nextPrefix, startIndex) : msg.length;
    return msg.substring(startIndex + prefix.length, endIndex).trim();
  };


  useEffect(() => {
    if (formattedSelectedDate) {
      const initialDate = new Date(formattedSelectedDate);
      setCurrentDate(initialDate);
      console.log(initialDate);
      console.log("myfilteredMessages:",myfilteredMessages)

      const initialMessage = myfilteredMessages?.find((message: DailyRemindMessage) => {
        const messageDate = new Date(message.dailyRemindDate);
        return messageDate.toLocaleDateString("ko-KR") === initialDate.toLocaleDateString("ko-KR");
      });

      if (initialMessage) {
        setKeepText(extractSectionMessage(initialMessage.message, '🟢 Keep:', '🟠 Problem:') || "");
        setProblemText(extractSectionMessage(initialMessage.message, '🟠 Problem:', '🔵 Try:') || "");
        setTryText(extractSectionMessage(initialMessage.message, '🔵 Try:') || "");
      } else {
        setKeepText("");
        setProblemText("");
        setTryText("");
      }
    }
  }, [formattedSelectedDate, myfilteredMessages]);
  

  // currentDate와 일치하는 메시지를 찾아 keep, problem, try 텍스트로 설정
  useEffect(() => {
    const todayMessage = myfilteredMessages?.find((message: DailyRemindMessage) => {
      const messageDate = new Date(message.dailyRemindDate);
      return messageDate.toLocaleDateString("ko-KR") === currentDate.toLocaleDateString("ko-KR");
    });

    if (todayMessage) {
      console.log(todayMessage)
      const keepPart = extractSectionMessage(todayMessage.message, '🟢 Keep:', '🟠 Problem:');
      const problemPart = extractSectionMessage(todayMessage.message, '🟠 Problem:', '🔵 Try:');
      const tryPart = extractSectionMessage(todayMessage.message, '🔵 Try:');

      setKeepText(keepPart || "");
      setProblemText(problemPart || "");
      setTryText(tryPart || "");
    } else {
      setKeepText("");
      setProblemText("");
      setTryText("");
    }
  }, [currentDate, myfilteredMessages, formattedSelectedDate]);

  const backButtonClick = () => {
    navigate(-1);
  };

  const handleButtonClick = async () => {
    if (!keepText || !problemText || !tryText) {
      showToast.warn("모든 항목을 입력해주세요.");
      return;
    }
    
    if (!projectId) {
      console.error("Project ID is missing");
      return;
    }
    if (pmId === null) {
      console.error("Project Member ID is missing");
      return;
    }

    const dailyRemindContents = `🟢 Keep: \n${keepText}\n🟠 Problem: \n${problemText}\n🔵 Try: \n${tryText}`;
    const dailyRemindDate = currentDate.toLocaleDateString("ko-KR", {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\. /g, '-').replace('.', ''); // "YYYY-MM-DD" 형식으로 변환

    const todayMessage = myfilteredMessages?.find((message: DailyRemindMessage) => {
      const messageDate = new Date(message.dailyRemindDate);
      return messageDate.toLocaleDateString("ko-KR") === currentDate.toLocaleDateString("ko-KR");
    });

    try {
      if (todayMessage && todayMessage.dailyRemindId) {
        const dailyRemindData: DailyRemindPutDTO = {
          dailyRemindContents,
          dailyRemindAuthor: pmId,
          dailyRemindId: todayMessage.dailyRemindId,
        };
        console.log(dailyRemindData);
        await editDailyRemind(Number(projectId), todayMessage.dailyRemindId, dailyRemindData);
      } else {
        const dailyRemindData: DailyRemindPostDTO = {
          dailyRemindContents,
          projectMemberId: pmId,
          dailyRemindDate,
        };
        await createDailyRemind(Number(projectId), dailyRemindData);
      }
      navigate(`/project/${projectId}/remind`);
    } catch (error) {
      console.error("Failed to create daily remind:", error);
    }
  };

  // 닫기 핸들러: 외부 클릭 시 달력 닫기
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const calendarElement = document.querySelector(`.${styles.calendarContainer}`);
      if (isCalendarOpen && calendarElement && !calendarElement.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isCalendarOpen]);

  const handlePencilClick = () => {
    setIsCalendarOpen((prev) => !prev);  // 달력 표시 상태 토글
  };

  const handleDateChange = (date: Date) => {
    setCurrentDate(date);
    setIsCalendarOpen(false);  // 날짜 선택 후 달력 숨기기
  };


  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.filterHeader}>
          <div className={styles.dateTitle}>
            <FaRegClock style={{ strokeWidth: 4, color: "#007bff" }} />
            {formattedCurrentDate}
            {!formattedSelectedDate && (
              <ImPencil style={{ color: "black", cursor: 'pointer' }} onClick={handlePencilClick} />
            )}
            {isCalendarOpen && (
              <div className={styles.calendarContainer}>
                <CreateCalendar selectedDate={currentDate} onDateChange={handleDateChange} />
              </div>
            )}

            {!formattedSelectedDate && (
              <p className={styles.descriptionTitle}>작성할 회고의 날짜를 변경할 수 있습니다.</p>
            )}
          </div>
          <div className={styles.headerButton}>
            <Button size="xsmall" colorType="white" onClick={backButtonClick}>뒤로가기</Button>
            <Button size="xsmall" colorType="blue" onClick={handleButtonClick}>완료</Button>
          </div>
        </div>
        <div className={styles.myReview}>
          <div className={styles.keepSection}>
            <div className={styles.sectionTitle}>
              <h3 className={styles.h3}>Keep</h3>
            </div>
            <div className={styles.reviewContainer}>
              <textarea 
                className={styles.textarea} 
                placeholder={`- 현재 만족하고 있는 부분\n- 계속 이어갔으면 하는 부분`} 
                value={keepText} 
                onChange={(e) => setKeepText(e.target.value)} 
              />
            </div>
          </div>
          <div className={styles.problemSection}>
            <div className={styles.sectionTitle}>
              <h3 className={styles.h3}>Problem</h3>
            </div>
            <div className={styles.reviewContainer}>
              <textarea 
                className={styles.textarea} 
                placeholder={`- 불편하게 느끼는 부분\n- 개선이 필요하다고 생각되는 부분`} 
                value={problemText} 
                onChange={(e) => setProblemText(e.target.value)} 
              />
            </div>
          </div>
          <div className={styles.trySection}>
            <div className={styles.sectionTitle}>
              <h3 className={styles.h3}>Try</h3>
            </div>
            <div className={styles.reviewContainer}>
              <textarea 
                className={styles.textarea} 
                placeholder={`- Problem에 대한 해결책\n- 다음 회고 때 판별 가능한 것\n- 당장 실행가능한 것`} 
                value={tryText} 
                onChange={(e) => setTryText(e.target.value)} 
              />
            </div>
          </div>
        </div>
      </div>
      <CreateRight
      selectedDate={selectedDate}
      setSelectedDate={setSelectedDate}
      formattedDate={formattedDate}
      projectId={Number(projectId)} // projectId 전달
      pmId={Number(pmId)} // pmId 전달
    />
    </div>
  );
};

export default DayMyCreate;
