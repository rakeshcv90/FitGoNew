import React, {useEffect, useState} from 'react';
import {NativeModules} from 'react-native';

type Props = {
  song: string;
  restStart: boolean;
  pause: boolean;
  getSoundOffOn: boolean;
};

const useMusicPlayer = ({song, restStart, pause, getSoundOffOn}: Props) => {
  const MusicPlayer = NativeModules.MusicPlayer;
  const [initialized, setInitialized] = useState(false);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (getSoundOffOn) {
      if (initialized)
        restStart ? stopMusicandReset() : pause ? playMusic() : pauseMusic();
      else if (song.length != 0) setupMusic();
    }else{
      releaseMusic()
    }
  }, [restStart, pause, initialized, song, getSoundOffOn]);

  const setupMusic = async () => {
    console.log('INITIALIZNG', song);
    const isInitialized = await MusicPlayer?.setupPlayer(song);
    console.log('Initiailedddd', isInitialized);
    if (isInitialized) {
      setInitialized(true);
      getDuration();
    } else setInitialized(false);
  };
  const getDuration = async () => {
    const time = await MusicPlayer?.getMusicDuration();
    setDuration(time);
  };

  const playMusic = () => {
    console.log('PLAYING', duration);
    MusicPlayer?.play(duration <= 30);
  };
  const pauseMusic = () => {
    console.log('PAUSED', pause);
    MusicPlayer?.pause();
  };
  const stopMusic = () => {
    console.log('STOP');
    MusicPlayer?.stopMusic();
  };
  const stopMusicandReset = () => {
    console.log('STOPandRESET');
    MusicPlayer?.stopMusicandReset();
  };
  const releaseMusic = () => {
    console.log('RELEASE');
    setInitialized(false)
    setDuration(0)
    MusicPlayer?.releaseMediaPlayer();
  };

  return {playMusic, pauseMusic, stopMusic, releaseMusic, stopMusicandReset};
};

export default useMusicPlayer;
