import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Share, Alert, Linking } from 'react-native';
import { Icon } from 'react-native-elements';
import tw from 'tailwind-react-native-classnames';
import MapView, { Marker } from 'react-native-maps';
import axiosInstance from '../utils/axiosInstance';

const OngoingRideScreen = ({ route, navigation }) => {
  const { rideRequest, driver } = route.params;
  const [isCompleting, setIsCompleting] = useState(false);

  const getGoogleMapsLink = () => {
    const origin = `${rideRequest.origin.location.lat},${rideRequest.origin.location.lng}`;
    const destination = `${rideRequest.destination.location.lat},${rideRequest.destination.location.lng}`;
    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
  };

  const handleShare = async () => {
    try {
      const mapLink = getGoogleMapsLink();
      const estimatedArrival = new Date(Date.now() + (rideRequest.estimatedDuration * 1000));
      
      const message = 
        `🚗 Track My Ride!\n\n` +
        `🚦 Status: On the way\n` +
        `🎯 ETA: ${estimatedArrival.toLocaleTimeString()}\n\n` +
        `👤 Driver Details:\n` +
        `   • Name: ${driver.name}\n` +
        `   • Vehicle: ${driver.vehicleDetails}\n` +
        `   • Rating: ${driver.rating}⭐\n\n` +
        `📍 From: ${rideRequest.origin.description}\n` +
        `🏁 To: ${rideRequest.destination.description}\n\n` +
        `🗺️ Distance: ${(rideRequest.estimatedDistance / 1000).toFixed(1)} km\n` +
        `⏱️ Duration: ${Math.round(rideRequest.estimatedDuration / 60)} mins\n` +
        `💰 Fare: ₹${rideRequest.fare}\n\n` +
        `📱 Track journey: ${mapLink}\n\n` +
        `Sent via RideWave`;

      const result = await Share.share({
        message,
        title: 'Track My RideWave Journey'
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('Shared with activity type:', result.activityType);
        } else {
          console.log('Shared successfully');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to share ride status');
      console.error('Share error:', error);
    }
  };

  const handleOpenMap = () => {
    const mapLink = getGoogleMapsLink();
    Linking.canOpenURL(mapLink).then(supported => {
      if (supported) {
        Linking.openURL(mapLink);
      } else {
        Alert.alert(
          'Error',
          'Unable to open maps application',
          [{ text: 'OK' }]
        );
      }
    });
  };

  const handleCompleteRide = async () => {
    try {
      setIsCompleting(true);
      const response = await axiosInstance.post(
        `/api/rides/ride-requests/${rideRequest._id}/complete`
      );

      if (response.data.status === 'success') {
        Alert.alert(
          'Ride Completed',
          'Thank you for riding with us!',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('HomeScreen')
            }
          ]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to complete ride');
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <View style={tw`flex-1`}>
      <MapView
        style={tw`flex-1`}
        initialRegion={{
          latitude: rideRequest.origin.location.lat,
          longitude: rideRequest.origin.location.lng,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
      >
        <Marker 
          coordinate={{
            latitude: rideRequest.origin.location.lat,
            longitude: rideRequest.origin.location.lng,
          }}
          title="Pickup"
          description={rideRequest.origin.description}
        />
        <Marker 
          coordinate={{
            latitude: rideRequest.destination.location.lat,
            longitude: rideRequest.destination.location.lng,
          }}
          title="Destination"
          description={rideRequest.destination.description}
        />
      </MapView>

      {/* Driver Info Card */}
      <View style={tw`bg-white absolute bottom-0 w-full p-5 rounded-t-3xl shadow-lg`}>
        <View style={tw`flex-row justify-between items-center mb-4`}>
          <Text style={tw`text-xl font-bold`}>Ongoing Ride</Text>
          <View style={tw`flex-row`}>
            <TouchableOpacity 
              style={tw`p-2 bg-gray-100 rounded-full mr-2`}
              onPress={handleOpenMap}
            >
              <Icon name="map" type="material" size={24} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={tw`p-2 bg-gray-100 rounded-full`}
              onPress={handleShare}
            >
              <Icon name="share" type="material" size={24} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={tw`flex-row items-center`}>
          <Image
            source={{ uri: driver?.profileImage || 'https://randomuser.me/api/portraits/men/1.jpg' }}
            style={tw`w-16 h-16 rounded-full`}
          />
          <View style={tw`ml-4 flex-1`}>
            <Text style={tw`text-lg font-bold`}>{driver?.name}</Text>
            <Text>{driver?.vehicleDetails}</Text>
            <View style={tw`flex-row items-center`}>
              <Icon name="star" type="material" size={16} color="gold" />
              <Text style={tw`ml-1`}>{driver?.rating}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={tw`bg-gray-200 p-3 rounded-full`}
            onPress={() => {/* Add call functionality */}}
          >
            <Icon name="phone" type="material" />
          </TouchableOpacity>
        </View>

        <View style={tw`mt-4 flex-row justify-between items-center`}>
          <View>
            <Text style={tw`text-gray-500`}>Estimated Time</Text>
            <Text style={tw`text-lg font-bold`}>
              {Math.round(rideRequest?.estimatedDuration / 60)} mins
            </Text>
          </View>
          <View>
            <Text style={tw`text-gray-500`}>Fare</Text>
            <Text style={tw`text-lg font-bold`}>₹{rideRequest?.fare}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={tw`mt-4 bg-black p-4 rounded-full`}
          onPress={handleCompleteRide}
          disabled={isCompleting}
        >
          <Text style={tw`text-white text-center text-lg`}>
            {isCompleting ? 'Completing Ride...' : 'Complete Ride'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OngoingRideScreen;