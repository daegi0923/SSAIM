import apiClient from '@/apis/apiClient'
import config from '@/config/config';

export const fetchMeetingList = async (projectId: number) => {
  try {
    const response = await apiClient.get(`${config.BASE_URL}/projects/${projectId}/meetings`);
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
