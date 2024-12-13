import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Modal, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const SettingsScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [locationServices, setLocationServices] = useState(true);
  const [modalContent, setModalContent] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const modalContents = {
    privacy: {
      title: 'Privacy Policy',
      content: `Last updated: ${new Date().toLocaleDateString()}

Privacy Policy for Ride Wave

1. Information We Collect
- Personal Information: Name, email, phone number
- Location Data: Pick-up and drop-off locations
- Payment Information: Payment method details
- Device Information: Device type, OS version

2. How We Use Your Information
- To provide ride-sharing services
- To process payments
- To improve our services
- To ensure safety and security

3. Data Protection
- We implement industry-standard security measures
- Your data is encrypted during transmission
- Regular security audits are conducted

4. Your Rights
- Access your personal data
- Request data correction
- Delete your account
- Opt-out of marketing communications

5. Contact Us
For privacy-related inquiries, contact us at:
privacy@ridewave.com`
    },
    terms: {
      title: 'Terms of Service',
      content: `Last updated: ${new Date().toLocaleDateString()}

Terms of Service for Ride Wave

1. Acceptance of Terms
By using Ride Wave, you agree to these terms.

2. Service Description
- Ride-sharing platform connecting riders and drivers
- Payment processing services
- Location-based services

3. User Responsibilities
- Provide accurate information
- Maintain account security
- Follow community guidelines
- Respect other users

4. Safety Guidelines
- Verify driver/rider identity
- Share ride details with trusted contacts
- Report suspicious activity
- Follow COVID-19 safety protocols

5. Payment Terms
- Transparent pricing
- Cancellation policies
- Refund procedures
- Payment methods

6. Liability
- Service limitations
- Dispute resolution
- Insurance coverage

7. Contact
For assistance, contact:
support@ridewave.com`
    },
    about: {
      title: 'About Ride Wave',
      content: `Ride Wave - Version 1.0.0

Our Mission
To provide safe, reliable, and affordable transportation solutions while reducing carbon footprint.

Features
- Real-time ride tracking
- Secure payments
- Rating system
- 24/7 customer support

The Team
Founded in 2024, Ride Wave is committed to revolutionizing urban transportation.

Awards & Recognition
- Best New Ride-Sharing App 2024
- Innovation in Urban Mobility Award
- Green Transportation Initiative

Contact Information
Email: info@ridewave.com
Phone: 1-800-RIDE-WAVE
Address: Tech Hub, Silicon Valley, CA`
    }
  };

  const openModal = (type) => {
    setModalContent(modalContents[type]);
    setModalVisible(true);
  };

  const settingsOptions = [
    {
      title: 'Notifications',
      icon: 'notifications-outline',
      type: 'switch',
      value: notifications,
      onValueChange: setNotifications,
    },
    {
      title: 'Dark Mode',
      icon: 'moon-outline',
      type: 'switch',
      value: darkMode,
      onValueChange: setDarkMode,
    },
    {
      title: 'Location Services',
      icon: 'location-outline',
      type: 'switch',
      value: locationServices,
      onValueChange: setLocationServices,
    },
    {
      title: 'Privacy Policy',
      icon: 'shield-outline',
      type: 'link',
      onPress: () => openModal('privacy'),
    },
    {
      title: 'Terms of Service',
      icon: 'document-text-outline',
      type: 'link',
      onPress: () => openModal('terms'),
    },
    {
      title: 'About',
      icon: 'information-circle-outline',
      type: 'link',
      onPress: () => openModal('about'),
    },
  ];

  const renderSettingItem = (item, index) => (
    <TouchableOpacity 
      key={index}
      style={styles.settingItem}
      onPress={item.type === 'link' ? item.onPress : undefined}
    >
      <View style={styles.settingInfo}>
        <Ionicons name={item.icon} size={24} color="#333" />
        <Text style={styles.settingTitle}>{item.title}</Text>
      </View>
      {item.type === 'switch' ? (
        <Switch
          value={item.value}
          onValueChange={item.onValueChange}
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={item.value ? "#f5dd4b" : "#f4f3f4"}
        />
      ) : (
        <Ionicons name="chevron-forward" size={24} color="#666" />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.settingsContainer}>
        {settingsOptions.map((item, index) => renderSettingItem(item, index))}
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{modalContent?.title}</Text>
              <TouchableOpacity 
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <Text style={styles.modalText}>{modalContent?.content}</Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  settingsContainer: {
    padding: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingTitle: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  modalBody: {
    maxHeight: '90%',
  },
  modalText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
});

export default SettingsScreen; 