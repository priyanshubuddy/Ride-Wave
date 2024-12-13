import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  RefreshControl 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from 'react-native-elements';
import tw from 'tailwind-react-native-classnames';
import axiosInstance from '../utils/axiosInstance';
import moment from 'moment';

const HistoryScreen = ({ navigation }) => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRideHistory = async () => {
    try {
      const response = await axiosInstance.get('/api/rides/ride-requests/history');
      if (response.data.status === 'success') {
        setRides(response.data.data.rides);
      }
    } catch (error) {
      console.error('Error fetching ride history:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRideHistory();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchRideHistory();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'text-green-600';
      case 'CANCELLED':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'text-green-600';
      case 'PENDING':
        return 'text-yellow-600';
      case 'FAILED':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const handleViewReceipt = (ride) => {
    navigation.navigate('RideReceiptScreen', { ride });
  };

  const renderRideItem = ({ item }) => (
    <View style={tw`bg-white p-4 mb-3 rounded-xl shadow-sm`}>
      <View style={tw`flex-row justify-between items-center mb-3`}>
        <Text style={tw`text-lg font-bold`}>
          {moment(item.requestedAt).format('MMM DD, YYYY')}
        </Text>
        <Text style={tw`text-lg font-bold`}>₹{item.fare}</Text>
      </View>

      <View style={tw`mb-3`}>
        <View style={tw`flex-row items-center mb-2`}>
          <Icon name="radio-button-on" type="ionicon" size={20} color="#2563eb" />
          <Text style={tw`ml-2 flex-1`} numberOfLines={1}>
            {item.origin.description}
          </Text>
        </View>
        <View style={tw`flex-row items-center`}>
          <Icon name="location" type="ionicon" size={20} color="#dc2626" />
          <Text style={tw`ml-2 flex-1`} numberOfLines={1}>
            {item.destination.description}
          </Text>
        </View>
      </View>

      <View style={tw`flex-row justify-between items-center pt-2 border-t border-gray-200`}>
        <View style={tw`flex-row items-center`}>
          <Icon name="time-outline" type="ionicon" size={16} color="#666" />
          <Text style={tw`ml-1 text-gray-600`}>
            {moment(item.requestedAt).format('hh:mm A')}
          </Text>
        </View>
        <Text style={tw`${getStatusColor(item.status)}`}>
          {item.status}
        </Text>
      </View>

      {item.driver && (
        <View style={tw`mt-2 pt-2 border-t border-gray-200`}>
          <View style={tw`flex-row items-center`}>
            <Icon name="person-outline" type="ionicon" size={16} color="#666" />
            <Text style={tw`ml-1`}>{item.driver.name}</Text>
            <Text style={tw`mx-2 text-gray-400`}>•</Text>
            <Icon name="star" type="ionicon" size={16} color="#fbbf24" />
            <Text style={tw`ml-1`}>{item.driver.rating}</Text>
          </View>
          <Text style={tw`text-gray-500 text-sm mt-1`}>
            {item.driver.vehicleDetails}
          </Text>
        </View>
      )}

      <View style={tw`mt-2 pt-2 border-t border-gray-200`}>
        <View style={tw`flex-row justify-between items-center`}>
          <View style={tw`flex-row items-center`}>
            <Icon name="card-outline" type="ionicon" size={16} color="#666" />
            <Text style={tw`ml-2`}>
              {item.paymentMethod?.title || 'Cash'}
            </Text>
          </View>
          <View style={tw`flex-row items-center`}>
            <Text style={tw`mr-2 font-bold`}>₹{item.fare}</Text>
            <Text style={tw`${getPaymentStatusColor(item.paymentStatus)}`}>
              {item.paymentStatus}
            </Text>
          </View>
        </View>
      </View>

      {item.paymentStatus === 'COMPLETED' && (
        <TouchableOpacity 
          style={tw`mt-2 flex-row justify-center items-center py-2 border border-gray-200 rounded-lg`}
          onPress={() => handleViewReceipt(item)}
        >
          <Icon name="receipt-outline" type="ionicon" size={16} color="#666" />
          <Text style={tw`ml-2 text-gray-600`}>View Receipt</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={tw`flex-1 bg-gray-50`}>
        <View style={tw`flex-row items-center p-4 border-b border-gray-200`}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={tw`p-2`}
          >
            <Icon name="arrow-back" type="ionicon" size={24} />
          </TouchableOpacity>
          <Text style={tw`text-xl font-bold ml-2`}>Ride History</Text>
        </View>
        <View style={tw`flex-1 justify-center items-center`}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      <View style={tw`flex-row items-center p-4 border-b border-gray-200`}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={tw`p-2`}
        >
          <Icon name="arrow-back" type="ionicon" size={24} />
        </TouchableOpacity>
        <Text style={tw`text-xl font-bold ml-2`}>Ride History</Text>
      </View>

      {rides.length === 0 ? (
        <View style={tw`flex-1 justify-center items-center p-4`}>
          <Icon 
            name="car-outline" 
            type="ionicon" 
            size={48} 
            color="#9ca3af"
          />
          <Text style={tw`text-lg text-gray-500 mt-4 text-center`}>
            No ride history available yet
          </Text>
        </View>
      ) : (
        <FlatList
          data={rides}
          renderItem={renderRideItem}
          keyExtractor={item => item._id}
          contentContainerStyle={tw`p-4`}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

export default HistoryScreen;