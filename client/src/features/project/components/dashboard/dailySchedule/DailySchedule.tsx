import styles from './DailySchedule.module.css';
import React from 'react';
import Task from '../task/Task';
import { DayOfWeek } from '../../../types/dashboard/DayOfWeek';
import { IssueDTO, GitlabDTO } from '@/features/project/types/dashboard/WeeklyDataDTO';
import { MeetingItemDTO } from '@/features/project/types/meeting/MeetingDTO';
import LoadingDot from '@/components/loading/LoadingDot';

interface DailyScheduleProps {
  day: DayOfWeek;
  date: number;
  jiraData: IssueDTO[] | [];
  gitlabData: GitlabDTO[];
  meetingData: MeetingItemDTO[];
  isLoading: boolean;
}

const DailySchedule: React.FC<DailyScheduleProps> = ({ day, date, jiraData, gitlabData, meetingData, isLoading }) => {
  const dayToKr = (day: DayOfWeek) => {
    const dayMap: Record<DayOfWeek, string> = {
      Sunday: '일요일',
      Monday: '월요일',
      Tuesday: '화요일',
      Wednesday: '수요일',
      Thursday: '목요일',
      Friday: '금요일',
      Saturday: '토요일',
    };
    return dayMap[day];
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span>{date}</span>
        <span>{dayToKr(day)}</span>
      </div>
      {isLoading ? (
        <div className={styles.loadingContent}>
          <LoadingDot />
        </div>
      ) : (
        <>
          <div className={styles.content}>
            {jiraData?.length > 0 && <Task taskType="jira" day={day} tasks={jiraData} />}
            {gitlabData?.length > 0 && <Task taskType="gitlab" day={day} tasks={gitlabData} />}
            {meetingData?.length > 0 && <Task taskType="meeting" day={day} tasks={meetingData} />}
            {jiraData.length === 0 && gitlabData.length === 0 && meetingData.length === 0 && (
              <div className={styles.noData}>작업이 없습니다.</div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DailySchedule;
