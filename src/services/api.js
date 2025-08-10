import axios from 'axios'
import { enqueueSnackbar } from 'notistack'

const baseUrl = process.env.REACT_APP_API_URL

export const submitFeedback = async (data) => {
    try{
        const authorization = localStorage.getItem('token')
        console.log({authorization})
        const response = await axios.post(`${baseUrl}/feedback`, data, {
            headers: {
                Authorization: authorization
            }
        })
        if(response.status === 201){
            enqueueSnackbar('Feedback submitted successfully!', { variant: 'success' });
            return response.data
        }
        else{
            enqueueSnackbar('Failed to submit feedback', {variant: 'error'})
        }

    }catch(error){
        console.log(error)
    }
}

export const listProperty = async () => {
    try{
        const authorization = localStorage.getItem('token')
        const response = await axios.get(`${baseUrl}/property`, {
            headers: {
                Authorization: authorization
            }
        })
        return response.data
    }catch(error){
        console.log(error)
    }
}

// Upload photos to S3 via custom backend endpoint
export const uploadPhotoToS3 = async (file, options = {}) => {
    try {
        const formData = new FormData();
        formData.append('files', file);
     
        const response = await axios.post('http://localhost:8000/upload-photos', formData);

        if (response.status === 200 || response.status === 201) {
            return response.data;
        } else {
            throw new Error(`Upload failed with status: ${response.status}`);
        }
    } catch (error) {
        console.error('S3 upload error:', error);
        throw error;
    }
}

export const createProperty = async (data) => {
    try{
        const authorization = localStorage.getItem('token')
        const response = await axios.post(`${baseUrl}/property`, data, {
            headers: {
                Authorization: authorization
            }
        })
        return response.data
    }catch(error){
        console.log(error)
    }
}

export const getPropertyDetails = async (id) => {
    try{
        const authorization = localStorage.getItem('token')
        const response = await axios.get(`${baseUrl}/property/${id}`, {
            headers: {
                Authorization: authorization
            }
        })
        return response
    }catch(error){
        console.log(error)
    }
}
