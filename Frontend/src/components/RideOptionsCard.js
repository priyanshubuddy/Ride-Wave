import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    TouchableOpacity,
    FlatList,
    Image,
    Alert,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { selectTravelTimeInformation } from "../redux/slices/navSlice";

const data = [
    {
        id: "bike-123",
        title: "Bike",
        multiplier: 1.0,
        image: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_384,w_576/v1648178001/assets/c2/362140-9bdc-43ac-b149-d73610fcd9b2/original/Uber_Moto_558x372_pixels_Desktop.png",
        basePrice: 20,
        perKm: 10,
        perMin: 1,
        capacity: "1 person",
        serviceFee: 5,
        insuranceFee: 2
    },
    {
        id: "auto-456", 
        title: "Auto",
        multiplier: 1.2,
        image: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_350,w_350/v1597151228/assets/fc/101ff8-81a1-46c3-995a-67b4bbd2f2bf/original/TukTuk.jpg",
        basePrice: 30,
        perKm: 15,
        perMin: 1.5,
        capacity: "3 people",
        serviceFee: 8,
        insuranceFee: 3
    },
    {
        id: "mini-789",
        title: "Mini",
        multiplier: 1.5,
        image: "https://links.papareact.com/3pn",
        basePrice: 45,
        perKm: 18,
        perMin: 2,
        capacity: "4 people",
        serviceFee: 10,
        insuranceFee: 5
    },
    {
        id: "prime-101",
        title: "Prime Sedan",
        multiplier: 1.75,
        image: "https://links.papareact.com/5w8",
        basePrice: 55,
        perKm: 22,
        perMin: 2.5,
        capacity: "4 people",
        serviceFee: 15,
        insuranceFee: 8
    },
    {
        id: "suv-102",
        title: "Prime SUV",
        multiplier: 2.0,
        image: "https://links.papareact.com/7pf",
        basePrice: 65,
        perKm: 28,
        perMin: 3,
        capacity: "6 people",
        serviceFee: 20,
        insuranceFee: 10
    },
];

const RideOptionsCard = () => {
    const navigation = useNavigation();
    const [selected, setSelected] = useState(null);
    const travelTimeInformation = useSelector(selectTravelTimeInformation);

    const calculatePrice = (basePrice, perKm, perMin, multiplier, serviceFee, insuranceFee) => {
        if (!travelTimeInformation) return 0;

        const distanceInKm = travelTimeInformation.distance?.value / 1000;
        const timeInMin = travelTimeInformation.duration?.value / 60;

        // Base calculation
        const baseFare = basePrice;
        const distanceFare = distanceInKm * perKm;
        const timeFare = timeInMin * perMin;
        
        // Add peak hour surcharge (1.2x) between 8-10 AM and 5-7 PM
        const hour = new Date().getHours();
        const isPeakHour = (hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 19);
        const peakMultiplier = isPeakHour ? 1.2 : 1;

        // Add night charge (1.25x) between 11 PM and 5 AM
        const isNightTime = hour >= 23 || hour <= 5;
        const nightMultiplier = isNightTime ? 1.25 : 1;

        // Calculate subtotal with all multipliers
        const subtotal = (baseFare + distanceFare + timeFare) * multiplier * peakMultiplier * nightMultiplier;

        // Add fixed charges
        const totalWithFees = subtotal + serviceFee + insuranceFee;

        // Add GST (5%)
        const gst = totalWithFees * 0.05;
        
        return Math.round(totalWithFees + gst);
    };

    const formatDistance = (distance) => {
        if (!distance?.value) return "N/A";
        const km = (distance.value / 1000).toFixed(1);
        return `${km} km`;
    };

    const handleConfirm = () => {
        if (!selected || !travelTimeInformation) {
            Alert.alert("Error", "Please select a ride and ensure route is calculated");
            return;
        }
        
        navigation.navigate("RideConfirmationScreen", {
            selected,
            travelTimeInformation,
            fare: calculatePrice(
                selected.basePrice,
                selected.perKm,
                selected.perMin,
                selected.multiplier,
                selected.serviceFee,
                selected.insuranceFee
            )
        });
    };

    return (
        <SafeAreaView style={tw`bg-white flex-1`}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.navigate("NavigateCard")}
                    style={tw`absolute z-50 p-3 rounded-full`}
                >
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={tw`text-center text-xl font-bold flex-1`}>
                    Select a Ride • {formatDistance(travelTimeInformation?.distance)}
                </Text>
            </View>

            <FlatList
                data={data}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => setSelected(item)}
                        style={[
                            styles.rideOption,
                            item.id === selected?.id && styles.selectedRide
                        ]}
                    >
                        <Image
                            style={styles.rideImage}
                            source={{ uri: item.image }}
                        />
                        <View style={styles.rideDetails}>
                            <View>
                                <Text style={styles.rideTitle}>{item.title}</Text>
                                <Text style={styles.rideCapacity}>{item.capacity}</Text>
                                <Text style={styles.rideTime}>
                                    {travelTimeInformation?.duration?.text} • {formatDistance(travelTimeInformation?.distance)}
                                </Text>
                            </View>
                            <View style={styles.priceContainer}>
                                <Text style={styles.price}>
                                    ₹{calculatePrice(item.basePrice, item.perKm, item.perMin, item.multiplier, item.serviceFee, item.insuranceFee)}
                                </Text>
                                <Text style={styles.basePrice}>Base: ₹{item.basePrice}</Text>
                                <Text style={[styles.basePrice, {fontWeight: 'bold'}]}>Per Km: ₹{item.perKm}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
            />

            <View style={styles.confirmButtonContainer}>
                <TouchableOpacity
                    disabled={!selected}
                    onPress={handleConfirm}
                    style={[
                        styles.confirmButton,
                        !selected && styles.disabledButton
                    ]}
                >
                    <Text style={styles.confirmButtonText}>
                        {selected ? `Confirm ${selected.title}` : 'Select a ride type'}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    rideOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    selectedRide: {
        backgroundColor: '#f3f4f6',
    },
    rideImage: {
        width: 70,
        height: 70,
        resizeMode: 'contain',
    },
    rideDetails: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginLeft: 15,
    },
    rideTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    rideCapacity: {
        color: '#6b7280',
        marginTop: 2,
    },
    rideTime: {
        color: '#6b7280',
        marginTop: 2,
    },
    priceContainer: {
        alignItems: 'flex-end',
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    basePrice: {
        color: '#6b7280',
        fontSize: 12,
    },
    confirmButtonContainer: {
        padding: 15,
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
    },
    confirmButton: {
        backgroundColor: 'black',
        padding: 15,
        borderRadius: 8,
    },
    disabledButton: {
        backgroundColor: '#d1d5db',
    },
    confirmButtonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default RideOptionsCard;
