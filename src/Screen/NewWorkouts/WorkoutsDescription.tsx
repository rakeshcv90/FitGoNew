import {
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AppColor, Fonts, PLATFORM_IOS} from '../../Component/Color';
import {Image} from 'react-native';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import RenderHTML from 'react-native-render-html';
import Tts from 'react-native-tts';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector, useDispatch} from 'react-redux';
import AnimatedLottieView from 'lottie-react-native';
import {localImage} from '../../Component/Image';
import {setSoundOnOff} from '../../Component/ThemeRedux/Actions';
import Video from 'react-native-video';

const WorkoutsDescription = ({data, open, setOpen}: any) => {
  const [ttsInitialized, setTtsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const TextSpeech = `${data?.exercise_instructions}`;
  const [description, SetDescription] = useState('');
  const dispatch = useDispatch();

  const getSoundOffOn = useSelector((state: any) => state.getSoundOffOn);
  const getStoreVideoLoc = useSelector((state: any) => state.getStoreVideoLoc);
  const cleanText = TextSpeech.replace(/<\/?[^>]+(>|$)/g, '');
  const isIOS18 = PLATFORM_IOS && Platform.Version >= 18
  useEffect(() => {
    const initTts = async () => {
      const ttsStatus = await Tts.getInitStatus();

      if (!ttsStatus.isInitialized) {
        try {
          // await Tts.setDefaultVoice(
          //   Platform.OS == 'android'
          //     ? 'en-GB-default'
          //     : 'com.apple.voice.compact.en-IN.Rishi',
          // );
          await Tts.setDefaultLanguage('en-IN');
          await Tts.setDucking(true);
          await Tts.setIgnoreSilentSwitch('ignore');
          setTtsInitialized(true);
        } catch (error) {
          console.log('VoicessError', error);
        }
      }
      // Register tts-progress event listener outside the conditional block
      Tts.addEventListener('tts-progress', event => {});
    };

    initTts();
  }, []);
  useEffect(() => {
    if (open && getSoundOffOn == true && !isIOS18) {
      Tts.speak(cleanText);
    } else {
      Tts.stop();
    }
  }, [open, getSoundOffOn]);
  const tag = {
    p: {
      color: '#3A4750',
      fontSize: 12,
      lineHeight: 15,
      fontFamily: 'Poppins',
    },
    strong: {
      color: '#C8170D',
      fontSize: 10,
    },
    li: {
      color: '#505050',
      fontSize: 14,
      lineHeight: 22,
      fontFamily: 'Poppins',
      fontWeight: '500',
      marginBottom: 5,
    },
    ul: {
      color: '#3A4750',
    },
    ol: {
      color: '#3A4750',
    },
  };
  return (
    <Modal visible={open} onRequestClose={() => null} animationType="slide">
      <View
        style={{
          flex: 1,
          backgroundColor: AppColor.WHITE,
        }}>
           {isLoading && (
          <View style={styles.loader}>
            <AnimatedLottieView
              source={require('../../Icon/Images/NewImage2/Adloader.json')}
              speed={2}
              autoPlay
              loop
              resizeMode="contain"
              style={{
                height: DeviceWidth / 1.5,
                width: DeviceWidth * 0.95,
              }}
            />
          </View>
        )}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingLeft: 10,
            paddingRight: 10,
            marginTop: PLATFORM_IOS ? DeviceHeigth * 0.06 : DeviceHeigth * 0.03,
          }}>
          <TouchableOpacity
            onPress={() => setOpen(false)}
            style={{
              width: 25,
              height: 25,

              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Icon name="close" color={AppColor.DARKGRAY} size={25} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              if (getSoundOffOn) {
                dispatch(setSoundOnOff(false));
              } else {
                dispatch(setSoundOnOff(true));
              }
            }}
            style={{
              width: 25,
              height: 25,

              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              style={{
                width: 30,
                height: 30,

                alignItems: 'center',
                justifyContent: 'center',
              }}
              source={
                getSoundOffOn
                  ? require('../../Icon/Images/NewImage2/sound.png')
                  : require('../../Icon/Images/NewImage2/soundmute.png')
              }
            />
          </TouchableOpacity>
        </View>
        <Video
          source={{
            uri: data?.exercise_video,
          }}
          repeat={true}
          resizeMode="contain"
          style={{
            height: DeviceWidth * 0.7,
            width: DeviceWidth * 0.95,
            alignSelf: 'center',

            marginTop: 10,
            top: -DeviceHeigth * 0.07,
            zIndex: -1,
          }}
          onReadyForDisplay={() => {
            setIsLoading(false);
          }}
          // poster={
          //   data?.exercise_image?.includes('https')
          //     ? data?.exercise_image
          //     : data?.exercise_image_link
          // }
        />
        <View style={styles.container}>
          <View style={styles.content}>
            <Text
              style={{
                fontSize: 24,
                fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                color: AppColor.BLACK,
              }}>
              {data?.workout_title || data?.exercise_title}
            </Text>
            <Text />
            <ScrollView showsVerticalScrollIndicator={false}>
              {data?.workout_description ? (
                <RenderHTML
                  source={{html: data?.workout_description}}
                  contentWidth={DeviceWidth}
                  tagsStyles={tag}
                />
              ) : (
                <RenderHTML
                  source={{html: data?.exercise_instructions}}
                  contentWidth={DeviceWidth}
                  tagsStyles={tag}
                />
              )}
            </ScrollView>
          </View>
          <View style={styles.shadow}></View>
        </View>
      </View>
    </Modal>
  );
};

export default WorkoutsDescription;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    marginTop: -DeviceHeigth * 0.05,
  },
  content: {
    flex: 1,
    backgroundColor: AppColor.WHITE,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    padding: 10,
  },
  shadow: {
    position: 'absolute',
    top: -4, // Adjust this value to fine-tune the shadow position
    left: 0,
    right: 0,
    opacity: 0.6,
    height: 20, // Height of the shadow
    backgroundColor: AppColor.GRAY,
    // Adjust opacity as needed
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    zIndex: -1, // Push the shadow behind the content
  },
  category: {
    fontFamily: 'Poppins',
    fontSize: 16,
    fontWeight: '600',
    color: AppColor.BoldText,
    lineHeight: 30,
  },
  loader: {
    position: 'absolute',
    justifyContent: 'center',

    height: DeviceWidth / 1.5,
    width: DeviceWidth * 0.95,
    zIndex: 1,
    borderRadius: 5,
  },
});
