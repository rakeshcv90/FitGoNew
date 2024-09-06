import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  BackHandler,
} from 'react-native';
import React, {useCallback, useEffect} from 'react';
import NewHeader from '../../Component/Headers/NewHeader';
import {StatusBar} from 'react-native';
import {StyleSheet} from 'react-native';
import {AppColor, Fonts} from '../../Component/Color';
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
import AntDesign from 'react-native-vector-icons/AntDesign';
import Wrapper from '../WorkoutCompleteScreen/Wrapper';
import NewHeader1 from '../../Component/Headers/NewHeader1';
import FitIcon from '../../Component/Utilities/FitIcon';

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
      console.log('Music Player Error Meditation Exercise', error);
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

  const handleBackPress = useCallback(() => {
    TrackPlayer.reset();
    return false; // Allow default back behavior when switchButton is false
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress,
    );
    return () => backHandler.remove();
  }, [handleBackPress]);
  return (
    <>
      <View style={styles.container}>
        <Wrapper styles={styles.container}>
          <StatusBar
            barStyle={'light-content'}
            backgroundColor={'black'}
            translucent={false}
          />
          <NewHeader1
            header={route.params?.name}
            fillColor={AppColor.WHITE}
            headerStyle={{
              color: AppColor.WHITE,
              fontFamily: Fonts.HELVETICA_BOLD,
              fontSize: 20,
              textTransform: 'capitalize',
            }}
            backButton
            onBackPress={() =>{
              TrackPlayer.reset();
              navigation.goBack()
            }}
          />
          <View
            style={{
              width: '100%',
              height: '65%',
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              style={{
                width: '100%',
                height: '100%',
              }}
              resizeMode="contain"
              source={{
                uri: route.params.item?.exercise_mindset_image_link,
              }}
            />

            <Text
              style={{
                fontFamily: 'Montserrat-SemiBold',
                fontWeight: '700',
                lineHeight: 30,
                fontSize: 20,
                color: AppColor.WHITE,
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
                marginTop: DeviceHeigth * 0.04,
                marginBottom: DeviceHeigth * 0.01,
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
                {playbackState.state === State.Paused ||
                playbackState.state === State.Ready ? (
                  <FitIcon
                    type="FontAwesome5"
                    name={'play'}
                    size={30}
                    color={AppColor.WHITE}
                  />
                ) : (
                  <FitIcon
                    type="MaterialCommunityIcons"
                    name={'pause'}
                    size={30}
                    color={AppColor.WHITE}
                  />
                )}
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
        </Wrapper>
      </View>

      {/* {bannerAdsDisplay()} */}
      <BannerAdd bannerAdId={bannerAdId} />
    </>
  );
};
var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColor.BLACK,
  },
});
export default MeditationExerciseDetails;
