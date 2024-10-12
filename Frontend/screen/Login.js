import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axiosInstance from '../utils/axiosInstance';
import tw from 'tailwind-react-native-classnames';
import { LinearGradient } from 'expo-linear-gradient';

const LoginScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { authType } = route.params || { authType: 'user' };
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const endpoint = authType === 'user' ? '/api/users/login' : '/api/drivers/login';
      const response = await axiosInstance.post(endpoint, {
        email,
        password,
        authType,
      });
      const { status, message, error } = response.data;
      if (status === 200) {
        Alert.alert('Success', message || 'Login successful', [
          { text: 'OK', onPress: () => navigation.navigate('HomeScreen') }
        ]);
      } else if (status === 400) {
        Alert.alert('Error', error);
      } else {
        Alert.alert('Error', 'Failed to login');
      }
    } catch (error) {
      console.error('Error: ', error);
      if (error.response && error.response.data && error.response.data.error) {
        Alert.alert('Error', error.response.data.error);
      } else {
        Alert.alert('Error', 'Error logging in');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={authType === 'user' ? ['#4c669f', '#3b5998', '#192f6a'] : ['#ff9966', '#ff5e62']}
        style={styles.gradient}
      >
        <Image
          source={authType === 'user' ? require('../assets/icon.png') : require('../assets/driver-bg.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>
          {authType === 'user' ? 'Rider Login' : 'Driver Login'}
        </Text>
        <View style={styles.inputContainer}>
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
        </View>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('SignUpScreen', { authType })}>
          <Text style={styles.signUpText}>
            Don't have an account? Sign Up
          </Text>
        </TouchableOpacity>
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
  loginButton: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 25,
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#3b5998',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signUpText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default LoginScreen;
