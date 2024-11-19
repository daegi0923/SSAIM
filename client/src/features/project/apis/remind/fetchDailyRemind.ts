import apiClient from '@/apis/apiClient';
import config from '@/config/config';
import { DailyRemindGetDTO } from '@features/project/types/remind/DailyRemindDTO';

export const fetchDailyRemind = async (
  projectId: number,  // 필수 값
  projectMemberId?: number, // 선택적 값 (undefined 가능)
  startDate?: string, // 선택적 값 (undefined 가능)
  endDate?: string // 선택적 값 (undefined 가능)
): Promise<DailyRemindGetDTO[]> => {
  try {
    // 기본 URL 생성
    const url = new URL(`${config.BASE_URL}/projects/${projectId}/daily-remind`);
    
    // 쿼리 파라미터 추가 (값이 있을 경우에만)
    if (projectMemberId) url.searchParams.append('projectMemberId', String(projectMemberId));
    if (startDate) url.searchParams.append('startDate', startDate);
    if (endDate) url.searchParams.append('endDate', endDate);

    // GET 요청 보내기
    const response = await apiClient.get(url.toString());
    console.log(response.data); // 응답 데이터 확인

    // 응답 데이터 반환
    return response.data;
  } catch (error) {
    console.error("Error fetching daily remind:", error);
    throw error;
  }
};
