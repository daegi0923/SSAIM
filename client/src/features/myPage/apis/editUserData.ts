// src/feature/project/api/fetchWeeklyData.ts
import apiClient from '@/apis/apiClient';
import { UserInfoEditDTO } from '@features/user/types/UserInfoDTO';

export const editUserData = async (
  userId: number | null,
  userInfoUpdates: UserInfoEditDTO,
  userProfileImage: File | null = null
) => {
  console.log('patch user info data');
  if (!userId) {
    console.log('userId is required');
    return;
  }
  const formData = new FormData();
  const userInfoBlob = new Blob([JSON.stringify(userInfoUpdates)], { type: 'application/json' });
  formData.append('userInfo', userInfoBlob);

  if(userProfileImage){
    formData.append('userProfileImage', userProfileImage);
  }
  try {
    console.log(formData);
    const response = await apiClient.patch(`/users/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
