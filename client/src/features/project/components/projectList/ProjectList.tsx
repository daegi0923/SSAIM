import styles from './ProjectList.module.css';
import React from 'react';
import { ProjectDTO } from '../../types/ProjectDTO';
import Button from '../../../../components/button/Button';
import { useProjectListData } from '../../hooks/useProjectListData';
import { dateToString } from '../../../../utils/dateToString';
import { useNavigate } from 'react-router-dom';
import EmptyProjectList from './EmptyProjectList';
import useUserStore from '@/stores/useUserStore';
import useTeamStore from '@/features/project/stores/useTeamStore';
import defaultTeamIcon from '@/assets/project/defaultTeamIcon.png'


interface ProjectListItemProps {
  projectInfo: ProjectDTO;
  onClick: () => void;
}

const ProjectListItem: React.FC<ProjectListItemProps> = ({ projectInfo, onClick }) => {
  console.log(projectInfo);
  const teamLeader = projectInfo?.projectMembers?.find((e) => e.role === 1);
  const teamMemberNames = projectInfo?.projectMembers?.filter((e) => e.role === 0).map((e) => e.name);

  return (
    <div className={styles.projectItem} onClick={onClick}>
      <div className={styles.cardLeft}>
        {
          projectInfo?.projectImage ? 
          <img src={projectInfo?.projectImage} className={styles.profileImage} alt="thumbnail" />
          :
          <img src={defaultTeamIcon} className={styles.profileImage} alt="thumbnail" />
        }
      </div>
      <div className={styles.cardRight}>
        <h2>{projectInfo.title}</h2>
        <p>팀장 : {teamLeader?.name}</p>
        <p>팀원 : {teamMemberNames?.join(', ')}</p>
        <p>
          {dateToString(projectInfo?.startDate)} ~ {dateToString(projectInfo?.endDate)}
        </p>
      </div>
    </div>
  );
};

const ProjectList: React.FC = () => {
  const { userId } = useUserStore();
  console.log(userId);
  const { resetStore } = useTeamStore();
  const { data: projectListData } = useProjectListData(userId);
  console.log('Fetched Project List Data:', projectListData);

  // const projectListData = []
  const navigate = useNavigate();
  const handleItemClick = (projectId: number) => () => {
    navigate(`/project/${projectId}/info`);
  };
  const handleCreateClick = () => {
    resetStore()
    navigate('/project/create');
  };
  return (
    <>
      <div className={styles.header}>
        <h1 className={styles.projectTitle}>프로젝트 목록</h1>
        <div>
          {projectListData&&projectListData?.length > 0 && (
            <Button children={'프로젝트 생성'} size="small" colorType="blue" onClick={handleCreateClick} />
          )}
        </div>
      </div>
      {projectListData ? (
        projectListData.length === 0 ? (
          <EmptyProjectList />
        ) : (
          <div className={styles.body}>
            {projectListData.map((project: ProjectDTO) => (
              <ProjectListItem key={project.id} projectInfo={project} onClick={handleItemClick(project.id)} />
            ))}
          </div>
        )
      ) : (
        <p>로딩 중...</p>
      )}
    </>
  );
};

export default ProjectList;
