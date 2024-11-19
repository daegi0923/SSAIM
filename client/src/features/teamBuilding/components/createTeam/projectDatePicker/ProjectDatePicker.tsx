import React from 'react';
import styles from '../CreateTeam.module.css';

interface ProjectDatePickerProps {
    startDate: string;
    endDate: string;
    onStartDateChange: (date: string) => void;
    onEndDateChange: (date: string) => void;
}

const ProjectDatePicker: React.FC<ProjectDatePickerProps> = ({ startDate, endDate, onStartDateChange, onEndDateChange }) => (
    <div className={styles.formGroup}>
        <label className={styles.sectionLabel}>프로젝트 기간</label>
        <div className={styles.dateInputs}>
            <input
                type="date"
                value={startDate}
                onChange={(e) => onStartDateChange(e.target.value)}
                max={endDate || undefined}
                className={styles.dateInput}
            />
            <span className={styles.dateSeparator}>~</span>
            <input
                type="date"
                value={endDate}
                onChange={(e) => onEndDateChange(e.target.value)}
                min={startDate || undefined}
                className={styles.dateInput}
            />
        </div>
    </div>
);

export default ProjectDatePicker;
