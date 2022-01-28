import { Ionicons, Foundation } from "@expo/vector-icons";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Home from './screens/Home';
import { NewStory } from "./screens/NewStory";
import Login from "./authentication/Login";
import { useState, useEffect } from "react";
import { AuthContext } from "./context/AuthContext";
import Logout from "./authentication/Logout";
import Signup from "./authentication/Signup";
import StoryScreen from "./screens/StoryScreen";

export type RootStackParamList = {
  Login: undefined,
  Signup: undefined,
  Stories: undefined,
  NewStory: undefined,
  Settings: undefined,
  Logout: undefined,
  StoryScreen: undefined,
  Home: undefined
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootStackParamList>();

export default function App() {
  const [token, setAuthToken] = useState<string>();

  const getToken = async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) setAuthToken(token);
  };

  useEffect(() => {
    getToken();
  }, []);

  
  const VisibleTabs =()=> (
    <Tab.Navigator>
       <Tab.Screen component={Home} name="Stories" options={{
        header: () => null,
        tabBarIcon: ({ color, size }) => (<Foundation name="list" size={size} color={color} />)
      }}  />
       <Tab.Screen component={NewStory} name="NewStory" options={{
        header: () => null,
        tabBarIcon: ({ color, size }) => (<Ionicons name='add-circle-sharp' size={size} color={color} />)
      }}  />
       <Tab.Screen component={Logout} name="Logout" options={{
        header: () => null,
        tabBarIcon: ({ color, size }) => (<Ionicons name='exit-outline' size={size} color={color} />)
      }}  />
       </Tab.Navigator>
  )

  const HiddenTabs = (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen component={VisibleTabs} name="Home" />
      <Stack.Screen component={StoryScreen} name="StoryScreen"   />
    </Stack.Navigator>
  )

  const LogIn = (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen component={Login} name="Login"  />
      <Stack.Screen component={Signup} name="Signup" />
    </Stack.Navigator>
  )

  const setToken = (token: string | undefined) => {
    token && AsyncStorage.setItem('token', token.toString());
    setAuthToken(token);
  }

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      <NavigationContainer>
        {token ? HiddenTabs : LogIn}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

