import React, { useEffect, useState  } from 'react';
import styles from './FilterHeader.module.css';
import { FaRegClock } from "react-icons/fa6";
import { IoSunny } from "react-icons/io5";
import { MdOutlineViewWeek } from "react-icons/md";
import Button from '../../../../../components/button/Button';
import DefaultProfile from '@/assets/profile/DefaultProfile.png';
import { useProjectInfo } from '@features/project/hooks/useProjectInfo';
import { ProjectInfoMemberDTO } from '@features/project/types/ProjectDTO';

interface FilterHeaderProps {
  dayWeek: string;
  setDayWeek: (value: string) => void;
  myTeam: string;
  setMyTeam: (value: string) => void;
  formattedDate: string;
  projectId: number;
  onMemberClick: (pmId: number) => void;
}

const FilterHeader: React.FC<FilterHeaderProps> = ({ dayWeek, setDayWeek, myTeam, setMyTeam, formattedDate, projectId, onMemberClick  }) => {
  const { data: projectInfo } = useProjectInfo(projectId);
  const [selectedPmId, setSelectedPmId] = useState<number | null>(null);
  const [hoveredMemberName, setHoveredMemberName] = useState<string | null>(null);
  console.log("projectId", projectId);
  console.log("projectInfo",projectInfo);

  // 기본 pmId 설정
  useEffect(() => {
    if (projectInfo?.projectMembers?.length && selectedPmId === null) {
      const firstPmId = Math.min(...projectInfo.projectMembers.map((member:ProjectInfoMemberDTO) => member.pmId));
      setSelectedPmId(firstPmId);
      onMemberClick(firstPmId);
    }
  }, [projectInfo, selectedPmId, onMemberClick]);


  const handleMouseEnter = (name: string) => {
    setHoveredMemberName(name);
  };

  const handleMouseLeave = () => {
    setHoveredMemberName(null);
  };

  const handleMemberClick = (pmId: number) => {
    setSelectedPmId(pmId);  // 클릭 시 선택된 멤버의 ID를 설정
    onMemberClick(pmId);     // 부모로 이벤트 전달
  };

  return (
    <div className={styles.filterHeader}>
      <div className={styles.dateTitle}>
        <FaRegClock style={{ strokeWidth: 4, color: "#007bff" }} />
        {formattedDate}
        {dayWeek === '1주일' && myTeam === '팀원 회고' && (
          <div className={styles.members}>
            {projectInfo?.projectMembers?.map((member: ProjectInfoMemberDTO) => (
              <div
                key={member.pmId}
                className={styles.teamMember}
                onClick={() => handleMemberClick(member.pmId)}
                onMouseEnter={() => handleMouseEnter(member.name)}
                onMouseLeave={handleMouseLeave}
              >
                
                <img 
                  src={member.profileImage || DefaultProfile} 
                  className={`${styles.memberImage} ${selectedPmId === member.pmId ? styles.selected : ''}`} 
                />
                {hoveredMemberName === member.name && (
                  <div className={styles.tooltip}>{member.name}</div>
                )}
              </div>
            ))}
         </div>
        )}
      </div>
      <div className={styles.filter}>
        <div className={styles.dayWeek}>
          <div onClick={() => setDayWeek('1일')} className={dayWeek === '1일' ? styles.active : styles.disactive}>
            <IoSunny />
            1일
          </div>
          <div onClick={() => setDayWeek('1주일')} className={dayWeek === '1주일' ? styles.active : styles.disactive}>
            <MdOutlineViewWeek /> 
            1주일
          </div>
        </div>
        <div className={styles.myTeam}>
        <Button 
            size="xsmall" 
            colorType={myTeam === '나의 회고' ? 'blue' : 'white'} 
            onClick={() => setMyTeam('나의 회고')}
          >
            나의 회고
          </Button>
          <Button 
            size="xsmall" 
            colorType={myTeam === '팀원 회고' ? 'blue' : 'white'} 
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
