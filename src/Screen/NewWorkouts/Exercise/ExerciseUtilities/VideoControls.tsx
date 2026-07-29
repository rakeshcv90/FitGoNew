import {StyleSheet, TouchableOpacity, View, Platform} from 'react-native';
import React, {useCallback} from 'react';
import Animated, {ZoomIn} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import FitIcon from '../../../../Component/Utilities/FitIcon';
import CircleProgress from '../../../../Component/Utilities/ProgressCircle';
import {handleExerciseChange} from './Helpers';
import {AppColor} from '../../../../Component/Color';

type VideoControls = {
  pause: boolean;
  setPause: Function;
  number: number;
  setNumber: Function;
  seconds: number;
  setSeconds: Function;
  next: number;
  setNext: Function;
  previous: number;
  setPrevious: Function;
  setCurrentSet: Function;
  allExercise: Array<any>;
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
  getStoreVideoLoc,
  progressPercent,
  setProgressPercent,
  next,
  previous,
  setNext,
  setPrevious,
}: VideoControls) => {
  const isFirst = number === 0;
  const isLast = number === (allExercise?.length || 1) - 1;

  const prev = () => {
    if (isFirst) return;
    setCurrentSet(1);
    setProgressPercent(0);
    setPrevious(previous + 1);
    handleExerciseChange(
      allExercise[number - 1]?.exercise_title,
      getStoreVideoLoc,
    );
    setSeconds(allExercise[number - 1]?.exercise_rest.split(' ')[0]);
    setNumber(number - 1);
  };

  const nextButton = () => {
    if (isLast) return;
    setCurrentSet(1);
    setProgressPercent(0);
    setNext(next + 1);
    handleExerciseChange(
      allExercise[number + 1]?.exercise_title,
      getStoreVideoLoc,
    );
    setSeconds(allExercise[number + 1]?.exercise_rest.split(' ')[0]);
    setNumber(number + 1);
  };

  const handlePrev = useCallback(prev, [prev]);
  const handleNext = useCallback(nextButton, [nextButton]);

  return (
    <Animated.View entering={ZoomIn.delay(100).duration(400)} style={styles.controlsRow}>
      {/* Skip Previous Button - Vibrant Pink Button */}
      <TouchableOpacity
        activeOpacity={0.7}
        disabled={isFirst}
        onPress={handlePrev}
        style={[styles.skipBtn, isFirst && styles.skipBtnDisabled]}>
        <FitIcon
          name="skip-previous"
          type="MaterialCommunityIcons"
          size={24}
          color={isFirst ? '#FF7E95' : '#E11D48'}
        />
      </TouchableOpacity>

      {/* Circle Progress Play/Pause - Vibrant Red Gradient Center */}
      <CircleProgress
        radius={48}
        progress={progressPercent}
        strokeLinecap={seconds === 0 ? 'butt' : 'round'}
        strokeWidth={18}
        changingColorsArray={['#FF2A54', '#E11D48']}
        secondayCircleColor="#FFF1F2">
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.playPauseTouch}
          onPress={() => {
            setPause(!pause);
          }}>
          <LinearGradient
            colors={['#FF2A54', '#E11D48']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.playPauseGradient}>
            <FitIcon
              name={!pause ? 'play' : 'pause'}
              type="MaterialCommunityIcons"
              size={30}
              color="#FFFFFF"
            />
          </LinearGradient>
        </TouchableOpacity>
      </CircleProgress>

      {/* Skip Next Button - Vibrant Pink Button */}
      <TouchableOpacity
        activeOpacity={0.7}
        disabled={isLast}
        onPress={handleNext}
        style={[styles.skipBtn, isLast && styles.skipBtnDisabled]}>
        <FitIcon
          name="skip-next"
          type="MaterialCommunityIcons"
          size={24}
          color={isLast ? '#FF7E95' : '#E11D48'}
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default VideoControls;

const styles = StyleSheet.create({
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 32,
    alignSelf: 'center',
    marginVertical: 8,
  },
  skipBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF1F2',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FECDD3',
    ...Platform.select({
      ios: {
        shadowColor: '#FF2A54',
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.15,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  skipBtnDisabled: {
    backgroundColor: '#FFF5F7',
    borderColor: '#FFE4E6',
    opacity: 0.85,
  },
  playPauseTouch: {
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playPauseGradient: {
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#FF2A54',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
});
