// import React from 'react';
import { useParams } from 'react-router-dom';
import ProjectHeader from '../../../features/project/components/ProjectHeader';
import SprintCreate from '@/features/project/components/sprint/sprintCreate/SprintCreate';
// import styles from './SprintCreatePage.module.css'

const SprintCreatePage = () => {
  const { projectId } = useParams<{ projectId: string }>();

  return (
    <div>
      <ProjectHeader projectId={projectId as string} />
      <SprintCreate/>
    </div>
  );
};

export default SprintCreatePage;
