import apiClient from '@/apis/apiClient';
import config from '@/config/config';
import { DailyRemindPostDTO } from '@features/project/types/remind/DailyRemindDTO';

export const createDailyRemind = async (projectId: number, dailyRemindpostData: DailyRemindPostDTO) => {
  try {
    console.log(dailyRemindpostData);
    const response = await apiClient.post(`${config.BASE_URL}/projects/${projectId}/daily-remind`, dailyRemindpostData);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating daily remind:", error);
    throw error;
  }
};
