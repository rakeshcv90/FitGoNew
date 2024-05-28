import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  RefreshControl,
  FlatList,
  Platform,
  ImageBackground,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {AppColor, Fonts} from '../../Component/Color';
import {localImage} from '../../Component/Image';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../Component/Config';
import LinearGradient from 'react-native-linear-gradient';
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';
import {
  setAllExercise,
  setAllWorkoutData,
  setChallengesData,
  setCustomWorkoutData,
  setFitmeMealAdsCount,
  setWorkoutTimeCal,
} from '../../Component/ThemeRedux/Actions';
import NewHeader from '../../Component/Headers/NewHeader';
import VersionNumber, {appVersion} from 'react-native-version-number';
import {showMessage} from 'react-native-flash-message';

import {useIsFocused} from '@react-navigation/native';

import AnimatedLottieView from 'lottie-react-native';

import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import {MyInterstitialAd} from '../../Component/BannerAdd';
import moment from 'moment';
import FastImage from 'react-native-fast-image';
import {AnalyticsConsole} from '../../Component/AnalyticsConsole';

const MaleCategory = [
  {
    id: 230,
    title: 'Quick Fit',
    image: '',
    category: 'Cardio/Abs/Legs/Fourarms/Biceps/Triceps',
  },
  {
    id: 231,
    title: 'Body Blast',
    image: '',
    category: 'Chest/Back/Shoulders/Biceps/Triceps/Fourarms',
  },
  {id: 232, title: 'Flex flow', image: '', category: 'Cardio/Abs'},
  {id: 233, title: 'life fit', image: '', category: 'Legs/Cardio'},
  {id: 234, title: 'blast burn', image: '', category: 'Abs/Chest/Back'},
  {
    id: 235,
    title: 'warrior workout',
    image: '',
    category: 'Chest/Back/Shoulders/Legs',
  },
  {id: 236, title: 'Diesel Drill', image: '', category: 'Legs/Cardio/Abs/Back'},
  {id: 237, title: 'Beach Ready', image: '', category: 'Abs/Chest/Legs'},
];

const FemaleCategory = [
  {id: 230, title: 'Cardio Queen', image: '', category: 'Cardio/Legs/Abs'},
  {id: 231, title: 'Booty Boost', image: '', category: 'Legs'},
  {
    id: 232,
    title: 'Sweat &shine',
    image: '',
    category: 'Chest/Back/Fourarms/Biceps/Triceps',
  },
  {id: 233, title: 'Tummy toners', image: '', category: 'Abs/Back/Legs/Cardio'},
  {id: 234, title: 'Total Body Blitz', image: '', category: ''},
  {
    id: 235,
    title: 'Strong her',
    image: '',
    category: 'Chest/Back/Abs/Fourarms/Biceps/Triceps',
  },
  {id: 236, title: 'Lean Ladies', image: '', category: 'Legs/Cardio/Abs'},
  {
    id: 237,
    title: 'Quick fit',
    image: '',
    category: 'Cardio/Abs/Legs/Fourarms/Biceps/Triceps',
  },
];

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);
const Workouts = ({navigation}: any) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const [imageLoad, setImageLoad] = useState(true);
  const [currentCategories, setCurrentCategories] = useState<Array<any>>([]);
  const completeProfileData = useSelector(
    (state: any) => state.completeProfileData,
  );
  const allWorkoutData = useSelector((state: any) => state.allWorkoutData);

  const getFitmeMealAdsCount = useSelector(
    (state: any) => state.getFitmeMealAdsCount,
  );
  const getPurchaseHistory = useSelector(
    (state: any) => state.getPurchaseHistory,
  );
  const {initInterstitial, showInterstitialAd} = MyInterstitialAd();
  const getUserDataDetails = useSelector(
    (state: any) => state.getUserDataDetails,
  );
  const getAllExercise = useSelector((state: any) => state.getAllExercise);
  const getChallengesData = useSelector(
    (state: any) => state.getChallengesData,
  );

  useEffect(() => {
    if (isFocused) {
      initInterstitial();
      ChallengesDataAPI();
      // getCustomeWorkoutTimeDetails();
      getCustomWorkout();
      getWorkoutStatus();
      setCurrentCategories(
        getUserDataDetails?.gender == 'Female' ? FemaleCategory : MaleCategory,
      );
    }
  }, [isFocused]);
  const [refresh, setRefresh] = useState(false);
  let focuseArea = [
    {
      id: 1,
      title: 'Upper Body',
      image: require('../../Icon/Images/NewImage2/uperBody.png'),
    },
    {
      id: 1,
      title: 'Lower Body',
      image: require('../../Icon/Images/NewImage2/lowerBody.png'),
    },
    {
      id: 1,
      title: 'Full Body',
      image: require('../../Icon/Images/NewImage2/fullBody.png'),
    },
    {
      id: 1,
      title: 'Core',
      image: require('../../Icon/Images/NewImage2/core.png'),
    },
  ];
  useEffect(() => {
    if (isFocused) {
      initInterstitial();
      // allWorkoutApi();
      ChallengesDataAPI();
      getAllExerciseData();
      getCustomWorkout();
      getWorkoutStatus();
    }
  }, [isFocused]);


  const ChallengesDataAPI = async () => {
    try {
      const res = await axios({
        url:
          NewAppapi.GET_CHALLENGES_DATA +
          '?version=' +
          VersionNumber.appVersion +
          '&user_id=' +
          getUserDataDetails?.id,
      });
      if (res.data?.msg != 'version  is required') {
        dispatch(setChallengesData(res.data));
      } else {
        dispatch(setChallengesData([]));
      }
    } catch (error) {
      console.error(error, 'ChallengesDataAPI ERRR');
    }
  };

  const getWorkoutStatus = async () => {
    try {
      const exerciseStatus = await axios.get(
        `${NewAppapi.USER_EXERCISE_COMPLETE_STATUS}?version=${VersionNumber.appVersion}&user_id=${getUserDataDetails.id}`,
      );

      if (
        exerciseStatus?.data.msg ==
        'Please update the app to the latest version'
      ) {
      } else if (exerciseStatus?.data.length > 0) {
        dispatch(setWorkoutTimeCal(exerciseStatus?.data));
      } else {
        dispatch(setWorkoutTimeCal([]));
      }
    } catch (error) {
      console.log('Workout-Status', error);
    }
  };
  const getCustomWorkout = async () => {
    try {
      const data = await axios.get(
        `${NewAppapi.GET_USER_CUSTOM_WORKOUT}?user_id=${getUserDataDetails?.id}`,
      );

      if (data?.data?.msg != 'data not found.') {
        dispatch(setCustomWorkoutData(data?.data?.data));
      } else {
        dispatch(setCustomWorkoutData([]));
      }
    } catch (error) {
      showMessage({
        message: 'Something went wrong pleasr try again',
        type: 'danger',
        animationDuration: 500,
        floating: true,
        icon: {icon: 'auto', position: 'left'},
      });
      console.log('Custom Workout Error', error);
      dispatch(setCustomWorkoutData([]));
    }
  };

  const renderItem = useMemo(() => {
    return ({item}: any) => (
      <>
        <View
          style={{
            marginHorizontal: 5,
          }}>
          <TouchableOpacity
            onPress={() => {
              handleNavigation(item);
            }}
            style={{
              //width: DeviceWidth * 0.6,
              //height: DeviceHeigth * 0.1,
              borderRadius: 50,
              borderWidth: 1,
              borderColor: '#D9D9D9',
              marginVertical: DeviceHeigth * 0.01,
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: AppColor.WHITE,
              flexDirection: 'row',
              padding: 5,

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
            }}>
            <Image
              source={localImage.NOWORKOUT}
              style={{
                width: 30,
                height: 30,
                justifyContent: 'center',
                alignSelf: 'center',
                borderRadius: 16,
              }}
              resizeMode="contain"
            />

            <Text
              style={{
                marginHorizontal: 10,
                fontSize: 15,
                fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                fontWeight: '500',
                lineHeight: 25,
                color: '#434343',
                textAlign: 'center',
              }}>
              {item.title}
            </Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }, []);
  const shuffleArray = (array: Array<any>) => {
    let currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  };
  const getFilterCategory = (categories: string, exerciseBodyPart: string) => {
    return categories.split('/').includes(exerciseBodyPart);
  };

  const handleNavigation = (mydata: any) => {
    let bodyexercise: Array<any> = getAllExercise?.filter((item: any) =>
      getFilterCategory(mydata.category, item?.exercise_bodypart),
    );
    bodyexercise = shuffleArray(bodyexercise);

    // AnalyticsConsole(`${mydata?.title?.split(' ')[0]}_W_CATE`);
    // let checkAdsShow = checkMealAddCount();
    // if (checkAdsShow == true) {
    //   showInterstitialAd();
    //   navigation.navigate('WorkoutCategories', {
    //     bodyexercise,
    //     item: mydata,
    //   });
    // } else {
    navigation.navigate('WorkoutCategories', {
      categoryExercise: bodyexercise,
      CategoryDetails: mydata,
    });
    // }
  };
  const renderItem1 = useMemo(() => {
    return ({item}: any) => (
      <>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            AnalyticsConsole(`D_Wrk_DAYS_FR_Wrk`);
            let checkAdsShow = checkMealAddCount();
            if (checkAdsShow == true) {
              showInterstitialAd();
              navigation.navigate('WorkoutDays', {
                data: item,
                challenge: true,
              });
            } else {
              navigation.navigate('WorkoutDays', {
                data: item,
                challenge: true,
              });
            }
          }}
          style={{
            width: DeviceWidth * 0.95,
            height: DeviceHeigth * 0.35,
            marginVertical: DeviceHeigth * 0.015,
          }}>
          <ImageBackground
            source={{uri: item?.workout_image_link}}
            style={{
              width: DeviceWidth * 0.95,
              height: DeviceHeigth * 0.35,
              borderRadius: 20,
              overflow: 'hidden',
            }}
            resizeMode="cover">
            <LinearGradient
              start={{x: 1, y: 0}}
              end={{x: 0, y: 1}}
              colors={['transparent', 'transparent', '#194ED5', '#003B94']}
              style={{
                width: DeviceWidth * 0.95,
                height: DeviceHeigth * 0.45,
                borderRadius: 20,
                opacity: 0.9,
              }}>
              <ImageBackground
                source={localImage.CalenderNew}
                style={{
                  width: 60,
                  height: 110,
                  alignSelf: 'flex-end',
                  justifyContent: 'center',
                  alignItems: 'center',
                  top: 0,
                  zIndex: 1,
                  right: 10,
                }}
                resizeMode="contain">
                <Text
                  style={{
                    color: AppColor.WHITE,
                    fontFamily: Fonts.MONTSERRAT_MEDIUM,
                    fontWeight: '700',
                    fontSize: 14,
                    top: 0,
                    textAlign: 'center',
                  }}>
                  {`${Object.values(item?.days).length}\nDAYS`}
                </Text>
              </ImageBackground>
              <View
                style={{
                  marginTop:
                    DeviceHeigth >= 930
                      ? DeviceHeigth * 0.14
                      : DeviceHeigth >= 812
                      ? DeviceHeigth * 0.1
                      : DeviceHeigth * 0.05,
                  marginHorizontal: 10,
                  zIndex: 1,
                }}>
                <Text
                  style={{
                    fontFamily: Fonts.MONTSERRAT_BOLD,
                    lineHeight: 40,
                    fontWeight: '700',
                    fontSize: 32,
                    color: AppColor.WHITE,
                  }}>
                  {item?.title}
                </Text>
              </View>
              <View style={{marginHorizontal: 10, zIndex: 1}}>
                <Text
                  style={{
                    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                    lineHeight: 40,
                    fontWeight: '600',
                    fontSize: 18,
                    color: AppColor.WHITE,
                  }}>
                  {item?.sub_title}
                </Text>
              </View>
            </LinearGradient>
          </ImageBackground>
        </TouchableOpacity>
      </>
    );
  }, []);
  const emptyComponent = () => {
    return (
      <View
        style={{
          // flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
        }}>
        <AnimatedLottieView
          source={require('../../Icon/Images/NewImage/NoData.json')}
          speed={2}
          autoPlay
          loop
          resizeMode="contain"
          style={{
            width: DeviceWidth * 0.3,
            height: DeviceHeigth * 0.15,
            alignSelf: 'center',
          }}
        />
      </View>
    );
  };

  const getbodyPartWorkout = (data: any) => {
    let checkAdsShow = checkMealAddCount();
    AnalyticsConsole(`${data?.bodypart_title}_FR_Wrk`);

    if (data?.title == 'Upper Body') {
      let exercises = getAllExercise?.filter(
        (item: any) =>
          item?.exercise_bodypart == 'Shoulders' ||
          item?.exercise_bodypart == 'Triceps' ||
          item?.exercise_bodypart == 'Forearms' ||
          item?.exercise_bodypart == 'Chest' ||
          item?.exercise_bodypart == 'Back' ||
          item?.exercise_bodypart == 'Biceps',
      );

      if (checkAdsShow == true) {
        showInterstitialAd();
        navigation.navigate('NewFocusWorkouts', {
          focusExercises: exercises,
          focusedPart: data?.title,
        });
      } else {
        navigation.navigate('NewFocusWorkouts', {
          focusExercises: exercises,
          focusedPart: data?.title,
        });
      }
    } else if (data?.title == 'Lower Body') {
      let exercises = getAllExercise?.filter(
        (item: any) =>
          item?.exercise_bodypart == 'Legs' ||
          item?.exercise_bodypart == 'Calves',
      );

      if (checkAdsShow == true) {
        showInterstitialAd();
        navigation.navigate('NewFocusWorkouts', {
          focusExercises: exercises,
          focusedPart: data?.title,
        });
      } else {
        navigation.navigate('NewFocusWorkouts', {
          focusExercises: exercises,
          focusedPart: data?.title,
        });
      }
    } else if (data?.title == 'Core') {
      let exercises = getAllExercise?.filter(
        (item: any) =>
          item?.exercise_bodypart == 'Abs' ||
          item?.exercise_bodypart == 'Cardio',
      );

      if (checkAdsShow == true) {
        showInterstitialAd();
        navigation.navigate('NewFocusWorkouts', {
          focusExercises: exercises,
          focusedPart: data?.title,
        });
      } else {
        navigation.navigate('NewFocusWorkouts', {
          focusExercises: exercises,
          focusedPart: data?.title,
        });
      }
    } else {
      if (checkAdsShow == true) {
        showInterstitialAd();
        navigation.navigate('NewFocusWorkouts', {
          focusExercises: getAllExercise,
          focusedPart: data?.title,
        });
      } else {
        navigation.navigate('NewFocusWorkouts', {
          focusExercises: getAllExercise,
          focusedPart: data?.title,
        });
      }
    }
  };
  const getAllExerciseData = async () => {
    try {
      const exerciseData = await axios.get(
        `${NewAppapi.ALL_EXERCISE_DATA}?version=${VersionNumber.appVersion}&user_id=${getUserDataDetails.id}`,
      );

      if (
        exerciseData?.data?.msg == 'Please update the app to the latest version'
      ) {
        dispatch(setAllExercise([]));
      } else if (exerciseData?.data?.length > 0) {
        dispatch(setAllExercise(exerciseData?.data));
      } else {
        dispatch(setAllExercise([]));
      }
    } catch (error) {
      dispatch(setAllExercise([]));
      console.log('All-EXCERSIE-ERROR', error);
    }
  };
  const checkMealAddCount = () => {
    if (getPurchaseHistory.length > 0) {
      if (
        getPurchaseHistory[0]?.plan_end_date >= moment().format('YYYY-MM-DD')
      ) {
        dispatch(setFitmeMealAdsCount(0));
        return false;
      } else {
        if (getFitmeMealAdsCount < 3) {
          dispatch(setFitmeMealAdsCount(getFitmeMealAdsCount + 1));
          return false;
        } else {
          dispatch(setFitmeMealAdsCount(0));
          return true;
        }
      }
    } else {
      if (getFitmeMealAdsCount < 3) {
        dispatch(setFitmeMealAdsCount(getFitmeMealAdsCount + 1));
        return false;
      } else {
        dispatch(setFitmeMealAdsCount(0));
        return true;
      }
    }
  };
  return (
    <>
      <NewHeader header={'Workouts'} SearchButton={false} backButton={false} />
      <View style={styles.container}>
        <FlatList
          data={[1, 2, 3, 4]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refresh}
              onRefresh={() => {
                getAllExerciseData();
                ChallengesDataAPI();
                // workoutStatusApi();
                getCustomWorkout();
              }}
              colors={[AppColor.RED, AppColor.WHITE]}
            />
          }
          renderItem={({item, index}: any) => {
            return (
              <View style={{width: '100%'}}>
                {index == 0 && (
                  <>
                    <View
                      style={{
                        flexDirection: 'row',
                        width: '100%',
                        alignSelf: 'center',

                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={{
                          color: AppColor.HEADERTEXTCOLOR,
                          fontFamily: Fonts.MONTSERRAT_BOLD,
                          fontWeight: '600',
                          lineHeight: 30,
                          fontSize: 18,
                          alignItems: 'center',
                          justifyContent: 'flex-start',
                        }}>
                        Body Type
                      </Text>
                    </View>
                    <View style={styles.meditionBox}>
                      <FlatList
                        data={focuseArea}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item: any, index: number) =>
                          index.toString()
                        }
                        renderItem={({item, index}: any) => {
                          return (
                            <>
                              <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => {
                                  getbodyPartWorkout(item);
                                }}
                                style={{
                                  marginHorizontal: 10,
                                  paddingBottom: 10,
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  alignSelf: 'center',
                                }}>
                                <View
                                  style={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: 40,
                                    backgroundColor: '#FFFFFF',
                                    borderColor: '#fff',
                                    borderWidth: 1,
                                    marginVertical: DeviceHeigth * 0.015,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    alignSelf: 'center',
                                    padding: 7,
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
                                  }}>
                                  <Image
                                    source={item.image}
                                    // onLoad={() => setImageLoad(false)}
                                    style={{
                                      width: '100%',
                                      height: '100%',
                                      justifyContent: 'center',
                                      alignSelf: 'center',
                                    }}
                                    resizeMode="contain"
                                  />
                                </View>

                                <Text
                                  style={{
                                    color: 'black',
                                    fontSize: 12,
                                    fontWeight: '500',
                                    lineHeight: 30,
                                    top: -8,
                                    fontFamily: Fonts.MONTSERRAT_MEDIUM,
                                  }}>
                                  {item.title}
                                </Text>
                              </TouchableOpacity>
                            </>
                          );
                        }}
                        initialNumToRender={10}
                        maxToRenderPerBatch={10}
                        updateCellsBatchingPeriod={100}
                        removeClippedSubviews={true}
                      />
                    </View>
                  </>
                )}
                {index == 1 && (
                  <>
                    <View
                      style={{
                        width: '100%',
                        alignSelf: 'center',
                        // marginVertical: DeviceHeigth * 0.02,
                      }}>
                      <Text
                        style={{
                          color: AppColor.HEADERTEXTCOLOR,
                          fontFamily: Fonts.MONTSERRAT_BOLD,
                          fontWeight: '600',
                          lineHeight: 30,
                          fontSize: 18,
                          alignItems: 'center',
                          justifyContent: 'flex-start',
                        }}>
                        Personalized Workouts
                      </Text>
                    </View>
                    <LinearGradient
                      start={{x: 1, y: 0}}
                      end={{x: 0, y: 1}}
                      colors={['#379CBE', '#81CAF1', '#81CAF1']}
                      style={{
                        width: '100%',

                        borderRadius: 20,
                        marginVertical: 15,
                        paddingVertical: 15,
                        justifyContent: 'center',
                      }}>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => {
                          AnalyticsConsole(`CustomWrk_FR_WRK`);
                          let checkAdsShow = checkMealAddCount();
                          if (checkAdsShow == true) {
                            showInterstitialAd();
                            navigation.navigate('CustomWorkout', {
                              routeName: 'Beginner',
                            });
                          } else {
                            navigation.navigate('CustomWorkout', {
                              routeName: 'Beginner',
                            });
                          }
                        }}
                        style={
                          {
                            //  backgroundColor: AppColor.WHITE,
                          }
                        }>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}>
                          <View
                            style={{
                              marginHorizontal:
                                Platform.OS == 'android'
                                  ? DeviceWidth * 0.03
                                  : DeviceHeigth >= 1024
                                  ? DeviceWidth * 0.03
                                  : DeviceWidth * 0.02,
                            }}>
                            <Text
                              style={{
                                fontSize: 20,
                                color: AppColor.WHITE,
                                lineHeight: 30,
                                fontWeight: '600',
                                fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                              }}>
                              Custom Workout
                            </Text>
                            <Text
                              style={{
                                fontSize: 14,
                                color: AppColor.WHITE,

                                fontWeight: '500',
                                fontFamily: Fonts.MONTSERRAT_MEDIUM,
                              }}>{`A balanced diet is a healthy life`}</Text>
                          </View>
                          <Image
                            source={localImage.NewWorkout}
                            style={{
                              width: DeviceWidth * 0.3,
                              height: 70,
                              //backgroundColor: 'red',
                            }}
                            resizeMode="contain"
                          />
                        </View>
                      </TouchableOpacity>
                    </LinearGradient>
                  </>
                )}
                {index == 2 && (
                  <>
                    <View
                      style={{
                        flexDirection: 'row',
                        width: '100%',
                        alignSelf: 'center',
                        marginVertical: DeviceHeigth * 0.0,
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={{
                          color: AppColor.HEADERTEXTCOLOR,
                          fontFamily: Fonts.MONTSERRAT_BOLD,
                          fontWeight: '600',
                          lineHeight: 30,
                          fontSize: 18,
                          alignItems: 'center',
                          justifyContent: 'flex-start',
                        }}>
                        Workout Categories
                      </Text>
                    </View>
                    <View style={[styles.meditionBox, {marginVertical: 5}]}>
                      <FlatList
                        data={currentCategories.slice(0, 4)}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item: any, index: number) =>
                          index.toString()
                        }
                        renderItem={renderItem}
                        ListEmptyComponent={emptyComponent}
                        initialNumToRender={10}
                        maxToRenderPerBatch={10}
                        updateCellsBatchingPeriod={100}
                        removeClippedSubviews={true}
                      />
                    </View>
                    <View
                      style={[
                        styles.meditionBox,
                        {alignItems: 'center', top: -10},
                      ]}>
                      <FlatList
                        data={currentCategories.slice(4)}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item: any, index: number) =>
                          index.toString()
                        }
                        renderItem={renderItem}
                        ListEmptyComponent={emptyComponent}
                        initialNumToRender={10}
                        maxToRenderPerBatch={10}
                        updateCellsBatchingPeriod={100}
                        removeClippedSubviews={true}
                      />
                    </View>
                  </>
                )}
                {index == 3 && (
                  <>
                    <View
                      style={{
                        flexDirection: 'row',
                        width: '100%',
                        alignSelf: 'center',
                        marginVertical: DeviceHeigth * 0.02,
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={{
                          color: AppColor.HEADERTEXTCOLOR,
                          fontFamily: Fonts.MONTSERRAT_BOLD,
                          fontWeight: '600',
                          lineHeight: 30,
                          fontSize: 18,
                          alignItems: 'center',
                          justifyContent: 'flex-start',
                        }}>
                        Workout Challenges
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.meditionBox,
                        {
                          marginVertical: -DeviceHeigth * 0.015,
                          alignItems: 'center',
                        },
                      ]}>
                      <FlatList
                        data={getChallengesData}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item: any, index: number) =>
                          index.toString()
                        }
                        renderItem={renderItem1}
                        ListEmptyComponent={emptyComponent}
                        initialNumToRender={10}
                        maxToRenderPerBatch={10}
                        updateCellsBatchingPeriod={100}
                        removeClippedSubviews={true}
                      />
                    </View>
                  </>
                )}
              </View>
            );
          }}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColor.WHITE,
    paddingHorizontal: 10,
    marginTop: -30,
  },
  category: {
    fontFamily: 'Poppins',
    fontSize: 16,
    fontWeight: '700',
    color: AppColor.BoldText,
    lineHeight: 25,
  },
  meditionBox: {
    backgroundColor: 'white',
    //top: DeviceHeigth * 0.015,
  },
});

export default Workouts;
