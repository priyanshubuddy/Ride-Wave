import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Image
} from 'react-native';
import { useSelector } from 'react-redux';
import { selectOrigin, selectDestination } from '../redux/slices/navSlice';
import axiosInstance from '../utils/axiosInstance';
import tw from 'tailwind-react-native-classnames';
import { Icon } from 'react-native-elements';
import MapView, { Marker } from 'react-native-maps';
import { getAuthData } from '../utils/auth';

const SEARCHING_TIMEOUT = 30000; // 30 seconds

const RideConfirmationScreen = ({ route, navigation }) => {
  const { selected, fare } = route.params;
  const origin = useSelector(selectOrigin);
  const destination = useSelector(selectDestination);
  const [status, setStatus] = useState('PENDING');
  const [rideRequest, setRideRequest] = useState(null);
  const [timeoutId, setTimeoutId] = useState(null);
  const [pollInterval, setPollInterval] = useState(null);

  useEffect(() => {
    createRideRequest();
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (pollInterval) clearInterval(pollInterval);
    };
  }, []);

  const startStatusPolling = (requestId) => {
    const interval = setInterval(async () => {
      try {
        console.log('Polling for status...', requestId);
        const response = await axiosInstance.get(`/api/rides/ride-requests/${requestId}`);
        console.log('Poll response:', response.data);

        if (response.data.status === 'success') {
          const { data } = response.data;
          console.log('Updated ride request:', data);
          setRideRequest(data);
          setStatus(data.status);

          if (data.status === 'ACCEPTED') {
            clearInterval(interval);
          }
        }
      } catch (error) {
        console.error('Polling error:', error);
        clearInterval(interval);
      }
    }, 3000);

    setPollInterval(interval);
  };

  const createRideRequest = async () => {
    try {
      const requestData = {
        origin: {
          description: origin.description,
          location: origin.location
        },
        destination: {
          description: destination.description,
          location: destination.location
        },
        vehicleType: selected.title,
        fare,
        estimatedDistance: route.params?.travelTimeInformation?.distance?.value,
        estimatedDuration: route.params?.travelTimeInformation?.duration?.value
      };

      console.log('Creating ride request with data:', requestData);

      const response = await axiosInstance.post('/api/rides/ride-requests', requestData);
      console.log('Ride request response:', response.data);

      if (response.data.status === 'success') {
        const { rideRequest: newRequest } = response.data.data;
        setRideRequest(newRequest);
        setStatus('SEARCHING');

        // Set timeout for driver search
        const timeout = setTimeout(() => {
          setStatus('NO_DRIVERS');
        }, SEARCHING_TIMEOUT);

        setTimeoutId(timeout);

        // Start polling for status updates
        startStatusPolling(newRequest._id);
      }
    } catch (error) {
      console.error('Error creating ride request:', error);
      Alert.alert(
        'Error',
        'Failed to create ride request'
      );
      navigation.goBack();
    }
  };

  const handleCancel = async () => {
    try {
      if (rideRequest?._id) {
        await axiosInstance.post(`/api/rides/ride-requests/${rideRequest._id}/cancel`);
      }
      navigation.navigate('HomeScreen');
    } catch (error) {
      console.error('Cancel error:', error);
      Alert.alert('Error', 'Failed to cancel ride');
    }
  };

  const handleStartRide = () => {
    navigation.navigate('OngoingRideScreen', {
      rideRequest,
      driver: rideRequest.driver
    });
  };

  const handleRefresh = () => {
    // Clear existing timers
    if (timeoutId) clearTimeout(timeoutId);
    if (pollInterval) clearInterval(pollInterval);
    
    // Reset status and create new ride request
    setStatus('PENDING');
    setRideRequest(null);
    createRideRequest();
  };

  const handleExit = () => {
    // Clear any existing timers
    if (timeoutId) clearTimeout(timeoutId);
    if (pollInterval) clearInterval(pollInterval);
    
    navigation.navigate('HomeScreen');
  };

  const renderContent = () => {
    console.log('Current status:', status);
    console.log('Current rideRequest:', rideRequest);

    switch (status) {
      case 'PENDING':
      case 'SEARCHING':
        return (
          <View style={tw`items-center p-5`}>
            <ActivityIndicator size="large" color="#000" />
            <Text style={tw`text-lg mt-4`}>Finding your driver...</Text>
            <TouchableOpacity
              style={tw`mt-4 bg-gray-200 p-3 rounded-full w-full`}
              onPress={handleCancel}
            >
              <Text style={tw`text-center`}>Cancel Ride</Text>
            </TouchableOpacity>
          </View>
        );

      case 'NO_DRIVERS':
        return (
          <View style={tw`items-center p-5`}>
            <Icon name="error-outline" type="material" size={50} color="red" />
            <Text style={tw`text-lg mt-4`}>No drivers available</Text>
            <View style={tw`flex-row justify-between w-full mt-4`}>
              <TouchableOpacity
                style={tw`flex-1 mr-2 bg-black p-3 rounded-full`}
                onPress={handleRefresh}
              >
                <Text style={tw`text-white text-center`}>Try Again</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={tw`flex-1 ml-2 bg-gray-200 p-3 rounded-full`}
                onPress={handleExit}
              >
                <Text style={tw`text-center`}>Exit</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 'ACCEPTED':
        if (!rideRequest?.driver) {
          return (
            <View style={tw`items-center p-5`}>
              <ActivityIndicator size="large" color="#000" />
              <Text style={tw`text-lg mt-4`}>Loading driver details...</Text>
            </View>
          );
        }

        return (
          <View style={tw`p-5`}>
            <Text style={tw`text-lg font-bold mb-4`}>Driver Found!</Text>
            
            {/* Driver Info Card */}
            <View style={tw`bg-gray-100 p-4 rounded-lg mb-4`}>
              <View style={tw`flex-row items-center`}>
                <Image
                  source={{ uri: rideRequest.driver.profileImage }}
                  style={tw`w-16 h-16 rounded-full`}
                />
                <View style={tw`ml-4 flex-1`}>
                  <Text style={tw`text-lg font-bold`}>{rideRequest.driver.name}</Text>
                  <Text style={tw`text-gray-600`}>{rideRequest.driver.vehicleDetails}</Text>
                  <View style={tw`flex-row items-center mt-1`}>
                    <Icon name="star" type="material" size={16} color="gold" />
                    <Text style={tw`ml-1`}>{rideRequest.driver.rating}</Text>
                  </View>
                </View>
              </View>
            </View>
            
            <View style={tw`mt-4 p-4 bg-gray-100 rounded-lg`}>
              <View style={tw`flex-row justify-between items-center`}>
                <Text style={tw`text-gray-600`}>Estimated Fare</Text>
                <Text style={tw`font-bold`}>₹{fare}</Text>
              </View>
              <View style={tw`flex-row justify-between items-center mt-2`}>
                <Text style={tw`text-gray-600`}>Distance</Text>
                <Text>{(route.params?.travelTimeInformation?.distance?.value / 1000).toFixed(1)} km</Text>
              </View>
              <View style={tw`flex-row justify-between items-center mt-2`}>
                <Text style={tw`text-gray-600`}>Time</Text>
                <Text>{Math.round(route.params?.travelTimeInformation?.duration?.value / 60)} mins</Text>
              </View>
            </View>

            <View style={tw`mt-4 flex-row justify-between`}>
              <TouchableOpacity
                style={tw`flex-1 mr-2 p-3 rounded-full border border-black`}
                onPress={handleCancel}
              >
                <Text style={tw`text-black text-center`}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={tw`flex-1 ml-2 bg-black p-3 rounded-full`}
                onPress={handleStartRide}
              >
                <Text style={tw`text-white text-center`}>Start Ride</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={tw`flex-1`}>
      {origin?.location && destination?.location ? (
        <MapView
          style={tw`flex-1`}
          initialRegion={{
            latitude: origin.location.lat,
            longitude: origin.location.lng,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
        >
          <Marker 
            coordinate={{
              latitude: origin.location.lat,
              longitude: origin.location.lng,
            }} 
          />
          <Marker 
            coordinate={{
              latitude: destination.location.lat,
              longitude: destination.location.lng,
            }} 
          />
        </MapView>
      ) : (
        <View style={tw`flex-1 justify-center items-center`}>
          <Text>Loading map...</Text>
        </View>
      )}
      <View style={tw`bg-white absolute bottom-0 w-full`}>
        {renderContent()}
      </View>
    </View>
  );
};

export default RideConfirmationScreen;