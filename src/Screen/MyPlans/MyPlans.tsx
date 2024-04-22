import {
  FlatList,
  Image,
  PanResponder,
  Platform,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {AppColor, Fonts} from '../../Component/Color';
import NewHeader from '../../Component/Headers/NewHeader';
import Play from '../NewWorkouts/Exercise/Play';
import {localImage} from '../../Component/Image';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../Component/Config';
import moment from 'moment';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import VersionNumber from 'react-native-version-number';
import LinearGradient from 'react-native-linear-gradient';
import GradientButton from '../../Component/GradientButton';
import axios from 'axios';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from 'react-native-gesture-handler';
import Timer from '../../Component/Timer';
import {useDispatch, useSelector} from 'react-redux';
import {
  setVideoLocation,
  setWeeklyPlansData,
} from '../../Component/ThemeRedux/Actions';
import RNFetchBlob from 'rn-fetch-blob';
import {showMessage} from 'react-native-flash-message';
import {useFocusEffect} from '@react-navigation/native';
import {MyPLans} from '../../Navigation/BottomTab';
import {Path, Svg} from 'react-native-svg';
import WorkoutsDescription from '../NewWorkouts/WorkoutsDescription';

export let handleStart = () => {};

const WeekArray = Array(7)
  .fill(0)
  .map(
    (item, index) =>
      (item = moment()
        .add(index, 'days')
        .subtract(moment().isoWeekday() - 1, 'days')
        .format('dddd')),
  );
const All_Weeks_Data = {};
const WeekTab = ({
  day,
  dayIndex,
  selectedDay,
  setSelectedDay,
  WeekStatus,
}: any) => {
  return (
    <TouchableOpacity
      key={dayIndex}
      onPress={() => setSelectedDay(dayIndex)}
      style={{
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: day == moment().format('dddd') ? '#FFDEDE' : 'white',
        borderColor: day == moment().format('dddd') ? '#D5191A' : 'white',
        borderRadius: day == moment().format('dddd') ? 25 : 0,
        padding: 5,
        borderWidth: day == moment().format('dddd') ? 1.5 : 0,
        width: 47,
        height: 45,
      }}>
      <Text
        style={[
          styles.labelStyle,
          {
            color: selectedDay == dayIndex ? AppColor.RED1 : AppColor.BoldText,
            fontWeight: '600',
            textTransform: 'capitalize',
          },
        ]}>
        {day.substring(0, 3)}
      </Text>
      <View>
        {WeekStatus?.includes(WeekArray[dayIndex]) ? (
          <Image
            source={localImage.RedTick}
            style={{width: 10, height: 10, marginBottom: -8}}
            resizeMode="contain"
          />
        ) : selectedDay == dayIndex ? (
          <>
            <View
              style={{
                width: DeviceWidth * 0.05,
                height: 1,
              }}
            />
            <LinearGradient
              colors={['#D5191A', '#941000']}
              start={{x: 0, y: 1}}
              end={{x: 1, y: 0}}
              style={{
                width: DeviceWidth * 0.03,
                height: 2,
                backgroundColor: 'red',
                alignSelf: 'center',
              }}
            />
          </>
        ) : (
          <View
            style={{
              width: 3,
              height: 3,
              borderRadius: 5,
              backgroundColor: AppColor.BoldText,
            }}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const Box = ({item, index}: any) => {
  const [isLoading, setIsLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const avatarRef = React.createRef();
  return (
    <TouchableOpacity
      key={index}
      onPress={() => setVisible(true)}
      activeOpacity={1}
      style={styles.box}>
      {/* <View
          style={{
            height: 60,
            width: 60,
            // backgroundColor: AppColor.WHITE,
            // borderRadius: 10,
          }}> */}
      {/* {isLoading && (
            <ShimmerPlaceholder
              style={{height: 75, width: 75, alignSelf: 'center'}}
              autoRun
              ref={avatarRef}
            />
          )} */}
      <Image
        source={{uri: item?.exercise_image_link}}
        onLoad={() => setIsLoading(false)}
        style={{
          height: 50,
          width: 50,
          alignSelf: 'center',
        }}
        resizeMode="contain"
      />
      <View
        style={{
          alignItems: 'center',
          marginHorizontal: 20,
        }}>
        <View>
          <Text
            style={{
              fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
              fontSize: 14,
              fontWeight: '500',
              color: AppColor.LITELTEXTCOLOR,
              lineHeight: 20,
            }}>
            {item?.exercise_title}
            {/* {item?.exercise_id} */}
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={{
                fontFamily: Fonts.MONTSERRAT_MEDIUM,
                fontSize: 12,
                fontWeight: '600',
                color: AppColor.BoldText,
                lineHeight: 30,
              }}>
              Set:
              <Text style={styles.small}>
                {' '}
                {item?.exercise_sets}
                {'   '}
              </Text>
              {
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                  <Text
                    style={[
                      styles.semiBold,
                      {
                        fontSize: 25,
                        color: '#505050',
                        lineHeight: 25,
                        fontWeight: 'bold',
                      },
                    ]}>
                    .
                  </Text>
                </View>
              }
              {'  '}
              Reps:
              <Text style={styles.small}>
                {' '}
                {item?.exercise_reps}
                {'   '}
              </Text>
              {
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                  <Text
                    style={[
                      styles.semiBold,
                      {
                        color: '#505050',
                        lineHeight: 25,
                        fontWeight: 'bold',
                      },
                    ]}>
                    .
                  </Text>
                </View>
              }
              {'  '}
              Time:
              <Text style={styles.small}>
                {' '}
                {item?.exercise_rest}
                {'   '}
              </Text>
            </Text>
          </View>
        </View>
      </View>
      <WorkoutsDescription data={item} open={visible} setOpen={setVisible} />
    </TouchableOpacity>
  );
};
const MyPlans = ({navigation}: any) => {
  const [downloaded, setDownloade] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [selectedDay, setSelectedDay] = useState((moment().day() + 6) % 7);
  const [WeekStatus, setWeekStatus] = useState([]);
  const getUserDataDetails = useSelector(
    (state: any) => state.getUserDataDetails,
  );
  const getWeeklyPlansData = useSelector(
    (state: any) => state.getWeeklyPlansData,
  );
  const getStoreVideoLoc = useSelector((state: any) => state.getStoreVideoLoc);
  const dispatch = useDispatch();
  useEffect(() => {
    Promise.all(WeekArray.map(item => allWorkoutApi(item))).finally(() =>
      dispatch(setWeeklyPlansData(All_Weeks_Data)),
    );
  }, []);
  useFocusEffect(
    useCallback(() => {
      WeeklyStatusAPI();
    }, [selectedDay]),
  );
  const allWorkoutApi = async (day: string) => {
    try {
      const res = await axios({
        url:
          NewAppapi.GET_PLANS_EXERCISE +
          '?version=' +
          VersionNumber.appVersion +
          '&day=' +
          day +
          '&user_id=' +
          getUserDataDetails.id,
      });
      if (res.data?.msg != 'User not exist.') {
        All_Weeks_Data[day] = res.data;
        // setExerciseData();
        // console.log('All_Weeks_Data', All_Weeks_Data);
      } else {
        All_Weeks_Data[day] = [];
      }
    } catch (error) {
      console.error(error, 'DaysAPIERror');
    }
  };
  const WeeklyStatusAPI = async () => {
    setRefresh(true);
    try {
      const res = await axios({
        url: NewAppapi.WEEKLY_STATUS + '?user_id=' + getUserDataDetails.id,
      });
      if (res.data?.msg != 'No data found.') {
        const days = new Set(); // Use a Set to store unique days
        res.data?.forEach((item: any) => {
          days.add(item.user_day);
        });
        console.log('DAYs', days);
        setWeekStatus([...days]);
      } else {
        setWeekStatus([]);
      }
      setRefresh(false);
    } catch (error) {
      console.error(error, 'WEEKLYSTATUS ERRR');
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
        setDownloade(true);
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
            setDownloade(true);
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
  let datas = [];
  handleStart = () => {
    Promise.all(
      getWeeklyPlansData[WeekArray[selectedDay]]?.map(
        (item: any, index: number) => {
          return downloadVideos(
            item,
            index,
            getWeeklyPlansData[WeekArray[selectedDay]]?.length,
          );
        },
      ),
    ).finally(beforeNextScreen);
  };

  const beforeNextScreen = async () => {
    for (const item of getWeeklyPlansData[WeekArray[selectedDay]]) {
      datas.push({
        user_id: getUserDataDetails?.id,
        workout_id: `-${selectedDay + 1}`,
        user_day: WeekArray[selectedDay],
        user_exercise_id: item?.exercise_id,
      });
    }
    try {
      const res = await axios({
        url: NewAppapi.CURRENT_DAY_EXERCISE,
        method: 'Post',
        data: {user_details: datas},
      });
      if (
        res.data?.msg == 'Exercise Status for All Users Inserted Successfully'
      ) {
        console.log('DATA ADDDDDDEDEDEDED', res.data?.inserted_data);
        navigation.navigate('Exercise', {
          allExercise: getWeeklyPlansData[WeekArray[selectedDay]],
          currentExercise:
            // trainingCount != -1
            //   ? exerciseData[trainingCount]
            getWeeklyPlansData[WeekArray[selectedDay]][0],
          data: [],
          day: selectedDay,
          exerciseNumber: 0,
          trackerData: res?.data?.inserted_data,
          type: 'weekly',
        });
      } else {
        toNextScreen();
      }
    } catch (error) {
      console.error(error, 'PostDaysAPIERror');
    }
  };
  const toNextScreen = async () => {
    setDownloade(false);
    const payload = new FormData();
    payload.append('user_id', getUserDataDetails?.id);
    payload.append('workout_id', `-${selectedDay + 1}`);
    payload.append('user_day', WeekArray[selectedDay]);
    payload.append('version', VersionNumber.appVersion);

    try {
      const res = await axios({
        url: NewAppapi.TRACK_CURRENT_DAY_EXERCISE,
        method: 'Post',
        data: payload,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res?.data?.msg == 'Please update the app to the latest version.') {
        showMessage({
          message: res?.data?.msg,
          type: 'danger',
          animationDuration: 500,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
      } else if (res.data?.user_details) {
        // console.log(res.data)
        navigation.navigate('Exercise', {
          allExercise: getWeeklyPlansData[WeekArray[selectedDay]],
          currentExercise:
            // trainingCount != -1
            //   ? exerciseData[trainingCount]
            getWeeklyPlansData[WeekArray[selectedDay]][0],
          data: [],
          day: selectedDay,
          exerciseNumber: 0,
          trackerData: res?.data?.user_details,
          type: 'weekly',
        });
      } else {
      }
    } catch (error) {
      console.error(error, 'PostDaysAPIERror');
    }
  };
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        // You can add more sophisticated gesture detection here
      },
      onPanResponderRelease: (event, gestureState) => {
        // Determine swipe direction
        const {dx, dy} = gestureState;
        if (dx > 50) {
          // Swiped right
          setSelectedDay(prevDay => (prevDay > 0 ? prevDay - 1 : 0));
        } else if (dx < -50) {
          // Swiped left
          setSelectedDay(prevDay =>
            prevDay < WeekArray.length - 1 ? prevDay + 1 : WeekArray.length - 1,
          );
        } else if (dy > 50) {
          allWorkoutApi(WeekArray[selectedDay]);
          WeeklyStatusAPI();
        }
      },
    }),
  ).current;

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: AppColor.WHITE,
      }}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />
      <NewHeader
        header={'Workout Plan'}
        SearchButton={false}
        backButton={false}
      />
      <View
        style={{
          flex: 1,
          marginTop:
            Platform.OS == 'ios' ? -DeviceWidth * 0.1 : -DeviceWidth * 0.05,
        }}>
        <View
          style={{
            flexDirection: 'row',
            width: DeviceWidth,
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: DeviceWidth * 0.05,
          }}>
          <Text
            style={[
              styles.semiBold,
              {marginLeft: 10, width: DeviceWidth * 0.7},
            ]}>
            Get Fit{' '}
            {
              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <Text
                  style={[
                    styles.semiBold,
                    {
                      color: AppColor.NewGray,
                      lineHeight: 25,
                      fontWeight: 'bold',
                    },
                  ]}>
                  .
                </Text>
              </View>
            }{' '}
            Week 1
          </Text>
          <GradientButton
            text="Start"
            onPress={handleStart}
            w={DeviceWidth * 0.15}
            weeklyAnimation={downloaded}
            h={35}
            mR={-DeviceWidth * 0.05}
            activeOpacity={1}
            textStyle={{
              fontSize: 12,
              fontFamily: Fonts.MONTSERRAT_REGULAR,
              lineHeight: 20,
              color: AppColor.WHITE,
              fontWeight: '700',
              zIndex: 1,
            }}
          />
        </View>
        <View {...panResponder.panHandlers} style={{flex: 1}}>
          <View
            style={{
              flexDirection: 'row',
              width: Platform.OS == 'ios' ? DeviceWidth : DeviceWidth * 0.95,
              justifyContent: 'space-between',
              alignItems: 'center',
              alignSelf: 'center',
            }}>
            {WeekArray.map((item: any, index: number) => (
              <WeekTab
                day={item}
                dayIndex={index}
                selectedDay={selectedDay}
                setSelectedDay={setSelectedDay}
                WeekStatus={WeekStatus}
              />
            ))}
          </View>
          <View style={{backgroundColor: AppColor.WHITE, flex: 1}}>
            <FlatList
              data={getWeeklyPlansData[WeekArray[selectedDay]]}
              keyExtractor={(item, index) => index.toString()}
              refreshControl={
                <RefreshControl
                  refreshing={refresh}
                  onRefresh={() => WeeklyStatusAPI()}
                  colors={[AppColor.RED, AppColor.WHITE]}
                />
              }
              renderItem={({item, index}: any) => (
                <Box item={item} index={index} />
              )}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MyPlans;

const styles = StyleSheet.create({
  semiBold: {
    color: AppColor.NewBlack,
    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
    fontSize: 16,
    lineHeight: 30,
    fontWeight: '700',
  },
  labelStyle: {
    fontWeight: '600',
    fontSize: 13,
    lineHeight: 20,
    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
  },
  category: {
    fontFamily: 'Poppins',
    fontSize: 16,
    fontWeight: '600',
    color: AppColor.BoldText,
    lineHeight: 30,
  },
  small: {
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    fontSize: 12,
    fontWeight: '500',
    color: AppColor.BoldText,
    lineHeight: 30,
  },
  box: {
    // justifyContent: 'space-between',
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    backgroundColor: '#FDFDFD',
    width: DeviceWidth * 0.95,
    padding: 10,
    marginVertical: 7,
    shadowColor: 'rgba(0, 0, 0, 1)',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
});
