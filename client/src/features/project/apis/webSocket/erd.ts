import apiClient from '../../../../apis/apiClient';

export const getErd = async(projectId:string) => {
    try{
        const response = await apiClient.get(`/projects/${projectId}/ERD`);
        console.log(response.data);
        return response.data;
    } catch (error){
        console.log(error);
        throw error;
    }
}

export const postErd = async(projectId:string, formData:FormData) => {
    try{
        const response = await apiClient.post(`/projects/${projectId}/ERD`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log(response.data);
        return response.data;
    } catch (error){
        console.log(error);
        throw error;
    }
}

export const patchErd = async(projectId:string, formData:FormData) => {
    try{
        const response = await apiClient.patch(`/projects/${projectId}/ERD`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log(response.data);
        return response.data;
    } catch (error){
        console.log(error);
        throw error;
    }
}
