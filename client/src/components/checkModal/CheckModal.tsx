import React from 'react';
import styles from './CheckModal.module.css';
interface CheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  onConfirm: () => void;
  confirmContent: string;
  width?: number;
  height?: number;
}

const CheckModal: React.FC<CheckModalProps> = ({
  isOpen,
  onClose,
  title,
  content,
  onConfirm,
  confirmContent,
}) => {
  if (!isOpen) return null;
  const handleConfirm = () => {
    onClose();
    onConfirm();
  };
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <div className={styles.title}>{title}</div>
          <button className={styles.closeButton} onClick={onClose}>
            X
          </button>
        </div>
        <div className={styles.modalBody}>{content} </div>
        <div className={styles.modalFooter}>
          <button className={styles.saveButton} onClick={handleConfirm}>
            {confirmContent}
          </button>
          <button className={styles.cancelButton} onClick={onClose}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckModal;
