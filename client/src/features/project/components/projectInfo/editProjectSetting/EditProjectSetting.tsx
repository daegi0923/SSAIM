import styles from './EditProjectSetting.module.css';
import 'react-datepicker/dist/react-datepicker.css';
import React, { useState, useEffect } from 'react';
import CheckModal from '@/components/checkModal/CheckModal';
import { fetchApiKey } from '@features/project/apis/fetchApiKey';
import { useProjectInfo } from '@/features/project/hooks/useProjectInfo';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { FaQuestion } from 'react-icons/fa6';

interface EditProjectSettingProps {
  onClose: () => void;
  type: 'jira' | 'gitlab';
  projectId: number;
}

interface ModalContentItem {
  title: 'Jira' | 'GitLab';
  content: 'jira' | 'gitlab';
}

const modalContent: Record<'jira' | 'gitlab', ModalContentItem> = {
  jira: {
    title: 'Jira',
    content: 'jira',
  },
  gitlab: {
    title: 'GitLab',
    content: 'gitlab',
  },
};

const EditProjectSetting: React.FC<EditProjectSettingProps> = ({ onClose, type, projectId }) => {
  const modalData = modalContent[type];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [apiKey, setApiKey] = useState<string>('');
  const [externalProjectId, setExternalProjectId] = useState<string>('');
  const [boardId, setBoardId] = useState<string>('');
  const [isVisibleKey, setIsVisibleKey] = useState(false);
  const { data: projectInfo } = useProjectInfo(projectId);

  useEffect(() => {
    if (!projectInfo) return;

    // 타입별 데이터 매핑
    const typeMapping = {
      jira: {
        id: projectInfo.jiraId,
        boardId: projectInfo.jiraBoardId,
        api: projectInfo.jiraApi,
      },
      gitlab: {
        id: projectInfo.gitlabId,
        boardId: null, // GitLab에는 boardId가 없음
        api: projectInfo.gitlabApi,
      },
    };

    const selectedType = typeMapping[type];

    // 공통 상태 업데이트
    setExternalProjectId(selectedType.id || '');
    setApiKey(selectedType.api || '');

    // 선택적 상태 업데이트
    if (type === 'jira') {
      setBoardId(selectedType.boardId || '');
    }
  }, [projectInfo, type]);

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };
  const handleSave = async () => {
    const apiKeyPayload =
      type === 'jira'
        ? { jiraApi: apiKey, jiraProjectId: externalProjectId, jiraBoardId: boardId }
        : { gitlabApi: apiKey, gitlabProjectId: externalProjectId };
    console.log(apiKeyPayload);
    await fetchApiKey(modalData.content, 'patch', apiKeyPayload, projectId);
    onClose();
  };

  const handleCancel = () => {
    // 취소 로직
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.title}>{modalData.title} API Key 수정</div>
          <button className={styles.closeButton} onClick={onClose}>
            X
          </button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.bodyLeft}>
            <p>{modalData?.title}</p>
          </div>
          <div className={styles.bodyRight}>
            <div className={styles.inputGroup}>
              <label htmlFor="externalProjectId" className={styles.label}>
                {modalData.title} Project ID
              </label>
              <input
                type="text"
                id="externalProjectId"
                className={styles.input}
                value={externalProjectId}
                onChange={(e) => setExternalProjectId(e.target.value)}
              />
            </div>

            <div className={`${styles.inputGroup} ${styles.apiKeyContainer}`}>
              <div className={styles.keyLabel}>
                <label htmlFor="apiKey" className={styles.label}>
                  {modalData.title} API Key
                </label>
                {type === "jira" ? 
                <div className={styles.questionBox}>
                  <FaQuestion />
                  <div className={styles.tooltip}>{modalData.title} Key의 계정은 팀장 이메일과 일치해야 합니다</div>
                </div>
                :null}
              </div>
              <div className={styles.apiKeyWrapper}>
                <input
                  type={isVisibleKey ? 'text' : 'password'}
                  id="apiKey"
                  className={styles.input}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <button type="button" className={styles.toggleButton} onClick={() => setIsVisibleKey((prev) => !prev)}>
                  {isVisibleKey ? <FaRegEyeSlash /> : <FaRegEye />}
                </button>
              </div>
            </div>

            {type === 'jira' && (
              <div className={styles.inputGroup}>
                <label htmlFor="boardId" className={styles.label}>
                  {modalData.title} Board ID
                </label>
                <input
                  type="text"
                  id="boardId"
                  className={styles.input}
                  value={boardId}
                  onChange={(e) => setBoardId(e.target.value)}
                />
              </div>
            )}
          </div>
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.saveButton} onClick={handleModalOpen}>
            저장
          </button>
          <button className={styles.cancelButton} onClick={handleCancel}>
            취소
          </button>
        </div>
      </div>
      <CheckModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        title="프로젝트 정보 수정"
        content="저장하시겠습니까?"
        onConfirm={handleSave}
        confirmContent="저장"
      />
    </div>
  );
};

export default EditProjectSetting;
