import React, { useState, useRef, useEffect } from 'react';
import styles from './ApiDetailModal.module.css';
import Tag from '@/features/teamBuilding/components/tag/Tag';
import { getApiStatusLabel } from '@/utils/labelUtils';

interface ApiDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
  rowIndex: number;
  setData: (data: any) => void;
  projectId: string;
  stompClient: any;
}

const ApiDetailModal: React.FC<ApiDetailModalProps> = ({
  isOpen,
  onClose,
  data,
  rowIndex,
  setData,
  projectId,
  stompClient,
}) => {
  const [editingField, setEditingField] = useState<string | null>(null);
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const textareaRefs = useRef<{ [key: string]: HTMLTextAreaElement | null }>({});

  const autoResize = (element: HTMLTextAreaElement) => {
    element.style.height = 'auto';
    element.style.height = `${element.scrollHeight}px`;
  };

  useEffect(() => {
    if (editingField && inputRefs.current[editingField]) {
      inputRefs.current[editingField]?.focus();
    }
  }, [editingField]);

  useEffect(() => {
    if (isOpen && data) {
      Object.keys(textareaRefs.current).forEach((key) => {
        const textarea = textareaRefs.current[key];
        if (textarea) {
          autoResize(textarea);
        }
      });
    }
  }, [isOpen, data]);

  const handleInputChange = (column: string, value: string) => {
    const updatedColumn = [...data[column]];
    updatedColumn[rowIndex] = value;

    const updatedData = { ...data, [column]: updatedColumn };
    setData(updatedData);

    if (stompClient?.connected) {
      stompClient.send(
        `/app/edit/api/v1/projects/${projectId}/api-docs`,
        {},
        JSON.stringify(updatedData)
      );
    }
  };

  const handleFieldClick = (key: string) => {
    setEditingField(key);
  };

  const handleOutsideClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;

    if (
      !target.closest(`.${styles.valueTextarea}`) &&
      !target.closest(`.${styles.valueText}`) &&
      !target.closest(`.${styles.statusSelection}`)
    ) {
      setEditingField(null);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  if (!isOpen || rowIndex === null) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
      >
        <input
          className={styles.descriptionTextarea}
          value={data.functionName[rowIndex]}
          placeholder="API 이름을 입력하세요."
          onChange={(e) => handleInputChange('functionName', e.target.value)}
        />
        <div className={styles.keyValueList}>
          {Object.keys(data).map((key) =>
            ![
              'requestHeader',
              'requestBody',
              'responseHeader',
              'responseBody',
              'description',
              'functionName',
            ].includes(key) ? (
              <div key={key} className={styles.keyValueRow}>
                <span className={styles.key}>
                  {key === 'frontState' || key === 'backState' ? (
                    key === 'frontState' ? 'FE 상태' : 'BE 상태'
                  ) : (
                    key
                  )}
                </span>
                {editingField === key ? (
                  key === 'frontState' || key === 'backState' ? (
                    // 드롭다운 또는 버튼 목록
                    <div className={styles.statusSelection}>
                      {[0,1,2].map((value) => (
                        <>
                          <Tag
                            key={value}
                            text={getApiStatusLabel(value)}
                            useDefaultColors={data[key][rowIndex] != value}
                            onClick={() => {
                              handleInputChange(key, value.toString());
                              setEditingField(null);
                            }}
                          />
                        </>
                      ))}
                    </div>
                  ) : key === 'method' ? (
                    // method를 위한 드롭다운
                    <div className={styles.statusSelection}>
                      {['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map((value) => (
                        <>
                          <Tag
                            key={value}
                            text={value}
                            useDefaultColors={data[key][rowIndex] != value}
                            onClick={() => {
                              handleInputChange(key, value);
                              setEditingField(null);
                            }}
                          />
                        </>
                      ))}
                    </div>
                  ) : (
                    <input
                      ref={(el) => (inputRefs.current[key] = el)}
                      className={styles.valueTextarea}
                      value={data[key][rowIndex]}
                      onChange={(e) => handleInputChange(key, e.target.value)}
                    />
                  )
                ) : (
                  <span
                    className={`${styles.valueText} ${
                      !data[key][rowIndex] ? styles.placeholder : ''
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFieldClick(key);
                    }}
                  >
                    {key === 'frontState' || key === 'backState' ? (
                      <Tag
                        text={getApiStatusLabel(parseInt(data[key][rowIndex]))}
                      />
                    ) : key === 'method' ? (
                      <Tag
                        text={data[key][rowIndex]}
                      />
                    ) : (
                      data[key][rowIndex]
                    )}
                  </span>
                )}
              </div>
            ) : null
          )}
        </div>
        <div className={styles.bodyContainer}>
          {['description', 'requestHeader', 'requestBody', 'responseHeader', 'responseBody'].map((key) => (
            <div key={key} className={styles.bodySection}>
              <h3 className={styles.bodyTitle}>{key}</h3>
              <textarea
                ref={(el) => (textareaRefs.current[key] = el)}
                className={styles.bodyTextarea}
                value={data[key][rowIndex]}
                onChange={(e) => handleInputChange(key, e.target.value)}
                onInput={(e) => autoResize(e.target as HTMLTextAreaElement)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ApiDetailModal;
