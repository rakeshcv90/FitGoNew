import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
} from 'react-native';
import React, {useEffect} from 'react';
import NewHeader from '../../Component/Headers/NewHeader';
import {StatusBar} from 'react-native';
import {StyleSheet} from 'react-native';
import {AppColor} from '../../Component/Color';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import LinearGradient from 'react-native-linear-gradient';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Platform} from 'react-native';
import {Image} from 'react-native';
import {localImage} from '../../Component/Image';
import AnimatedLottieView from 'lottie-react-native';
import TrackPlayer, {
  Capability,
  usePlaybackState,
  useProgress,
  State,
} from 'react-native-track-player';
import SeekBar from '../../Component/SeekBar';

const MeditationExerciseDetails = ({navigation, route}) => {
  const playbackState = usePlaybackState();

  const {position, buffered, duration} = useProgress();
  const songs = [
    {
      title: 'song 1',
      artist: 'XYZ',
      artwork: localImage.Play3,
      //   url: require('../../Icon/Images/NewImage/track1.mp3'),
      url: route.params.item.exercise_mindset_audio,
    },
  ];
  useEffect(() => {
    setupPlayer();
  }, []);
  const setupPlayer = async () => {
    try {
      await TrackPlayer.updateOptions({
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
          Capability.Stop,
        ],
        compactCapabilities: [Capability.Play, Capability.Pause],
      });
      await TrackPlayer.add(songs);
    } catch (error) {
      console.log('Music Player Error', error);
    }
  };
  const togglePlayback = async playbackState => {
    if (
      playbackState.state === State.Paused ||
      playbackState.state === State.Ready
    ) {
      await TrackPlayer.play();

    } else {
      await TrackPlayer.pause();
    }
  };
  const handleSlidingComplete = async value => {
    await TrackPlayer.seekTo(value);
  };

  const handleValueChange = value => {};
  return (
    <View style={styles.container}>

      <LinearGradient
        start={{x: 0, y: 1}}
        end={{x: 1, y: 0}}
        colors={['#A9CBF6', '#DEEDFF']}
        style={styles.container}>
        <TouchableOpacity
          style={{
            marginHorizontal: DeviceWidth * 0.03,
            marginVertical:
              Platform.OS == 'android'
                ? DeviceHeigth * 0.05
                : DeviceHeigth > 667
                ? DeviceHeigth * 0.06
                : DeviceHeigth * 0.035,
          }}
          onPress={() => {
            TrackPlayer.reset();
            navigation.goBack();
          }}>
          <Icons
            name={'chevron-left'}
            size={25}
            color={AppColor.INPUTTEXTCOLOR}
          />
        </TouchableOpacity>
        <StatusBar
          barStyle={'dark-content'}
          backgroundColor={'transparent'}
          translucent={true}
        />
        <View
          style={{
            width: 300,
            height: 300,
            marginVertical: -10,
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {playbackState.state == 'playing' && (
            <AnimatedLottieView
              source={require('../../Icon/Images/NewImage/MusicAnimation.json')}
              speed={2}
              autoPlay
              loop
              style={{
                width: 300,
                height: 300,
                position: 'absolute',
                top: -DeviceHeigth * 0.09,
              }}
            />
          )}

          <Image
            style={{
              width: 250,
              height: 250,
            }}
            resizeMode="cover"
            source={{
              uri: route.params.item.exercise_mindset_image_link,
            }}></Image>

          <Text
            style={{
              fontFamily: 'Poppins',
              fontWeight: '600',
              lineHeight: 30,
              fontSize: 20,
              color: '#191919',
              textAlign: 'center',
              marginVertical: 10,
            }}>
            {route.params.item.exercise_mindset_title}
          </Text>
        </View>
        <View
          style={{
            width: 350,
            height: DeviceHeigth * 0.15,
            marginVertical: 10,
            alignSelf: 'center',

            alignItems: 'center',
          }}>
          <View
            style={{
              width: 350,
              height: DeviceHeigth * 0.05,
            }}>
            <SeekBar
              currentPosition={position}
              duration={duration}
              onSlidingComplete={handleSlidingComplete}
              onValueChange={handleValueChange}
            />
          </View>

          <View
            style={{
              width: 350,
              flexDirection: 'row',
              justifyContent: 'center',
              alignSelf: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              style={{
                alignItems: 'center',
                alignSelf: 'center',
                justifyContent: 'center',
                left: -15,
              }}
              onPress={async () => {
                await TrackPlayer.skipToPrevious();
                togglePlayback(playbackState);
              }}>
              <Image
                source={localImage.Farwed}
                style={{
                  height: 32,
                  width: 30,
                  alignSelf: 'center',
                  //tintColor: '#fff',
                }}
                resizeMode="contain"></Image>
            </TouchableOpacity>

            <LinearGradient
              start={{x: 0, y: 1}}
              end={{x: 1, y: 0}}
              colors={['#236FD0', '#0D2A4E']}
              style={{
                width: 60,
                height: 60,
                borderRadius: 120 / 2,
                alignItems: 'center',
                alignSelf: 'center',
                justifyContent: 'center',
              }}>
              <TouchableOpacity
                style={{
                  alignItems: 'center',
                  alignSelf: 'center',
                  justifyContent: 'center',
                }}
                onPress={async () => {
                  togglePlayback(playbackState);
                }}>
                <Image
                  source={
                    playbackState.state === State.Paused ||
                    playbackState.state === State.Ready
                      ? localImage.Play3
                      : localImage.Pause
                  }
                  style={{
                    height: 25,
                    width: 25,
                    left: playbackState.state === State.Paused && 2,
                    alignSelf: 'center',
                    tintColor: '#fff',
                  }}
                  resizeMode="contain"></Image>
              </TouchableOpacity>
            </LinearGradient>

            <TouchableOpacity
              style={{
                alignItems: 'center',
                alignSelf: 'center',
                justifyContent: 'center',
                left: 15,
              }}
              onPress={async () => {
                await TrackPlayer.skipToNext();
                togglePlayback(playbackState);
              }}>
              <Image
                source={localImage.Farwed}
                style={{
                  height: 30,
                  width: 30,
                  transform: [{rotate: '180deg'}],
                  alignSelf: 'center',
                }}
                resizeMode="contain"></Image>
            </TouchableOpacity>
          </View>
        </View>
        <LinearGradient
          start={{x: 0, y: 1}}
          end={{x: 1, y: 0}}
          colors={['#2169C4', '#103360']}
          style={{
            width: 350,
            height: DeviceHeigth * 0.25,
            marginVertical: 15,
            borderRadius: 6,
            alignSelf: 'center',
            padding: 10,
            justifyContent: 'center',
          }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text
              style={{
                fontFamily: 'Poppins',
                fontWeight: '500',
                lineHeight: 15,
                fontSize: 12,
                color: '#FFFFFF',
              }}>
              {route.params.item.exercise_mindset_description}
            </Text>
          </ScrollView>
        </LinearGradient>
      </LinearGradient>
    </View>
  );
};
var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default MeditationExerciseDetails;
