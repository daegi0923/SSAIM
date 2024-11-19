import React, { useState, useRef, useEffect } from 'react';
import styles from './IssueCreateForm.module.css';
import { useEpicListData } from '@/features/project/hooks/sprint/useEpicListData';
import { IssueCreateDTO } from '@/features/project/types/sprint/IssueCreateDTO';
import { useParams } from 'react-router-dom';
import { useSprintIssueStore } from '@/features/project/stores/useSprintIssueStore ';
import { showToast } from '@/utils/toastUtils';

interface IssueCreateFormProps {
  weekdays: string[]; // 선택 가능한 날짜 목록
  onAddIssue: (day: Date, issue: IssueCreateDTO) => void; // 이슈 추가 콜백 함수
}

const IssueCreateForm: React.FC<IssueCreateFormProps> = ({ weekdays }) => {
  const { projectId } = useParams();
  const { data: epicList } = useEpicListData(Number(projectId));
  const { addIssue } = useSprintIssueStore();

  const [issueType, setIssueType] = useState<'Story' | 'Task'>('Task');
  const [selectedEpic, setSelectedEpic] = useState<string | null>('');
  const [description, setDescription] = useState('');
  const [summary, setSummary] = useState('');
  const [storyPoint, setStoryPoint] = useState(0);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const [isIssueTypeOpen, setIsIssueTypeOpen] = useState(false);
  const [isEpicOpen, setIsEpicOpen] = useState(false);
  const [isDateOpen, setIsDateOpen] = useState(false);

  const issueTypeRef = useRef<HTMLDivElement>(null);
  const epicRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);

  const toastIds = useRef({ description: 'desc-toast', summary: 'summary-toast', storyPoint: 'sp-toast' });

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (issueTypeRef.current && !issueTypeRef.current.contains(event.target as Node)) {
        setIsIssueTypeOpen(false);
      }
      if (epicRef.current && !epicRef.current.contains(event.target as Node)) {
        setIsEpicOpen(false);
      }
      if (dateRef.current && !dateRef.current.contains(event.target as Node)) {
        setIsDateOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSaveIssue = () => {
    if (!selectedDay) {
      showToast.warn('날짜를 선택해 주세요.');
      return;
    }
    const data: IssueCreateDTO = {
      issueType,
      summary,
      description,
      storyPoint,
      assignee: null,
      epic: selectedEpic,
    };

    addIssue(new Date(selectedDay), data);
    console.log('Temporary Issue added to store:', data);

    setIssueType('Task');
    setSelectedEpic('');
    setDescription('');
    setSummary('');
    setStoryPoint(0);
    setSelectedDay(null);
  };

  const handleDescriptionChange = (value: string) => {
    if (value.length > 255) {
      showToast.warn('설명은 최대 255자까지 입력 가능합니다.', { toastId: toastIds.current.description });
      return;
    }
    setDescription(value);
  };

  const handleSummaryChange = (value: string) => {
    if (value.length > 255) {
      showToast.warn('제목은 최대 255자까지 입력 가능합니다.', { toastId: toastIds.current.summary });
      return;
    }
    setSummary(value);
  };

  const handleStoryPointChange = (value: number) => {
    if (value > 4) {
      showToast.warn('스토리 포인트는 최대 4까지만 입력 가능합니다.', { toastId: toastIds.current.storyPoint });
      return;
    }
    setStoryPoint(value);
  };

  return (
    <>
      <h3>이슈 추가</h3>
      <div className={styles.issueForm}>
        {/* 이슈 타입 */}
        <div ref={issueTypeRef}>
          <label className={styles.label}>이슈 타입</label>
          <div className={styles.customDropdown}>
            <button onClick={() => setIsIssueTypeOpen(!isIssueTypeOpen)} className={styles.dropdownButton}>
              {issueType}
            </button>
            {isIssueTypeOpen && (
              <ul className={styles.dropdownMenu}>
                {(['Task', 'Story'] as const).map((type) => (
                  <li
                    key={type}
                    onClick={() => {
                      setIssueType(type);
                      setIsIssueTypeOpen(false);
                    }}
                    className={styles.dropdownItem}
                  >
                    {type}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Epic 선택 */}
        <div ref={epicRef}>
          <label className={styles.label}>Epic</label>
          <div className={styles.customDropdown}>
            <button onClick={() => setIsEpicOpen(!isEpicOpen)} className={styles.dropdownButton}>
              {selectedEpic
                ? epicList?.find((epic) => {
                    return epic.summary === selectedEpic;
                  })?.summary
                : '에픽 미설정'}
            </button>
            {isEpicOpen && (
              <ul className={styles.dropdownMenu}>
                <li
                  onClick={() => {
                    setSelectedEpic(null);
                    setIsEpicOpen(false);
                  }}
                  className={styles.dropdownItem}
                >
                  에픽 미설정
                </li>
                {epicList?.map((epic) => (
                  <li
                    key={epic.key}
                    onClick={() => {
                      setSelectedEpic(epic.summary);
                      setIsEpicOpen(false);
                    }}
                    className={styles.dropdownItem}
                  >
                    {epic.summary}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* 날짜 선택 */}
        <div ref={dateRef}>
          <label className={styles.label}>날짜</label>
          <div className={styles.customDropdown}>
            <button onClick={() => setIsDateOpen(!isDateOpen)} className={styles.dropdownButton}>
              {selectedDay || '날짜 선택'}
            </button>
            {isDateOpen && (
              <ul className={styles.dropdownMenu}>
                {weekdays?.map((day) => (
                  <li
                    key={day}
                    onClick={() => {
                      setSelectedDay(day);
                      setIsDateOpen(false);
                    }}
                    className={styles.dropdownItem}
                  >
                    {day}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* 나머지 필드들 */}
        <div>
          <label className={styles.label}>제목</label>
          <input
            type="text"
            value={summary}
            onChange={(e) => handleSummaryChange(e.target.value)}
            className={styles.input}
          />
        </div>
        <div>
          <label className={styles.label}>설명</label>
          <input
            type="text"
            value={description}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            className={styles.input}
          />
        </div>
        <div>
          <label className={styles.label}>스토리 포인트</label>
          <input
            type="number"
            value={storyPoint}
            onChange={(e) => handleStoryPointChange(Number(e.target.value))}
            className={styles.inputNumber}
            min="0"
          />
        </div>

        <button onClick={handleSaveIssue} className={styles.button}>
          추가
        </button>
      </div>
    </>
  );
};

export default IssueCreateForm;
