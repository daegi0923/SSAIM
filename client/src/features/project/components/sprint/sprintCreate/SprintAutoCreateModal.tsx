import React, { useState, useEffect } from 'react';
import styles from './SprintAutoCreateModal.module.css';
import { generateIssue } from '@/features/project/apis/sprint/generate/generateIssue';
import { useParams } from 'react-router-dom';
import { GenarateIssueRequestDTO } from '@/features/project/types/sprint/GenDTO';
import { useSprintQuery } from '@/features/project/hooks/sprint/useSprintQuery';
import { format } from 'date-fns';
import useUserStore from '@/stores/useUserStore';
import { useUserInfoData } from '@/features/myPage/hooks/useUserInfoData';
import Loading from '@/components/loading/Loading';
import { useSprintIssueStore } from '@/features/project/stores/useSprintIssueStore ';
import { showToast } from '@/utils/toastUtils';
import { toast } from 'react-toastify';

interface SprintCreateModalProps {
  onClose: () => void;
}

const SprintCreateModal: React.FC<SprintCreateModalProps> = ({ onClose }) => {
  const { projectId, sprintId } = useParams();
  const { data: sprint } = useSprintQuery(Number(projectId), Number(sprintId));
  const { userId } = useUserStore(); // 사용자 정보 가져오기
  const { data: userInfo } = useUserInfoData(userId);
  const userName = userInfo?.userName; // 사용자 이름

  //stores
  const { addIssue } = useSprintIssueStore();
  // State 관리
  const [message, setMessage] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // sprint 데이터로 startDate와 endDate 초기화
  useEffect(() => {
    if (sprint) {
      setStartDate(format(new Date(sprint.startDate), 'yyyy-MM-dd'));
      setEndDate(format(new Date(sprint.endDate), 'yyyy-MM-dd'));
    }
  }, [sprint]);

  const handleCreateIssue = async () => {
    const requestData: GenarateIssueRequestDTO = {
      message,
      assignee: userName || '', // userName이 undefined일 경우 빈 문자열을 할당
      startDate,
      endDate,
    };
    setIsLoading(true);

    try {
      const issues = await generateIssue(Number(projectId), requestData);

      if (Array.isArray(issues)) {
        issues.forEach((dailyIssue) => {
          dailyIssue.tasks.forEach((task) => {
            addIssue(new Date(dailyIssue.day), task); // sprintIssueStore.js 에서 addIssue를 호출
          });
        });
        console.log('Generated Issues:', issues);
        showToast.success('스프린트 이슈가 성공적으로 생성되었습니다!');
      } else {
        throw new Error('예상하지 못한 형식의 응답입니다. AI가 이해할 수 없는 결과를 반환했습니다.');
      }
    } catch (error) {
      console.error('Error generating issues:', error);
      showToast.error('AI가 요청을 이해하지 못했어요. 요청 데이터가 잘못되었을 수 있습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
      onClose();
    }
  };
  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;

    if (value.length > 50) {
      const toastId = 'message-length-warning';
      if (!toast.isActive(toastId)) {
        showToast.warn('스프린트 내용은 최대 50자까지 입력 가능합니다.', { toastId });
      }
      return;
    }

    setMessage(value);
  };

  if (isLoading) {
    return <Loading />; // 로딩 중일 때 로딩 컴포넌트 표시
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>스프린트 제목</h2>
          <button className={styles.closeButton} onClick={onClose}>
            X
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          <p>이번주 할일</p>
          <textarea
            className={styles.inputArea}
            placeholder="스프린트 내용을 입력하세요...(최대 50자)"
            value={message}
            onChange={handleMessageChange}
          />
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button className={styles.createButton} onClick={handleCreateIssue}>
            스프린트 이슈 생성
          </button>
        </div>
      </div>
    </div>
  );
};

export default SprintCreateModal;
