import React from 'react';
import styles from './EmptyProjectList.module.css';
import useTeamStore from '@/features/project/stores/useTeamStore';

const EmptyProjectList: React.FC = () => {
  const { resetStore } = useTeamStore();

  return (
    <div className={styles.container}>
      <h2 className={styles.message}>프로젝트가 없습니다.</h2>
      <div className={styles.options}>
        <div
          className={styles.option}
          onClick={() => {
            resetStore();
            window.location.href = '/project/create';
          }
        }>
          <p>팀원이 있으신가요?</p>
          <button className={styles.navigateButton}>프로젝트 생성으로 이동</button>
        </div>
        <div className={styles.option} onClick={() => window.location.href = '/team-building/create'}>
          <p>팀원이 없으신가요?</p>
          <button className={styles.navigateButton}>팀생성페이지로 이동</button>
        </div>
      </div>
    </div>
  );
};

export default EmptyProjectList;
