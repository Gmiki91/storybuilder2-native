import { useState } from 'react';
import { Text, TextInput, View, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useForm, Controller, FieldValues } from 'react-hook-form'

const Signup = () => {
  const [isError, setIsError] = useState(false);
  const [password, setPassword] = useState("");
  const { control, handleSubmit, formState: { errors, isValid } } = useForm({ mode: 'onBlur' });
  const { setToken } = useAuth();
  // const navigate = useNavigate();

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
    <View>
      <View style={styles.controllerContainer}>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value, onBlur } }) => (
            <TextInput
              style={{ fontSize: 22 }}
              placeholder="Name"
              value={value}
              onBlur={onBlur}
              onChangeText={value => onChange(value)} />
          )} />
      </View>
      <View style={styles.controllerContainer}>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value, onBlur } }) => (
            <TextInput
              style={{ fontSize: 22 }}
              placeholder="Password"
              value={value}
              onBlur={onBlur}
              onChangeText={value => onChange(value)} />
          )} />
      </View>
      <Button title='Submiat' onPress={handleSubmit(postSignup)} />
    </View>
  )
}
const styles = StyleSheet.create({
  controllerContainer: {}
})



export default Signup;