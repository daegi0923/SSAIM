import apiClient from '../../../apis/apiClient';
import {ProjectCreateDTO} from '@features/project/types/ProjectDTO'


export const createProject = async(projectData : ProjectCreateDTO, projectImage: File|null = null) => {
  try{
    const formData = new FormData();
    const projectBlob = new Blob([JSON.stringify(projectData)], { type: 'application/json' });
    formData.append('projectInfo', projectBlob);
    await console.log(projectData);
    if(projectImage){
      formData.append('projectImage', projectImage);
    }
    const response = await apiClient.post('/projects', formData,
      {
        headers: {
          'Content-Type':'multipart/form-data'
        }
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error){
    console.log(error);
    throw error;
  }
}