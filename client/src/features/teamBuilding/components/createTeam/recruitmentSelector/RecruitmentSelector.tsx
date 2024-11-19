import React from 'react';
import Tag from '@features/teamBuilding/components/tag/Tag';
import styles from '../CreateTeam.module.css';

interface Recruitment {
    FE: number;
    BE: number;
    Infra: number;
}

interface RecruitmentSelectorProps {
    recruitment: Recruitment;
    N: number;
    inputValue: string;
    onInputChange: (value: string) => void;
    onSliderChange: (role: keyof Recruitment, value: number) => void;
    onNChange: (n: number) => void;
}

const RecruitmentSelector: React.FC<RecruitmentSelectorProps> = ({
    recruitment,
    N,
    inputValue,
    onInputChange,
    onSliderChange,
    onNChange,
}) => (
    <div className={styles.formGroup}>
        <label className={styles.sectionLabel}>
            모집 인원
            <input
                type="number"
                min={0}
                max={9}
                value={inputValue}
                onChange={(e) => {
                    const value = e.target.value;
                    if (value === '') {
                        onInputChange('');
                        return;
                    }
                    let numericValue = parseInt(value);
                    if (numericValue > 9) numericValue = 9;
                    if (numericValue < 0) numericValue = 0;
                    onInputChange(numericValue.toString());
                    onNChange(numericValue);
                }}
                onBlur={() => {
                    if (inputValue === '') {
                        onInputChange('0');
                        onNChange(0);
                    }
                }}
                onFocus={(e) => e.target.select()}
                className={styles.numberInput}
            />
        </label>
        <div className={styles.recruitmentOptions}>
            {(['FE', 'BE', 'Infra'] as const).map((role) => (
                <div key={role} className={styles.role}>
                    <div>
                        <Tag text={role} />
                    </div>
                    <span>{recruitment[role]}</span>
                    <input
                        type="range"
                        min="0"
                        max={N}
                        value={recruitment[role]}
                        onChange={(e) => onSliderChange(role, parseInt(e.target.value))}
                        className={styles.slider}
                    />
                </div>
            ))}
        </div>
    </div>
);

export default RecruitmentSelector;
