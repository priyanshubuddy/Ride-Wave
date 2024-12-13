import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Modal,
  Linking,
  Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from 'react-native-elements';
import tw from 'tailwind-react-native-classnames';

const HelpScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);

  const helpTopics = [
    {
      title: 'Account & Payment',
      icon: 'person-outline',
      subtopics: [
        {
          title: 'Account settings',
          content: [
            'Update profile information',
            'Change password',
            'Manage notifications',
            'Delete account'
          ],
          action: () => navigation.navigate('EditProfileScreen')
        },
        {
          title: 'Payment methods',
          content: [
            'Add payment method',
            'Remove payment method',
            'Set default payment',
            'View payment history'
          ],
          action: () => navigation.navigate('PaymentScreen')
        },
        {
          title: 'Billing issues',
          content: [
            'Dispute a charge',
            'Request refund',
            'View receipts',
            'Report payment issue'
          ],
          action: () => handleContactSupport('billing')
        }
      ]
    },
    {
      title: 'Ride Issues',
      icon: 'car-outline',
      subtopics: [
        {
          title: 'Cancel ride',
          content: [
            'How to cancel a ride',
            'Cancellation fees',
            'Refund policy',
            'Dispute cancellation charge'
          ],
          action: () => handleShowHelp('cancel-ride')
        },
        {
          title: 'Lost items',
          content: [
            'Report lost item',
            'Contact driver',
            'Track item status',
            'Get support'
          ],
          action: () => handleLostItem()
        },
        {
          title: 'Ride safety',
          content: [
            'Emergency contacts',
            'Share ride status',
            'Report incident',
            'Safety guidelines'
          ],
          action: () => handleSafetyHelp()
        }
      ]
    },
    {
      title: 'Technical Support',
      icon: 'build-outline',
      subtopics: [
        {
          title: 'App problems',
          content: [
            'App crashes',
            'Login issues',
            'Update app',
            'Clear cache'
          ],
          action: () => handleTechnicalSupport('app')
        },
        {
          title: 'Location issues',
          content: [
            'GPS not working',
            'Wrong location shown',
            'Address not found',
            'Map problems'
          ],
          action: () => handleTechnicalSupport('location')
        },
        {
          title: 'Connection problems',
          content: [
            'Network errors',
            'Payment processing',
            'Driver connection',
            'Real-time updates'
          ],
          action: () => handleTechnicalSupport('connection')
        }
      ]
    },
    {
      title: 'Contact Us',
      icon: 'mail-outline',
      subtopics: [
        {
          title: 'Customer service',
          content: [
            'Chat with support',
            'Email support',
            'FAQ',
            'Support tickets'
          ],
          action: () => handleCustomerService()
        },
        {
          title: 'Emergency support',
          content: [
            '24/7 helpline',
            'SOS alert',
            'Police assistance',
            'Medical emergency'
          ],
          action: () => handleEmergencySupport()
        },
        {
          title: 'Feedback',
          content: [
            'Rate our service',
            'Submit suggestion',
            'Report bug',
            'Feature request'
          ],
          action: () => handleFeedback()
        }
      ]
    }
  ];

  const handleShowHelp = (topic) => {
    const topicContent = helpTopics.find(t => 
      t.subtopics.some(s => s.title.toLowerCase() === topic)
    );
    setSelectedTopic(topicContent);
    setModalVisible(true);
  };

  const handleContactSupport = (type) => {
    Alert.alert(
      'Contact Support',
      'Would you like to contact our support team?',
      [
        {
          text: 'Call',
          onPress: () => Linking.openURL('tel:+1234567890')
        },
        {
          text: 'Email',
          onPress: () => Linking.openURL('mailto:support@ridewave.com')
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

  const handleLostItem = () => {
    Alert.alert(
      'Report Lost Item',
      'Would you like to report a lost item from your recent ride?',
      [
        {
          text: 'Report Item',
          onPress: () => navigation.navigate('ReportLostItem')
        },
        {
          text: 'Contact Driver',
          onPress: () => handleContactSupport('lost-item')
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

  const handleSafetyHelp = () => {
    Alert.alert(
      'Safety Help',
      'Select an option:',
      [
        {
          text: 'Emergency Services',
          onPress: () => Linking.openURL('tel:911')
        },
        {
          text: 'Report Incident',
          onPress: () => handleContactSupport('safety')
        },
        {
          text: 'View Guidelines',
          onPress: () => handleShowHelp('safety-guidelines')
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

  const handleEmergencySupport = () => {
    Alert.alert(
      '🚨 Emergency Support',
      'Do you need immediate assistance?',
      [
        {
          text: 'Call Emergency Services',
          onPress: () => Linking.openURL('tel:911'),
          style: 'destructive'
        },
        {
          text: 'Contact RideWave Support',
          onPress: () => Linking.openURL('tel:+1234567890')
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

  const handleCustomerService = () => {
    Alert.alert(
      'Customer Service',
      'How would you like to contact us?',
      [
        {
          text: 'Live Chat',
          onPress: () => navigation.navigate('ChatSupport')
        },
        {
          text: 'Call',
          onPress: () => Linking.openURL('tel:+1234567890')
        },
        {
          text: 'Email',
          onPress: () => Linking.openURL('mailto:support@ridewave.com')
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

  const handleFeedback = () => {
    Alert.alert(
      'Feedback',
      'We value your feedback!',
      [
        {
          text: 'Rate App',
          onPress: () => Linking.openURL('market://details?id=com.ridewave')
        },
        {
          text: 'Send Feedback',
          onPress: () => Linking.openURL('mailto:feedback@ridewave.com')
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

  const handleTechnicalSupport = (type) => {
    Alert.alert(
      'Technical Support',
      'Choose an option to resolve your issue:',
      [
        {
          text: 'View Solutions',
          onPress: () => handleShowHelp(`${type}-solutions`)
        },
        {
          text: 'Contact Support',
          onPress: () => handleContactSupport('technical')
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

  const renderHelpTopic = (topic, index) => (
    <View key={index} style={tw`bg-white rounded-xl shadow-sm mb-4 overflow-hidden`}>
      <View style={tw`p-4 border-b border-gray-100`}>
        <View style={tw`flex-row items-center`}>
          <Icon name={topic.icon} type="ionicon" size={24} color="#333" />
          <Text style={tw`text-lg font-bold ml-3`}>{topic.title}</Text>
        </View>
      </View>
      {topic.subtopics.map((subtopic, subIndex) => (
        <TouchableOpacity 
          key={subIndex} 
          style={tw`p-4 border-b border-gray-100 flex-row justify-between items-center`}
          onPress={subtopic.action}
        >
          <Text style={tw`text-base text-gray-700`}>{subtopic.title}</Text>
          <Icon name="chevron-forward" type="ionicon" size={20} color="#666" />
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      <View style={tw`flex-row items-center p-4 border-b border-gray-200 bg-white`}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={tw`p-2`}
        >
          <Icon name="arrow-back" type="ionicon" size={24} />
        </TouchableOpacity>
        <Text style={tw`text-xl font-bold ml-2`}>Help & Support</Text>
      </View>

      <ScrollView style={tw`flex-1 p-4`}>
        {helpTopics.map((topic, index) => renderHelpTopic(topic, index))}
      </ScrollView>

      <TouchableOpacity 
        style={tw`bg-red-500 mx-4 mb-4 p-4 rounded-full flex-row justify-center items-center`}
        onPress={handleEmergencySupport}
      >
        <Icon name="warning" type="ionicon" size={24} color="#fff" />
        <Text style={tw`text-white font-bold ml-2`}>Emergency Support</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={tw`flex-1 justify-end`}>
          <View style={tw`bg-white rounded-t-xl p-4`}>
            <View style={tw`flex-row justify-between items-center mb-4`}>
              <Text style={tw`text-xl font-bold`}>{selectedTopic?.title}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon name="close" type="ionicon" size={24} />
              </TouchableOpacity>
            </View>
            {selectedTopic?.subtopics.map((subtopic, index) => (
              <View key={index} style={tw`mb-4`}>
                <Text style={tw`font-bold mb-2`}>{subtopic.title}</Text>
                {subtopic.content.map((item, i) => (
                  <Text key={i} style={tw`text-gray-600 mb-1`}>• {item}</Text>
                ))}
              </View>
            ))}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default HelpScreen;