import apiClient from '../../../../apis/apiClient';
import { RecruitingFormData } from '../../types/createTeam/RecruitingFormData';

export const createRecruiting = async(formData: RecruitingFormData) => {
    try{
        await console.log(formData);
        const response = await apiClient.post('/recruiting/posts', formData);
        console.log(response.data);
        return response.data;
    } catch (error){
        console.log(error);
        throw error;
    }
}