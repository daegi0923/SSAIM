import { useParams, useNavigate  } from 'react-router-dom';
import styles from './MeetingDetailPage.module.css';
import ProjectHeader from '../../../features/project/components/ProjectHeader';
import MeetingDetail from '../../../features/project/components/meeting/MeetingDetail';
import { RxHamburgerMenu } from "react-icons/rx";

const ProjectMeetingPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  

  const handleMoveClick = () => {
    navigate(`/project/${projectId}/meeting`);
  };

  return (
    <div>
      <ProjectHeader projectId={projectId as string} />
      <div className={styles.move} onClick={handleMoveClick}>
        목록
        <RxHamburgerMenu />
      </div>
      <MeetingDetail/>
    </div>
  );
};

export default ProjectMeetingPage;
