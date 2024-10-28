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
        restStart ? stopMusic() : pause ? playMusic() : pauseMusic();
      else if (song.length != 0) setupMusic();
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
    console.log('time', time);
    setDuration(time);
  };

  const seekTo = (position: number) => {
    MusicPlayer.seekTo(position * 1000);
    console.log('DURATION SEEK', position);
    getDuration();
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

  const releaseMusic = () => {
    console.log('RELEASE');
    setInitialized(false);
    setDuration(0);
    MusicPlayer?.releaseMediaPlayer();
  };

  return {
    playMusic,
    pauseMusic,
    stopMusic,
    releaseMusic,
    seekTo,
    duration,
    currentTime,
  };
};

export default useMusicPlayer;
