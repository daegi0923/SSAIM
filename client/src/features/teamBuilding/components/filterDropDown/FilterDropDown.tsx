import React from 'react';
import styles from './FilterDropDown.module.css';

interface Option {
  value: string;
  label: string;
}

interface DropdownProps {
  options: Option[];
  selectedOption: Option | null;
  onSelect: (option: Option) => void;
  isOpen: boolean;
  onToggle: () => void;
  placeholder?: string;
}

const Dropdown: React.FC<DropdownProps> = ({ options, selectedOption, onSelect, isOpen, onToggle, placeholder = '선택하세요' }) => {

  const handleOptionClick = (option: Option) => {
    onSelect(option);
    onToggle();
  };

  return (
    <div className={styles.dropdown}>
      <button className={styles.button} onClick={onToggle}>
        {selectedOption ? selectedOption.label : placeholder}
      </button>
      {isOpen && (
        <ul className={styles.options}>
          {options.map(option => (
            <li 
              key={option.value} 
              className={`${styles.option} ${selectedOption?.value === option.value ? styles.selected : ''}`}
              onClick={() => handleOptionClick(option)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
