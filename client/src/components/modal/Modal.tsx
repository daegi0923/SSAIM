import React, { ReactNode } from "react";
import styles from './Modal.module.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: ReactNode;
  content: ReactNode;
  footer?: ReactNode;
  width?: number;
  height?: number;
  isOutsideClick?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  content,
  footer,
  width = 300,
  height = 200,
  isOutsideClick = true,
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalBackground} onClick={isOutsideClick ? onClose : undefined}>
      <div
        className={styles.modalContainer}
        style={{ width: `${width}px`, height: `${height}px` }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 타이틀 */}
        <div className={styles.modalHeader}>
          <div className={styles.modalTitle}>{title}</div>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        {/* 컨텐츠 */}
        <div className={styles.modalContent}>{content}</div>

        {/* 푸터 (버튼 영역) */}
        {footer && <div className={styles.modalFooter}>{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;
