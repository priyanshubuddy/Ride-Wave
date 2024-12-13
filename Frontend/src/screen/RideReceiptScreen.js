import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from 'react-native-elements';
import moment from 'moment';

const RideReceiptScreen = ({ route, navigation }) => {
  const { ride } = route.params;

  const handleShareReceipt = async () => {
    try {
      await Share.share({
        message: `Ride Receipt\nDate: ${moment(ride.requestedAt).format('MMM DD, YYYY')}\nAmount: ₹${ride.fare}\nFrom: ${ride.origin.description}\nTo: ${ride.destination.description}`,
      });
    } catch (error) {
      console.error('Error sharing receipt:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" type="ionicon" size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Receipt</Text>
        <TouchableOpacity onPress={handleShareReceipt}>
          <Icon name="share-outline" type="ionicon" size={24} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.date}>
          {moment(ride.requestedAt).format('MMM DD, YYYY hh:mm A')}
        </Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ride Details</Text>
          <View style={styles.detail}>
            <Text style={styles.label}>From</Text>
            <Text style={styles.value}>{ride.origin.description}</Text>
          </View>
          <View style={styles.detail}>
            <Text style={styles.label}>To</Text>
            <Text style={styles.value}>{ride.destination.description}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Details</Text>
          <View style={styles.detail}>
            <Text style={styles.label}>Base Fare</Text>
            <Text style={styles.value}>₹{ride.baseFare}</Text>
          </View>
          <View style={styles.detail}>
            <Text style={styles.label}>Distance Fare</Text>
            <Text style={styles.value}>₹{ride.distanceFare}</Text>
          </View>
          <View style={styles.detail}>
            <Text style={styles.label}>Time Fare</Text>
            <Text style={styles.value}>₹{ride.timeFare}</Text>
          </View>
          <View style={styles.detail}>
            <Text style={styles.label}>Taxes</Text>
            <Text style={styles.value}>₹{ride.taxes}</Text>
          </View>
          <View style={[styles.detail, styles.total]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₹{ride.fare}</Text>
          </View>
        </View>
      </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  date: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  detail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: {
    color: '#666',
  },
  value: {
    fontWeight: '500',
  },
  total: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
    marginTop: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RideReceiptScreen; 