import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import DrawerNavigator from './DrawerNavigator';

const Stack = createStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#007bff',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="Login" 
        component={LoginScreen} 
        options={{ 
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="DrawerNavigator" 
        component={DrawerNavigator} 
        options={{ 
          headerShown: false,
          gestureEnabled: false 
        }} 
      />
    </Stack.Navigator>
  );
};

export default StackNavigator;