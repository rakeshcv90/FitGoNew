import {
  View,
  Text,
  Image,
  StatusBar,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {localImage} from './Image';
import {DeviceHeigth, DeviceWidth} from './Config';
import CustomStatusBar from './CustomStatusBar';
import {useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Api,Appapi } from './Config';
import axios from 'axios';
export const Logo = () => {

  const [Name, setName] = useState('');
  const [Email, setEmail] = useState();
  const [imageUrl, setImageUrl] = useState(null);
  const drawerWidth = (DeviceWidth * 65) / 100;
  const drawerHeight = DeviceHeigth;
  const [mydata, setMyData] = useState();
  const defaultTheme = useSelector(state => state.defaultTheme);
  const ProfilePhoto=useSelector(state=>state.ProfilePhoto)
  useEffect(() => {
    getMydata();
  },);
  const getMydata = async () => {
    try {
      const userData = JSON.parse(await AsyncStorage.getItem('Data'));
      const apiResponse = await axios(
        `${Api}/${Appapi.getUserData}?email=${userData[0].email}`,
      );
      if (apiResponse.data) {
        setImageUrl(apiResponse.data[0].image);
        setEmail(apiResponse.data[0].email);
        setName(apiResponse.data[0].name)
      } else {
       
      }
    } catch (error) {
      console.log('apiResponseError', error);
    }
  };
  return (
    <>
      {Platform.OS == 'android' ? (
        <>
          <StatusBar
            barStyle={defaultTheme ? 'light-content' : 'dark-content'}
            backgroundColor={'#C8170D'}
          />
        </>
      ) : (
        <>
          <SafeAreaView
            style={{
              width: DeviceWidth,
            }}></SafeAreaView>
        </>
      )}
      <View
        style={{
          flexDirection: 'row',
          height: (drawerHeight * 20) / 100,
          width: drawerWidth,
          marginTop: -(DeviceHeigth * 5) / 100,
          alignItems: 'center',
        }}>
        <Image
          source={{uri:ProfilePhoto}}
          style={{
            height: (DeviceHeigth * 7) / 100,
            width: (DeviceWidth * 15) / 100,
            justifyContent: 'center',
            marginHorizontal: 10,
            borderRadius: 200 / 2,
            resizeMode: 'cover',
          }}
        />

          <View>
            <Text
              style={[
                styles.textStyle,
                {color: defaultTheme == true ? '#fff' : '#fff',textTransform:'capitalize'},
              ]}>
           {Name}
            </Text>
            <Text
              style={[
                styles.textStyle1,
                {color: defaultTheme == true ? '#D6D6D6' : '#D6D6D6'},
              ]}>
            {Email}
            </Text>
          </View>
        {/* <Text style={{color:'black',fontSize:20,fontWeight:'700'}}>User Name</Text> */}
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  textStyle: {
    fontSize: 15,
    fontWeight: '600',
    marginHorizontal: 10,
    color: ' #FFFFFF',
    lineHeight: 24,
  },
  textStyle1: {
    fontSize: 12,
    fontWeight: '500',
    marginHorizontal: 10,
    lineHeight: 12,
    fontFamily: 'Inter',
    marginVertical:5
  },
});
