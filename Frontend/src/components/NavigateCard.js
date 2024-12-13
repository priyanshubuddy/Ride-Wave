import React from "react";
import {
    SafeAreaView,
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    ToastAndroid,
    ScrollView,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GOOGLE_MAPS_APIKEY } from "../../config.json";
import { useDispatch } from "react-redux";
import { setDestination } from "../redux/slices/navSlice";
import { useNavigation } from "@react-navigation/native";
import { Icon } from "react-native-elements";
import NavFavorites from "./NavFavorites";

const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 12) return "Good Morning";
    if (currentHour >= 12 && currentHour < 17) return "Good Afternoon";
    if (currentHour >= 17 && currentHour < 21) return "Good Evening";
    return "Good Night";
};

const NavigateCard = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const greeting = getGreeting();

    const handleDestinationSelect = (data, details = null) => {
        if (details?.geometry?.location) {
            dispatch(
                setDestination({
                    location: {
                        lat: details.geometry.location.lat,
                        lng: details.geometry.location.lng,
                    },
                    description: data.description,
                })
            );
            navigation.navigate("RideOptionsCard");
        }
    };

    const handleFavoriteSelect = (favorite) => {
        if (favorite?.coordinates) {
            dispatch(
                setDestination({
                    location: {
                        lat: favorite.coordinates.lat,
                        lng: favorite.coordinates.lng,
                    },
                    description: favorite.description,
                })
            );
            navigation.navigate("RideOptionsCard");
        }
    };

    return (
        <SafeAreaView style={tw`bg-white flex-1`}>
            <Text style={tw`text-center py-5 text-xl font-semibold`}>{greeting}</Text>
            
            <ScrollView style={tw`flex-1`} bounces={false}>
                <View style={tw`border-t border-gray-200`}>
                    <View style={tw`px-4 py-2`}>
                        <Text style={{ fontSize: 16, color: '#0009' }}>Where to?</Text>
                        <GooglePlacesAutocomplete
                            placeholder="Tell us where you want to go?"
                            styles={toInputBoxStyles}
                            fetchDetails={true}
                            returnKeyType={"search"}
                            minLength={2}
                            onPress={handleDestinationSelect}
                            enablePoweredByContainer={false}
                            query={{
                                key: GOOGLE_MAPS_APIKEY,
                                language: "en",
                            }}
                            nearbyPlacesAPI="GooglePlacesSearch"
                            debounce={400}
                        />
                    </View>
                    <View style={tw`px-4`}>
                        <NavFavorites onSelect={handleFavoriteSelect} />
                    </View>
                </View>
            </ScrollView>

            <View
                style={tw`flex-row bg-white justify-evenly py-2 border-t border-gray-100`}
            >
                <TouchableOpacity
                    onPress={() => navigation.navigate("RideOptionsCard")}
                    style={tw`flex flex-row justify-between bg-black w-24 px-4 py-3 rounded-full`}
                >
                    <Icon name="car" type="font-awesome" color="white" size={16} />
                    <Text style={tw`text-white text-center`}>Rides</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => ToastAndroid.show("Eats is coming soon", ToastAndroid.SHORT)}
                    style={tw`flex flex-row justify-between w-24 px-4 py-3 rounded-full`}
                >
                    <Icon
                        name="fast-food-outline"
                        type="ionicon"
                        color="black"
                        size={16}
                    />
                    <Text style={tw`text-center`}>Eats</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default NavigateCard;

const toInputBoxStyles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        paddingTop: 10,
        flex: 0,
    },
    textInput: {
        backgroundColor: "#f8f9fa",
        borderRadius: 8,
        fontSize: 16,
        color: 'black',
    },
    textInputContainer: {
        paddingBottom: 0,
    },
});