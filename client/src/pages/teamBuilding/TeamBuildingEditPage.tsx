import { useLocation } from 'react-router-dom';
import EditTeam from '../../features/teamBuilding/components/editTeam/EditTeam'
import styles from './TeamBuildingPage.module.css'

const TeamBuildingCreatePage = () => {
    const location = useLocation();
    const data = location.state?.data;

    return (
      <div className={styles.page}>
        <h1 className={styles.pageTitle}>팀 수정</h1>
        <EditTeam initialData={data} />
      </div>
    );
  };
  
  export default TeamBuildingCreatePage;