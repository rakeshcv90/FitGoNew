import {
  AppState,
  AppStateStatus,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import FitSlider from '../../Component/Utilities/FitSlider';
import {AppColor} from '../../Component/Color';
import {DeviceHeigth} from '../../Component/Config';
import FitIcon from '../../Component/Utilities/FitIcon';
import useMusicPlayer from '../NewWorkouts/Exercise/ExerciseUtilities/useMusicPlayer';
import {navigationRef} from '../../../App';
import { OpenAppAds } from '../../Component/BannerAdd';

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
};

const MeditationMusic = ({
  allMeditation,
  number,
  backPressed,
  setNumber,
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
  } = useMusicPlayer({
    song: backPressed ? '' : allMeditation[number].exercise_mindset_audio,
    // song: 'https://fitme.cvinfotechserver.com/images/1729659559.mp3',
    pause: pause,
    getSoundOffOn: true,
    restStart: false,
  });

  const {openAdClosed} = OpenAppAds();

  useEffect(() => {
    const subscribe = AppState.addEventListener(
      'change',
      async (state: AppStateStatus) => {
        if (state.match(/background|inactive/)) {
          setPause(false);
        } else if (state.match(/active/)) {
          const isClosed = await openAdClosed();
          isClosed && setPause(true);
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
      <FitSlider
        slideColor={AppColor.WHITE}
        slideHeight={2}
        duration={duration}
        currentPosition={currentTime}
        initialValue={0}
        seekTo={seekTo}
        textColor={AppColor.WHITE}
        forMusicPlayer
        showText
        autoAnimation={pause}
        onCompletion={onCompletion}
        setPause={setPause}
      />
      <View style={styles.row}>
        <TouchableOpacity disabled={number == 0} onPress={prev}>
          <FitIcon
            name="skip-previous"
            type="MaterialCommunityIcons"
            size={30}
            style={{
              color: AppColor.WHITE,
              opacity: number == 0 ? 0.5 : 1,
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setPause(!pause)}>
          <FitIcon
            name={!pause ? 'play' : 'pause'}
            type="MaterialCommunityIcons"
            size={60}
            color={AppColor.WHITE}
          />
        </TouchableOpacity>
        <TouchableOpacity
          disabled={number == allMeditation.length - 1}
          onPress={next}>
          <FitIcon
            name="skip-next"
            type="MaterialCommunityIcons"
            size={30}
            style={{
              color: AppColor.WHITE,
              opacity: number == allMeditation.length - 1 ? 0.5 : 1,
            }}
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
    height: DeviceHeigth * 0.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '50%',
    alignSelf: 'center',
  },
});
