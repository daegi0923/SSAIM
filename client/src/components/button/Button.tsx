import React from 'react';
import classNames from 'classnames';
import styles from './Button.module.css';

type ButtonStyleProps = {
  size: 'xsmall' | 'small' | 'medium' | 'large' | 'custom'; 
  colorType: 'green' | 'red' | 'blue' | 'navy' | 'purple' | 'white'; 
};

interface ButtonProps extends ButtonStyleProps {
  children: React.ReactNode;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ children, onClick, size, colorType }) => {
  const buttonClass = classNames(
    styles.button,
    styles[size],
    styles[`${colorType}Normal`] // 예: greenNormal
  );

  return (
    <button className={buttonClass} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
