import apiClient from '@/apis/apiClient';
import config from '@/config/config';
import { DailyRemindPutDTO } from '@features/project/types/remind/DailyRemindDTO';

export const editDailyRemind = async (projectId: number, dailyRemindId:number, dailyRemindPutDTO: DailyRemindPutDTO) => {
  try {
    console.log(dailyRemindPutDTO);
    const response = await apiClient.put(`${config.BASE_URL}/projects/${projectId}/daily-remind/${dailyRemindId}`, dailyRemindPutDTO);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error editing daily remind:", error);
    throw error;
  }
};
