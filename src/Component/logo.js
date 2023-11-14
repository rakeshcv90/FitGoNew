import {View, Text, Image, StatusBar, StyleSheet, SafeAreaView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {localImage} from './Image';
import {DeviceHeigth, DeviceWidth} from './Config';
import CustomStatusBar from './CustomStatusBar';
import {useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const Logo = () => {
  const drawerWidth = (DeviceWidth * 65) / 100;
  const drawerHeight = DeviceHeigth;
  const [mydata, setMyData] = useState();
  const {defaultTheme} = useSelector(state => state);
  useEffect(() => {
    getMydata();

  }, []);
  const getMydata = async () => {
    setMyData(JSON.parse(await AsyncStorage.getItem('Data')));
  };
  return (
    <>
      {Platform.OS == 'android' ? (
        <>
          <StatusBar
            barStyle={defaultTheme ? 'light-content' : 'dark-content'}
            backgroundColor={'#f39c1f'}
          />
        </>
      ) : (
        <>
      <SafeAreaView style={{
        width: DeviceWidth,
       // height: StatusBar_Bar_Height,
       // backgroundColor:'#f39c1f'
    }}>
       
    </SafeAreaView>
        </>
      )}
      <View
        style={{
          height: (drawerHeight * 30) / 100,
          width: drawerWidth,
          marginTop: (DeviceHeigth * 2) / 100,
          
          alignItems:'center'
        }}>
        <Image
          source={localImage.maleIcon}
          style={{
            height:(DeviceHeigth * 15) / 100,
            width: (DeviceWidth * 32) / 100,
            justifyContent: 'center',

            borderRadius: 200 / 2,
            resizeMode: 'cover',
          }}
        />
        {!!mydata && (
          <>
            <Text
              style={[
                styles.textStyle,
                {color: defaultTheme == true ? '#fff' : '#000'},
              ]}>
              {mydata[0].name}
            </Text>
            <Text style={[styles.textStyle1,{color: defaultTheme == true ? '#fff' : '#000'}]}>
              {mydata[0].email}
            </Text>
          </>
        )}
        {/* <Text style={{color:'black',fontSize:20,fontWeight:'700'}}>User Name</Text> */}
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  textStyle: {
    fontSize: 20,
    fontWeight: '700',
    marginHorizontal:10,
    marginVertical: (DeviceHeigth * 1) / 100,
  },
  textStyle1: {
    fontSize: 15,
    fontWeight: '500',
    marginHorizontal:10
    //marginVertical: (DeviceHeigth * 2) / 100,
  },
});