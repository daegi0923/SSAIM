import styles from './Issue.module.css';
import StatusSwitch from './StatusSwitch';
import React, { useEffect, useState } from 'react';
import IssueEditModal from './IssueEditModal';
import { IssueDTO } from '../../types/dashboard/WeeklyDataDTO';
import { epicColors } from '../../utils/epicColors';
import { useUpdateIssueStatus } from '../../hooks/sprint/useUpdateIssueStatus';
import { useParams } from 'react-router-dom';
import { showToast } from '@/utils/toastUtils';
import { toast } from 'react-toastify';
import { BsThreeDotsVertical } from 'react-icons/bs';

interface IssueProps {
  issue: IssueDTO;
  epicSummary: string;
}
const statusMap: Record<string, '해야 할 일' | '진행 중' | '완료'> = {
  todo: '해야 할 일',
  inProgress: '진행 중',
  done: '완료',
};

const Issue: React.FC<IssueProps> = ({ issue, epicSummary }) => {
  const { projectId } = useParams();
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false); // 상태 변경 요청 중 상태
  const [currentStatus, setCurrentStatus] = useState<'해야 할 일' | '진행 중' | '완료'>(issue.progress); // 현재 상태 관리

  const { mutate: updateIssueStatus } = useUpdateIssueStatus(Number(projectId), issue.issueKey);
  useEffect(() => {
    setCurrentStatus(issue.progress); // 초기 상태 설정
  }, [issue]);
  const handleOpenEditModal = () => {
    setEditModalOpen(true);
  };
  const handleCloseEditModal = () => {
    setEditModalOpen(false);
  };
  // 첫 5글자 ASCII 합 계산
  const epicCode = issue.epicCode?.split('-')[1];
  const asciiSum = epicSummary
    ? epicSummary
        .slice(0, 5) // 첫 5글자
        .split('') // 글자를 배열로 분리
        .reduce((sum, char) => sum + char.charCodeAt(0), 0) // ASCII 값 합산
    : 0;
  const epicColor = epicColors[asciiSum % epicColors.length] || '#888'; // 나머지로 색상 선택

  const handleChangeStatus = (status: 'todo' | 'inProgress' | 'done') => {
    if (isUpdating) return; // 중복 호출 방지
    setCurrentStatus(statusMap[status]); // 상태 업데이트
    setIsUpdating(true); // 중간 상태 설정
    updateIssueStatus(status, {
      onSuccess: () => {
        setCurrentStatus(statusMap[status]); // 상태 업데이트
        const toastId = `${status}-changed`;
        if (!toast.isActive(toastId)) {
          showToast.success(`${issue.summary} 이슈 상태가 ${statusMap[status]}로 변경되었습니다.`, {
            issueId: `${status}-changed`,
          });
        }
      },
      onError: (error) => {
        console.error('이슈 상태 변경 오류:', error);
        showToast.error('이슈 상태 변경에 실패했습니다.');
        setCurrentStatus(issue.progress); // 상태 업데이트
      },
      onSettled: () => {
        setIsUpdating(false); // 중간 상태 해제
      },
    });
  };

  return (
    <div className={styles.issueContainer}>
      {/* 상단 - 이슈 이름과 ... 버튼 */}
      <div className={styles.issueHeader}>
        <span
          className={`${styles.issueName} ${styles.collapsed}`}
          title={issue.summary} // 마우스를 올리면 전체 내용 표시
        >
          {issue.summary}
        </span>

        <button className={styles.moreButton} onClick={handleOpenEditModal}>
          <BsThreeDotsVertical />
        </button>
      </div>

      {/* 하단 - 에픽 이름, 스토리 포인트, 상태 */}
      <div className={styles.issueFooter}>
        <span
          className={styles.epicName}
          title={epicSummary} // 마우스를 올리면 전체 내용 표시
          style={{ backgroundColor: epicColor }}
        >
          {epicCode ? `${epicSummary}` : 'No Epic'}
        </span>
        <div className={styles.issueFooterRight}>
          <span className={styles.storyPoint}>{issue.storyPoint}</span>
          <StatusSwitch status={currentStatus} onChange={handleChangeStatus} />
        </div>
      </div>
      {/* Edit Modal */}
      {isEditModalOpen && <IssueEditModal isOpen={isEditModalOpen} onClose={handleCloseEditModal} issue={issue} />}
    </div>
  );
};

export default Issue;
