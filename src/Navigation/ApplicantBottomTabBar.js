import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
} from 'react-native';
import React from 'react';
import {AppColor} from '../Component/Color';
import {DeviceHeigth, DeviceWidth} from '../Component/Config';
import {localImage} from '../Component/Image';

const ApplicantBottomTabBar = ({state, descriptors, navigation}) => {
  const getScreen = (name, focus) => {
    if (name == 'Home' && focus == true) {
      return (
        <Image
          source={localImage.Home}
          style={styles.bellImage}
          resizeMode="contain"
        />
      );
    } else if (name == 'Home' && focus == false) {
      return (
        <Image
          source={localImage.Home1}
          style={styles.bellImage}
          resizeMode="contain"
        />
      );
    } else if (name == 'Workouts' && focus == true) {
      return (
        <Image
          source={localImage.Workout}
          style={styles.bellImage}
          resizeMode="contain"
        />
      );
    } else if (name == 'Workouts' && focus == false) {
      return (
        <Image
          source={localImage.Workout1}
          style={styles.bellImage}
          resizeMode="contain"
        />
      );
    } else if (name == 'Diets' && focus == true) {
      return (
        <Image
          source={localImage.Diets}
          style={styles.bellImage}
          resizeMode="contain"
        />
      );
    } else if (name == 'Diets' && focus == false) {
      return (
        <Image
          source={localImage.Diets1}
          style={styles.bellImage}
          resizeMode="contain"
        />
      );
    } else if (name == 'Store' && focus == true) {
      return (
        <Image
          source={localImage.Sttore}
          style={styles.bellImage}
          resizeMode="contain"
        />
      );
    } else if (name == 'Store' && focus == false) {
      return (
        <Image
          source={localImage.Sttore1}
          style={styles.bellImage}
          resizeMode="contain"
        />
      );
    } else if (name == 'Profile' && focus == false) {
      return (
        <Image
          source={localImage.Profile1}
          style={styles.bellImage}
          resizeMode="contain"
        />
      );
    } else if (name == 'Profile' && focus == true) {
      return (
        <Image
          source={localImage.Profile}
          style={styles.bellImage}
          resizeMode="contain"
        />
      );
    }
  };
  return (
    <View style={styles.tabContainer}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const icon = options.tabBarIcon
          ? options.tabBarIcon({focused: isFocused})
          : null;

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={[styles.tabButton, {width: DeviceWidth / 3}]}>
            <View
              style={{
                height: 30,
                width: 50,
                borderRadius: 20,
                alignItems: 'center',
                justifyContent: 'center',
                padding: 10,
              }}>
              {getScreen(route.name, isFocused)}
              {/* {route.name == 'Home' ? (
                <Image
                  source={localImage.Home}
                  style={styles.bellImage}
                  resizeMode="contain"
                />
              ) : route.name == 'Workouts' ? (
                <Image
                source={localImage.Workout}
                style={styles.bellImage}
                resizeMode="contain"
              />
              ) : route.name == 'Diets' ? (
                <Image
                source={localImage.Diets}
                style={styles.bellImage}
                resizeMode="contain"
              />
              ) :route.name == 'Diets' ? (
                <Image
                source={localImage.Diets}
                style={styles.bellImage}
                resizeMode="contain"
              />):null} */}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    height: 80,
    //elevation: 8,
    backgroundColor: AppColor.WHITE,
    paddingBottom:
      Platform.OS == 'ios'
        ? DeviceHeigth <= 667 // iPhone SE and lower
          ? 0
          : DeviceHeigth <= 812 // iPhone 6/7/8 Plus
          ? 0
          : 20 // iPhone X and higher
        : DeviceWidth <= 375 // Android devices with height <= 640
        ? 0
        : 0,

 
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
        shadowOffset: {width: -2, height: 4},
        shadowOpacity: 0.5,
        shadowRadius: 3,
        elevation: 20,
        shadowColor: '#000000',
      },
   
    
     }),
     
    
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bellImage: {
    width: 50,
    height: 50,

  },
});

export default ApplicantBottomTabBar;
