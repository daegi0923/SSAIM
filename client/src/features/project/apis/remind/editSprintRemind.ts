import apiClient from '@/apis/apiClient';
import config from '@/config/config';
import { SprintRemindRequestDTO } from '@features/project/types/remind/SprintRemndDTO';

export const editSprintRemind = async (projectId: number, weeklyRemindId:number, sprintRemindRequestDTO: SprintRemindRequestDTO) => {
  try {
    console.log(sprintRemindRequestDTO);
    const response = await apiClient.put(`${config.BASE_URL}/projects/${projectId}/weekly-remind/${weeklyRemindId}`, sprintRemindRequestDTO,
        {
            timeout: 30000, 
        }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error edit sprint remind:", error);
    throw error;
  }
};
