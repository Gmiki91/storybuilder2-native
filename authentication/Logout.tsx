import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Logout = () => {
    const { setToken } = useAuth();
    AsyncStorage.removeItem('token');
    useEffect(() => {
        let mounted=true;
        if(mounted)
        setToken(undefined);
        return () => { mounted = false }
    })
    return (null)
}
export default Logout;