import { StackNavigationProp } from '@react-navigation/stack';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { Text } from 'react-native';
import { Button } from 'react-native-paper';
import { RootStackParamList } from '../App';
import { useRoute, RouteProp } from '@react-navigation/native';
import { CustomInput } from '../components/UI/CustomInput';
const LOCAL_HOST = 'http://192.168.31.203:3030/api';
type NavigationProp = {
    navigation: StackNavigationProp<RootStackParamList, 'ResetPassword'>;
  }
  
type ParamList = {
    Params: { token: string };
};
const ResetPassword:React.FC<NavigationProp> = ({ navigation }) => {
    const { setToken } = useAuth();
    const { params } = useRoute<RouteProp<ParamList, 'Params'>>();
    const [password, setPassword] = useState('');
    const [error, setError] = useState();
    const [isLoggedIn, setLoggedIn] = useState(false);

    const resetPassword = () => {
        axios.patch(`${LOCAL_HOST}/users/resetPassword/${params.token}`, { password:password.trim() })
            .then(result => {
                setToken(result.data.data);
                setLoggedIn(true);
            })
            .catch(error => setError(error.response.data.message));
    }

    if (isLoggedIn) {
        navigation.navigate('Home');
    }

    return <>
        <CustomInput placeholder="Enter your new password" value={password} onChangeText={setPassword} />
        <Button disabled={password.trim() === ''} onPress={resetPassword}>Reset password</Button>
        {error && <Text>{error}</Text>}
    </>
}

export default ResetPassword;