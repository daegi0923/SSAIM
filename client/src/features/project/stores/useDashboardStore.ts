// src/stores/dashboardStore.ts

import { create } from 'zustand';
import { TaskType } from '../types/dashboard/TaskTypes';
import { DayOfWeek } from '../types/dashboard/DayOfWeek';
// import { ProjectDTO} from '../types/ProjectDTO';
import calculateWeeks from '../utils/calculateWeeks';
interface DashboardState {
  // projectInfo : ProjectDTO;
  projectId: number;
  setProjectId: (id: number) => void;
  currentWeek: number;
  setCurrentWeek: (idx: number) => void;
  projectWeekList: Array<{ startDate: Date; endDate: Date }>;
  setProjectWeek: (startDate: Date, endDate: Date) => void;
  weekdayIndex: { [key: string]: number };
  taskStatus: {
    [day in DayOfWeek]: {
      [task in TaskType]: boolean;
    };
  };
  startDate: string; // 현재 주의 시작 날짜 추가
  // endDate : string;
  setStartDate: (date: string) => void; // 날짜를 업데이트하는 함수
  toggleTask: (day: DayOfWeek, taskType: TaskType) => void;
  resetTaskStatus: () => void;
}

// Zustand store 생성
export const useDashboardStore = create<DashboardState>((set) => ({
  projectId: -1,
  setProjectId: (id) => {
    set(() => ({ projectId: id }));
    console.log(id);
  },
  currentWeek: 0,
  setCurrentWeek: (idx) => {
    set((state) => {
      state.resetTaskStatus();
      return { currentWeek: idx };
    });
    console.log(idx);
  },
  projectWeekList: [],
  setProjectWeek: (start?: Date, end?: Date) => {
    if (start && end) {
      // start와 end가 모두 정의된 경우에만 실행
      const weeks = calculateWeeks(start, end);
      set({ projectWeekList: weeks });
      set({ currentWeek: weeks.length - 1 });
      console.log(calculateWeeks(start!, end!));
    } else {
      console.warn('Invalid date range provided');
    }
  },

  weekdayIndex: {
    Monday: 0,
    Tuesday: 1,
    Wednesday: 2,
    Thursday: 3,
    Friday: 4,
    Saturday: 5,
    Sunday: 6,
  },

  taskStatus: {
    Monday: { jira: true, gitlab: true, meeting: true },
    Tuesday: { jira: true, gitlab: true, meeting: true },
    Wednesday: { jira: true, gitlab: true, meeting: true },
    Thursday: { jira: true, gitlab: true, meeting: true },
    Friday: { jira: true, gitlab: true, meeting: true },
    Saturday: { jira: true, gitlab: true, meeting: true },
    Sunday: { jira: true, gitlab: true, meeting: true },
},
  toggleTask: (day, taskType) =>
    set((state) => ({
      taskStatus: {
        ...state.taskStatus,
        [day]: {
          ...state.taskStatus[day],
          [taskType]: !state.taskStatus[day][taskType],
        },
      },
    })),
  startDate: '2024-10-28', // 초기값 설정
  setStartDate: (date) => set(() => ({ startDate: date })), // startDate 업데이트 함수
  resetTaskStatus: () => {
    set(() => ({
      taskStatus: {
        Monday: { jira: true, gitlab: true, meeting: true },
        Tuesday: { jira: true, gitlab: true, meeting: true },
        Wednesday: { jira: true, gitlab: true, meeting: true },
        Thursday: { jira: true, gitlab: true, meeting: true },
        Friday: { jira: true, gitlab: true, meeting: true },
        Saturday: { jira: true, gitlab: true, meeting: true },
        Sunday: { jira: true, gitlab: true, meeting: true },
          },
    }));
  },
}));
