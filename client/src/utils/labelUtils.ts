// 각 레이블에 해당하는 맵 정의
export const domainMap: Record<string, string> = {
    1: '웹기술',
    2: '웹디자인',
    3: '모바일',
    4: 'AIoT',
    5: 'AI영상',
    6: 'AI음성',
    7: '추천',
    8: '분산',
    9: '자율주행',
    10: '스마트홈',
    11: 'P2P',
    12: '디지털거래',
    13: '메타버스',
    14: '핀테크',
    15: '자유주제',
    16: '기업연계',
    17: '오픈소스'
};

export const regionMap: Record<string, string> = {
    1: '서울',
    2: '대전',
    3: '광주',
    4: '구미',
    5: '부울경'
};

export const statusMap: Record<string, string> = {
    1: '모집',
    0: '마감'
};

export const positionMap: Record<string, string> = {
    1: 'FE',
    2: 'BE',
    3: 'Infra'
};

export const applicationStatusMap: Record<string, string> = {
    '1': '수락됨',
    '0': '대기중',
    '-1': '거절됨',
};

export const apiStatusMap: Record<string, string> = {
    0: '계획',
    1: '진행중',
    2: '완료',
};

// 각 레이블을 ID로 변환하는 함수들
export const getDomainLabel = (id: number) => domainMap[id] || 'Unknown';
export const getRegionLabel = (id: number) => regionMap[id] || 'Unknown';
export const getStatusLabel = (id: number) => statusMap[id] || 'Unknown';
export const getPositionLabel = (id: number) => positionMap[id] || 'Unknown';
export const getApplicationStatusLabel = (id: number) => applicationStatusMap[id] || 'Unknown';
export const getApiStatusLabel = (id: number) => apiStatusMap[id] || 'Unknown';
