import apiClient from '@/apis/apiClient';
import config from '@/config/config';


export const deleteSprintRemind = async (projectId: number, weeklyRemindId:number ) => {
  try {
    const response = await apiClient.delete(`${config.BASE_URL}/projects/${projectId}/weekly-remind/${weeklyRemindId}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error delete sprint remind:", error);
    throw error;
  }
};
