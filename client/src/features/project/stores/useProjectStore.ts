import { create } from 'zustand';
import { ProjectDTO } from '@features/project/types/ProjectDTO';

interface ProjectWithWeeks extends ProjectDTO {
  weeks: Array<{ startDate: Date; endDate: Date }>;
}

interface ProjectState {
  projectList: ProjectWithWeeks[];
  setProjectList: (projectList: ProjectDTO[]) => void;
}

// 주차 리스트 계산 함수 (금요일 ~ 다음 주 금요일 기준)
const calculateWeeks = (start: Date, end: Date): Array<{ startDate: Date; endDate: Date }> => {
  const weeks = [];
  const currentStart = new Date(start);

  // 시작일이 월~목이면 그 전주의 금요일로 설정
  if (currentStart.getDay() >= 1 && currentStart.getDay() <= 4) {
    currentStart.setDate(currentStart.getDate() - (currentStart.getDay() + 2)); // 월요일은 -3, 화요일은 -4, 수요일은 -5, 목요일은 -6
  } else if (currentStart.getDay() === 6) {
    // 토요일이면 그 주의 금요일로 설정
    currentStart.setDate(currentStart.getDate() - 1);
  } else if (currentStart.getDay() === 0) {
    // 일요일이면 그 주의 금요일로 설정
    currentStart.setDate(currentStart.getDate() - 2);
  }

  while (currentStart <= end) {
    const weekEnd = new Date(currentStart);
    weekEnd.setDate(currentStart.getDate() + 6); // 금요일에서 다음 주 금요일까지

    weeks.push({
      startDate: new Date(currentStart),
      endDate: weekEnd > end ? new Date(end) : weekEnd,
    });

    currentStart.setDate(currentStart.getDate() + 7); // 다음 주 금요일로 이동
  }

  return weeks;
};

const useProjectStore = create<ProjectState>((set) => ({
  projectList: [],
  setProjectList: (projectList) => {
    const projectListWithWeeks = projectList.map((project) => ({
      ...project,
      weeks: calculateWeeks(new Date(project.startDate as Date), new Date(project.endDate as Date)),
    }));
    set({ projectList: projectListWithWeeks });
    console.log(projectListWithWeeks)
  },
}));

export default useProjectStore;
