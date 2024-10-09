import {Image, TouchableOpacity, View} from 'react-native';
import React, {FC, useEffect, useState} from 'react';
import {AppColor} from '../../../../Component/Color';
import {
  DeviceHeigth,
  DeviceWidth,
  NewAppapi,
} from '../../../../Component/Config';
import {ShadowStyle} from '../../../../Component/Utilities/ShadowStyle';
import CircleProgress from '../../../../Component/Utilities/ProgressCircle';
import moment from 'moment';
import {useSelector} from 'react-redux';
import KeepAwake from 'react-native-keep-awake';
import VersionNumber from 'react-native-version-number';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {showMessage} from 'react-native-flash-message';
import VideoControls from './VideoControls';
import {handleExerciseChange, initTts, PauseModal} from './Helpers';
import {setupPlayer} from 'react-native-track-player/lib/src/trackPlayer';
import ExerciseTimer from './ExerciseTimer';
import BottomControls from './BottomControls';
import useExerciseHook, {ExerciseData} from './useExerciseHook';

type ExerciseControlsProps = {
  pause: boolean;
  setPause: Function;
  number: number;
  setNumber: Function;
  back: boolean;
  setBack: Function;
  allExercise: Array<ExerciseData>;
  currentExercise: ExerciseData;
  data?: any;
  day: number;
  exerciseNumber: number;
  trackerData: Array<any>;
  type: string;
  challenge?: boolean;
  getStoreVideoLoc?: any;
};

const WeekArray = Array(7)
  .fill(0)
  .map(
    (item, index) =>
      (item = moment()
        .add(index, 'days')
        .subtract(moment().isoWeekday() - 1, 'days')
        .format('dddd')),
  );

const ExerciseControls: FC<ExerciseControlsProps> = ({
  pause,
  setPause,
  allExercise,
  currentExercise,
  day,
  type,
  challenge,
  data,
  exerciseNumber,
  trackerData,
  getStoreVideoLoc,
  back,
  setBack,
  setNumber,
  number,
}) => {
  const navigation: any = useNavigation();
  const getScreenAwake = useSelector((state: any) => state.getScreenAwake);
  const getPurchaseHistory = useSelector(
    (state: any) => state.getPurchaseHistory,
  );
  const enteredCurrentEvent = useSelector(
    (state: any) => state.enteredCurrentEvent,
  );
  const getUserDataDetails = useSelector(
    (state: any) => state.getUserDataDetails,
  );
  const [progressPercent, setProgressPercent] = useState(0);
  const [quitLoader, setQuitLoader] = useState(false);
  const [currentSet, setCurrentSet] = useState(0);
  const [completed, setCompleted] = useState(0);
  const Sat = getPurchaseHistory?.currentDay == 6;
  const Sun = getPurchaseHistory?.currentDay == 0;

  const apiCalls = () => {
    type == 'focus' || type == 'bodypart'
      ? postSingleExerciseAPI()
      : postCurrentExerciseAPI();
  }

  const outNavigation = () => {
    setPause(false);

    navigation.navigate('SaveDayExercise', {
      data,
      day,
      allExercise,
      type,
      challenge,
    });
  };
  const {
    seconds,
    reset,
    restStart,
    setRestStart,
    setSeconds,
    exerciseTimerRef,
  } = useExerciseHook({
    pause,
    setPause,
    allExercise,
    progressPercent,
    setProgressPercent,
    back,
    currentSet,
    setCurrentSet,
    outNavigation,
    getStoreVideoLoc,
    number,
    setNumber,
    apiCalls
  });

  const resumeButton = () => {
    setBack(false);
    setPause(!pause);
  };

  useEffect(() => {
    if (getScreenAwake) {
      KeepAwake.activate();
    } else {
      KeepAwake.deactivate();
    }
  }, [getScreenAwake]);

  useEffect(() => {
    setRestStart(true);
    initTts();
    if (exerciseNumber != -1 && number == 0) {
      setNumber(exerciseNumber);
      handleExerciseChange(currentExercise?.exercise_title, getStoreVideoLoc);
    }
    // Platform.OS == 'android'
    //   ? Platform.Version != 34 && setupPlayer()
    //   : setupPlayer();
  }, []);

  const quitFunction = () => {
    type == 'day'
      ? navigation.goBack()
      : type == 'custom'
      ? navigation.goBack()
      : deleteTrackExercise();
  };

  const deleteTrackExercise = async () => {
    const payload = new FormData();
    payload.append('day', WeekArray[day]);
    payload.append('workout_id', `-${day + 1}`);
    payload.append('user_id', getUserDataDetails?.id);
    payload.append('version', VersionNumber.appVersion);
    setQuitLoader(true);
    try {
      const res = await axios({
        url:
          (enteredCurrentEvent && !Sat && !Sun
            ? NewAppapi.DELETE_EVENT_WEEKLY_DATA
            : NewAppapi.DELETE_TRACK_EXERCISE) +
          '?workout_id=' +
          `-${day + 1}` +
          '&user_id=' +
          getUserDataDetails?.id +
          '&current_date=' +
          moment().format('YYYY-MM-DD'),
      });
      setQuitLoader(false);
    } catch (error) {
      setQuitLoader(false);
      console.log('DELE TRACK ERRR', error);
    }
    navigation.goBack();
  };

  const postCurrentExerciseAPI = async () => {
    const payload = new FormData();
    payload.append('id', trackerData[number]?.id);

    payload.append('day', type == 'day' ? day : WeekArray[day]);
    payload.append(
      'workout_id',
      type == 'day'
        ? data?.workout_id == undefined
          ? data?.custom_workout_id
          : data?.workout_id
        : `-${day + 1}`,
    );
    payload.append('user_id', getUserDataDetails?.id);
    payload.append('version', VersionNumber.appVersion);

    try {
      const res = await axios({
        url: challenge ? NewAppapi.POST_CHALLENGE : NewAppapi.POST_EXERCISE,
        method: 'post',
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
          //   icon: {icon: 'auto', position: 'left'},
        });
      } else if (res.data) {
        setCompleted(completed + 1);
        setProgressPercent(0);
      }
    } catch (error) {
      console.error(error, 'PostDaysAPIERror');
    }
  };
  const postSingleExerciseAPI = async () => {
    const payload = new FormData();
    payload.append('day', day);
    payload.append('exercise_id', allExercise[number]?.exercise_id);
    payload.append('workout_id', data?.id);

    payload.append('user_id', getUserDataDetails?.id);
    payload.append('version', VersionNumber.appVersion);

    try {
      const res = await axios({
        url: NewAppapi.POST_SINGLE_EXERCISE_COMPLETE,
        method: 'post',
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
          //   icon: {icon: 'auto', position: 'left'},
        });
      } else if (res.data) {
        setCompleted(completed + 1);
        setRestStart(true);
        setProgressPercent(0);
      }
    } catch (error) {
      console.error(error, 'PostSINGLExerciseAPIERror');
    }
  };

  return (
    <>
      <View
        style={[
          {
            // height: DeviceHeigth * 0.28,
            paddingTop: 10,
            paddingHorizontal: 20,
            backgroundColor: AppColor.WHITE,
            width: DeviceHeigth >= 1024 ? '95%' : '90%',
            alignSelf: 'center',
            borderRadius: 10,
          },
          ShadowStyle,
        ]}>
        <ExerciseTimer
          currentSet={currentSet}
          exerciseTitle={allExercise[number].exercise_title}
          seconds={seconds}
          restStart={restStart}
          totalSets={parseInt(allExercise[number].exercise_sets)}
        />
        {restStart ? (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              width: DeviceWidth,
              alignSelf: 'center'
            }}>
            <CircleProgress
              radius={50}
              progress={progressPercent}
              // strokeLinecap={timer == 0 ? 'butt' : 'round'}
              strokeWidth={25}
              changingColorsArray={['#530014', '#F0013B']}
              secondayCircleColor="#F0013B">
              <TouchableOpacity onPress={reset}>
                <Image
                  source={require('../../../../Icon/Images/InAppRewards/SkipButton.png')}
                  style={{width: 40, height: 40}}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </CircleProgress>
          </View>
        ) : (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              // width: '100%',
              alignSelf: 'center'
            }}>
            <VideoControls
              pause={pause}
              setPause={setPause}
              seconds={seconds}
              setSeconds={setSeconds}
              setCurrentSet={setCurrentSet}
              setNumber={setNumber}
              getStoreVideoLoc={getStoreVideoLoc}
              allExercise={allExercise}
              exerciseTimerRef={exerciseTimerRef}
              number={number}
              progressPercent={progressPercent}
              setProgressPercent={setProgressPercent}
            />
          </View>
        )}
        <View style={{height: DeviceHeigth >= 1024 ? 20 : 0}} />
        <BottomControls
          allExercise={allExercise}
          restStart={restStart}
          number={number}
          setRestStart={setRestStart}
          setCurrentSet={setCurrentSet}
          setNumber={setNumber}
          setProgressPercent={setProgressPercent}
          setSeconds={setSeconds}
        />
      </View>

      <PauseModal
        back={back}
        quitLoader={quitLoader}
        quitFunction={quitFunction}
        resumeButton={resumeButton}
        setBack={setBack}
        number={number}
        exerciseLength={allExercise.length}
      />
    </>
  );
};

export default ExerciseControls;

// if (seconds == resetTime) SPEAK('Lets Go');
// if (seconds == 4) SPEAK('three.            two.');
// if (seconds == 2) SPEAK('one.    Done');
