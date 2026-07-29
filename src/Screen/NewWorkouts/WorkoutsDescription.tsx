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
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../Component/Config';
import RenderHTML from 'react-native-render-html';
import Tts from 'react-native-tts';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector, useDispatch} from 'react-redux';
import AnimatedLottieView from 'lottie-react-native';
import {localImage} from '../../Component/Image';
import {setSoundOnOff} from '../../Component/ThemeRedux/Actions';
import Video from 'react-native-video';
import axios from 'axios';
import VersionNumber from 'react-native-version-number';
import {getCurrentLanguage} from '../Translation/TranslationService';

const WorkoutsDescription = ({data, open, setOpen, id}: any) => {
  const [ttsInitialized, setTtsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [videoAspect, setVideoAspect] = useState(16 / 9);
  const TextSpeech = `${data?.exercise_instructions}`;
  const [description, SetDescription] = useState('');
  const [title, setTitle] = useState('');
  const dispatch = useDispatch();

  const getSoundOffOn = useSelector((state: any) => state.getSoundOffOn);
  const getStoreVideoLoc = useSelector((state: any) => state.getStoreVideoLoc);
  const cleanText = TextSpeech.replace(/<\/?[^>]+(>|$)/g, '');
  const isIOS18 = PLATFORM_IOS && Platform.Version >= 18;

  const lang = getCurrentLanguage();

  const getUserDataDetails = useSelector(
    (state: any) => state.getUserDataDetails,
  );

  const getExerciseDescription = async () => {
    if (data?.exercise_id !== null && data?.exercise_id !== undefined) {
      const res = await axios({
        url: NewAppapi.GET_SINGLE_EXERCISE,
        method: 'GET',
        params: {
          user_id: getUserDataDetails?.id,
          version: VersionNumber.appVersion,
          exercise_id: data?.exercise_id,
          lang: lang,
        },
      });
      // SetDescription(res.data[0].exercise_instructions);
      console.log('Test Data', res.data.data);
      if (res.data.data?.length > 0) {
        SetDescription('');
        SetDescription(res.data.data[0].exercise_instructions);
        setTitle(res.data.data[0].exercise_title);
      } else {
        console.warn('No data found in response.');
      }
    }
  };

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

          if (lang == 'en') {
            await Tts.setDefaultLanguage('en-IN');
          } else {
            await Tts.setDefaultLanguage('pt-BR');
          }
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

  useEffect(() => {
    if (data?.exercise_id !== null && data?.exercise_id !== undefined) {
      getExerciseDescription();
    }
  }, [id]);
  const tag = {
    body: {
      marginTop: 0,
      marginBottom: 0,
    },
    p: {
      color: '#3A4750',
      fontSize: 14,
      lineHeight: 21,
      fontFamily: 'Poppins',
      marginTop: 0,
      marginBottom: 10,
    },
    strong: {
      color: '#E11D48',
      fontSize: 12,
    },
    li: {
      color: '#4B5563',
      fontSize: 14,
      lineHeight: 22,
      fontFamily: 'Poppins',
      fontWeight: '500',
      marginBottom: 10,
    },
    ul: {
      color: '#3A4750',
      marginTop: 0,
      marginBottom: 0,
      paddingLeft: 4,
    },
    ol: {
      color: '#3A4750',
      marginTop: 0,
      marginBottom: 0,
      paddingLeft: 4,
    },
  };
  const renderersProps = {
    ul: {
      markerBoxStyle: {paddingRight: 10},
      markerTextStyle: {color: '#E11D48', fontSize: 18, fontWeight: '700' as const},
    },
    ol: {
      markerBoxStyle: {paddingRight: 10},
      markerTextStyle: {color: '#E11D48', fontSize: 14, fontWeight: '700' as const},
    },
  };
  // Some exercises come back with a leading empty paragraph/line-break from
  // the API, which shows up as an ugly gap above the instructions list.
  const sanitizedInstructions = (data?.exercise_instructions || '')
    .replace(/^(?:\s|<p>(?:&nbsp;|\s)*<\/p>|<br\s*\/?>)+/i, '')
    .trim();
  const time = data?.exercise_rest
    ? parseInt(data.exercise_rest.split(' ')[0])
    : null;
  return (
    <Modal visible={open} onRequestClose={() => null} animationType="slide">
      <View
        style={{
          flex: 1,
          backgroundColor: '#FAFAFA',
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
            paddingHorizontal: 16,
            marginTop: PLATFORM_IOS ? DeviceHeigth * 0.06 : DeviceHeigth * 0.03,
          }}>
          <TouchableOpacity
            onPress={() => {
              setOpen(false);
              SetDescription('');
            }}
            style={styles.headerChip}>
            <Icon name="close" color="#374151" size={20} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              if (getSoundOffOn) {
                dispatch(setSoundOnOff(false));
              } else {
                dispatch(setSoundOnOff(true));
              }
            }}
            style={[
              styles.headerChip,
              getSoundOffOn && styles.headerChipActive,
            ]}>
            <Icon
              name={getSoundOffOn ? 'volume-high' : 'volume-off'}
              color={getSoundOffOn ? '#E11D48' : '#374151'}
              size={20}
            />
          </TouchableOpacity>
        </View>
        <View style={[styles.videoFrame, {aspectRatio: videoAspect}]}>
          <Video
            source={{
              uri: data?.exercise_video,
            }}
            repeat={true}
            resizeMode="cover"
            style={styles.video}
            onLoad={(e: any) => {
              const {width, height} = e?.naturalSize || {};
              if (width && height) {
                setVideoAspect(width / height);
              }
            }}
            onReadyForDisplay={() => {
              setIsLoading(false);
            }}
          />
        </View>
        <View style={styles.container}>
          <View style={styles.content}>
            <View style={styles.sheetHandle} />
            <Text style={styles.exerciseTitle}>{title}</Text>
            {(time || data?.exercise_sets) && (
              <View style={styles.metaRow}>
                {!!time && (
                  <View style={[styles.metaBadge, styles.timeBadge]}>
                    <Icon name="clock-outline" size={13} color="#7C3AED" />
                    <Text style={[styles.metaBadgeText, {color: '#7C3AED'}]}>
                      {'1 x ' +
                        (time > 60
                          ? Math.floor(time / 60) + ' min'
                          : time + ' sec')}
                    </Text>
                  </View>
                )}
                {!!data?.exercise_sets && (
                  <View style={[styles.metaBadge, styles.setBadge]}>
                    <Icon name="repeat" size={13} color="#059669" />
                    <Text style={[styles.metaBadgeText, {color: '#059669'}]}>
                      {'Set ' + data.exercise_sets}
                    </Text>
                  </View>
                )}
              </View>
            )}
            <Text style={styles.sectionHeading}>How to do it</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              <RenderHTML
                source={{html: sanitizedInstructions}}
                contentWidth={DeviceWidth}
                tagsStyles={tag}
                renderersProps={renderersProps}
              />
            </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default WorkoutsDescription;

const styles = StyleSheet.create({
  headerChip: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerChipActive: {
    backgroundColor: '#FFF1F2',
  },
  videoFrame: {
    width: DeviceWidth * 0.95,
    alignSelf: 'center',
    marginTop: 14,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#1F2937',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    marginTop: 16,
  },
  content: {
    flex: 1,
    backgroundColor: AppColor.WHITE,
    borderTopRightRadius: 24,
    borderTopLeftRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: -6},
        shadowOpacity: 0.06,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E7EB',
    alignSelf: 'center',
    marginBottom: 12,
  },
  exerciseTitle: {
    fontSize: 20,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
    color: '#111827',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 10,
    marginRight: 8,
    borderWidth: 1,
  },
  timeBadge: {
    backgroundColor: '#F5F3FF',
    borderColor: '#DDD6FE',
  },
  setBadge: {
    backgroundColor: '#D1FAE5',
    borderColor: '#A7F3D0',
  },
  metaBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
    marginLeft: 4,
  },
  sectionHeading: {
    fontSize: 15,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 18,
    marginBottom: 10,
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
