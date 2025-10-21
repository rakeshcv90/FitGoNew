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
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (getSoundOffOn) {
      if (initialized)
        restStart ? stopMusicandReset() : pause ? playMusic() : pauseMusic();
      else if (song?.length != 0) setupMusic();
    } else {
      releaseMusic();
    }
  }, [restStart, pause, initialized, song, getSoundOffOn]);

  useEffect(() => {
    // Start updating current position every second
    const intervalId = setInterval(async () => {
      const currentPosition = await MusicPlayer?.getCurrentPosition();
      setCurrentTime(currentPosition);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const setupMusic = async () => {
  
    const isInitialized = await MusicPlayer?.setupPlayer(song);
   
    if (isInitialized) {
      setInitialized(true);
      getDuration();
    } else setInitialized(false);
  };

  const getDuration = async () => {
    const time = await MusicPlayer?.getMusicDuration();

    setDuration(time);
  };

  const seekTo = (position: number) => {
    MusicPlayer.seekTo(position * 1000);
 
    getDuration();
  };

  const playMusic = () => {
   
    MusicPlayer?.play(duration <= 30);
  };

  const pauseMusic = () => {

    MusicPlayer?.pause();
  };

  const stopMusic = () => {
  
    MusicPlayer?.stopMusic();
  };
  const stopMusicandReset = () => {
   
    MusicPlayer?.stopMusicandReset();
  };
  const releaseMusic = () => {
  
    setInitialized(false);
    setDuration(0);
    MusicPlayer?.releaseMediaPlayer();
  };

  return {
    playMusic,
    pauseMusic,
    stopMusic,
    releaseMusic,
    stopMusicandReset,
    seekTo,
    currentTime,
    duration,
  };
};

export default useMusicPlayer;
