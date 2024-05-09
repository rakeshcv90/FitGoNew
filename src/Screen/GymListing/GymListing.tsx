import {
  FlatList,
  Image,
  Linking,
  Platform,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
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
import {BannerAdd} from '../../Component/BannerAdd';
import {bannerAdId} from '../../Component/AdsId';
import {useSelector} from 'react-redux';
import moment from 'moment';
import NativeAddTest from '../../Component/NativeAddTest';

type Coordinates = {
  latitude: number;
  longitude: number;
};

const GymListing = ({navigation}: any) => {
  const [loader, setLoader] = useState(false);
  const getPurchaseHistory = useSelector(
    (state: any) => state.getPurchaseHistory,
  );
  const [coords, setCoords] = useState<Coordinates>({
    latitude: -1,
    longitude: -1,
  });
  const [gymsData, setGymsData] = useState([]);
  useFocusEffect(
    useCallback(() => {
      getCurrentLocation();
    }, []),
  );
  const getCurrentLocation = () => {
    setLoader(true)
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
        setLoader(false)
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
      var scheme =
        Platform.OS === 'ios'
          ? 'http://maps.apple.com/?daddr='
          : 'google.navigation:q=';
      var url = scheme + `${location.latitude},${location.longitude}`;
      // var url = scheme + `${location.latitude},${location.longitude}`+ "?q=" +location.center_name;
      console.log(url);
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
          <>
            <View key={index} style={styles.box}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={{margin: 10}}>
                  <Image
                    source={{uri: item?.image}}
                    style={{
                      width: DeviceWidth * 0.2,
                      height: DeviceWidth * 0.2,
                      borderRadius: 20,
                    }}
                  />
                </View>
                <View
                  style={{
                    width:
                      DeviceHeigth >= 1024
                        ? DeviceWidth * 0.7
                        : DeviceWidth * 0.65,
                    marginLeft: 10,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <Text style={styles.heading}>{item?.center_name}</Text>
                    <GradientText
                      text={`   ${item?.distance.toFixed(2)} km`}
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
                        marginRight: DeviceWidth * 0.05,
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
            {getAdsDisplay(item, index)}
          </>
        );
      },
    [gymsData],
  );
  const bannerAdsDisplay = () => {
    if (getPurchaseHistory.length > 0) {
      if (
        getPurchaseHistory[0]?.plan_end_date >= moment().format('YYYY-MM-DD')
      ) {
        return null;
      } else {
        return <BannerAdd bannerAdId={bannerAdId} />;
      }
    } else {
      return <BannerAdd bannerAdId={bannerAdId} />;
    }
  };
  const getAdsDisplay = (item, index) => {
    if (gymsData?.length >= 1) {
      if (index == 0) {
        return getNativeAdsDisplay();
      } else if ((index + 1) % 8 == 0) {
        return getNativeAdsDisplay();
      }
    }
  };
  const getNativeAdsDisplay = () => {
    if (getPurchaseHistory.length > 0) {
      if (
        getPurchaseHistory[0]?.plan_end_date >= moment().format('YYYY-MM-DD')
      ) {
        return null;
      } else {
        return (
          <View
            style={{
              alignSelf: 'center',
              alignItems: 'center',
            }}>
            <NativeAddTest type="image" media={false} />
          </View>
        );
      }
    } else {
      return (
        <View
          style={{
            alignSelf: 'center',
            alignItems: 'center',
          }}>
          <NativeAddTest type="image" media={false} />
        </View>
      );
    }
  };
  return (
    <View style={{flex: 1, backgroundColor: AppColor.WHITE}}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />
      <NewHeader header={'Near by Gyms'} SearchButton={false} backButton />
      <View
        style={{
          flex: 1,
          marginHorizontal: 10,
        }}>
        {loader ? (
          <ActivityLoader visible={loader} />
        ) : (
          <FlatList
            data={gymsData}
            contentContainerStyle={{
              justifyContent: 'center',
            }}
            renderItem={renderItem}
            refreshControl={
              <RefreshControl
                refreshing={loader}
                onRefresh={() => GetGymsAPI(coords)}
                colors={[AppColor.RED, AppColor.WHITE]}
              />
            }
            ListEmptyComponent={
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: DeviceHeigth * 0.15,
                }}>
                <Image
                  source={require('../../Icon/Images/NewImage2/NoLocation.png')}
                  style={{
                    width: DeviceWidth * 0.6,
                    height: DeviceWidth * 0.6,
                    marginBottom: 20,
                  }}
                  resizeMode="contain"
                />
                <Text
                  style={styles.heading}
                  onPress={() => Linking.openSettings()}>
                  Currently, No Gyms available{'\n'} for your location
                </Text>
              </View>
            }
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
      {bannerAdsDisplay()}
    </View>
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
    alignSelf: 'center',
    padding: 3,
    marginVertical: 7,
    shadowColor: 'grey',
    ...Platform.select({
      ios: {
        //shadowColor: '#000000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  heading: {
    color: '#202020',
    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
    fontSize: 20,
    lineHeight: 25,
    fontWeight: '600',
    textAlign: 'center',
    textTransform: 'capitalize',
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
