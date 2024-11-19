import React, { useState, useEffect } from 'react';
import styles from './SprintModal.module.css';
import Button from '../../../../../components/button/Button';
import { useDailyRemind } from '@features/project/hooks/remind/useDailyRemind';
import { DailyRemindGetDTO } from '@features/project/types/remind/DailyRemindDTO';
import usePmIdStore from '@/features/project/stores/remind/usePmIdStore';
import { createSprintRemind } from '@features/project/apis/remind/createSprintRemind';
import { useSprintRemind } from '@/features/project/hooks/remind/useSprintRemind';
import { dateToWeek } from '@/utils/dateToWeek';
import Loading from '@/components/loading/Loading';

interface SprintModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: number; // 필요한 projectId를 prop으로 받음
}

interface SprintOption {
  id: string;
  label: string;
  period: string;
  startDate: string;
  endDate: string;
}

const getMonday = (date: Date): Date => {
  const day = date.getDay();
  const difference = (day === 0 ? -6 : 1) - day; // 일요일(0)을 기준으로 월요일을 계산
  const monday = new Date(date);
  monday.setDate(date.getDate() + difference);
  return monday;
};

const getFriday = (date: Date): Date => {
  const monday = getMonday(date); // 월요일을 기준으로 금요일 계산
  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4); // 월요일에서 4일 후가 금요일
  return friday;
};

const SprintModal: React.FC<SprintModalProps> = ({ isOpen, onClose, projectId }) => {
  const { pmId } = usePmIdStore();
  const [selectedSprint, setSelectedSprint] = useState<string | null>(null);
  const [sprintOptions, setSprintOptions] = useState<SprintOption[]>([]);
  const [isLoading, setIsLoading] = useState(false); 
  

  const { data: dailyReminds } = useDailyRemind({ projectId });
  const { data: sprintReminds, refetch } = useSprintRemind({ projectId });

  const MyfilteredContents = sprintReminds?.filter((item) =>
    item.projectMemberId === pmId
  ) || [];

  useEffect(() => {
    if (dailyReminds) {
      const groupByWeek = (reminds: DailyRemindGetDTO[]): SprintOption[] => {
        const weeks: Record<string, DailyRemindGetDTO[]> = {};

        const filteredReminds = reminds.filter((remind) => remind.projectMemberId === pmId);
  
        filteredReminds.forEach((remind) => {
          const date = new Date(remind.dailyRemindDate);
          const monday = getMonday(date); // 월요일을 기준으로 주 구하기
          const friday = getFriday(date); // 금요일을 기준으로 주 구하기
          const weekKey = `${monday.getFullYear()}-${monday.getMonth() + 1}-${monday.getDate()}_${friday.getDate()}`;
          
          if (!weeks[weekKey]) weeks[weekKey] = [];
          weeks[weekKey].push(remind);
        });
  
        return Object.keys(weeks).map((weekKey, index) => {
          const weekData = weeks[weekKey];
          const firstDate = new Date(weekData[0].dailyRemindDate);
          const monday = getMonday(firstDate);
          const friday = getFriday(firstDate);

          return {
            id: `sprint${index + 1}`,
            label: dateToWeek(friday), // 금요일을 기준으로 주의 라벨 설정
            period: `${monday.toISOString().split('T')[0]} ~ ${friday.toISOString().split('T')[0]}`,
            startDate: monday.toISOString().split('T')[0],
            endDate: friday.toISOString().split('T')[0]
          };
        });
      };
      const groupedOptions: SprintOption[] = groupByWeek(dailyReminds);
      const sortedOptions: SprintOption[] = groupedOptions.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

      setSprintOptions(sortedOptions);
    }
  }, [dailyReminds, pmId]);

  const handleSprintSelect = (sprintId: string) => {
    setSelectedSprint(sprintId);
  };

  const handleCreateSprintRemind = async () => {
    if (selectedSprint && pmId !== null) {
      const selectedOption = sprintOptions.find((option) => option.id === selectedSprint);
      if (selectedOption) {
        const sprintRemindPostData = {
          projectMemberId: pmId, // pmId (프로젝트 멤버 ID)
          startDate: selectedOption.startDate, // 선택된 스프린트의 startDate
          endDate: selectedOption.endDate // 선택된 스프린트의 endDate
        };
        
        setIsLoading(true); // 로딩 시작

        try {
          const response = await createSprintRemind(projectId, sprintRemindPostData);
          console.log('Sprint Remind created:', response);
          // 성공적으로 생성된 후 모달 닫기
          refetch();
          onClose();
        } catch (error) {
          console.error('Error creating sprint remind:', error);
        } finally {
          setIsLoading(false); // 로딩 종료
        }
      }
    }
  };

  const isOptionDisabled = (startDate: string) => {
    return MyfilteredContents.some((content) => content.startDate === startDate);
  };


  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h2 className={styles.h2}>주간 회고 생성</h2>
        <p className={styles.p}>프로젝트명</p>
        <div className={styles.selectBox}>
          <p className={styles.description}>이미 생성한 주차는 선택할 수 없습니다. ‘다시 생성하기’를 이용해 주세요.</p>
          <div className={styles.sprintOptions}>
            {sprintOptions.map((sprint) => (
              <label key={sprint.id} className={styles.sprintOption}>
                <div className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={selectedSprint === sprint.id}
                    onChange={() => handleSprintSelect(sprint.id)}
                    disabled={isOptionDisabled(sprint.startDate)}
                  />
                  <div className={styles.sprintInfo}>
                    <div className={styles.sprintLabel}>{sprint.label}</div>
                    <div className={styles.sprintPeriod}>{sprint.period}</div>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>
        {isLoading ? (
          <Loading />
        ) : (
          <Button size="medium" colorType="purple" onClick={handleCreateSprintRemind}>
            주간 회고 생성하기
          </Button>
        )}
      </div>
    </div>
  );
};

export default SprintModal;
