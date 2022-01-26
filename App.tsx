import { Ionicons, Foundation } from "@expo/vector-icons";
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './screens/Home';
import { NewStory } from "./screens/NewStory";
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const BottomTabs = () => (
  <Tab.Navigator>
    <Tab.Screen component={Home} name="Stories" options={{
      header: () => null,
      tabBarIcon: ({ color, size }) => (<Foundation name='list' size={size} color={color} />)
    }} />
    <Tab.Screen component={NewStory} name="New story" options={{
      header: () => null,
      tabBarIcon: ({ color, size }) => (<Ionicons name='add-circle-sharp' size={size} color={color} />)
    }} />
  </Tab.Navigator>
)

const TopTabs = (
  <View style={{ marginTop: 35, display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
    <View style={{ backgroundColor: 'green', padding: 5, marginRight:5, borderRadius: 15 }}><Text>Sign in</Text></View>
    <View style={{ backgroundColor: 'green', padding: 5, marginRight:5, borderRadius: 15 }}><Text>Sign up</Text></View>
  </View>
)
export default function App() {


  return (
    <NavigationContainer>
      <Stack.Navigator >
        <Stack.Screen component={BottomTabs} name="Tabs" options={{
          header: () => TopTabs,

        }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
