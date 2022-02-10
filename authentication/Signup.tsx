import { useState } from 'react';
import axios from 'axios';
import { View, Pressable,Text } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useForm, Controller, FieldValues } from 'react-hook-form'
import { RootStackParamList } from '../App';
import AuthStyle from './AuthStyle';
import { useAuth } from '../context/AuthContext';
import { Button, Snackbar } from 'react-native-paper';
import { Form } from '../components/UI/Form';
import { Color } from '../Global';
import { CustomInput } from '../components/UI/CustomInput';
import { ErrorMessage } from '../components/UI/ErrorMessage';

type NavigationProp = {
  navigation: StackNavigationProp<RootStackParamList, 'Signup'>;
}
const Signup: React.FC<NavigationProp> = ({ navigation }) => {
  const [isError, setIsError] = useState(false);
  const { control, handleSubmit, formState: { errors, isValid } } = useForm({ mode: 'onBlur' });
  const { setToken } = useAuth();

  const postSignup = (form: FieldValues) => {
    axios.post(`http://192.168.31.203:3030/api/users/signup`, {
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password.trim(),

    }).then(result => {
      if (result.status === 201) {

        setToken(result.data.token);
        // navigate("/");
      } else {
        setIsError(true);
      }
    }).catch(e => {
      console.log(e)
      setIsError(true);
    });
  }
  return (
    <View style={{marginTop:'40%'}}>
    <Form>
        <View style={AuthStyle.inputView}>
          <Controller
            control={control}
            name="name"
            rules={{
              required: {value:true, message:'Required'},
              minLength:{value:3, message:'Minimum length is 3 characters'},
              maxLength: {value:100, message:'Maximum length is 100 characters'},
            }}
            render={({ field: { onChange, value, onBlur } }) => (
              <CustomInput
              placeholder="Name"
              value={value}
              onBlur={onBlur}
              onChangeText={value => onChange(value)} />
              )} />
        </View>
              {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
        <View style={AuthStyle.inputView}>
          <Controller
            control={control}
            name="email"
            rules={{
              required: {value:true, message:'Required'},
              minLength:{value:3, message:'Minimum length is 3 characters'},
              maxLength: {value:100, message:'Maximum length is 100 characters'},
              pattern:{value:/^[^\s@]+@[^\s@]+\.[^\s@]+$/, message:'Invalid email pattern'}
             }}
            render={({ field: { onChange, value, onBlur } }) => (
              <CustomInput
                placeholder="Email"
                value={value}
                onBlur={onBlur}
                onChangeText={value => onChange(value)} />
            )} />
        </View>
             {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
        <View style={AuthStyle.inputView}>
          <Controller
            control={control}
            name="password"
            rules={{
              required: {value:true, message:'Required'},
              minLength:{value:6, message:'Minimum length is 6 characters'},
              maxLength: {value:100, message:'Maximum length is 100 characters'},
             }}
            render={({ field: { onChange, value, onBlur } }) => (
              <CustomInput
                secureTextEntry
                placeholder="Password"
                value={value}
                onBlur={onBlur}
                onChangeText={value => onChange(value)} />
            )} />
        </View>
        {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
        <Button color={Color.button} disabled={!isValid} onPress={handleSubmit(postSignup)}>Sign up</Button>
        <Pressable  onPress={() => navigation.navigate('Login')} style={{marginTop:10, alignItems: 'center'}}><Text>Already have an account?</Text></Pressable>
        </Form>
        <Snackbar onDismiss={() => setIsError(false)} visible={isError} duration={3000}>Username already taken</Snackbar>
        </View>
  )
}

export default Signup;