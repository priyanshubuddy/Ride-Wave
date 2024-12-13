import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Image,
    Alert,
    ActivityIndicator,
    ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import axiosInstance from '../utils/axiosInstance';
import { getAuthData, updateAuthData } from '../utils/auth';
import { useNavigation, useRoute } from '@react-navigation/native';

const EditProfileScreen = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        profileImage: null,
    });

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const { userData: authData } = await getAuthData();
            if (authData) {
                setUserData({
                    name: authData.name || '',
                    email: authData.email || '',
                    phoneNumber: authData.phoneNumber || '',
                    profileImage: authData.profileImage || null,
                });
            }
        } catch (error) {
            console.error('Error loading user data:', error);
            Alert.alert('Error', 'Failed to load user data');
        }
    };

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5,
            });

            if (!result.canceled) {
                setUserData(prev => ({ ...prev, profileImage: result.assets[0].uri }));
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Error', 'Failed to pick image');
        }
    };

    const handleSave = async () => {
        if (!userData.name.trim() || !userData.email.trim()) {
            Alert.alert('Error', 'Name and email are required');
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('name', userData.name);
            formData.append('email', userData.email.toLowerCase());
            if (userData.phoneNumber) {
                formData.append('phoneNumber', userData.phoneNumber);
            }

            if (userData.profileImage && userData.profileImage.startsWith('file://')) {
                formData.append('profileImage', {
                    uri: userData.profileImage,
                    type: 'image/jpeg',
                    name: 'profile-image.jpg',
                });
            }

            const response = await axiosInstance.put('/api/users/profile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${(await getAuthData()).token}`
                },
            });

            if (response.data) {
                await updateAuthData(response.data.userData);
                
                navigation.navigate('HomeScreen', { profileUpdated: true });
                Alert.alert('Success', 'Profile updated successfully');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            const errorMessage = error.response?.data?.error || 'Failed to update profile';
            Alert.alert('Error', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Edit Profile</Text>
                    <TouchableOpacity onPress={handleSave} disabled={loading}>
                        {loading ? (
                            <ActivityIndicator size={24} color="#007AFF" />
                        ) : (
                            <Text style={styles.saveButton}>Save</Text>
                        )}
                    </TouchableOpacity>
                </View>

                <View style={styles.content}>
                    <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
                        <Image
                            source={
                                userData.profileImage
                                    ? { uri: userData.profileImage }
                                    : require('../../assets/default-avatar.jpg')
                            }
                            style={styles.profileImage}
                        />
                        <View style={styles.editIconContainer}>
                            <Ionicons name="camera" size={20} color="#fff" />
                        </View>
                    </TouchableOpacity>

                    <View style={styles.form}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Name</Text>
                            <TextInput
                                style={styles.input}
                                value={userData.name}
                                onChangeText={text => setUserData(prev => ({ ...prev, name: text }))}
                                placeholder="Enter your name"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email</Text>
                            <TextInput
                                style={styles.input}
                                value={userData.email}
                                onChangeText={text => setUserData(prev => ({ ...prev, email: text }))}
                                placeholder="Enter your email"
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Phone Number</Text>
                            <TextInput
                                style={styles.input}
                                value={userData.phoneNumber}
                                onChangeText={text => setUserData(prev => ({ ...prev, phoneNumber: text }))}
                                placeholder="Enter your phone number"
                                keyboardType="phone-pad"
                                maxLength={10}
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>
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
    saveButton: {
        color: '#007AFF',
        fontSize: 16,
        fontWeight: '500',
    },
    content: {
        padding: 20,
    },
    imageContainer: {
        alignSelf: 'center',
        marginBottom: 30,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    editIconContainer: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        backgroundColor: '#007AFF',
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#fff',
    },
    form: {
        gap: 20,
    },
    inputGroup: {
        gap: 8,
    },
    label: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
});

export default EditProfileScreen;
