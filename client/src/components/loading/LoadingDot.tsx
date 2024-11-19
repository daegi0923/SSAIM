import React from 'react';
import styles from './LoadingDot.module.css';
import Lottie from "lottie-react";
import LoadingDots from '@/assets/loading/LoadingDots.json';

const LoadingDot: React.FC = () => {
  return (
    <div className={styles.loadingContainer}>
      <Lottie animationData={LoadingDots} style={{ width: 100, height: 100 }} loop={true} />
      {/* <div className={styles.loadingText}>Loading...</div> */}
    </div>
  );
};

export default LoadingDot;
