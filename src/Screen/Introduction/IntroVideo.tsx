import {
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useState} from 'react';
import Video from 'react-native-video';
import {AppColor, Fonts} from '../../Component/Color';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import {useSelector} from 'react-redux';
import {ActivityIndicator} from 'react-native-paper';
import ActivityLoader from '../../Component/ActivityLoader';
import {localImage} from '../../Component/Image';
import LinearGradient from 'react-native-linear-gradient';

const IntroVideo = ({navigation}: any) => {
  const getStoreVideoLoc = useSelector((state: any) => state.getStoreVideoLoc);
  const [videoLoaded, setVideoLoaded] = useState(false);
  return (
    <LinearGradient
      colors={['#FF5C31', '#FFA100', '#FFA100']}
      start={{
        x: 1,
        y: 1,
      }}
      end={{
        x: 1,
        y: 1,
      }}
      style={{flex: 1}}>
      <StatusBar barStyle={'light-content'} backgroundColor={'#ed471a'} />
      {!videoLoaded && (
        <ImageBackground
          source={localImage.Thumbnail}
          style={{
            height: '100%',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          resizeMode="stretch">
          <View style={{height: 100, width: 100}}>
            <ActivityIndicator size={40} color={AppColor.BLACK} />
          </View>
        </ImageBackground>
      )}
      <Video
        // source={{uri: getStoreVideoLoc['Fitmerewardvideo']}}
        source={{
          uri: 'https://res.cloudinary.com/drfp9prvm/video/upload/v1718971902/IMG_179656959_rgraiy_cdg5hs.mp4',
        }}
        onReadyForDisplay={() => {
          setVideoLoaded(true);
        }}
        onLoad={() => {
          console.log('first');
        }}
        onLoadStart={() => {
          console.log('zero');
        }}
        controls={false}
        paused={false}
        repeat={false}
        style={{
          width: DeviceWidth,
          height: DeviceHeigth,
          alignSelf: 'center',
          bottom: -DeviceWidth * 0.2,
          position: 'absolute',
        }}
        onEnd={() =>
          navigation.navigate('BottomTab', {
            screen: 'Home',
          })
        }
        muted
        resizeMode="contain"
        onError={() => {
          setTimeout(() => {
            navigation.navigate('BottomTab', {
              screen: 'Home',
            });
          }, 3000);
        }}
        // fullscreen
      />
      {videoLoaded && (
        <Text
          onPress={() =>
            navigation.navigate('BottomTab', {
              screen: 'Home',
            })
          }
          style={{
            fontSize: 15,
            fontWeight: '600',
            fontFamily: Fonts.MONTSERRAT_BOLD,
            textDecorationLine: 'underline',
            color: AppColor.WHITE,
            position: 'absolute',
            top: DeviceHeigth*0.1,
            right: 16,
          }}>
          Skip
        </Text>
      )}
    </LinearGradient>
  );
};

export default IntroVideo;

const styles = StyleSheet.create({});
