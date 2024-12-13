import React, { useEffect, useRef } from "react";
import MapView, { Marker, Polyline } from "react-native-maps";
import { useSelector, useDispatch } from "react-redux";
import tw from "tailwind-react-native-classnames";
import {
  selectOrigin,
  selectDestination,
  setTravelTimeInformation,
} from "../redux/slices/navSlice";
import MapViewDirections from "react-native-maps-directions";
import { GOOGLE_MAPS_APIKEY } from "../../config.json";
import OriginMarker from "../../assets/origin-marker";
import DestinationMarker from "../../assets/destination-marker";
import { View, Platform, StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const Map = () => {
  const origin = useSelector(selectOrigin);
  const destination = useSelector(selectDestination);
  const mapRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!origin) return;

    if (origin && destination) {
      if (mapRef.current) {
        try {
          mapRef.current.fitToCoordinates(
            [
              {
                latitude: Number(origin.location.lat),
                longitude: Number(origin.location.lng),
              },
              {
                latitude: Number(destination.location.lat),
                longitude: Number(destination.location.lng),
              },
            ],
            {
              edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
              animated: true,
            }
          );
          getTravelTime();
        } catch (error) {
          console.error("Error fitting coordinates:", error);
        }
      }
    } else {
      mapRef.current?.animateToRegion({
        latitude: Number(origin.location.lat),
        longitude: Number(origin.location.lng),
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      }, 1000);
    }
  }, [origin, destination]);

  const getTravelTime = async () => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${origin.location.lat},${origin.location.lng}&destinations=${destination.location.lat},${destination.location.lng}&key=${GOOGLE_MAPS_APIKEY}`
      );
      const data = await response.json();
      console.log("Travel time data:", data);
      
      if (data.status === "OK" && data.rows[0]?.elements[0]) {
        dispatch(setTravelTimeInformation(data.rows[0].elements[0]));
      } else {
        console.warn("Invalid travel time data:", data);
        dispatch(setTravelTimeInformation({
          distance: { text: "Unknown", value: 0 },
          duration: { text: "Unknown", value: 0 },
          status: "ZERO_RESULTS"
        }));
      }
    } catch (error) {
      console.error("Error calculating travel time:", error);
      dispatch(setTravelTimeInformation({
        distance: { text: "Unknown", value: 0 },
        duration: { text: "Unknown", value: 0 },
        status: "ERROR"
      }));
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: Number(origin?.location?.lat) || 23.2525592,
          longitude: Number(origin?.location?.lng) || 77.4651778,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
      >
        {origin?.location && destination?.location && (
          <MapViewDirections
            origin={{
              latitude: Number(origin.location.lat),
              longitude: Number(origin.location.lng),
            }}
            destination={{
              latitude: Number(destination.location.lat),
              longitude: Number(destination.location.lng),
            }}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={3}
            strokeColor="black"
            onError={(error) => console.error("Directions Error:", error)}
          />
        )}

        {origin?.location && (
          <Marker
            coordinate={{
              latitude: Number(origin.location.lat),
              longitude: Number(origin.location.lng),
            }}
            title="Origin"
            description={origin.description}
          >
            <View style={styles.markerWrapper}>
              <OriginMarker height={40} />
            </View>
          </Marker>
        )}

        {destination?.location && (
          <Marker
            coordinate={{
              latitude: Number(destination.location.lat),
              longitude: Number(destination.location.lng),
            }}
            title="Destination"
            description={destination.description}
          >
            <View style={styles.markerWrapper}>
              <DestinationMarker height={40} />
            </View>
          </Marker>
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    flex: 1,
  },
  markerWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    ...Platform.select({
      ios: {
        zIndex: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
});

export default Map;
