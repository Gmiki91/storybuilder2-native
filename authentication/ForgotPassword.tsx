import axios from 'axios';
import { useState } from 'react';
import { Button  } from 'react-native-paper';
import { Text, View  } from 'react-native';
import { Form } from '../components/UI/Form';
import AuthStyle from './AuthStyle';
import { CustomInput } from '../components/UI/CustomInput';
import { Color, API_URL } from '../Global';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [response, setResponse] = useState<string>();

    const resetPassword = () => {
        axios.post(`${API_URL}/users/forgotPassword`, { email:email.trim() })
            .then(result => {
                setResponse(result.data.message)
            })
            .catch(error => setResponse(error.response.data.message));
    }

    return <View style={{marginTop:'40%'}}>
    <Form>
        <View style={AuthStyle.inputView}>
        <CustomInput placeholder="Enter your email" value={email} onChangeText={setEmail} />
        </View>
        <Button disabled={email.trim()===''} color={Color.button} onPress={resetPassword}>Get email</Button>
        {response && <Text>{response}</Text>}
    </Form>
    </View>
}

export default ForgotPassword;