import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, BackHandler, Alert } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { clearAuthData, getAuthData } from '../utils/auth';

const CustomDrawer = (props) => {
    const navigation = useNavigation();
    const [userData, setUserData] = useState(null);
    const { handleAuthStateChange } = props;

    const loadUserData = useCallback(async () => {
        try {
            const { userData: authData } = await getAuthData();
            if (authData) {
                setUserData(authData);
            } else {
                await clearAuthData();
                navigation.navigate('LandingScreen');
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    }, [navigation]);

    useEffect(() => {
        loadUserData();
    }, [loadUserData]);

    const handleLogout = async () => {
        try {
            await clearAuthData();
            handleAuthStateChange(false);
        } catch (error) {
            console.error('Error during logout:', error);
            Alert.alert(
                'Error',
                'Failed to logout. Please try again.'
            );
        }
    };

    const menuItems = [
        {
            icon: 'home-outline',
            label: 'Home',
            onPress: () => {
                navigation.navigate('MainStack', { screen: 'HomeScreen' });
                navigation.dispatch(DrawerActions.closeDrawer());
            }
        },
        {
            icon: 'time-outline',
            label: 'Ride History',
            onPress: () => {
                navigation.navigate('MainStack', { screen: 'HistoryScreen' });
                navigation.dispatch(DrawerActions.closeDrawer());
            }
        },
        {
            icon: 'card-outline',
            label: 'Payment',
            onPress: () => {
                navigation.navigate('MainStack', { screen: 'PaymentScreen' });
                navigation.dispatch(DrawerActions.closeDrawer());
            }
        },
        {
            icon: 'settings-outline',
            label: 'Settings',
            onPress: () => {
                navigation.navigate('MainStack', { screen: 'SettingsScreen' });
                navigation.dispatch(DrawerActions.closeDrawer());
            }
        },
        {
            icon: 'help-circle-outline',
            label: 'Help',
            onPress: () => {
                navigation.navigate('MainStack', { screen: 'HelpScreen' });
                navigation.dispatch(DrawerActions.closeDrawer());
            }
        },
    ];

    return (
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView {...props}>
                <View style={styles.container}>
                    <View style={styles.profileSection}>
                        <Image
                            source={userData?.profileImage ? { uri: userData.profileImage } : require('../../assets/default-avatar.jpg')}
                            style={styles.profileImage}
                        />
                        <View style={styles.profileInfo}>
                            <Text style={styles.profileName}>{userData?.name || 'Loading...'}</Text>
                            <Text style={styles.profileEmail}>{userData?.email || 'Loading...'}</Text>
                            <TouchableOpacity 
                                style={styles.editButton} 
                                onPress={() => {
                                    navigation.navigate('MainStack', { screen: 'EditProfileScreen' });
                                    navigation.dispatch(DrawerActions.closeDrawer());
                                }}
                            >
                                <Text style={styles.editButtonText}>Edit Profile</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.menuItems}>
                        {menuItems.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.menuItem}
                                onPress={item.onPress}
                            >
                                <Ionicons name={item.icon} size={24} color="#333" />
                                <Text style={styles.menuItemText}>{item.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </DrawerContentScrollView>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={24} color="#FF0000" />
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
    },
    profileSection: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 10,
    },
    profileInfo: {
        marginLeft: 12,
    },
    profileName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    profileEmail: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    editButton: {
        marginTop: 8,
    },
    editButtonText: {
        color: '#007AFF',
        fontSize: 14,
    },
    menuItems: {
        marginTop: 20,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    menuItemText: {
        marginLeft: 16,
        fontSize: 16,
        color: '#333',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        backgroundColor: 'white',
    },
    logoutText: {
        marginLeft: 16,
        fontSize: 16,
        color: '#FF0000',
    },
});

export default CustomDrawer;