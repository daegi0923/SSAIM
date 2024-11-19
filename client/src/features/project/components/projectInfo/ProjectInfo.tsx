import styles from './ProjectInfo.module.css';
import ProgressChart from '../dashboard/progressChart/ProgressChart';
import EditProjectInfoModal from './editProjectInfo/EditProjectInfo';
import { useState } from 'react';
import { useProjectInfo } from '@features/project/hooks/useProjectInfo';
import { ProjectInfoMemberDTO } from '../../types/ProjectDTO';
import { dateToString } from '@/utils/dateToString';
import leaderCrown from '@/assets/project/leaderCrown.png';
import EditProjectSetting from './editProjectSetting/EditProjectSetting';
import { TiDocumentText } from 'react-icons/ti';
import jiraIcon from '@/assets/jira.svg';
import gitlabIcon from '@/assets/gitlab.svg';
import defaultTeamIcon from '@/assets/project/defaultTeamIcon.png';
import useUserStore from '@/stores/useUserStore';
import { DashboardButtonGrid } from '@features/project/components/dashboard/dashboardLayout/DashboardLayout';
import defaultProfile from '@/assets/profile/DefaultProfile.png'


interface ProjectInfoProps {
  projectId: number;
}

const ProjectInfo: React.FC<ProjectInfoProps> = ({ projectId }) => {
  const { userId } = useUserStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditJiraModalOpen, setIsEditJiraModalOpen] = useState(false);
  const [isEditGitlabModalOpen, setIsEditGitlabModalOpen] = useState(false);
  const { data: projectInfo } = useProjectInfo(projectId);
  const chartsData = [
    { label: 'Backend', progress: projectInfo?.progressBack || 0 },
    { label: 'Frontend', progress: projectInfo?.progressFront || 0 },
  ];
  const isTeamLeader = projectInfo?.projectMembers.find((member) => member.userId === userId)?.role === 1;
  console.log(projectId);
  console.log(projectInfo);
  const linkMap: Record<string, string|null> = {
    Jira: projectInfo?.jiraUrl || null,
    Gitlab: projectInfo?.gitlabUrl || null,
    Figma: projectInfo?.figmaUrl || null,
    Notion: projectInfo?.notionUrl || null,
  };

  return (
    <div className={styles.projectInfoContainer}>
      <div className={styles.leftSection}>
        <div className={styles.projectDetails}>
          <img
            src={projectInfo?.projectImage || defaultTeamIcon}
            alt="프로젝트 프로필"
            className={styles.projectImage}
          />
          <div className={styles.projectText}>
            <h2>{projectInfo?.name}</h2>
            <p>
              프로젝트 기간: {dateToString(projectInfo?.startDate)} ~ {dateToString(projectInfo?.endDate)}
            </p>
            <div className={styles.dates}>
              {/* <span>프로젝트 생성일: {projectInfo.createdAt}</span>
              <span>최근 수정일: {projectInfo.modifiedAt}</span> */}
            </div>
          </div>
          {isTeamLeader ? (
            <div className={styles.modifyButtons}>
              <span
                className={styles.modify}
                onClick={() => {
                  setIsEditModalOpen(true);
                }}
              >
                <TiDocumentText className={styles.icons} />
              </span>
              <span
                className={styles.modify}
                onClick={() => {
                  setIsEditJiraModalOpen(true);
                }}
              >
                <img src={jiraIcon} alt="" className={styles.icons} />
              </span>
              <span
                className={styles.modify}
                onClick={() => {
                  setIsEditGitlabModalOpen(true);
                }}
              >
                <img src={gitlabIcon} alt="" className={styles.icons} />
              </span>
            </div>
          ) : null}
        </div>

        <div className={styles.leftLowerSection}>
          <DashboardButtonGrid linkMap={linkMap} />
          <div className={styles.componentArea}>
            <ProgressChart chartsData={chartsData} />
          </div>
        </div>
      </div>

      <div className={styles.rightSection}>
        <h3>팀원 정보</h3>
        <div className={styles.teamMembers}>
          {projectInfo?.projectMembers
            ?.sort((member) => -member.role)
            .map((member: ProjectInfoMemberDTO) => {
              console.log(member.name, member.role);
              return (
                <div key={member.userId} className={styles.teamMember}>
                  {member.role === 1 ? (
                    <img src={leaderCrown} alt="leaderCrown" className={styles.leaderCrown} />
                  ) : null}
                  <img src={member.profileImage? member.profileImage : defaultProfile} alt={member.name} className={styles.memberImage} />
                  <span>{member.name}</span>
                  {member.role === 1 ? <span className={styles.leaderBadge}>팀장</span> : null}
                </div>
              );
            })}
        </div>
      </div>
      {isEditModalOpen && projectInfo && (
        <EditProjectInfoModal projectInfo={projectInfo} onClose={() => setIsEditModalOpen(false)} />
      )}
      {isEditJiraModalOpen && (
        <EditProjectSetting projectId={projectId} type={'jira'} onClose={() => setIsEditJiraModalOpen(false)} />
      )}
      {isEditGitlabModalOpen && (
        <EditProjectSetting projectId={projectId} type={'gitlab'} onClose={() => setIsEditGitlabModalOpen(false)} />
      )}
    </div>
  );
};

export default ProjectInfo;
