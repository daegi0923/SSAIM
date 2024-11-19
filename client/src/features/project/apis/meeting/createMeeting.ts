import apiClient from '@/apis/apiClient';
import config from '@/config/config';
import { MeetingPostDTO } from '@features/project/types/meeting/MeetingDTO';

export const createMeeting = async (projectId: number, meetingPostDTO: MeetingPostDTO) => {
  try {
    // FormData 객체 생성
    const formData = new FormData();
    formData.append('audiofile', meetingPostDTO.audiofile); // 파일 추가
    formData.append('meetingRequestDto', 
        new Blob([JSON.stringify(meetingPostDTO.meetingRequestDto)], { type: "application/json" })); 

    const response = await apiClient.post(
      `${config.BASE_URL}/projects/${projectId}/meetings`,
      formData,
      {
        timeout: 100000, // Timeout increased to 100 seconds
    }
    );

    console.log("Response Data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating meeting:", error);
    throw error;
  }
};
