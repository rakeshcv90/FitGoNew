import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Animated,
  StyleSheet,
  Easing,
  TouchableOpacity,
  FlatList,
  Image,

} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import AnimatedLottieView from 'lottie-react-native';
import DeviceInfo from 'react-native-device-info';
import CircularProgress from 'react-native-circular-progress-indicator';

import {
  DeviceHeigth,
  DeviceWidth,
  NewApi,
  NewAppapi,
} from '../../Component/Config';
import {AppColor, Fonts} from '../../Component/Color';
import axios from 'axios';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import {useDispatch, useSelector} from 'react-redux';
import VersionNumber, {appVersion} from 'react-native-version-number';

import {
  Setmealdata,
  setCurrentWorkoutData,
  setCustomWorkoutData,
  setOfferAgreement,
  setPurchaseHistory,
  setTempLogin,
  setUserProfileData,
} from '../../Component/ThemeRedux/Actions';
import {showMessage} from 'react-native-flash-message';
import {calendarFormat} from 'moment';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const LoadData = ({navigation}) => {
  const getFcmToken = useSelector(state => state.getFcmToken);
  const getTempLogin = useSelector(state => state.getTempLogin);
  const getOfferAgreement = useSelector(state => state.getOfferAgreement);
  const [loadData, setLoadData] = useState(0);
  const buttonName = [
    {
      id: 1,

      image: require('../../Icon/Images/NewImage/testImage.png'),
    },
    {
      id: 2,

      image: require('../../Icon/Images/NewImage/testImage1.png'),
    },
    {
      id: 3,

      image: require('../../Icon/Images/NewImage/testImage2.png'),
    },
    {
      id: 4,

      image: require('../../Icon/Images/NewImage/testImage3.png'),
    },
  ];
  const buttonName1 = [
    {
      id: 1,
      image: require('../../Icon/Images/NewImage/testImage3.png'),
    },
    {
      id: 2,

      image: require('../../Icon/Images/NewImage/testImage2.png'),
    },
    {
      id: 3,

      image: require('../../Icon/Images/NewImage/testImage1.png'),
    },
    {
      id: 4,
      image: require('../../Icon/Images/NewImage/testImage.png'),
    },
  ];
  const [activeNext, setActiveNext] = useState(false);

  const getLaterButtonData = useSelector(state => state.getLaterButtonData);
  const getUserDataDetails = useSelector(state => state.getUserDataDetails);
  const getUserID = useSelector(state => state.getUserID);

  const translationX = useRef(new Animated.Value(0)).current;
  const dispatch = useDispatch();
  useEffect(() => {
    animateList();
  }, []);
  const animateList = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(translationX, {
          toValue: 1,
          duration: 5000,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
      ]),
    ).start();
  };
  useEffect(() => {
    DeviceInfo.getUniqueId().then(id => {
      WholeData(id);
    });
  }, []);
  const WholeData = async deviceID => {
    const mergedObject = Object.assign({}, ...getLaterButtonData);
    const Id =
      getUserDataDetails?.id != null ? getUserDataDetails?.id : getUserID;
    try {
      const payload = new FormData();
      payload.append('deviceid', deviceID);
      payload.append('devicetoken', getFcmToken);
      payload.append('id', Id);
      payload.append('gender', mergedObject?.gender);
      payload.append('goal', mergedObject?.goal);
      // payload.append('weight', mergedObject?.currentWeight);
      // payload.append('age', mergedObject?.age);
      // payload.append('targetweight', mergedObject?.targetWeight);
      // payload.append('experience', mergedObject?.experience);
      // payload.append('workout_plans', mergedObject?.workout_plans);
      // payload.append('equipment', mergedObject?.equipment);
      payload.append('version', VersionNumber.appVersion);
      // if (getTempLogin) {
      //   payload.append('name', mergedObject?.name);
      // } else {
      // }

      payload.append('name', getUserDataDetails?.name);
      console.log('PAYLOASD', payload);
      const data = await axios(`${NewAppapi.Post_COMPLETE_PROFILE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: payload,
      });
       console.log("payload------>",payload)
      if (data?.data?.msg == 'Please update the app to the latest version.') {
        showMessage({
          message: data?.data?.msg,
          floating: true,
          duration: 500,
          type: 'danger',
          icon: {icon: 'auto', position: 'left'},
        });
      } else {
        getUserDetailData(Id); //getProfileData(getUserID);
        // getUserDataDetails?.id != 0 && getUserDetailData(getUserDataDetails?.id); //getProfileData(getUserID);
        // getUserID != 0
        //   ? getCustomWorkout(getUserID)
        //   : customFreeWorkoutDataApi(deviceID);
        // dispatch(setTempLogin(false));
      }
    } catch (error) {
      console.log('Whole Data Error----->', error.response);
    }
  };

  // const getCustomWorkout = async user_id => {
  //   try {
  //     const data = await axios(NewAppapi.Custom_WORKOUT_DATA, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //       data: {
  //         id: user_id,
  //         version: VersionNumber.appVersion,
  //       },
  //     });

  //     if (data.data.workout) {
  //       dispatch(setCustomWorkoutData(data?.data));
  //       setActiveNext(true);
  //       // currentWorkoutDataApi(data.data?.workout[0]);
  //     } else if (
  //       data?.data?.msg == 'Please update the app to the latest version.'
  //     ) {
  //       showMessage({
  //         message: data.data.msg,
  //         type: 'danger',
  //         animationDuration: 500,
  //         floating: true,
  //         icon: {icon: 'auto', position: 'left'},
  //       });
  //     } else {
  //       dispatch(setCustomWorkoutData([]));
  //       setActiveNext(true);
  //     }
  //   } catch (error) {
  //     console.log('Custom Workout Error', error);
  //     dispatch(setCustomWorkoutData([]));
  //     setActiveNext(true);
  //   }
  // };

  // const customFreeWorkoutDataApi = async deviceID => {
  //   try {
  //     const payload = new FormData();
  //     payload.append('deviceid', deviceID);
  //     payload.append('version', VersionNumber.appVersion);

  //     const res = await axios({
  //       url: NewAppapi.Free_WORKOUT_DATA,
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //       data: payload,
  //     });

  //     if (res.data?.workout) {
  //       setActiveNext(true);
  //       dispatch(setCustomWorkoutData(res.data));

  //       // currentWorkoutDataApi(res.data?.workout[0]);
  //     } else if (
  //       res?.data?.msg == 'Please update the app to the latest version.'
  //     ) {
  //       showMessage({
  //         message: res?.data?.msg,
  //         floating: true,
  //         duration: 500,
  //         type: 'danger',
  //         icon: {icon: 'auto', position: 'left'},
  //       });
  //     } else {
  //       dispatch(setCustomWorkoutData([]));
  //       setActiveNext(true);
  //     }
  //   } catch (error) {
  //     console.error(error?.response, 'customWorkoutDataApiError');
  //     dispatch(setCustomWorkoutData([]));
  //     setActiveNext(true);
  //   }
  // };

  const getUserDetailData = async userId => {
    try {
      const responseData = await axios.get(
        `${NewAppapi.ALL_USER_DETAILS}?version=${VersionNumber.appVersion}&user_id=${userId}`,
      );

      if (
        responseData?.data?.msg ==
        'Please update the app to the latest version.'
      ) {
        showMessage({
          message: responseData?.data?.msg,
          type: 'danger',
          animationDuration: 500,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
      } else {
        console.log('WORKINGGGG', responseData.data);
        dispatch(setCustomWorkoutData(responseData?.data?.workout_data));
        dispatch(setOfferAgreement(responseData?.data?.additional_data));
        dispatch(setUserProfileData(responseData?.data?.profile));
        setLoadData(100);
        setActiveNext(true);
      }
    } catch (error) {
      console.log('GET-USER-DATA', error);

      setLoadData(100);
      setActiveNext(true);
    }
  };

  const renderItem1 = ({item, index}) => {
    const translateX = translationX.interpolate({
      inputRange: [0, 1],
      outputRange: [-10, 300], //
    });
    return (
      <Animated.View style={[styles.item, {transform: [{translateX}]}]}>
        <Image
          resizeMode="contain"
          source={item.image}
          style={{
            width: 70,
            height: 70,
          }}
        />
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.Container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />
      <View
        style={{
          height: DeviceHeigth * 0.2,
          top: DeviceHeigth <= 667 ? DeviceHeigth * 0.01 : DeviceHeigth * 0.03,
          alignSelf: 'center',
          backgroundColor: '#fff',
        }}>
        <CircularProgress
          value={loadData}
          radius={70}
          progressValueColor={AppColor.RED}
          inActiveStrokeColor={AppColor.GRAY2}
          activeStrokeColor={AppColor.RED}
          inActiveStrokeOpacity={0.3}
          maxValue={100}
          valueSuffix={'%'}
          titleColor={'black'}
          titleStyle={{
            textAlign: 'center',
            fontSize: 28,
            fontWeight: '700',
            lineHeight: 35,
            fontFamily: 'Poppins',
            color: 'rgb(0, 0, 0)',
          }}
        />
      </View>
      {/* <Text style={styles.text}>49%</Text> */}
      <Text style={styles.text1}>Creating your personalized plan...</Text>
      <Text style={styles.text2}>10K+</Text>
      <Text style={styles.text2}>Active Users</Text>
      <Text
        style={[
          styles.text2,
          {
            color: AppColor.BLACK,
            marginTop: 10,
            fontSize: 20,
            fontWeight: '600',
            fontFamily: Fonts.MONTSERRAT_MEDIUM,
          },
        ]}>
        have achieved their fitness goals
      </Text>
      <View
        style={{
          width: '100%',
          height: DeviceHeigth * 0.15,
          marginTop: DeviceHeigth * 0.05,
        }}>
        <AnimatedFlatList
          data={buttonName}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => {
            const translateX = translationX.interpolate({
              inputRange: [0, 1],
              outputRange: [10, -300], //
            });

            return (
              <Animated.View style={[styles.item, {transform: [{translateX}]}]}>
                <Image
                  resizeMode="contain"
                  source={item.image}
                  style={{
                    width: 70,
                    height: 70,
                  }}
                />
              </Animated.View>
            );
          }}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={100}
          removeClippedSubviews={true}
          keyExtractor={(item, index) => index.toString()}
          horizontal
        />
      </View>
      <View
        style={{
          width: '100%',
          height: DeviceHeigth * 0.15,
        }}>
        <AnimatedFlatList
          data={buttonName1}
          showsHorizontalScrollIndicator={false}
          renderItem={renderItem1}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={100}
          removeClippedSubviews={true}
        />
      </View>

      <View style={styles.buttons}>
        <View></View>

        {activeNext && (
          <TouchableOpacity
            onPress={() => {
              // if (getUserDataDetails?.email) {
              //   navigation.navigate('OfferTerms');
              // } else {
              // }
              navigation.navigate('OfferTerms');
            }}>
            <LinearGradient
              start={{x: 0, y: 1}}
              end={{x: 1, y: 0}}
              colors={[AppColor.RED, AppColor.RED]}
              style={[styles.nextButton]}>
              <Icons name="chevron-right" size={25} color={'#fff'} />
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: 'white',
  },
  text: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 30,
    fontFamily: 'Poppins',
    color: AppColor.BLACK,
  },
  text1: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 30,
    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
    color: '#424242',
    top: 15,
  },
  text2: {
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 35,
    fontFamily: 'Poppins',
    color: AppColor.RED,
    top: DeviceHeigth * 0.03,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: DeviceWidth * 0.9,
    alignItems: 'center',
    alignSelf: 'center',
    bottom: DeviceHeigth * 0.02,
    position: 'absolute',
  },
  nextButton: {
    backgroundColor: 'red',
    width: 45,
    height: 45,
    borderRadius: 50 / 2,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    width: 90,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F6F6F6',
    marginLeft: 50,
    borderRadius: 20,
  },
});
export default LoadData;
