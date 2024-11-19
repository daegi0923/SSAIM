import React, { useState, useEffect, useRef } from 'react';
import styles from './EditProfile.module.css';
import { UserInfoEditDTO } from '@features/user/types/UserInfoDTO';
import useUserStore from '@/stores/useUserStore';
import { editUserData } from '@/features/myPage/apis/editUserData';
import { useUserInfoData } from '@/features/myPage/hooks/useUserInfoData';
import { regionMap, getRegionLabel } from '@/utils/labelUtils';
import { useNavigate } from 'react-router-dom';
import { showToast } from '@/utils/toastUtils';
import { toast } from 'react-toastify';

const EditProfile: React.FC = () => {
  const { userId } = useUserStore();
  const { data: userInfo } = useUserInfoData(userId);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [profile, setProfile] = useState<UserInfoEditDTO>({
    userName: '',
    userEmail: '',
    userCampus: 0,
    userGeneration: 0,
    userNickname: '',
    userBirth: '',
    userGender: 0,
    userPhone: '',
  });

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  useEffect(() => {
    if (userInfo) {
      const userInfoEdit: UserInfoEditDTO = {
        userEmail: userInfo.userEmail,
        userName: userInfo.userName,
        userNickname: userInfo.userNickname,
        userPhone: userInfo.userPhone,
        userGender: userInfo.userGender,
        userGeneration: userInfo.userGeneration,
        userCampus: userInfo.userCampus,
        userBirth: userInfo.userBirth,
        userProfileMessage: userInfo.userProfileMessage ?? undefined,
        userSkills: userInfo.userSkills ?? undefined,
        userRole: userInfo.userRole,
      };
      setProfile(userInfoEdit);
      if (userInfo.userProfileImage) {
        setProfileImagePreview(userInfo.userProfileImage);
      }
    }
  }, [userInfo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'userPhone') {
      const phoneRegex = /^\d{3}-\d{3,4}-\d{4}$/;
      if (!phoneRegex.test(value)) {
        setPhoneError('전화번호 형식은 000-0000-0000입니다.');
      } else {
        setPhoneError(null);
      }
    }

    // 닉네임 20자 제한
    if (name === 'userNickname' && value.length > 20) {
      if (!toast.isActive('nicknameError')) {
        showToast.error('닉네임은 최대 20자까지 입력할 수 있습니다.', { toastId: 'nicknameError' });
      }
      return;
    }

    // 기수 1~13 제한
    if (name === 'userGeneration') {
      const generation = Number(value);
      if (generation < 1 || generation > 13) {
        if (!toast.isActive('generationError')) {
          showToast.error('기수는 1~13까지만 입력할 수 있습니다.', { toastId: 'generationError' });
        }
        return;
      }
    }

    setProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const mimeType = file.type;
      const fileSizeInMB = file.size / (1024 * 1024); // 파일 크기를 MB로 변환

      // 허용된 MIME 타입 검사
      const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedMimeTypes.includes(mimeType)) {
        showToast.error('허용된 이미지 형식(JPEG, PNG, GIF)만 업로드 가능합니다.', { toastId: 'mimeTypeError' });
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
          showToast.error('허용된 이미지 형식(JPEG, PNG, GIF)만 업로드 가능합니다.', { toastId: 'magicNumberError' });
          return;
        }

        setProfileImage(file);
        setProfileImagePreview(URL.createObjectURL(file));
      };

      reader.readAsArrayBuffer(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (phoneError) {
      showToast.error('전화번호 형식이 올바르지 않습니다.', { toastId: 'phoneNumberError' });
      return;
    }
    try {
      await editUserData(userId, profile, profileImage);
      navigate(`/profile/${userId}`);
    } catch (err) {
      console.log(err);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className={styles.editProfileContainer}>
      <h2 className={styles.title}>개인정보 수정</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.imageSection}>
          {profileImagePreview ? (
            <img
              src={profileImagePreview}
              alt="프로필 사진"
              className={styles.imagePreview}
              onClick={handleFileClick}
            />
          ) : (
            <div className={styles.imagePlaceholder} onClick={handleFileClick}>
              사진 추가
            </div>
          )}
        </div>

        <input
          type="file"
          accept=".jpg, .jpeg, .png, .gif"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        <label>
          이름:
          <p className={styles.staticInfo}>{profile.userName}</p>
        </label>

        <label>
          이메일:
          <p className={styles.staticInfo}>{profile.userEmail}</p>
        </label>

        <label>
          캠퍼스:
          <select name="userCampus" value={profile.userCampus} onChange={handleChange} className={styles.input}>
            {Object.keys(regionMap).map((key) => (
              <option key={key} value={key}>
                {getRegionLabel(Number(key))}
              </option>
            ))}
          </select>
        </label>

        <label>
          기수:
          <input
            type="number"
            name="userGeneration"
            value={profile.userGeneration}
            onChange={handleChange}
            className={styles.input}
            min={1}
            max={13}
          />
        </label>

        <label>
          닉네임:
          <input
            type="text"
            name="userNickname"
            value={profile.userNickname}
            onChange={handleChange}
            className={styles.input}
            maxLength={20}
          />
        </label>

        <label>
          생일:
          <input
            type="date"
            name="userBirth"
            value={profile.userBirth}
            onChange={handleChange}
            className={styles.input}
            max={today}
          />
        </label>

        <label>
          성별:
          <select name="userGender" value={profile.userGender} onChange={handleChange} className={styles.input}>
            <option value={0}>여성</option>
            <option value={1}>남성</option>
          </select>
        </label>

        <label>
          전화번호:
          <input
            type="tel"
            name="userPhone"
            value={profile.userPhone}
            onChange={handleChange}
            className={styles.input}
            placeholder="000-0000-0000"
          />
          {phoneError && <p className={styles.error}>{phoneError}</p>}
        </label>

        <button type="submit" className={styles.submitButton}>
          저장
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
