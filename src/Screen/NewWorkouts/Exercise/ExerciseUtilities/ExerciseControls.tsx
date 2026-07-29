import {
  AppState,
  AppStateStatus,
  Image,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Platform,
} from 'react-native';
import React, {FC, useEffect, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {AppColor, Fonts} from '../../../../Component/Color';
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
import ExerciseTimer from './ExerciseTimer';
import BottomControls from './BottomControls';
import useExerciseHook, {ExerciseData} from './useExerciseHook';
import {RequestAPI} from '../../../../Component/Utilities/RequestAPI';
// import {OpenAppAds} from '../../../../Component/BannerAdd';
import RestButtons from './RestButtons';
import FitText from '../../../../Component/Utilities/FitText';

type ExerciseControlsProps = {
  pause: boolean;
  setPause: Function;
  number: number;
  setNumber: Function;
  setIsRest: Function;
  setRestStartParent?: Function;
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
  isEventPage?: boolean | false;
  offerType?: boolean | false;
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
  setIsRest,
  setNumber,
  number,
  isEventPage,
  offerType,
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
  const [skip, setSkip] = useState(0);
  const [next, setNext] = useState(0);
  const [previous, setPrevious] = useState(0);
  const [musicLink, setMusicLink] = useState('');
  const Sat = getPurchaseHistory?.currentDay == 6;
  const Sun = getPurchaseHistory?.currentDay == 0;

  const apiCalls = () => {
    isEventPage
      ? postCurrentRewardsExerciseAPI()
      : type == 'focus' || type == 'bodypart'
      ? postSingleExerciseAPI()
      : postCurrentExerciseAPI();
  };

  const outNavigation = () => {
    releaseMusic();
    setPause(false);
    apiCalls();
    isEventPage
      ? navigation.navigate('WorkoutCompleted', {
          day: day,
          allExercise: allExercise,
          type: type,
        })
      : navigation.navigate('SaveDayExercise', {
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
    releaseMusic,
    restSet,
    setRestSet,
    setReset,
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
    apiCalls,
    skip,
    setSkip,
    musicLink,
  });

  // const {openAdClosed} = OpenAppAds();

  useEffect(() => {
    setIsRest(restSet);
  }, [restSet]);

  const resumeButton = () => {
    setBack(false);
    setPause(true);
  };
  useEffect(() => {
    const subscribe = AppState.addEventListener(
      'change',
      async (state: AppStateStatus) => {
        if (!restStart || !restSet) {
          if (state.match(/background|inactive/)) {
            setPause(false);
          } else if (state.match(/active/)) {
            // // const isClosed = await openAdClosed();
            // isClosed && setPause(true);
          }
        }
      },
    );
    return () => subscribe.remove();
  }, []);
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
    musicLink == '' && getMusicDetails();
  }, []);

  const getMusicDetails = () => {
    RequestAPI.makeRequest('GET', NewAppapi.GET_MUSIC_DETAILS, {}, res => {
      const exerciseMusic = res.data?.filter(
        (item: any) =>
          item?.type == 'Exercise' && item?.title == 'Background music',
      );
      setMusicLink(exerciseMusic[0]?.music_file);
    });
  };

  const quitFunction = () => {
    releaseMusic();
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
    offerType
      ? navigation.navigate('OfferPage', {type: 'cardioCompleted'})
      : isEventPage
      ? navigation?.navigate('WorkoutCompleted', {
          type: type,
          day: day,
          allExercise: allExercise,
        })
      : navigation.goBack();
  };

  const postCurrentExerciseAPI = async () => {
    const payload = new FormData();
    payload.append('id', trackerData[number]?.id);

    payload.append('day', type == 'day' ? day : WeekArray[day]);
    payload.append('type', type);
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
        lang: 'en',
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
  const postCurrentRewardsExerciseAPI = async () => {
    const payload = new FormData();
    payload.append('id', trackerData[number]?.id);

    payload.append('type', type);
    payload.append('day', WeekArray[day]);
    payload.append('workout_id', `-${day + 1}`);
    payload.append('user_id', getUserDataDetails?.id);
    payload.append('version', VersionNumber.appVersion);

    next > 0 && payload.append('next_status', next);
    previous > 0 && payload.append('prev_status', previous);
    skip > 0 && payload.append('skip_status', skip);

    try {
      const res = await axios({
        // url: url,
        url: NewAppapi.POST_REWARDS_EXERCISE,
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
          icon: {icon: 'auto', position: 'left'},
        });
      } else if (res.data) {
        setCompleted(completed + 1);
      }
      setSkip(0);
      setNext(0);
      setPrevious(0);
    } catch (error) {
      console.error(error, 'New Exewr PostREWARDSAPIERror');
    }
  };
  return (
    <>
      <View
        style={{
          width: '100%',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingTop: restSet ? 12 : 4,
          paddingBottom: restSet ? 24 : 16,
          backgroundColor: 'transparent',
        }}>
        <ExerciseTimer
          currentSet={currentSet}
          exerciseTitle={allExercise[number].exercise_title}
          seconds={seconds}
          restStart={restStart}
          totalSets={parseInt(allExercise[number].exercise_sets)}
        />
        {restStart ? (
          <View style={styles.readyContainer}>
            {/* Circle Countdown Progress */}
            <CircleProgress
              radius={46}
              progress={progressPercent}
              strokeWidth={18}
              changingColorsArray={['#FF2A54', '#E11D48']}
              secondayCircleColor="#FFF1F2">
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={reset}
                style={styles.skipCircleTouch}>
                <Icon name="skip-next" size={22} color="#E11D48" />
                <Text style={styles.skipCircleText}>SKIP</Text>
              </TouchableOpacity>
            </CircleProgress>

            {/* Form Tip Card */}
            <View style={styles.tipCard}>
              <View style={styles.tipIconWrap}>
                <Icon name="dumbbell" size={22} color="#FF2A54" />
              </View>
              <View style={styles.tipTextCol}>
                <Text style={styles.tipTitle}>Focus on your form</Text>
                <Text style={styles.tipSub}>
                  Slow and controlled movements give the best results.
                </Text>
              </View>
            </View>

            {/* Get Ready Main CTA Button */}
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={() => {
                setRestStart(false);
                reset();
              }}
              style={styles.getReadyTouch}>
              <LinearGradient
                colors={['#FF2A54', '#FF7E5F']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.getReadyGradient}>
                <Text style={styles.getReadyText}>Get Ready</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : restSet ? (
          <RestButtons
            reset={setReset}
            seconds={seconds}
            setRestSet={setRestSet}
            setSeconds={setSeconds}
          />
        ) : (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              alignSelf: 'center',
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
              number={number}
              progressPercent={progressPercent}
              setProgressPercent={setProgressPercent}
              previous={previous}
              setPrevious={setPrevious}
              next={next}
              setNext={setNext}
            />
          </View>
        )}
        <View style={{height: DeviceHeigth >= 1024 ? 20 : 0}} />
        {restSet && !restStart ? (
          <FitText type="Heading" value="Take a Rest" textAlign="center" />
        ) : (
          <BottomControls
            allExercise={allExercise}
            restStart={restStart}
            number={number}
            setRestStart={setRestStart}
            setCurrentSet={setCurrentSet}
            setNumber={setNumber}
            setProgressPercent={setProgressPercent}
            setSeconds={setSeconds}
            setPause={setPause}
            isEventPage={isEventPage}
          />
        )}
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

const styles = StyleSheet.create({
  readyContainer: {
    alignItems: 'center',
    width: '100%',
    marginVertical: 4,
  },
  skipCircleTouch: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipCircleText: {
    fontSize: 9,
    fontWeight: '800',
    fontFamily: Fonts.MONTSERRAT_BOLD,
    color: '#E11D48',
    letterSpacing: 0.5,
    marginTop: -2,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 16,
    width: '92%',
    marginTop: 18,
    marginBottom: 14,
    gap: 14,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  tipIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF1F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipTextCol: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: Fonts.MONTSERRAT_BOLD,
    color: '#111827',
    marginBottom: 2,
  },
  tipSub: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
    color: '#6B7280',
    lineHeight: 16,
  },
  getReadyTouch: {
    width: '92%',
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    marginTop: 4,
    marginBottom: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#FF2A54',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  getReadyGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  getReadyText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: Fonts.MONTSERRAT_BOLD,
    color: '#FFFFFF',
  },
});
