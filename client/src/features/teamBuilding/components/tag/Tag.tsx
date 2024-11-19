import React from 'react';
import styles from './Tag.module.css';

interface TagProps {
    text: string;
    useDefaultColors?: boolean;
    onClick?: () => void;
    disablePointerCursor?: boolean;
    badgeText?: string;
}

const Tag: React.FC<TagProps> = ({
    text,
    useDefaultColors = false,
    onClick,
    disablePointerCursor,
    badgeText
}) => {
    // 기본 색상 정의
    const defaultBackgroundColor = '#d9d9d9';
    const defaultFontColor = '#000000';

    // 색상 맵 정의
    const colorMap: { [key: string]: { backgroundColor: string; fontColor: string } } = {
        FE: { backgroundColor: '#B6EDD7', fontColor: '#0EA475' },
        BE: { backgroundColor: '#D9E5F8', fontColor: '#427DDC' },
        Infra: { backgroundColor: '#FFF0D8', fontColor: '#FFA308' },
        자유주제: { backgroundColor: '#17C585', fontColor: '#FFFFFF' },
        기업연계: { backgroundColor: '#913BF6', fontColor: '#FFFFFF' },
        오픈소스: { backgroundColor: '#E81E97', fontColor: '#FFFFFF' },
        AI영상: { backgroundColor: '#433878', fontColor: '#FFFFFF' },
        AI음성: { backgroundColor: '#891CB4', fontColor: '#FFFFFF' },
        분산: { backgroundColor: '#1DA10B', fontColor: '#FFFFFF' },
        추천: { backgroundColor: '#216E4E', fontColor: '#FFFFFF' },
        P2P: { backgroundColor: '#124992', fontColor: '#FFFFFF' },
        디지털거래: { backgroundColor: '#001EB6', fontColor: '#FFFFFF' },
        자율주행: { backgroundColor: '#E78835', fontColor: '#FFFFFF' },
        스마트홈: { backgroundColor: '#DB5B00', fontColor: '#FFFFFF' },
        메타버스: { backgroundColor: '#962020', fontColor: '#FFFFFF' },
        핀테크: { backgroundColor: '#009CB8', fontColor: '#FFFFFF' },
        웹기술: { backgroundColor: '#0E7ACE', fontColor: '#FFFFFF' },
        웹디자인: { backgroundColor: '#B728A4', fontColor: '#FFFFFF' },
        모바일: { backgroundColor: '#5EB9A0', fontColor: '#FFFFFF' },
        AIoT: { backgroundColor: '#84C30F', fontColor: '#FFFFFF' },
        모집: { backgroundColor: '#3C93E8', fontColor: '#FFFFFF' },
        마감: { backgroundColor: '#FA563B', fontColor: '#FFFFFF' },
        미정: { backgroundColor: '#4F4F4F', fontColor: '#d9d9d9' },
        계획: { backgroundColor: '#dbeddb', fontColor: '#000000' },
        진행중: { backgroundColor: '#fadec9', fontColor: '#000000' },
        완료: { backgroundColor: '#d3e5ef', fontColor: '#000000' },
        GET: { backgroundColor: '#088337', fontColor: '#FFFFFF' },
        POST: { backgroundColor: '#af7e0c', fontColor: '#FFFFFF' },
        PUT: { backgroundColor: '#1460BE', fontColor: '#FFFFFF' },
        PATCH: { backgroundColor: '#805BAB', fontColor: '#FFFFFF' },
        DELETE: { backgroundColor: '#972C23', fontColor: '#FFFFFF' },
        나가기: { backgroundColor: '#FF0000', fontColor: '#FFFFFF' },
        상: { backgroundColor: '#ff7452', fontColor: '#FFFFFF' },
        중: { backgroundColor: '#ffab00', fontColor: '#FFFFFF' },
        하: { backgroundColor: '#0065ff', fontColor: '#FFFFFF' },
    };

    // 해당 텍스트에 맞는 색상 가져오기
    const { backgroundColor, fontColor } = useDefaultColors
        ? { backgroundColor: defaultBackgroundColor, fontColor: defaultFontColor }
        : colorMap[text] || { backgroundColor: defaultBackgroundColor, fontColor: defaultFontColor };

    return (
        <div className={styles.tagContainer}>
            {badgeText && <span className={styles.badge}>{badgeText}</span>}
            <span
                className={styles.tag}
                style={{ 
                    backgroundColor, 
                    color: fontColor,
                    cursor: disablePointerCursor ? 'default' : 'pointer',
                }}
                onClick={onClick}
            >
                {text}
            </span>
        </div>
    );
};

export default Tag;
