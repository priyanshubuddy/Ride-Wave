import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, Platform, View, ActivityIndicator, BackHandler } from 'react-native';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawer from './src/components/CustomDrawer';
import HomeScreen from './src/screen/HomeScreen';
import MapScreen from './src/screen/MapScreen';
import ConfirmationScreen from './src/screen/ConfirmationScreen';
import LoginScreen from './src/screen/Login';
import SignUpScreen from './src/screen/SignUp';
import LandingScreen from './src/screen/Landing';
import HistoryScreen from './src/screen/HistoryScreen';
import PaymentScreen from './src/screen/PaymentScreen';
import AddPaymentScreen from './src/screen/AddPaymentScreen';
import RideReceiptScreen from './src/screen/RideReceiptScreen';
import SettingsScreen from './src/screen/SettingsScreen';
import EditProfileScreen from './src/screen/EditProfileScreen';
import HelpScreen from './src/screen/HelpScreen';
import { getAuthData } from './src/utils/auth';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ConfirmationModal from './src/components/ConfirmationModal';
import RideConfirmationScreen from './src/screens/RideConfirmationScreen';
import OngoingRideScreen from './src/screens/OngoingRideScreen';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const MainStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="HomeScreen" component={HomeScreen} />
    <Stack.Screen name="MapScreen" component={MapScreen} />
    <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
    <Stack.Screen name="RideConfirmationScreen" component={RideConfirmationScreen} />
    <Stack.Screen name="OngoingRideScreen" component={OngoingRideScreen} />
    <Stack.Screen name="ConfirmationScreen" component={ConfirmationScreen} />
    <Stack.Screen name="HistoryScreen" component={HistoryScreen} />
    <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
    <Stack.Screen name="AddPaymentScreen" component={AddPaymentScreen} />
    <Stack.Screen name="RideReceiptScreen" component={RideReceiptScreen} />
    <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
    <Stack.Screen name="HelpScreen" component={HelpScreen} />
  </Stack.Navigator>
);

const DrawerNavigator = ({ handleAuthStateChange }) => (
  <Drawer.Navigator
    drawerContent={props => (
      <CustomDrawer {...props} handleAuthStateChange={handleAuthStateChange} />
    )}
    screenOptions={{
      headerShown: false,
      drawerStyle: {
        width: '75%',
      },
    }}
  >
    <Drawer.Screen name="MainStack" component={MainStack} />
  </Drawer.Navigator>
);

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    userData: null
  });

  useEffect(() => {
    checkAuthStatus();
    const backAction = () => {
      if (!authState.isAuthenticated) {
        setShowModal(true);
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [authState.isAuthenticated]);

  const handleAuthStateChange = async (isAuthenticated) => {
    setAuthState(prev => ({
      ...prev,
      isAuthenticated
    }));
  };

  const checkAuthStatus = async () => {
    try {
      const { token, userData } = await getAuthData();
      handleAuthStateChange(!!token);
      setAuthState({
        isAuthenticated: !!token,
        userData: userData
      });
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmClose = () => {
    BackHandler.exitApp(); // Close the app
  };

  const handleCancelClose = () => {
    setShowModal(false); // Close the modal
  };

  if (isLoading) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator 
            size={36}
            color="#007AFF" 
          />
        </View>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <NavigationContainer>
          <SafeAreaProvider>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{ flex: 1 }}
              keyboardVerticalOffset={Platform.OS === 'ios' ? -64 : 0}
            >
              <Stack.Navigator
                screenOptions={{
                  headerShown: false,
                }}
              >
                {!authState.isAuthenticated ? (
                  <>
                    <Stack.Screen 
                      name="LandingScreen" 
                      component={LandingScreen} 
                    />
                    <Stack.Screen 
                      name="LoginScreen" 
                      component={LoginScreen}
                      initialParams={{ handleAuthStateChange }}
                    />
                    <Stack.Screen 
                      name="SignUpScreen" 
                      component={SignUpScreen}
                      initialParams={{ handleAuthStateChange }}
                    />
                  </>
                ) : (
                  // Authenticated stack
                  <Stack.Screen 
                    name="DrawerNavigator" 
                    component={props => (
                      <DrawerNavigator 
                        {...props} 
                        handleAuthStateChange={handleAuthStateChange}
                      />
                    )}
                  />
                )}
              </Stack.Navigator>
            </KeyboardAvoidingView>
          </SafeAreaProvider>
        </NavigationContainer>
        <ConfirmationModal
          visible={showModal}
          onCancel={handleCancelClose}
          onConfirm={handleConfirmClose}
          title="Confirm Exit"
          message="Are you sure you want to exit the app?"
          confirmText="Yes"
          cancelText="No"
        />
      </Provider>
    </GestureHandlerRootView>
  );
}
