import React from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import { SafeAreaProvider } from 'react-native-safe-area-context'; 
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'; 
import HomeScreen from './screen/HomeScreen';
import MapScreen from './screen/MapScreen';
import ConfirmationScreen from './screen/ConfirmationScreen';
import LoginScreen from './screen/Login';
import SignUpScreen from './screen/SignUp';

export default function App() {

  const Stack = createStackNavigator();

  console.disableYellowBox = true;

  return (
    <Provider store={store}> 
      <NavigationContainer>
        <SafeAreaProvider> 
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === 'ios' ? -64 : 0}
          > 
            <Stack.Navigator initialRouteName="LoginScreen">
              <Stack.Screen
                name='LoginScreen'
                component={LoginScreen}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name='SignUpScreen'
                component={SignUpScreen}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name='HomeScreen'
                component={HomeScreen}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name='MapScreen'
                component={MapScreen}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name='ConfirmationScreen'
                component={ConfirmationScreen}
                options={{
                  headerShown: false,
                }}
              />
            </Stack.Navigator>
          </KeyboardAvoidingView>
        </SafeAreaProvider>
      </NavigationContainer>
    </Provider>
  );
}

