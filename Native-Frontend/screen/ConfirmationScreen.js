import React from "react";
import { SafeAreaView, Text, TouchableOpacity, Share, View, Image } from "react-native";
import tw from "tailwind-react-native-classnames";
import { useNavigation } from "@react-navigation/native";

const ConfirmationScreen = ({ route }) => {
    const navigation = useNavigation();
    const { selected, travelTimeInformation, origin, destination } = route.params;
    console.log(selected, travelTimeInformation, origin, destination)

    const shareRideStatus = () => {
        const message = `🚗 Ride Booking Confirmed 🎉\n\n`
            + `🚘 Vehicle: ${selected.title}\n`
            + `📍 From: ${origin.description}\n`
            + `📍 To: ${destination.description}\n`
            + `⏱️ Estimated Travel Time: ${travelTimeInformation.duration.text}\n\n`
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
                <View style={tw`bg-gray-100 rounded-lg p-4 mb-4`}>
                    <Image
                        source={{ uri: selected.image }}
                        style={[tw`w-40 h-40 mb-2`, {alignSelf: 'center'}]}
                        resizeMode="contain"
                    />
                    <Text style={tw`text-xl font-semibold text-center mb-1`}>{selected.title}</Text>
                    <Text style={tw`text-sm text-center text-gray-500 mb-2`}>
                        {travelTimeInformation.duration.text} travel time
                    </Text>
                    <Text style={tw`text-center text-gray-500`}>
                        From: {origin.description}
                    </Text>
                    <Text style={tw`text-center text-gray-500`}>
                        To: {destination.description}
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
