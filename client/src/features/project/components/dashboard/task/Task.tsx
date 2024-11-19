import styles from './Task.module.css';
import React from 'react';
import classNames from 'classnames';
import { TaskType } from '../../../types/dashboard/TaskTypes';
import { DayOfWeek } from '../../../types/dashboard/DayOfWeek';
import { useDashboardStore } from '../../../stores/useDashboardStore';
import { IssueDTO, TaskDTO } from '../../../types/dashboard/WeeklyDataDTO';
import { MeetingItemDTO } from '@/features/project/types/meeting/MeetingDTO';
import { FaCaretUp, FaCaretDown } from "react-icons/fa";

interface TaskProps {
  taskType: TaskType;
  day: DayOfWeek;
  tasks: TaskDTO[] | IssueDTO[] | MeetingItemDTO[];
}

const Task: React.FC<TaskProps> = ({ taskType, day, tasks }) => {
  const { taskStatus, toggleTask } = useDashboardStore();
  const isOpen = taskStatus[day][taskType]; // 현재 상태 가져오기

  const handleClick = () => {
    toggleTask(day, taskType); // 상태 토글
  };
  const title = taskType.charAt(0).toUpperCase() + taskType.slice(1)
  return (
    <>
      <div onClick={handleClick} className={classNames(styles.taskTitle, styles[`${taskType}-title`])}>
        <span>{title}</span>
        <span>{isOpen ? <FaCaretUp /> : <FaCaretDown />}</span>
      </div>
      {isOpen &&
        tasks.map((task, index) => (
          <div key={index} className={`${styles.task} ${styles[taskType]}`}>
            {taskType === 'jira'
              ? (task as IssueDTO).summary
              : taskType === 'meeting'
              ? (task as MeetingItemDTO).meetingTitle
              : taskType === 'gitlab'
              ? (task as TaskDTO).title
              : null}
          </div>
        ))}
    </>
  );
};

export default Task;
