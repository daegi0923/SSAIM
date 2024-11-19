import apiClient from '@/apis/apiClient';
import { ISOStringFormat } from 'date-fns';

export const fetchGitlabData = async (projectId: number, startDate: ISOStringFormat, endDate: ISOStringFormat) => {
  console.log('fetch gitlab data');
  try {
    await console.log(startDate, endDate)
    const response = await apiClient.get(`/projects/${projectId}/gitlab-api?startDate=${startDate}&endDate=${endDate}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
