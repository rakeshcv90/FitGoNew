import {useEffect, useRef, useState} from 'react';
import Tts from 'react-native-tts';
import {useSelector} from 'react-redux';
import TrackPlayer from 'react-native-track-player';
import {
  handleExerciseChange,
  initTts,
  resolveImportedAssetOrPath,
  songs,
} from './Helpers';
import {PLATFORM_IOS} from '../../../../Component/Color';
import {Platform} from 'react-native';
import useMusicPlayer from './useMusicPlayer';

export type ExerciseData = {
  exercise_bodypart: string;
  exercise_calories: string;
  exercise_equipment: string;
  exercise_gender: string;
  exercise_goal: string;
  exercise_id: number;
  exercise_image: string;
  exercise_image_link: string;
  exercise_injury: string;
  exercise_instructions: any;
  exercise_level: number;
  exercise_maxage: number;
  exercise_minage: number;
  exercise_reps: string;
  exercise_rest: string;
  exercise_sets: string;
  exercise_tips: string;
  exercise_title: string;
  exercise_video: string;
  exercise_workoutarea: string;
  fit_coins: number;
  video: string;
  week_day: string;
};
/**
 * Props for the useExerciseHook Hook.
 */
type ExerciseHookProps = {
  pause: boolean;
  back: boolean;
  setPause: Function;
  currentSet: number;
  setCurrentSet: Function;
  allExercise: Array<ExerciseData>;
  progressPercent: number;
  setProgressPercent: Function;
  outNavigation: Function;
  apiCalls: Function;
  getStoreVideoLoc?: any;
  number: number;
  setNumber: Function;
  skip: number;
  setSkip: Function;
  musicLink: string
};

const StartAudio = async () => {
  await TrackPlayer.play();
};
const PauseAudio = async () => {
  await TrackPlayer.reset();
};

const getReadyTime = 10;

const useExerciseHook = ({
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
  musicLink
}: ExerciseHookProps) => {
  const [restStart, setRestStart] = useState(false);
  const resetTime = parseInt(allExercise[number]?.exercise_rest.split(' ')[0]);
  const NUMBER_OF_SETS = parseInt(allExercise[number]?.exercise_sets);
  const EXERCISE_LENGTH = allExercise.length - 1;
  const hasSets = NUMBER_OF_SETS >= 0;
  const isIOS18 = PLATFORM_IOS && Platform.Version >= 18;
  const getSoundOffOn = useSelector((state: any) => state.getSoundOffOn);

  const [seconds, setSeconds] = useState(!restStart ? getReadyTime : resetTime);
  const exerciseTimerRef = useRef<any>(null);

  const {pauseMusic, playMusic, stopMusic, releaseMusic} = useMusicPlayer({
    song: musicLink,
    // song: resolveImportedAssetOrPath(songs[0]), //LOCAL MUSIC 
    restStart: restStart,
    pause: pause,
    getSoundOffOn: getSoundOffOn
  });

  const SPEAK = (words: string) => {
    !isIOS18 && getSoundOffOn && Tts.speak(words);
  };

  useEffect(() => {
    if (pause) {
      if (exerciseTimerRef.current) {
        clearTimeout(exerciseTimerRef.current);
      }
      if (seconds > 0) {
        exerciseTimerRef.current = setTimeout(() => {
          if (restStart) {
            if (seconds == getReadyTime)
              SPEAK(
                `Get Ready for ${allExercise[number]?.exercise_title} Exercise`,
              );
          }
          // stopMusic();
          if (seconds > 0) {
            setSeconds(seconds - 1);
            setProgressPercent(
              progressPercent + 100 / (restStart ? getReadyTime : resetTime),
            );
          }
        }, 1000);
      } else {
        console.log('ELSEASDAS');
        if (seconds == 0 && restStart) reset();
        else {
          if (hasSets) {
            if (currentSet < NUMBER_OF_SETS) {
              console.log('LESSS');
              setCurrentSet(currentSet + 1);
              setSeconds(restStart ? getReadyTime : resetTime);
              clearTimeout(exerciseTimerRef.current);
              setProgressPercent(0);
            } else {
              if (number == EXERCISE_LENGTH) {
                console.log('DONE');
                clearTimeout(exerciseTimerRef.current);
                outNavigation();
              } else {
                setSeconds(getReadyTime);
                setRestStart(true)
                apiCalls();
                clearTimeout(exerciseTimerRef.current);
                setCurrentSet(1);
                setProgressPercent(0);
                setNumber(number + 1);
                handleExerciseChange(
                  allExercise[number]?.exercise_title,
                  getStoreVideoLoc,
                );
              }
            }
          } else {
            if (number == EXERCISE_LENGTH) {
              clearTimeout(exerciseTimerRef.current);
              outNavigation();
            } else {
              setSeconds(!restStart ? getReadyTime : resetTime);
              apiCalls();
              clearTimeout(exerciseTimerRef.current);
              setCurrentSet(1);
              setProgressPercent(0);
              setNumber(number + 1);
              handleExerciseChange(
                allExercise[number]?.exercise_title,
                getStoreVideoLoc,
              );
            }
          }
        }
      }
    }
    // console.warn(seconds, restStart, number, currentSet);
    return () => {
      clearTimeout(exerciseTimerRef.current);
    };
  }, [seconds, pause, progressPercent, restStart, number, currentSet]);

  const reset = () => {
    PauseAudio();
    setRestStart(false);
    setProgressPercent(0);
    setSeconds(resetTime);
    setCurrentSet(1);
    setSkip(skip + 1);
    console.log('RESET');
  };

  return {
    seconds,
    reset,
    restStart,
    setRestStart,
    setSeconds,
    exerciseTimerRef,
    releaseMusic
  };
};

export default useExerciseHook;
