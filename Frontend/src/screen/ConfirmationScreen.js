import React from "react";
import { SafeAreaView, Text, TouchableOpacity, Share, View, Image } from "react-native";
import tw from "tailwind-react-native-classnames";
import { useNavigation } from "@react-navigation/native";

const ConfirmationScreen = ({ route }) => {
    const navigation = useNavigation();
    const { selected, travelTimeInformation, fare } = route.params || {};

    // Add null checks
    if (!selected || !travelTimeInformation) {
        return (
            <SafeAreaView style={tw`flex-1 bg-white`}>
                <View style={tw`flex-1 justify-center items-center`}>
                    <Text style={tw`text-xl text-red-500`}>Invalid booking data</Text>
                    <TouchableOpacity
                        style={tw`bg-black py-3 px-6 rounded-full mt-4`}
                        onPress={() => navigation.navigate("HomeScreen")}
                    >
                        <Text style={tw`text-white text-lg`}>Go to Home</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    const shareRideStatus = () => {
        const message = `🚗 Ride Booking Confirmed 🎉\n\n`
            + `🚘 Vehicle: ${selected.title}\n`
            + `📍 From: ${travelTimeInformation.origin_addresses?.[0] || 'N/A'}\n`
            + `📍 To: ${travelTimeInformation.destination_addresses?.[0] || 'N/A'}\n`
            + `⏱️ Estimated Travel Time: ${travelTimeInformation.duration?.text || 'N/A'}\n`
            + `💰 Total Fare: ₹${fare}\n\n`
            + `Enjoy your ride! 🌟`;

        Share.share({
            message: message,
        })
            .then((result) => console.log(result))
            .catch((error) => console.log(error));
    };

    return (
        <SafeAreaView style={tw`flex-1 bg-white`}>
            <View style={tw`flex-1 justify-center items-center`}>
                <Text style={tw`text-3xl font-bold text-center mb-4`}>Booking Confirmed!</Text>
                <View style={tw`bg-gray-100 rounded-lg p-4 mb-4 w-11/12`}>
                    <Image
                        source={{ uri: selected.image }}
                        style={[tw`w-40 h-40 mb-2`, { alignSelf: 'center' }]}
                        resizeMode="contain"
                    />
                    <Text style={tw`text-xl font-semibold text-center mb-1`}>{selected.title}</Text>
                    <Text style={tw`text-sm text-center text-gray-500 mb-2`}>
                        {travelTimeInformation.duration?.text || 'N/A'} travel time
                    </Text>
                    <Text style={tw`text-center text-gray-500 mb-1`}>
                        Distance: {(travelTimeInformation.distance?.value / 1000).toFixed(1)} km
                    </Text>
                    <Text style={tw`text-center text-gray-500 mb-1`}>
                        Fare: ₹{fare}
                    </Text>
                </View>
                <TouchableOpacity
                    style={tw`bg-black py-3 px-6 rounded-full mb-4`}
                    onPress={() => navigation.navigate("HomeScreen")}
                >
                    <Text style={tw`text-white text-lg`}>Go to Home</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={tw`border border-gray-500 py-2 px-4 rounded-md`}
                    onPress={shareRideStatus}
                >
                    <Text style={tw`text-gray-500`}>Share Ride Status</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default ConfirmationScreen;
