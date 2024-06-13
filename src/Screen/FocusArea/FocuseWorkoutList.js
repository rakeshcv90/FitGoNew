import {View, Text, FlatList, Image, TouchableOpacity} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import NewHeader from '../../Component/Headers/NewHeader';
import {StyleSheet} from 'react-native';
import {AppColor, Fonts} from '../../Component/Color';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../Component/Config';
import AnimatedLottieView from 'lottie-react-native';
import CircularProgress from 'react-native-circular-progress-indicator';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector, useDispatch} from 'react-redux';
import {localImage} from '../../Component/Image';
import {useIsFocused} from '@react-navigation/native';
import {setWorkoutTimeCal} from '../../Component/ThemeRedux/Actions';
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import VersionNumber, {appVersion} from 'react-native-version-number';
import moment from 'moment';
import {BannerAdd} from '../../Component/BannerAdd';
import {bannerAdId} from '../../Component/AdsId';
import NativeAddTest from '../../Component/NativeAddTest';
import FastImage from 'react-native-fast-image';
import { AnalyticsConsole } from '../../Component/AnalyticsConsole';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const FocuseWorkoutList = ({navigation, route}) => {
  const [data, setData] = useState([]);
  const [likeData, setLikeData] = useState([]);
  const [updateLikeID, setUpdateLikeID] = useState(-1);
  const [action, setAction] = useState(0);
  const [execrise, setexecrise] = useState([]);
  const avatarRef = React.createRef();
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  const dispatch = useDispatch();
  const getCustttomeTimeCal = useSelector(state => state.getCustttomeTimeCal);
  const getUserDataDetails = useSelector(state => state.getUserDataDetails);
  const getPurchaseHistory = useSelector(state => state.getPurchaseHistory);
  const isFocused = useIsFocused();
  useEffect(() => {
    setexecrise(route?.params?.bodyexercise);
  }, [route?.params]);
  useEffect(() => {
    if (isFocused) {
      //getCustomeWorkoutTimeDetails();
      getAllLikeStatusAPI();
      getWorkoutStatus();
    }
  }, [isFocused]);

  const getAllLikeStatusAPI = async () => {
    const payload = new FormData();
    payload.append('user_id', getUserDataDetails?.id);
    try {
      // setRefresh(true);
      const res = await axios({
        url: NewAppapi.GET_LIKE_WORKOUTS,
        method: 'post',
        data: payload,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (res.data) {
        // setRefresh(false);
        // Merge likeData into each corresponding WorkoutData object
        const like = res.data?.user_like[0]?.workout_id
          ?.split(',')
          ?.map(str => parseInt(str));
        setLikeData(like);
      }
    } catch (error) {
      // setRefresh(false);
      console.error(error, 'LikeError');
      setLikeData([]);
    }
  };
  const postLikeAPI = async workoutID => {
    try {
      const payload = new FormData();
      payload.append('user_id', getUserDataDetails?.id);
      payload.append('workout_id', workoutID);
      // setRefresh(true);
      const res = await axios({
        url: NewAppapi.POST_LIKE_WORKOUT,
        method: 'post',
        data: payload,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (res.data?.msg == 'Workout removed from like') {
        setAction(-1);
        setUpdateLikeID(workoutID);
      } else {
        setAction(+1);
        setUpdateLikeID(workoutID);
      }
    } catch (error) {
      // setRefresh(false);
      console.error(error, 'likeERRPost');
    }
  };

  function onLoadEnd() {
    setIsLoading(false);
  }

  function onError() {
    setIsLoading(false);
    setErrorMessage(true);
  }
  function onLoadStart() {
    setIsLoading(true);
    setErrorMessage(false);
  }

  const renderItem = useMemo(
    () =>
      ({item, index}) => {
        let totalTime = 0;
        let totalExercise = 0;

        for (const day in item?.days) {
          totalTime = totalTime + parseInt(item?.days[day]?.total_rest);
          totalExercise++;
        }

        return (
          <>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                AnalyticsConsole(
                  `${item?.workout_title?.split(' ')[0]}Wrk_FR_Focus`,
                );
                navigation.navigate('WorkoutDays', {
                  data: item,
                  challenge: false,
                });
              }}
              style={{
                width: '97%',
                borderRadius: 10,
                backgroundColor: AppColor.WHITE,
                marginVertical: 8,
                flexDirection: 'row',
                alignSelf: 'center',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 20,
                padding: 5,
                borderColor: '#fff',
                borderWidth: 1,
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
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {/* {isLoading && (
                  <ShimmerPlaceholder
                    style={styles.loader}
                    ref={avatarRef}
                    autoRun
                  />
                )} */}

                {/* <Image
                  source={{uri: item?.workout_image}}
                  // onLoad={() => setIsLoading(false)}
                  style={{
                    width: 70,
                    height: 70,
                    justifyContent: 'center',
                    alignSelf: 'center',
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: '#D9D9D9',
                  }}
                  resizeMode="cover"
                /> */}
                <FastImage
                  fallback={true}
                  // onError={onError}
                  // onLoadEnd={onLoadEnd}
                  // onLoadStart={onLoadStart}

                  style={{
                    width: 70,
                    height: 70,
                    justifyContent: 'center',
                    alignSelf: 'center',
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: '#D9D9D9',
                  }}
                  source={{
                    uri: item?.workout_image,
                    headers: {Authorization: 'someAuthToken'},
                    priority: FastImage.priority.high,
                  }}
                  resizeMode={FastImage.resizeMode.cover}
                  defaultSource={localImage.NOWORKOUT}
                />

                <View style={{marginHorizontal: 25, top: 10}}>
                  <View style={{width: DeviceWidth * 0.47}}>
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: 17,
                        fontWeight: '600',
                        color: '#202020',
                        lineHeight: 25,
                        fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                      }}>
                      {item?.workout_title}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      marginVertical: 5,
                      alignItems: 'center',
                    }}>
                    <Icons name="timer-outline" size={18} color={'#000'} />

                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: '500',
                        color: '#505050',
                        lineHeight: 15,
                        fontFamily: Fonts.MONTSERRAT_MEDIUM,
                      }}>
                      {' '}
                      {totalTime > 60
                        ? `${(totalTime / 60).toFixed(0)} Min`
                        : `${totalTime} sec`}{' '}
                    </Text>
                    <Text>{'  '}</Text>
                    <Icons name="calendar-today" size={18} color={'#000'} />
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: '500',
                        color: '#505050',
                        lineHeight: 15,
                        fontFamily: Fonts.MONTSERRAT_MEDIUM,
                      }}>
                      {'  '}
                      {item?.workout_duration}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      top: -8,
                      alignItems: 'center',

                      justifyContent: 'flex-start',
                    }}>
                    <View
                      style={{
                        width: 55,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <AnimatedLottieView
                        source={require('../../Icon/Images/NewImage/Eye.json')}
                        speed={0.5}
                        autoPlay
                        onPress={() => {
                          console.log('zXCzcxzcxz');
                        }}
                        style={{width: 22, height: 22}}
                      />
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: '600',
                          color: '#202020',
                          lineHeight: 15,
                          fontFamily: Fonts.MONTSERRAT_MEDIUM,
                        }}>
                        {'  '}
                        {convertLike(item?.total_workout_views)}
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        //left: -10,
                        width: 55,
                      }}
                      onPress={() => {
                        AnalyticsConsole('LIKE_Wrk_FR_Focus')
                        const current = likeData?.findIndex(
                          it => it == item?.workout_id,
                        );
                        if (current == -1) {
                          likeData?.push(item?.workout_id);
                          postLikeAPI(item?.workout_id);
                        } else {
                          const remove = likeData?.filter(
                            it => it != item?.workout_id,
                          );
                          setLikeData(remove);
                          postLikeAPI(item?.workout_id);
                        }
                      }}>
                      {likeData?.includes(item?.workout_id) ? (
                        <AnimatedLottieView
                          source={require('../../Icon/Images/NewImage/Heart.json')}
                          autoPlay
                          speed={0.5}
                          style={{
                            width: 40,
                            height: 40,
                          }}
                        />
                      ) : (
                        <AnimatedLottieView
                          source={require('../../Icon/Images/NewImage/Heartless.json')}
                          autoPlay
                          speed={0.5}
                          style={{
                            width: 40,
                            height: 40,
                          }}
                        />
                      )}
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: '600',
                          color: '#202020',
                          lineHeight: 15,
                          fontFamily: Fonts.MONTSERRAT_MEDIUM,
                        }}>
                        {/* {' '} */}
                        {/* {item?.total_workout_like} */}
                        {item?.workout_id == updateLikeID && action > 0
                          ? convertLike(item?.total_workout_like + action)
                          : convertLike(item?.total_workout_like)}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View>{getProgress(item, totalTime)}</View>
            </TouchableOpacity>

            {getAdsDisplay(item, index)}
          </>
        );
      },

    [likeData, updateLikeID, action, isLoading,getCustttomeTimeCal],
  );
  const convertLike = number => {
    if (number == undefined || number == null) {
      return '';
    }
    if (number < 1000) {
      return number.toString();
    } else if (number < 10000) {
      return (number / 1000).toFixed(0) + 'K';
    } else if (number < 1000000) {
      return (number / 1000).toFixed(0) + 'K';
    } else if (number < 1000000000) {
      return (number / 1000000).toFixed(0) + 'M';
    } else {
      return (number / 1000000000).toFixed(0) + 'B';
    }
  };

  const getCustomeWorkoutTimeDetails = async () => {
    try {
      const data = await axios(`${NewAppapi.Custome_Workout_Cal_Time}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: {
          user_id: getUserDataDetails?.id,
        },
      });
      console.log('userId-->', data.data.results);
      if (data.data.results.length > 0) {
        dispatch(setWorkoutTimeCal(data.data.results));
      } else {
        dispatch(setWorkoutTimeCal([]));
      }
    } catch (error) {
      console.log('UCustomeCorkout details', error);
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
  const getProgress = useMemo(() => (item, totalTime) => {
    let resulttime = 0;
    if (getCustttomeTimeCal?.length > 0) {
      let time = getCustttomeTimeCal.filter(item1 => {
        return item1.workout_id == item.workout_id;
      });

      remainingTime = time[0]?.workout_data?.length;
      if (remainingTime != undefined) {
        resulttime = (
          (remainingTime / item?.workout_duration.split('')[0]) *
          100
        ).toFixed(0);
      } else {
        resulttime = 0;
      }
    } else {
      resulttime = 0;
    }

    return (
      <View>
        {resulttime == 100 ? (
          <AnimatedLottieView
            source={require('../../Icon/Images/NewImage/compleate.json')}
            speed={0.5}
            autoPlay
            resizeMode="cover"
            style={{width: 50, height: 60, right: -5}}
          />
        ) : resulttime == 0 ? (
          <Image
            source={localImage.Next}
            resizeMode="contain"
            style={{width: 32, height: 32}}
          />
        ) : (
          <CircularProgress
            value={resulttime}
            radius={20}
            progressValueColor={'rgb(197, 23, 20)'}
            inActiveStrokeColor={'#A9A9A9'}
            activeStrokeColor={'rgb(219, 92, 0)'}
            maxValue={100}
            valueSuffix={'%'}
            //titleColor={'black'}
            titleStyle={{
              textAlign: 'center',
              fontSize: 15,
              fontWeight: '500',
              lineHeight: 15,
              fontFamily: 'Poppins',
              color: 'rgb(0, 0, 0)',
            }}
          />
        )}
      </View>
    );
  });
  const emptyComponent = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <AnimatedLottieView
          source={require('../../Icon/Images/NewImage/NoData.json')}
          speed={2}
          autoPlay
          loop
          resizeMode="contain"
          style={{
            width: DeviceWidth * 0.5,
            height: DeviceHeigth * 0.6,
          }}
        />
      </View>
    );
  };
  // const bannerAdsDisplay = () => {
  //   if (getPurchaseHistory.length > 0) {
  //     if (
  //       getPurchaseHistory[0]?.plan_end_date >= moment().format('YYYY-MM-DD')
  //     ) {
  //       return null;
  //     } else {
  //       return <BannerAdd bannerAdId={bannerAdId} />;
  //     }
  //   } else {
  //     return <BannerAdd bannerAdId={bannerAdId} />;
  //   }
  // };
  const getAdsDisplay = (item, index) => {
    if (execrise.length >= 1) {
      if (index == 0 && execrise.length > 1) {
        return getNativeAdsDisplay();
      } else if ((index + 1) % 8 == 0 && execrise.length > 8) {
        return getNativeAdsDisplay();
      }
    }
  };
  const getNativeAdsDisplay = () => {
    if (getPurchaseHistory?.plan != null) {
      if (
        getPurchaseHistory?.plan == 'premium' &&
        getPurchaseHistory?.end_date >= moment().format('YYYY-MM-DD')
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
    <>
      <NewHeader
        header={
          route?.params?.item?.bodypart_title == undefined
            ? route?.params?.item?.title
            : route?.params?.item?.bodypart_title
        }
        SearchButton={false}
        backButton={true}
      />
      <View style={styles.container}>
        <View style={[styles.meditionBox, {top: -20}]}>
          <FlatList
            data={execrise}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            ListEmptyComponent={emptyComponent}
            showsVerticalScrollIndicator={false}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            updateCellsBatchingPeriod={100}
            removeClippedSubviews={true}
          />
        </View>
      </View>
      {/* {bannerAdsDisplay()} */}
          <BannerAdd bannerAdId={bannerAdId} />
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFDFD',
  },

  meditionBox: {
    backgroundColor: 'white',
  },
  loader: {
    position: 'absolute',
    justifyContent: 'center',

    backgroundColor: AppColor.GRAY,
    zIndex: 1,
    height: 70,
    width: 70,
    left: 0,
    borderRadius: 5,
  },
});
export default FocuseWorkoutList;
