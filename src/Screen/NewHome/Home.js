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
  Platform,
  Modal,
  Alert,
  RefreshControl,
} from 'react-native';
import React, {
  createRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {SafeAreaView} from 'react-native';
import {AppColor} from '../../Component/Color';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../Component/Config';
import {localImage} from '../../Component/Image';
import LinearGradient from 'react-native-linear-gradient';
import VersionNumber from 'react-native-version-number';
import {
  setHomeGraphData,
  setWorkoutTimeCal,
  setStepCounterOnOff,
  setCustomWorkoutData,
  Setmealdata,
  setFitmeAdsCount,
  setIsAlarmEnabled,
} from '../../Component/ThemeRedux/Actions';
import AppleHealthKit from 'react-native-health';
import {NativeEventEmitter, NativeModules} from 'react-native';
import BackgroundService from 'react-native-background-actions';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Dropdown} from 'react-native-element-dropdown';
import AnimatedLottieView from 'lottie-react-native';
import {Slider} from '@miblanchard/react-native-slider';
import axios from 'axios';
import {setPedomterData} from '../../Component/ThemeRedux/Actions';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import GoogleFit, {Scopes} from 'react-native-google-fit';
import {
  Stop,
  Circle,
  Svg,
  Line,
  Text as SvgText,
  LinearGradient as SvgGrad,
} from 'react-native-svg';
import {CircularProgressBase} from 'react-native-circular-progress-indicator';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {BlurView} from '@react-native-community/blur';
import {useSelector, useDispatch} from 'react-redux';
import {showMessage} from 'react-native-flash-message';
import {LineChart} from 'react-native-chart-kit';
import moment from 'moment';
import analytics from '@react-native-firebase/analytics';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import {ImageBackground} from 'react-native';
import {MyInterstitialAd} from '../../Component/BannerAdd';
import NativeAddTest from '../../Component/NativeAddTest';

import {AlarmNotification} from '../../Component/Reminder';
import notifee from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

let zeroData = [];
let zeroDataM = [];

const GradientText = ({item}) => {
  const gradientColors = ['#D01818', '#941000'];

  return (
    <View
      style={{
        marginTop: 20,
        marginLeft: DeviceWidth * 0.03,
        justifyContent: 'center',
        width: 50,
      }}>
      <Svg height="40" width={DeviceWidth * 0.9}>
        <SvgGrad id="grad" x1="0" y1="0" x2="100%" y2="0">
          <Stop offset="0" stopColor={gradientColors[0]} />
          <Stop offset="1" stopColor={gradientColors[1]} />
        </SvgGrad>
        <SvgText
          // fontFamily="Montserrat-SemiBold"
          lineHeight={20}
          width={50}
          fontWeight={'700'}
          fontSize={20}
          numberOfLines={1}
          fill="url(#grad)"
          x="0"
          y="20">
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
            width: `${progress != false ? progress : 10}%`,

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
          fontWeight: '600',
          fontFamily: 'Montserrat-SemiBold',
          lineHeight: 18,
          color: '#505050',
        }}>
        {text}
      </Text>
    </View>
  );
};
const Home = ({navigation}) => {
  const [value, setValue] = useState('Weekly');
  const [weeklyGraph, setWeeklyGraph] = useState([]);
  const [monthlyGraph, setMonthlyGraph] = useState([]);
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const [isLoading, setIsLoading] = useState(true);
  const [imageLoad, setImageLoad] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const avatarRef = React.createRef();
  const [PaddoModalShow, setPaddoModalShow] = useState(false);
  const Dispatch = useDispatch();

  const getUserDataDetails = useSelector(state => state.getUserDataDetails);
  const customWorkoutData = useSelector(state => state.customWorkoutData);
  const mealData = useSelector(state => state.mealData);
  const getPedomterData = useSelector(state => state.getPedomterData);
  const getUserID = useSelector(state => state.getUserID);
  const getCustttomeTimeCal = useSelector(state => state.getCustttomeTimeCal);
  const getStepCounterOnoff = useSelector(state => state.getStepCounterOnoff);
  const isAlarmEnabled = useSelector(state => state.isAlarmEnabled);
  const getPurchaseHistory = useSelector(state => state.getPurchaseHistory);
  const getStoreData = useSelector(state => state.getStoreData);
  const [stepGoalProfile, setStepGoalProfile] = useState(
    getPedomterData[0] ? getPedomterData[0].RSteps : 5000,
  );
  const [DistanceGoalProfile, setDistanceGoalProfile] = useState(
    getPedomterData[1] ? getPedomterData[1].RDistance : 2.5,
  );
  const [CalriesGoalProfile, setCaloriesGoalProfile] = useState(
    getPedomterData[2] ? getPedomterData[2].RCalories : 250,
  );
  const [steps, setSteps] = useState(0);
  const stepsRef = useRef(steps);
  const [Calories, setCalories] = useState(0);
  const caloriesRef = useRef(Calories);
  const [distance, setDistance] = useState(0);
  const distanceRef = useRef(distance);
  let isFocused = useIsFocused();
  useEffect(() => {
    if (!isAlarmEnabled) {
      notifee.getTriggerNotificationIds().then(res => console.log(res, 'ISDA'));
      const currenTime = new Date();
      currenTime.setHours(7);
      currenTime.setMinutes(0);
      //AlarmNotification(currenTime);
      AlarmNotification(currenTime)
        .then(res => console.log('ALARM SET', res))
        .catch((errr) => {
          console.log(errr)
          currenTime.setDate(currenTime.getDate() + 1)
          AlarmNotification(currenTime);
        });
      Dispatch(setIsAlarmEnabled(true));
    }
  }, []);

  useEffect(() => {
    if (isFocused) {
      getCustomeWorkoutTimeDetails();
      getGraphData(1);
      setTimeout(() => {
        ActivityPermission();
      }, 3000);
    }
  }, [isFocused]);
  // pedometer data sending to api
  const PedoMeterData = async () => {
    try {
      const res = await axios({
        url: NewAppapi.PedometerAPI,
        method: 'post',
        data: {
          user_id: getUserDataDetails?.id,
          steps: stepsRef.current,
          calories: caloriesRef.current,
          distance: distanceRef.current,
          version: VersionNumber.appVersion,
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
      }
    } catch (error) {
      console.log('PedometerAPi Error', error.response);
    }
  };
  const sleep = time =>
    new Promise(resolve => setTimeout(() => resolve(), time));
  const veryIntensiveTask = async taskDataArguments => {
    const {delay} = taskDataArguments;
    const isSpecificTime = (hour, minute) => {
      const now = moment.utc(); // Get current time in UTC
      const specificTimeUTC = now
        .clone()
        .set({hour, minute, second: 0, millisecond: 0});
      const istTime = moment.utc().add(5, 'hours').add(30, 'minutes');
      // Compare only the hours and minutes
      return (
        istTime.hours() === specificTimeUTC.hours() &&
        istTime.minutes() === specificTimeUTC.minutes()
      );
    };
    // Example usage with a specific time (midnight in IST)
    const specificHour = 23;
    const specificMinute = 29;
    await new Promise(async resolve => {
      for (let i = 0; BackgroundService.isRunning(); i++) {
        if (isSpecificTime(specificHour, specificMinute)) {
          PedoMeterData();
        } else {
        }
        try {
          const dailySteps = await GoogleFit.getDailySteps();
          dailySteps.reduce(
            (total, acc) =>
              (totalSteps = total + acc.steps[0] ? acc.steps[0].value : 0),
            0,
          );
        } catch (error) {
          console.error('Error fetching total steps', error);
        }
        BackgroundService.updateNotification({
          taskDesc: `${totalSteps}`,
          color: AppColor.RED,
          progressBar: {
            max: stepGoalProfile,
            value: stepsRef.current,
            indeterminate: false,
            color: AppColor.RED,
          },
          parameters: {
            delay: 60000,
          },
        });

        await sleep(delay);
      }
    });
  };
  const options1 = {
    taskName: 'StepUpdateBackgroundTask',
    taskTitle: `Steps`,
    taskDesc: `${stepsRef.current}`,
    taskIcon: {
      name: 'ic_launcher',
      type: 'mipmap',
    },
    progressBar: {
      max: stepGoalProfile,
      value: stepsRef.current,
      indeterminate: false,
    },
    color: AppColor.RED,
    linkingURI: 'yourapp://backgroundTask',
    parameters: {
      delay: 60000,
    },
  };
  const startStepUpdateBackgroundTask = async () => {
    try {
      await BackgroundService.start(veryIntensiveTask, options1);
    } catch (e) {
      console.error('Error starting step update background service:', e);
    }
  };
  const fetchData = async () => {
    if (!getStepCounterOnoff) {
      // setPaddoModalShow(true);
      Alert.alert('FitMe wants to track your health data !', '', [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Allow',
          onPress: () => {
            handleAlert();
          },
        },
      ]);
    } else {
      GoogleFit.authorize(options)
        .then(authResult => {
          if (authResult.success) {
            checkPermissions();
          } else {
          }
        })
        .catch(error => {
          console.error('Authentication error', error);
        });
    }
  };
  const options = {
    scopes: [Scopes.FITNESS_ACTIVITY_READ, Scopes.FITNESS_ACTIVITY_WRITE],
  };
  const handleAlert = async () => {
    setPaddoModalShow(false);
    await GoogleFit.authorize(options)
      .then(authResult => {
        if (authResult.success) {
          checkPermissions();
        } else {
        }
      })
      .catch(error => {
        console.error('Authentication error', error);
      });
  };
  const checkPermissions = async () => {
    const fitnessPermissionResult = await check(
      PERMISSIONS.ANDROID.ACTIVITY_RECOGNITION,
    );
    if (fitnessPermissionResult != RESULTS.GRANTED) {
      const permissionRequestResult = await request(
        PERMISSIONS.ANDROID.ACTIVITY_RECOGNITION,
      );
      if (permissionRequestResult === RESULTS.GRANTED) {
        if (getStepCounterOnoff == true) {
          fetchTotalSteps();
          startRecording();
        } else {
          fetchTotalSteps();
          startStepUpdateBackgroundTask();
          Dispatch(setStepCounterOnOff(true));
        }
      } else {
      }
    } else {
      if (getStepCounterOnoff == true) {
        fetchTotalSteps();
        startRecording();
      } else {
        fetchTotalSteps();
        startStepUpdateBackgroundTask();
        Dispatch(setStepCounterOnOff(true));
      }
    }
  };
  const startRecording = () => {
    GoogleFit.startRecording(() => {
      GoogleFit.observeSteps(() => {
        fetchTotalSteps();
      });
    });
  };
  const fetchTotalSteps = async () => {
    try {
      await AsyncStorage.setItem('hasPermissionForStepCounter', 'true');
      const dailySteps = await GoogleFit.getDailySteps();

      dailySteps.reduce(
        (total, acc) =>
          (totalSteps = total + acc.steps[0] ? acc.steps[0].value : 0),
        0,
      );
      stepsRef.current = totalSteps;
      setSteps(totalSteps);
      distanceRef.current = ((totalSteps / 20) * 0.01).toFixed(2);
      setDistance(((totalSteps / 20) * 0.01).toFixed(2));
      caloriesRef.current = ((totalSteps / 20) * 1).toFixed(1);
      setCalories(Math.round(((totalSteps / 20) * 1).toFixed(2)));
    } catch (error) {
      console.error('Error fetching total steps', error);
    }
  };
  const ActivityPermission = async () => {
    if (Platform.OS == 'android') {
      fetchData();
    } else if (Platform.OS == 'ios') {
      AppleHealthKit.isAvailable((err, available) => {
        const permissions = {
          permissions: {
            read: [AppleHealthKit.Constants.Permissions.StepCount],
          },
        };
        if (err) {
          console.log('error initializing Healthkit: ', err);
        } else if (available == true) {
          AppleHealthKit.initHealthKit(permissions, error => {
            Promise.resolve(
              AsyncStorage.setItem('hasPermissionForStepCounter', 'true'),
            );
            if (error) {
              console.log('[ERROR] Cannot grant permissions!', error);
            } else {
              new NativeEventEmitter(NativeModules.AppleHealthKit).addListener(
                // adding a listner here to record whenever new Steps will be sent from healthkit
                'healthKit:StepCount:new',
                async () => {
                  AppleHealthKit.getStepCount(
                    options,
                    (callbackError, results) => {
                      if (callbackError) {
                        console.log('Error while getting the data');
                      }
                      setSteps(results.value);
                      setDistance(((results.value / 20) * 0.01).toFixed(2));
                      setCalories(((results.value / 20) * 1).toFixed(1));
                    },
                  );
                },
              );
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
                }
                setSteps(results?.value);
                setDistance(((results?.value / 20) * 0.01).toFixed(2));
                setCalories(((results?.value / 20) * 1).toFixed(1));
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

  const getCustomeWorkoutTimeDetails = async () => {
    try {
      const data = await axios(`${NewAppapi.Custome_Workout_Cal_Time}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: {
          user_id: getUserID != 0 ? getUserID : getUserDataDetails.id,
        },
      });

      if (data.data.results.length > 0) {
        Dispatch(setWorkoutTimeCal(data.data.results));
      } else {
        Dispatch(setWorkoutTimeCal([]));
      }
    } catch (error) {
      console.log('UCustomeCorkout details', error);
    }
  };
  const getGraphData = async Key => {
    try {
      const res = await axios({
        url: NewAppapi.HOME_GRAPH_DATA,
        method: 'post',
        data: {
          user_id: getUserDataDetails?.id,
          version: VersionNumber.appVersion,
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
      } else if (res.data?.message != 'No data found') {
        Dispatch(setHomeGraphData(res.data));

        if (Key == 1) {
          zeroData = [];
          for (i = 0; i < res?.data?.weekly_data?.length; i++) {
            const data1 = res.data.weekly_data[i].total_calories;
            zeroData.push(parseFloat(data1));
          }
          setWeeklyGraph(zeroData);
        } else if (Key == 2) {
          zeroDataM = [];
          for (i = 0; i < res?.data?.monthly_data?.length; i++) {
            const data1 = res.data.monthly_data[i].total_calories;
            zeroDataM.push(parseFloat(data1));
          }
          setMonthlyGraph(zeroDataM);
        }
      } else {
        Dispatch(setHomeGraphData([]));
      }
    } catch (error) {
      console.error(error, 'GraphError');
      Dispatch(setHomeGraphData([]));
    }
  };

  const [modalVisible, setModalVisible] = useState(false);

  const handleLongPress = () => {
    analytics().logEvent('CV_FITME_CLICKED_ON_PEDOMETER');
    setModalVisible(true); // Show the modal when long-press is detected
  };
  const closeModal = () => {
    setModalVisible(false); // Close the modal
  };
  const SliderView = ({
    Visiblity,
    txt,
    Value,
    Value1,
    handleChange,
    ToggleState,
    ImgSource,
    MinimumValue,
    MaximumValue,
  }) => {
    const thumbStyle = {
      width: 35,
      height: 35,
      backgroundColor: AppColor.WHITE,
      borderRadius: 35 / 2,
      justifyContent: 'center',
      alignItems: 'center',
      ...Platform.select({
        ios: {
          shadowColor: AppColor.BLACK,
          shadowOpacity: 0.5,
          shadowOffset: {width: 5, height: 0},
        },
        android: {
          elevation: 5,
        },
      }),
    };
    const ToggleVisiblity = () => {
      ToggleState(prev => !prev);
    };
    const ThumbImage = ({param}) => {
      return (
        <View style={thumbStyle}>
          <Image
            source={ImgSource}
            style={{width: 20, height: 20}}
            resizeMode="contain"
            tintColor={param == 'Steps' ? '#5FB67B' : null}
          />
        </View>
      );
    };
    return (
      <>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 15,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              source={ImgSource}
              style={{width: 30, height: 30}}
              tintColor={txt == 'Steps' ? '#5FB67B' : null}
              resizeMode="contain"
            />
            <Text style={styles.txt5}>
              {txt == 'Steps'
                ? 'Steps'
                : txt == 'Distance'
                ? 'Distance'
                : txt == 'Calories'
                ? 'Calories'
                : ''}
            </Text>
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
              {Value1}
            </Text>
            <TouchableOpacity
              style={styles.dropButton}
              onPress={() => ToggleVisiblity(txt)}>
              <Icons
                name={Visiblity ? 'chevron-up' : 'chevron-down'}
                size={25}
                color={'#000'}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{marginTop: 5}}>
          {
            // Step_Visible
            Visiblity ? (
              <Slider
                value={Value}
                maximumValue={MaximumValue}
                minimumValue={MinimumValue}
                step={1}
                onValueChange={handleChange}
                minimumTrackTintColor="#5FB67B"
                renderThumbComponent={() => <ThumbImage param={txt} />}
                trackStyle={{height: 10, borderRadius: 20}}
              />
            ) : null
          }
        </View>
      </>
    );
  };
  const UpdateGoalModal = () => {
    const [Steps_Goal, setSteps_Goal] = useState(
      getPedomterData[0] ? getPedomterData[0].RSteps : 500,
    );
    const [Calories_Goal, setCalories_Goal] = useState(
      getPedomterData[2] ? getPedomterData[2].RCalories : 25,
    );
    const [Distance_Goal, setDistance_Goal] = useState(
      getPedomterData[1] ? getPedomterData[1].RDistance : 0.25,
    );
    const [Step_Visible, setSteps_Visible] = useState(true);
    const [Distance_Visible, setDistance_Visible] = useState(false);
    const [Calories_Visible, setCalories_Visible] = useState(false);

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
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
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
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
              }}
              style={styles.dropButton}>
              <Icons name={'close'} size={15} color={'#000'} />
            </TouchableOpacity>
          </View>
          <SliderView
            txt={'Steps'}
            Visiblity={Step_Visible}
            Value={Steps_Goal}
            handleChange={value => {
              setSteps_Goal(value);
              setCalories_Goal((value * 0.05).toFixed(2));
              setDistance_Goal((value * 0.0005).toFixed(2));
            }}
            Value1={`${Steps_Goal} Steps`}
            ToggleState={setSteps_Visible}
            ImgSource={localImage.Step3}
            MinimumValue={500}
            MaximumValue={10000}
          />
          <SliderView
            txt={'Distance'}
            Visiblity={Distance_Visible}
            Value={Distance_Goal}
            handleChange={value => {
              setDistance_Goal(value);
              setSteps_Goal((value * 2000).toFixed(0));
              setCalories_Goal((value * 100).toFixed(2));
            }}
            Value1={`${Distance_Goal} Km`}
            ToggleState={setDistance_Visible}
            ImgSource={localImage.Step2}
            MinimumValue={0.25}
            MaximumValue={5}
          />
          <SliderView
            txt={'Calories'}
            Visiblity={Calories_Visible}
            Value={Calories_Goal}
            handleChange={value => {
              setCalories_Goal(value);
              setDistance_Goal((value * 0.01).toFixed(2));
              setSteps_Goal(value * 20);
            }}
            Value1={`${Calories_Goal} Kcal`}
            ToggleState={setCalories_Visible}
            ImgSource={localImage.Step1}
            MinimumValue={25}
            MaximumValue={500}
          />
          <TouchableOpacity
            style={styles.Modal_Save_btton}
            activeOpacity={0.5}
            onPress={() => {
              // AnimationRef.current && AnimationRef?.current.reAnimate();

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
    {label: 'Monthly', value: '2'},
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

  const ListItem = React.memo(({title, color}) => (
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
          style={{
            fontSize: 14,
            fontWeight: '600',
            lineHeight: 17,
            fontFamily: 'Montserrat-SemiBold',
            color: color.color3,
          }}>
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
              height: 50,
              width: 50,
            },
          ]}
          resizeMode="cover"></Image>
      </LinearGradient>
    </TouchableOpacity>
  ));
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
  const data = {
    labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    datasets: [
      {
        data: value == 'Weekly' ? [...weeklyGraph] : [...monthlyGraph],
        color: () => AppColor.RED, // optional
      },
    ],
  };
  const chartConfig = {
    backgroundGradientFrom: AppColor.WHITE,
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: AppColor.RED,
    backgroundGradientToOpacity: 0,

    color: () => '#202020',
    decimalPlaces: 0,
    strokeWidth: 4, // optional, default 3
    barPercentage: 0,
    useShadowColorFromDataset: false, // optional
  };
  const specificDataIndex =
    value == 'Weekly' ? weeklyGraph?.length - 1 : monthlyGraph?.length;
  const renderCustomPoint = ({x, y, index, value}) => {
    if (index === specificDataIndex) {
      return (
        <React.Fragment key={index}>
          <Line
            x1={x}
            y1={y}
            x2={x}
            y2={DeviceHeigth * 0.2} // Adjust this value based on your chart height
            stroke={AppColor.RED} // Line color
            strokeWidth={1}
            strokeDasharray={[4, 4]}
          />
          <Circle
            cx={x}
            cy={y}
            r={7}
            fill={AppColor.WHITE}
            stroke={AppColor.RED}
            strokeWidth={3}
          />
        </React.Fragment>
      );
    }
    return null; // Render nothing for other data points
  };

  const getCustomWorkout = async user_id => {
    setRefresh(true);
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
        setRefresh(false);
        Dispatch(setCustomWorkoutData(data?.data));
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
        setRefresh(false);
      } else {
        setRefresh(false);
        Dispatch(setCustomWorkoutData([]));
      }
    } catch (error) {
      console.log('Custom Workout Error', error);
      Dispatch(setCustomWorkoutData([]));
      setRefresh(false);
    }
  };
  const Meal_List = async () => {
    setRefresh(true);
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
        setRefresh(false);
      } else if (data.data.diets.length > 0) {
        Dispatch(Setmealdata(data.data.diets));
        setRefresh(false);
      } else {
        Dispatch(Setmealdata([]));
        setRefresh(false);
      }
      // if (data.data.diets.length > 0) {
      //   dispatch(Setmealdata(data.data.diets));
      // } else {
      //   dispatch(Setmealdata([]));
      // }
    } catch (error) {
      Dispatch(Setmealdata([]));
      console.log('Meal List Error', error);
      setRefresh(false);
    }
  };
  const MyListItem = React.memo(({item, index}) => {
    return (
      <>
        <TouchableOpacity
          style={styles.listItem2}
          onPress={() => {
            navigation.navigate('MealDetails', {item: item});
          }}>
          {imageLoad && (
            <ShimmerPlaceholder
              style={{
                height: 90,
                width: 90,
                borderRadius: 180 / 2,
                alignSelf: 'center',
                top: -5,
              }}
              ref={avatarRef}
              autoRun
            />
          )}
          <Image
            source={{uri: item.diet_image_link}}
            onLoad={() => setImageLoad(false)}
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
                fontWeight: '600',
                lineHeight: 20,

                fontFamily: 'Montserrat-SemiBold',
                textAlign: 'center',
                width: 100,
                color: '#505050',
              },
            ]}>
            {item.diet_title}
          </Text>
        </TouchableOpacity>
      </>
    );
  });
  const MyStoreItem = React.memo(({item, index}) => {
    return (
      <>
        <TouchableOpacity
          style={styles.listItem2}
          onPress={() => {
            navigation.navigate('ProductsList', {item: item});
          }}>
          {/* {imageLoad && (
            <ShimmerPlaceholder
              style={{
                height: 90,
                width: 90,
                borderRadius: 180 / 2,
                alignSelf: 'center',
                top: -5,
              }}
              ref={avatarRef}
              autoRun
            />
          )} */}
          <Image
            source={
              item.type_image_link == null
                ? localImage.Noimage
                : {uri: item.type_image_link}
            }
            onLoad={() => setImageLoad(false)}
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
                fontWeight: '600',
                lineHeight: 20,
                fontFamily: 'Montserrat-SemiBold',
                textAlign: 'center',
                width: 100,
                color: '#505050',
              },
            ]}>
            {item.type_title}
          </Text>
        </TouchableOpacity>
      </>
    );
  });
  const getNativeAdsDisplay = () => {
    if (getPurchaseHistory.length > 0) {
      if (
        getPurchaseHistory[0]?.plan_end_date >= moment().format('YYYY-MM-DD')
      ) {
        return null;
          // <View
          //   style={{
          //     alignSelf: 'center',
          //     alignItems: 'center',

          //     top: DeviceHeigth * 0.08,
          //   }}>
          //   <NativeAddTest type="image" media={false} />
          // </View>
       
      } else {
        return (
          <View
            style={{
              alignSelf: 'center',
              alignItems: 'center',

              top: DeviceHeigth * 0.08,
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

            top: DeviceHeigth * 0.08,
          }}>
          <NativeAddTest type="image" media={false} />
        </View>
      );
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />

      <View style={styles.profileView}>
        <View style={{}}>
          <GradientText
            item={
              getTimeOfDayMessage() +
              ', ' +
              (Object.keys(getUserDataDetails).length > 0
                ? getUserDataDetails.name.split(' ')[0]
                : 'Guest')
            }
          />
        </View>
        <View>
          {Object.keys(getUserDataDetails).length > 0 ? (
            <TouchableOpacity
              style={styles.profileView1}
              onPress={() => {
                analytics().logEvent('CV_FITME_CLICKED_ON_PROFILE');
                navigation.navigate('Profile');
              }}>
              {isLoading && (
                // <ActivityIndicator
                //   style={styles.loader}
                //   size="small"
                //   color="#0000ff"
                // />
                <ShimmerPlaceholder
                  style={styles.loader}
                  ref={avatarRef}
                  autoRun
                />
              )}

              <Image
                source={
                  getUserDataDetails?.image_path == null
                    ? localImage.avt
                    : {uri: getUserDataDetails?.image_path}
                }
                onLoad={() => setIsLoading(false)}
                style={[styles.img]}
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
      </View>
      <View style={styles.rewardView}></View>

      <ScrollView
        keyboardDismissMode="interactive"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{flexGrow: 1}}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refresh}
            onRefresh={() => {
              getCustomWorkout(getUserDataDetails.id);
              Meal_List();
              getGraphData(1);
            }}
            colors={[AppColor.RED, AppColor.WHITE]}
          />
        }>
        <View style={{width: '95%', alignSelf: 'center'}}>
          <Text
            style={{
              color: AppColor.BLACK,
              fontFamily: 'Montserrat-SemiBold',
              fontWeight: 'bold',
              lineHeight: 19.5,
              fontSize: 18,
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}>
            Health Overview
          </Text>
        </View>
        <View style={styles.CardBox}>
          <TouchableOpacity
            onPress={handleLongPress}
            activeOpacity={0.5}
            style={{
              width: 30,
              height: 30,

              margin: 10,
              alignItems: 'center',
              alignSelf: 'flex-end',
              justifyContent: 'center',
              zIndex: 1,
            }}>
            <Image
              source={require('../../Icon/Images/NewImage/editpen.png')}
              style={[
                styles.img,
                {
                  height: 30,
                  width: 30,
                },
              ]}
              resizeMode="contain"></Image>
          </TouchableOpacity>

          <View style={[styles.healthView, {marginTop: -DeviceHeigth * 0.04}]}>
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
                  {Platform.OS == 'ios' ? steps : stepsRef.current}
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
                  {Platform.OS == 'ios' ? distance : distanceRef.current}
                  <Text style={[styles.monetText, {color: '#505050'}]}>
                    {`/${DistanceGoalProfile} km `}
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
                  {Platform.OS == 'ios' ? Calories : caloriesRef.current}
                  <Text style={[styles.monetText, {color: '#505050'}]}>
                    {`/${CalriesGoalProfile} Kcal`}
                  </Text>
                </Text>
              </View>
            </View>
            <View style={styles.stepImageView}>
              {/* <CircularProgressBase
                {...props}
                value={Calories}
                maxValue={
                  getPedomterData[3] ? getPedomterData[3].RCalories : 500
                }
                radius={32}
                activeStrokeColor={'#941000'}
                inActiveStrokeColor={'#941000'}>
                <CircularProgressBase
                  {...props}
                  value={distance}
                  maxValue={
                    getPedomterData[2] ? getPedomterData[2].RDistance : 2.5
                  }
                  radius={55}
                  activeStrokeColor={'#FCBB1D'}
                  inActiveStrokeColor={'#FCBB1D'}>
                  <CircularProgressBase
                    {...props}
                    value={steps}
                    maxValue={
                      getPedomterData[0] ? getPedomterData[0].RSteps : 5000
                    }
                    radius={80}
                    activeStrokeColor={'#397E54'}
                    inActiveStrokeColor={'#397E54'}
                  />
                </CircularProgressBase>
              </CircularProgressBase> */}
              <CircularProgressBase
                {...props}
                value={Calories}
                maxValue={
                  getPedomterData[2] ? getPedomterData[2].RCalories : 500
                }
                radius={32}
                activeStrokeColor={'#941000'}
                inActiveStrokeColor={'#941000'}>
                <CircularProgressBase
                  {...props}
                  value={distance}
                  maxValue={
                    getPedomterData[1] ? getPedomterData[1].RDistance : 2.5
                  }
                  radius={55}
                  activeStrokeColor={'#FCBB1D'}
                  inActiveStrokeColor={'#FCBB1D'}>
                  <CircularProgressBase
                    {...props}
                    value={steps}
                    maxValue={
                      getPedomterData[0] ? getPedomterData[0].RSteps : 5000
                    }
                    radius={80}
                    activeStrokeColor={'#397E54'}
                    inActiveStrokeColor={'#397E54'}
                  />
                </CircularProgressBase>
              </CircularProgressBase>
            </View>
          </View>
        </View>

        <>
          <View
            style={{
              flexDirection: 'row',
              width: '95%',
              alignSelf: 'center',
              top: DeviceHeigth * 0.04,
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                color: AppColor.BLACK,
                fontFamily: 'Montserrat-SemiBold',
                fontWeight: 'bold',
                lineHeight: 19.5,
                fontSize: 18,
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}>
              Meditation
            </Text>

            {customWorkoutData?.minset_workout?.length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  analytics().logEvent('CV_FITME_CLICKED_ON_MEDITATION');
                  navigation.navigate('MeditationDetails', {
                    item: customWorkoutData?.minset_workout[0],
                  });
                }}>
                <Text
                  style={{
                    color: AppColor.BoldText,
                    fontFamily: 'Montserrat-SemiBold',
                    fontWeight: '600',
                    color: AppColor.RED1,
                    fontSize: 12,
                    lineHeight: 14,
                  }}>
                  View All
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.meditionBox}>
            <FlatList
              data={customWorkoutData?.minset_workout}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              ListEmptyComponent={emptyComponent}
              renderItem={({item, index}) => {
                return (
                  <ListItem
                    title={item}
                    color={colors[index % colors.length]}
                  />
                );
              }}
              // renderItem={(item, index) => <MyListItem1 item={item} index={index}/>}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              updateCellsBatchingPeriod={100}
              removeClippedSubviews={true}
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
            alignItems: 'center',
            top: DeviceHeigth * 0.07,
          }}>
          <Text
            style={{
              color: AppColor.BLACK,
              fontFamily: 'Montserrat-SemiBold',
              fontWeight: 'bold',
              lineHeight: 19.5,
              fontSize: 18,
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}>
            Workouts
          </Text>
          {customWorkoutData?.workout?.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                analytics().logEvent('CV_FITME_CLICKED_ON_WORKOUTS');
                navigation?.navigate('AllWorkouts', {
                  data: customWorkoutData?.workout,
                  type: 'custom',
                  fav: false,
                });
              }}>
              <Text
                style={{
                  color: AppColor.BoldText,
                  fontFamily: 'Montserrat-SemiBold',
                  fontWeight: '600',
                  color: AppColor.RED1,
                  fontSize: 12,
                  lineHeight: 14,
                }}>
                View All
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <View
          style={[
            styles.meditionBox,
            {
              top: DeviceHeigth * 0.069,
            },
          ]}>
          <FlatList
            data={customWorkoutData?.workout?.slice(0, 3)}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={emptyComponent}
            pagingEnabled
            renderItem={({item, index}) => {
              let totalTime = 0;
              let totalCal = 0;
              let time = getCustttomeTimeCal.filter(item1 => {
                item1.workout_id == item.workout_id;
                return item1;
              });
              for (const day in item?.days) {
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
                          fontFamily: 'Montserrat-SemiBold',
                          fontSize: 14,
                          lineHeight: 17,
                          alignSelf: 'center',
                          zIndex: 1,
                          left:
                            Platform.OS == 'ios'
                              ? DeviceWidth >= 768
                                ? -DeviceWidth * 0.12
                                : -DeviceWidth * 0.05
                              : DeviceWidth >= 768
                              ? -DeviceWidth * 0.1
                              : -DeviceWidth * 0.05,

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
                          progress={time.length > 0 && time[0].totalRestTime}
                          //  progress={55}
                          image={localImage.Play}
                          text={
                            totalTime > 60
                              ? `${(totalTime / 60).toFixed(0)} Min`
                              : `${totalTime} sec`
                          }
                        />
                      </View>
                      <View style={{marginHorizontal: 10, top: 15}}>
                        <ProgressBar
                          progress={time.length > 0 && time[0].totalCalories}
                          //  progress={33}
                          image={localImage.Step1}
                          text={totalCal + ' Kcal'}
                        />
                      </View>
                    </View>
                  </View>
                  {}
                  <Image
                    source={localImage.GymImage}
                    style={{
                      height: DeviceHeigth * 0.16,
                      width: DeviceWidth * 0.35,
                      bottom: -DeviceHeigth * 0.06,
                      left: DeviceWidth * 0.005,
                      marginTop:
                        Platform.OS == 'ios'
                          ? -DeviceHeigth * 0.11
                          : DeviceWidth >= 768
                          ? -DeviceHeigth * 0.08
                          : -DeviceHeigth * 0.11,
                    }}
                    resizeMode="contain"></Image>
                </TouchableOpacity>
              );
            }}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            updateCellsBatchingPeriod={100}
            removeClippedSubviews={true}
          />

          <View
            style={{
              flexDirection: 'row',
              top: DeviceHeigth * 0.01,
              justifyContent: 'center',
            }}></View>
        </View>
        {getNativeAdsDisplay()}

        <View
          style={{
            flexDirection: 'row',
            width: '95%',
            alignSelf: 'center',
            // backgroundColor:'red',
            //top: DeviceHeigth * 0.03,
            alignItems: 'center',
            justifyContent: 'space-between',
            top: DeviceHeigth * 0.1,
            marginBottom: 10,
          }}>
          <Text
            style={{
              color: AppColor.BLACK,
              fontFamily: 'Montserrat-SemiBold',
              fontWeight: 'bold',
              lineHeight: 19.5,
              fontSize: 18,
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}>
            Meals
          </Text>
          <TouchableOpacity
            onPress={() => {
              analytics().logEvent('CV_FITME_CLICKED_ON_MEALS');
              navigation.navigate('Meals');
            }}>
            <Text
              style={{
                color: AppColor.BoldText,
                fontFamily: 'Montserrat-SemiBold',
                fontWeight: '600',
                color: AppColor.RED1,
                fontSize: 12,
                lineHeight: 14,
              }}>
              View All
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={[
            styles.meditionBox,
            {
              top: DeviceHeigth * 0.1,
            },
          ]}>
          <FlatList
            data={
              Platform.OS == 'android'
                ? mealData?.slice(0, 4)
                : DeviceHeigth >= 1024
                ? mealData?.slice(0, 5)
                : mealData?.slice(0, 4)
            }
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            pagingEnabled
            renderItem={({item, index}) => (
              <MyListItem item={item} index={index} />
            )}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            updateCellsBatchingPeriod={100}
            removeClippedSubviews={true}
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            width: '95%',
            alignSelf: 'center',
            // backgroundColor:'red',
            //top: DeviceHeigth * 0.03,
            alignItems: 'center',
            justifyContent: 'space-between',
            top: DeviceHeigth * 0.09,
            marginBottom: 10,
          }}>
          <Text
            style={{
              color: AppColor.BLACK,
              fontFamily: 'Montserrat-SemiBold',
              fontWeight: 'bold',
              lineHeight: 19.5,
              fontSize: 18,
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}>
            Store
          </Text>
          <TouchableOpacity
            onPress={() => {
              analytics().logEvent('CV_FITME_CLICKED_ON_MEALS');
              navigation.navigate('Store');
            }}>
            <Text
              style={{
                color: AppColor.BoldText,
                fontFamily: 'Montserrat-SemiBold',
                fontWeight: '600',
                color: AppColor.RED1,
                fontSize: 12,
                lineHeight: 14,
              }}>
              View All
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={[
            styles.meditionBox,
            {
              top: DeviceHeigth * 0.09,
            },
          ]}>
          <FlatList
            // data={getStoreData?.slice(0, )}
            data={
              Platform.OS == 'android'
                ? getStoreData?.slice(0, 4)
                : DeviceHeigth >= 1024
                ? getStoreData?.slice(0, 5)
                : getStoreData?.slice(0, 4)
            }
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            pagingEnabled
            renderItem={({item, index}) => (
              <MyStoreItem item={item} index={index} />
            )}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            updateCellsBatchingPeriod={100}
            removeClippedSubviews={true}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            width: '95%',
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'space-between',
            top: DeviceHeigth * 0.065,
          }}>
          <Text
            style={{
              color: AppColor.BLACK,
              fontFamily: 'Montserrat-SemiBold',
              fontWeight: 'bold',
              lineHeight: 19.5,
              fontSize: 18,
              alignItems: 'center',
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
            labelField="label"
            valueField="value"
            placeholder={value}
            value={value}
            onChange={item => {
              setValue(item.label);

              if (item.value == 1) {
                getGraphData(1);
              } else {
                getGraphData(2);
              }
            }}
            renderItem={renderItem}
          />
        </View>
        <View
          style={{
            top: DeviceHeigth * 0.065,
            width: '95%',
            // height: 200,
            marginBottom: DeviceHeigth * 0.13,
            alignSelf: 'center',
            borderRadius: 10,
          }}>
          {weeklyGraph.length != 0 || monthlyGraph.length != 0 ? (
            <View style={[styles.card, {}]}>
              <LineChart
                style={{paddingRight: 40}}
                data={data}
                width={DeviceWidth * 0.85}
                height={DeviceHeigth * 0.25}
                chartConfig={chartConfig}
                withInnerLines={false}
                withOuterLines={true}
                withDots={true}
                bezier
                segments={4}
                renderDotContent={renderCustomPoint}
                withShadow={false}
                yAxisInterval={10}
                fromZero={true}
              />
            </View>
          ) : (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                height: DeviceHeigth * 0.2,
              }}>
              {emptyComponent()}
            </View>
          )}
        </View>
      </ScrollView>
      {modalVisible ? <UpdateGoalModal /> : null}
      {/* 
      {PaddoModalShow ? <PaddoMeterPermissionModal /> : null} */}
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
    width: '100%',
    justifyContent: 'space-between',
    //height: DeviceHeigth * 0.06,
    paddingVertical: 5,
    alignItems: 'center',
    alignSelf: 'center',
    top: DeviceHeigth * 0.02,
  },
  profileView1: {
    height: 60,
    width: 60,
    alignItems: 'flex-end',
    left: -DeviceWidth * 0.02,
    borderRadius: 100 / 2,
  },
  img: {
    height: 60,
    width: 60,

    borderRadius: 120 / 2,
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
    fontSize: 10,
    fontWeight: '500',
    lineHeight: 12,
    fontFamily: 'Montserrat-SemiBold',
    marginLeft: 10,
  },
  CardBox: {
    width: '92%',
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
    fontFamily: 'Montserrat',
    fontWeight: '500',
    lineHeight: 18,
    fontSize: 14,
    color: AppColor.BoldText,
    marginTop: 10,
  },
  healthView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
    fontFamily: 'Montserrat-SemiBold',
    fontWeight: '600',
    lineHeight: 15,
    fontSize: 12,
    color: AppColor.BLACK,
    marginVertical: DeviceHeigth * 0.01,
  },
  listItem: {
    width: DeviceWidth * 0.41,
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
    fontFamily: 'Montserrat',
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
    fontFamily: 'Montserrat',
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
    width: DeviceWidth * 0.3,
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
    color: AppColor.BLACK,
  },
  placeholderStyle: {
    fontSize: 16,
    color: AppColor.BLACK,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: AppColor.BLACK,
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
    fontFamily: 'Montserrat',
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
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: AppColor.WHITE,
    width: DeviceWidth * 0.9,
    borderRadius: 20,
    alignSelf: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 5, height: 5},
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  loader: {
    position: 'absolute',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: AppColor.GRAY,

    height: 50,
    width: 50,
    borderRadius: 100 / 2,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Montserrat',
    textAlign: 'center',
    color: AppColor.WHITE,
    fontWeight: '700',
    backgroundColor: 'transparent',
    lineHeight: 24,
  },
  buttonPaddo: {
    width: 132,
    height: 35,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    position: 'absolute',
    bottom: DeviceHeigth * 0.08,
    //shadowColor: 'rgba(0, 0, 0, 0)',
    // ...Platform.select({
    //   ios: {
    //     shadowOffset: {width: 0, height: 2},
    //     shadowOpacity: 0.3,
    //     // shadowRadius: 4,
    //   },
    //   android: {
    //     elevation: 1,
    //     // shadowColor: 'rgba(0, 0, 0, 1)',
    //   },
    // }),
  },
  buttonPaddo2: {
    width: 132,
    height: 35,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    position: 'absolute',
    bottom: DeviceHeigth * 0.05,

    ...Platform.select({
      ios: {
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        // shadowRadius: 4,
      },
      android: {
        elevation: 10,
        //shadowColor: 'rgba(0, 0, 0, 0)',
      },
    }),
  },
  modalBackGround: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default Home;
