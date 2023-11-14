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
import {useSelector} from 'react-redux';
import {DeviceHeigth, DeviceWidth} from '../Component/Config';
import {Logo} from '../Component/logo';
import {navigationRef} from '../../App';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icons1 from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DrawerItems = props => {
  const {defaultTheme} = useSelector(state => state);

  const removeData = async () => {
    try {
      await AsyncStorage.removeItem('Data');
      props.navigation.navigate('Login');
    } catch (error) {
      console.log('Error1', error);
    }
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#f39c1f',
      }}>
      <Logo />

      <View
        style={{
          width: '100%',
          height: 2,
          backgroundColor: '#d3d3d3',

          marginTop: -(DeviceHeigth * 0.05),
        }}
      />
      <DrawerContentScrollView {...props} style={{backgroundColor: 'white'}}>
        <TouchableOpacity
          style={styles.buttons}
          onPress={() => {
            props.navigation.navigate('Workouts');
          }}>
          <View style={styles.buttons2}>
            <Icons
              name={'calendar-month-outline'}
              size={30}
              color={'#ec9706'}
            />
            <Text
              style={[
                styles.Text,
                {color: defaultTheme ? '#fff' : '#000', marginHorizontal: 15},
              ]}>
              Workouts
            </Text>
          </View>
          <Image source={localImage.nextButton} style={styles.nextIcon} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttons}
          onPress={() => {
            props.navigation.navigate('Exercises');
          }}>
          <View style={styles.buttons2}>
            <Icons name={'dumbbell'} size={30} color={'#ec9706'} />
            <Text
              style={[
                styles.Text,
                {color: defaultTheme ? '#fff' : '#000', marginHorizontal: 15},
              ]}>
              Exercises
            </Text>
          </View>
          <Image source={localImage.nextButton} style={styles.nextIcon} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttons}
          onPress={() => {
            props.navigation.navigate('Diets');
          }}>
          <View style={styles.buttons2}>
            <Icons name={'silverware'} size={30} color={'#ec9706'} />
            <Text
              style={[
                styles.Text,
                {color: defaultTheme ? '#fff' : '#000', marginHorizontal: 15},
              ]}>
              Diets
            </Text>
          </View>
          <Image source={localImage.nextButton} style={styles.nextIcon} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttons}
          onPress={() => {
            props.navigation.navigate('Store');
          }}>
          <View style={styles.buttons2}>
            <Icons name={'cart-outline'} size={30} color={'#ec9706'} />
            <Text
              style={[
                styles.Text,
                {color: defaultTheme ? '#fff' : '#000', marginHorizontal: 15},
              ]}>
              Store
            </Text>
          </View>
          <Image source={localImage.nextButton} style={styles.nextIcon} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttons}
          onPress={() => {
            props.navigation.navigate('Blog');
          }}>
          <View style={styles.buttons2}>
            <Image
              source={localImage.blogIcon}
              style={{height: 25, width: 25, resizeMode: 'contain'}}></Image>
            <Text
              style={[
                styles.Text,
                {color: defaultTheme ? '#fff' : '#000', marginHorizontal: 15},
              ]}>
              Blog
            </Text>
          </View>
          <Image source={localImage.nextButton} style={styles.nextIcon} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttons}
          onPress={() => {
            props.navigation.navigate('ProfileScreen');
          }}>
          <View style={styles.buttons2}>
            <Icons1 name={'person'} size={30} color={'#ec9706'} />
            <Text
              style={[
                styles.Text,
                {color: defaultTheme ? '#fff' : '#000', marginHorizontal: 15},
              ]}>
              Profile
            </Text>
          </View>
          <Image source={localImage.nextButton} style={styles.nextIcon} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttons}
          onPress={() => {
            props.navigation.navigate('FavoritesRouter');
          }}>
          <View style={styles.buttons2}>
            <Icons name={'heart-outline'} size={30} color={'#ec9706'} />
            <Text
              style={[
                styles.Text,
                {color: defaultTheme ? '#fff' : '#000', marginHorizontal: 15},
              ]}>
              Favorites
            </Text>
          </View>
          <Image source={localImage.nextButton} style={styles.nextIcon} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttons}
          onPress={() => {
            props.navigation.navigate('Settings');
          }}>
          <View style={styles.buttons2}>
            <Icons1 name={'settings-outline'} size={30} color={'#ec9706'} />
            <Text
              style={[
                styles.Text,
                {color: defaultTheme ? '#fff' : '#000', marginHorizontal: 15},
              ]}>
              Settings
            </Text>
          </View>
          <Image source={localImage.nextButton} style={styles.nextIcon} />
        </TouchableOpacity>
        <View
          style={{
            width: '100%',
            height: 2,
            backgroundColor: '#d3d3d3',
            marginLeft: -10,
            marginTop: DeviceHeigth * 0.04,
          }}
        />
        <TouchableOpacity
          style={styles.buttons}
          onPress={() => {
            removeData();
            // props.navigation.navigate('Settings');
          }}>
          <View style={styles.buttons2}>
            <Icons name={'logout'} size={30} color={'#ec9706'} />
            <Text
              style={[
                styles.Text,
                {color: defaultTheme ? '#fff' : '#000', marginHorizontal: 15},
              ]}>
              Logout{' '}
            </Text>
          </View>
          <Image source={localImage.nextButton} style={styles.nextIcon} />
        </TouchableOpacity>
      </DrawerContentScrollView>
    </View>
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
  buttons2: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
export default DrawerItems;
