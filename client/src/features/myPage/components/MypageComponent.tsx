import React, { useState, useEffect } from 'react';
import styles from './MypageComponent.module.css';
import { FaPen } from 'react-icons/fa6';
import { useUserInfoData } from '../hooks/useUserInfoData';
import useUserStore from '@/stores/useUserStore';
import { editUserData } from '../apis/editUserData';
import { getRegionLabel } from '@/utils/labelUtils';
import Button from '@/components/button/Button';
import { useNavigate } from 'react-router-dom';
import ProfileImageModal from './profileImageModal/ProfileImageModal';
import modalStyles from './profileImageModal/ProfileImageModal.module.css';
import { useQueryClient } from '@tanstack/react-query';
import { showToast } from '@/utils/toastUtils';
import { toast } from 'react-toastify';

type MypageProps = {
  profileOwnerId: number;
};
const MypageComponent: React.FC<MypageProps> = ({ profileOwnerId }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  // 프로필 페이지 정보 및 userId
  const { userId } = useUserStore();
  const { data: userInfo } = useUserInfoData(profileOwnerId);
  // 상태 메시지와 스택 관련 상태
  const [statusMessage, setStatusMessage] = useState('');
  const [stacks, setStacks] = useState('');
  const [isEditingMessage, setIsEditingMessage] = useState(false);
  const [isEditingStack, setIsEditingStack] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);

  const isProfileOwner = userId === profileOwnerId;
  useEffect(() => {
    if (userInfo) {
      setStatusMessage(userInfo.userProfileMessage || '');
      setStacks(userInfo.userSkills || '');
    }
  }, [userInfo]);

  // 상태 메시지 및 스택 편집 시작 함수
  const handleEditStackClick = () => {
    setIsEditingStack(true);
    if (isEditingMessage) {
      handleSaveProfilesMessage();
    }
  };
  const handleEditMessageClick = () => {
    setIsEditingMessage(true);
    if (isEditingStack) {
      handleSaveStacks();
    }
  };

  // 상태 메시지 입력값 변화 핸들러
  const handleStatusChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const toastId = 'length-warning';
    if (value.length >= 250) {
      if (!toast.isActive(toastId)) {
        showToast.warn(`상태 메시지는 최대 250자까지 입력 가능합니다.`, {
          toastId: `length-warning`, // 고유 ID로 중복 방지
        });
      }
    }
    setStatusMessage(value);
  };

  // 스택 입력값 변화 핸들러
  const handleStacksChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const toastId = 'length-warning';

    if (value.length >= 250) {
      if (!toast.isActive(toastId)) {
        showToast.warn(`상태 메시지는 최대 250자까지 입력 가능합니다.`, {
          toastId: `length-warning`, // 고유 ID로 중복 방지
        });
      }
    }
    setStacks(value);
  };

  // 상태 메시지 변경 시 API 요청
  const handleSaveProfilesMessage = async () => {
    try {
      if (statusMessage !== userInfo?.userProfileMessage) {
        await editUserData(userId, { userProfileMessage: statusMessage });
        showToast.success('성공적으로 저장되었습니다.'); // 성공 알림
      }
    } catch (error) {
      showToast.error('저장에 실패했습니다. 다시 시도해주세요.'); // 실패 알림
      console.error(error); // 추가 디버깅용
    } finally {
      setIsEditingMessage(false);
    }
  };

  // 스택 변경 시 API 요청
  const handleSaveStacks = async () => {
    try {
      if (stacks !== userInfo?.userSkills) {
        await editUserData(userId, { userSkills: stacks });
        showToast.success('성공적으로 저장되었습니다.'); // 성공 알림
      }
    } catch (error) {
      showToast.error('저장에 실패했습니다. 다시 시도해주세요.'); // 실패 알림
      console.error(error); // 추가 디버깅용
    } finally {
      setIsEditingStack(false);
    }
  };

  const handleProfileImageClick = () => {
    if (profileOwnerId === userId) {
      setIsModalOpen(true);
    }
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const mimeType = file.type;
      const fileSizeInMB = file.size / (1024 * 1024); // 파일 크기를 MB로 변환

      // 허용된 MIME 타입 검사
      const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedMimeTypes.includes(mimeType)) {
        showToast.error('허용된 이미지 형식(JPEG, PNG, GIF)만 업로드 가능합니다.');
        return;
      }
      // 파일 용량 검사 (예: 최대 5MB로 제한)
      const maxFileSizeInMB = 30; // MB 단위
      if (fileSizeInMB > maxFileSizeInMB) {
        showToast.error(`이미지 용량은 최대 ${maxFileSizeInMB}MB까지만 허용됩니다.`, { toastId: 'fileSizeError' });
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        const uint8Array = new Uint8Array(arrayBuffer);
        const header = uint8Array.slice(0, 4).join(' '); // 첫 4바이트 읽기

        // 매직 넘버 확인
        const validHeaders = {
          '255 216 255': 'jpeg', // JPEG
          '137 80 78 71': 'png', // PNG
          '71 73 70 56': 'gif', // GIF
        };

        const isValid = Object.keys(validHeaders).some((key) => header.startsWith(key));
        if (!isValid) {
          showToast.error('허용된 이미지 형식(JPEG, PNG, GIF)만 업로드 가능합니다.');
          return;
        }

        setProfileImage(file);
      };

      reader.readAsArrayBuffer(file);
    }
  };

  const saveProfileImage = async () => {
    if (profileImage) {
      try {
        await editUserData(userId, {}, profileImage);
        console.log('Profile image updated');
        setIsModalOpen(false); // 저장 후 모달 닫기
        setProfileImage(null);
        queryClient.invalidateQueries({ queryKey: ['userInfo', profileOwnerId] }); // 쿼리 무효화로 데이터 새로고침
        showToast.success('프로필 이미지가 성공적으로 저장되었습니다.');
      } catch (error) {
        console.error('Failed to update profile image:', error);
        showToast.error('이미지 저장에 실패했습니다.');
      } finally {
        setIsModalOpen(false);
      }
    } else {
      showToast.info('변경사항이 없습니다.');
      setIsModalOpen(false);
    }
  };

  const handleViewProfileImage = () => {
    if (userInfo?.userProfileImage) {
      window.open(userInfo.userProfileImage, '_blank');
    }
  };

  return (
    <div className={styles.myPageContainer}>
      {/* 헤더 */}
      <header className={styles.header}>
        <h1>{userInfo?.userName} 님의 프로필 페이지</h1>
        {isProfileOwner ? (
          <Button
            size="xsmall"
            colorType="green"
            children="개인정보수정"
            onClick={() => {
              navigate('/profile/edit');
            }}
          ></Button>
        ) : null}
      </header>

      {/* 본문 구역 */}
      <div className={styles.bodyContainer}>
        <div className={styles.bodyLeft}>
          <div className={styles.profileSection}>
            <div className={styles.profileSectionHeader}>
              <h2>{userInfo?.userName}</h2>
              <span>{`${userInfo?.userGeneration}기 ${userInfo ? getRegionLabel(userInfo?.userCampus) : null}`}</span>
            </div>
            <hr />
            <div className={styles.profileImageContainer} onClick={handleProfileImageClick}>
              <img src={userInfo?.userProfileImage} alt="프로필 사진" className={styles.profileImage} />
              <div className={styles.ribbon}>{`${userInfo?.userGeneration}기 ${
                userInfo ? getRegionLabel(userInfo?.userCampus) : null
              }`}</div>
            </div>
          </div>
        </div>
        <div className={styles.bodyRight}>
          <div className={styles.commonSection}>
            <h3>Message</h3>
            <hr />
            <div className={styles.commonBody}>
              {isProfileOwner ? <FaPen className={styles.modifyIcon} onClick={handleEditMessageClick} /> : null}

              {isEditingMessage ? (
                <textarea
                  value={statusMessage}
                  onChange={handleStatusChange}
                  onBlur={handleSaveProfilesMessage} // 포커스를 벗어나면 저장
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSaveProfilesMessage(); // Enter 키로 저장
                    }
                  }}
                  className={styles.commonInput}
                  maxLength={250} // 250자 제한 추가
                />
              ) : (
                <p className={styles.statusMessage}>{statusMessage}</p>
              )}
            </div>
          </div>
          <div className={styles.commonSection}>
            <h3>Stacks</h3>
            <hr />
            <div className={styles.commonBody}>
              {isProfileOwner ? <FaPen className={styles.modifyIcon} onClick={handleEditStackClick} /> : null}
              {isEditingStack ? (
                <textarea
                  value={stacks}
                  onChange={handleStacksChange}
                  onBlur={handleSaveStacks} // 포커스를 벗어나면 저장
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSaveStacks(); // Enter 키로 저장
                    }
                  }}
                  className={styles.commonInput}
                  maxLength={250} // 250자 제한 추가
                />
              ) : (
                <p className={styles.statusMessage}>{stacks}</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <ProfileImageModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>프로필 사진</h2>
        {profileImage ? (
          <img
            src={profileImage ? URL.createObjectURL(profileImage) : ''}
            alt="프로필 사진"
            className={modalStyles.modalProfileImage}
          />
        ) : (
          <img
            src={userInfo?.userProfileImage || '/default-profile.png'}
            alt="프로필 사진"
            className={modalStyles.modalProfileImage}
          />
        )}
        <div className={modalStyles.buttonContainer}>
          <button onClick={handleViewProfileImage} className={`${modalStyles.button} ${modalStyles.viewButton}`}>
            프로필 사진 보기
          </button>
          <button
            onClick={() => document.getElementById('profileImageInput')?.click()}
            className={`${modalStyles.button} ${modalStyles.changeButton}`}
          >
            새 사진 업로드
          </button>
          <input
            type="file"
            id="profileImageInput"
            style={{ display: 'none' }}
            accept="image/*"
            onChange={handleProfileImageChange}
          />
          <button onClick={saveProfileImage} className={`${modalStyles.button} ${modalStyles.saveButton}`}>
            저장
          </button>
        </div>
      </ProfileImageModal>
    </div>
  );
};

export default MypageComponent;
