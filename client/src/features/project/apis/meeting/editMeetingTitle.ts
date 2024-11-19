import apiClient from '@/apis/apiClient'
import config from '@/config/config';
import { MeetingTitlePutDTO } from '@features/project/types/meeting/MeetingDTO';


export const editMeetingTitle = async (projectId: number, meetingId: number, meetingTitlePutDTO: MeetingTitlePutDTO) => {
  try {
    console.log(meetingTitlePutDTO)
    const response = await apiClient.put(`${config.BASE_URL}/projects/${projectId}/meetings/${meetingId}`, meetingTitlePutDTO);
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
