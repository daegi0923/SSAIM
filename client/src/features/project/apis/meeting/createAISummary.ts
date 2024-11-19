import apiClient from '@/apis/apiClient';
import config from '@/config/config';

export const createAISummary = async (projectId: number, meetingId: number) => {
  try {
    const response = await apiClient.post(
      `${config.BASE_URL}/projects/${projectId}/meetings/${meetingId}`,
      {}, // post 요청의 body가 필요 없다면 빈 객체를 전달
      {
        timeout: 30000, // 개별 요청의 타임아웃을 30초로 설정
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating AI summary:', error);
    throw error;
  }
};
