import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import tw from "tailwind-react-native-classnames";
import { LinearGradient } from 'expo-linear-gradient';

const LandingScreen = () => {
  const navigation = useNavigation();
  const [authType, setAuthType] = useState('user');

  const toggleAuthType = () => {
    setAuthType(prevType => prevType === 'user' ? 'driver' : 'user');
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
        <Text style={styles.title}>Welcome to Ride Wave</Text>
        <Text style={styles.subtitle}>
          {authType === 'user' 
            ? "Your journey begins here. Let's ride the wave together!"
            : "Join our driver community and start earning today!"}
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, tw`bg-white`]}
            onPress={() => navigation.navigate('LoginScreen', { authType: authType })}
          >
            <Text style={[styles.buttonText, tw`text-blue-500`]}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, tw`bg-blue-500`]}
            onPress={() => navigation.navigate('SignUpScreen', { authType: authType })}
          >
            <Text style={[styles.buttonText, tw`text-white`]}>Sign Up</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={tw`bg-white py-3 rounded-full items-center mt-6`}
          onPress={toggleAuthType}
        >
          <Text style={tw`text-blue-500 font-bold text-lg px-6`}>
            Switch to {authType === 'user' ? 'Driver' : 'Rider'} Mode
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
    width: 220,
    height: 220,
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 20,
  },
  button: {
    width: '100%',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LandingScreen;
