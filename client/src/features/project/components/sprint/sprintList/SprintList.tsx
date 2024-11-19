import { useSprintListData } from '@/features/project/hooks/useSprintListData';
import styles from './SprintList.module.css';
import React, { useState } from 'react';
import { SprintDTO, SprintCreateDTO } from '@/features/project/types/SprintDTO';
import { useNavigate } from 'react-router-dom';
import SprintCreateModal from './SprintCreateModal';
import { useCreateSprint } from '@/features/project/hooks/useCreateSprint';
import { showToast } from '@/utils/toastUtils';
import { startOfWeek, endOfWeek, addWeeks, isBefore, isAfter } from 'date-fns';
import Button from '@/components/button/Button';

interface SprintListProps {
  projectId: number;
}

const SprintList: React.FC<SprintListProps> = ({ projectId }) => {
  const { data: sprintList } = useSprintListData(projectId);
  const { mutate: createSprint } = useCreateSprint(projectId);

  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 이번 주와 다음 주의 시작일/종료일 계산
  const today = new Date();
  const thisWeekStart = startOfWeek(today, { weekStartsOn: 1 });
  // const thisWeekEnd = endOfWeek(today, { weekStartsOn: 1 });
  // const nextWeekStart = startOfWeek(addWeeks(today, 1), { weekStartsOn: 1 });
  const nextWeekEnd = endOfWeek(addWeeks(today, 1), { weekStartsOn: 1 });

  // 모달 열기/닫기
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleCreateSprint = (data: SprintCreateDTO) => {
    createSprint(data, {
      onSuccess: () => {
        console.log('New sprint created:', data);
        closeModal();
      },
      onError: (error) => {
        console.error('스프린트 생성 오류:', error);
      },
    });
  };

  const navigateToCreate = (sprintId: number, sprintStartDate: Date) => () => {
    // 조건: 스프린트는 이번 주 또는 다음 주까지만 선택 가능
    if (
      isBefore(sprintStartDate, thisWeekStart) || // 시작일이 이번 주 이전
      isAfter(sprintStartDate, nextWeekEnd) // 시작일이 다음 주 이후
    ) {
      showToast.warn('이번 주 또는 다음 주 스프린트만 선택 가능합니다.');
      return;
    }

    navigate(`/project/${projectId}/sprint/${sprintId}`);
  };

  return (
    <div className={styles.sprintListContainer}>
      {/* Header Section */}
      <div className={styles.header}>
        <h2>스프린트 목록</h2>
        <Button size="custom" colorType="blue" onClick={openModal}>
          새 스프린트 생성
        </Button>
      </div>

      {/* Body Section */}
      {sprintList && sprintList.length > 0 ? (
        <table className={styles.sprintTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>이름</th>
              <th>시작일</th>
              <th>종료일</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            {sprintList.map((sprint: SprintDTO) => (
              <tr key={sprint.id} onClick={navigateToCreate(sprint.id, new Date(sprint.startDate))}>
                <td>{sprint.id}</td>
                <td>{sprint.name}</td>
                <td>{new Date(sprint.startDate).toLocaleDateString()}</td>
                <td>{new Date(sprint.endDate).toLocaleDateString()}</td>
                <td
                  className={
                    sprint.state === 'active'
                      ? styles.active
                      : sprint.state === 'closed'
                      ? styles.closed
                      : styles.future
                  }
                >
                  {sprint.state === 'active' ? '진행 중' : sprint.state === 'closed' ? '완료됨' : '예정됨'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className={styles.emptyMessage}>스프린트가 없습니다. 새 스프린트를 생성해보세요!</p>
      )}
      {isModalOpen && <SprintCreateModal onClose={closeModal} onCreate={handleCreateSprint} />}
    </div>
  );
};

export default SprintList;
