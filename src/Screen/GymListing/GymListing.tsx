import {Platform, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useState} from 'react';
import {PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import {useFocusEffect} from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const GymListing = () => {
  const [locationP, setLocationP] = useState(false);
  useFocusEffect(
    useCallback(() => {
      locationPermission();
    }, []),
  );
  const locationPermission = () => {
    Platform.OS == 'ios'
      ? request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then(result => {
          if (result === RESULTS.GRANTED) {
            console.log('Location permission granted');
            setLocationP(true);
          } else {
            setLocationP(false);
            console.log('Location permission denied');
          }
        })
      : request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(result => {
          if (result === RESULTS.GRANTED) {
            console.log('Location permission granted');
            setLocationP(true);
          } else {
            setLocationP(false);
            console.log('Location permission denied');
          }
        });
  };
  return (
    <SafeAreaView style={{}} >
      <Text>GymListing</Text>
    </SafeAreaView>
  );
};

export default GymListing;

const styles = StyleSheet.create({});
