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
import {AppColor, Fonts} from '../../Component/Color';
import {Image} from 'react-native';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import RenderHTML from 'react-native-render-html';
import Tts from 'react-native-tts';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector, useDispatch} from 'react-redux';
import AnimatedLottieView from 'lottie-react-native';
import FastImage from 'react-native-fast-image';
import {localImage} from '../../Component/Image';
const WorkoutsDescription = ({data, open, setOpen}: any) => {
  const [ttsInitialized, setTtsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const TextSpeech = `${data?.exercise_instructions}`;
  const [description, SetDescription] = useState('');

  const getSoundOffOn = useSelector((state: any) => state.getSoundOffOn);
  const getStoreVideoLoc = useSelector((state: any) => state.getStoreVideoLoc);
  const cleanText = TextSpeech.replace(/<\/?[^>]+(>|$)/g, '');
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
    if (open && getSoundOffOn == true) {
      Tts.speak(cleanText);
    } else {
      Tts.stop();
    }
  }, [open]);
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
        <TouchableOpacity
          onPress={() => setOpen(false)}
          style={{
            width: 25,
            height: 25,
            alignSelf: 'flex-end',
            left: -10,
            alignItems: 'center',
            justifyContent: 'center',

            marginTop: DeviceHeigth * 0.045,
          }}>
          <Icon name="close" color={AppColor.DARKGRAY} size={25} />
        </TouchableOpacity>
        {/* {isLoading && (
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
        )} */}
        {/* <Image
          source={{
            uri:
              getStoreVideoLoc[data?.exercise_title + 'Image'] != undefined
                ? 'file://' + getStoreVideoLoc[data?.exercise_title + 'Image']
                : getStoreVideoLoc[data?.workout_title + 'Image'] != undefined
                ? 'file://' + getStoreVideoLoc[data?.workout_title + 'Image']
                : data?.exercise_image?.includes('https')
                ? data?.exercise_image
                : data?.exercise_image_link,
          }}
          onLoad={() => setIsLoading(false)}
          style={{
            height: DeviceWidth / 1.5,
            width: DeviceWidth * 0.95,
            alignSelf: 'center',
            // marginTop: 10,
            top: -DeviceHeigth * 0.07,
            zIndex: -1,
          }}
          resizeMode="contain"
        /> */}
        <FastImage
          fallback={true}
          // onError={onError}
          // onLoadEnd={onLoadEnd}
          // onLoadStart={onLoadStart}
          // onLoad={() => setIsLoading(false)}
          style={{
            height: DeviceWidth / 1.5,
            width: DeviceWidth * 0.95,
            alignSelf: 'center',
     
            // marginTop: 10,
            top: -DeviceHeigth * 0.07,
            zIndex: -1,
          }}
          source={{
            uri:
              getStoreVideoLoc[data?.exercise_title + 'Image'] != undefined
                ? 'file://' + getStoreVideoLoc[data?.exercise_title + 'Image']
                : getStoreVideoLoc[data?.workout_title + 'Image'] != undefined
                ? 'file://' + getStoreVideoLoc[data?.workout_title + 'Image']
                : data?.exercise_image?.includes('https')
                ? data?.exercise_image
                : data?.exercise_image_link,

            headers: {Authorization: 'someAuthToken'},
            priority: FastImage.priority.high,
          }}
          resizeMode={FastImage.resizeMode.contain}
          defaultSource={localImage.NOWORKOUT}
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
