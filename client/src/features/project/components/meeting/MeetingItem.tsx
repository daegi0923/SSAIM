import React from 'react';
import styles from './MeetingItem.module.css';
import { MeetingItemDTO } from '../../types/meeting/MeetingDTO';
import meetingIcon from '../../../../assets/meeting/meetingIcon.png'
import {formatMeetingTime, formatMeetingDuration} from '../../utils/meetingTime';

interface MeetingItemProps {
  meeting: MeetingItemDTO;
  onClick?: (meeting: MeetingItemDTO) => void;
}

const MeetingItem: React.FC<MeetingItemProps> = ({ meeting, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(meeting);
    }
  };

  return (
    <div className={styles.meetingItem} onClick={handleClick}>
      <img src={meetingIcon} alt="Meeting Icon" className={styles.meetingIcon}/>
      <div className={styles.meetingContent}>
        <div className={styles.meetingHeader}>
          <h3 className={styles.h3}>{meeting.meetingTitle}</h3>
          <div className={styles.meetingDescription}>{meeting.meetingFirstVoiceText}</div>
        </div>
        <div className={styles.meetingTime}>
          {formatMeetingTime(meeting.meetingCreateTime)} 
        </div>
        <div className={styles.meetingMeta}>
          {meeting.meetingVoiceTime === -1 ? "알 수 없음" : formatMeetingDuration(meeting.meetingVoiceTime)}
        </div>
      </div>
    </div>
  );
};

export default MeetingItem;