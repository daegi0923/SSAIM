import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './MeetingModal.module.css';
import Button from '../../../../components/button/Button'
import DefaultProfile from '@/assets/profile/DefaultProfile.png';
import { useProjectInfo } from '@features/project/hooks/useProjectInfo';


interface MeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Participant {
  id: number;
  name: string;
  imageUrl: string;
  selected?: boolean;
}

const MeetingModal: React.FC<MeetingModalProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const { projectId } = useParams<{ projectId: string }>();
    const { data: projectInfo } = useProjectInfo(Number(projectId));
    console.log("projectInfo",projectInfo);
    
    // 회의 제목을 위한 state 추가
    const [meetingTitle, setMeetingTitle] = useState<string>('');
    const [participants, setParticipants] = useState<Participant[]>([]);

    useEffect(() => {
      if (projectInfo && projectInfo.projectMembers) {
        const mappedParticipants = projectInfo.projectMembers.map(member => ({
          id: member.pmId, // pmId를 id로 사용
          name: member.name,
          imageUrl: member.profileImage || DefaultProfile, // profileImage가 없을 경우 DefaultProfile 사용
          selected: false
        }));
        setParticipants(mappedParticipants);
      }
    }, [projectInfo]);

    const areAllSelected = participants.every(participant => participant.selected);

    const handleSelectAll = () => {
      setParticipants(participants.map(participant => ({
        ...participant,
        selected: !areAllSelected
      })));
    };

    const handleParticipantSelect = (participantId: number) => {
      setParticipants(participants.map(participant => 
        participant.id === participantId
          ? { ...participant, selected: !participant.selected }
          : participant
      ));
    };

    // 회의 제목 입력 핸들러
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setMeetingTitle(e.target.value);
    };

    const handleButtonClick = () => {
      // 선택된 참가자만 필터링
      const selectedParticipants = participants.filter(participant => participant.selected);
      console.log('회의 생성 정보: ',meetingTitle, selectedParticipants)
      
      // state를 query parameter로 전달
      navigate(`/project/${projectId}/meeting/create`, {
        state: {
          meetingTitle,
          selectedParticipants
        }
      });
    };

    if (!isOpen) return null;

    return (
      <div className={styles.modalOverlay} onClick={onClose}>
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <button className={styles.closeButton} onClick={onClose}>
            &times;
          </button>
          <h2 className={styles.h2}>회의 정보 입력</h2>
          <div className={styles.inputContainer}>
              <div className={styles.inputTitle}>
                  <label>회의 제목 : </label>
                  <div className={styles.inputWithCounter}>
                    <input 
                      type="text"
                      value={meetingTitle}
                      onChange={handleTitleChange}
                      placeholder="회의 제목을 입력하세요"
                      className={styles.inputTitleInput}
                      maxLength={11}  // 최대 글자 수를 12로 제한
                    />
                    <span className={styles.charCount}>{meetingTitle.length}/12</span>
                  </div>
              </div>
              <div className={styles.inputParticipants}>
                  <div className={styles.labelParticipants}>
                      <label>참가자 : </label>
                      <p 
                        className={styles.p}
                        onClick={handleSelectAll}
                        style={{ cursor: 'pointer' }}
                      >
                        {areAllSelected ? '전체 해제' : '전체 선택'}
                      </p>
                  </div>
                  <div className={styles.selectParticipants}>
                      {participants.map((participant) => (
                          <div key={participant.id} className={styles.participantItem}>
                              <input
                                  type="checkbox"
                                  id={`participant-${participant.id}`}
                                  className={styles.participantCheckbox}
                                  checked={participant.selected}
                                  onChange={() => handleParticipantSelect(participant.id)}
                              />
                              <label 
                                  htmlFor={`participant-${participant.id}`}
                                  className={styles.participantLabel}
                              >
                                <img 
                                    src={participant.imageUrl} 
                                    alt={participant.name}
                                    className={styles.participantImage}
                                />
                                <span className={styles.participantName}>{participant.name}</span> 
                              </label>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
          <Button size="medium" colorType="green" onClick={handleButtonClick}>회의 시작하기</Button>
        </div>
      </div>
    );
};

export default MeetingModal;