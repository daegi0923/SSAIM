import styles from './WeeklySprint.module.css';
import Issue from './Issue';
import Button from '../../../../components/button/Button';
import { useState, useMemo, useEffect } from 'react';
import { useSprintIssueQuery } from '../../hooks/useSprintIssueData';
import { useProjectInfo } from '../../hooks/useProjectInfo';
import { useParams, useNavigate } from 'react-router-dom';
import calculateWeeks from '../../utils/calculateWeeks';
import { dateToString } from '@/utils/dateToString';
import { ProjectInfoMemberDTO } from '@features/project/types/ProjectDTO';
import { getInitialCurrentWeek } from '../../utils/getInitialCurrentWeek';
import { IssueDTO } from '@features/project/types/dashboard/WeeklyDataDTO';
import { useEpicListData } from '../../hooks/sprint/useEpicListData';
import DefaultProfile from '@/assets/profile/DefaultProfile.png';
import LoadingDot from '@/components/loading/LoadingDot';
import { IoIosArrowDropleft, IoIosArrowDropright } from 'react-icons/io';

const statusOrder = ['진행 중', '해야 할 일', '완료']; // 상태 우선순위 정의

const WeeklySprint = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { data: projectInfo } = useProjectInfo(Number(projectId));
  console.log(projectInfo);
  const { data: epicList } = useEpicListData(Number(projectId));
  const projectMembers = projectInfo?.projectMembers;
  const [currentWeek, setCurrentWeek] = useState(-1);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const navigate = useNavigate();
  const projectWeekList = useMemo(() => {
    if (!projectInfo?.startDate || !projectInfo?.endDate) return [];
    return calculateWeeks(new Date(projectInfo.startDate as Date), new Date(projectInfo.endDate as Date));
  }, [projectInfo]);
  // projectWeekList가 처음 로드될 때만 currentWeek를 설정하도록 조건 추가
  useEffect(() => {
    if (currentWeek === -1 && projectWeekList.length > 0) {
      console.log(projectWeekList);
      console.log(getInitialCurrentWeek(projectWeekList));
      setCurrentWeek(getInitialCurrentWeek(projectWeekList));
    }
  }, [projectInfo, currentWeek, setCurrentWeek]);

  // 이하 코드 유지
  const { data: sprintIssues, isLoading: isSprintIssuesLoading } = useSprintIssueQuery(
    Number(projectId),
    dateToString(projectWeekList[currentWeek]?.startDate, '-'),
    dateToString(projectWeekList[currentWeek]?.endDate, '-')
  );

  const epicCodeMap = useMemo(() => {
    const map: Record<string, string> = {};
    epicList?.forEach((epic) => {
      map[epic.key] = epic.summary;
    });
    return map;
  }, [epicList]);

  const navigateToSprintList = () => {
    navigate(`list`);
  };

  const handleIncreaseWeek = () => {
    if (currentWeek < projectWeekList.length - 1) {
      setCurrentWeek(currentWeek + 1);
    }
  };

  const handleDecreaseWeek = () => {
    if (currentWeek > 0) {
      setCurrentWeek(currentWeek - 1);
    }
  };

  // 나머지 코드 유지

  const dayMap: Array<'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | '날짜미지정'> = [
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    '날짜미지정',
  ];

  const dateMap = useMemo(() => {
    if (!projectWeekList[currentWeek])
      return {
        Mon: undefined,
        Tue: undefined,
        Wed: undefined,
        Thu: undefined,
        Fri: undefined,
        날짜미지정: undefined,
      };

    const endDate = new Date(projectWeekList[currentWeek].endDate);
    const Mon = new Date(endDate);
    Mon.setDate(endDate.getDate() - 3);
    const Tue = new Date(Mon);
    Tue.setDate(Mon.getDate() + 1);
    const Wed = new Date(Tue);
    Wed.setDate(Tue.getDate() + 1);
    const Thu = new Date(Wed);
    Thu.setDate(Wed.getDate() + 1);
    const Fri = new Date(Thu);
    Fri.setDate(Thu.getDate() + 1);

    return {
      Mon: Mon.getDate(),
      Tue: Tue.getDate(),
      Wed: Wed.getDate(),
      Thu: Thu.getDate(),
      Fri: Fri.getDate(),
      날짜미지정: undefined,
    };
  }, [projectWeekList, currentWeek]);

  const issuesByDay = useMemo(() => {
    const dayIssueMap: Record<string, IssueDTO[]> = {
      Mon: [],
      Tue: [],
      Wed: [],
      Thu: [],
      Fri: [],
      날짜미지정: [],
    };

    sprintIssues?.forEach((issue: IssueDTO) => {
      if (selectedMember && issue.allocator !== selectedMember) return;

      const match = issue?.summary.match(/(\d{6})/);
      let day = '날짜미지정';

      if (match) {
        const dateStr = match[0];
        const year = 2000 + parseInt(dateStr.slice(0, 2), 10);
        const month = parseInt(dateStr.slice(2, 4), 10) - 1;
        const date = parseInt(dateStr.slice(4, 6), 10);
        const dateObj = new Date(year, month, date);
        const daysOfWeek = ['일요일', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', '토'];
        const weekday = daysOfWeek[dateObj.getDay()];
        day = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].includes(weekday) ? weekday : '날짜미지정';
      }

      dayIssueMap[day]?.push(issue);
    });

    Object.keys(dayIssueMap).forEach((day) => {
      dayIssueMap[day].sort((a, b) => {
        const statusA = statusOrder.indexOf(a.progress || '해야 할 일');
        const statusB = statusOrder.indexOf(b.progress || '해야 할 일');
        return statusA - statusB;
      });
    });

    console.log(dayIssueMap);
    return dayIssueMap;
  }, [sprintIssues, selectedMember]);

  const handleFilterMember = (memberName: string) => {
    setSelectedMember(selectedMember === memberName ? null : memberName);
  };
  const year = projectWeekList[currentWeek]?.endDate.getFullYear();
  const month = projectWeekList[currentWeek]?.endDate.getMonth();
  const day = projectWeekList[currentWeek]?.endDate.getDate();
  const dateMon = dateToString(new Date(year, month, day - 3));
  const dateSun = dateToString(new Date(year, month, day + 3));

  const weekMap = {
    Mon: '월요일',
    Tue: '화요일',
    Wed: '수요일',
    Thu: '목요일',
    Fri: '금요일',
    날짜미지정: '날짜미지정',
  };
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <button className={styles.arrowButton} onClick={handleDecreaseWeek}>
            <IoIosArrowDropleft />
          </button>
          <h2 className={styles.sprintTitle}>{currentWeek + 1}주차</h2>
          <button className={styles.arrowButton} onClick={handleIncreaseWeek}>
            <IoIosArrowDropright />
          </button>
        </div>
        <div className={styles.headerBottom}>
          <div className={styles.teamProfiles}>
            {projectMembers?.map((member: ProjectInfoMemberDTO) => (
              <div
                key={member.name}
                className={`${styles.profilePictureContainer} `}
                onClick={() => handleFilterMember(member.name)}
              >
                <img
                  src={member.profileImage?.length > 0 ? member.profileImage : DefaultProfile}
                  alt={member.name}
                  className={`${styles.profilePicture} ${selectedMember === member.name ? styles.activeProfile : ''}`}
                />
                <span className={`${styles.profileLabel} ${selectedMember === member.name ? styles.activeLabel : ''}`}>
                  {member.name}
                </span>
              </div>
            ))}
          </div>
          <div className={styles.headerBottomRight}>
            <p>
              {dateMon} ~ {dateSun}
            </p>
            <div className={styles.buttonPlaceholder}>
              <Button children="스프린트 생성" colorType="blue" size="custom" onClick={navigateToSprintList} />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.weeklyProgressContainer}>
        <div className={styles.contentheader}>
          {dayMap.map((day) => (
            <div key={day} className={`${styles.dayHeader} ${dateMap[day] === undefined ? styles.singleItem : ''}`}>
              {dateMap[day] !== undefined && <span>{dateMap[day]}</span>}
              <span>{weekMap[day]}</span>
            </div>
          ))}
        </div>

        {isSprintIssuesLoading ? (
          <div className={styles.loadingContainer}>
            <LoadingDot />
          </div>
        ) : (
          <div className={styles.issueGrid}>
            {dayMap.map((day) => (
              <div key={day} className={styles.dayColumn}>
                {issuesByDay[day] && issuesByDay[day].length === 0 && (
                  <span className={styles.noData}>해당 날짜에 이슈가 없습니다.</span>
                )}

                {issuesByDay[day]?.map((issue: IssueDTO) => (
                  <Issue issue={issue} epicSummary={issue.epicCode ? epicCodeMap?.[issue.epicCode] || '' : ''} />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WeeklySprint;
