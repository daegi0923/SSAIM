import React, { useState } from 'react';
import { IssueCreateDTO } from '@/features/project/types/sprint/IssueCreateDTO';
import { IssueDTO } from '@/features/project/types/dashboard/WeeklyDataDTO';
import { useSprintIssueStore } from '@/features/project/stores/useSprintIssueStore ';
import styles from './EditableIssue.module.css';
import { FaPen } from 'react-icons/fa6';
import { showToast } from '@/utils/toastUtils';
import { toast } from 'react-toastify';
import { epicColors } from '@/features/project/utils/epicColors';
// import { useEpicListData } from '@/features/project/hooks/sprint/useEpicListData';
// import { useParams } from 'react-router-dom';

interface EditableIssueProps {
  issueData: IssueCreateDTO | IssueDTO;
  day: Date;
  isEditable: boolean;
}

// Issue가 IssueCreateDTO인지 IssueDTO인지 구분하는 타입 가드 함수
function isIssueCreateDTO(issue: IssueCreateDTO | IssueDTO): issue is IssueCreateDTO {
  return 'epic' in issue;
}

const EditableIssue: React.FC<EditableIssueProps> = ({ issueData, day, isEditable }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableIssue, setEditableIssue] = useState<IssueCreateDTO | IssueDTO>(issueData);
  // const [isExpanded, setIsExpanded] = useState(false); // 제목/설명 확장 상태
  // const { projectId } = useParams();
  // const { data: epicList } = useEpicListData(Number(projectId));
  const { updateIssue } = useSprintIssueStore();

  // const epicCodeMap = useMemo(() => {
  //   const map: Record<string, string> = {};
  //   epicList?.forEach((epic) => {
  //     map[epic.key] = epic.summary;
  //   });
  //   return map;
  // }, [epicList]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'summary' || name === 'description' || name === 'epic') {
      if (value.length > 255) {
        const toastId = `${name}-length-warning`;
        if (!toast.isActive(toastId)) {
          showToast.warn(`이슈 ${name === 'summary' ? '제목' : '설명'}은 최대 255자까지 입력 가능합니다.`, { toastId });
        }
        return;
      }
    }

    if (name === 'storyPoint') {
      const numberValue = Number(value);
      if (numberValue > 4) {
        const toastId = 'storyPoint-max-warning';
        if (!toast.isActive(toastId)) {
          showToast.warn('스토리포인트는 최대 4까지 입력 가능합니다.', { toastId });
        }
        return;
      }
    }

    setEditableIssue((prevIssue) => ({
      ...prevIssue,
      [name]: name === 'storyPoint' ? Number(value) : value,
    }));
  };

  const handleChangePoint = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const numberValue = Number(value);
    if (numberValue > 4) {
      const toastId = 'storyPoint-max-warning';
      if (!toast.isActive(toastId)) {
        showToast.warn('스토리포인트는 최대 4까지 입력 가능합니다.', { toastId });
      }
      return;
    }

    setEditableIssue((prevIssue) => ({
      ...prevIssue,
      [name]: Number(value),
    }));
    if (isIssueCreateDTO(editableIssue)) {
      updateIssue(day, editableIssue);
    }
  };
  const handleSave = () => {
    if (isEditable && isIssueCreateDTO(editableIssue)) {
      updateIssue(day, editableIssue);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditableIssue(issueData); // 초기 상태로 복원
    setIsEditing(false); // 편집 모드 종료
  };

  // epicKey 또는 epicCode 값을 가져오기
  const epicValue = isIssueCreateDTO(editableIssue) ? editableIssue.epic : editableIssue.epicKey;
  const asciiSum = epicValue
    ? epicValue
        .slice(0, 5) // 첫 5글자
        .split('') // 글자를 배열로 분리
        .reduce((sum, char) => sum + char.charCodeAt(0), 0) // ASCII 값 합산
    : 0;
  const epicColor = epicColors[asciiSum % epicColors.length] || '#888'; // 나머지로 색상 선택
  const handleEpicChange = (value: string) => {
    setEditableIssue((prevIssue) =>
      isIssueCreateDTO(prevIssue) ? { ...prevIssue, epic: value } : { ...prevIssue, epicCode: value }
    );
  };

  return (
    <div className={styles.issueContainer}>
      {/* 이슈 summary */}
      {isEditable && !isEditing && (
        <FaPen className={styles.editIcon} onClick={() => isEditable && setIsEditing(true)} />
      )}
      <div className={styles.issueHeader}>
        {isEditing && isEditable ? (
          <>
            <label className={styles.editLabel}>요약</label>

            <input
              type="text"
              name="summary"
              value={editableIssue.summary}
              onChange={handleChange}
              className={styles.input}
              placeholder="이슈 제목을 입력하세요"
            />
          </>
        ) : (
          <span className={`${styles.issueName}`}>{editableIssue.summary}</span>
        )}
      </div>

      {/* 이슈 description */}
      <div className={styles.issueDescription}>
        {isEditing && isEditable ? (
          <>
            <label className={styles.editLabel}>설명</label>
            <input
              type="text"
              name="description"
              value={editableIssue.description}
              onChange={handleChange}
              className={styles.input}
              placeholder="이슈 설명을 입력하세요"
            />
          </>
        ) : (
          <span className={`${styles.issueText}`}>{editableIssue.description}</span>
        )}
      </div>

      {/* epicKey/epicCode, storyPoint */}
      <div className={`${styles.issueDetails} ${isEditing ? styles.editMode : ''}`}>
        {isEditing && isEditable ? (
          <>
            <label className={styles.editLabel}>epic</label>
            <input
              type="text"
              name="epic"
              value={epicValue || ''}
              onChange={(e) => handleEpicChange(e.target.value)}
              className={styles.input}
              placeholder="Epic Summary"
            />
          </>
        ) : (
          <span className={styles.epicName} style={{ backgroundColor: epicColor }}>
            {epicValue || 'No Epic'}
          </span>
        )}
        {!isEditing && (
          <div className={styles.storyPointGroup}>
            {isEditable ? (
              <input
                type="number"
                name="storyPoint"
                value={editableIssue.storyPoint}
                onChange={handleChangePoint}
                className={styles.inputNumber}
                placeholder="Story Point"
                min={0}
                max={4}
              />
            ) : (
              <span className={styles.storyPoint}>{editableIssue.storyPoint}</span>
            )}
          </div>
        )}
      </div>

      {/* 저장 및 취소 버튼 */}
      {isEditing && isEditable && (
        <div className={styles.buttonContainer}>
          <button onClick={handleSave} className={styles.saveButton}>
            저장
          </button>
          <button onClick={handleCancel} className={styles.cancelButton}>
            취소
          </button>
        </div>
      )}
    </div>
  );
};

export default EditableIssue;
