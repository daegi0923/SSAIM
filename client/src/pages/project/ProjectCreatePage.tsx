// import React from 'react';
import ProjectCreate from '../../features/project/components/projectCreate/ProjectCreate';
import styles from './ProjectCreatePage.module.css'


const ProjectCreatePage = () => {
  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.projectTitle}>프로젝트 생성</h1>
      </div>
      <ProjectCreate/>
    </div>
  );
};

export default ProjectCreatePage;
