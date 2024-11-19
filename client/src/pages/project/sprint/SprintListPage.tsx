// import React from 'react';
import { useParams } from 'react-router-dom';
import ProjectHeader from '../../../features/project/components/ProjectHeader';
// import styles from './SprintCreatePage.module.css'
import SprintList from '@/features/project/components/sprint/sprintList/SprintList';

const SprintListPage = () => {
  const { projectId } = useParams<{ projectId: string }>();

  return (
    <div>
      <ProjectHeader projectId={projectId as string} />
      <SprintList projectId={Number(projectId)}/>
    </div>
  );
};

export default SprintListPage;
