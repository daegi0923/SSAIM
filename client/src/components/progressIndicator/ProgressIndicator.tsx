import React from 'react';
import useIndicatorStore from '@/stores/useIndicatorStore';
import smallLoadingSpinner from '@/assets/loading/smallLoadingSpinner.gif';
import styles from './ProgressIndicator.module.css';

const ProgressIndicator: React.FC = () => {
  const { isUploading, elapsedTime, sprintTitle } = useIndicatorStore();

  if (!isUploading) return null; // 렌더링 방지

  return (
    <div className={styles['indicator-container']}>
      <div className={styles['indicator-message']}>
        {sprintTitle} 에 이슈를 할당중입니다.
      </div>
      <span className={styles['indicator-time']}>{elapsedTime} 초 경과</span>
      <img
        src={smallLoadingSpinner}
        alt="loading"
        className={styles['indicator-spinner']}
      />
    </div>
  );
};

export default ProgressIndicator;
