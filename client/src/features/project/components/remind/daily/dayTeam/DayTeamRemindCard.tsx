import React from 'react';
import styles from './DayTeamRemindCard.module.css';
import DefaultProfile from '@/assets/profile/DefaultProfile.png';

interface DayTeamRemindCardProps {
  userName: string;
  userImage: string;
  reviewText: string;
}

const DayTeamRemindCard: React.FC<DayTeamRemindCardProps> = ({ userName, userImage, reviewText }) => {
  return (
    <div className={styles.DayTeamRemindCard}>
      <div className={styles.reviewTitle}>
        <img src={userImage||DefaultProfile} alt="profile" />
        <div className={styles.userName}>{userName}</div>
      </div>
      <div className={styles.reviewText}>{reviewText}</div>
    </div>
  );
};

export default DayTeamRemindCard;
