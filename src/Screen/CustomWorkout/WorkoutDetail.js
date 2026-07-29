import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  StatusBar,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import {useIsFocused} from '@react-navigation/native';
import {AppColor, Fonts, PLATFORM_IOS} from '../../Component/Color';
import RenderHTML from 'react-native-render-html';
import Tts from 'react-native-tts';
import {useSelector, useDispatch} from 'react-redux';
import AnimatedLottieView from 'lottie-react-native';
import {setSoundOnOff} from '../../Component/ThemeRedux/Actions';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {translate, getCurrentLanguage} from '../Translation/TranslationService';

const WorkoutDetail = ({navigation, route}) => {
  const data = route?.params?.item;
  const insets = useSafeAreaInsets();
  const [ttsInitialized, setTtsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [videoAspect, setVideoAspect] = useState(16 / 9);
  const getSoundOffOn = useSelector(state => state.getSoundOffOn);
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const lang = getCurrentLanguage();

  const instructionsRaw =
    data?.workout_description || data?.exercise_instructions || '';
  const cleanText = instructionsRaw.replace(/<\/?[^>]+(>|$)/g, '');
  const sanitizedInstructions = instructionsRaw
    .replace(/^(?:\s|<p>(?:&nbsp;|\s)*<\/p>|<br\s*\/?>)+/i, '')
    .trim();

  const restVal = data?.exercise_rest || data?.rest_time;
  const time = restVal ? parseInt(String(restVal).split(' ')[0], 10) : null;
  const sets = data?.exercise_sets || data?.sets;

  useEffect(() => {
    const initTts = async () => {
      const ttsStatus = await Tts.getInitStatus();

      if (!ttsStatus.isInitialized) {
        try {
          if (lang === 'pt') {
            await Tts.setDefaultLanguage('pt-BR');
          } else {
            await Tts.setDefaultLanguage('en-IN');
          }
          await Tts.setDucking(true);
          await Tts.setIgnoreSilentSwitch('ignore');
          setTtsInitialized(true);
        } catch (error) {
          console.log('VoicessError', error);
        }
      }
      Tts.addEventListener('tts-progress', () => {});
    };

    initTts();
  }, [lang]);

  useEffect(() => {
    if (isFocused && getSoundOffOn) {
      Tts.speak(cleanText);
    } else {
      Tts.stop();
    }
  }, [isFocused, getSoundOffOn, cleanText]);

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
      markerTextStyle: {color: '#E11D48', fontSize: 18, fontWeight: '700'},
    },
    ol: {
      markerBoxStyle: {paddingRight: 10},
      markerTextStyle: {color: '#E11D48', fontSize: 14, fontWeight: '700'},
    },
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />

      {/* ── Top Header Bar ── */}
      <View
        style={[
          styles.headerRow,
          // {paddingTop: Math.max(insets.top, PLATFORM_IOS ? 12 : 16)},
        ]}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}
          style={styles.headerChip}>
          <Icon name="chevron-left" color="#374151" size={24} />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => dispatch(setSoundOnOff(!getSoundOffOn))}
          style={[styles.headerChip, getSoundOffOn && styles.headerChipActive]}>
          <Icon
            name={getSoundOffOn ? 'volume-high' : 'volume-off'}
            color={getSoundOffOn ? '#E11D48' : '#374151'}
            size={20}
          />
        </TouchableOpacity>
      </View>

      {/* ── Video Frame Card ── */}
      <View style={[styles.videoFrame, {aspectRatio: videoAspect}]}>
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

        <Video
          source={{
            uri: data?.exercise_video,
          }}
          repeat={true}
          resizeMode="cover"
          style={styles.video}
          onLoad={e => {
            const {width, height} = e?.naturalSize || {};
            if (width && height) {
              setVideoAspect(width / height);
            }
          }}
          onReadyForDisplay={() => setIsLoading(false)}
        />
      </View>

      {/* ── Bottom Content Sheet ── */}
      <View style={styles.sheetContainer}>
        <View style={styles.content}>
          <View style={styles.sheetHandle} />

          {/* Title */}
          <Text style={styles.exerciseTitle}>
            {data?.workout_title || data?.exercise_title || '--'}
          </Text>

          {/* Meta Badges (Rest Time / Sets) */}
          {(time || sets) && (
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
              {!!sets && (
                <View style={[styles.metaBadge, styles.setBadge]}>
                  <Icon name="repeat" size={13} color="#059669" />
                  <Text style={[styles.metaBadgeText, {color: '#059669'}]}>
                    {'Set ' + sets}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Instructions Heading & Scroll View */}
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
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },

  // ── Header Row ─────────────────────────────────────────
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  headerChip: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerChipActive: {
    backgroundColor: '#FFF1F2',
  },

  // ── Video Frame ────────────────────────────────────────
  videoFrame: {
    width: DeviceWidth * 0.95,
    alignSelf: 'center',
    marginTop: 10,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#1F2937',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  loader: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },

  // ── Content Sheet ──────────────────────────────────────
  sheetContainer: {
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
});

export default WorkoutDetail;
