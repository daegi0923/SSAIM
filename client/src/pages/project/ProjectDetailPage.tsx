// import React from 'react';
import { useParams } from 'react-router-dom';
import ProjectHeader from '../../features/project/components/ProjectHeader';
import ProjectInfo from '../../features/project/components/projectInfo/ProjectInfo';


const ProjectDetailPage = () => {
  const { projectId } = useParams<{ projectId: string }>();

  return (
    <div>
      <ProjectHeader projectId={projectId as string} />
      <ProjectInfo projectId={Number(projectId)}/>
    </div>
  );
};

export default ProjectDetailPage;
