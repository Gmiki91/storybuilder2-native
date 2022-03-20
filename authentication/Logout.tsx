import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { Color } from '../Global';

const Logout =  () => {
    const { setToken } = useAuth();

    const logout=async()=>{
        setToken(undefined);
        await AsyncStorage.removeItem('token');
    }

    return (<Button mode="outlined" color={Color.button} onPress={logout}>Logout</Button>)
}
export default Logout;