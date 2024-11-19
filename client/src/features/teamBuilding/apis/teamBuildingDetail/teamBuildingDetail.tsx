import apiClient from "@/apis/apiClient";

export interface createCommentParams {
    userId: number;
    position: number;
    message: string;
}

export interface editCommentParams {
    position?: number;
    status?: number;
    message?: string;
}

export const getPostInfo = async(postId:number) => {
    try{
        const response = await apiClient.get(`/recruiting/posts/${postId}`);
        console.log(response.data);
        return response.data;
    } catch (error){
        console.log(error);
        throw error;
    }
}

export const deletePost = async(postId:number) => {
    try{
        const response = await apiClient.delete(`/recruiting/posts/${postId}`);
        console.log(response.data);
        return response.data;
    } catch (error){
        console.log(error);
        throw error;
    }
}

export const createComment = async(postId:number, params: createCommentParams) => {
    try{
        const response = await apiClient.post(`/recruiting/posts/${postId}/applicants`, params);
        console.log(response.data);
        return response.data;
    } catch (error){
        console.log(error);
        throw error;
    }
}

export const editComment = async(postId:number, applicantId:number, params: editCommentParams) => {
    try{
        const response = await apiClient.patch(`/recruiting/posts/${postId}/applicants/${applicantId}`, params);
        console.log(response.data);
        return response.data;
    } catch (error){
        console.log(error);
        throw error;
    }
}

export const deleteComment = async(postId:number, applicantId:number) => {
    try{
        const response = await apiClient.delete(`/recruiting/posts/${postId}/applicants/${applicantId}`);
        console.log(response.data);
        return response.data;
    } catch (error){
        console.log(error);
        throw error;
    }
}