import apiClient from '../../../apis/apiClient';


interface JiraApiKeyPayload {
  jiraApi: string;
  jiraProjectId : string;
}

interface GitlabApiKeyPayload {
  gitlabApi: string;
  gitlabProjectId : string;
}


export const fetchApiKey = async (
  type: 'jira' | 'gitlab',
  method: 'patch',
  apiKey: JiraApiKeyPayload | GitlabApiKeyPayload,
  projectId: number
) => {
  try {
    let response;
    
    // 타입 가드 적용
    if (type === 'jira' && 'jiraApi' in apiKey) {
      response = await apiClient[method](`/projects/${projectId}/${type}-api`, apiKey);
    } else if (type === 'gitlab' && 'gitlabApi' in apiKey) {
      response = await apiClient[method](`/projects/${projectId}/${type}-api`, apiKey);
    } else {
      throw new Error('Invalid apiKey structure for the specified type');
    }
    
    console.log(response?.data);
    console.log(projectId);
    return response?.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
