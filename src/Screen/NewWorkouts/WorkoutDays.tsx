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
import React, {useCallback, useEffect, useState} from 'react';
import {AppColor, Fonts} from '../../Component/Color';
import Header from '../../Component/Headers/NewHeader';
import GradientText from '../../Component/GradientText';
import moment from 'moment';
import {Canvas, Circle, Group, Line, vec} from '@shopify/react-native-skia';
import LinearGradient from 'react-native-linear-gradient';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../Component/Config';
import ProgressButton from '../../Component/ProgressButton';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import {localImage} from '../../Component/Image';
import {showMessage} from 'react-native-flash-message';
import axios from 'axios';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import ActivityLoader from '../../Component/ActivityLoader';
import analytics from '@react-native-firebase/analytics';
import {MyInterstitialAd, MyRewardedAd} from '../../Component/BannerAdd';
import {
  setSubscriptiomModal,
  setVideoLocation,
} from '../../Component/ThemeRedux/Actions';
import AnimatedLottieView from 'lottie-react-native';
import RNFetchBlob from 'rn-fetch-blob';
const WorkoutDays = ({navigation, route}: any) => {
  const {data} = route.params;
  const [selected, setSelected] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [open, setOpen] = useState(true);
  const [phase, setPhase] = useState(1);
  const [day, setDay] = useState(1);
  const [trainingCount, setTrainingCount] = useState(-1);
  const [totalCount, setTotalCount] = useState(-1);
  const [trackerData, setTrackerData] = useState([]);
  const [exerciseData, setExerciseData] = useState([]);
  const [downloaded, setDownloade] = useState(0);
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
        url: NewAppapi.CURRENT_DAY_EXERCISE_DETAILS,
        method: 'post',
        data: payload,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data?.msg != 'No data found') {
        // if(res.data?.user_details)
        const result = analyzeExerciseData(res.data?.user_details);

        if (result.two.length == 0) {
          let day = parseInt(result.one[result.one.length - 1]);
          for (const item of Object.entries(data?.days)) {
            const index = parseInt(item[0].split('day_')[1]);

            if (item[1]?.total_rest == 0 && index == day + 1) {
              setSelected(index);
              setDay(index + 1);
              break;
            } else {
              setSelected(day + 1);
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
        console.log('videoExists', videoExists, 100 / (len - index), filePath);
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
            console.log(
              'File downloaded successfully!',
              res.path(),
              100 / (len - index),
            );
            // Linking.openURL(`file://${fileDest}`);
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
  const BlackCircle = ({indexes, select, index}: any) => {
    return (
      <View
        style={{
          backgroundColor: 'white',
          marginRight: 10,
          marginLeft: 0,
          width: 30,
          overflow: 'hidden',
          height:
            select && trainingCount != -1
              ? DeviceHeigth * 0.2
              : DeviceHeigth * 0.1,
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: index == 0 || index == 4 ? DeviceHeigth * 0.05 : 0,
        }}>
        {index < selected ? (
          <Image
            source={localImage.BlackCircle}
            style={{height: 30, width: 30}}
          />
        ) : (
          <Image
            source={localImage.GreyCircle}
            style={{height: 30, width: 30}}
          />
        )}
      </View>
    );
  };

  // const resetFitmeCount=()=>{
  //   return null
  // }
  const Phase = ({index, percent, select}: any) => {
    const gradientColors = ['#D5191A', '#941000'];
    return (
      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'flex-end',
          alignItems: 'center',
        }}>
        <View
          style={{
            height: 5,
            width: DeviceWidth * 0.2,
            borderRadius: 5,
            overflow: 'hidden',
            backgroundColor: '#d9d9d9',
          }}>
          <LinearGradient
            colors={gradientColors}
            start={{x: 0, y: 1}}
            end={{x: 1, y: 0}}
            style={{
              height: 5,
              width: percent == 100 ? '100%' : `${percent}%`,
            }}
          />
        </View>
        <GradientText
          text={index == 1 && day > 4 ? '100%' : `${percent}%`}
          fontSize={14}
          marginTop={0}
          y={20}
          width={50}
        />
      </View>
    );
  };

  const Box = ({selected, item, index, active, percent}: any) => {
    return (
      <TouchableOpacity
        disabled={item?.total_rest == 0}
        style={[
          styles.box,
          {
            width:
              DeviceHeigth < 1280 ? DeviceWidth * 0.95 : DeviceWidth * 0.99,
            height: DeviceHeigth * 0.1,
          },
        ]}
        activeOpacity={1}
        onPress={() => {
          analytics().logEvent(`CV_FITME_CLICKED_ON_DAY_${index}_EXERCISES`);
          index - 1 == 0
            ? navigation.navigate('OneDay', {
                data: data,
                dayData: item,
                day: index,
                trainingCount: trainingCount,
              })
            : active
            ? navigation.navigate('OneDay', {
                data: data,
                dayData: item,
                day: index,
                trainingCount: trainingCount,
              })
            : showMessage({
                message: `Please complete Day ${index - 1} Exercise First !!!`,
                type: 'danger',
              });
        }}>
        <LinearGradient
          start={{x: 1, y: 0}}
          end={{x: 0, y: 1}}
          colors={
            percent && item?.total_rest != 0
              ? ['#941000','#D5191A',]
              : [AppColor.WHITE, AppColor.WHITE]
          }
          style={[
            styles.box,
            {
              width:
                DeviceHeigth < 1280 ? DeviceWidth * 0.95 : DeviceWidth * 0.99,
              height: DeviceHeigth * 0.1,
            
            },
          ]}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {item?.total_rest == 0 ? (
              <Image
                source={localImage.Rest}
                style={{
                  height: DeviceWidth * 0.1,
                  width: DeviceWidth * 0.1,
                  marginLeft: DeviceWidth * 0.12,
                  opacity: percent ? 0.5 : 1,
                }}
                resizeMode="contain"
              />
            ) : (
              <Image
                source={{uri: data?.workout_image_link}}
                style={{
                  height: DeviceWidth * 0.15,
                  width: DeviceWidth * 0.15,
                  marginLeft: DeviceWidth * 0.12,
                  opacity: percent ? 0.5 : 1,
                }}
                resizeMode="contain"
              />
            )}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginHorizontal: 10,
                width: '80%',
              }}>
              <View>
                <Text
                  style={[
                    styles.category,
                    {
                      fontSize: 20,
                      color:
                        percent && item?.total_rest != 0
                          ? AppColor.WHITE
                          : AppColor.BLACK,
                    },
                  ]}>{`Day ${index}`}</Text>
                {item?.total_rest == 0 ? (
                  <Text
                    style={[
                      styles.small,
                      {
                        color:
                          percent && item?.total_rest != 0
                            ? AppColor.WHITE
                            : '#941000',
                      },
                    ]}>
                    Rest
                  </Text>
                ) : (
                  <Text
                    style={[
                      styles.small,
                      {
                        color:
                          percent && item?.total_rest != 0
                            ? AppColor.WHITE
                            : '#941000',
                      },
                    ]}>
                    {item?.total_rest > 60
                      ? `${(item?.total_rest / 60).toFixed(0)} min`
                      : `${item?.total_rest} sec`}
                    {'   '}
                    {
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: 5,
                        }}>
                        <Text
                          style={{
                            color:
                              percent && item?.total_rest != 0
                                ? AppColor.WHITE
                                : '#505050',
                            lineHeight: 25,
                            fontWeight: 'bold',
                            fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                            fontSize: 20,
                          }}>
                          .
                        </Text>
                      </View>
                    }
                    {'   '}
                    {item?.total_calories} Kcal
                    {/* {moment(139).format('S')} min | {item?.total_calories} Kcal */}
                  </Text>
                )}
              </View>
              {item?.total_rest != 0 && (
                <Icons
                  name={'chevron-right'}
                  size={25}
                  color={
                    percent && item?.total_rest != 0
                      ? AppColor.WHITE
                      : AppColor.BLACK
                  }
                  style={{marginRight: DeviceWidth * 0.02}}
                />
              )}
            </View>
          </View>
          {selected && trainingCount != -1 && (
            <ProgressButton
              text={
                downloaded > 0 && downloaded != 100
                  ? `Downloading`
                  : `Start Training`
              }
              w={DeviceWidth * 0.75}
              bR={10}
              mB={10}
              fill={
                totalCount == -1
                  ? '0%'
                  : `${100 - (trainingCount / totalCount) * 100}%`
              }
              h={DeviceHeigth * 0.08}
              // textStyle={{
              //   color:
              //     downloaded > 0 && downloaded != 100
              //       ? AppColor.BLACK
              //       : AppColor.WHITE,
              // }}
              onPress={() => {
                analytics().logEvent(
                  `CV_FITME_START_TRAINING_${day}_EXERCISES`,
                );
                navigation.navigate('Exercise', {
                  allExercise: exerciseData,
                  currentExercise:
                    trainingCount == -1
                      ? exerciseData[0]
                      : exerciseData[trainingCount],
                  data: data,
                  day: day,
                  exerciseNumber: trainingCount == -1 ? 0 : trainingCount,
                  trackerData: trackerData,
                });
              }}
            />
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  };


  return (
    <View style={styles.container}>
      <Header
        header={
          data?.workout_title == undefined ? 'Full Body' : data?.workout_title
        }
        backButton
        SearchButton={false}
      />
      <GradientText
        text={'Today'}
        fontWeight={'700'}
        fontSize={22}
        width={DeviceWidth}
        x={10}
        marginTop={-10}
      />
      <Text style={[styles.category, {marginTop: 10, marginLeft: 10}]}>
        {moment().format('dddd DD MMMM')}
      </Text>
      {!refresh && (
        <>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              // flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View>
              {Object.values(data?.days).map((item: any, index: number) => {
                return (
                  <Box
                    // selected={selected != 0 && index == selected}
                    // selected={false}
                    // active={selected != 0 && index <= selected}
                    // index={index + 1}
                    // item={item}
                    // percent={index == 0}
                    active={
                      selected != 0 &&
                      index <= selected &&
                      data?.days[index + 1]?.total_rest != 0
                    }
                    index={index + 1}
                    item={item}
                    percent={selected != 0 && index < selected}
                  />
                );
              })}
            </View>
          </ScrollView>
        </>
      )}
      {/* <ActivityLoader visible={refresh} /> */}
      <PaddoMeterPermissionModal />
    </View>
  );
};

export default WorkoutDays;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColor.WHITE,
    paddingHorizontal: 5,
  },
  category: {
    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
    fontSize: 26,
    fontWeight: '600',
    color: AppColor.LITELTEXTCOLOR,
    lineHeight: 30,
  },
  small: {
    fontFamily: Fonts.MONTSERRAT_REGULAR,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 30,
  },
  box: {
    //   flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 15,
    marginVertical: 8,
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0, 0, 0, 0.6)',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.5,
        // shadowRadius: 10,
      },
      android: {
        elevation: 4,
      },
    }),
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
});
