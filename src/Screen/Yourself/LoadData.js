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
import VersionNumber from 'react-native-version-number';

import {
  Setmealdata,
  setCurrentWorkoutData,
  setCustomWorkoutData,
  setUserProfileData,
} from '../../Component/ThemeRedux/Actions';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const LoadData = ({navigation}) => {
  const {getFcmToken} = useSelector(state => state);
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
      Meal_List(id);
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
      payload.append('age', mergedObject?.age);
      payload.append('fitnesslevel', mergedObject?.level); // static values change  it accordingly
      payload.append('focusarea', mergedObject?.focuseArea?.join(','));
      payload.append('weight', mergedObject?.currentWeight);
      payload.append('targetweight', mergedObject?.targetWeight);
      payload.append('height', mergedObject?.height);
      payload.append(
        'injury',
        mergedObject?.injury != null ? mergedObject?.injury?.join(',') : null,
      );
      payload.append('equipment', mergedObject?.equipment);
      payload.append('workoutarea', mergedObject?.workoutArea?.join(','));
      if (mindsetConsent == true) {
        payload.append('workoutroutine', mindSetData[0].routine);
        payload.append('sleepduration', mindSetData[1].SleepDuration);
        payload.append('mindstate', mindSetData[2].mState);
        payload.append('alcoholconstent', mindSetData[3].Alcohol_Consent);

        if (mindSetData[4]) {
          payload.append('alcoholquantity', mindSetData[4].Alcohol_Qauntity);
        }
      }

      const data = await axios(`${NewAppapi.Post_COMPLETE_PROFILE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: payload,
      });

      getUserID != 0 && getProfileData(getUserID);
      getUserID != 0
        ? getCustomWorkout(getUserID)
        : customFreeWorkoutDataApi(deviceID);
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
        },
      });
      console.log('Custom Workout123', data.data.workout);

      if (data.data.workout) {
        dispatch(setCustomWorkoutData(data?.data));
        setActiveNext(true);
        // currentWorkoutDataApi(data.data?.workout[0]);
        setLoadData(100);
      } else {
        dispatch(setCustomWorkoutData([]));
        setActiveNext(true);
        setLoadData(100);
      }
    } catch (error) {
      console.log('Custom Workout Error', error);
      dispatch(setCustomWorkoutData([]));
      setActiveNext(true);
      setLoadData(100);
    }
  };

  const customFreeWorkoutDataApi = async deviceID => {
    try {
      const payload = new FormData();
      payload.append('deviceid', deviceID);
      const res = await axios({
        url: NewAppapi.Free_WORKOUT_DATA,
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: payload,
      });
      console.log('CustomFreeWorkout11', res.data);
      if (res.data?.workout) {
        setLoadData(100);
        setActiveNext(true);
        dispatch(setCustomWorkoutData(res.data));
        // currentWorkoutDataApi(res.data?.workout[0]);
      } else {
        dispatch(setCustomWorkoutData([]));
        setActiveNext(true);
        setLoadData(100);
      }
    } catch (error) {
      console.error(error?.response, 'customWorkoutDataApiError');
      dispatch(setCustomWorkoutData([]));
      setActiveNext(true);
      setLoadData(100);
    }
  };

  // const currentWorkoutDataApi = async workout => {
  //   const mergedObject = Object.assign({}, ...getLaterButtonData);
  //   try {
  //     const payload = new FormData();
  //     payload.append('workoutid', workout?.workout_id);
  //     payload.append('workoutgender', workout?.workout_gender);
  //     payload.append('workoutgoal', workout?.workout_goal);
  //     payload.append('workoutlevel', workout?.workout_level);
  //     payload.append('workoutarea', workout?.workout_area);
  //     payload.append('workoutinjury', workout?.workout_injury);
  //     payload.append('workoutage', mergedObject?.age); //User Age here
  //     payload.append('workoutequipment', workout?.workout_equipment);
  //     const res = await axios({
  //       url: NewAppapi.Free_Excercise_Data,

  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //       data: payload,
  //     });
  //     if (res.data) {

  //       dispatch(setCurrentWorkoutData(res.data));
  //       setLoadData(100);
  //     } else dispatch(setCurrentWorkoutData([]));

  //     setLoadData(100);
  //     setTimeout(() => {
  //       setActiveNext(true);
  //       // showMessage({
  //       //   message: 'Your Custom Workout has beeen created Successfully!!',
  //       //   type: 'success',
  //       //   animationDuration: 500,
  //       //   // statusBarHeight: StatusBar_Bar_Height+,
  //       //   floating: true,
  //       //   icon: {icon: 'auto', position: 'left'},
  //       // });
  //     }, 2000);
  //   } catch (error) {
  //     console.error(error, 'customWorkoutDataApiError');
  //     dispatch(setCurrentWorkoutData([]));
  //     setTimeout(() => {
  //       setActiveNext(true);
  //     }, 2000);
  //   }
  // };

  const Meal_List = async login_token => {
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

      if (data.data.diets.length > 0) {
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
        },
      });
      console.log('User Profile Data',data.data);
      if (data.data.profile) {
        dispatch(setUserProfileData(data.data.profile));
        
      } else {
        dispatch(setUserProfileData([]));
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
      <Text style={styles.text2}>10,00,000+</Text>
      <Text style={styles.text2}>Training Plan</Text>
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
        Have Completed
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
        />
      </View>

      <View style={styles.buttons}>
        <View></View>
     
        {activeNext && (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('BottomTab');
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
