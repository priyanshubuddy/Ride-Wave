import React from "react";
import { Text, View, FlatList, TouchableOpacity, Image, ToastAndroid } from "react-native";
import { Icon } from "react-native-elements/dist/icons/Icon";
import tw from "tailwind-react-native-classnames";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { selectOrigin } from "../src/redux/slices/navSlice";

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
    if (item.title === "Order Food") {
      ToastAndroid.show("Order Food is coming soon", ToastAndroid.SHORT);
    } else {
      navigation.navigate(item.screen);
    }
  };

  return (
    <FlatList
      data={data}
      horizontal={true}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ paddingHorizontal: 10, justifyContent: 'space-between', width: '100%' }}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => handlePress(item)}
          style={[
            tw`p-1 pl-4 pb-6 pt-3 bg-gray-200 m-2`,
            { width: 140, height: 280 },
          ]}
          disabled={!origin}
        >
          <View style={tw`${!origin && "opacity-20"}`}>
            <Image
              style={{ width: 120, height: 120, resizeMode: "contain" }}
              source={{ uri: item.image }}
            />
            <Text style={tw`mt-2 text-lg font-semibold`}>{item.title}</Text>
            <Icon
              style={tw`p-2 bg-black rounded-full w-10 mt-4`}
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
