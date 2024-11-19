import DailySchedule from '../dailySchedule/DailySchedule';
import styles from './WeeklySchedule.module.css';
import React, { useMemo } from 'react';
import { DayOfWeek } from '../../../types/dashboard/DayOfWeek';
import { useDashboardStore } from '@/features/project/stores/useDashboardStore';
import { useSprintIssueQuery } from '@/features/project/hooks/useSprintIssueData';
import useUserStore from '@/stores/useUserStore';
import { useUserInfoData } from '@/features/myPage/hooks/useUserInfoData';
import { dateToString } from '@/utils/dateToString';
import { useGitlabData } from '@features/project/hooks/useGitlabData';
import { IssueDTO, GitlabDTO } from '@/features/project/types/dashboard/WeeklyDataDTO';
import { ISOStringFormat } from 'date-fns';
import { MeetingItemDTO } from '@/features/project/types/meeting/MeetingDTO';
import { useMeetingListQuery } from '@/features/project/hooks/meeting/useMeetingListQuery';

interface WeeklyScheduleProps {
  weeklyStartDate: Date;
}

const weekDays: DayOfWeek[] = [
  DayOfWeek.Monday,
  DayOfWeek.Tuesday,
  DayOfWeek.Wednesday,
  DayOfWeek.Thursday,
  DayOfWeek.Friday,
  DayOfWeek.Saturday,
  DayOfWeek.Sunday,
];

const WeeklySchedule: React.FC<WeeklyScheduleProps> = () => {
  //stores
  const { userId } = useUserStore();
  const { projectId, projectWeekList, currentWeek } = useDashboardStore();
  // variables
  const startDate = projectWeekList?.[currentWeek]?.startDate;
  const endDate = projectWeekList?.[currentWeek]?.endDate;
  const year = endDate?.getFullYear();
  const month = endDate?.getMonth();
  const day = endDate?.getDate();
  //queries
  const { data: userInfo } = useUserInfoData(userId);
  const { data: meetingList, isLoading: isMeetingLoading } = useMeetingListQuery(Number(projectId));
  const { data: sprintIssues, isLoading: isJiraLoading } = useSprintIssueQuery(
    projectId,
    dateToString(startDate, '-'),
    dateToString(endDate, '-')
  );
  // const getStartOfDayISOString = (date: Date): string => {
  //   const startOfDay = new Date(date);
  //   startOfDay.setHours(0, 0, 0, 0); // 자정으로 설정
  //   return startOfDay.toISOString();
  // };

  // const getEndOfDayISOString = (date: Date): string => {
  //   const endOfDay = new Date(date);
  //   endOfDay.setHours(23, 59, 59, 999); // 하루의 마지막 시간으로 설정
  //   return endOfDay.toISOString();
  // };

  const { data: gitlabData, isLoading: isGitlabLoading } = useGitlabData(
    projectId,
    startDate
      ? (new Date(Date.UTC(year, month, day - 3, 0, 0, 0)).toISOString() as ISOStringFormat) // 자정
      : null,
    endDate
      ? (new Date(Date.UTC(year, month, day + 3, 23, 59, 59, 999)).toISOString() as ISOStringFormat) // 하루 마지막
      : null
  );

  const userName = userInfo?.userName;

  // sprint Issue 에서 자기 Issue만 필터
  const filterdIssues = sprintIssues
    ?.filter((issue: IssueDTO) => {
      return issue.allocator === userName;
    })
    .filter((issue: IssueDTO) => {
      return issue.progress === '완료';
    });

  // 월~일 까지 weekMap, endDate 가 목요일 기준임
  const weekMap = {
    Monday: { date: new Date(year, month, day - 3) },
    Tuesday: { date: new Date(year, month, day - 2) },
    Wednesday: { date: new Date(year, month, day - 1) },
    Thursday: { date: endDate },
    Friday: { date: new Date(year, month, day + 1) },
    Saturday: { date: new Date(year, month, day + 2) },
    Sunday: { date: new Date(year, month, day + 3) },
  };

  // `sprintIssues` 데이터를 요일별로 분류하는 로직
  // useMemo 로 캐싱
  const dashboardData = useMemo(() => {
    // 월~일 에 해당하는 jira/gitlab/meeting 데이터 넣을 빈 객체 생성
    const dataByDay: {
      [key in DayOfWeek]: { jira: IssueDTO[]; gitlab: GitlabDTO[]; meeting: MeetingItemDTO[] };
    } = {
      Monday: { jira: [], gitlab: [], meeting: [] },
      Tuesday: { jira: [], gitlab: [], meeting: [] },
      Wednesday: { jira: [], gitlab: [], meeting: [] },
      Thursday: { jira: [], gitlab: [], meeting: [] },
      Friday: { jira: [], gitlab: [], meeting: [] },
      Saturday: { jira: [], gitlab: [], meeting: [] },
      Sunday: { jira: [], gitlab: [], meeting: [] },
    };
    // gitlab data 순회하며 날짜에 해당하는 gitlab[] 에 넣기
    gitlabData?.forEach((mr: GitlabDTO) => {
      const mergeDate = new Date(mr.mergeDate);
      const dayOfWeek = mergeDate.getDay(); // 요일 인덱스 계산 (0=일요일, 1=월요일, ...)
      const weekDay = weekDays[(dayOfWeek + 6) % 7] || '날짜미지정';
      // console.log(mr.mergeDate, dayOfWeek, weekDay, mr.title);
      dataByDay[weekDay as DayOfWeek]?.gitlab.push(mr);
    });
    //filteredIssue 순회하며 날짜에 해당하는 jira[] 에 넣기
    filterdIssues?.forEach((issue: IssueDTO) => {
      const match = issue.summary.match(/(\d{6})/); // `title`에서 날짜 추출
      if (match) {
        const dateStr = match[0];
        const year = 2000 + parseInt(dateStr.slice(0, 2), 10);
        const month = parseInt(dateStr.slice(2, 4), 10) - 1;
        const date = parseInt(dateStr.slice(4, 6), 10);
        const dateObj = new Date(year, month, date);

        const dayOfWeek = dateObj.getDay(); // 요일 인덱스 계산 (0=일요일, 1=월요일, ...)
        const weekDay = weekDays[(dayOfWeek + 6) % 7] || '날짜미지정';
        if (weekMap[weekDay]?.date?.getDate() === date) {
          dataByDay[weekDay as DayOfWeek].jira.push(issue);
        }
      } else {
        // dataByDay['날짜미지정']?.jira.push(issue); // 날짜가 없을 경우 '날짜미지정' 처리
      }
    });
    // meetingList 순회하며 날짜에 해당하는 meeting[] 에 넣기
    meetingList?.forEach((meeting) => {
      const meetingDateObj = new Date(meeting.meetingCreateTime);
      const meetingDate = meetingDateObj.getDate();
      const meetingDay = meetingDateObj.getDay();
      const weekDay = weekDays[(meetingDay + 6) % 7];
      //console.log(meeting, weekDay);
      //console.log(meetingDate, weekMap[weekDay]?.date?.getDate());
      if (weekMap[weekDay]?.date?.getDate() === meetingDate) {
        dataByDay[weekDay as DayOfWeek]?.meeting.push(meeting);
      }
    });

    return dataByDay;
  }, [gitlabData, filterdIssues, meetingList]);
  const isDataLoading = isGitlabLoading || isJiraLoading || isMeetingLoading;
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {weekDays.map((day, i) => (
          <DailySchedule
            key={i}
            date={weekMap[day]?.date?.getDate()}
            day={day}
            jiraData={dashboardData[day]?.jira}
            gitlabData={dashboardData[day]?.gitlab}
            meetingData={dashboardData[day]?.meeting}
            isLoading={isDataLoading}
          />
        ))}
      </div>
    </div>
  );
};

export default WeeklySchedule;
