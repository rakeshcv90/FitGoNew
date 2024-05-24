import {View, Text, StyleSheet, TouchableOpacity, Animated} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import ProgressBar from './Yourself/ProgressBar';
import Bulb from './Yourself/Bulb';
import {AppColor} from '../Component/Color';
import {
  DeviceHeigth,
  DeviceWidth,
  NewApi,
  NewAppapi,
} from '../Component/Config';
import {
  setChallengesData,
  setCustomWorkoutData,
  setExperience,
  setLaterButtonData,
  setProgressBarCounter,
  setUserProfileData,
} from '../Component/ThemeRedux/Actions';
import {useDispatch, useSelector} from 'react-redux';
import DeviceInfo from 'react-native-device-info';
import VersionNumber, {appVersion} from 'react-native-version-number';
import axios from 'axios';
import {Card} from './Yourself/Card';
import {localImage} from '../Component/Image';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import {showMessage} from 'react-native-flash-message';
import ActivityLoader from '../Component/ActivityLoader';
import WorkoutArea from './Yourself/WorkoutArea';
const AskToCreateWorkout = ({route, navigation}) => {
  const {data, nextScreen, gender, experience,name} = route?.params;
  const [screen, setScreen] = useState(nextScreen);
  const dispatch = useDispatch();
  const getLaterButtonData = useSelector(state => state.getLaterButtonData);
  const getProgressBarCounter=useSelector(state=>state?.getProgressBarCounter)
  const getFcmToken = useSelector(state => state.getFcmToken);
  const getUserID = useSelector(state => state.getUserID);
  const [selectedB, setSelectedB] = useState(0);
  const [selected, setSelected] = useState();
  const [Loader, setLoader] = useState(false);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      startAnimation();
      // for unselecting the item when user hit the back button from next screen
      setSelectedB(0);
    });

    return () => unsubscribe;
  }, [navigation]);
  const askArray = [
    {
      id: 1,
      txt: ' Create your workout',
      img: localImage.AddIcon,
    },
    {
      id: 2,
      txt: 'Let us create the workout',
      img: localImage.CreateW,
    },
  ];
  const handle2nd = () => {
    const params = {
      nextScreen: screen + 1,
      gender: gender,
      data: data,
      experience: experience,
      workout_plans: 'AppCreated',
    };

    if (name) {
      params.name = name;
    }
    navigation.navigate('Goal', params);
  };
  const handleButtonPress = IDs => {
    setLoader(true);
    DeviceInfo.getUniqueId().then(id => {
      if (IDs == 1) {
        WholeData(id);
      } else {
        handle2nd();
        setLoader(false);
      }
    });
  };
  // animation
  const translateXValues = useRef(
    askArray?.map(() => new Animated.Value(-DeviceWidth)),
  ).current;
  const startAnimation = () => {
    Animated.stagger(
      300,
      translateXValues.map(
        (
          item, // stagger is used map over an array with a delay eg. 500
        ) =>
          Animated.timing(item, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
      ),
    ).start();
  };
  // selected Buttons
  const SelectedButton = item => {
    setSelected(item);
    setSelectedB(item?.id);
  };
  const WholeData = async (deviceID, IDs) => {
    const mergedObject = Object.assign({}, ...getLaterButtonData);
    try {
      const payload = new FormData();
      payload.append('deviceid', deviceID);
      payload.append('devicetoken', getFcmToken);
      payload.append('id', getUserID != 0 ? getUserID : null);
      payload.append('gender', gender);
      payload.append('goal', mergedObject?.goal);
      payload.append('fitnesslevel', mergedObject?.fitnesslevel); // static values change  it accordingly
      payload.append('weight', mergedObject?.currentWeight);
      payload.append('targetweight', mergedObject?.targetWeight);
      payload.append('experience', experience);
      payload.append('workout_plans', 'CustomCreated');
      if(name){payload.append('name',name)}
      payload.append(
        'injury',
        mergedObject?.injury != null ? mergedObject?.injury?.join(',') : null,
      );
      payload.append('equipment', mergedObject?.equipment);
      payload.append(
        'workoutarea',
        mergedObject?.workoutArea?.join(',') ?? null,
      );
      payload.append('version', VersionNumber?.appVersion);

      const data = await axios(`${NewAppapi.Post_COMPLETE_PROFILE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: payload,
      });
      console.log('Whole Data', data?.data);
      if (data?.data?.msg == 'Please update the app to the latest version.') {
        showMessage({
          message: data?.data?.msg,
          floating: true,
          duration: 500,
          type: 'danger',
          icon: {icon: 'auto', position: 'left'},
        });
      } else {
        getProfileData(getUserID);
      }
    } catch (error) {
      console.log('Whole Data Error', error);
    }
  };
  // getuserDetail api
  const getProfileData = async user_id => {
    const currrentdata = [
      {
        gender: gender,
      },
      {
        experience: experience,
      },
      {workout_plans: 'CustomCreated'},
    ];

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

      if (data?.data?.profile) {
        dispatch(setUserProfileData(data?.data?.profile));
        dispatch(setLaterButtonData(currrentdata));
        dispatch(setExperience(true));
        getCustomWorkout(getUserID);
        ChallengesDataAPI();
        setLoader(false);
      } else if (
        data?.data?.msg == 'Please update the app to the latest version.'
      ) {
        setLoader(false);
        ChallengesDataAPI();
        showMessage({
          message: data?.data?.msg,
          floating: true,
          duration: 500,
          type: 'danger',
          icon: {icon: 'auto', position: 'left'},
        });
      } else {
        dispatch(setUserProfileData([]));
        dispatch(setLaterButtonData(currrentdata));
        dispatch(setExperience(true));
        ChallengesDataAPI();
        //navigation.navigate('CustomWorkout');
        getCustomWorkout(getUserID);
        setLoader(false);
      }
    } catch (error) {
      console.log('User Profile Error', error);
      setLoader(false);
      getCustomWorkout(getUserID);
      ChallengesDataAPI();
    }
  };

  const getCustomWorkout = async data => {
    try {
      const data = await axios.get(
        `${NewAppapi.GET_USER_CUSTOM_WORKOUT}?user_id=${data}`,
      );

      if (data?.data?.msg != 'data not found.') {
        dispatch(setCustomWorkoutData(data?.data?.data));
        navigation.navigate('CustomWorkout', {routeName: 'Exprience'});
      } else {
        dispatch(setCustomWorkoutData([]));
        navigation.navigate('CustomWorkout');
      }
    } catch (error) {
      console.log('Custom Workout Error', error);
      dispatch(setCustomWorkoutData([]));
      navigation.navigate('CustomWorkout', {routeName: 'Exprience'});
    }
  };
  const ChallengesDataAPI = async () => {
    try {
      const res = await axios({
        url:
          NewAppapi.GET_CHALLENGES_DATA +
          '?version=' +
          VersionNumber.appVersion +
          '&user_id=' +
          getUserID,
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
  return (
    <View style={styles.Container}>
      <ProgressBar Type screen={screen} ExperienceScreen />
      <View
        style={{
          marginTop:
            Platform.OS == 'ios' ? -DeviceHeigth * 0.06 : -DeviceHeigth * 0.03,
        }}>
        <Bulb screen={'Select One Option'} />
      </View>
      {Loader ? <ActivityLoader /> : null}
      <View style={{marginTop: DeviceHeigth * 0.06}}>
        <Card
          ItemArray={askArray}
          Ih={28}
          Iw={30}
          selectedB={selectedB}
          translateXValues={translateXValues}
          SelectedButton={SelectedButton}
          Styletxt1={styles.txt}
        />
      </View>
      <View style={styles.buttons}>
        <TouchableOpacity
          onPress={() => {
            dispatch(setProgressBarCounter(getProgressBarCounter-1));
            navigation.goBack();
          }}
          style={{
            backgroundColor: '#F7F8F8',
            width: 45,
            height: 45,
            borderRadius: 15,
            overflow: 'hidden',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Icons name="chevron-left" size={25} color={'#000'} />
        </TouchableOpacity>
        {selectedB != 0 ? (
          <TouchableOpacity onPress={() => handleButtonPress(selected?.id)}>
            <LinearGradient
              start={{x: 0, y: 1}}
              end={{x: 1, y: 0}}
              colors={['#941000', '#D5191A']}
              style={[styles.nextButton]}>
              <Icons name="chevron-right" size={25} color={'#fff'} />
            </LinearGradient>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  Container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: AppColor.WHITE,
  },
  button: {
    width: DeviceWidth * 0.9,
    backgroundColor: 'red',
    marginTop: 15,
    borderRadius: 7,
    backgroundColor: AppColor.WHITE,
  },
  txt: {
    paddingVertical: 14,
    fontSize: 19,
    color: AppColor.BLACK,
    fontFamily: 'Montserrat-SemiBold',
    fontWeight: '500',
    textAlign: 'center',
    marginLeft: 15,
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
    backgroundColor: 'white',
    width: 45,
    height: 45,
    borderRadius: 50 / 2,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default AskToCreateWorkout;
