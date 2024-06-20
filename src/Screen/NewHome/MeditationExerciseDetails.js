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
import {useIsFocused} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {BannerAdd} from '../../Component/BannerAdd';
import {bannerAdId} from '../../Component/AdsId';
import moment from 'moment';

const MeditationExerciseDetails = ({navigation, route}) => {
  let isFocused = useIsFocused();
  const playbackState = usePlaybackState();
  const getStoreVideoLoc = useSelector(state => state.getStoreVideoLoc);
  const {position, buffered, duration} = useProgress();
  const getPurchaseHistory = useSelector(state => state.getPurchaseHistory);
  const songs = [
    {
      title: 'song 1',
      artist: 'XYZ',
      artwork: localImage.Play3,
      url: route.params.item.exercise_mindset_audio,
      // url: getStoreVideoLoc[route.params.item.id],
    },
  ];
  useEffect(() => {
    if (isFocused) {
      setupPlayer();
    }
  }, [isFocused]);
  const setupPlayer = async () => {
    try {
      await TrackPlayer.add(songs);
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
  // const bannerAdsDisplay = () => {
  //   if (getPurchaseHistory.length > 0) {
  //     if (
  //       getPurchaseHistory[0]?.plan_end_date >= moment().format('YYYY-MM-DD')
  //     ) {
  //       return null;
  //     } else {
  //       return <BannerAdd bannerAdId={bannerAdId} />;
  //     }
  //   } else {
  //     return <BannerAdd bannerAdId={bannerAdId} />;
  //   }
  // };
  const handleValueChange = value => {};
  return (
    <>
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
            width: '100%',
            height: '55%',
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
                top:
                  Platform.OS == 'ios'
                    ? -DeviceHeigth * 0.1
                    : -DeviceHeigth * 0.12,
              }}
            />
          )}

          <Image
            style={{
              width: '100%',
              height: '100%',
            }}
            resizeMode="contain"
            source={require('../../Icon/Images/NewImage/meditation.png')}></Image>

          <Text
            style={{
              fontFamily: 'Montserrat-SemiBold',
              fontWeight: '700',
              lineHeight: 30,
              fontSize: 20,
              color: '#191919',
              textAlign: 'center',
              top: Platform.OS == 'android' ? 0 : -10,
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
              marginVertical: DeviceHeigth * 0.04,
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
              // onPress={async () => {
              //   await TrackPlayer.skipToPrevious();
              //   togglePlayback(playbackState);
              // }}
            >
              {/* <Image
                source={localImage.Farwed}
                style={{
                  height: 32,
                  width: 30,
                  alignSelf: 'center',
                  //tintColor: '#fff',
                }}
                resizeMode="contain"></Image> */}
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.4}
              style={{
                width: 60,
                height: 60,
                borderRadius: 120 / 2,
                alignItems: 'center',
                alignSelf: 'center',
                justifyContent: 'center',
              }}
              onPress={async () => {
                togglePlayback(playbackState);
              }}>
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
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  resizeMode="contain"></Image>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                alignItems: 'center',
                alignSelf: 'center',
                justifyContent: 'center',
                left: 15,
              }}
              // onPress={async () => {
              //   await TrackPlayer.skipToNext();
              //   togglePlayback(playbackState);
              // }}
            >
              {/* <Image
                source={localImage.Farwed}
                style={{
                  height: 30,
                  width: 30,
                  transform: [{rotate: '180deg'}],
                  alignSelf: 'center',
                }}
                resizeMode="contain"></Image> */}
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {/* {bannerAdsDisplay()} */}
      <BannerAdd bannerAdId={bannerAdId} />
    </>
  );
};
var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default MeditationExerciseDetails;
