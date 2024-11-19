import React, { useState, useEffect } from 'react';
import styles from '../CreateTeam.module.css';

interface ContentInputProps {
  content: string;
  onContentChange: (content: string) => void;
}

const ContentInput: React.FC<ContentInputProps> = ({ content, onContentChange }) => {
  const maxLength = 250;
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    setCharCount(content.length);
  }, [content]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value;
    const inputLength = inputValue.length;

    if (inputLength <= maxLength) {
      onContentChange(inputValue);
      setCharCount(inputLength);
    }
  };

  return (
    <div className={styles.formGroup}>
      <label className={styles.sectionLabel}>
        게시글 본문 ({charCount}/{maxLength})
      </label>
      <textarea
        value={content}
        onChange={handleInputChange}
        placeholder="게시글 본문을 입력하세요"
        className={styles.textArea}
      ></textarea>
    </div>
  );
};

export default ContentInput;
