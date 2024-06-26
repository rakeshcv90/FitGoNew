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
  setAllExercise,
  setChallengesData,
  setCustomWorkoutData,
  setEnteredCurrentEvent,
  setEnteredUpcomingEvent,
  setExperience,
  setLaterButtonData,
  setOfferAgreement,
  setPlanType,
  setProgressBarCounter,
  setPurchaseHistory,
  setTempLogin,
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
import {EnteringEventFunction} from './Event/EnteringEventFunction';
const AskToCreateWorkout = ({route, navigation}) => {
  const {data, nextScreen, gender, experience, name} = route?.params;
  const [screen, setScreen] = useState(nextScreen);
  const dispatch = useDispatch();
  const getLaterButtonData = useSelector(state => state.getLaterButtonData);
  const getProgressBarCounter = useSelector(
    state => state?.getProgressBarCounter,
  );
  const getFcmToken = useSelector(state => state.getFcmToken);
  const getUserID = useSelector(state => state.getUserID);
  const [selectedB, setSelectedB] = useState(0);
  const [selected, setSelected] = useState();
  const [Loader, setLoader] = useState(false);
  const getUserDataDetails = useSelector(state => state.getUserDataDetails);
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
      if (name) {
        payload.append('name', name);
      } else {
        payload.append('name', getUserDataDetails?.name);
      }
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
      if (data?.data?.msg == 'Please update the app to the latest version.') {
        showMessage({
          message: data?.data?.msg,
          floating: true,
          duration: 500,
          type: 'danger',
          icon: {icon: 'auto', position: 'left'},
        });
        setLoader(false);
      } else {
        // getProfileData(getUserID);

        getUserDetailData(getUserID);
        dispatch(setTempLogin(false));
      }
    } catch (error) {
      console.log('Whole Data Error', error);
    }
  };
  const getUserDetailData = async userId => {
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
      const responseData = await axios.get(
        `${NewAppapi.ALL_USER_DETAILS}?version=${VersionNumber.appVersion}&user_id=${userId}`,
      );

      if (
        responseData?.data?.msg ==
        'Please update the app to the latest version.'
      ) {
        showMessage({
          message: responseData?.data?.msg,
          type: 'danger',
          animationDuration: 500,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
      } else {
        dispatch(setCustomWorkoutData(responseData?.data?.workout_data));
        dispatch(setOfferAgreement(responseData?.data?.additional_data));
        dispatch(setUserProfileData(responseData?.data?.profile));
        dispatch(setLaterButtonData(currrentdata));
        dispatch(setExperience(true));
        if (getUserDataDetails.email != null) {
          navigation.navigate('OfferTerms', {
            routeName: 'Exprience',
            CustomCreated: true,
          });
setLoader(false)
          dispatch(setCustomWorkoutData([]));
          navigation.navigate('OfferTerms', {CustomCreated: true});
        } else {
          navigation.navigate('CustomWorkout', {routeName: 'Exprience'});
          setLoader(false)
        }
        if (responseData?.data.event_details == 'Not any subscription') {
          dispatch(setPurchaseHistory([]));
          EnteringEventFunction(
            dispatch,
            [],
            setEnteredCurrentEvent,
            setEnteredUpcomingEvent,
            setPlanType,
          );
          setLoader(false)
        } else {
          dispatch(setPurchaseHistory(responseData?.data.event_details));
          EnteringEventFunction(
            dispatch,
            responseData?.data.event_details,
            setEnteredCurrentEvent,
            setEnteredUpcomingEvent,
            setPlanType,
          );
          setLoader(false)
        }
        //ChallengesDataAPI();
        getAllChallangeAndAllExerciseData();
      }
    } catch (error) {
      console.log('GET-USER-DATA', error);
     // dispatch(setPurchaseHistory([]));
     // dispatch(setUserProfileData([]));
      dispatch(setCustomWorkoutData([]));

      getAllChallangeAndAllExerciseData();
    }
  };

  

  const getAllChallangeAndAllExerciseData = async () => {
    let responseData = 0;
    if (Object.keys(getUserDataDetails).length > 0) {
      try {
        responseData = await axios.get(
          `${NewAppapi.ALL_USER_WITH_CONDITION}?version=${VersionNumber.appVersion}&user_id=${getUserDataDetails?.id}`,
        );
        dispatch(setChallengesData(responseData.data.challenge_data));
        dispatch(setAllExercise(responseData.data.data));
        setLoader(false)
      } catch (error) {
        console.log('GET-USER-Challange and AllExerciseData DATA', error);
        dispatch(setChallengesData([]));
        dispatch(setAllExercise([]));
      }
    } else {
      try {
        responseData = await axios.get(
          `${NewAppapi.ALL_USER_WITH_CONDITION}?version=${VersionNumber.appVersion}`,
        );
        dispatch(setChallengesData(responseData.data.challenge_data));
        dispatch(setAllExercise(responseData.data.data));
      } catch (error) {
        dispatch(setChallengesData([]));
        dispatch(setAllExercise([]));

        console.log('GET-USER-Challange and AllExerciseData DATA', error);
      }
      setLoader(false)
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
            dispatch(setProgressBarCounter(getProgressBarCounter - 1));
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
