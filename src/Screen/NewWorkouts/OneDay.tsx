import {
  ImageBackground,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AppColor, Fonts} from '../../Component/Color';

import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../Component/Config';
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import GradientButton from '../../Component/GradientButton';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import ActivityLoader from '../../Component/ActivityLoader';
import {
  setCount,
  setSubscriptiomModal,
  setVideoLocation,
} from '../../Component/ThemeRedux/Actions';
import {localImage} from '../../Component/Image';
import WorkoutDescription from '../NewWorkouts/WorkoutsDescription';
import VersionNumber from 'react-native-version-number';
import {showMessage} from 'react-native-flash-message';

import analytics from '@react-native-firebase/analytics';

import moment from 'moment';
import AnimatedLottieView from 'lottie-react-native';
import LinearGradient from 'react-native-linear-gradient';

import {
  Stop,
  Circle,
  Svg,
  Line,
  Text as SvgText,
  LinearGradient as SvgGrad,
} from 'react-native-svg';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {MyRewardedAd} from '../../Component/BannerAdd';
import RNFetchBlob from 'rn-fetch-blob';
import Play from './Exercise/Play';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';

const OneDay = ({navigation, route}: any) => {
  const {data, dayData, day, trainingCount, challenge} = route.params;
  const [exerciseData, setExerciseData] = useState([]);
  const [currentExercise, setCurrentExercise] = useState([]);
  const [trackerData, setTrackerData] = useState([]);
  const [open, setOpen] = useState(true);
  const [downloaded, setDownloade] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reward, setreward] = useState(0);
  const avatarRef = React.createRef();
  const [forLoading, setForLoading] = useState(true);

  const [loader, setLoader] = useState(false);

  const getStoreVideoLoc = useSelector((state: any) => state.getStoreVideoLoc);
  const getUserDataDetails = useSelector(
    (state: any) => state.getUserDataDetails,
  );
  const getPurchaseHistory = useSelector(
    (state: any) => state.getPurchaseHistory,
  );
  const getSubscriptionModal = useSelector(
    (state: any) => state.getSubscriptionModal,
  );
  const dispatch = useDispatch();
  let isFocuse = useIsFocused();
  let simerData = [1, 2, 3, 4, 5];

  useEffect(() => {
    if (isFocuse) {
      allWorkoutApi();
      getExerciseTrackAPI();
      setreward(0);
    }
  }, []);
  const allWorkoutApi = async () => {
    // setLoader(true);
    setForLoading(true);
    try {
      const res = await axios({
        // url:'https://fitme.cvinfotech.in/adserver/public/api/days?day=1&workout_id=44'
        url:
          NewAppapi.Get_DAYS +
          '?day=' +
          day +
          '&workout_id=' +
          data?.workout_id,
      });
      if (res.data?.msg != 'no data found.') {
        setLoader(false);
        setExerciseData(res.data);
        setForLoading(false);
        setOpen(true);
      } else {
        setLoader(false);
        data?.days['day_' + day] &&
          data?.days['day_' + day]?.exercises &&
          setExerciseData(data?.days['day_' + day]?.exercises);
        setForLoading(false);
        setOpen(true);
      }
    } catch (error) {
      setLoader(false);
      console.error(error, 'DaysAPIERror');
      setExerciseData([]);
      setForLoading(false);
      setOpen(true);
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
  const getExerciseTrackAPI = async () => {
    const payload = new FormData();
    payload.append('user_id', getUserDataDetails?.id);
    payload.append('workout_id', data?.workout_id);
    payload.append('user_day', day);
    payload.append('version', VersionNumber.appVersion);

    try {
      const res = await axios({
        url: challenge
          ? NewAppapi.TRACK_CURRENT_DAY_CHALLENGE_EXERCISE
          : NewAppapi.TRACK_CURRENT_DAY_EXERCISE,
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
        setTrackerData(res.data?.user_details);
      } else {
        setTrackerData([]);
      }
      setOpen(true);
    } catch (error) {
      setOpen(true);
      console.error(error, 'PostDaysAPIERror');
      setTrackerData([]);
    }
  };

  const postCurrentDayAPI = async () => {
    let datas = [];
    let trainingCount = -1;
    trainingCount = trackerData.findIndex(
      item => item?.exercise_status == 'undone',
    );

    for (const exercise of exerciseData) {
      datas.push({
        user_id: getUserDataDetails?.id,
        workout_id: data?.workout_id,
        user_day: day,
        user_exercise_id: exercise?.exercise_id,
      });
    }
    Promise.all(
      exerciseData.map((item: any, index: number) =>
        downloadVideos(item, index, exerciseData.length),
      ),
    ).finally(async () => {
      try {
        const res = await axios({
          url: challenge
            ? NewAppapi.CURRENT_DAY_CHALLENGE_EXERCISE
            : NewAppapi.CURRENT_DAY_EXERCISE,
          method: 'Post',
          data: {user_details: datas},
        });
        if (res.data) {
          if (
            res.data?.msg ==
            'Exercise Status for All Users Inserted Successfully'
          ) {
            console.log(res.data);
            setOpen(false);
            setDownloade(false);
            navigation.navigate('Exercise', {
              allExercise: exerciseData,
              currentExercise:
                trainingCount != -1
                  ? exerciseData[trainingCount]
                  : exerciseData[0],
              data: data,
              day: day,
              exerciseNumber: trainingCount != -1 ? trainingCount : 0,
              trackerData: res?.data?.inserted_data,
              type: 'day',
              challenge,
            });
          } else {
            console.log(trackerData);
            setOpen(false);
            setDownloade(false);
            navigation.navigate('Exercise', {
              allExercise: exerciseData,
              currentExercise:
                trainingCount != -1
                  ? exerciseData[trainingCount]
                  : exerciseData[0],
              data: data,
              day: day,
              exerciseNumber: trainingCount != -1 ? trainingCount : 0,
              trackerData: trackerData,
              type: 'day',
              challenge,
            });
          }
        }
      } catch (error) {
        console.error(error, 'PostDaysAPIERror');
      }
    });
  };

  const Box = ({selected, item, index}: any) => {
    const [isLoading, setIsLoading] = useState(true);
    return (
      <TouchableOpacity
        style={styles.box}
        activeOpacity={0.9}
        onPress={() => {
          setOpen(false);
          setCurrentExercise(item);
          setVisible(true);
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View
            style={{
              height: 80,
              width: 80,
              backgroundColor: AppColor.WHITE,

              borderRadius: 10,
            
              shadowColor: 'rgba(0, 0, 0, 1)',
              ...Platform.select({
                ios: {
                  //shadowColor: '#000000',
                  shadowOffset: {width: 0, height: 2},
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                },
                android: {
                  elevation: 3,
                },
              }),
            }}>
            {/* {isLoading && (
              <ShimmerPlaceholder
                style={{height: 75, width: 75, alignSelf: 'center'}}
                autoRun
                ref={avatarRef}
              />
            )} */}
            <Image
              source={{uri: 'file://' + getStoreVideoLoc[item?.exercise_title]}}
              // source={{uri: item?.exercise_image}}
              // onLoad={() => setIsLoading(false)}
              style={{height: 75, width: 75, alignSelf: 'center'}}
              resizeMode="contain"
            />
            {trackerData[index - 1]?.exercise_status == 'completed' && (
              <Image
                source={localImage.Complete}
                style={{
                  height: 30,
                  width: 30,
                  marginLeft:
                    Platform.OS == 'android'
                      ? DeviceHeigth * 0.05
                      : DeviceHeigth > 667
                      ? DeviceHeigth * 0.05
                      : DeviceHeigth * 0.06,
                  marginTop:
                    Platform.OS == 'android'
                      ? -DeviceHeigth * 0.035
                      : DeviceHeigth > 667
                      ? -DeviceHeigth * 0.03
                      : -DeviceHeigth * 0.035,
                }}
                resizeMode="contain"
              />
            )}
          </View>
          <View
            style={{
              alignItems: 'center',
              marginHorizontal: 20,
            }}>
            <View>
              <Text style={[styles.small, {fontSize: 14}]}>
                {item?.exercise_title}
              </Text>
              <Text style={styles.small}>{item?.exercise_rest}</Text>
            </View>
          </View>
        </View>

        <View style={{}}>
          <Icons
            name={'chevron-right'}
            size={25}
            color={AppColor.INPUTTEXTCOLOR}
          />
        </View>
      </TouchableOpacity>
      // <TouchableOpacity
      //   activeOpacity={1}
      //   onPress={() => {
      //     setOpen(false);
      //     setCurrentExercise(item);
      //     setVisible(true);
      //   }}
      //   style={[
      //     styles.box,
      //     {
      //       // backgroundColor:'red',
      //       height: DeviceHeigth * 0.1,
      //       marginVertical:
      //         Platform.OS == 'android'
      //           ? DeviceHeigth * 0.005
      //           : DeviceHeigth > 667
      //           ? 5
      //           : DeviceHeigth * 0.019,
      //     },
      //   ]}>
      //   <View
      //     style={{
      //       flexDirection: 'row',
      //       justifyContent: 'center',
      //       alignItems: 'center',
      //     }}>
      //     <View
      //       style={{
      //         height: 80,
      //         width: 80,
      //         backgroundColor: AppColor.WHITE,
      //         justifyContent: 'center',
      //         alignItems: 'center',
      //         marginLeft: DeviceWidth * 0.07,
      //         borderRadius: 10,
      //         ...Platform.select({
      //           ios: {
      //             shadowColor: AppColor.BLACK,
      //             shadowOffset: {width: 1, height: 1},
      //             shadowOpacity: 0.3,
      //             shadowRadius: 2,
      //           },
      //           android: {
      //             elevation: 5,
      //           },
      //         }),
      //       }}>
      //       <Image
      //         source={{uri: item?.exercise_image}}
      //         style={{height: 75, width: 75, alignSelf: 'center'}}
      //         resizeMode="contain"
      //       />
      //     </View>
      //     {trackerData[index - 1]?.exercise_status == 'completed' && (
      //       <Image
      //         source={localImage.Complete}
      //         style={{
      //           height: 40,
      //           width: 40,
      //           marginLeft: -DeviceWidth * 0.1,
      //           marginTop: -DeviceWidth * 0.09,
      //         }}
      //         resizeMode="contain"
      //       />
      //     )}
      //     <View
      //       style={{
      //         flexDirection: 'row',
      //         justifyContent: 'space-evenly',
      //         alignItems: 'center',
      //         marginHorizontal: 10,
      //         width: '65%',
      //       }}>
      //       <View>
      //         <Text style={[styles.small, {fontSize: 14}]}>
      //           {item?.exercise_title}
      //         </Text>
      //         <Text style={styles.small}>{item?.exercise_rest}</Text>
      //       </View>
      //       <Icons
      //         name={'chevron-right'}
      //         size={25}
      //         color={AppColor.INPUTTEXTCOLOR}
      //       />
      //     </View>
      //   </View>
      // </TouchableOpacity>
    );
  };
  const Box2 = () => {
    return (
      <View style={styles.box}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View
            style={{
              height: 80,
              width: 80,
              backgroundColor: AppColor.WHITE,

              borderRadius: 20,
            }}>
            <ShimmerPlaceholder
              style={{
                height: 75,
                width: 75,
                alignSelf: 'center',
                borderRadius: 20,
              }}
              autoRun
              ref={avatarRef}
            />
          </View>
          <View
            style={{
              alignItems: 'center',
              marginHorizontal: 20,
            }}>
            <View>
              <ShimmerPlaceholder
                style={{height: 10, width: 100, alignSelf: 'center'}}
                autoRun
                ref={avatarRef}
              />

              <ShimmerPlaceholder
                style={{height: 10, width: 100, alignSelf: 'center'}}
                autoRun
                ref={avatarRef}
              />
            </View>
          </View>
        </View>

        <View style={{}}>
          <ShimmerPlaceholder
            style={{height: 20, width: 40, alignSelf: 'center', top: 10}}
            autoRun
            ref={avatarRef}
          />
        </View>
      </View>
    );
  };
  if (reward == 1) {
    postCurrentDayAPI();
    setreward(0);
  }
  const PaddoMeterPermissionModal = () => {
    return (
      <Modal
        transparent
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
            <Icon
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
                MyRewardedAd(setreward).load();
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
                <Text style={[styles.buttonText, {color: '#505050', left: 10}]}>
                  Watch Ads to unlock Workouts
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: AppColor.WHITE,
        padding: 10,
      }}>
      <TouchableOpacity
        onPress={() => {
          setOpen(false);
          navigation.goBack();
        }}
        style={{
          marginTop: DeviceHeigth * 0.03,
        }}>
        <Icons
          name={'chevron-left'}
          size={30}
          color={AppColor.INPUTTEXTCOLOR}
        />
      </TouchableOpacity>
      <Image
        source={{uri: data?.workout_image_link}}
        style={{
          height: DeviceWidth * 0.5,
          width: DeviceWidth,
          alignSelf: 'center',
        }}
        resizeMode="contain"
      />
      {/* <View style={{height: DeviceHeigth * 0.4, marginLeft: 5}}>
         
        </View> */}
      <View style={styles.container}>
        <Text
          style={{
            fontWeight: '700',
            fontSize: 30,
            lineHeight: 40,
            fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
            color: AppColor.BLACK,
          }}>
          Day {day}
        </Text>
        <Text
          style={{
            fontWeight: '400',
            fontSize: 14,
            lineHeight: 30,
            fontFamily: 'Poppins',
            color: AppColor.BoldText,
            marginVertical: 5,
          }}>
          <Icons
            name={'clock-outline'}
            size={15}
            color={AppColor.INPUTTEXTCOLOR}
          />
          {dayData?.total_rest > 60
            ? ` ${(dayData?.total_rest / 60).toFixed(0)} min `
            : ` ${dayData?.total_rest} sec `}
          <Icons name={'fire'} size={15} color={AppColor.INPUTTEXTCOLOR} />
          {` ${dayData?.total_calories} Kcal`}
        </Text>
        <ScrollView
          contentContainerStyle={{flexGrow: 1}}
          showsVerticalScrollIndicator={false}
          style={{marginBottom: 100, flex: 1}}>
            {/* {exerciseData} */}
          {/* {exerciseData.map((item, index) => (
            <Box selected={-1} index={index + 1} item={item} key={index} />
          ))} */}
          {forLoading
            ? simerData.map((item, index) => <Box2 />)
            : exerciseData.map((item, index) => (
                <Box selected={-1} index={index + 1} item={item} key={index} />
              ))}
        </ScrollView>
        <GradientButton
          // play={false}
          // oneDay
          flex={0.01}
          text={downloaded ? `Downloading` : `Start Day ${day}`}
          h={80}
          textStyle={{
            fontSize: 20,
            fontFamily: 'Montserrat-SemiBold',
            lineHeight: 40,
            fontWeight: '700',
            zIndex: 1,
            color: AppColor.WHITE,
          }}
          alignSelf
          bR={40}
          // mB={80}
          bottm={40}
          weeklyAnimation={downloaded}
          // fillBack="#EB1900"
          // fill={downloaded > 0 ? `${100 / downloaded}%` : '0%'}
          onPress={() => {
            analytics().logEvent(`CV_FITME_STARTED_DAY_${day}_EXERCISES`);
            postCurrentDayAPI();
          }}
        />
      </View>
      {loader && <ActivityLoader visible={loader} />}
      <WorkoutDescription
        data={currentExercise}
        open={visible}
        setOpen={setVisible}
      />
      <PaddoMeterPermissionModal />
    </View>
  );
};

export default OneDay;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColor.WHITE,
    // alignItems: 'center',
    height: DeviceHeigth * 0.6,
    width: DeviceWidth,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    bottom: 0,
    position: 'absolute',
    padding: 20,
    // paddingTop: 50,
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0, 0, 0, 0.6)',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 5,
        // shadowRadius: 10,
      },
      android: {
        elevation: 10,
        shadowColor: 'rgba(0, 0, 0, 0.6)',
        shadowOffset: {width: 5, height: 5},
        shadowOpacity: 0.9,
        // shadowRadius: 10,
      },
    }),
  },
  category: {
    fontFamily: 'Poppins',
    fontSize: 16,
    fontWeight: '600',
    color: AppColor.BoldText,
    lineHeight: 30,
  },
  small: {
    fontFamily: 'Poppins',
    fontSize: 12,
    fontWeight: '500',
    color: AppColor.LITELTEXTCOLOR,
    lineHeight: 30,
  },
  box: {
    width: '100%',
    padding: 10,
    justifyContent: 'space-between',
    alignSelf: 'center',
    alignItems: 'center',
    marginVertical: 0,

    flexDirection: 'row',
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
    fontFamily: 'Poppins',
    textAlign: 'center',
    color: AppColor.WHITE,
    fontWeight: '700',
    backgroundColor: 'transparent',
  },
});
