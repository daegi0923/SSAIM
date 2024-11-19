import { useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './ProjectRemindPage.module.css';
import ProjectHeader from '../../features/project/components/ProjectHeader';
import DailyContainer from '../../features/project/components/remind/daily/DailyContainer';
import SprintContainer from '../../features/project/components/remind/sprint/SprintContainer';


const ProjectRemindPage = () => {
  const { projectId } = useParams<{ projectId: string }>();

  const [isDaily, setIsDaily] = useState(true);

  return (
    <div className={styles.pageContainer}>
      <ProjectHeader
        projectId={projectId as string}
        isDaily={isDaily}
        setIsDaily={setIsDaily} // 선택적으로 전달
      />
      {isDaily ? <DailyContainer /> : <SprintContainer />}
    </div>
  );
};

export default ProjectRemindPage;
