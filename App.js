import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./app/screens/LoginScreen";
import AboutScreen from "./app/screens/AboutScreen";
import HomeScreen from "./app/screens/HomeScreen";
import forgotPassword from './app/screens/forgotPassword';

import Help from "./app/screens/Help";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        // The initial route is the LoginScreen
        initialRouteName="LoginScreen"
        screenOptions={{
          headerTitle: 'Smoke Detector',
          headerLeft: () => null
        }}
      >
        <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="forgotPassword" component={forgotPassword} options={{ headerShown: false }}/>
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="AboutScreen" component={AboutScreen} options={{ headerShown: false }}/>
        
        <Stack.Screen name="Help" component={Help}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
/******  b7463200-88cb-4498-9733-5f940856d642  *******/
