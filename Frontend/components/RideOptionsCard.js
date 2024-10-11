import React, { useState } from "react";
import {
    Image,
    SafeAreaView,
    Text,
    View,
    TouchableOpacity,
    FlatList,
    Alert,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import { Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import {
    selectDestination,
    selectOrigin,
    selectTravelTimeInformation,
} from "../src/redux/slices/navSlice";

// Data with updated car names and images
const data = [
    {
        id: "Standard-123",
        title: "Standard Car",
        multiplier: 1,
        image:
            "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,w_485,h_385/f_auto,q_auto/products/carousel/UberX.png",
    },
    {
        id: "Large-456",
        title: "Large Car",
        multiplier: 1.2,
        image:
            "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,w_485,h_385/f_auto,q_auto/products/carousel/UberXL.png",
    },
    {
        id: "Luxury-789",
        title: "Luxury Car",
        multiplier: 1.75,
        image:
            "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,w_485,h_385/f_auto,q_auto/products/carousel/Lux.png",
    },
];

// Surge rate
const SURGE_CHARGE_RATE = 1.5;

const RideOptionsCard = () => {
    const navigation = useNavigation();
    const [selected, setSelected] = useState(null);
    const travelTimeInformation = useSelector(selectTravelTimeInformation);
    const origin = useSelector(selectOrigin);
    const destination = useSelector(selectDestination);

    const onBookRide = () => {
        if (!selected) {
            Alert.alert("Please select a ride option.");
            return;
        }

        navigation.navigate("ConfirmationScreen", {
            selected,
            travelTimeInformation,
            origin,
            destination,
        });
    };

    return (
        <SafeAreaView style={tw`bg-white flex-1`}>
            <View>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={tw`absolute top-3 left-5 p-3 rounded-full`}
                >
                    <Icon name="chevron-left" type="fontawesome" />
                </TouchableOpacity>
                <Text style={tw`text-center py-5 text-xl`}>
                    Select a Ride - {travelTimeInformation?.distance?.text}
                </Text>
            </View>

            <View style={{ flex: 1 }}>
                <FlatList
                    data={data}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item: { id, title, image, multiplier }, item }) => (
                        <TouchableOpacity
                            onPress={() => setSelected(item)}
                            style={tw`flex-row justify-between px-10 ${id === selected?.id && "bg-gray-200"
                                }`}
                        >
                            <Image
                                style={{
                                    width: 100,
                                    height: 100,
                                    resizeMode: "contain",
                                }}
                                source={{ uri: image }}
                            />

                            <View style={tw`-ml-6`}>
                                <Text style={tw`text-xl font-semibold`}>{title}</Text>
                                <Text>{travelTimeInformation?.duration?.text} travel time</Text>
                            </View>
                            <Text style={tw`text-xl`}>
                                {new Intl.NumberFormat("en-gb", {
                                    style: "currency",
                                    currency: "GBP",
                                }).format(
                                    (travelTimeInformation?.duration.value *
                                        SURGE_CHARGE_RATE *
                                        multiplier) /
                                    100
                                )}
                            </Text>
                        </TouchableOpacity>
                    )}
                />
            </View>

            <View style={tw`mt-auto border-t border-gray-200`}>
                <TouchableOpacity
                    onPress={onBookRide}
                    disabled={!selected}
                    style={tw`bg-black py-3 m-3 ${!selected && "bg-gray-300"}`}
                >
                    <Text style={tw`text-center text-white text-xl`}>
                        Choose {selected?.title}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default RideOptionsCard;
