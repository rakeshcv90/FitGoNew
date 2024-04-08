import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AppColor} from '../../Component/Color';
import {Image} from 'react-native';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import RenderHTML from 'react-native-render-html';
import Tts from 'react-native-tts';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector, useDispatch} from 'react-redux';
const WorkoutsDescription = ({data, open, setOpen}: any) => {
  const [ttsInitialized, setTtsInitialized] = useState(false);

  const TextSpeech = `${data?.exercise_instructions}`;
  const [description, SetDescription] = useState('');

  const getSoundOffOn = useSelector((state: any) => state.getSoundOffOn);
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
            alignItems:'center',
            justifyContent:'center',
       
            marginTop: DeviceHeigth * 0.045,
          }}>
          <Icon name="close" color={AppColor.DARKGRAY} size={25} />
        </TouchableOpacity>
        <Image
          source={{uri: data?.workout_image_link || data?.exercise_image}}
          style={{
            height: DeviceWidth / 1.5,
            width: DeviceWidth * 0.95,
            alignSelf: 'center',
            marginTop: 10,
          }}
          resizeMode="contain"
        />

        <View style={styles.container}>
          <View style={styles.content}>
            <Text
              style={{
                fontSize: 24,
                fontFamily: 'Poppins-SemiBold',
                color: AppColor.BLACK,
              }}>
              {data?.workout_title || data?.exercise_title}
            </Text>
            <Text />
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
});
