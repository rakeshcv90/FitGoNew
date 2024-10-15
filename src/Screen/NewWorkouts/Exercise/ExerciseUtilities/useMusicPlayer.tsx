import React, {useEffect} from 'react';
import {NativeModules} from 'react-native';

type Props = {
  song: string;
  restStart: boolean;
};

const useMusicPlayer = ({song, restStart}: Props) => {
  const MusicPlayer = NativeModules.MusicPlayer;

  useEffect(() => {
    restStart ? stopMusic() : playMusic();
  }, [restStart]);

  const playMusic = () => {
    MusicPlayer?.play(song);
  };
  const pauseMusic = () => {
    MusicPlayer?.pause();
  };
  const stopMusic = () => {
    MusicPlayer?.stopMusic();
  };

  return {playMusic, pauseMusic, stopMusic};
};

export default useMusicPlayer;
