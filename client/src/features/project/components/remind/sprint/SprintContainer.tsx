import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './SprintContainer.module.css';
import FilterHeader from './FilterHeader';
import Button from '../../../../../components/button/Button';
import WeekCalendar from './WeekCalendar';
import MySprint from './my/MySprint';
import TeamSprint from './team/TeamSprint';
import SprintModal from './SprintModal';
import usePmIdStore from '@/features/project/stores/remind/usePmIdStore';
import { useSprintRemind } from '@/features/project/hooks/remind/useSprintRemind';
import { dateToWeek } from '@/utils/dateToWeek';

const SprintContainer = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { pmId } = usePmIdStore();
  const [myTeam, setMyTeam] = useState('나의 회고');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedDateInfo, setSelectedDateInfo] = useState<{ checkDate: string; startDate: string; endDate: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formattedDate, setFormattedDate] = useState('');

  const { data: sprintRemindData, isError, error } = useSprintRemind({
    projectId: Number(projectId),
    projectMemberId: undefined,
    checkDate: undefined,
    startDate: undefined,
    endDate: undefined,
  });

  useEffect(() => {
    if (sprintRemindData) {
      console.log("Sprint Remind Data:", sprintRemindData);
    }
  }, [sprintRemindData, isError, error]);

  // selectedDate가 변경될 때마다 formattedDate를 업데이트하는 useEffect 추가
  useEffect(() => {
    setFormattedDate(dateToWeek(selectedDate));
  }, [selectedDate]);

  const handleDateChange = (dateInfo: { checkDate: string; startDate: string; endDate: string }) => {
    if (!selectedDateInfo || dateInfo.checkDate !== selectedDateInfo.checkDate) {
      const newDate = new Date(dateInfo.checkDate);
      setSelectedDate(newDate);
      setSelectedDateInfo(dateInfo);
      setFormattedDate(dateToWeek(selectedDate));
    }
  };

  const MyfilteredContents = sprintRemindData?.filter((item) =>
    item.projectMemberId === pmId &&
    selectedDateInfo &&
    item.startDate >= selectedDateInfo.startDate &&
    item.endDate <= selectedDateInfo.endDate
  ) || [];

  const TeamfilteredContents = sprintRemindData?.filter((item) =>
    selectedDateInfo &&
    item.startDate >= selectedDateInfo.startDate &&
    item.endDate <= selectedDateInfo.endDate
  ) || [];

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <FilterHeader
          myTeam={myTeam}
          setMyTeam={setMyTeam}
          formattedDate={formattedDate}
        />
        <div className={styles.remindContent}>
          {myTeam === '나의 회고' && <MySprint contents={MyfilteredContents} selectedDateInfo={selectedDateInfo}/>}
          {myTeam === '팀원 회고' && <TeamSprint contents={TeamfilteredContents} />}
        </div>
      </div>
      <div className={styles.right}>
        <Button size="large" colorType="purple" onClick={handleOpenModal}>
          🚀 주간 회고 생성
        </Button>
        <p className={styles.description}>조회할 날짜를 선택해주세요</p>
        <WeekCalendar selectedDate={selectedDate} onDateChange={handleDateChange} />
      </div>
      <SprintModal isOpen={isModalOpen} onClose={handleCloseModal} projectId={Number(projectId)} />
    </div>
  );
};

export default SprintContainer;
