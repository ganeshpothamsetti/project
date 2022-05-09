import axios from 'axios'
import { toast } from 'react-toastify';
import logger from './logService'


axios.defaults.baseURL = "http://localhost:8000";

axios.interceptors.response.use(null, error => {
    const expectedError = error.response && error.response.status >= 400 && error.response.status <= 500;

    if (error.response?.data?.status === 401 && error.response?.data?.message === 'TokenExpiredError'){
        // Remove user details from localStorage
        localStorage.removeItem('access_token')
        localStorage.removeItem('userName')
        window.location = "/"
    }

    if (!expectedError) {
        logger.log(error);
        toast.error('an unexpected error occurred');

    }
    return Promise.reject(error);
});

function setJwt(jwt) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;
}

export default {
    get: axios.get,
    post: axios.post,
    put: axios.put,
    delete: axios.delete,
    setJwt
};