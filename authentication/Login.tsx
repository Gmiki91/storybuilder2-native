import axios from 'axios';
import { useState, useEffect } from 'react';
import { Text, View, Pressable, Platform } from 'react-native';
import { useForm, Controller, FieldValues } from 'react-hook-form'
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';
import AuthStyle from './AuthStyle';
import { useAuth } from '../context/AuthContext';
import { Button, Snackbar } from 'react-native-paper';
import { Form } from '../components/UI/Form';
import { Color } from '../Global';
import { CustomInput } from '../components/UI/CustomInput';
// import * as WebBrowser from 'expo-web-browser';
// import * as Google from 'expo-auth-session/providers/google';
type NavigationProp = {
  navigation: StackNavigationProp<RootStackParamList, 'Login'>;
}

const Login: React.FC<NavigationProp> = ({ navigation }) => {
  const [error, setError] = useState('');
  // const [googleSubmitting, setGoogleSubmitting] = useState(false);
  const { setToken } = useAuth();
  const { control, handleSubmit, formState: { errors, isValid } } = useForm({ mode: 'onBlur' });
  const Local_host = 'https://8t84fca4l8.execute-api.eu-central-1.amazonaws.com/dev/api';
  const postLogin = (form: FieldValues) => {
    axios.post(`${Local_host}/users/login`, {
      userInput: form.name.trim(),
      password: form.password.trim()
    }).then(result => {
      if (result.status === 200) {
        setToken(result.data.token);
      } else {
        setError('Wrong login credentials.');
      }
    }).catch(e => {
      setError('Error during logging in.');
    });
  }
  
  // WebBrowser.maybeCompleteAuthSession()
  
  // const [request, response, promptAsync] = Google.useAuthRequest({
  //   expoClientId: 
  //   webClientId: 
  //   iosClientId:
  //   androidClientId: 
  // });

  // useEffect(() => {
  //   if (response?.type === 'success') {
  //     const { authentication } = response;
  //     console.log(authentication);
  //     }
  // }, [response]);

  return (
    <View style={{ marginTop: '40%' }}>
      <Form>
        <View style={AuthStyle.inputView}>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value, onBlur } }) => (
              <CustomInput
                placeholder="Name or email"
                value={value}
                onBlur={onBlur}
                onChangeText={value => onChange(value)} />
            )} />
        </View>
        <View style={AuthStyle.inputView}>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value, onBlur } }) => (
              <CustomInput
                secureTextEntry
                placeholder="Password"
                value={value}
                onBlur={onBlur}
                onChangeText={value => onChange(value)} />
            )} />
        </View>
        <Pressable style={AuthStyle.forgotBtnContainer} onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={AuthStyle.forgotBtn}>Forgot Password?</Text>
        </Pressable>
        <Button color={Color.button} onPress={handleSubmit(postLogin)}>Login</Button>
        {/* <Button color={Color.button} onPress={promptAsync} >Sign in w Google</Button> */}
        <Text style={{ margin: 10, textAlign: 'center' }}>or</Text>
        <Button color={Color.button} onPress={() => navigation.navigate('Signup')} >Sign up</Button>
        <Snackbar onDismiss={() => setError('')} visible={error!==''} duration={3000}>{error}</Snackbar>
      </Form>
    </View>
  )
}

export default Login;
