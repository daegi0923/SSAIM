// SignUp.tsx
import React, { useRef, useState } from 'react';
import styles from './SignUpForm.module.css';
import { FaAngleLeft } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { BaseUserDTO } from '@features/user/types/UserInfoDTO';
import { signUp } from '@features/user/apis/signUpApi';
import { regionMap } from '@/utils/labelUtils';
import { showToast } from '@/utils/toastUtils';
const SignUpForm: React.FC = () => {
  const [formData, setFormData] = useState<BaseUserDTO>({
    userEmail: '',
    userName: '',
    userPw: '',
    userClass: 1,
    userCampus: 1,
    userGeneration: 11,
    userNickname: '',
    userBirth: '',
    userGender: 0,
    userPhone: '',
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
      if (!allowedExtensions.exec(file.name)) {
        showToast.warn('허용된 이미지 형식(.jpg, .jpeg, .png, .gif)만 업로드 가능합니다.');
        return;
      }
      setProfileImage(file);
      setProfileImagePreview(URL.createObjectURL(file)); // 미리보기 설정
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signUp(formData, profileImage); // 프로필 사진 포함하여 API 호출
      navigate('/login');
    } catch (error) {
      setError('회원가입에 실패했습니다.');
      console.error(error);
    }
  };

  const handleBackButton = () => {
    navigate('/login');
  };

  return (
    <div className={styles.signUpContainer}>
      <div className={styles.backButton} onClick={handleBackButton}>
        <FaAngleLeft />
      </div>
      <h1 className={styles.title}>회원가입</h1>
      {error && <div className={styles.errorMessage}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.imageSection} onClick={handleFileClick}>
          {profileImagePreview ? (
            <img src={profileImagePreview} alt="프로필 사진" className={styles.imagePreview} />
          ) : (
            <div className={styles.imagePlaceholder}>사진 추가</div>
          )}
        </div>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        <div className={styles.inputGroup}>
          <label>이메일</label>
          <input type="email" name="userEmail" value={formData.userEmail} onChange={handleChange} required />
        </div>

        <div className={styles.inputGroup}>
          <label>이름</label>
          <input type="text" name="userName" value={formData.userName} onChange={handleChange} required />
        </div>

        <div className={styles.inputGroup}>
          <label>비밀번호</label>
          <input type="password" name="userPw" value={formData.userPw} onChange={handleChange} required />
        </div>

        <div className={styles.inputGroup}>
          <label>클래스</label>
          <input type="number" name="userClass" value={formData.userClass} onChange={handleChange} />
        </div>

        <div className={styles.inputGroup}>
          <label>캠퍼스</label>
          <select name="userCampus" value={formData.userCampus} onChange={handleChange}>
            {Object.entries(regionMap).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label>기수</label>
          <input type="number" name="userGeneration" value={formData.userGeneration} onChange={handleChange} />
        </div>

        <div className={styles.inputGroup}>
          <label>닉네임</label>
          <input type="text" name="userNickname" value={formData.userNickname} onChange={handleChange} />
        </div>

        <div className={styles.inputGroup}>
          <label>생년월일</label>
          <input type="date" name="userBirth" value={formData.userBirth} onChange={handleChange} />
        </div>

        <div className={styles.inputGroup}>
          <label>성별</label>
          <select name="userGender" value={formData.userGender} onChange={handleChange}>
            <option value={0}>여자</option>
            <option value={1}>남자</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label>전화번호</label>
          <input type="text" name="userPhone" value={formData.userPhone} onChange={handleChange} />
        </div>

        <button type="submit" className={styles.submitButton}>
          회원가입
        </button>
      </form>
    </div>
  );
};

export default SignUpForm;
