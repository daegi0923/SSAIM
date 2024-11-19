import React from 'react';
import styles from './Loading.module.css';
import Lottie from "lottie-react";
import Rocket from '@/assets/loading/Rocket.json'

const Loading: React.FC = () => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingBox}>
        <Lottie animationData={Rocket} style={{ width: 400, height: 400 }} />
        <div className={styles.loadingText}>Loading...</div>
      </div>
    </div>
  );
};

export default Loading;
