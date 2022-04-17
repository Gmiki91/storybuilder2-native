import axios from 'axios';
import { useEffect, useState } from 'react';
import { Text, View, Pressable } from 'react-native';
import { useForm, Controller, FieldValues } from 'react-hook-form'
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';
import AuthStyle from './AuthStyle';
import { useAuth } from '../context/AuthContext';
import { Button, Snackbar, Provider, Modal, Portal, ActivityIndicator } from 'react-native-paper';
import { Form } from '../components/UI/Form';
import { Color } from '../Global';
import { CustomInput } from '../components/UI/CustomInput';
import { ErrorMessage } from '../components/UI/ErrorMessage';
import { NewStory } from '../components/forms/NewStory';
import * as GoogleSignIn from 'expo-google-sign-in';
import {API_URL} from '../Global'

type NavigationProp = {
  navigation: StackNavigationProp<RootStackParamList, 'Login'>;
}
const Login: React.FC<NavigationProp> = ({ navigation }) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { setToken } = useAuth();
  const [savedToken, setSavedToken] = useState();
  const { control, handleSubmit, formState: { errors, isValid } } = useForm({ mode: 'onBlur' });
  
  useEffect(() => {
    initAsync();
  }, []);

  const initAsync = async () => {
    await GoogleSignIn.initAsync({
      clientId: '584741243002-0oavofula7kcd8di3tfv0nef7s9q7g87.apps.googleusercontent.com',
    });
    _syncUserWithStateAsync();
  };

  const _syncUserWithStateAsync = async () => {
    const user = await GoogleSignIn.signInSilentlyAsync();
    if(user){
      axios.post(`${API_URL}/users/loginGoogle`,{email:user.email})
          .then(result => {
           setLoading(false);
            if (result.data.user.confirmed) {
              setToken(result.data.token);
            } else {
              setShowModal(true);
              setSavedToken(result.data.token);
            }
          })
    }
  };

  const signInAsync = async () => {
    try {
      await GoogleSignIn.askForPlayServicesAsync();
      const { type } = await GoogleSignIn.signInAsync();
      if (type === 'success') {
        _syncUserWithStateAsync();
      }
    } catch ({ message }) {
      alert('login: Error:' + message);
    }
  };

  const postLogin = (form: FieldValues) => {
    setLoading(true);
    axios.post(`${API_URL}/users/login`, {
      userInput: form.name.trim(),
      password: form.password.trim()
    }).then(result => {
      setLoading(false);
      if (result.data.user.confirmed) {
        setToken(result.data.token);
      } else {
        setShowModal(true);
        setSavedToken(result.data.token);
      }
    }).catch(e => {
      setLoading(false);
      setError(e.response.data.message);
    });
  }

  return (
    <Provider>
      <Portal>
        <Modal
          visible={loading || showModal}>
          {showModal ? <NewStory tokenProp={savedToken} onCloseForm={() => { }} /> : <ActivityIndicator size={'large'} animating={loading} color={Color.secondary} />}
        </Modal>
      </Portal>

      <View style={{ marginTop: '40%' }}>
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
                  placeholder="Name or email"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={value => onChange(value)} />
              )} />
          </View>
          {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
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
          <Pressable style={AuthStyle.forgotBtnContainer} onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={AuthStyle.forgotBtn}>Forgot your password?</Text>
          </Pressable>
          <Button disabled={!isValid} color={Color.button} onPress={handleSubmit(postLogin)}>Log in</Button>
          <Button color={'blue'} icon='google-plus' onPress={signInAsync}>Log in with Google</Button>
          <Text style={{ margin: 10, textAlign: 'center' }}>or</Text>
          <Button color={Color.button} onPress={() => navigation.navigate('Signup')} >Sign up</Button>
          <Snackbar onDismiss={() => setError('')} visible={error !== ''} duration={2000}>{error}</Snackbar>
        </Form>
      </View>
    </Provider>
  )
}

export default Login;
