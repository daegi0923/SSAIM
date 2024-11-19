import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './DailyContainer.module.css';
import FilterHeader from './FilterHeader';
import DayTeamRemind from '../daily/dayTeam/DayTeamRemind'; 
import DayMyRemind from '../daily/dayMy/DayMyRemind';
import WeekRemind from '..//daily/week/WeekRemind';
import Button from '../../../../../components/button/Button';
import DayCalendar from './DayCalendar';
import WeekCalendar from './week/WeekCalendar';
import { useProjectInfo } from '@features/project/hooks/useProjectInfo';
import useUserStore from '@/stores/useUserStore';
import usePmIdStore from '@/features/project/stores/remind/usePmIdStore';
import { useDailyRemind } from '@/features/project/hooks/remind/useDailyRemind'; // useDailyRemind 훅을 임포트
import { format } from 'date-fns';
import { dateToWeek } from '@/utils/dateToWeek';


interface ProjectMember {
  userId: number;
  pmId: number;
}


const DailyContainer = () => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const [dayWeek, setDayWeek] = useState('1일');
  const [myTeam, setMyTeam] = useState('나의 회고');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selecteWeekdDate, setSelectedWeekDate] = useState<Date>(new Date());
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);

  const { data: projectInfo } = useProjectInfo(Number(projectId));
  const { userId } = useUserStore();
  const { pmId, setPmId } = usePmIdStore();

  const { data: dailyRemindData, isError, error } = useDailyRemind({
    projectId: Number(projectId), // projectId를 넘겨줘야 함
  });

  useEffect(() => {
    if (projectInfo && projectInfo.projectMembers && userId) {
      const projectMember = projectInfo.projectMembers.find(
        (member: ProjectMember) => member.userId === userId
      );
      if (projectMember) {
        setPmId(projectMember.pmId); // pmId 상태 업데이트
      }
    }

    // API 응답 데이터 콘솔 출력
    if (dailyRemindData) {
      console.log('Daily Remind Data:', dailyRemindData);
    }

    if (isError) {
      console.error('Error fetching daily remind:', error);
    }
  }, [projectInfo, userId, setPmId, projectId, dailyRemindData, isError, error]);

  const formattedDate = dayWeek === '1일'
  ? new Intl.DateTimeFormat('ko', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short',
    }).format(selectedDate).replace(/ (\S+)$/, ' ($1)')
  : dateToWeek(selecteWeekdDate);

  const formattedSelectedDate = format(selectedDate, 'yyyy-MM-dd');


  const myfilteredMessages = dailyRemindData?.filter((item) =>
    item.projectMemberId === pmId 
  ) || [];

  const handleButtonClick = () => {
    navigate(`/project/${projectId}/remind/create`,
      {
        state: { myfilteredMessages },
      }
    ); 
  };

  const handleWeekDateChange = (dateInfo: { startDate: string; }) => {
    const { startDate } = dateInfo;
    const newDate = new Date(startDate);
    setSelectedWeekDate(newDate);
  };

  const handleMemberClick = (pmId: number) => {
    setSelectedMemberId(pmId);
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <FilterHeader
          dayWeek={dayWeek}
          setDayWeek={setDayWeek}
          myTeam={myTeam}
          setMyTeam={setMyTeam}
          formattedDate={formattedDate}
          projectId={Number(projectId)}
          onMemberClick={handleMemberClick}
        />
        <div className={styles.remindContent}>
          {dayWeek === '1일' && myTeam === '나의 회고' && <DayMyRemind formattedSelectedDate={formattedSelectedDate}/>}
          {dayWeek === '1일' && myTeam === '팀원 회고' && <DayTeamRemind formattedSelectedDate={formattedSelectedDate} projectId={Number(projectId)} />}
          {dayWeek === '1주일' && myTeam === '나의 회고' && <WeekRemind messages={myfilteredMessages} selectedWeekDate={selecteWeekdDate}/>}
          {dayWeek === '1주일' && myTeam === '팀원 회고' && <WeekRemind messages={dailyRemindData|| []} selectedWeekDate={selecteWeekdDate} selectedMemberId={selectedMemberId}/>}
        </div>
      </div>
      <div className={styles.right}>
        <Button size="large" colorType="blue" onClick={handleButtonClick}>
          📝 일일 회고 작성
        </Button>
        <p className={styles.description}>조회할 날짜를 선택해주세요</p>
        {dayWeek === '1일' ? (
          <DayCalendar selectedDate={selectedDate} onDateChange={setSelectedDate} />
        ) : (
          <WeekCalendar selectedDate={selecteWeekdDate} onDateChange={handleWeekDateChange} />
        )}
      </div>
    </div>
  );
};

export default DailyContainer;
