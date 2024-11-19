/* DashboardLayout.tsx */
// 하위 컴포넌트
import WeeklySchedule from '@features/project/components/dashboard/weeklySchedule/WeeklySchedule';
import DashboardHeader from '@features/project/components/dashboard/dashboardHeader/DashboardHeader';
import TodoList from '@features/project/components/dashboard/todoList/TodoList';
// css Module
import styles from './DashboardLayout.module.css';
// types
import useUserStore from '@/stores/useUserStore';
import { useDashboardStore } from '@/features/project/stores/useDashboardStore';
import { useProjectListData } from '@/features/project/hooks/useProjectListData';

import { toast } from 'react-toastify';
// import JiraIcon from '@/assets/jira.svg';
import GitLabIcon from '@/assets/gitlab.svg';
import FigmaIcon from '@/assets/figma.svg';
import NotionIcon from '@/assets/notion.svg';
import WhiteJiraIcon from '@/assets/navbar_icon_jira_white.svg'



const ICONS = [WhiteJiraIcon, GitLabIcon, FigmaIcon, NotionIcon]

export const DashboardButtonGrid: React.FC<{ linkMap: Record<string, string | null> }> = ({ linkMap }) => {
  const handleClickLink = (label: string) => {
    const link = linkMap[label];
    if (link) {
      window.open(link, '_blank'); // 링크가 있으면 새 탭에서 열기
    } else {
      toast.warn(`${label} 링크가 설정되지 않았습니다.`, { toastId: `${label}-link-warning` }); // 링크가 없을 때 알림
    }
  };

  return (
    <div className={styles.buttonGrid}>
      {['Jira', 'Gitlab', 'Figma', 'Notion'].map((label, index) => (
        <div
          key={label} // React의 고유 키 추가
          className={styles.gridButton}
          onClick={() => handleClickLink(label)}
        >
          <img src={ICONS[index]}></img>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
};

const DashboardLayout = () => {
  const { userId } = useUserStore();
  const { projectId } = useDashboardStore();
  const { data: projectListData } = useProjectListData(userId);
  const projectInfo = projectListData?.find((p) => p.id === projectId);
  console.log(projectInfo);
  const linkMap: Record<string, string|null> = {
    Jira: projectInfo?.jiraUrl || null,
    Gitlab: projectInfo?.gitlabUrl || null,
    Figma: projectInfo?.figmaUrl || null,
    Notion: projectInfo?.notionUrl || null,
  };

  return (
    <div className={styles.layout}>
      <DashboardHeader />
      <WeeklySchedule weeklyStartDate={new Date('2024-10-30')} />
      <div className={styles.dashboardBottom}>
        <div className={styles.chartContainer}>
        <DashboardButtonGrid linkMap={linkMap} />
        </div>
        <TodoList />
      </div>
    </div>
  );
};

export default DashboardLayout;