import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  FlatList,
  Animated,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  AppState,
  Modal,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {SafeAreaView} from 'react-native';
import {AppColor} from '../../Component/Color';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../Component/Config';
import {localImage} from '../../Component/Image';
import LinearGradient from 'react-native-linear-gradient';
import VersionNumber from 'react-native-version-number';
import {setHealthData, setHomeGraphData} from '../../Component/ThemeRedux/Actions';
import AppleHealthKit from 'react-native-health';
import {NativeEventEmitter, NativeModules} from 'react-native';
import BackgroundService from 'react-native-background-actions';
import AskHealthPermissionAndroid from '../../Component/AndroidHealthPermission';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Dropdown} from 'react-native-element-dropdown';
import {LineChart} from 'react-native-chart-kit';
import AnimatedLottieView from 'lottie-react-native';
import {Slider} from '@miblanchard/react-native-slider';
import axios from 'axios';
import {setPedomterData} from '../../Component/ThemeRedux/Actions';
import {throttle, debounce} from 'lodash';
import {
  Stop,
  Circle,
  Svg,
  Text as SvgText,
  LinearGradient as SvgGrad,
} from 'react-native-svg';
import {CircularProgressBase} from 'react-native-circular-progress-indicator';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {BlurView} from '@react-native-community/blur';
import {
  isStepCountingSupported,
  parseStepData,
  startStepCounterUpdate,
  stopStepCounterUpdate,
} from '@dongminyu/react-native-step-counter';
import {navigationRef} from '../../../App';
import {useSelector, useDispatch} from 'react-redux';
// import ActivityLoader from '../../Component/ActivityLoader';
import {showMessage} from 'react-native-flash-message';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import RoundedCards from '../../Component/RoundedCards';
import {BackdropBlur, Canvas, Fill} from '@shopify/react-native-skia';
import {color} from 'd3';
import {Form} from 'formik';
import moment from 'moment';
import Graph from '../Yourself/Graph';
const zeroData = Array(7)
  .fill()
  .map((_, index) => {
    const currentDate = moment().subtract(index + 1, 'days');
    return {weight: 0, date: currentDate.date()};
  });
const GradientText = ({item}) => {
  const gradientColors = ['#D01818', '#941000'];

  return (
    <View
      style={{
        marginTop: 20,
        marginLeft: DeviceWidth * 0.03,
        justifyContent: 'center',
      }}>
      <Svg height="40" width={DeviceWidth * 0.9}>
        <SvgGrad id="grad" x1="0" y1="0" x2="100%" y2="0">
          <Stop offset="0" stopColor={gradientColors[0]} />
          <Stop offset="1" stopColor={gradientColors[1]} />
        </SvgGrad>
        <SvgText
          fontFamily="Poppins"
          fontWeight={'600'}
          fontSize={23}
          fill="url(#grad)"
          x="0"
          y="25">
          {item}
        </SvgText>
      </Svg>
    </View>
  );
};
const ProgressBar = ({progress, image, text}) => {
  return (
    <View
      style={[
        styles.progressBarContainer,
        {
          flexDirection: 'row',
          alignItems: 'center',
        },
      ]}>
      <View
        style={[
          styles.progressIndicator,
          {
            width: `${progress}%`,

            position: 'absolute',
          },
        ]}></View>
      <Image
        source={image}
        style={[
          styles.img,
          {
            height: 20,
            width: 20,
            marginHorizontal: 10,
          },
        ]}
        resizeMode="contain"></Image>
      <Text
        style={{
          fontSize: 12,
          fontWeight: '700',
          fontFamily: 'Poppins',
          lineHeight: 18,
          color: '#505050',
        }}>
        {text}
      </Text>
    </View>
  );
};
const Home = ({navigation}) => {
  useEffect(() => {
    setTimeout(() => {
      ActivityPermission();
    }, 3000);
  }, []);
  const [progress, setProgress] = useState(10);
  const [forLoading, setForLoading] = useState(false);
  const [value, setValue] = useState('Weekly');
  const [likeData, setLikeData] = useState([]);
  const [currentindex, setCurrentIndex] = useState(1);
  const [weeklyGraph,setWeeklyGraph]= useState([]);
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const {
    getHealthData,
    getLaterButtonData,
    completeProfileData,
    getUserID,
    getUserDataDetails,
    mindsetConsent,
    customWorkoutData,
    mealData,
    getPedomterData,
    ProfilePhoto
  } = useSelector(state => state);
  const [stepGoalProfile, setStepGoalProfile] = useState(
    getPedomterData[0] ? getPedomterData[0].RSteps : 5000,
  );
  const [DistanceGoalProfile, setDistanceGoalProfile] = useState(
    getPedomterData[1] ? getPedomterData[1].RDistance : 2.5,
  );
  const [CalriesGoalProfile, setCaloriesGoalProfile] = useState(
    getPedomterData[2] ? getPedomterData[2].RCalories : 25,
  );


  useEffect(() => {
    ActivityPermission();


    getGraphData();
  }, []);


  //   useEffect(() => {
  //     ActivityPermission();
  //   }, []);
  const ActivityPermission = async () => {
    if (Platform.OS == 'android') {
      const result = await isStepCountingSupported();
      console.debug('🚀 - isStepCountingSupported', result);
      const permissionStatus = await check(
        PERMISSIONS.ANDROID.ACTIVITY_RECOGNITION,
      );
      if (permissionStatus === RESULTS.DENIED && result.supported == true) {
        const permissionRequestResult = await request(
          PERMISSIONS.ANDROID.ACTIVITY_RECOGNITION,
        );
        if (
          permissionRequestResult === RESULTS.GRANTED &&
          result.supported == true
        ) {
          console.log('ACTIVITY_RECOGNITION permission granted');
          console.log('Resulllttt', RESULTS.GRANTED);
          startStepCounter();
        } else {
          console.log('ACTIVITY_RECOGNITION permission denied');
          // Handle the case where the permission request is denied
          await request(PERMISSIONS.ANDROID.ACTIVITY_RECOGNITION);
        }
      } else {
        console.log('ACTIVITY_RECOGNITION permission already granted');
        startStepCounter();
        // Permission was already granted previously
      }
    } else if (Platform.OS == 'ios') {
      AppleHealthKit.isAvailable((err, available) => {
        const permissions = {
          permissions: {
            read: [AppleHealthKit.Constants.Permissions.Steps],
          },
        };
        if (err) {
          console.log('error initializing Healthkit: ', err);
        } else if (available == true) {
          AppleHealthKit.initHealthKit(permissions, error => {
            if (error) {
              console.log('[ERROR] Cannot grant permissions!', error);
            } else {
              const options = {
                startDate: new Date(
                  new Date().getFullYear(),
                  new Date().getMonth(),
                  new Date().getDate(),
                  0,
                  0,
                  0,
                ),
                endDate: new Date(),
              };
              AppleHealthKit.getStepCount(options, (callbackError, results) => {
                if (callbackError) {
                  console.log('Error while getting the data');
                }
                setSteps(results.value);
                setDistance(((results.value / 20) * 0.01).toFixed(2));
                setCalories(((results.value / 20) * 1).toFixed(1));
                console.log('ios stespssss', results);
              });
            }
          });
        } else {
          Alert.alert(
            'Attention',
            "Health data can't be tracked in this Device due to its specifications",
            {},
          );
        }
      });
    }
  };
  // service

  // useEffect(() => {
  //   new NativeEventEmitter(NativeModules.AppleHealthKit).addListener(
  //     //NOT IMPLEMENTED YET
  //     'healthKit:StepCount:new',
  //     async () => {
  //       console.log('--> observer triggered');
  //     },
  //   );
  // });

  const getGraphData = async () => {
    console.log("FFFSDSAFSDFSDFESXZDSF" ,getUserDataDetails?.id)
    try {
      const payload = new FormData();
      // payload.append('user_id', 166);
      payload.append('user_id', getUserDataDetails?.id);
      setForLoading(true);
      const res = await axios({
        url: NewAppapi.HOME_GRAPH_DATA,
        method: 'post',
        data: {
          user_id:getUserDataDetails?.id}
      });
      if (res.data?.message != 'No data found') {
        setForLoading(false);
       console.log(res.data?.weekly_data, 'Graph Data ');
        dispatch(setHomeGraphData(res.data));
        const test = [];
        zeroData?.map((_, index) => {
          test.push({
            date: moment(res.data?.weekly_data[index]?.created_at).format(
              'DD-MM',
            ),
            weight: parseInt(res.data?.weekly_data[index]?.total_calories),
          });
        });
        console.log(test);
        setWeeklyGraph(test);
      } else {
        setForLoading(false);
        console.log(res.data, 'Graph Data message ');
        dispatch(setHomeGraphData([]));
      }
    } catch (error) {
      setForLoading(false);
      console.error(error, 'GraphError');
      dispatch(setHomeGraphData([]));
    }
  };

  /// backgrounf listner
  new NativeEventEmitter(NativeModules.AppleHealthKit).addListener(
    //NOT IMPLEMENTED YET
    'healthKit:StepCount:new',
    async () => {
      // console.log('--> observer triggered');
      AppleHealthKit.getStepCount(options, (callbackError, results) => {
        if (callbackError) {
          console.log('Error while getting the data');
        }
        setSteps(results.value);
        setDistance(((results.value / 20) * 0.01).toFixed(2));
        setCalories(((results.value / 20) * 1).toFixed(1));
        console.log('ios stespssss', results);
      });
    },
  );


  const likeStatusApi = async () => {
    try {
      const payload = new FormData();
      payload.append('login_token', getUserDataDetails?.login_token);
      payload.append('user_id', getUserDataDetails?.id);
      setForLoading(true);
      const res = await axios({
        url: NewAppapi.GET_LIKE_WORKOUTS,
        method: 'post',
        data: payload,
      });
      setForLoading(false);
      if (res.data) {
        setForLoading(false);
        console.log(...res.data, 'GET LIKES ');
        setLikeData(...res.data);
      }
    } catch (error) {
      setForLoading(false);
      console.error(error, 'LikeError');
      setLikeData([]);
    }
  };

  const postLike = async workoutID => {
    try {
      const payload = new FormData();
      payload.append('user_id', getUserDataDetails?.id);
      payload.append('workout_id', workoutID);
      setForLoading(true);
      const res = await axios({
        url: NewAppapi.POST_LIKE_WORKOUT,
        method: 'post',
        data: payload,
      });
      setForLoading(false);
      if (res.data) {
        setForLoading(false);
        console.log(res.data, 'POST LIKE');
        likeStatusApi();
      }
    } catch (error) {
      setForLoading(false);
      console.error(error, 'likeERRPost');
    }
  };
  const dispatch = useDispatch();
  const Dispatch = useDispatch();
  const [steps, setSteps] = useState(
    getHealthData[0] ? getHealthData[0].Steps : '0',
  );
  const [Calories, setCalories] = useState(
    getHealthData[1] ? getHealthData[1].Calories : '0',
  );
  const [distance, setDistance] = useState(
    getHealthData[2] ? getHealthData[2].DistanceCovered : '0',
  );
  // pedometers
  const PedoMeterData = async () => {
    try {
      const res = await axios({
        url: NewAppapi.PedometerAPI,
        method: 'post',
        data: {
          user_id: getUserDataDetails?.id,
          steps: getHealthData[0] ? getHealthData[0].Steps : '0',
          distance: getHealthData[1] ? getHealthData[1].Calories : '0',
          calories: getHealthData[2] ? getHealthData[2].DistanceCovered : '0',
        },
      });
      if (res.data) {
        console.log(res.data);
      }
    } catch (error) {
      console.log('PedometerAPi Error', error.response);
    }
  };
  const throttledDispatch = throttle(
    steps => {
      Dispatch(
        setHealthData([
          {Steps: steps},
          {Calories: Math.floor(steps / 20)},
          {DistanceCovered: ((steps / 20) * 0.01).toFixed(2)},
        ]),
      );
    },
    30000,
    {trailing: false},
  );
  const sleep = time =>
    new Promise(resolve => setTimeout(() => resolve(), time)); // background

  const veryIntensiveTask = async taskDataArguments => {
    const {delay} = taskDataArguments;

    const throttledUpdateStepsAndNotification = throttle(async data => {
      setSteps(data.steps);
      console.log('stepssss>>>>>>>>>', data.steps);
      setDistance(((data.steps / 20) * 0.01).toFixed(2));
      setCalories(Math.floor(data.steps / 20));
      // Add your dispatch logic here
      throttledDispatch(data.steps);

      // Update the notification with the current steps
      await BackgroundService.updateNotification({
        taskIcon: {
          name: 'ic_launcher',
          type: 'mipmap',
        },
        color: AppColor.RED,
        taskName: 'Pedometer',
        taskTitle: 'Steps ' + data.steps,
        taskDesc: 'Steps ',
        progressBar: {
          max: stepGoalProfile,
          value: data.steps,
          indeterminate: false,
        },
        parameters: {
          delay: 1000,
        },
      });
    }, 30000); // 30 seconds delay

    // function for checking if it is midnight or not
    const isSpecificTime = (hour, minute) => {
      const now = moment.utc(); // Get current time in UTC

      // Calculate specific time in UTC by setting hours and minutes
      const specificTimeUTC = now
        .clone()
        .set({hour, minute, second: 0, millisecond: 0});

      const istTime = moment.utc().add(5, 'hours').add(30, 'minutes');
      // Compare the times directly to check if they represent the same time in IST
      return istTime.format() == specificTimeUTC.format();
    };
    const debouncedResetSteps = () => {
      // Your logic to reset steps and related state
      setSteps(0);
      setDistance(0);
      setCalories(0);
      Dispatch(
        setHealthData([
          {Steps: '0'},
          {Calories: '0'},
          {DistanceCovered: '0.00'},
        ]),
      );

      // Update the notification after resetting steps
      BackgroundService.updateNotification({
        // Your notification update logic after steps reset
        taskIcon: {
          name: 'ic_launcher',
          type: 'mipmap',
        },
        color: AppColor.RED,
        taskName: 'Pedometer',
        taskTitle: 'Steps ' + steps,
        taskDesc: 'Steps ',
        progressBar: {
          max: stepGoalProfile,
          value: steps,
          indeterminate: false,
        },
        parameters: {
          delay: 30000,
        },
      });
    }; // 30 seconds d
    for (let i = 0; BackgroundService.isRunning(); i++) {
      startStepCounterUpdate(new Date(), async data => {
        // Call the throttled function
        await throttledUpdateStepsAndNotification(data);

        // Call the debounced function
      });

      // reset the steps at midnight
      if (isSpecificTime(0, 0)) {
        PedoMeterData();
        debouncedResetSteps();
      }

      // Use sleep with a delay of 30 seconds
      await sleep(delay);
    }
  };
  const options = {
    color: AppColor.RED,
    taskName: 'Pedometer',
    taskTitle: 'Steps ' + steps,
    taskDesc: '',
    progressBar: {
      max: stepGoalProfile,
      value: steps,
      indeterminate: false,
    },
    taskIcon: {
      name: 'ic_launcher',
      type: 'mipmap',
    },
    linkingURI: '@string/fb_login_protocol_scheme', // See Deep Linking for more info
    parameters: {
      delay: 1000,
    },
  };
  async function startStepCounter() {
    startStepCounterUpdate(new Date(), data => {
      setSteps(data.steps);
      console.log('stepssss>>>>>>>>>', data.steps);
      setDistance(((data.steps / 20) * 0.01).toFixed(2));
      setCalories(Math.floor(data.steps / 20));
      throttledDispatch(data.steps);
    });
    await BackgroundService.start(veryIntensiveTask, options);
    await BackgroundService.updateNotification(options);
  }
  const [modalVisible, setModalVisible] = useState(false);

  const handleLongPress = () => {
    setModalVisible(true); // Show the modal when long-press is detected
  };
  const closeModal = () => {
    setModalVisible(false); // Close the modal
  };
  const UpdateGoalModal = () => {
    const [Steps_Goal, setSteps_Goal] = useState(500);
    const [Calories_Goal, setCalories_Goal] = useState(25);
    const [Distance_Goal, setDistance_Goal] = useState(0.25);
    const [Step_Visible, setSteps_Visible] = useState(true);
    const [Distance_Visible, setDistance_Visible] = useState(false);
    const [Calories_Visible, setCalories_Visible] = useState(false);
    const ToggleVisiblity = num => {
      if (num == 1) {
        setSteps_Visible(!Step_Visible);
      } else if (num == 2) {
        setDistance_Visible(!Distance_Visible);
      } else {
        setCalories_Visible(!Calories_Visible);
      }
    };
    const ThumbImage1 = () => {
      return (
        <View
          style={{
            width: 35,
            height: 35,
            backgroundColor: AppColor.WHITE,
            borderRadius: 35 / 2,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={localImage.Step3}
            style={{width: 20, height: 20}}
            resizeMode="contain"
            tintColor={'#5FB67B'}
          />
        </View>
      );
    };
    const ThumbImage2 = () => {
      return (
        <View
          style={{
            width: 35,
            height: 35,
            backgroundColor: AppColor.WHITE,
            borderRadius: 35 / 2,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={localImage.Step2}
            style={{width: 20, height: 20}}
            resizeMode="contain"
          />
        </View>
      );
    };
    const ThumbImage3 = () => {
      return (
        <View
          style={{
            width: 35,
            height: 35,
            backgroundColor: AppColor.WHITE,
            borderRadius: 35 / 2,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={localImage.Step1}
            style={{width: 20, height: 20}}
            resizeMode="contain"
          />
        </View>
      );
    };
    const HandleSave = () => {
      setStepGoalProfile(Steps_Goal);
      setDistanceGoalProfile(Distance_Goal);
      setCaloriesGoalProfile(Calories_Goal);
      Dispatch(
        setPedomterData([
          {RSteps: Steps_Goal},
          {RDistance: Distance_Goal},
          {RCalories: Calories_Goal},
        ]),
      );
      closeModal();
    };

    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}>
        <BlurView
          style={styles.modalContainer}
          blurType="light"
          blurAmount={1}
          reducedTransparencyFallbackColor="white"
        />
        <View
          style={[styles.modalContent, {backgroundColor: AppColor.BACKGROUNG}]}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              source={localImage.Target}
              style={{width: DeviceWidth * 0.07, height: DeviceHeigth * 0.03}}
              resizeMode="contain"
            />
            <Text
              style={[styles.title, {color: AppColor.BLACK, marginLeft: 10}]}>
              Set Goals
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              marginTop: 15,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                source={localImage.Step3}
                style={{width: 30, height: 30}}
                tintColor={'#5FB67B'}
              />
              <Text style={styles.txt5}>Steps</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text
                style={[
                  {
                    color: AppColor.BoldText,
                    marginLeft: 10,
                    fontFamily: 'Poppins-SemiBold',
                  },
                ]}>
                {Steps_Goal + ' Steps'}
              </Text>
              <TouchableOpacity
                style={styles.dropButton}
                onPress={() => ToggleVisiblity(1)}>
                <Icons
                  name={Step_Visible ? 'chevron-up' : 'chevron-down'}
                  size={25}
                  color={'#000'}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{marginTop: 5}}>
            {Step_Visible ? (
              <Slider
                value={Steps_Goal}
                maximumValue={10000}
                minimumValue={500}
                step={1}
                onValueChange={value => {
                  setSteps_Goal(value);
                  setCalories_Goal((value * 0.05).toFixed(2));
                  setDistance_Goal((value * 0.0005).toFixed(2));
                }}
                minimumTrackTintColor="#5FB67B"
                renderThumbComponent={ThumbImage1}
                trackStyle={{height: 10, borderRadius: 20}}
              />
            ) : null}
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 15,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                source={localImage.Step2}
                style={{width: 30, height: 28}}
                resizeMode="contain"
              />
              <Text style={styles.txt5}>Distance</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text
                style={[
                  {
                    color: AppColor.BoldText,
                    marginLeft: 10,
                    fontFamily: 'Poppins-SemiBold',
                  },
                ]}>
                {Distance_Goal + ' km'}
              </Text>
              <TouchableOpacity
                style={styles.dropButton}
                onPress={() => ToggleVisiblity(2)}>
                <Icons
                  name={Distance_Visible ? 'chevron-up' : 'chevron-down'}
                  size={25}
                  color={'#000'}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{marginTop: 5}}>
            {Distance_Visible ? (
              <Slider
                value={Distance_Goal}
                maximumValue={5}
                step={1}
                onValueChange={value => {
                  setDistance_Goal(value);
                  setSteps_Goal((value * 2000).toFixed(0));
                  setCalories_Goal((value * 100).toFixed(2));
                }}
                minimumValue={0.25}
                minimumTrackTintColor="#FCBB1D"
                renderThumbComponent={ThumbImage2}
                trackStyle={{height: 10, borderRadius: 20}}
              />
            ) : null}
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 15,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                source={localImage.Step1}
                style={{width: 30, height: 25}}
                resizeMode="contain"
              />
              <Text style={styles.txt5}>Calories</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text
                style={[
                  {
                    color: AppColor.BoldText,
                    marginLeft: 10,
                    fontFamily: 'Poppins-SemiBold',
                  },
                ]}>
                {Calories_Goal + ' KCal'}
              </Text>
              <TouchableOpacity
                style={styles.dropButton}
                onPress={() => ToggleVisiblity(3)}>
                <Icons
                  name={Calories_Visible ? 'chevron-up' : 'chevron-down'}
                  size={25}
                  color={'#000'}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{marginTop: 5}}>
            {Calories_Visible ? (
              <Slider
                value={Calories_Goal}
                maximumValue={500}
                minimumValue={25}
                step={1}
                onValueChange={value => {
                  setCalories_Goal(value);
                  setDistance_Goal((value * 0.01).toFixed(2));
                  setSteps_Goal(value * 20);
                }}
                minimumTrackTintColor={AppColor.RED}
                renderThumbComponent={ThumbImage3}
                trackStyle={{height: 10, borderRadius: 20}}
              />
            ) : null}
          </View>
          <TouchableOpacity
            style={styles.Modal_Save_btton}
            activeOpacity={0.5}
            onPress={() => {
              HandleSave();
            }}>
            <LinearGradient
              colors={[AppColor.RED1, AppColor.RED1, AppColor.RED]}
              start={{x: 0, y: 1}}
              end={{x: 1, y: 0}}
              style={{
                width: DeviceWidth * 0.3,
                height: DeviceHeigth * 0.04,
                borderRadius: 12,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={[styles.title, {color: AppColor.WHITE}]}>Save</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  };
  const props = {
    activeStrokeWidth: 25,
    inActiveStrokeWidth: 25,
    inActiveStrokeOpacity: 0.35,
  };
  const data2 = [
    {label: 'Weekly', value: '1'},
    {label: 'Daily', value: '2'},
  ];
  const progressBarWidth = progressAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
    extrapolate: 'extend',
  });

  useEffect(() => {
    Animated.timing(progressAnimation, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: false,
    }).start();
  }, [progressAnimation]);

  const colors = [
    {color1: '#E2EFFF', color2: '#9CC2F5', color3: '#425B7B'},
    {color1: '#BFF0F5', color2: '#8DD9EA', color3: '#1F6979'},
    {color1: '#FAE3FF', color2: '#C97FCD', color3: '#7C3D80'},
    {color1: '#FFEBE2', color2: '#DCAF9E', color3: '#1E1E1E'},
  ];
  const colors1 = [
    {color1: '#E7D9FB'},
    {color1: '#D7FBFF'},
    {color1: '#DFEEFE'},
  ];

  const ListItem = ({title, color}) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('MeditationDetails', {item: title});
      }}>
      <LinearGradient
        start={{x: 0, y: 1}}
        end={{x: 1, y: 0}}
        colors={[color.color1, color.color2]}
        style={styles.listItem}>
        <Text
          style={[
            styles.title,
            {
              color: color.color3,
            },
          ]}>
          {title.workout_mindset_title}
        </Text>

        <Image
          source={
            title.workout_mindset_image_link != null
              ? {uri: title.workout_mindset_image_link}
              : localImage.Noimage
          }
          style={[
            styles.img,
            {
              height: 30,
              width: 30,
            },
          ]}
          resizeMode="cover"></Image>
      </LinearGradient>
    </TouchableOpacity>
  );
  const getTimeOfDayMessage = () => {
    const currentHour = new Date().getHours();

    if (currentHour >= 5 && currentHour < 12) {
      return 'Good Morning';
    } else if (currentHour >= 12 && currentHour < 17) {
      return 'Good Afternoon';
    } else if (currentHour >= 17 && currentHour < 21) {
      return 'Good Evening';
    } else {
      return 'Good Night';
    }
  };

  const renderItem = item => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>
      </View>
    );
  };
  const emptyComponent = () => {
    return (
      <View
        style={{
          flex: 1,
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
          }}
        />
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />
      <View style={styles.profileView}>
        <View style={styles.rewardView}>
          {/* <Image
            source={localImage.Money}
            style={[
              styles.img,
              {
                height: 30,
                width: 30,
              },
            ]}
            resizeMode="cover"></Image> */}
          {/* <Text style={styles.monetText}>500</Text> */}
        </View>

        {Object.keys(getUserDataDetails).length > 0 ? (
          <TouchableOpacity
            style={styles.profileView1}
            onPress={() => {
              navigation.navigate('Profile');
            }}>
         <Image
              source={
                getUserDataDetails.image_path == null
                  ? localImage.avt
                  :{uri:getUserDataDetails.image_path} 
              }
            style={styles.img}
            resizeMode="cover"></Image>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.profileView1}
            onPress={() => {
              navigation.navigate('Report');
            }}>
            <Image
              source={localImage.avt}
              style={styles.img}
              resizeMode="cover"></Image>
          </TouchableOpacity>
        )}

      </View>
      <GradientText
        item={
          getTimeOfDayMessage() +
          ', ' +
          (Object.keys(getUserDataDetails).length > 0
            ? getUserDataDetails.name
            : 'Guest')
        }
      />
      {/* {forLoading ? <ActivityLoader /> : ''} */}
      <ScrollView
        keyboardDismissMode="interactive"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{flexGrow: 1}}
        keyboardShouldPersistTaps="handled">
        <TouchableOpacity
          style={styles.CardBox}
          onLongPress={handleLongPress}
          activeOpacity={0.7}>
          <Text style={styles.healthText}>Health Overview</Text>
          <View style={styles.healthView}>
            <View style={styles.stepView}>
              <Text style={styles.healthText1}>Steps</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  source={localImage.Step3}
                  style={[
                    styles.img,
                    {
                      height: 35,
                      width: 25,
                      tintColor: '#5FB67B',
                    },
                  ]}
                  resizeMode="contain"></Image>
                <Text style={[styles.monetText, {color: '#5FB67B'}]}>
                  {steps}
                  <Text style={[styles.monetText, {color: '#505050'}]}>
                    {`/${stepGoalProfile} steps`}
                  </Text>
                </Text>
              </View>
              <Text style={styles.healthText1}>Distance</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  source={localImage.Step2}
                  style={[
                    styles.img,
                    {
                      height: 27,
                      width: 20,
                    },
                  ]}
                  resizeMode="contain"></Image>
                <Text style={[styles.monetText, {color: '#FCBB1D'}]}>
                  {distance}
                  <Text style={[styles.monetText, {color: '#505050'}]}>
                    {`/ ${DistanceGoalProfile} km `}
                  </Text>
                </Text>
              </View>
              <Text style={styles.healthText1}>Calories</Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingBottom: 10,
                }}>
                <Image
                  source={localImage.Step1}
                  style={[
                    styles.img,
                    {
                      height: 27,
                      width: 20,
                    },
                  ]}
                  resizeMode="contain"></Image>
                <Text style={[styles.monetText, {color: '#D01818'}]}>
                  {Calories}
                  <Text style={[styles.monetText, {color: '#505050'}]}>
                    {`/${CalriesGoalProfile} KCal`}
                  </Text>
                </Text>
              </View>
            </View>
            <View style={styles.stepImageView}>
              <CircularProgressBase
                {...props}
                value={Calories}
                maxValue={getPedomterData[3]?getPedomterData[3].RCalories:500}
                radius={32}
                activeStrokeColor={'#941000'}
                inActiveStrokeColor={'#941000'}>
                <CircularProgressBase
                  {...props}
                  value={distance}
                  maxValue={getPedomterData[2]?getPedomterData[2].RDistance:2.5}
                  radius={55}
                  activeStrokeColor={'#FCBB1D'}
                  inActiveStrokeColor={'#FCBB1D'}>
                  <CircularProgressBase
                    {...props}
                    value={steps}
                    maxValue={getPedomterData[0]?getPedomterData[0].RSteps:5000}
                    radius={80}
                    activeStrokeColor={'#397E54'}
                    inActiveStrokeColor={'#397E54'}
                  />
                </CircularProgressBase>
              </CircularProgressBase>
            </View>
          </View>
        </TouchableOpacity>

        <>
          <View
            style={{
              flexDirection: 'row',
              width: '95%',
              alignSelf: 'center',
              top: DeviceHeigth * 0.03,
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                color: AppColor.BoldText,
                fontFamily: 'Poppins',
                fontWeight: '700',
                lineHeight: 24,
                fontSize: 16,

                justifyContent: 'flex-start',
              }}>
              Meditation
            </Text>
            {customWorkoutData?.minset_workout?.length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('MeditationDetails', {
                    item: customWorkoutData?.minset_workout[0],
                  });
                }}>
                <Icons name="chevron-right" size={25} color={'#000'} />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.meditionBox}>
            <FlatList
              data={customWorkoutData?.minset_workout}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item.id}
              ListEmptyComponent={emptyComponent}
              renderItem={({item, index}) => {
                return (
                  <ListItem
                    title={item}
                    color={colors[index % colors.length]}
                  />
                );
              }}
            />
          </View>
        </>

        <View
          style={{
            flexDirection: 'row',
            width: '95%',
            alignSelf: 'center',
            top: DeviceHeigth * 0.03,
            justifyContent: 'space-between',
            top: DeviceHeigth * 0.07,
          }}>
          <Text
            style={{
              color: AppColor.BoldText,
              fontFamily: 'Poppins',
              fontWeight: '700',
              lineHeight: 24,
              fontSize: 16,
              // marginLeft:20,
              justifyContent: 'flex-start',
            }}>
            Workouts
          </Text>
          {customWorkoutData?.workout?.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                showMessage({
                  message: 'Work in Progress',
                  floating: true,
                  duration: 500,
                  type: 'info',
                  icon: {icon: 'auto', position: 'left'},
                });
              }}>
              <Icons name="chevron-right" size={25} color={'#000'} />
            </TouchableOpacity>
          )}
        </View>
        <View
          style={[
            styles.meditionBox,
            {
              top: DeviceHeigth * 0.08,
            },
          ]}>
          <FlatList
            data={customWorkoutData?.workout}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id}
            ListEmptyComponent={emptyComponent}
            pagingEnabled
            renderItem={({item, index}) => {

              let totalTime = 0;
              let totalCal = 0;

              for (const day in item?.days) {
                // if (item?.days[day]?.total_rest == 0) {
                //   restDays.push(parseInt(day.split('day_')[1]));
                // }
                totalTime = totalTime + parseInt(item?.days[day]?.total_rest);
                totalCal = totalCal + parseInt(item?.days[day]?.total_calories);
              }

              return (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('WorkoutDays', {data: item})
                  }
                  activeOpacity={0.8}
                  style={[
                    styles.listItem1,
                    {
                      backgroundColor: colors1[index % colors1.length].color1,
                      marginTop: 20,
                    },
                  ]}>
                  <View style={{marginVertical: 10}}>
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.title,
                        {
                          alignSelf: 'center',
                          zIndex: 1,
                          left: -25,
                          color: AppColor.BoldText,
                          width: DeviceHeigth * 0.2,
                        },
                      ]}>
                      {item.workout_title}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginVertical: 10,
                      }}>
                      <View style={{top: 15}}>
                        <ProgressBar
                          progress={progress}
                          image={localImage.Play}
                          text={
                            totalTime > 60
                              ? `${(totalTime / 60).toFixed(0)} min`
                              : `${totalTime} sec`
                          }
                        />
                      </View>
                      <View style={{marginHorizontal: 10, top: 15}}>
                        <ProgressBar
                          progress={progress}
                          image={localImage.Step1}
                          text={totalCal + 'Kcal'}
                        />
                      </View>
                    </View>
                  </View>

                  <Image
                    source={localImage.GymImage}
                    style={{
                      height: DeviceHeigth * 0.16,
                      width: DeviceWidth * 0.35,

                      bottom: -50,
                      left: -30,
                      marginTop: -DeviceHeigth * 0.11,
                    }}
                    resizeMode="contain"></Image>
                  {/* <TouchableOpacity
                    style={[
                      styles.img,
                      {
                        height: 25,
                        width: 25,
                        // backgroundColor:'red',
                        left: -45,
                        borderRadius: 0,
                        top: -DeviceHeigth * 0.04,
                      },
                    ]}
                    onPress={() => postLike(item?.workout_id)}>
                    {likeData.includes(item?.workout_id) ? (
                      <Image
                        source={localImage.Heart}
                        resizeMode="contain"
                        style={{height: 25, width: 25}}
                      />
                    ) : (
                      <Image
                        source={localImage.dw7}
                        resizeMode="contain"
                        style={{height: 25, width: 25}}
                      />
                    )}
                  </TouchableOpacity> */}
                </TouchableOpacity>
              );
            }}
          />

          <View
            style={{
              flexDirection: 'row',
              top: DeviceHeigth * 0.01,
              justifyContent: 'center',
            }}>
            {/* {customWorkoutData?.workout.map((value, index) => (
              <View
                key={index}
                style={{
                  marginHorizontal: 5,
                  flexDirection: 'row',
                  height: 5,
                  width: 7,
                  borderRadius: 20,
                  backgroundColor: AppColor.GRAY2,
                }}></View>
            ))} */}
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            width: '95%',
            alignSelf: 'center',
            top: DeviceHeigth * 0.03,
            justifyContent: 'space-between',
            top: DeviceHeigth * 0.11,
          }}>
          <Text
            style={{
              color: AppColor.BoldText,
              fontFamily: 'Poppins',
              fontWeight: '700',
              lineHeight: 24,
              fontSize: 16,
              // marginLeft:20,
              justifyContent: 'flex-start',
            }}>
            Meals
          </Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Meals');
            }}>
            <Icons name="chevron-right" size={25} color={'#000'} />
          </TouchableOpacity>
        </View>
        <View
          style={[
            styles.meditionBox,
            {
              top: DeviceHeigth * 0.12,
            },
          ]}>
          <FlatList
            data={mealData.slice(0, 4)}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id}
            pagingEnabled
            renderItem={({item, index}) => {
              return (
                <>
                  <TouchableOpacity
                    style={styles.listItem2}
                    onPress={() => {
                      navigation.navigate('MealDetails', {item: item});
                    }}>
                    <Image
                      source={{uri: item.diet_image_link}}
                      style={[
                        styles.img,
                        {
                          height: 90,
                          width: 90,
                          borderRadius: 180 / 2,
                          alignSelf: 'center',
                          top: -5,
                        },
                      ]}
                      resizeMode="cover"></Image>
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.title,
                        {
                          fontSize: 13,
                          fontWeight: '500',
                          lineHeight: 18,
                          fontFamily: 'Poppins',
                          textAlign: 'center',
                          width: 50,
                          color: colors[index % colors.length].color3,
                        },
                      ]}>
                      {item.diet_title}
                    </Text>
                  </TouchableOpacity>
                </>
              );
            }}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            width: '95%',
            alignSelf: 'center',
            alignItems: 'center',
            top: DeviceHeigth * 0.03,
            justifyContent: 'space-between',
            top: DeviceHeigth * 0.1,
          }}>
          <Text
            style={{
              color: AppColor.BoldText,
              fontFamily: 'Poppins',
              fontWeight: '700',
              lineHeight: 24,
              fontSize: 16,
              // marginLeft:20,
              justifyContent: 'flex-start',
            }}>
            Activities
          </Text>

          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={data2}
            maxHeight={300}
            X
            labelField="label"
            valueField="value"
            placeholder={value}
            value={value}
            onChange={item => {
              setValue(item.value);
            }}
            renderItem={renderItem}
          />
        </View>
        <View
          style={{
            top: DeviceHeigth * 0.11,
            width: '95%',
            // height: 200,
            marginBottom: DeviceHeigth * 0.08,
            alignSelf: 'center',
            borderRadius: 10,
          }}>
      {weeklyGraph.length != 0 && zeroData.length != 0 ? (
            <Graph resultData={weeklyGraph} zeroData={zeroData} home={false} />
          ) : (
            <View style={{justifyContent: 'center', alignItems: 'center', height: DeviceHeigth* 0.2}}>
              {emptyComponent()}
            </View>
          )}
          {/* <LineChart
            data={{
              labels: ['Sun', 'Mon', 'Tue', 'Thur', 'Fri', 'Sat'],
              datasets: [
                {
                  data: [100, 0, 0, 0, 0, 0],
                },
              ],
            }}
            width={DeviceWidth * 0.95}
            height={300}
            yAxisInterval={1}
            chartConfig={{
              backgroundColor: 'white',
              backgroundGradientFrom: 'white',
              backgroundGradientTo: 'white',
              decimalPlaces: 1,
              color: () => {
                '#efefef';
              },
              labelColor: () => {
                '#efefef';
              },
              style: {
                borderRadius: 20,
              },
              propsForDots: {
                r: '3',
                strokeWidth: '5',
                stroke: 'red',
              },
            }}
            bezier
            style={{
              borderRadius: 10,
            }}
          /> */}
        </View>
      </ScrollView>
      {modalVisible ? <UpdateGoalModal /> : null}
    </SafeAreaView>
  );
};
var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColor.WHITE,
  },
  profileView: {
    flexDirection: 'row',
    width: '95%',
    justifyContent: 'space-between',
    height: DeviceHeigth * 0.06,
    alignItems: 'center',
    top: DeviceHeigth * 0.02,
  },
  profileView1: {
    height: 50,
    width: 50,
    borderRadius: 100 / 2,
  },
  img: {
    height: 50,
    width: 50,
    borderRadius: 100 / 2,
  },
  rewardView: {
    height: 40,
    width: 80,
    // borderRadius: 30,
    //borderColor: AppColor.RED,
    // borderWidth: 1,
    marginLeft: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 5,
  },
  monetText: {
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 15,
    fontFamily: 'Poppins',
    marginLeft: 10,
  },
  CardBox: {
    width: '95%',
    alignSelf: 'center',
    backgroundColor: 'white',
    top: DeviceHeigth * 0.02,
    borderRadius: 10,
    paddingLeft: DeviceWidth * 0.04,

    shadowColor: 'rgba(0, 0, 0, 1)',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  healthText: {
    fontFamily: 'Poppins',
    fontWeight: '500',
    lineHeight: 18,
    fontSize: 14,
    color: AppColor.BoldText,
    marginTop: 10,
  },
  healthView: {
    flexDirection: 'row',
  },
  stepView: {
    width: '55%',
  },
  stepImageView: {
    height: DeviceHeigth * 0.2,
    justifyContent: 'center',
    width: DeviceWidth * 0.4,
    alignItems: 'center',
    paddingRight: DeviceWidth * 0.04,
  },
  healthText1: {
    fontFamily: 'Poppins',
    fontWeight: '500',
    lineHeight: 15,
    fontSize: 12,
    color: AppColor.BoldText,
    marginVertical: DeviceHeigth * 0.01,
  },
  listItem: {
    width: DeviceWidth * 0.4,
    height: 60,
    marginHorizontal: 10,
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 27,
    fontFamily: 'Poppins',
  },
  meditionBox: {
    width: '95%',
    alignSelf: 'center',
    backgroundColor: 'white',
    top: DeviceHeigth * 0.05,
    alignItems: 'center',
  },
  meditionText: {
    width: '95%',
    alignSelf: 'center',
    backgroundColor: 'white',
    top: DeviceHeigth * 0.03,
    justifyContent: 'center',
    color: AppColor.BoldText,
    fontFamily: 'Poppins',
    fontWeight: '700',
    lineHeight: 24,
    fontSize: 16,
  },

  listItem1: {
    width: DeviceWidth * 0.9,
    marginHorizontal: 10,
    borderRadius: 10,
    paddingLeft: 10,
    // paddingRight: 10,
    paddingBottom: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  listItem2: {
    marginHorizontal: 10,
    borderRadius: 10,
    padding: 20,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColor.WHITE,
    marginBottom: 30,
    shadowColor: 'rgba(0, 0, 0, 1)',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  progressBarContainer: {
    width: DeviceWidth * 0.25,
    height: DeviceHeigth * 0.05,
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressIndicator: {
    height: '100%',
    backgroundColor: '#D018184D',
  },
  dropdown: {
    margin: 16,
    height: 30,
    width: DeviceWidth * 0.25,
    borderColor: 'red',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    shadowColor: '#000',
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textItem: {
    flex: 1,
    fontSize: 16,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // Semi-transparent background
  },
  modalContent: {
    padding: 20,
    borderRadius: 8,
    width: DeviceWidth * 0.95,
    position: 'absolute',
    top: DeviceHeigth / 6,
    marginHorizontal: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOpacity: 0.2,
        shadowOffset: {height: 5, width: 0},
      },
      android: {
        elevation: 5,
      },
    }),
  },
  txt5: {
    color: AppColor.BLACK,
    marginLeft: 10,
    fontFamily: 'Poppins-Regular',
    fontWeight: '500',
  },
  dropButton: {
    backgroundColor: AppColor.WHITE,
    width: 25,
    height: 25,
    borderRadius: 25 / 2,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOpacity: 0.3,
        shadowOffset: {height: 5, width: 0},
        shadowRadius: 20,
      },
      android: {
        elevation: 5,
      },
    }),
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  Modal_Save_btton: {
    width: DeviceWidth * 0.3,
    height: DeviceHeigth * 0.04,
    borderRadius: 12,
    alignSelf: 'center',
    marginTop: 8,
  },
});
export default Home;
