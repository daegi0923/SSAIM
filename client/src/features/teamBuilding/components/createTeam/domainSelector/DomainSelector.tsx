import React from 'react';
import Tag from '@features/teamBuilding/components/tag/Tag';
import styles from '../CreateTeam.module.css';

interface Domain {
    id: number;
    categoryId: number;
    name: string;
}

interface DomainSelectorProps {
    domains: Domain[];
    selectedDomains: number[];
    onDomainClick: (domainId: number) => void;
}

const DomainSelector: React.FC<DomainSelectorProps> = ({ domains, selectedDomains, onDomainClick }) => {
    const getCategoryName = (category: string) => {
        return category === 'common' ? '공통' : category === 'specialized' ? '특화' : '자율';
    };

    const getCategoryDomains = (category: string) => {
        return domains.filter(
            (domain) =>
                (category === 'common' && domain.categoryId === 1) ||
                (category === 'specialized' && domain.categoryId === 2) ||
                (category === 'autonomous' && domain.categoryId === 3)
        );
    };

    return (
        <div className={styles.formGroup}>
            <label className={styles.sectionLabel}>도메인 선택(최대 2개)</label>
            <div className={styles.tagOptions}>
                {['common', 'specialized', 'autonomous'].map((category) => {
                    const categoryDomains = getCategoryDomains(category);
                    const categoryName = getCategoryName(category);

                    return (
                        <div key={category} className={styles.domainWrapper}>
                            <div
                                className={`${styles.categoryBox} ${
                                    selectedDomains.some((domainId) => {
                                        const domain = domains.find((d) => d.id === domainId);
                                        return (
                                            (category === 'common' && domain?.categoryId === 1) ||
                                            (category === 'specialized' && domain?.categoryId === 2) ||
                                            (category === 'autonomous' && domain?.categoryId === 3)
                                        );
                                    })
                                        ? styles.activeCategory
                                        : ''
                                }`}
                            >
                                {categoryName}
                            </div>
                            <div className={styles.tagList}>
                                {categoryDomains.map((domain) => (
                                    <Tag
                                        key={domain.id}
                                        text={domain.name}
                                        badgeText={
                                            selectedDomains.includes(domain.id)
                                                ? (selectedDomains.indexOf(domain.id) + 1).toString()
                                                : undefined
                                        }
                                        useDefaultColors={!selectedDomains.includes(domain.id)}
                                        onClick={() => onDomainClick(domain.id)}
                                    />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DomainSelector;
