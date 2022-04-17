import { useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import { ActivityIndicator, Modal, Portal, Provider } from 'react-native-paper';
import { View, Pressable, Text } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useForm, Controller, FieldValues } from 'react-hook-form'
import { RootStackParamList } from '../App';
import AuthStyle from './AuthStyle';
import { Button, Snackbar } from 'react-native-paper';
import { Form } from '../components/UI/Form';
import { Color, API_URL } from '../Global';
import { CustomInput } from '../components/UI/CustomInput';
import { ErrorMessage } from '../components/UI/ErrorMessage';
import { NewStory } from '../components/forms/NewStory';
import * as GoogleSignIn from 'expo-google-sign-in';

type NavigationProp = {
  navigation: StackNavigationProp<RootStackParamList, 'Signup'>;
}
const Signup: React.FC<NavigationProp> = ({ navigation }) => {
  const [isError, setIsError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [savedToken, setSavedToken] = useState();
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit, formState: { errors, isValid } } = useForm({ mode: 'onBlur' });

  const signUpAsync = async () => {
    setLoading(true);
    await GoogleSignIn.initAsync({
      clientId: '584741243002-0oavofula7kcd8di3tfv0nef7s9q7g87.apps.googleusercontent.com',
    });
    try {
      await GoogleSignIn.askForPlayServicesAsync();
      const { type, user } = await GoogleSignIn.signInAsync();
      if (type === 'success') {
        if (user) {
          axios.post(`${API_URL}/users/signup`, {
            name: user.firstName?.trim(),
            email: user.email.trim()
          }).then(result => {
            _checkResult(result);
          }).catch(e => {
            setIsError(true);
            setLoading(false);
          });
        } else {
          setLoading(false);
          alert('Could not fetch user')
        }
      }
    } catch ({ message }) {
      setLoading(false);
      alert('login: Error:' + message);
    }
  };

  const postSignup = (form: FieldValues) => {
    setLoading(true);
    axios.post(`${API_URL}/users/signup`, {
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password.trim(),

    }).then(result => {
      _checkResult(result);
    }).catch(e => {
      setLoading(false);
      setIsError(true);
    });
  }

  const _checkResult = (result: AxiosResponse) => {
    if (result.status === 201) {
      setSavedToken(result.data.token);
      setShowModal(true);
    } else {
      setIsError(true);
    }
    setLoading(false);
  }

  return (
    <Provider>
      <View style={{ marginTop: '40%' }}>
        <Portal>
          <Modal
             visible={loading || showModal}>
              {showModal ? <NewStory tokenProp={savedToken} onCloseForm={() => { }} />:<ActivityIndicator size={'large'} animating={loading} color={Color.secondary} />}
          </Modal>
        </Portal>
        <Form>
          <View style={AuthStyle.inputView}>
            <Controller
              control={control}
              name="name"
              rules={{
                required: { value: true, message: 'Required' },
                minLength: { value: 3, message: 'Minimum length is 3 characters' },
                maxLength: { value: 100, message: 'Maximum length is 100 characters' },
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
                required: { value: true, message: 'Required' },
                minLength: { value: 3, message: 'Minimum length is 3 characters' },
                maxLength: { value: 100, message: 'Maximum length is 100 characters' },
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+\s*$/, message: 'Invalid email pattern' }
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
                required: { value: true, message: 'Required' },
                minLength: { value: 6, message: 'Minimum length is 6 characters' },
                maxLength: { value: 100, message: 'Maximum length is 100 characters' },
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
          <Button color={'blue'} icon='google-plus' onPress={signUpAsync}>Sign up with Google</Button>
          <Pressable onPress={() => navigation.navigate('Login')} style={{ marginTop: 10, alignItems: 'center' }}><Text>Already have an account?</Text></Pressable>
        </Form>
        <Snackbar onDismiss={() => setIsError(false)} visible={isError} duration={2000}>Username or email already taken</Snackbar>
      </View>
    </Provider>
  )
}

export default Signup;