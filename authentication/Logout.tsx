import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Logout = () => {
    const { setToken } = useAuth();
    AsyncStorage.removeItem('token');
    
    useEffect(() => {
        setToken(undefined);
    })
    return (null)
}
export default Logout;