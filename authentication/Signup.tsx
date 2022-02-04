import { useState } from 'react';
import axios from 'axios';
import { TextInput, View, Pressable,Text } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useForm, Controller, FieldValues } from 'react-hook-form'
import { RootStackParamList } from '../App';
import AuthStyle from './AuthStyle';
import { useAuth } from '../context/AuthContext';
import { Button } from 'react-native-paper';
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
    <View style={{marginTop:'40%'}}>
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
        <Button color={Color.lightGreen} onPress={handleSubmit(postSignup)}>Sign up</Button>
        <Pressable  onPress={() => navigation.navigate('Login')} style={{marginTop:10, alignItems: 'center'}}><Text>Already have an account?</Text></Pressable>
        </Form>
        </View>
  )
}

export default Signup;