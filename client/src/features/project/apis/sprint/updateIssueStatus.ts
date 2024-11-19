import apiClient from '@/apis/apiClient';

export const updateIssueStatus = async (
  projectId: number,
  issueKey: string,
  status: 'todo' | 'inProgress' | 'done'
) => {
  try {
    const response = await apiClient.post(`/projects/${projectId}/issue/${issueKey}?status=${status}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('API 호출 실패:', error);
    throw error; // 에러를 다시 던져 React Query에서 처리
  }
};
