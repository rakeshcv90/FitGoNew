/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable radix */
import {
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {AppColor, Fonts} from '../../Component/Color';

import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../Component/Config';

import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import {localImage} from '../../Component/Image';
import {showMessage} from 'react-native-flash-message';
import axios from 'axios';
import {useIsFocused} from '@react-navigation/native';
import ActivityLoader from '../../Component/ActivityLoader';
import analytics from '@react-native-firebase/analytics';

import {
  setFitmeMealAdsCount,
  setSubscriptiomModal,
  setVideoLocation,
} from '../../Component/ThemeRedux/Actions';
import AnimatedLottieView from 'lottie-react-native';
import RNFetchBlob from 'rn-fetch-blob';

import {AddCountFunction} from '../../Component/Utilities/AddCountFunction';

import Wrapper from '../WorkoutCompleteScreen/Wrapper';
import NewHeader1 from '../../Component/Headers/NewHeader1';

const formatDuration = (seconds: number) => {
  if (!seconds || isNaN(seconds)) return '0 sec';
  return seconds > 60
    ? `${((seconds * 3) / 60).toFixed(0)} min`
    : `${seconds} sec`;
};

const WorkoutDays = ({navigation, route}: any) => {
  const {data, challenge} = route.params;
  const [selected, setSelected] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [open, setOpen] = useState(true);
  const [day, setDay] = useState(1);
  const [trainingCount, setTrainingCount] = useState(-1);
  const [totalCount, setTotalCount] = useState(-1);
  const [trackerData, setTrackerData] = useState([]);
  const [exerciseData, setExerciseData] = useState([]);
  const [downloaded, setDownloade] = useState(0);
  const avatarRef = React.createRef();
  const [isLoading, setIsLoading] = useState(true);
  const getFitmeMealAdsCount = useSelector(
    (state: any) => state.getFitmeMealAdsCount,
  );

  // const {showInterstitialAd} = MyInterstitialAd();

  let isFocuse = useIsFocused();
  const dispatch = useDispatch();
  const [reward, setreward] = useState(0);
  const getPurchaseHistory = useSelector(
    (state: any) => state.getPurchaseHistory,
  );
  const getUserDataDetails = useSelector(
    (state: any) => state.getUserDataDetails,
  );
  const getSubscriptionModal = useSelector(
    (state: any) => state.getSubscriptionModal,
  );
  let totalTime = 0,
    restDays = [];
  for (const day in data?.days) {
    if (data?.days[day]?.total_rest == 0) {
      restDays.push(parseInt(day.split('day_')[1]));
    }
    totalTime = totalTime + parseInt(data?.days[day]?.total_rest);
  }
  const allDays = Object.values(data?.days || {});
  const totalDaysCount = allDays.length;
  const workoutDaysCount = totalDaysCount - restDays.length;
  const completedDaysCount = allDays.filter(
    (item: any, index: number) => selected != 0 && index < selected,
  ).length;
  const progressPercent =
    totalDaysCount > 0
      ? Math.min(100, Math.round((completedDaysCount / totalDaysCount) * 100))
      : 0;
  useEffect(() => {
    if (isFocuse) {
      postViewsAPI();
      getCurrentDayAPI();
      setreward(0);
    }
  }, [isFocuse]);
  const getCurrentDayAPI = async () => {
    try {
      setRefresh(true);
      const payload = new FormData();
      payload.append('id', getUserDataDetails?.id);
      payload.append('workout_id', data?.workout_id);
      const res = await axios({
        url: challenge
          ? NewAppapi.CURRENT_CHALLENGE_DAY_EXERCISE_DETAILS
          : NewAppapi.CURRENT_DAY_EXERCISE_DETAILS,
        method: 'post',
        data: payload,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        lang: 'en',
      });

      if (res.data?.msg != 'No data found') {
        // if(res.data?.user_details)
        const result: any = analyzeExerciseData(res.data?.user_details);

        if (result.two.length == 0) {
          let day = parseInt(result.one[result.one.length - 1]);
          for (const item of Object.entries(data?.days)) {
            const index = parseInt(item[0].split('day_')[1]);

            if (item[1]?.total_rest == 0 && index == day + 1) {
              setSelected(index);
              setDay(index + 1);
              break;
            } else {
              setSelected(day);
              setDay(day + 1);
              // break;
            }
          }
          const temp2 = res.data?.user_details?.filter(
            (item: any) => item?.user_day == result.one[0],
          );

          setOpen(true);
          // setSelected(parseInt(result.one[result.one.length - 1]));
        } else {
          const temp = res.data?.user_details?.filter(
            (item: any) =>
              item?.user_day == result.two[0] &&
              item?.exercise_status == 'undone',
          );
          const temp2 = res.data?.user_details?.filter(
            (item: any) => item?.user_day == result.two[0],
          );

          setTrackerData(temp2);
          setTotalCount(temp2?.length);
          setTrainingCount(temp2?.length - temp?.length);
          setSelected(result.two[0] - 1);
          setDay(result.two[0]);
          setOpen(true);
        }
      } else {
        setSelected(0);
      }

      allWorkoutApi();
    } catch (error) {
      console.error(error, 'DAPIERror');
      setRefresh(false);
    }
  };
  function analyzeExerciseData(exerciseData: []) {
    const daysCompletedAll = new Set();
    const daysPartialCompletion = new Set();

    exerciseData.forEach((entry: any) => {
      const userDay = entry['user_day'];
      const exerciseStatus = entry['exercise_status'];
      if (entry['final_status'] == 'allcompleted')
        daysCompletedAll.add(parseInt(userDay));
      else {
        if (exerciseStatus === 'completed') {
          daysCompletedAll.add(parseInt(userDay));
        } else {
          daysPartialCompletion.add(parseInt(userDay));
        }
      }
    });
    const one = Array.from(daysCompletedAll);
    const two = Array.from(daysPartialCompletion);

    return {one, two};
  }

  const allWorkoutApi = async () => {
    try {
      const res = await axios({
        url:
          NewAppapi.Get_DAYS +
          '?day=' +
          day +
          '&workout_id=' +
          data?.workout_id,
      });

      if (res.data?.msg != 'no data found.') {
        setExerciseData(res.data);
      } else setExerciseData([]);
      setRefresh(false);
    } catch (error) {
      console.error(error, 'DaysAPIERror');
      setExerciseData([]);
      setRefresh(false);
    }
  };
  const postViewsAPI = async () => {
    try {
      const payload = new FormData();
      payload.append('workout_id', data?.workout_id);
      const res = await axios({
        url: NewAppapi.POST_WORKOUT_VIEWS,
        method: 'post',
        data: payload,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data?.msg == 'Workout views ') {
      }
      setRefresh(false);
    } catch (error) {
      console.error(error, 'VIEWSPIERror');
      setRefresh(false);
    }
  };

  const sanitizeFileName = (fileName: string) => {
    fileName = fileName.replace(/\s+/g, '_');
    return fileName;
  };
  let StoringData: Object = {};
  const downloadVideos = async (data: any, index: number, len: number) => {
    const filePath = `${RNFetchBlob.fs.dirs.CacheDir}/${sanitizeFileName(
      data?.exercise_title,
    )}.mp4`;
    try {
      const videoExists = await RNFetchBlob.fs.exists(filePath);
      if (videoExists) {
        StoringData[data?.exercise_title] = filePath;
        setDownloade(100 / (len - index));
      } else {
        await RNFetchBlob.config({
          fileCache: true,
          // IOSBackgroundTask: true, // Add this for iOS background downloads
          path: filePath,
          appendExt: '.mp4',
        })
          .fetch('GET', data?.exercise_video, {
            'Content-Type': 'application/mp4',
            // key: 'Config.REACT_APP_API_KEY',
          })
          .then(res => {
            StoringData[data?.exercise_title] = res.path();
            setDownloade(100 / (len - index));
          })
          .catch(err => {
            console.log(err);
          });
      }
    } catch (error) {
      console.log('ERRRR', error);
    }
    dispatch(setVideoLocation(StoringData));
  };
  if (reward == 1) {
    setreward(0);
    navigation.navigate('Exercise', {
      allExercise: exerciseData,
      currentExercise:
        trainingCount == -1 ? exerciseData[0] : exerciseData[trainingCount],
      data: data,
      day: day,
      exerciseNumber: trainingCount == -1 ? 0 : trainingCount,
      trackerData: trackerData,
    });
  }
  const PaddoMeterPermissionModal = () => {
    return (
      <Modal
        transparent
        animationType="slide"
        visible={getSubscriptionModal}
        onRequestClose={() => {
          dispatch(setSubscriptiomModal(false));
        }}>
        <View style={styles.modalBackGround}>
          <View
            style={[
              styles.modalContainer,
              {
                // height:
                //   Platform.OS == 'android'
                //     ? DeviceHeigth * 0.6
                //     : DeviceHeigth >= 932
                //     ? DeviceHeigth * 0.45
                //     : DeviceHeigth * 0.55,
              },
            ]}>
            <Icons
              name="close"
              color={AppColor.DARKGRAY}
              size={30}
              onPress={() => {
                dispatch(setSubscriptiomModal(false));
              }}
              style={{
                justifyContent: 'flex-end',
                alignSelf: 'flex-end',
                padding: 10,
              }}
            />
            <AnimatedLottieView
              source={require('../../Icon/Images/NewImage/Subscription.json')}
              speed={2}
              autoPlay
              resizeMode="cover"
              loop
              style={{
                width: DeviceWidth * 0.3,
                height: DeviceHeigth * 0.2,
                top: -DeviceHeigth * 0.06,
              }}
            />
            <View
              style={{
                height: 40,
                alignItems: 'center',
                alignSelf: 'center',
                top: -DeviceHeigth * 0.05,
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: 'Poppins',
                  textAlign: 'center',
                  color: '#D5191A',
                  fontWeight: '700',
                  backgroundColor: 'transparent',
                  lineHeight: 30,
                }}>
                Premium Feature
              </Text>
              <View
                style={{
                  marginVertical: 10,
                  alignItems: 'center',
                  alignSelf: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: 'Poppins',
                    textAlign: 'center',
                    color: '#696969',
                    fontWeight: '700',
                    backgroundColor: 'transparent',
                    lineHeight: 15,
                  }}>
                  This feature is locked
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: 'Poppins',
                    textAlign: 'center',
                    color: '#696969',
                    fontWeight: '700',
                    backgroundColor: 'transparent',
                    lineHeight: 15,
                    marginTop: 5,
                  }}>
                  {' '}
                  please subscribe to access
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.buttonPaddo]}
              activeOpacity={0.5}
              onPress={() => {
                navigation.navigate('Subscription');
                dispatch(setSubscriptiomModal(false));
              }}>
              <LinearGradient
                start={{x: 0, y: 1}}
                end={{x: 1, y: 0}}
                colors={['#D5191A', '#941000']}
                style={[
                  styles.buttonPaddo,
                  {
                    justifyContent: 'space-evenly',
                  },
                ]}>
                <Image
                  source={require('../../Icon/Images/NewImage/vip.png')}
                  style={{width: 25, height: 25}}
                  tintColor={AppColor.WHITE}
                />
                <Text style={[styles.buttonText, {left: 10}]}>Subscribe</Text>
              </LinearGradient>
            </TouchableOpacity>
            <View style={{marginVertical: 10}}>
              <Text style={[styles.buttonText, {color: '#505050'}]}>OR</Text>
            </View>
            <TouchableOpacity
              style={[
                styles.buttonPaddo2,
                {
                  justifyContent: 'space-evenly',
                },
              ]}
              activeOpacity={0.5}
              onPress={() => {
                // MyRewardedAd(setreward).load();
                dispatch(setSubscriptiomModal(false));
              }}>
              <LinearGradient
                start={{x: 0, y: 1}}
                end={{x: 1, y: 0}}
                colors={['#D9D9D9', '#D9D9D9']}
                style={[
                  styles.buttonPaddo2,
                  {
                    justifyContent: 'space-evenly',
                  },
                ]}>
                <Image
                  source={require('../../Icon/Images/NewImage/ads.png')}
                  style={{width: 25, height: 25}}
                />
                <Text
                  style={[styles.buttonText, {color: '#505050', left: 10}]}>
                  Watch Ads to unlock Workouts
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  const AnimatedDayCard = ({
    entryIndex = 0,
    style,
    disabled,
    onPress,
    children,
  }: any) => {
    const opacity = useSharedValue(0);
    const translateY = useSharedValue(14);
    const scale = useSharedValue(1);

    useEffect(() => {
      const delay = Math.min(entryIndex, 10) * 45;
      opacity.value = withDelay(delay, withTiming(1, {duration: 280}));
      translateY.value = withDelay(delay, withTiming(0, {duration: 280}));
    }, []);

    const enterStyle = useAnimatedStyle(() => ({
      opacity: opacity.value,
      transform: [{translateY: translateY.value}],
    }));
    const pressStyle = useAnimatedStyle(() => ({
      transform: [{scale: scale.value}],
    }));

    return (
      <Animated.View style={enterStyle}>
        <Animated.View style={pressStyle}>
          <TouchableOpacity
            disabled={disabled}
            activeOpacity={0.85}
            style={style}
            onPressIn={() => {
              scale.value = withTiming(0.97, {duration: 100});
            }}
            onPressOut={() => {
              scale.value = withSpring(1, {damping: 14, stiffness: 220});
            }}
            onPress={onPress}>
            {children}
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    );
  };

  const Box = ({item, index, active, percent, selectedIndex}: any) => {
    const isRestDay = item?.total_rest == 0;
    const isCompleted = percent && !isRestDay;
    const isCurrent = selectedIndex && !isCompleted && !isRestDay;
    const isLocked =
      !isRestDay && !isCompleted && !isCurrent && index != 1 && !active;

    const cardTint = isCompleted
      ? ['#F2FBF8', AppColor.WHITE]
      : isCurrent
      ? ['#FFF3F2', AppColor.WHITE]
      : isLocked
      ? ['#F4F4F4', '#F4F4F4']
      : isRestDay
      ? ['#FAFAFA', '#FAFAFA']
      : [AppColor.WHITE, AppColor.WHITE];

    const accentColor = isCompleted
      ? AppColor.NEW_SUBS_GREEN
      : isCurrent
      ? AppColor.RED1
      : 'transparent';

    const onPressDay = () => {
      analytics().logEvent(`CV_FITME_CLICKED_ON_DAY_${index}_EXERCISES`);
      AddCountFunction();
      index - 1 == 0 || active
        ? navigation.navigate('OneDay', {
            data: data,
            dayData: item,
            day: index,
            trainingCount: trainingCount,
            challenge,
          })
        : showMessage({
            message: `Please complete day ${
              index - 1
            } workout to unlock day ${index}`,
            type: 'danger',
            duration: 1000,
            floating: true,
          });
    };

    return (
      <>
        <AnimatedDayCard
          entryIndex={index - 1}
          disabled={isRestDay}
          onPress={onPressDay}
          style={[
            styles.dayCard,
            {
              borderLeftWidth: 4,
              borderLeftColor: accentColor,
              borderStyle: isRestDay ? 'dashed' : 'solid',
              opacity: isLocked ? 0.75 : 1,
            },
          ]}>
          <LinearGradient
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            colors={cardTint}
            style={styles.dayCardGradient}>
            {isRestDay ? (
              <View style={styles.restBadge}>
                <Image
                  source={localImage.Rest}
                  style={styles.restIcon}
                  resizeMode="contain"
                />
              </View>
            ) : isCompleted ? (
              <View
                style={[
                  styles.numberBadge,
                  {backgroundColor: AppColor.NEW_SUBS_GREEN},
                ]}>
                <Icons name="check-bold" size={22} color={AppColor.WHITE} />
              </View>
            ) : isCurrent ? (
              <LinearGradient
                start={{x: 0, y: 1}}
                end={{x: 1, y: 0}}
                colors={[AppColor.RED1, '#941000']}
                style={styles.numberBadge}>
                <Text style={styles.numberBadgeText}>
                  {index < 10 ? `0${index}` : index}
                </Text>
              </LinearGradient>
            ) : isLocked ? (
              <View style={[styles.numberBadge, styles.lockedBadge]}>
                <Icons name="lock-outline" size={20} color="#9A9A9A" />
              </View>
            ) : (
              <View style={[styles.numberBadge, styles.plainBadge]}>
                <Text style={[styles.numberBadgeText, {color: '#333333B2'}]}>
                  {index < 10 ? `0${index}` : index}
                </Text>
              </View>
            )}

            <View style={styles.dayCardContent}>
              <View style={{flexShrink: 1}}>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.category,
                    {color: isLocked ? '#33333380' : AppColor.BLACK},
                  ]}>{`Day ${index}`}</Text>
                {isRestDay ? (
                  <Text style={[styles.small, {color: '#696969'}]}>
                    Recovery day
                  </Text>
                ) : isCompleted ? (
                  <Text
                    style={[styles.small, {color: AppColor.NEW_SUBS_GREEN}]}>
                    Completed
                  </Text>
                ) : isLocked ? (
                  <Text style={[styles.small, {color: '#9A9A9A'}]}>
                    Locked
                  </Text>
                ) : (
                  <Text
                    style={[
                      styles.small,
                      {color: isCurrent ? '#505050' : '#33333380'},
                    ]}>
                    {formatDuration(item?.total_rest)}
                    {'  •  '}
                    {item?.total_calories} Kcal
                  </Text>
                )}
              </View>
              {isCompleted ? (
                <Icons
                  name="check-circle"
                  size={22}
                  color={AppColor.NEW_SUBS_GREEN}
                />
              ) : isLocked ? (
                <Icons name="lock-outline" size={20} color="#9A9A9A" />
              ) : !isRestDay ? (
                <Icons
                  name="chevron-right"
                  size={24}
                  color={isCurrent ? AppColor.RED1 : '#33333380'}
                />
              ) : null}
            </View>
          </LinearGradient>
        </AnimatedDayCard>
        {getAdsDisplay(index, item)}
      </>
    );
  };
  const noOrNoobPlan =
    getPurchaseHistory?.plan == null || getPurchaseHistory?.plan == 'noob';
  const getAdsDisplay = (index: number, item: any) => {
    const daysLength = Object.values(data?.days).length;
    const isNotLastPosition = index < daysLength - 1;

    if (daysLength >= 1 && isNotLastPosition) {
      if (index === 1) {
        return getNativeAdsDisplay();
      } else if ((index + 1) % 10 === 0 && daysLength > 10) {
        if (index + 1 == daysLength) return null;
        return getNativeAdsDisplay();
      }
    }
  };
  const getNativeAdsDisplay = () => {
    return (
      <View
        style={{
          alignSelf: 'center',
          alignItems: 'center',
        }}>
        {/* <NativeAddTest type="image" media={false} /> */}
      </View>
    );
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
  const ProgressBar = ({percentValue}: any) => {
    const width = useSharedValue(0);
    useEffect(() => {
      width.value = withTiming(percentValue, {duration: 600});
    }, [percentValue]);
    const barStyle = useAnimatedStyle(() => ({
      width: `${width.value}%`,
    }));
    return (
      <View style={styles.progressTrack}>
        <Animated.View style={[styles.progressFill, barStyle]} />
      </View>
    );
  };

  const ProgressHeader = () => (
    <View style={styles.progressCard}>
      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        colors={['#FFF5F5', AppColor.WHITE]}
        style={styles.progressGradient}>
        <View style={styles.progressTopRow}>
          <View style={{flexShrink: 1}}>
            <Text style={styles.progressTitle}>Your Progress</Text>
            <Text style={styles.progressSubtitle}>
              {completedDaysCount} of {totalDaysCount} days completed
            </Text>
          </View>
          <View style={styles.progressPercentBadge}>
            <Text style={styles.progressPercentText}>{progressPercent}%</Text>
          </View>
        </View>
        <ProgressBar percentValue={progressPercent} />
        <View style={styles.statsRow}>
          <View style={styles.statChip}>
            <Icons
              name="clock-time-four-outline"
              size={16}
              color={AppColor.RED1}
            />
            <Text style={styles.statChipText}>{formatDuration(totalTime)}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statChip}>
            <Icons name="dumbbell" size={16} color={AppColor.RED1} />
            <Text style={styles.statChipText}>{workoutDaysCount} Workouts</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statChip}>
            <Icons name="sleep" size={16} color={AppColor.RED1} />
            <Text style={styles.statChipText}>{restDays.length} Rest</Text>
          </View>
        </View>
        {challenge && (
          <View style={styles.challengeBadge}>
            <Icons name="trophy-outline" size={14} color="#8A6A00" />
            <Text style={styles.challengeBadgeText}>Challenge Mode</Text>
          </View>
        )}
      </LinearGradient>
    </View>
  );

  return (
    <View style={styles.container}>
      <Wrapper styles={{backgroundColor: AppColor.WHITE}}>
        <NewHeader1
          backButton
          header={
            data?.workout_title == undefined ? data?.title : data?.workout_title
          }
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: DeviceHeigth * 0.03,
            alignItems: 'center',
          }}>
          <ProgressHeader />
          <View style={{top: 10, width: '100%', alignItems: 'center'}}>
            {!refresh &&
              Object.values(data?.days).map((item: any, index: number) => {
                return (
                  <Box
                    key={index}
                    active={
                      selected != 0 &&
                      index <= selected &&
                      data?.days[index + 1]?.total_rest != 0
                    }
                    index={index + 1}
                    item={item}
                    percent={selected != 0 && index < selected}
                    // eslint-disable-next-line eqeqeq
                    selectedIndex={selected == index}
                  />
                );
              })}
          </View>
        </ScrollView>

        <ActivityLoader visible={refresh} />
        <PaddoMeterPermissionModal />
      </Wrapper>
    </View>
  );
};

export default WorkoutDays;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColor.WHITE,
    // paddingHorizontal: 5,
  },
  category: {
    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
    fontSize: 16,
    fontWeight: '500',
    color: AppColor.LITELTEXTCOLOR,
    lineHeight: 24,
  },
  small: {
    fontFamily: Fonts.MONTSERRAT_REGULAR,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },
  dayCard: {
    alignSelf: 'center',
    width: DeviceWidth * 0.95,
    borderRadius: 16,
    marginTop: 8,
    backgroundColor: AppColor.WHITE,
    shadowColor: 'grey',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.15,
        shadowRadius: 5,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  dayCardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: DeviceHeigth * 0.09,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  numberBadge: {
    height: DeviceWidth * 0.135,
    width: DeviceWidth * 0.135,
    borderRadius: (DeviceWidth * 0.135) / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberBadgeText: {
    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
    fontWeight: '700',
    fontSize: 18,
    color: AppColor.WHITE,
  },
  lockedBadge: {
    backgroundColor: '#EAEAEA',
  },
  plainBadge: {
    backgroundColor: AppColor.WHITE,
    borderWidth: 1,
    borderColor: '#D9D9D9',
  },
  restBadge: {
    height: DeviceWidth * 0.135,
    width: DeviceWidth * 0.135,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    backgroundColor: AppColor.WHITE,
  },
  restIcon: {
    height: DeviceWidth * 0.09,
    width: DeviceWidth * 0.09,
  },
  dayCardContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 12,
  },
  progressCard: {
    width: DeviceWidth * 0.95,
    borderRadius: 18,
    marginTop: 12,
    overflow: 'hidden',
    shadowColor: 'grey',
    ...Platform.select({
      ios: {
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.12,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  progressGradient: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#FBE4E2',
    padding: 16,
  },
  progressTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressTitle: {
    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
    fontWeight: '700',
    fontSize: 16,
    color: AppColor.BLACK,
  },
  progressSubtitle: {
    fontFamily: Fonts.MONTSERRAT_REGULAR,
    fontSize: 12,
    color: '#696969',
    marginTop: 3,
  },
  progressPercentBadge: {
    backgroundColor: AppColor.RED1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  progressPercentText: {
    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
    fontWeight: '700',
    fontSize: 13,
    color: AppColor.WHITE,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F0DEDD',
    marginTop: 14,
    overflow: 'hidden',
  },
  progressFill: {
    height: 8,
    borderRadius: 4,
    backgroundColor: AppColor.RED1,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  statChip: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statChipText: {
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    fontSize: 12,
    fontWeight: '600',
    color: '#505050',
    marginLeft: 5,
  },
  statDivider: {
    width: 1,
    height: 14,
    backgroundColor: '#E3D3D2',
  },
  challengeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: AppColor.LIGHT_YELLOW,
  },
  challengeBadgeText: {
    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
    fontSize: 11,
    fontWeight: '700',
    color: '#8A6A00',
    marginLeft: 5,
  },
  modalBackGround: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    paddingBottom: 30,
    backgroundColor: 'white',
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPaddo: {
    height: 45,
    borderRadius: 10,
    //width: DeviceWidth * 0.4,
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    // shadowColor: 'rgba(0, 0, 0, 1)',
    ...Platform.select({
      ios: {
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        // shadowRadius: 4,
      },
      android: {
        elevation: 200,
      },
    }),
  },
  buttonPaddo2: {
    flexDirection: 'row',
    height: 45,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',

    //bottom: DeviceHeigth * 0.05,
    shadowColor: 'rgba(0, 0, 0, 1)',
    ...Platform.select({
      ios: {
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        // shadowRadius: 4,
      },
      android: {
        elevation: 100,
      },
    }),
  },
  buttonText: {
    fontSize: 16,
    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
    textAlign: 'center',
    color: AppColor.WHITE,
    fontWeight: '700',
    backgroundColor: 'transparent',
  },
  loader: {
    position: 'absolute',
    justifyContent: 'center',

    backgroundColor: AppColor.GRAY,
    zIndex: 1,
    height: DeviceHeigth >= 1024 ? 120 : 80,
    width: DeviceHeigth >= 1024 ? DeviceWidth * 0.18 : DeviceWidth * 0.19,

    left: DeviceHeigth >= 1024 ? -20 : 0,
    borderRadius: 10,
  },
});
