import apiClient from '../../../apis/apiClient';
import { BaseUserDTO } from '@features/user/types/UserInfoDTO';

export const signUp = async (signUpData: BaseUserDTO, userProfileImage:File|null = null) => {
  console.log(signUpData);
  try {
    const formData = new FormData();
    const signUpBlob = new Blob([JSON.stringify(signUpData)], { type: 'application/json' });
    formData.append('userInfo', signUpBlob);

    if (userProfileImage) {
      formData.append('userProfileImage', userProfileImage);
    }
    console.log(formData.getAll)
    const response = await apiClient.post('/users', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('sign up success!');
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error('Failed to signup');
  }
};
