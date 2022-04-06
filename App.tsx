import axios from 'axios';
import { useState, useEffect, useCallback } from "react";
import { ImageBackground, SafeAreaView, StatusBar } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons, Foundation } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Home from './screens/Home';
import Profile from "./screens/Profile";
import StoryScreen from "./screens/StoryScreen";
import DailyTribute from "./screens/DailyTribute";
import { AuthContext } from "./context/AuthContext";
import ResetPassword from "./authentication/ResetPassword";
import ForgotPassword from "./authentication/ForgotPassword";
import Signup from "./authentication/Signup";
import Login from "./authentication/Login";
import Stats from "./components/Stats";
import { Bell } from './components/UI/Bell';
import { Color, API_URL } from "./Global";

export type RootStackParamList = {
  Login: undefined,
  Signup: undefined,
  Stories: undefined,
  Settings: undefined,
  StoryScreen: undefined,
  Profile: undefined,
  Stats: undefined,
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
  const [newNotes, setNewNotes] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const getToken = async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) setAuthToken(token);
    setLoading(false);
  };

  useEffect(() => {
    getToken();
  }, []);

  const checkNews = useCallback((target: string | undefined) => {
    if (target?.substring(0,7) === 'Profile') {
      setNewNotes(0);
    } else {
      if (token) {
        const headers = { Authorization: `Bearer ${token}` };
        axios.get(`${API_URL}/notifications/check`, { headers })
          .then(result => setNewNotes(result.data.notes))
      }
    }
  }, [])

  const VisibleTabs = () => (
    <Tab.Navigator
      screenListeners={{
        tabPress: (e) => checkNews(e.target)
      }}
      screenOptions={({
        headerShown: false,
        tabBarActiveTintColor: Color.cancelBtn,
        tabBarInactiveTintColor: Color.button,
        tabBarStyle: { backgroundColor: Color.main }
      })}>
      <Tab.Screen component={DailyTribute} name="Daily" options={{
        tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="weather-sunny" size={size} color={color} />
      }} />
      <Tab.Screen component={Home} name="Stories" options={{
        tabBarIcon: ({ color, size }) => <Foundation name="page-multiple" size={size} color={color} />
      }} />
      <Tab.Screen component={Profile} name="Profile" options={{
        tabBarIcon: ({ color, size,focused }) => {
          if (newNotes === 0 || focused) return <MaterialCommunityIcons name="human-child" size={size} color={color} />
          else if(newNotes !== 0) return <Bell size={size} color={color} notes={newNotes} />
        }
      }} />
    </Tab.Navigator>
  )

  const HiddenTabs = (
    <Stack.Navigator screenOptions={{ headerShown: false, }}>
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

  return !loading && (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar backgroundColor={Color.B} />
      <AuthContext.Provider value={{ token, setToken }}>
        <ImageBackground resizeMode="repeat" style={{ flex: 1 }} source={require('./assets/background.png')}>
          <NavigationContainer theme={navTheme}>
            {token ? HiddenTabs : LogIn}
          </NavigationContainer>
        </ImageBackground>
      </AuthContext.Provider>
    </SafeAreaView>
  );
}

