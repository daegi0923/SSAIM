import React, { useState, useEffect } from 'react';
import styles from './CategoryDropDown.module.css';

interface Option {
  value: string;
  label: string;
}

interface Category {
  label: string;
  options?: Option[];
  value?: string;
}

interface CategoryDropdownProps {
  categories: Category[];
  selectedOption: Option | null;
  onSelect: (option: Option) => void;
  isOpen: boolean;
  onToggle: () => void;
  placeholder?: string;
}

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  categories,
  selectedOption,
  onSelect,
  isOpen,
  onToggle,
  placeholder = '선택하세요',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const handleCategoryClick = (category: Category) => {
    if (!category.options) {
      onSelect({ value: category.value || '', label: category.label });
      onToggle();
    } else {
      setSelectedCategory(category);
    }
  };

  const handleOptionClick = (option: Option) => {
    onSelect(option);
    onToggle();
  };

  // 드롭다운이 닫힐 때 selectedCategory를 초기화
  useEffect(() => {
    if (!isOpen) {
      setSelectedCategory(null);
    }
  }, [isOpen]);

  // "전체" 카테고리를 추가한 카테고리 리스트 생성
  const categoriesWithAll = [
    ...categories,
    { label: '전체', value: '' },
  ];

  // 버튼에 적용할 클래스 결정
  const buttonClassName = `${styles.button} ${
    selectedOption && selectedOption.label.length >= 4 ? styles.smallFont : ''
  }`;

  return (
    <div className={styles.dropdown}>
      <button className={buttonClassName} onClick={onToggle}>
        {selectedOption ? selectedOption.label : placeholder}
      </button>
      {isOpen && (
        <div className={styles.menu}>
          {!selectedCategory ? (
            <ul className={styles.categoryList}>
              {categoriesWithAll.map((category) => (
                <li
                  key={category.label}
                  className={`${styles.categoryItem} ${
                    selectedOption && selectedOption.label === category.label ? styles.selected : ''
                  } ${category.label.length >= 4 ? styles.smallFont : ''}`}
                  onClick={() => handleCategoryClick(category)}
                >
                  {category.label}
                </li>
              ))}
            </ul>
          ) : (
            selectedCategory.options && (
              <ul className={styles.optionList}>
                {selectedCategory.options.map((option) => (
                  <li
                    key={option.value}
                    className={`${styles.optionItem} ${
                      selectedOption && selectedOption.value === option.value ? styles.selected : ''
                    } ${option.label.length >= 4 ? styles.smallFont : ''}`}
                    onClick={() => handleOptionClick(option)}
                  >
                    {option.label}
                  </li>
                ))}
              </ul>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;
