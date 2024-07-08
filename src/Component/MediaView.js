import React, {useState} from 'react';
import {Dimensions, Text, TouchableOpacity} from 'react-native';
import {NativeMediaView} from 'react-native-admob-native-ads';
import { Logger } from './utils';
import { DeviceHeigth } from './Config';


export const MediaView = ({aspectRatio = 1.5}) => {
  const onVideoPlay = () => {
    Logger('VIDEO', 'PLAY', 'Video is now playing');
  };

  const onVideoPause = () => {
    Logger('VIDEO', 'PAUSED', 'Video is now paused');
  };

  const onVideoProgress = event => {
    Logger('VIDEO', 'PROGRESS UPDATE', event);
  };

  const onVideoEnd = () => {
    Logger('VIDEO', 'ENDED', 'Video end reached');
  };

  const onVideoMute = muted => {
    Logger('VIDEO', 'MUTE', muted);
  };

  return (
    <>
      <NativeMediaView
        style={{
          width: '100%',
          height: DeviceHeigth*0.32,
          // marginTop:-20
          // backgroundColor: 'gray',
        }}
        onVideoPause={onVideoPause}
        onVideoPlay={onVideoPlay}
        onVideoEnd={onVideoEnd}
        onVideoProgress={onVideoProgress}
        onVideoMute={onVideoMute}
      />
    </>
  );
};
