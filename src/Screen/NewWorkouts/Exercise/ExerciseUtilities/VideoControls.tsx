import {StyleSheet, TouchableOpacity, View, Animated} from 'react-native';
import React, {Ref, useCallback, useRef} from 'react';
import FitIcon from '../../../../Component/Utilities/FitIcon';
import CircleProgress from '../../../../Component/Utilities/ProgressCircle';
import {handleExerciseChange} from './Helpers';

type VideoControls = {
  pause: boolean;
  setPause: Function;
  number: number;
  setNumber: Function;
  seconds: number;
  setSeconds: Function;
  setCurrentSet: Function;
  allExercise: Array<any>;
  exerciseTimerRef: Ref<null>;
  getStoreVideoLoc: any;
  progressPercent: number;
  setProgressPercent: Function;
};

const VideoControls = ({
  allExercise,
  number,
  pause,
  seconds,
  setNumber,
  setPause,
  setSeconds,
  setCurrentSet,
  exerciseTimerRef,
  getStoreVideoLoc,
  progressPercent,
  setProgressPercent,
}: VideoControls) => {
  const prev = () => {
    setCurrentSet(1);
    // animatedProgress.setValue(0);
    setProgressPercent(0);
    // clearTimeout(exerciseTimerRef.current);
    handleExerciseChange(
      allExercise[number - 1]?.exercise_title,
      getStoreVideoLoc,
    );
    setSeconds(allExercise[number - 1]?.exercise_rest.split(' ')[0]);
    setNumber(number - 1);
  };
  const next = () => {
    setCurrentSet(1);
    setProgressPercent(0);
    //   clearTimeout(exerciseTimerRef.current);
    handleExerciseChange(
      allExercise[number + 1]?.exercise_title,
      getStoreVideoLoc,
    );
    setSeconds(allExercise[number + 1]?.exercise_rest.split(' ')[0]);
    setNumber(number + 1);
  };

  const handlePrev = useCallback(() => {
    prev(); // Call the function here instead of directly in JSX
  }, [prev]);

  const handleNext = useCallback(() => {
    next(); // Call the function here instead of directly in JSX
  }, [next]);

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '80%',
        alignSelf: 'center',
      }}>
      <TouchableOpacity disabled={number == 0} onPress={handlePrev}>
        <FitIcon
          name="skip-previous"
          type="MaterialCommunityIcons"
          size={30}
          style={{
            color: '#6B7280',
            opacity: number == 0 ? 0.5 : 1,
          }}
        />
      </TouchableOpacity>
      <CircleProgress
        radius={50}
        progress={progressPercent}
        strokeLinecap={seconds == 0 ? 'butt' : 'round'}
        strokeWidth={25}
        changingColorsArray={['#530014', '#F0013B']}
        secondayCircleColor="#F0013B">
        <TouchableOpacity onPress={() => setPause(!pause)}>
          <FitIcon
            name={!pause ? 'play' : 'pause'}
            type="MaterialCommunityIcons"
            size={40}
            color="#1F2937"
          />
        </TouchableOpacity>
      </CircleProgress>
      <TouchableOpacity
        disabled={number == allExercise?.length - 1}
        onPress={handleNext}>
        <FitIcon
          name="skip-next"
          type="MaterialCommunityIcons"
          size={30}
          style={{
            color: '#6B7280',
            opacity: number == allExercise?.length - 1 ? 0.5 : 1,
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default VideoControls;

const styles = StyleSheet.create({});
