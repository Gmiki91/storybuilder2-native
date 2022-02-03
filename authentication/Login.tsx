import axios from 'axios';
import { useState } from 'react';
import { Text, TextInput, View, Pressable } from 'react-native';
import { useForm, Controller, FieldValues } from 'react-hook-form'
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';
import AuthStyle from './AuthStyle';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/UI/Button';
import { Form } from '../components/UI/Form';
import { Color } from '../Global';

type NavigationProp = {
  navigation: StackNavigationProp<RootStackParamList, 'Login'>;
}

const Login: React.FC<NavigationProp> = ({ navigation }) => {
  const [isError, setIsError] = useState(false);
  const { setToken } = useAuth();
  const { control, handleSubmit, formState: { errors, isValid } } = useForm({ mode: 'onBlur' });
  const Local_host = 'http://192.168.31.203:3030/api';
  const postLogin = (form: FieldValues) => {
    axios.post(`${Local_host}/users/login`, {
      userInput: form.name,
      password: form.password
    }).then(result => {
      if (result.status === 200) {
        setToken(result.data.token);
      } else {
        setIsError(true);
      }
    }).catch(e => {
      console.log(e);
      setIsError(true);
    });
  }

  return (
    <Form>
      <View style={AuthStyle.inputView}>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value, onBlur } }) => (
            <TextInput
              style={AuthStyle.TextInput}
              placeholder="Name"
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
            <TextInput
              style={AuthStyle.TextInput}
              secureTextEntry
              placeholder="Password"
              value={value}
              onBlur={onBlur}
              onChangeText={value => onChange(value)} />
          )} />
      </View>
      <Pressable style={AuthStyle.forgotBtnContainer}>
        <Text style={AuthStyle.forgotBtn}>Forgot Password?</Text>
      </Pressable>
      <Button label='Login' onPress={handleSubmit(postLogin)}/>
      <Text style={{ margin: 10, textAlign: 'center' }}>or</Text>
      <Button label='Sign up' style={{backgroundColor: Color.lightGreen}} onPress={() => navigation.navigate('Signup')} />
      {isError && <View><Text>Wrong email/password</Text></View>}
    </Form>
  )
}

export default Login;
