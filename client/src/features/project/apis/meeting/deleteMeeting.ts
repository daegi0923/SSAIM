import apiClient from '@/apis/apiClient'
import config from '@/config/config';

export const deleteMeeting = async (projectId: number, meetingId: number) => {
  try {
    const response = await apiClient.delete(`${config.BASE_URL}/projects/${projectId}/meetings/${meetingId}`);
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.log(error);
  }
};