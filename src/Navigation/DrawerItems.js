import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  BackHandler,
  SafeAreaView,
} from 'react-native';
import React, {useEffect, useContext} from 'react';
import {DrawerContentScrollView} from '@react-navigation/drawer';
import {localImage} from '../Component/Image';

import {DeviceHeigth, DeviceWidth} from '../Component/Config';
import {Logo} from '../Component/logo';

const DrawerItems = props => {
  const DrawerList = [
    'Workouts',
    'Exercises',
    'Diets',
    'Store',
    'Blog',
    'Profile',
    'Favorites',
    'Settings',
  ];
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackButton,
    );

    return () => backHandler.remove();
  }, []);
  const handleBackButton = () => {
    return true;
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        marginLeft: (DeviceWidth * 5) / 100,
        backgroundColor: '#fff',
      }}>
      <DrawerContentScrollView {...props}>
        <Logo />
        <TouchableOpacity
          style={styles.buttons}
          //   onPress={() => {
          //     props.navigation.navigate('Workouts');
          //   }}
        >
          <Text style={[styles.Text, {color: '#000'}]}>Workouts</Text>
          <Image source={localImage.nextButton} style={styles.nextIcon} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttons}
          //   onPress={() => {
          //     props.navigation.navigate('Exercises');
          //   }}
        >
          <Text style={[styles.Text, {color: '#000'}]}>Exercises</Text>
          <Image source={localImage.nextButton} style={styles.nextIcon} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttons}
          //   onPress={() => {
          //     props.navigation.navigate('Diets');
          //   }}
        >
          <Text style={[styles.Text, {color: '#000'}]}>Diets</Text>
          <Image source={localImage.nextButton} style={styles.nextIcon} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttons}
          //   onPress={() => {
          //     props.navigation.navigate('Store');
          //   }}
        >
          <Text style={[styles.Text, {color: '#000'}]}>Store</Text>
          <Image source={localImage.nextButton} style={styles.nextIcon} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttons}
          //   onPress={() => {
          //     props.navigation.navigate('Blog');
          //   }}
        >
          <Text style={[styles.Text, {color: '#000'}]}>Blog</Text>
          <Image source={localImage.nextButton} style={styles.nextIcon} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttons}
          //   onPress={() => {
          //     props.navigation.navigate('Profile');
          //   }}
        >
          <Text style={[styles.Text, {color: '#000'}]}>Profile</Text>
          <Image source={localImage.nextButton} style={styles.nextIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttons}>
          <Text style={[styles.Text, {color: '#000'}]}>Favorites</Text>
          <Image source={localImage.nextButton} style={styles.nextIcon} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttons}
          //   onPress={() => {
          //     props.navigation.navigate('Settings');
          //   }}
        >
          <Text style={[styles.Text, {color: '#000'}]}>Settings </Text>
          <Image source={localImage.nextButton} style={styles.nextIcon} />
        </TouchableOpacity>
      </DrawerContentScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  buttons: {
    paddingTop: (DeviceWidth * 3) / 100,
    paddingBottom: (DeviceWidth * 3) / 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: (DeviceWidth * 3) / 100,
  },
  Text: {
    color: 'black',
    fontSize: 16,
    fontWeight: '400',
  },
  nextIcon: {
    tintColor: 'gray',
    resizeMode: 'contain',
    height: (DeviceHeigth * 1.5) / 100,
  },
});
export default DrawerItems;
