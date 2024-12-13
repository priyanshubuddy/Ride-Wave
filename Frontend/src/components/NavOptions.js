import React from "react";
import { Text, View, FlatList, TouchableOpacity, Image, ToastAndroid } from "react-native";
import { Icon } from "react-native-elements";
import tw from "tailwind-react-native-classnames";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { selectOrigin } from "../redux/slices/navSlice";

const data = [
  {
    id: "123",
    title: "Get a Ride",
    image:
      "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,w_485,h_385/f_auto,q_auto/products/carousel/UberX.png",
    screen: "MapScreen",
  },
  {
    id: "456",
    title: "Order Food",
    image:
      "https://i.pinimg.com/originals/4f/eb/74/4feb745209cf7aba57463b20d27b61e3.png",
    screen: "EatsScreen",
  },
];

const NavOptions = () => {
  const navigation = useNavigation();
  const origin = useSelector(selectOrigin);

  const handlePress = (item) => {
    if (!origin?.location) {
      ToastAndroid.show("Please select a pickup location", ToastAndroid.SHORT);
      return;
    }
    
    if (item.title === "Order Food") {
      ToastAndroid.show("Order Food is coming soon", ToastAndroid.SHORT);
      return;
    }
    
    navigation.navigate(item.screen);
  };

  return (
    <FlatList
      data={data}
      horizontal
      keyExtractor={(item) => item.id}
      contentContainerStyle={tw`justify-evenly w-full`}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => handlePress(item)}
          style={[
            tw`p-4 bg-gray-100 m-2 rounded-lg shadow-md`,
            { height: 300 },
          ]}
        >
          <View style={tw`${!origin && "opacity-50"}`}>
            <Image
              style={{ width: 130, height: 130, resizeMode: "contain", borderRadius: 10 }}
              source={{ uri: item.image }}
            />
            <Text style={tw`mt-3 text-xl font-bold text-center`}>{item.title}</Text>
            <Icon
              style={tw`p-3 bg-black rounded-full w-12 mt-5 self-center`}
              name="arrowright"
              type="antdesign"
              color="white"
            />
          </View>
        </TouchableOpacity>
      )}
    />
  );
};

export default NavOptions;
