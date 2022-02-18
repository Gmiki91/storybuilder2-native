import { Ionicons, MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Home from './screens/Home';
import Login from "./authentication/Login";
import { ImageBackground } from 'react-native';
import { useState, useEffect, } from "react";
import { AuthContext } from "./context/AuthContext";
import Logout from "./authentication/Logout";
import Signup from "./authentication/Signup";
import StoryScreen from "./screens/StoryScreen";
import Profile from "./screens/Profile";
import Stats from "./components/Stats";
import ResetPassword from "./authentication/ResetPassword";
import ForgotPassword from "./authentication/ForgotPassword";
import { Color } from "./Global";
import DailyTribute from "./screens/DailyTribute";

export type RootStackParamList = {
  Login: undefined,
  Signup: undefined,
  Stories: undefined,
  Settings: undefined,
  StoryScreen: undefined,
  Profile: undefined,
  Stats: undefined,
  Logout: undefined,
  ResetPassword: undefined,
  ForgotPassword: undefined,
  Home: undefined,
  Daily: undefined,
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootStackParamList>();
const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
  },
};
export default function App() {
  const [token, setAuthToken] = useState<string>();

  const getToken = async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) setAuthToken(token);
  };

  useEffect(() => {
    getToken();
  }, []);


  const VisibleTabs = () => (
    <Tab.Navigator screenOptions={() => ({ tabBarStyle: { backgroundColor: Color.main } })}>
      <Tab.Screen component={Home} name="Stories" options={{
        header: () => null,
        tabBarIcon: ({ color, size }) => (<MaterialIcons name="table-view" size={size} color={color} />)
      }} />

      <Tab.Screen component={DailyTribute} name="Daily" options={{
       header: () => null,
       tabBarIcon: ({ color, size }) => (<MaterialCommunityIcons name="weather-sunny" size={size} color={color} />)
     }} />
     
      <Tab.Screen component={Profile} name="Profile" options={{
        header: () => null,
        tabBarIcon: ({ color, size }) => (<MaterialCommunityIcons name="human-child" size={size} color={color} />)
      }} />

      <Tab.Screen component={Logout} name="Logout" options={{
        header: () => null,
        tabBarIcon: ({ color, size }) => (<Ionicons name='exit-outline' size={size} color={color} />)
      }} />
    </Tab.Navigator>
  )

  const HiddenTabs = (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen component={VisibleTabs} name="Home" />
      <Stack.Screen component={StoryScreen} name="StoryScreen" />
      <Stack.Screen component={Stats} name="Stats" />
    </Stack.Navigator>
  )

  const LogIn = (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen component={Login} name="Login" />
      <Stack.Screen component={Signup} name="Signup" />
      <Stack.Screen component={ResetPassword} name="ResetPassword" />
      <Stack.Screen component={ForgotPassword} name="ForgotPassword" />
    </Stack.Navigator>
  )

  const setToken = (token: string | undefined) => {
    token && AsyncStorage.setItem('token', token.toString());
    setAuthToken(token);
  }

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      <ImageBackground resizeMode="repeat" style={{ flex: 1 }} source={require('./assets/background.png')}>
        <NavigationContainer theme={navTheme}>
          {token ? HiddenTabs : LogIn}
        </NavigationContainer>
      </ImageBackground>
    </AuthContext.Provider>
  );
}

