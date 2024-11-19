// import React from 'react';
import { useParams } from 'react-router-dom';
import ProjectHeader from '../../features/project/components/ProjectHeader';
import WeeklySprint from '../../features/project/components/sprint/WeeklySprint';
import styles from './ProjectSprintPage.module.css'
const ProjectSprintPage = () => {
  const { projectId } = useParams<{ projectId: string }>();

  return (
    <div className={styles.pageContainer}>
      <ProjectHeader projectId={projectId as string} />
      <WeeklySprint />
    </div>
  );
};

export default ProjectSprintPage;
