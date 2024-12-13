import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import axiosInstance from '../utils/axiosInstance';
import { LinearGradient } from 'expo-linear-gradient';
import DropDownPicker from 'react-native-dropdown-picker';
import { storeAuthData } from '../utils/auth';

const SignUpScreen = ({ navigation, route }) => {
  const { authType = 'user', handleAuthStateChange } = route.params || {};
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [vehicleDetails, setVehicleDetails] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: 'Select Vehicle Type', value: '' },
    { label: 'Sedan', value: 'Sedan' },
    { label: 'SUV', value: 'SUV' },
    { label: 'Van', value: 'Van' },
    { label: 'Auto Rickshaw', value: 'Auto Rickshaw' },
    { label: 'Motorcycle', value: 'Motorcycle' },
  ]);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (authType === 'driver' && (!vehicleDetails || !licenseNumber)) {
      Alert.alert('Error', 'Please fill in all driver-specific details');
      return;
    }

    try {
      setLoading(true);
      const endpoint = authType === 'user' ? '/api/users/register' : '/api/drivers/register';
      const payload = authType === 'user' 
        ? { name, email: email.toLowerCase(), password }
        : { 
            name, 
            email: email.toLowerCase(), 
            password, 
            vehicleDetails, 
            licenseNumber 
          };
      
      const response = await axiosInstance.post(endpoint, payload);
      
      if (response.data?.token && response.data?.userData) {
        await storeAuthData(response.data.token, response.data.userData);
        if (handleAuthStateChange) {
          handleAuthStateChange(true);
        }
      } else {
        Alert.alert('Success', 'Registration successful! Please login.');
        navigation.navigate('LoginScreen', { 
          authType,
          handleAuthStateChange 
        });
      }
    } catch (error) {
      console.error('Error: ', error);
      const errorMessage = error.response?.data?.error || 'Error registering. Please try again.';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={authType === 'user' ? ['#4c669f', '#3b5998', '#192f6a'] : ['#ff9966', '#ff5e62']}
        style={styles.gradient}
      >
        <Image
          source={authType === 'user' ? require('../../assets/icon.png') : require('../../assets/driver-bg.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>
          {authType === 'user' ? 'Rider Sign Up' : 'Driver Sign Up'}
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor="#ffffff80"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#ffffff80"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#ffffff80"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          {authType === 'driver' && (
            <>
              <DropDownPicker
                open={open}
                value={vehicleDetails}
                items={items}
                setOpen={setOpen}
                setValue={setVehicleDetails}
                setItems={setItems}
                placeholder="Select Vehicle Type"
                style={styles.dropdownPicker}
                dropDownContainerStyle={styles.dropdownContainer}
                textStyle={styles.dropdownText}
                placeholderStyle={styles.dropdownPlaceholder}
                arrowColor="#ffffff"
                tickIconStyle={styles.dropdownTick}
                listItemContainerStyle={styles.dropdownListItem}
                listItemLabelStyle={styles.dropdownListItemLabel}
              />
              <TextInput
                style={styles.input}
                placeholder="License Number"
                placeholderTextColor="#ffffff80"
                value={licenseNumber}
                onChangeText={setLicenseNumber}
              />
            </>
          )}
        </View>
        <TouchableOpacity
          style={[
            styles.signUpButton,
            loading && styles.disabledButton
          ]}
          onPress={handleSignUp}
          disabled={loading}
        >
          <Text style={styles.signUpButtonText}>
            {loading ? 'Signing Up...' : 'Sign Up'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => navigation.navigate('LoginScreen', { 
            authType,
            handleAuthStateChange 
          })}
          disabled={loading}
        >
          <Text style={styles.loginText}>
            Already have an account? Login
          </Text>
        </TouchableOpacity>
        {loading && (
          <ActivityIndicator size={36} color="#ffffff" />
        )}
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#fff',
    marginBottom: 15,
  },
  dropdownPicker: {
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 25,
    marginBottom: 15,
  },
  dropdownContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 25,
    borderTopWidth: 0,
  },
  dropdownText: {
    color: '#fff',
    fontSize: 16,
  },
  dropdownPlaceholder: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
  },
  dropdownTick: {
    tintColor: '#fff',
  },
  dropdownListItem: {
    justifyContent: 'flex-start',
  },
  dropdownListItemLabel: {
    color: '#000',
    fontSize: 16,
  },
  signUpButton: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 25,
    marginBottom: 20,
  },
  signUpButtonText: {
    color: '#3b5998',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginText: {
    color: '#fff',
    fontSize: 16,
  },
  disabledButton: {
    opacity: 0.7,
  },
});

export default SignUpScreen;
