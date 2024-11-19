import apiClient from '@/apis/apiClient'
import config from '@/config/config';
import { DevelopStoryDTO } from '@features/remind/types/DevelopStoryDTO';

export const fetchDevelopStory = async (
    userId: number
): Promise<DevelopStoryDTO[]> => {
  console.log('fetch develop story data')
  try {
    const url = new URL(`${config.BASE_URL}/projects/development-story`);

    url.searchParams.append('userId', String(userId));

    const response = await apiClient.get(url.toString());
    console.log(response.data); // 응답 데이터 확인

    return response.data;
  } catch (error) {
    console.error("Error fetching daily remind:", error);
    throw error;
  }
};

