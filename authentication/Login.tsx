import { useState } from 'react';
import { Text,TextInput, View, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useForm, Controller, FieldValues } from 'react-hook-form'
// import { Card, Form, Input, Button } from 'authentication/AuthForm';

const Login = () => {
  const [isError, setIsError] = useState(false);
  const { setToken } = useAuth();
  const { control, handleSubmit, formState: { errors, isValid } } = useForm({ mode: 'onBlur' });
  // const navigate = useNavigate();

  const postLogin = (form: FieldValues) => {
    axios.post(`http://192.168.31.203:3030/api/users/login`, {
      userInut:form.name,
      password:form.password
    }).then(result => {
      console.log(result);
      if (result.status === 200) {
        setToken(result.data.token);
        // navigate("/");
      } else {
        setIsError(true);
      }
    }).catch(e => {
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
      <Button title='Submit' onPress={handleSubmit(postLogin)} />
      {isError && <View><Text>Wrong email/password</Text></View>}
    </View>
  )
}
const styles = StyleSheet.create({
  controllerContainer: {}
})
export default Login;
  //   return (
  //     <Card>
  //       <Form>
  //         <Input
  //           value={userInput}
  //           onChange={e => {
  //             setUserInput(e.target.value);
  //           }}
  //           placeholder="username or email"
  //         />

  //         <Input type="password"
  //           value={password}
  //           onChange={e => {
  //             setPassword(e.target.value);
  //           }}
  //           placeholder="password"
  //         />
  //         <Button onClick={postLogin}>Log In</Button>
  //       </Form>
  //       <GoogleSigninButton
  //     style={{ width: 192, height: 48 }}
  //     size={GoogleSigninButton.Size.Wide}
  //     color={GoogleSigninButton.Color.Dark}
  //     onPress={this._signIn}
  //     disabled={this.state.isSigninInProgress} />
  // }
  //       <GoogleLogin
  //         clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID!}
  //         buttonText="Log in with Google"
  //         onSuccess={googleLogin}
  //         onFailure={(e) => console.log(e)}
  //         cookiePolicy={'single_host_origin'} />
  //       <Link to="/forgotPassword">Forgot your password?</Link>
  //       <Link to="/signup">Don't have an account?</Link>
  //       {isError && <div>The username or password provided were incorrect!</div>}
  //     </Card>
  //   );
  // }
