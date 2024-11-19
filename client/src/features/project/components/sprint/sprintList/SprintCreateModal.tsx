import React, { useState, useMemo } from "react";
import { SprintCreateDTO } from "@/features/project/types/SprintDTO";
import styles from "./SprintCreateModal.module.css";
import { showToast } from "@/utils/toastUtils";
import { startOfWeek, endOfWeek, addWeeks, format } from "date-fns";
import { toast } from "react-toastify";
interface SprintCreateModalProps {
  onClose: () => void;
  onCreate: (data: SprintCreateDTO) => void;
}

const SprintCreateModal: React.FC<SprintCreateModalProps> = ({
  onClose,
  onCreate,
}) => {
  const today = new Date();
  const isFridayOrAfter = today.getDay() >= 5; // 금요일(5) 이후인지 확인

  // 현재 주 또는 다음 주 계산
  const currentWeek = {
    startDate: startOfWeek(today, { weekStartsOn: 1 }),
    endDate: endOfWeek(today, { weekStartsOn: 1 }),
  };
  const nextWeek = {
    startDate: startOfWeek(addWeeks(today, 1), { weekStartsOn: 1 }),
    endDate: endOfWeek(addWeeks(today, 1), { weekStartsOn: 1 }),
  };

  const availableWeeks = useMemo(() => {
    const weeks = [
      {
        label: `${format(currentWeek.startDate, "yyyy-MM-dd")} ~ ${format(
          currentWeek.endDate,
          "yyyy-MM-dd"
        )}`,
        startDate: currentWeek.startDate,
        endDate: currentWeek.endDate,
      },
    ];
    if (isFridayOrAfter) {
      weeks.push({
        label: `${format(nextWeek.startDate, "yyyy-MM-dd")} ~ ${format(
          nextWeek.endDate,
          "yyyy-MM-dd"
        )}`,
        startDate: nextWeek.startDate,
        endDate: nextWeek.endDate,
      });
    }
    return weeks;
  }, [currentWeek, nextWeek, isFridayOrAfter]);

  const [formData, setFormData] = useState<SprintCreateDTO>({
    name: "",
    startDate: currentWeek.startDate,
    endDate: currentWeek.endDate,
    goals: "",
  });

  const handleWeekSelect = (index: number) => {
    const selectedWeek = availableWeeks[index];
    setFormData({
      ...formData,
      startDate: selectedWeek.startDate,
      endDate: selectedWeek.endDate,
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "name" && value.length > 20) {
      const toastId = "name-length-warning";
      if (!toast.isActive(toastId)) {
        showToast.warn("스프린트 이름은 최대 20자까지 입력 가능합니다.", {
          toastId,
        });
      }
      return;
    }

    if (name === "goals" && value.length > 30) {
      const toastId = "goals-length-warning";
      if (!toast.isActive(toastId)) {
        showToast.warn("스프린트 목표는 최대 30자까지 입력 가능합니다.", {
          toastId,
        });
      }
      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showToast.warn("스프린트 이름을 입력하세요.");
      return;
    }

    if (!formData.goals.trim()) {
      showToast.warn("스프린트 목표를 입력하세요.");
      return;
    }

    onCreate(formData);
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3 className={styles.modalTitle}>새 스프린트 생성</h3>
        <form onSubmit={handleSubmit}>
          <label>
            이름:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={styles.inputField}
              placeholder="20자 이내로 입력"
            />
          </label>
          <label>
            주 선택:
            <select
              onChange={(e) => handleWeekSelect(Number(e.target.value))}
              className={styles.selectField}
              defaultValue={0}>
              {availableWeeks.map((week, index) => (
                <option key={index} value={index}>
                  {week.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            목표:
            <textarea
              name="goals"
              value={formData.goals}
              onChange={handleChange}
              required
              className={styles.textArea}
              placeholder="30자 이내로 입력"
            />
          </label>
          <div className={styles.buttonContainer}>
            <button type="submit" className={styles.submitButton}>
              생성
            </button>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}>
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SprintCreateModal;
