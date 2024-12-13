import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import axiosInstance from '../utils/axiosInstance';

const PaymentScreen = ({ navigation }) => {
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: '1',
      type: 'card',
      title: '**** **** **** 4242',
      subtitle: 'Expires 12/24',
      isDefault: true
    }
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      const response = await axiosInstance.get('/api/payments/methods');
      setPaymentMethods(response.data.paymentMethods);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPayment = () => {
    navigation.navigate('AddPaymentScreen');
  };

  const handleSetDefault = async (id) => {
    try {
      await axiosInstance.put(`/api/payments/methods/${id}/default`);
      const updatedMethods = paymentMethods.map(method => ({
        ...method,
        isDefault: method.id === id
      }));
      setPaymentMethods(updatedMethods);
    } catch (error) {
      console.error('Error setting default payment:', error);
    }
  };

  const renderPaymentMethod = ({ item }) => (
    <TouchableOpacity 
      style={[styles.paymentItem, item.isDefault && styles.defaultPayment]}
      onPress={() => handleSetDefault(item.id)}
    >
      <View style={styles.paymentInfo}>
        <Ionicons 
          name={item.type === 'card' ? 'card' : 'cash'} 
          size={24} 
          color="#333" 
        />
        <View style={styles.paymentDetails}>
          <Text style={styles.paymentTitle}>{item.title}</Text>
          <Text style={styles.paymentSubtitle}>{item.subtitle}</Text>
          {item.isDefault && (
            <Text style={styles.defaultLabel}>Default</Text>
          )}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#666" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Payment Methods</Text>
        <TouchableOpacity onPress={handleAddPayment}>
          <Ionicons name="add" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={paymentMethods}
        renderItem={renderPaymentMethod}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />

      <TouchableOpacity style={styles.addButton} onPress={handleAddPayment}>
        <Text style={styles.addButtonText}>Add Payment Method</Text>
      </TouchableOpacity>

      {loading && (
        <ActivityIndicator size={36} color="#007AFF" />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  listContainer: {
    padding: 16,
  },
  paymentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 12,
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentDetails: {
    marginLeft: 12,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  paymentSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  addButton: {
    margin: 16,
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  defaultPayment: {
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  defaultLabel: {
    color: '#007AFF',
    fontWeight: '500',
    marginTop: 4,
  },
});

export default PaymentScreen; 