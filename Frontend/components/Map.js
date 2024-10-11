import React, { useEffect, useRef } from "react";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import tw from "tailwind-react-native-classnames";
import { useSelector, useDispatch } from "react-redux";
import { selectOrigin, selectDestination, setTravelTimeInformation } from "../src/redux/slices/navSlice";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { GOOGLE_MAPS_APIKEY } from "../config.json";

export default function Map() {
  const origin = useSelector(selectOrigin);
  const destination = useSelector(selectDestination);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const mapRef = useRef(null);

  useEffect(() => {
    if (!origin || !destination) return;
    mapRef.current.fitToSuppliedMarkers(["origin", "destination"], {
      edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
    });
  }, [origin, destination]);

  useEffect(() => {
    let isMounted = true;

    if (!origin || !destination) return;
    const getTravelTime = async () => {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${origin.description}&destinations=${destination.description}&key=${GOOGLE_MAPS_APIKEY}`
        );
        const data = await response.json();
        console.log(data, 'distance matrix')
        if (data.status === "OK" && isMounted) {
          dispatch(setTravelTimeInformation(data.rows[0].elements[0]));
        } else {
          console.error("Distance Matrix API error:", data.error_message);
          // Manually calculate travel time if API fails
          const distance = calculateDistance(origin.location, destination.location);
          const travelTime = calculateTravelTime(distance);
          dispatch(setTravelTimeInformation({ distance: { value: distance }, duration: { value: travelTime } }));
        }
      } catch (error) {
        console.error("Failed to fetch travel time:", error);
        // Manually calculate travel time if API fails
        const distance = calculateDistance(origin.location, destination.location);
        const travelTime = calculateTravelTime(distance);
        dispatch(setTravelTimeInformation({ distance: { value: distance }, duration: { value: travelTime } }));
      }
    };

    getTravelTime();

    return () => {
      isMounted = false;
    };
  }, [origin, destination, dispatch]);

  useEffect(() => {
    if (!origin) {
      Alert.alert("Ops!", "Informe a origem antes de prosseguir!");
      navigation.goBack();
    }
  }, [origin, navigation]);

  const calculateDistance = (origin, destination) => {
    const R = 6371e3; // metres
    const φ1 = origin.lat * Math.PI/180; // φ, λ in radians
    const φ2 = destination.lat * Math.PI/180;
    const Δφ = (destination.lat-origin.lat) * Math.PI/180;
    const Δλ = (destination.lng-origin.lng) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    const distance = R * c; // in metres
    return distance;
  };

  const calculateTravelTime = (distance) => {
    const averageSpeed = 50 * 1000 / 60; // 50 km/h in meters per minute
    const travelTime = distance / averageSpeed; // in minutes
    return travelTime;
  };

  return (
    <MapView
      ref={mapRef}
      style={tw`flex-1`}
      mapType="mutedStandard"
      initialRegion={{
        latitude: origin ? origin.location.lat : 0,
        longitude: origin ? origin.location.lng : 0,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }}
    >
      {origin && destination && (
        <MapViewDirections
          origin={origin.description}
          destination={destination.description}
          apikey={GOOGLE_MAPS_APIKEY}
          strokeWidth={3}
          strokeColor="black"
        />
      )}

      {origin?.location && (
        <Marker
          coordinate={{
            latitude: origin.location.lat,
            longitude: origin.location.lng,
          }}
          title="Origin"
          description={origin.description}
          identifier="origin"
        />
      )}

      {destination?.location && (
        <Marker
          coordinate={{
            latitude: destination.location.lat,
            longitude: destination.location.lng,
          }}
          title="Destination"
          description={destination.description}
          identifier="destination"
          pinColor="#94DDF8"
        />
      )}
    </MapView>
  );
}
