import React from 'react';
import styles from './FilterHeader.module.css';
import { FaRegClock } from "react-icons/fa6";
import Button from '../../../../../components/button/Button';

interface FilterHeaderProps {
  myTeam: string;
  setMyTeam: (value: string) => void;
  formattedDate: string;
}

const FilterHeader: React.FC<FilterHeaderProps> = ({ myTeam, setMyTeam, formattedDate }) => {
  return (
    <div className={styles.filterHeader}>
      <div className={styles.dateTitle}>
        <FaRegClock style={{ strokeWidth: 4, color: "#913BF6" }} />
        {formattedDate}
      </div>
      <div className={styles.filter}>
        <div className={styles.myTeam}>
        <Button 
            size="xsmall" 
            colorType={myTeam === '나의 회고' ? 'purple' : 'white'} 
            onClick={() => setMyTeam('나의 회고')}
          >
            나의 회고
          </Button>
          <Button 
            size="xsmall" 
            colorType={myTeam === '팀원 회고' ? 'purple' : 'white'} 
            onClick={() => setMyTeam('팀원 회고')}
          >
            팀원 회고
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterHeader;
