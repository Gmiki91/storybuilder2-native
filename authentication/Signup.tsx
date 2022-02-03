import { useState } from 'react';
import axios from 'axios';
import { TextInput, View } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useForm, Controller, FieldValues } from 'react-hook-form'
import { RootStackParamList } from '../App';
import AuthStyle from './AuthStyle';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/UI/Button';
import { Form } from '../components/UI/Form';
import { Color } from '../Global';

type NavigationProp = {
  navigation: StackNavigationProp<RootStackParamList, 'Signup'>;
}
const Signup: React.FC<NavigationProp> = ({ navigation }) => {
  const [isError, setIsError] = useState(false);
  const [password, setPassword] = useState("");
  const { control, handleSubmit, formState: { errors, isValid } } = useForm({ mode: 'onBlur' });
  const { setToken } = useAuth();

  const postSignup = (form: FieldValues) => {
    axios.post(`http://192.168.31.203:3030/api/users/signup`, {
      name: form.name,
      email: form.name,
      password: form.password,

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
        <Button label='Sign up' onPress={handleSubmit(postSignup)} style={{backgroundColor: Color.lightGreen}}/>
        <Button label='Already have an account?' onPress={() => navigation.navigate('Login')} style={{marginTop:10}}/>
        </Form>
  )
}

export default Signup;