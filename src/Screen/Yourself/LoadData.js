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
  Dimensions,
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
import {AppColor} from '../../Component/Color';
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
  setTempLogin,
  setUserProfileData,
} from '../../Component/ThemeRedux/Actions';
import {showMessage} from 'react-native-flash-message';
import {calendarFormat} from 'moment';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const LoadData = ({navigation}) => {
  const getFcmToken = useSelector(state => state.getFcmToken);
  const getTempLogin = useSelector(state => state.getTempLogin);
  const getOfferAgreement=useSelector(state=>state.getOfferAgreement)
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

  const {
    currentWorkoutData,
    completeProfileData,
    getLaterButtonData,
    mindSetData,
    mindsetConsent,
    getUserDataDetails,
    getUserID,
  } = useSelector(state => state);

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

    try {
      const payload = new FormData();
      payload.append('deviceid', deviceID);
      payload.append('devicetoken', getFcmToken);
      payload.append('id', getUserID != 0 ? getUserID : null);
      payload.append('gender', mergedObject?.gender);
      payload.append('goal', mergedObject?.goal);
      payload.append('weight', mergedObject?.currentWeight);
      payload.append('age', mergedObject?.age);
      payload.append('targetweight', mergedObject?.targetWeight);
      payload.append('experience', mergedObject?.experience);
      payload.append('workout_plans', mergedObject?.workout_plans);
      payload.append('equipment', mergedObject?.equipment);
      payload.append('version', VersionNumber.appVersion);
      if (getTempLogin) {
        payload.append('name', mergedObject?.name);
      }
      const data = await axios(`${NewAppapi.Post_COMPLETE_PROFILE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: payload,
      });

      if (data?.data?.msg == 'Please update the app to the latest version.') {
        showMessage({
          message: data?.data?.msg,
          floating: true,
          duration: 500,
          type: 'danger',
          icon: {icon: 'auto', position: 'left'},
        });
      } else {
        getUserID != 0 && getProfileData(getUserID);
        getUserID != 0
          ? getCustomWorkout(getUserID)
          : customFreeWorkoutDataApi(deviceID);
        dispatch(setTempLogin(false));
      }
    } catch (error) {
      console.log('Whole Data Error', error);
    }
  };

  const getCustomWorkout = async user_id => {
    try {
      const data = await axios(NewAppapi.Custom_WORKOUT_DATA, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: {
          id: user_id,
          version: VersionNumber.appVersion,
        },
      });

      if (data.data.workout) {
        dispatch(setCustomWorkoutData(data?.data));
        setActiveNext(true);
        // currentWorkoutDataApi(data.data?.workout[0]);
      } else if (
        data?.data?.msg == 'Please update the app to the latest version.'
      ) {
        showMessage({
          message: data.data.msg,
          type: 'danger',
          animationDuration: 500,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
      } else {
        dispatch(setCustomWorkoutData([]));
        setActiveNext(true);
      }
    } catch (error) {
      console.log('Custom Workout Error', error);
      dispatch(setCustomWorkoutData([]));
      setActiveNext(true);
    }
  };

  const customFreeWorkoutDataApi = async deviceID => {
    try {
      const payload = new FormData();
      payload.append('deviceid', deviceID);
      payload.append('version', VersionNumber.appVersion);

      const res = await axios({
        url: NewAppapi.Free_WORKOUT_DATA,
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: payload,
      });

      if (res.data?.workout) {
        setActiveNext(true);
        dispatch(setCustomWorkoutData(res.data));
        Meal_List();
        // currentWorkoutDataApi(res.data?.workout[0]);
      } else if (
        res?.data?.msg == 'Please update the app to the latest version.'
      ) {
        showMessage({
          message: res?.data?.msg,
          floating: true,
          duration: 500,
          type: 'danger',
          icon: {icon: 'auto', position: 'left'},
        });
      } else {
        dispatch(setCustomWorkoutData([]));
        setActiveNext(true);
      }
    } catch (error) {
      console.error(error?.response, 'customWorkoutDataApiError');
      dispatch(setCustomWorkoutData([]));
      setActiveNext(true);
    }
  };
  const Meal_List = async () => {
    try {
      const data = await axios(`${NewAppapi.Meal_Categorie}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: {
          version: VersionNumber.appVersion,
        },
      });
      if (data?.data?.msg == 'Please update the app to the latest version.') {
        showMessage({
          message: data?.data?.msg,
          type: 'danger',
          animationDuration: 500,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
      } else if (data.data.diets.length > 0) {
        dispatch(Setmealdata(data.data.diets));
      } else {
        dispatch(Setmealdata([]));
      }
    } catch (error) {
      dispatch(Setmealdata([]));
      console.log('Meal List Error', error);
    }
  };
  const getProfileData = async user_id => {
    try {
      const data = await axios(`${NewApi}${NewAppapi.UserProfile}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: {
          id: user_id,
          version: VersionNumber.appVersion,
        },
      });
      console.log('Load Data Proile ', data?.data?.profile);
      if (data?.data?.profile) {
        dispatch(setUserProfileData(data.data.profile));
        getAgreementStatus();
      } else if (
        data?.data?.msg == 'Please update the app to the latest version.'
      ) {
        showMessage({
          message: data?.data?.msg,
          floating: true,
          duration: 500,
          type: 'danger',
          icon: {icon: 'auto', position: 'left'},
        });
      } else {
        dispatch(setUserProfileData([]));
        getAgreementStatus();
      }
    } catch (error) {
      console.log('User Profile Error', error);
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
  const getAgreementStatus = async () => {
    try {
      const ApiCall = await axios(NewAppapi.GET_AGR_STATUS, {
        method: 'POST',
        data: {
          user_id: getUserID != 0 ? getUserID : null,
          version: VersionNumber.appVersion,
        },
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (ApiCall?.data) {
        setLoadData(100);
        dispatch(setOfferAgreement(ApiCall?.data));
      } else {
        setLoadData(100);
      }
    } catch (error) {
      console.log(error);
      setLoadData(100);
    }
  };
  return (
    <SafeAreaView style={styles.Container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />
      <View
        style={{
          height: DeviceHeigth * 0.2,
          top: DeviceHeigth * 0.03,
          alignSelf: 'center',
          backgroundColor: '#fff',
        }}>
        <CircularProgress
          value={loadData}
          radius={70}
          progressValueColor={'rgb(197, 23, 20)'}
          inActiveStrokeColor={AppColor.GRAY2}
          activeStrokeColor={'rgb(197, 23, 20)'}
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
            marginTop: 20,
            fontSize: 20,
            fontWeight: '600',
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
              if(getAgreementStatus?.term_conditon=='Accepted'){
                navigation.replace('BottomTab');
              }
             else{
              navigation.navigate('OfferTerms')
             }
            }}>
            <LinearGradient
              start={{x: 0, y: 1}}
              end={{x: 1, y: 0}}
              colors={['#941000', '#D5191A']}
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
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 30,
    fontFamily: 'Poppins',
    color: '#424242',
    top: 15,
  },
  text2: {
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 35,
    fontFamily: 'Poppins',
    color: 'rgb(197, 23, 20)',
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
