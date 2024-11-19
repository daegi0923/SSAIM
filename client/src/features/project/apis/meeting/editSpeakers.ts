import apiClient from '@/apis/apiClient'
import config from '@/config/config';

export const editSpeakers = async (projectId: number, meetingId: number, requestBody: Array<{ label: string; name: string }>) => {
  try {
    const response = await apiClient.put(`${config.BASE_URL}/projects/${projectId}/meetings/${meetingId}/speaker`, requestBody);
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
