import { useParams } from 'react-router-dom';
import styles from './ProjectRemindCreatePage.module.css';
import ProjectHeader from '../../features/project/components/ProjectHeader';
import DayMyCreate from '../../features/project/components/remind/daily/dayMy/DayMyCreate';



const ProjectRemindCreatePage = () => {
  const { projectId } = useParams<{ projectId: string }>();


  return (
    <div className={styles.pageContainer}>
      <ProjectHeader projectId={projectId as string} />
      <DayMyCreate />
      
    </div>
  );
};

export default ProjectRemindCreatePage;
