import apiClient from '@/apis/apiClient'
import config from '@/config/config';
import { MeetingScriptPutDTO } from '@features/project/types/meeting/MeetingDTO';


export const editMeetingScript = async (projectId: number, meetingId: number, meetingScriptPutDTO: MeetingScriptPutDTO) => {
  try {
    console.log(meetingScriptPutDTO)
    const response = await apiClient.put(`${config.BASE_URL}/projects/${projectId}/meetings/${meetingId}/script`, meetingScriptPutDTO);
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
