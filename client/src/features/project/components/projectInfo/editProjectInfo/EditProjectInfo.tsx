import styles from './EditProjectInfo.module.css';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import React, { useState, useEffect } from 'react';
import TeamMemberGrid from '@features/project/components/projectCreate/teamMember/TeamMemberGrid';
import { ProjectDTO, ProjectEditMutationData, ProjectEditMemberDTO } from '@/features/project/types/ProjectDTO';
import { useEditProjectInfoMutation } from '@/features/project/hooks/useEditProjectInfoMutation';
import defaultTeamIcon from '@/assets/project/defaultTeamIcon.png';
import useTeamStore from '@/features/project/stores/useTeamStore';
import { useParams } from 'react-router-dom';
import useUserStore from '@/stores/useUserStore';
import { showToast } from '@/utils/toastUtils';
import { toast } from 'react-toastify';

interface EditProjectInfoModalProps {
  projectInfo: ProjectDTO;
  onClose: () => void;
}

const EditProjectInfoModal: React.FC<EditProjectInfoModalProps> = ({ projectInfo, onClose }) => {
  const [startDate, setStartDate] = useState<Date | null>(projectInfo.startDate);
  const [endDate, setEndDate] = useState<Date | null>(projectInfo.endDate);
  const [image, setImage] = useState(projectInfo.projectImage || defaultTeamIcon);
  const [projectTitle, setProjectTitle] = useState(projectInfo.title);
  const [teamName, setTeamName] = useState(projectInfo.name);
  const [jiraUrl, setJiraUrl] = useState(projectInfo.jiraUrl);
  const [gitlabUrl, setGitlabUrl] = useState(projectInfo.gitlabUrl);
  const [figmaUrl, setFigmaUrl] = useState(projectInfo.figmaUrl);
  const [notionUrl, setNotionUrl] = useState(projectInfo.notionUrl);
  const { resetStore, setLeaderId, addMember, members, leaderId } = useTeamStore();
  const { projectId } = useParams();
  const { userId } = useUserStore();
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null); // 이미지 파일 상태 추가
  const editProjectInfoMutation = useEditProjectInfoMutation(Number(projectId), userId);

  useEffect(() => {
    resetStore();
    setLeaderId(-1);
    setStartDate(projectInfo.startDate);
    setEndDate(projectInfo.endDate);
    projectInfo.projectMembers.forEach((member) => {
      addMember({ userId: member.userId, userName: member.name, userProfileImage: member.profileImage });
      if (member.role === 1) {
        setLeaderId(member.userId);
      }
    });
  }, [projectInfo.projectMembers]);

  const handleImageClick = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
        const maxSizeMB = 30; // 최대 파일 크기: 5MB

        // 1. 파일 크기 검사
        if (file.size > maxSizeMB * 1024 * 1024) {
          showToast.error(`파일 크기가 너무 큽니다. 최대 ${maxSizeMB}MB 이하로 업로드해주세요.`);
          return;
        }

        // 2. MIME 타입 검사
        if (!allowedMimeTypes.includes(file.type)) {
          showToast.error('허용된 이미지 형식(JPEG, PNG, GIF)만 업로드 가능합니다.');
          return;
        }

        // 3. 매직 넘버 검사
        const reader = new FileReader();
        reader.onload = () => {
          const arrayBuffer = reader.result as ArrayBuffer;
          const uint8Array = new Uint8Array(arrayBuffer);
          const header = uint8Array.slice(0, 4).join(' '); // 첫 4바이트 읽기

          const validHeaders = {
            '255 216 255': 'jpeg', // JPEG
            '137 80 78 71': 'png', // PNG
            '71 73 70 56': 'gif', // GIF
          };

          const isValid = Object.keys(validHeaders).some((key) => header.startsWith(key));
          if (!isValid) {
            showToast.error('파일 형식이 올바르지 않습니다. 허용된 이미지 형식(JPEG, PNG, GIF)만 업로드 가능합니다.');
            return;
          }

          // 4. 파일을 상태에 저장
          const fileReader = new FileReader();
          fileReader.onload = () => {
            if (fileReader.result) {
              setImage(fileReader.result as string); // 이미지 데이터 설정
            }
          };
          fileReader.readAsDataURL(file); // 파일 읽기
          setProfileImageFile(file); // 선택된 파일 저장
        };

        reader.readAsArrayBuffer(file); // 매직 넘버를 읽기 위해 ArrayBuffer로 파일 읽기
      }
    };
    fileInput.click();
  };
  const handleProjectTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const toastId = `length-warning`;
    if (value.length > 20) {
      if (!toast.isActive(toastId)) {
        showToast.warn('프로젝트 이름은 최대 20자까지 입력 가능합니다.', { toastId: 'length-warning' });
      }
      return;
    }
    setProjectTitle(value);
  };

  const handleTeamNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const toastId = `length-warning`;
    if (value.length > 20) {
      if (!toast.isActive(toastId)) {
        showToast.warn('팀 이름은 최대 20자까지 입력 가능합니다.', {
          toastId: 'length-warning',
        });
      }

      return;
    }
    setTeamName(value);
  };


  const handleStartDateChange = (date: Date | null) => {
    if (date && endDate && new Date(date) > new Date(endDate)) {
      showToast.warn('시작일자가 종료일자보다 늦을 수 없습니다. 종료일자가 조정됩니다.');
      setEndDate(date); // 종료일자를 시작일자와 동일하게 설정
    }
    setStartDate(date);
  };

  const handleEndDateChange = (date: Date | null) => {
    if (date && startDate && new Date(date) < new Date(startDate)) {
      showToast.error('종료일자는 시작일자보다 빠를 수 없습니다.');
      return;
    }
    setEndDate(date);
  };
  const handleCancel = () => {
    onClose();
  };
  const handleUrlChange = (key: 'jiraUrl' | 'gitlabUrl' | 'figmaUrl' | 'notionUrl') => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const toastId = `${key}-length-warning`;
      if (value.length > 255) {
        if (!toast.isActive(toastId)) {
          showToast.warn('URL은 최대 255자까지 입력 가능합니다.', { toastId });
        }
        return;
      }
  
      switch (key) {
        case 'jiraUrl':
          setJiraUrl(value);
          break;
        case 'gitlabUrl':
          setGitlabUrl(value);
          break;
        case 'figmaUrl':
          setFigmaUrl(value);
          break;
        case 'notionUrl':
          setNotionUrl(value);
          break;
        default:
          break;
      }
    };
  };
  
  const handleSave = () => {
    // 시작일자와 종료일자 유효성 검사
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      showToast.warn('프로젝트 시작일자는 종료일자보다 늦을 수 없습니다.');
      return;
    }
  
    // 팀 이름 및 프로젝트 이름 길이 제한 검사
    if (projectTitle.length > 20 || teamName.length > 20) {
      showToast.warn('프로젝트 이름과 팀 이름은 각각 최대 20자까지 입력 가능합니다.');
      return;
    }
  
    // URL 길이 검사
    const urlFields = { jiraUrl, gitlabUrl, figmaUrl, notionUrl };
    for (const [key, value] of Object.entries(urlFields)) {
      if (value && value.length > 255) {
        showToast.warn(`${key}는 최대 255자까지 입력 가능합니다.`);
        return;
      }
    }
  
    const projectMemberEditList: ProjectEditMemberDTO[] = members.reduce((acc, member) => {
      const originalMember = projectInfo.projectMembers.find((e) => member.userId === e.userId);
  
      if (!originalMember) {
        acc.push({
          userId: member.userId,
          role: member.userId === leaderId ? 1 : 0,
          update: true,
        });
      } else if (originalMember.role === 1 && originalMember.userId !== leaderId) {
        acc.push({
          projectMemberId: originalMember.pmId,
          role: 0,
          update: true,
        });
      } else if (originalMember.role === 0 && originalMember.userId === leaderId) {
        acc.push({
          projectMemberId: originalMember.pmId,
          role: 1,
          update: true,
        });
      }
  
      return acc;
    }, [] as ProjectEditMemberDTO[]);
  
    const projectMemberDeleteList: ProjectEditMemberDTO[] = projectInfo.projectMembers.reduce((acc, member) => {
      if (!members.find((e) => e.userId === member.userId)) {
        acc.push({ projectMemberId: member.pmId, update: true, delete: true });
      }
      return acc;
    }, [] as ProjectEditMemberDTO[]);
  
    if (projectId) {
      const mutationData: ProjectEditMutationData = {
        projectEditData: {
          title: projectTitle,
          name: teamName,
          startDate: startDate ?? undefined,
          endDate: endDate ?? undefined,
          jiraUrl: jiraUrl || null,
          gitlabUrl: gitlabUrl || null,
          figmaUrl: figmaUrl || null,
          notionUrl: notionUrl || null,
          projectMembers: [...projectMemberEditList, ...projectMemberDeleteList],
        },
      };
  
      if (profileImageFile) {
        mutationData.profileImage = profileImageFile;
      }
  
      editProjectInfoMutation.mutate(mutationData);
      onClose();
    }
  };
  
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>프로젝트 정보 수정</h2>
        </div>
        <div className={styles.topSection}>
          <div className={styles.imageSection} onClick={handleImageClick}>
            <img src={image} alt="대표 사진" className={styles.image} />
          </div>
          <div className={styles.infoSection}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>프로젝트 이름</label>
              <input
                type="text"
                placeholder="프로젝트 이름"
                className={styles.input}
                value={projectTitle}
                onChange={handleProjectTitleChange}
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>팀 이름</label>
              <input
                type="text"
                placeholder="팀 이름"
                className={styles.input}
                value={teamName}
                onChange={handleTeamNameChange}
              />
            </div>
          </div>
        </div>

        <div className={styles.teamMemberModal}>
          <TeamMemberGrid />
        </div>

        <div className={styles.dateSection}>
          <div>
            <label>프로젝트 시작일자:</label>
            <DatePicker
              selected={startDate}
              onChange={handleStartDateChange}
              dateFormat="yyyy/MM/dd"
              placeholderText="시작일 선택"
              className={styles.dateInput}
            />
          </div>
          <span className={styles.dateSeparator}>~</span>
          <div>
            <label>프로젝트 종료일자:</label>
            <DatePicker
              selected={endDate}
              onChange={handleEndDateChange}
              dateFormat="yyyy/MM/dd"
              placeholderText="종료일 선택"
              className={styles.dateInput}
            />
          </div>
        </div>
        <div className={styles.infoSection}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Jira Url</label>
            <input
              type="text"
              placeholder="Jira Url"
              className={styles.input}
              value={jiraUrl || ''}
              onChange={handleUrlChange('jiraUrl')}
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>GitLab Url</label>
            <input
              type="text"
              placeholder="GitLab Url"
              className={styles.input}
              value={gitlabUrl || ''}
              onChange={handleUrlChange('gitlabUrl')}
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Figma Url</label>
            <input
              type="text"
              placeholder="Figma Url"
              className={styles.input}
              value={figmaUrl || ''}
              onChange={handleUrlChange('figmaUrl')}
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Notion Url</label>
            <input
              type="text"
              placeholder="Notion Url"
              className={styles.input}
              value={notionUrl || ''}
              onChange={handleUrlChange('notionUrl')}
            />
          </div>
        </div>

        <div className={styles.buttonSection}>
          <button className={styles.saveButton} onClick={handleSave}>
            수정 완료
          </button>
          <button className={styles.cancelButton} onClick={handleCancel}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProjectInfoModal;
