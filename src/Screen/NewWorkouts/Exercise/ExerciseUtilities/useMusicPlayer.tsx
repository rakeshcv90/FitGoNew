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
  if (!MusicPlayer) {
    console.warn("NativeModules.MusicPlayer is undefined! You MUST rebuild the native app.");
  }
  const [initialized, setInitialized] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const settingUp = React.useRef(false);

  useEffect(() => {
    if (getSoundOffOn) {
      if (initialized)
        restStart ? stopMusicandReset() : pause ? playMusic() : pauseMusic();
      else if (song?.length != 0 && !settingUp.current) setupMusic();
    } else {
      releaseMusic();
    }
  }, [restStart, pause, initialized, song, getSoundOffOn]);

  useEffect(() => {
    // Start updating current position every second
    const intervalId = setInterval(async () => {
      try {
        const currentPosition = await MusicPlayer?.getCurrentPosition();
        if (currentPosition !== undefined && !isNaN(currentPosition)) {
          setCurrentTime(currentPosition);
        } else {
          setCurrentTime(0);
        }
      } catch (e) {
        console.warn("Failed to get current position:", e);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const setupMusic = async () => {
    settingUp.current = true;
    try {
      const isInitialized = await MusicPlayer?.setupPlayer(song);

      if (isInitialized) {
        setInitialized(true);
        // Fetch duration, retry once after a delay if it returns 0
        const time = await MusicPlayer?.getMusicDuration();
        if (time !== undefined && !isNaN(time) && time > 0) {
          setDuration(time);
        } else {
          // Retry after 1.5 seconds — remote streams may take time to report duration
          setTimeout(async () => {
            await getDuration();
          }, 1500);
        }
      } else {
        setInitialized(false);
      }
    } catch (e) {
      console.warn("setupMusic failed:", e);
      setInitialized(false);
    } finally {
      settingUp.current = false;
    }
  };

  const getDuration = async () => {
    try {
      const time = await MusicPlayer?.getMusicDuration();
      if (time !== undefined && !isNaN(time)) {
        setDuration(time);
      } else {
        setDuration(0);
      }
    } catch (e) {
      console.warn("Failed to get duration:", e);
    }
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
    initialized,
  };
};

export default useMusicPlayer;
