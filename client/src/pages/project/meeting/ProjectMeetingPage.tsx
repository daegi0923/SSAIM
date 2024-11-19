import { useParams } from 'react-router-dom';
import ProjectHeader from '../../../features/project/components/ProjectHeader';
import MeetingList from '../../../features/project/components/meeting/MeetingList';

const ProjectMeetingPage = () => {
  const { projectId } = useParams<{ projectId: string }>();

  return (
    <div>
      <ProjectHeader projectId={projectId as string} />
      <MeetingList/>
    </div>
  );
};

export default ProjectMeetingPage;
