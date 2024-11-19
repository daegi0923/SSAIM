import React, { useState, useEffect } from 'react';
import styles from '../CreateTeam.module.css';

interface TitleInputProps {
  title: string;
  onTitleChange: (title: string) => void;
}

const TitleInput: React.FC<TitleInputProps> = ({ title, onTitleChange }) => {
  const maxLength = 20;
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    setCharCount(title.length);
  }, [title]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    if (inputValue.length <= maxLength) {
      onTitleChange(inputValue);
      setCharCount(inputValue.length);
    }
  };

  return (
    <div className={styles.formGroup}>
      <label className={styles.sectionLabel}>
        게시글 제목 ({charCount}/{maxLength})
      </label>
      <input
        type="text"
        value={title}
        onChange={handleInputChange}
        placeholder="게시글 제목을 입력하세요"
        className={styles.textInput}
      />
    </div>
  );
};

export default TitleInput;
