import axios from '../api/axios';
import useAuth from './useAuth';

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        const response = await axios.post('/auth/refresh', {}, {
            withCredentials: true // send cookies
        });
        
        setAuth(prev => {
            return {
                ...prev,
                role: response.data.role,
                accessToken: response.data.accessToken
            }
        });
        
        return response.data.accessToken;
    }

    return refresh;
};

export default useRefreshToken;
