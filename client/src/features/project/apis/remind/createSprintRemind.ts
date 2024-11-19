import apiClient from '@/apis/apiClient';
import config from '@/config/config';
import { SprintRemindRequestDTO } from '@features/project/types/remind/SprintRemndDTO';

export const createSprintRemind = async (projectId: number, sprintRemindRequestDTO: SprintRemindRequestDTO) => {
  try {
    console.log(sprintRemindRequestDTO);
    const response = await apiClient.post(`${config.BASE_URL}/projects/${projectId}/weekly-remind`, sprintRemindRequestDTO,
        {
            timeout: 30000, // Timeout increased to 10 seconds
        }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating sprint remind:", error);
    throw error;
  }
};
