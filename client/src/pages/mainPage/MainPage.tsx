import styles from './MainPage.module.css';
import DashboardLayout from '@/features/project/components/dashboard/dashboardLayout/DashboardLayout';
const MainPage = () => {
  return (
    <div className={styles.layout}>
      <DashboardLayout />
    </div>
  );
};

export default MainPage;
