import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Logout =  () => {
    const { setToken } = useAuth();
   
    useEffect(() => {
        let mounted=true;
        if(mounted)
        clear();
        return () => { mounted = false }
    })
    

    const clear=async()=>{
        setToken(undefined);
        await AsyncStorage.removeItem('token');
    }
    return (null)
}
export default Logout;