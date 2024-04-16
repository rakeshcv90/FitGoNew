import {
  FlatList,
  Image,
  Linking,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  PERMISSIONS,
  request,
  RESULTS,
  requestMultiple,
} from 'react-native-permissions';
import {useFocusEffect} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AppColor, Fonts} from '../../Component/Color';
import NewHeader from '../../Component/Headers/NewHeader';
import Geolocation from '@react-native-community/geolocation';
import {localImage} from '../../Component/Image';
import axios from 'axios';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../Component/Config';
import {showMessage} from 'react-native-flash-message';
import ActivityLoader from '../../Component/ActivityLoader';
import GradientText from '../../Component/GradientText';

type Coordinates = {
  latitude: number;
  longitude: number;
};

const GymListing = ({navigation}: any) => {
  const [locationP, setLocationP] = useState(false);
  const [loader, setLoader] = useState(false);
  const [coords, setCoords] = useState<Coordinates>({
    latitude: -1,
    longitude: -1,
  });
  const [gymsData, setGymsData] = useState([]);
  useFocusEffect(
    useCallback(() => {
      locationPermission();
      GetGymsAPI(coords);
    }, []),
  );
  const locationPermission = () => {
    Platform.OS == 'ios'
      ? request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then(async result => {
          if (result === RESULTS.GRANTED) {
            console.log('Location permission granted IOS');
            setLocationP(true);
            getCurrentLocation();
          } else {
            setLocationP(false);
            console.log('Location permission denied IOS', result);
          }
        })
      : requestMultiple([
          PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
          PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        ]).then(async (result: any) => {
          if (result['android.permission.ACCESS_FINE_LOCATION'] == 'granted') {
            console.log('Location permission granted Android');
            setLocationP(true);
            getCurrentLocation();
          } else {
            setLocationP(false);
            console.log('Location permission denied Android');
          }
        });
  };
  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const pos = position.coords;
        console.log('pos', pos);
        setCoords({
          latitude: pos.latitude,
          longitude: pos.longitude,
        });
        GetGymsAPI(pos);
      },
      error => {
        console.log('err Coord', error.code, error);
      },
      {enableHighAccuracy: false, maximumAge: 0},
    );
  };

  const GetGymsAPI = async (pos: Coordinates) => {
    setLoader(true);
    const payload = new FormData();
    payload.append('latitude', pos.latitude);
    payload.append('longitude', pos.longitude);

    try {
      const res = await axios({
        url: NewAppapi.GET_NEARBY_GYMS,
        method: 'Post',
        data: payload,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res?.data?.msg != 'No data found') {
        setGymsData(res.data?.nearby_gyms);
      } else {
        showMessage({
          message: res?.data?.msg,
          type: 'danger',
          animationDuration: 500,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
        setGymsData([]);
      }
      setLoader(false);
    } catch (error) {
      console.error(error, 'GYMS GET ERRR');
      setGymsData([]);
      setLoader(false);
    }
  };
  const openGoogleMaps = async (location: any) => {
    try {
      var scheme = Platform.OS === 'ios' ? 'http://maps.apple.com/?daddr=' : 'google.navigation:q=';
      var url = scheme + `${location.latitude},${location.longitude}`;
      // var url = scheme + `${location.latitude},${location.longitude}`+ "?q=" +location.center_name;
      console.log(url)
      await Linking.openURL(url);
    } catch (error) {
      console.log('OPEN APP ERRR', error);
      showMessage({
        message: `Can't open this location`,
        type: 'danger',
        animationDuration: 500,
        floating: true,
        icon: {icon: 'auto', position: 'left'},
      });
    }
  };
  const renderItem = useMemo(
    () =>
      ({item, index}: any) => {
        return (
          <View key={index} style={styles.box}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                source={{uri: item?.image}}
                style={{
                  width: DeviceWidth * 0.25,
                  height: DeviceWidth * 0.25,
                  borderRadius: 20,
                }}
              />
              <View style={{width: DeviceWidth * 0.65}}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <Text style={styles.heading}>{item?.center_name}</Text>
                  <GradientText
                    text={`${item?.distance.toFixed(2)} km`}
                    // width={item?.distance < 1 && 40}
                    height={20}
                    y={15}
                    alignSelf
                  />
                </View>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: Fonts.MONTSERRAT_MEDIUM,
                    lineHeight: 16,
                    color: '#202020',
                  }}>
                  {item?.location}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',

                    marginTop: 3,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Image
                      style={{
                        width: 15,
                        height: 15,
                        marginRight: 5,
                      }}
                      resizeMode="contain"
                      source={localImage.ClockGrey}
                    />
                    <Text
                      style={{
                        fontSize: 12,
                        fontFamily: Fonts.MONTSERRAT_MEDIUM,
                        lineHeight: 16,
                        color: '#202020',
                      }}>
                      {item?.open_time}
                      {' - '}
                      {item?.close_time}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => openGoogleMaps(item)}
                    style={{
                      backgroundColor: '#E5E5E5',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: 25,
                      height: 25,
                      borderRadius: 20,
                    }}
                    activeOpacity={1}>
                    <Image
                      source={localImage.Location}
                      style={{
                        width: 15,
                        height: 15,
                        tintColor: '#7A7A7A',
                      }}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <FlatList
              data={JSON.parse(item?.features)}
              keyExtractor={(_, index: number) => index.toString()}
              contentContainerStyle={{}}
              style={{
                justifyContent: 'space-between',
                width: DeviceWidth * 0.9,
              }}
              numColumns={DeviceHeigth >= 1024 ? 4 : 2}
              scrollEnabled={false}
              renderItem={({item}: any) => (
                <Text style={styles.features}>{item}</Text>
              )}
            />
          </View>
        );
      },
    [gymsData],
  );
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: AppColor.WHITE}}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />
      <NewHeader header={'Near by Gyms'} SearchButton={false} backButton />
      <View
        style={{
          flex: 1,
          marginHorizontal: 10,
        }}>
        {gymsData?.length > 0 ? (
          <FlatList
            data={gymsData}
            contentContainerStyle={{
              justifyContent: 'center',
            }}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={styles.heading}>
              Currently, No Gyms available in your location
            </Text>
          </View>
        )}
      </View>
      <ActivityLoader visible={loader} />
    </SafeAreaView>
  );
};

export default GymListing;

const styles = StyleSheet.create({
  box: {
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#D9D9D9',
    backgroundColor: '#FDFDFD',
    width: DeviceWidth * 0.95,
    padding: 3,
    marginVertical: 7,
    shadowColor: 'rgba(0, 0, 0, 1)',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  heading: {
    color: '#202020',
    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '600',
  },
  features: {
    color: '#505050',
    fontFamily: Fonts.MONTSERRAT_REGULAR,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#D5191A',
    padding: 5,
    margin: 5,
    marginHorizontal: 7.5,
  },
});
