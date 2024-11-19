import apiClient from '@/apis/apiClient';
import { ProjectEditDTO } from '../types/ProjectDTO';

export const editProfileInfo = (
  projectId: number,
  projectEditData: ProjectEditDTO,
  projectImage: File | null = null
): Promise<string> => {
  const formData = new FormData();
  const projectBlob = new Blob([JSON.stringify(projectEditData)], {
    type: 'application/json',
  });
  formData.append('projectInfo', projectBlob);
  if(projectImage){
    formData.append('projectImage', projectImage);
  }
  return apiClient
    .patch(`/projects/${projectId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response) => {
      console.log(response.data);
      return response.data;
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
};
