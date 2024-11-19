// SelectSpeakerModal.tsx
import { useEffect, useState } from 'react';
import styles from './SelectSpeakerModal.module.css';
import { useProjectInfo } from '@features/project/hooks/useProjectInfo';
import DefaultProfile from '@/assets/profile/DefaultProfile.png';

interface TeamMember {
  name: string;
  profileImage?: string;
}

interface SelectSpeakerModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: number;
  onSelect: (selectedMember: { label: string; name: string }) => void;
  selectedSpeaker: { label: string; name: string };
}

const SelectSpeakerModal = ({ isOpen, onClose, projectId, onSelect, selectedSpeaker }: SelectSpeakerModalProps) => {
  console.log(selectedSpeaker);
  const { data: projectInfo } = useProjectInfo(Number(projectId));
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [selectedMember, setSelectedMember] = useState(selectedSpeaker); // 선택된 참석자 상태 추가

  useEffect(() => {
    if (projectInfo) {
      setTeamMembers(projectInfo.projectMembers || []);
    }
  }, [projectInfo]);

  if (!isOpen) return null;

  const handleSelectMember = (member: TeamMember) => {
    // 선택된 member에 label 추가하여 selectedMember로 설정
    setSelectedMember({ ...member, label: selectedSpeaker.label });
  };

  const handleChangeClick = () => {
    if (selectedMember) {
      onSelect(selectedMember); // API 호출을 위해 onSelect에 Speaker 객체 한 개 전달
    }
    onClose(); // 모달 닫기
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.contentTitle}>
          <h3 className={styles.h3}>참석자 변경</h3>
          <div className={styles.closeButton} onClick={onClose}> x </div>
        </div>
        <ul className={styles.teamList}>
          {teamMembers.map((member, index) => (
            <li
              key={index}
              className={`${styles.teamMember} ${selectedMember.name === member.name ? styles.selected : ''}`} // 수정 부분
              onClick={() => handleSelectMember(member)}
            >
              <img src={member.profileImage || DefaultProfile} alt={member.name} className={styles.profileImage} />
              <span>{member.name}</span>
            </li>
          ))}
        </ul>

        <button onClick={handleChangeClick} className={styles.changeButton}>
          변경
        </button>
      </div>
    </div>
  );
};

export default SelectSpeakerModal;
