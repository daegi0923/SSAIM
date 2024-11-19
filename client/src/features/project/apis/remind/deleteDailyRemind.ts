import apiClient from '@/apis/apiClient';
import config from '@/config/config';

export const deleteDailyRemind = async (projectId: number, dailyRemindId:number) => {
  try {
    const response = await apiClient.delete(`${config.BASE_URL}/projects/${projectId}/daily-remind/${dailyRemindId}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error delete daily remind:", error);
    throw error;
  }
};
