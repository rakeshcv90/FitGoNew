import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import NewHeader from '../../Component/Headers/NewHeader';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import {useIsFocused} from '@react-navigation/native';
import {AppColor, Fonts} from '../../Component/Color';
import RenderHTML from 'react-native-render-html';
import Tts from 'react-native-tts';
import {useSelector, useDispatch} from 'react-redux';
import AnimatedLottieView from 'lottie-react-native';
import {setSoundOnOff} from '../../Component/ThemeRedux/Actions';
import DietPlanHeader from '../../Component/Headers/DietPlanHeader';

const WorkoutDetail = ({navigation, route}) => {
  const data = route.params.item;
  const [ttsInitialized, setTtsInitialized] = useState(false);
  const getSoundOffOn = useSelector(state => state.getSoundOffOn);
  const TextSpeech = `${data?.exercise_instructions}`;
  const [description, SetDescription] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  let isFocuse = useIsFocused();
  const dispatch = useDispatch();
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
    if (isFocuse && getSoundOffOn == true) {
      Tts.speak(cleanText);
    } else {
      Tts.stop();
    }
  }, [isFocuse, getSoundOffOn]);

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
    <>
      <DietPlanHeader
        header={'Meals'}
        SearchButton={true}
        onPress={() => {
          getFilterData();
        }}
        source={
          getSoundOffOn
            ? require('../../Icon/Images/NewImage2/sound.png')
            : require('../../Icon/Images/NewImage2/soundmute.png')
        }
        onPressImage={() => {
          if (getSoundOffOn) {
            dispatch(setSoundOnOff(false));
          } else {
            dispatch(setSoundOnOff(true));
          }
        }}
      />
      <View style={styles.container}>
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
        <Image
          source={{uri: data?.exercise_image_link || data?.exercise_image}}
          onLoad={() => setIsLoading(false)}
          style={{
            height: DeviceWidth / 1.5,
            width: DeviceWidth * 0.95,
            alignSelf: 'center',
            marginTop: 10,
          }}
          resizeMode="contain"
        />

        <View style={styles.container1}>
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
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFDFD',
  },
  content: {
    flex: 1,
    backgroundColor: AppColor.WHITE,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    padding: 10,
  },
  container1: {
    flex: 1,
    position: 'relative',
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
  loader: {
    position: 'absolute',
    justifyContent: 'center',

    height: DeviceWidth / 1.5,
    width: DeviceWidth * 0.95,
    zIndex: 1,
    borderRadius: 5,
  },
});
export default WorkoutDetail;
