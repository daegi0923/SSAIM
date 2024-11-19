import React from 'react';
import styles from '../CreateTeam.module.css';

interface RegionSelectorProps {
    selectedRegion: number | null;
    regions: { id: number; name: string }[];
    onRegionChange: (id: number) => void;
}

const RegionSelector: React.FC<RegionSelectorProps> = ({ selectedRegion, regions, onRegionChange }) => (
    <div className={styles.formGroup}>
        <label className={styles.sectionLabel}>지역 선택</label>
        <div className={styles.regionOptions}>
            {regions.map((city) => (
                <label key={city.id} className={styles.regionLabel}>
                    <input
                        type="checkbox"
                        checked={selectedRegion === city.id}
                        onChange={() => onRegionChange(city.id)}
                    />{" "}
                    {city.name}
                </label>
            ))}
        </div>
    </div>
);

export default RegionSelector;
