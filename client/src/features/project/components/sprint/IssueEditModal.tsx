import React, { useState } from 'react';
import styles from './IssueEditModal.module.css';
import { IssueDTO } from '@features/project/types/dashboard/WeeklyDataDTO';
import { useParams } from 'react-router-dom';
import { useEditIssue } from '../../hooks/sprint/useEditIssue';
import { showToast } from '@/utils/toastUtils';
import { toast } from 'react-toastify';

interface IssueEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  issue: IssueDTO;
}

const IssueEditModal: React.FC<IssueEditModalProps> = ({ isOpen, onClose, issue }) => {
  const [summary, setSummary] = useState(issue.summary);
  const [description, setDescription] = useState(issue.description);
  const [storyPoint, setStoryPoint] = useState(issue.storyPoint);
  const { projectId } = useParams();
  const editIssueMutation = useEditIssue(Number(projectId));

  const handleSave = () => {
    // 유효성 검사
    if (!summary || summary.trim().length === 0) {
      const toastId = 'summary-missing-warning';
      if (!toast.isActive(toastId)) {
        showToast.warn('제목을 입력하세요.', { toastId });
      }
      return;
    }
    if (!description || description.trim().length === 0) {
      const toastId = 'description-missing-warning';
      if (!toast.isActive(toastId)) {
        showToast.warn('설명을 입력하세요.', { toastId });
      }
      return;
    }
    if (storyPoint < 0 || storyPoint > 4) {
      const toastId = 'storypoint-invalid-warning';
      if (!toast.isActive(toastId)) {
        showToast.warn('스토리 포인트는 0~4 사이로 입력하세요.', { toastId });
      }
      return;
    }

    // 저장 로직
    editIssueMutation.mutate(
      {
        assignee: '',
        issueKey: issue.issueKey,
        summary,
        description,
        storyPoint,
        epicCode: issue.epicCode,
        issueType: issue.issueType,
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  // 제목 입력 핸들러
  const handleSummaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const toastId = 'summary-length-warning';

    if (value.length > 255) {
      if (!toast.isActive(toastId)) {
        showToast.warn('제목은 최대 255자까지 입력 가능합니다.', { toastId });
      }
      return;
    }

    setSummary(value);
  };

  // 설명 입력 핸들러
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const toastId = 'description-length-warning';

    if (value.length > 255) {
      if (!toast.isActive(toastId)) {
        showToast.warn('설명은 최대 255자까지 입력 가능합니다.', { toastId });
      }
      return;
    }

    setDescription(value);
  };

  // 스토리 포인트 입력 핸들러
  const handleStoryPointChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    const toastId = 'storypoint-invalid-warning';

    if (value < 0 || value > 4) {
      if (!toast.isActive(toastId)) {
        showToast.warn('스토리 포인트는 0~4 사이로 입력 가능합니다.', { toastId });
      }
      return;
    }

    setStoryPoint(value);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>이슈 수정</h2>

        {/* 읽기 전용 필드 표시 */}
        <div className={styles.issueDetails}>
          <p>
            <strong>이슈 키:</strong> {issue.issueKey}
          </p>
          <p>
            <strong>할당자:</strong> {issue.allocator}
          </p>
          <p>
            <strong>Epic 코드:</strong> {issue.epicCode ? issue.epicCode : 'Epic 미지정'}
          </p>
          <p>
            <strong>이슈 타입:</strong> {issue.issueType}
          </p>
          <p>
            <strong>진행 상태:</strong> {issue.progress}
          </p>
        </div>

        {/* 수정 가능한 필드 */}
        <label>제목</label>
        <input
          type="text"
          value={summary}
          onChange={handleSummaryChange}
          className={styles.input}
          placeholder="255자 이내로 입력해주세요."
        />

        <label>설명</label>
        <textarea
          value={description}
          onChange={handleDescriptionChange}
          className={styles.input}
          placeholder="255자 이내로 입력해주세요."
        />

        <label>스토리 포인트</label>
        <input
          type="number"
          value={storyPoint}
          onChange={handleStoryPointChange}
          className={styles.input}
          placeholder="0~4 범위"
          min={0}
          max={4}
        />

        {/* 버튼 */}
        <div className={styles.buttonContainer}>
          <button onClick={handleSave} className={styles.saveButton}>
            저장
          </button>
          <button onClick={onClose} className={styles.cancelButton}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default IssueEditModal;
