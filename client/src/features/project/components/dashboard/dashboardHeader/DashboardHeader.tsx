import { useProjectListData } from '@/features/project/hooks/useProjectListData';
import styles from './DashboardHeader.module.css';
import React, { useEffect } from 'react';
import useUserStore from '@/stores/useUserStore';
import { useDashboardStore } from '@/features/project/stores/useDashboardStore';
import { dateToString } from '@/utils/dateToString';
import { IoIosArrowDropleft, IoIosArrowDropright } from 'react-icons/io';

const DashboardHeader: React.FC = () => {
  const { userId } = useUserStore();
  const { data: projectListData } = useProjectListData(userId);
  const { projectId, setProjectId, setProjectWeek, currentWeek, projectWeekList, setCurrentWeek } = useDashboardStore();
  // 선택된 프로젝트의 제목 가져오기
  const selectedProject = projectListData?.find((project) => project.id === projectId);
  const projectTitle = selectedProject ? selectedProject.title : '프로젝트 선택';
  console.log(projectTitle);
  // 초기 상태 설정: projectId와 currentWeek 설정
  useEffect(() => {
    if (projectListData && projectListData.length > 0 && projectId === -1) {
      const lastProject = projectListData.sort((a, b) => {
        const startA = a.startDate ? new Date(a.startDate).getTime() : 0;
        const startB = b.startDate ? new Date(b.startDate).getTime() : 0;
        return startA - startB;
      })[projectListData.length - 1];
      setProjectId(Number(lastProject.id));
      const { startDate, endDate } = lastProject;
      if (startDate && endDate) {
        setProjectWeek(new Date(startDate), new Date(endDate));
      }
    }
  }, [projectListData, projectId]);

  useEffect(() => {
    if (projectWeekList && projectWeekList.length > 0) {
      let flag = 0;
      for (let i = 0; i < projectWeekList.length; i++) {
        const year = projectWeekList[i].endDate.getFullYear();
        const month = projectWeekList[i].endDate.getMonth();
        const day = projectWeekList[i].endDate.getDate();
        if (new Date(year, month, day - 3) <= new Date() && new Date() <= new Date(year, month, day + 3)) {
          setCurrentWeek(i);
          flag = 1;
          break;
        }
      }
      if (!flag) {
        setCurrentWeek(projectWeekList.length - 1);
      }
    }
  }, [projectWeekList, setCurrentWeek]);
  const year = projectWeekList[currentWeek]?.endDate.getFullYear();
  const month = projectWeekList[currentWeek]?.endDate.getMonth();
  const day = projectWeekList[currentWeek]?.endDate.getDate();
  const dateMon = dateToString(new Date(year, month, day - 3));
  const dateSun = dateToString(new Date(year, month, day + 3));
  const handleProjectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedProjectId = Number(event.target.value);
    setProjectId(selectedProjectId);

    const selectedProject = projectListData?.find((e) => e.id === selectedProjectId);

    if (selectedProject?.startDate && selectedProject?.endDate) {
      setProjectWeek(new Date(selectedProject.startDate), new Date(selectedProject.endDate));
    } else {
      console.warn('Selected project does not have valid start or end dates.');
    }
  };
  const handleIncreaseWeek = () => {
    if (currentWeek < projectWeekList.length - 1) {
      setCurrentWeek(currentWeek + 1);
      console.log('increase', currentWeek);
    }
  };

  const handleDecreaseWeek = () => {
    if (currentWeek > 0) {
      setCurrentWeek(currentWeek - 1);
      console.log('decrease', currentWeek);
    }
  };

  return (
    <>
      <div className={styles.dashboardHeader}>
        <button className={styles.arrowButton} onClick={handleDecreaseWeek}>
          <IoIosArrowDropleft 
            color={currentWeek === 0 ? '#999' : 'black'}
            cursor={currentWeek === 0 ? 'default' : 'pointer'}
          />
        </button>
        <h1 className={styles.title}>
          {projectTitle} {currentWeek + 1}주차
        </h1>
        <button className={styles.arrowButton} onClick={handleIncreaseWeek}>
          <IoIosArrowDropright 
            color={projectWeekList.length - 1 === currentWeek ? '#999' : 'black'}
            cursor={projectWeekList.length - 1 === currentWeek ? 'default' : 'pointer'}
          />
        </button>
      </div>
      <div className={styles.dateRange}>
        <div>
          <select value={projectId} onChange={handleProjectChange} className={styles.projectSelect}>
            {projectListData?.map((project) => (
              <option key={project.id} value={project.id}>
                {project.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <span>{dateMon ?? dateMon}</span> ~ <span>{dateSun ?? dateSun}</span>
        </div>
      </div>
    </>
  );
};

export default DashboardHeader;
