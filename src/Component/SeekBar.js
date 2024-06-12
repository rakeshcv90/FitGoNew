import React from 'react';
import {View, Text, Platform} from 'react-native';
import Slider from '@react-native-community/slider';
import {DeviceHeigth, DeviceWidth} from './Config';
import {StyleSheet} from 'react-native';

const SeekBar = ({
  currentPosition,
  duration,
  onSlidingComplete,
  onValueChange,
}) => {
  const formatTime = seconds => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return (
    <View style={{}}>
      <Slider
        style={{width: '100%', }}
        minimumValue={0}
        maximumValue={duration}
        thumbTintColor="#2578E2"
        value={currentPosition}
        minimumTrackTintColor="#0E2C52"
        maximumTrackTintColor="#FFFFFF"
        onSlidingComplete={onSlidingComplete}
        onValueChange={onValueChange}
        trackStyle={styles.track}
      />
      <View
        style={{
          // width:
          //   Platform.OS == 'android' ? DeviceWidth * 0.82 : DeviceWidth * 0.8,
          // height: DeviceHeigth * 0.02,
          flexDirection: 'row',

          justifyContent: 'space-between',

          marginVertical: 5,
        }}>
        <Text style={styles.textView}>{formatTime(currentPosition)}</Text>
        <Text style={styles.textView1}>{formatTime(duration)}</Text>
      </View>
    </View>
  );
};
var styles = StyleSheet.create({
  textView: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 15,
    textAlign: 'center',
    fontFamily: 'Montserrat-SemiBold',
    color: '#191919',
  },
  textView1: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 15,
    textAlign: 'center',
    fontFamily: 'Montserrat-SemiBold',
    color: '#191919',
  },
  track: {
    height: 30, // Change the height to increase the thickness of the track
   // borderRadius: 5, // Optional: You can add border-radius for rounded ends
  },
});
export default SeekBar;
