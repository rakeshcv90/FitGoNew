import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  BackHandler,
  SafeAreaView,
} from 'react-native';
import React, {useEffect, useContext, useState} from 'react';
import {DrawerContentScrollView} from '@react-navigation/drawer';
import {localImage} from '../Component/Image';
import {useDispatch, useSelector} from 'react-redux';
import {DeviceHeigth, DeviceWidth} from '../Component/Config';
import {Logo} from '../Component/logo';
import {navigationRef} from '../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setTheme,resetStore} from '../Component/ThemeRedux/Actions';

const DrawerItems = props => {
  const {defaultTheme} = useSelector(state => state);
  const {ProfilePhoto}=useSelector(state=>state)
  const [marginData, setMarginData] = useState(
  defaultTheme?(DeviceWidth * 25) / 100:(-DeviceWidth * 2.5) / 100)
  const Dispatch = useDispatch();
  const [isEnabled, setIsEnabled] = useState(defaultTheme);
 console.log("Profile",ProfilePhoto)
  const removeData = async () => {
    try {
      await AsyncStorage.removeItem('Data');
      props.navigation.navigate('Login');
    } catch (error) {
      console.log('Error1', error);
    }
  };
  const changeTHEME = () => {
    if (!defaultTheme) {
      Dispatch(setTheme(true));
    } else {
      Dispatch(setTheme(false));
    }
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#C8170D',
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
      <DrawerContentScrollView
        {...props}
        style={{backgroundColor: defaultTheme ? '#000' : '#fff'}}>
        <TouchableOpacity
          style={[styles.buttons,{marginTop: -(DeviceWidth * 8) / 100,}]}
          onPress={() => {
            props.navigation.navigate('Workouts');
          }}>
          <View style={styles.buttons2}>
            {/* <Icons
              name={'calendar-month-outline'}
              size={30}
              color={'#ec9706'}
            /> */}
            <Image
              source={localImage.dw1}
              style={{width: 25, height: 25}}
              tintColor={defaultTheme ? 'white' : '#535763'}
              resizeMode="contain"
            />
            <Text
              style={[
                styles.Text,
                {
                  color: defaultTheme ? '#fff' : '#535763',
                  marginHorizontal: 15,
                },
              ]}>
              Workouts
            </Text>
          </View>
          {/* <Image source={localImage.nextButton} style={styles.nextIcon} /> */}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttons}
          onPress={() => {
            props.navigation.navigate('Exercises');
          }}>
          <View style={styles.buttons2}>
            {/* <Icons name={'dumbbell'} size={30} color={'#ec9706'} /> */}
            <Image
              source={localImage.dw2}
              style={{width: 25, height: 25}}
              tintColor={defaultTheme ? 'white' : '#535763'}
              resizeMode="contain"
            />
            <Text
              style={[
                styles.Text,
                {
                  color: defaultTheme ? '#fff' : '#535763',
                  marginHorizontal: 15,
                },
              ]}>
              Exercises
            </Text>
          </View>
          {/* <Image source={localImage.nextButton} style={styles.nextIcon} /> */}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttons}
          onPress={() => {
            props.navigation.navigate('Diets');
          }}>
          <View style={styles.buttons2}>
            {/* <Icons name={'silverware'} size={30} color={'#ec9706'} /> */}
            <Image
              source={localImage.dw3}
              style={{width: 25, height: 25}}
              tintColor={defaultTheme ? 'white' : '#535763'}
              resizeMode="contain"
            />
            <Text
              style={[
                styles.Text,
                {
                  color: defaultTheme ? '#fff' : '#535763',
                  marginHorizontal: 15,
                },
              ]}>
              Diets
            </Text>
          </View>
          {/* <Image source={localImage.nextButton} style={styles.nextIcon} /> */}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttons}
          onPress={() => {
            props.navigation.navigate('Store');
          }}>
          <View style={styles.buttons2}>
            {/* <Icons name={'cart-outline'} size={30} color={'#ec9706'} /> */}
            <Image
              source={localImage.dw4}
              style={{width: 25, height: 25}}
              tintColor={defaultTheme ? 'white' : '#535763'}
              resizeMode="contain"
            />
            <Text
              style={[
                styles.Text,
                {
                  color: defaultTheme ? '#fff' : '#535763',
                  marginHorizontal: 15,
                },
              ]}>
              Store
            </Text>
          </View>
          {/* <Image source={localImage.nextButton} style={styles.nextIcon} /> */}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttons}
          onPress={() => {
            props.navigation.navigate('Blog');
          }}>
          <View style={styles.buttons2}>
            <Image
              source={localImage.dw5}
              style={{width: 22, height: 22}}
              tintColor={defaultTheme ? 'white' : '#535763'}
              resizeMode="contain"
            />
            <Text
              style={[
                styles.Text,
                {
                  color: defaultTheme ? '#fff' : '#535763',
                  marginHorizontal: 15,
                },
              ]}>
              Blog
            </Text>
          </View>
          {/* <Image source={localImage.nextButton} style={styles.nextIcon} /> */}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttons}
          onPress={() => {
            props.navigation.navigate('ProfileScreen');
          }}>
          <View style={styles.buttons2}>
            {/* <Icons1 name={'person'} size={30} color={'#ec9706'} /> */}
            <Image
              source={localImage.dw6}
              style={{width: 25, height: 25}}
              tintColor={defaultTheme ? 'white' : '#535763'}
              resizeMode="contain"
            />
            <Text
              style={[
                styles.Text,
                {
                  color: defaultTheme ? '#fff' : '#535763',
                  marginHorizontal: 15,
                },
              ]}>
              Profile
            </Text>
          </View>
          {/* <Image source={localImage.nextButton} style={styles.nextIcon} /> */}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttons}
          onPress={() => {
            props.navigation.navigate('FavoritesRouter');
          }}>
          <View style={styles.buttons2}>
            {/* <Icons name={'heart-outline'} size={30} color={'#ec9706'} /> */}
            <Image
              source={localImage.dw7}
              style={{width: 25, height: 25}}
              tintColor={defaultTheme ? 'white' : '#535763'}
              resizeMode="contain"
            />
            <Text
              style={[
                styles.Text,
                {
                  color: defaultTheme ? '#fff' : '#535763',
                  marginHorizontal: 15,
                },
              ]}>
              Favorites
            </Text>
          </View>
          {/* <Image source={localImage.nextButton} style={styles.nextIcon} /> */}
        </TouchableOpacity>
        
        <View
          style={{
            width: '100%',
            height: 2,
            backgroundColor: '#d3d3d3',
            marginLeft: -10,
            marginTop: DeviceHeigth * 0.08,
          }}
        />
        <TouchableOpacity
          style={[styles.buttons, {marginTop: (DeviceWidth * 5) / 100}]}
          onPress={() => {
            Dispatch(resetStore())
            removeData();
           
          }}>
          <View style={styles.buttons2}>
            <Image
              source={localImage.dw9}
              style={{width: 20, height: 20}}
              tintColor={defaultTheme ? 'white' : '#535763'}
              resizeMode="contain"
            />
            <Text
              style={[
                styles.Text,
                {
                  color: defaultTheme ? '#fff' : '#535763',
                  marginHorizontal: 15,
                },
              ]}>
              Logout
            </Text>
          </View>
          {/* <Image source={localImage.nextButton} style={styles.nextIcon} /> */}
        </TouchableOpacity>
        <View
          style={{
            marginTop: (DeviceWidth * 7) / 100,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            backgroundColor: defaultTheme ? 'gray' : '#F0F0F0',
            width: (DeviceWidth * 58) / 100,
            height: 50,
            borderRadius: 50,
            marginLeft: (DeviceWidth * 5) / 100,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'white',
              borderRadius: 50,
              position: 'absolute',
              width: (DeviceWidth * 25) / 100,
              height: 40,
              marginLeft: marginData,
               
              ...Platform.select({
                ios: {
                  shadowColor: '#000000',
                  shadowOffset: {width: 0, height: 2},
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                },
                android: {
                  elevation: 4,
                },
              }),
            }}
          />
          <TouchableOpacity
            onPress={() => {
              setMarginData((-DeviceWidth * 4) / 100);
              changeTHEME();
            }}
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={localImage.dw10}
              style={{width: 25, height: 25}}
              tintColor={defaultTheme ? '#535763' : '#535763'}
              resizeMode="contain"
            />
            <Text style={[styles.textdesign, ,]}>Light</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setMarginData((DeviceWidth * 25) / 100);
              changeTHEME();
            }}
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={localImage.dw11}
              style={{width: 25, height: 25}}
              tintColor={defaultTheme ? '#535763' : '#535763'}
              resizeMode="contain"
            />
            <Text style={styles.textdesign}>Dark</Text>
          </TouchableOpacity>
        </View>
      </DrawerContentScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  buttons: {
    marginVertical: (DeviceWidth * 5) / 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: (DeviceWidth * 5) / 100,
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
  textdesign: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 24,
    color: '#535763',
    marginLeft: 8,
  },
});
export default DrawerItems;
