import React, { useState, useEffect } from 'react';
import Tag from '../tag/Tag';
import styles from './TagSelector.module.css';
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import { getPositionLabel } from '../../../../utils/labelUtils'

interface TagSelectorProps {
  initialTag?: number; // 초기값 추가
  onTagChange: (tag: number) => void;
}

const TagSelector: React.FC<TagSelectorProps> = ({ initialTag = 1, onTagChange }) => {
  const [tag, setTag] = useState<number>(initialTag); // 초기값 반영

  useEffect(() => {
    setTag(initialTag); // 초기값이 바뀔 때 업데이트
  }, [initialTag]);

  const handleTagChange = (direction: 'up' | 'down') => {
    const tags: number[] = [1, 2, 3];
    const currentIndex = tags.indexOf(tag);
    const newTag = direction === 'up'
      ? tags[(currentIndex + 1) % tags.length]
      : tags[(currentIndex - 1 + tags.length) % tags.length];
      
    setTag(newTag);
    onTagChange(newTag);
  };

  return (
    <div className={styles.tagSelector}>
      <FaChevronUp className={styles.changeButton} onClick={() => handleTagChange('up')} color='#d9d9d9' />
      <Tag text={getPositionLabel(tag)} disablePointerCursor={true} />
      <FaChevronDown className={styles.changeButton} onClick={() => handleTagChange('down')} color='#d9d9d9' />
    </div>
  );
};

export default TagSelector;
