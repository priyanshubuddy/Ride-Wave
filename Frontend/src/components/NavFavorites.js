import React, { useState, useEffect } from 'react';
import { TouchableOpacity, FlatList, Text, View, Modal, Alert, ScrollView } from 'react-native';
import { Icon } from 'react-native-elements';
import tw from 'tailwind-react-native-classnames';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GOOGLE_MAPS_APIKEY } from '../../config.json';

const FAVORITE_LOCATIONS_KEY = 'userFavoriteLocations';
const MAX_FAVORITES = 3;

const NavFavorites = ({ onSelect }) => {
    const [favorites, setFavorites] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedLocationType, setSelectedLocationType] = useState(null);

    const locationTypes = [
        { id: 'home', icon: 'home', label: 'Home' },
        { id: 'work', icon: 'briefcase', label: 'Work' },
        { id: 'other', icon: 'star', label: 'Favorite' },
    ];

    useEffect(() => {
        loadFavorites();
    }, []);

    const loadFavorites = async () => {
        try {
            const savedFavorites = await AsyncStorage.getItem(FAVORITE_LOCATIONS_KEY);
            if (savedFavorites) {
                setFavorites(JSON.parse(savedFavorites));
            }
        } catch (error) {
            console.error('Error loading favorites:', error);
        }
    };

    const saveFavorites = async (newFavorites) => {
        try {
            await AsyncStorage.setItem(FAVORITE_LOCATIONS_KEY, JSON.stringify(newFavorites));
            setFavorites(newFavorites);
        } catch (error) {
            console.error('Error saving favorites:', error);
        }
    };

    const handleAddLocation = (type) => {
        if (favorites.length >= MAX_FAVORITES) {
            Alert.alert('Limit Reached', 'You can only save up to 3 favorite locations.');
            return;
        }
        setSelectedLocationType(type);
        setShowAddModal(true);
    };

    const handleLocationSelect = async (data, details) => {
        if (!details?.geometry?.location) return;

        const newLocation = {
            id: Date.now().toString(),
            icon: selectedLocationType.icon,
            location: selectedLocationType.label,
            description: data.description,
            coordinates: {
                lat: details.geometry.location.lat,
                lng: details.geometry.location.lng,
            }
        };

        const existingTypeIndex = favorites.findIndex(fav => fav.location === selectedLocationType.label);
        let newFavorites;

        if (existingTypeIndex !== -1) {
            // Replace existing location of same type
            newFavorites = favorites.map((fav, index) => 
                index === existingTypeIndex ? newLocation : fav
            );
        } else {
            // Add new location
            newFavorites = [...favorites, newLocation];
        }

        await saveFavorites(newFavorites);
        setShowAddModal(false);
        setSelectedLocationType(null);
    };

    const handleRemoveLocation = (id) => {
        Alert.alert(
            'Remove Location',
            'Are you sure you want to remove this location?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: async () => {
                        const newFavorites = favorites.filter(fav => fav.id !== id);
                        await saveFavorites(newFavorites);
                    }
                }
            ]
        );
    };

    return (
        <View style={tw`bg-white flex-shrink`}>
            <ScrollView style={tw`max-h-96`}>
                <FlatList
                    data={favorites}
                    keyExtractor={(item) => item.id}
                    scrollEnabled={false}
                    ItemSeparatorComponent={() => (
                        <View style={[tw`bg-gray-200`, { height: 0.5 }]} />
                    )}
                    renderItem={({ item }) => (
                        <TouchableOpacity 
                            style={tw`flex-row items-center p-5`}
                            onPress={() => onSelect?.(item)}
                            onLongPress={() => handleRemoveLocation(item.id)}
                        >
                            <Icon
                                style={tw`mr-4 rounded-full bg-gray-300 p-3`}
                                name={item.icon}
                                type="ionicon"
                                color="white"
                                size={18}
                            />
                            <View style={tw`flex-1`}>
                                <Text style={tw`font-semibold text-lg`}>{item.location}</Text>
                                <Text 
                                    style={tw`text-gray-500`}
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                >
                                    {item.description}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={() => (
                        <View style={tw`py-4`}>
                            <Text style={tw`text-center text-gray-500`}>
                                No favorite locations added yet
                            </Text>
                        </View>
                    )}
                    ListFooterComponent={() => (
                        favorites.length < MAX_FAVORITES && (
                            <View style={tw`px-5 pb-4`}>
                                {locationTypes.map((type) => (
                                    !favorites.find(fav => fav.location === type.label) && (
                                        <TouchableOpacity
                                            key={type.id}
                                            style={tw`flex-row items-center justify-center p-3 bg-gray-100 rounded-lg mb-2`}
                                            onPress={() => handleAddLocation(type)}
                                        >
                                            <Icon
                                                name={type.icon}
                                                type="ionicon"
                                                size={20}
                                                color="#4b5563"
                                                style={tw`mr-2`}
                                            />
                                            <Text style={tw`text-gray-600`}>Add {type.label}</Text>
                                        </TouchableOpacity>
                                    )
                                ))}
                            </View>
                        )
                    )}
                />
            </ScrollView>

            <Modal
                visible={showAddModal}
                animationType="slide"
                transparent={true}
            >
                <View style={tw`flex-1 bg-white mt-20`}>
                    <View style={tw`p-5 border-b border-gray-200`}>
                        <View style={tw`flex-row justify-between items-center`}>
                            <Text style={tw`text-lg font-bold`}>
                                Add {selectedLocationType?.label} Location
                            </Text>
                            <TouchableOpacity onPress={() => setShowAddModal(false)}>
                                <Icon name="close" size={24} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <GooglePlacesAutocomplete
                        placeholder="Search location"
                        fetchDetails={true}
                        onPress={handleLocationSelect}
                        query={{
                            key: GOOGLE_MAPS_APIKEY,
                            language: 'en',
                        }}
                        styles={{
                            container: {
                                flex: 0,
                                padding: 20,
                            },
                            textInput: {
                                fontSize: 16,
                                backgroundColor: '#f3f4f6',
                                borderRadius: 8,
                            },
                            listView: {
                                maxHeight: '80%',
                            }
                        }}
                    />
                </View>
            </Modal>
        </View>
    );
};

export default NavFavorites;