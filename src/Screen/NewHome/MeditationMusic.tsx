import {
  AppState,
  AppStateStatus,
  StyleSheet,
  TouchableOpacity,
  View,
  Platform,
  ActivityIndicator,
  Text,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import FitSlider from '../../Component/Utilities/FitSlider';
import {AppColor, Fonts} from '../../Component/Color';
import {DeviceHeigth} from '../../Component/Config';
import FitIcon from '../../Component/Utilities/FitIcon';
import useMusicPlayer from '../NewWorkouts/Exercise/ExerciseUtilities/useMusicPlayer';
import {navigationRef} from '../../Component/Utilities/NavigationUtil';
import LinearGradient from 'react-native-linear-gradient';

type MindsetData = {
  exercise_mindset_area: string;
  exercise_mindset_audio: string;
  exercise_mindset_description: string;
  exercise_mindset_healthlevel: string;
  exercise_mindset_image: string;
  exercise_mindset_image_link: string;
  exercise_mindset_maxage: number;
  exercise_mindset_maxsleep: number;
  exercise_mindset_minage: 11;
  exercise_mindset_minsleep: string;
  exercise_mindset_time: string;
  exercise_mindset_title: string;
  id: number;
  workout_mindset_id: string;
};

type Props = {
  allMeditation: Array<MindsetData>;
  number: number;
  backPressed: boolean;
  setNumber: Function;
  onPlayStateChange?: (isPlaying: boolean) => void;
};

const MeditationMusic = ({
  allMeditation,
  number,
  backPressed,
  setNumber,
  onPlayStateChange,
}: Props) => {
  const [pause, setPause] = useState(false);

  const {
    pauseMusic,
    playMusic,
    releaseMusic,
    stopMusic,
    seekTo,
    duration,
    currentTime,
    initialized,
  } = useMusicPlayer({
    song: backPressed ? '' : allMeditation[number].exercise_mindset_audio,
    pause: pause,
    getSoundOffOn: true,
    restStart: false,
  });

  const isLoading = pause && !initialized;

  // Only trigger animations when audio is loaded AND user wants to play
  useEffect(() => {
    onPlayStateChange?.(pause && initialized);
  }, [pause, initialized]);

  useEffect(() => {
    const subscribe = AppState.addEventListener(
      'change',
      async (state: AppStateStatus) => {
        if (state.match(/background|inactive/)) {
          setPause(false);
        } else if (state.match(/active/)) {
        }
      },
    );
    return () => subscribe.remove();
  }, []);

  useEffect(() => {
    if (backPressed) {
      releaseMusic();
      setPause(false);
      navigationRef.current?.goBack();
    }
    setPause(true);
  }, [backPressed]);

  const prev = () => {
    releaseMusic();
    setNumber(number - 1);
  };
  const next = () => {
    releaseMusic();
    setNumber(number + 1);
  };

  const onCompletion = () => {
    setPause(false);
    releaseMusic();
    navigationRef.current?.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Loading Status Indicator Pill */}
      {isLoading && (
        <View style={styles.loadingBanner}>
          <ActivityIndicator size="small" color="#F093FB" />
          <Text style={styles.loadingText}>Loading audio...</Text>
        </View>
      )}

      {/* Slider */}
      <View style={styles.sliderContainer}>
        <FitSlider
          slideColor={'rgba(255,255,255,0.8)'}
          slideHeight={3}
          duration={duration}
          currentPosition={currentTime}
          initialValue={0}
          seekTo={seekTo}
          textColor={'rgba(255,255,255,0.6)'}
          forMusicPlayer
          showText
          autoAnimation={pause && initialized}
          onCompletion={onCompletion}
          setPause={setPause}
        />
      </View>

      {/* Controls */}
      <View style={styles.controlsRow}>
        {/* Previous */}
        <TouchableOpacity
          disabled={number == 0 || isLoading}
          onPress={prev}
          style={[styles.smallControlBtn, (number == 0 || isLoading) && {opacity: 0.35}]}>
          <FitIcon
            name="skip-previous"
            type="MaterialCommunityIcons"
            size={26}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        {/* Play / Pause / Loading */}
        <TouchableOpacity
          onPress={() => setPause(!pause)}
          disabled={isLoading}
          activeOpacity={0.85}>
          <LinearGradient
            colors={['#667EEA', '#764BA2']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.playPauseBtn}>
            {isLoading ? (
              <ActivityIndicator size="large" color="#FFFFFF" />
            ) : (
              <FitIcon
                name={!pause ? 'play' : 'pause'}
                type="MaterialCommunityIcons"
                size={32}
                color="#FFFFFF"
              />
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* Next */}
        <TouchableOpacity
          disabled={number == allMeditation.length - 1 || isLoading}
          onPress={next}
          style={[
            styles.smallControlBtn,
            (number == allMeditation.length - 1 || isLoading) && {opacity: 0.35},
          ]}>
          <FitIcon
            name="skip-next"
            type="MaterialCommunityIcons"
            size={26}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MeditationMusic;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    position: 'relative',
  },
  loadingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(240,147,251,0.15)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(240,147,251,0.3)',
    marginBottom: 10,
  },
  loadingText: {
    color: '#F093FB',
    fontSize: 12,
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    fontWeight: '600',
  },
  sliderContainer: {
    width: '100%',
    marginBottom: 16,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 30,
  },
  smallControlBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  playPauseBtn: {
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#764BA2',
        shadowOffset: {width: 0, height: 6},
        shadowOpacity: 0.5,
        shadowRadius: 12,
      },
      android: {
        elevation: 10,
      },
    }),
  },
});
