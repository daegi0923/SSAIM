// src/stores/dashboardStore.ts

import { create } from 'zustand';
import { IssueCreateDTO } from '../types/sprint/IssueCreateDTO';
import { GenerateIssueOnSprintRequestDTO } from '../types/sprint/GenDTO';


interface SprintIssueState {
  tempIssueList: GenerateIssueOnSprintRequestDTO[];
  initializeTempIssueList: (startDate: Date, endDate: Date) => void;
  addIssue: (day: Date, issue: IssueCreateDTO) => void;
  deleteIssue: (day: Date, issueSummary: string) => void;
  updateIssue: (day: Date, updatedIssue: IssueCreateDTO) => void;
  resetTempIssueList: () => void;
}

// 날짜를 'YYYY-MM-DD' 형식으로 변환하는 함수
const formatDate = (date: Date) => {
  return date.toISOString().split('T')[0]; // 'YYYY-MM-DD' 형식으로 반환
};

// Zustand store 생성
export const useSprintIssueStore = create<SprintIssueState>((set) => ({
  tempIssueList: [],

  // 초기화 함수: 시작 날짜와 종료 날짜를 받아 tempIssueList를 초기화
  initializeTempIssueList: (startDate, endDate) => {
    const tempList: GenerateIssueOnSprintRequestDTO[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      tempList.push({
        day: formatDate(currentDate),
        tasks: [],
      });
      currentDate.setDate(currentDate.getDate() + 1); // 다음 날짜로 이동
    }

    set({ tempIssueList: tempList });
  },

  // 이슈 추가
  addIssue: (day, issue) => {
    const formattedDay = formatDate(day);
    set((state) => {
      const updatedList = state.tempIssueList.map((temp) =>
        temp.day === formattedDay
          ? {
              ...temp,
              tasks: [
                ...temp.tasks,
                { ...issue, id: `${Date.now()}-${Math.random()}` }, // 간단한 id 생성
              ],
            }
          : temp
      );

      console.log('Updated tempIssueList:', updatedList);

      return {
        tempIssueList: updatedList,
      };
    });
  },

  // 이슈 삭제
  deleteIssue: (day, issueSummary) => {
    const formattedDay = formatDate(day);
    set((state) => ({
      tempIssueList: state.tempIssueList.map((temp) =>
        temp.day === formattedDay
          ? { ...temp, tasks: temp.tasks.filter((task) => task.summary !== issueSummary) }
          : temp
      ),
    }));
  },

  // 이슈 업데이트
  updateIssue: (day, updatedIssue) => {
    const formattedDay = formatDate(day);
    console.log(formattedDay)
    set((state) => {
      const updatedList = state.tempIssueList.map((temp) =>
        temp.day === formattedDay
          ? {
              ...temp,
              tasks: temp.tasks.map((task) => (task.id === updatedIssue.id ? { ...task, ...updatedIssue } : task)),
            }
          : temp
      );

      console.log('Updated tempIssueList:', updatedList); // 상태 업데이트 후 로그
      return { tempIssueList: updatedList };
    });
  },

  // 임시 이슈 목록 초기화
  resetTempIssueList: () => {
    set(() => ({ tempIssueList: [] }));
  },
}));
