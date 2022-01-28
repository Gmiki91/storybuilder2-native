import { useState } from 'react';
import { TextInput, Text, View, Pressable } from 'react-native';
import { useForm, Controller, FieldValues } from 'react-hook-form'
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import AuthStyle from './AuthStyle';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';

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
    <View style={AuthStyle.container}>
      <View style={AuthStyle.form}>

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
                placeholder="Password"
                value={value}
                onBlur={onBlur}
                onChangeText={value => onChange(value)} />
            )} />
        </View>
        <Pressable style={AuthStyle.loginBtn} onPress={handleSubmit(postSignup)} >
          <Text>Sign up</Text>
        </Pressable>
        <Pressable onPress={() => navigation.navigate('Login')}>
          <Text style={{ marginTop: 15 }}>Already have an account?</Text>
        </Pressable>
      </View>
    </View>
  )
}




export default Signup;