import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, SafeAreaView } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import axiosInstance from '../utils/axiosInstance';
import { useNavigation } from '@react-navigation/native';

const SignUp = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    try {
      const response = await axiosInstance.post('/api/users/register', {
        name: username,
        email,
        password,
      });
      const { status, message, error } = response.data;
      if (status === 201) {
        Alert.alert('Success', message, [
          { text: 'OK', onPress: () => navigation.navigate('HomeScreen') }
        ]);
      } else if (status === 400) {
        Alert.alert('Error', error);
      } else {
        Alert.alert('Error', 'Failed to register user');
      }
    } catch (error) {
      console.error('Error: ', error);
      if (error.response && error.response.data && error.response.data.error) {
        Alert.alert('Error', error.response.data.error);
      } else {
        Alert.alert('Error', 'Error registering user');
      }
    }
  };

  return (
    <SafeAreaView style={tw`bg-white h-full`}>
      <View style={tw`p-5 py-10`}>
        <Text style={tw`text-3xl font-bold text-center mb-5`}>Sign Up</Text>
        <TextInput
          style={tw`h-10 border border-gray-300 rounded px-3 mb-5`}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={tw`h-10 border border-gray-300 rounded px-3 mb-5`}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={tw`h-10 border border-gray-300 rounded px-3 mb-5`}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Button title="Sign Up" onPress={handleSignUp} />
      </View>
    </SafeAreaView>
  );
};

export default SignUp;
