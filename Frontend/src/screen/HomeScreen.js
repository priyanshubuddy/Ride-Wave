import React, { useEffect } from "react";
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity } from "react-native";
import tw from "tailwind-react-native-classnames";
import NavOptions from "../components/NavOptions";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GOOGLE_MAPS_APIKEY } from '../../config.json';
import { useDispatch } from "react-redux";
import { setOrigin, setDestination } from "../redux/slices/navSlice";
import NavFavorites from "../components/NavFavorites";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import 'react-native-get-random-values';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  // Reset origin when screen is focused
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      dispatch(setOrigin(null));
      dispatch(setDestination(null));
    });

    return unsubscribe;
  }, [navigation]);

  const handlePress = (data, details = null) => {
    if (details?.geometry?.location) {
      dispatch(
        setOrigin({
          location: {
            lat: details.geometry.location.lat,
            lng: details.geometry.location.lng,
          },
          description: data.description,
        })
      );
      dispatch(setDestination(null));
      console.log("Origin set:", details.geometry.location);
    } else {
      console.error("No location details found");
      Alert.alert("Error", "Could not get location details. Please try again.");
    }
  };

  const handleError = (error) => {
    console.error("Error: ", error);
    Alert.alert("Error", "Something went wrong. Please try again.");
  };

  const handleFavoriteSelect = async (favorite) => {
    if (favorite?.coordinates) {
      dispatch(
        setOrigin({
          location: {
            lat: favorite.coordinates.lat,
            lng: favorite.coordinates.lng,
          },
          description: favorite.description,
        })
      );
      dispatch(setDestination(null));
      
      navigation.navigate("MapScreen");
    }
  };

  return (
    <SafeAreaView style={tw`bg-white h-full pt-5`}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <TouchableOpacity
            onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
            style={styles.menuButton}
          >
            <Ionicons name="menu" size={28} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>Ride Wave</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>
      <View style={tw`flex-1`}>
        <GooglePlacesAutocomplete
          placeholder="Where From?"
          debounce={400}
          styles={{
            container: {
              flex: 0,
              paddingHorizontal: 20,
              marginTop: 5,
            },
            textInput: {
              fontSize: 18,
              backgroundColor: '#f8f9fa',
              borderRadius: 8,
              paddingVertical: 12,
            },
            textInputContainer: {
              paddingHorizontal: 0,
            },
          }}
          returnKeyType={"search"}
          enablePoweredByContainer={false}
          minLength={2}
          query={{
            key: GOOGLE_MAPS_APIKEY,
            language: "en",
          }}
          onPress={handlePress}
          fetchDetails={true}
          onFail={handleError}
          listViewDisplayed="auto"
          nearbyPlacesAPI="GooglePlacesSearch"
        />
        <NavOptions />
        <View style={tw`flex-shrink`}>
          <NavFavorites onSelect={handleFavoriteSelect} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuButton: {
    marginRight: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
  },
  notificationButton: {
    padding: 5,
  },
});

export default HomeScreen;
