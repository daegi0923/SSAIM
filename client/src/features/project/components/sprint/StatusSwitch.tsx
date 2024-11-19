import React from 'react';
import styles from './StatusSwitch.module.css';

interface StatusSwitchProps {
  status: "해야 할 일" | "진행 중" | "완료";
  onChange: (status: 'todo' | 'inProgress' | 'done') => void;
}

const StatusSwitch: React.FC<StatusSwitchProps> = ({ status, onChange }) => {
  console.log(status)
  return (
    <div className={styles.switchContainer}>
      
      <button
        className={`${styles.switchButton} ${
          status === '해야 할 일' ? `${styles.active} ${styles.todo}` : ''
        }`}
        onClick={() => onChange('todo')}
      >
        할일
      </button>
      <button
        className={`${styles.switchButton} ${
          status === '진행 중' ? `${styles.active} ${styles.inProgress}` : ''
        }`}
        onClick={() => onChange('inProgress')}
      >
        진행
      </button>
      <button
        className={`${styles.switchButton} ${
          status === '완료' ? `${styles.active} ${styles.done}` : ''
        }`}
        onClick={() => onChange('done')}
      >
        완료
      </button>
    </div>
  );
};

export default StatusSwitch;
