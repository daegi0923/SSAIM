import apiClient from '../../../../apis/apiClient';
import { RecruitingFormData } from '../../types/editTeam/RecruitingFormData';

export const editRecruiting = async(postId: number, formData: RecruitingFormData) => {
    try{
        await console.log(formData);
        const response = await apiClient.patch(`/recruiting/posts/${postId}`, formData);
        console.log(response.data);
        return response.data;
    } catch (error){
        console.log(error);
        throw error;
    }
}