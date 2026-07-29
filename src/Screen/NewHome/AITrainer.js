import {
  View,
  Text,
  Image,
  Platform,
  KeyboardAvoidingView,
  FlatList,
  ScrollView,
  BackHandler,
  StyleSheet,
  StatusBar,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import Animated, {
  Easing,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {AppColor, Fonts} from '../../Component/Color';
import {localImage} from '../../Component/Image';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../Component/Config';
import {showMessage} from 'react-native-flash-message';
import AnimatedLottieView from 'lottie-react-native';
import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import {
  SetAIMessageHistory,
  setRewardedCount,
  setSoundOnOff,
} from '../../Component/ThemeRedux/Actions';
import Tts from 'react-native-tts';
import {useIsFocused} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Wrapper from '../WorkoutCompleteScreen/Wrapper';
import NewHeader1 from '../../Component/Headers/NewHeader1';
import {ReviewApp} from '../../Component/ReviewApp';
import {translate, getCurrentLanguage} from '../Translation/TranslationService';
import FitIcon from '../../Component/Utilities/FitIcon';

const systemMessage = {
  role: 'system',
  content: `You are a Gym Trainer and fitness expert. Give helpful responses related to Gym training, Workouts, Exercises, and Nutrition/Diet.`,
};

const SUGGESTED_PROMPTS = [
  {icon: 'fire', text: 'Best Fat Loss Workout?'},
  {icon: 'silverware-fork-knife', text: 'High Protein Diet Plan'},
  {icon: 'dumbbell', text: 'Build Muscle at Home'},
  {icon: 'water-outline', text: 'Daily Water Intake'},
];

const AITrainer = ({navigation}) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const [ttsSound, setTtsSound] = useState(translate('initialGreeting'));
  const [searchText, setSearchText] = useState('');
  const flatListRef = useRef(null);
  const [reward, setreward] = useState(0);

  const getAIMessageHistory = useSelector(state => state.getAIMessageHistory);
  const getUserDataDetails = useSelector(state => state.getUserDataDetails);
  const getRerwardCount = useSelector(state => state.getRerwardCount);
  const getSoundOffOn = useSelector(state => state.getSoundOffOn);

  const [senderMessage, setsenderMessage] = useState([
    {
      message: translate('initialGreeting'),
      sender: 'ChatGpt',
    },
  ]);
  const [ttsStatus, setTtsStatus] = useState('initiliazing');
  const [speechRate] = useState(0.5);
  const [speechPitch] = useState(1);
  const lang = getCurrentLanguage();

  useEffect(() => {
    Tts.addEventListener('tts-start', _event => setTtsStatus('started'));
    Tts.addEventListener('tts-finish', _event => setTtsStatus('finished'));
    Tts.addEventListener('tts-cancel', _event => setTtsStatus('cancelled'));
    Tts.setDefaultRate(speechRate);
    Tts.setDefaultPitch(speechPitch);
    Tts.getInitStatus().then(initTts);
  }, [getSoundOffOn]);

  const initTts = async () => {
    if (lang == 'en') {
      await Tts.setDefaultLanguage('en-IN');
    } else {
      await Tts.setDefaultLanguage('pt-BR');
    }

    readText();
    setTtsStatus('initialized');
  };

  const readText = async () => {
    if (getSoundOffOn) {
      Tts.speak(ttsSound);
    } else {
      Tts.stop();
    }
  };

  useEffect(() => {
    flatListRef.current?.scrollToEnd({animated: true});
  }, [senderMessage]);

  const sendMessage = async (promptText) => {
    const textToSend = promptText || searchText;
    if (textToSend.trim().length <= 0) {
      showMessage({
        message: translate('errorEmptyInput'),
        type: 'danger',
        animationDuration: 500,
        floating: true,
        icon: {icon: 'auto', position: 'left'},
      });
      return false;
    } else {
      dispatch(setRewardedCount(getRerwardCount + 1));
      handleSend(textToSend);
      setSearchText('');
    }
  };

  const temp = () => {};

  const handleSend = async (data) => {
    const newMessage = {
      message: data,
      sender: 'user',
    };
    const newMessages = [...senderMessage, newMessage];
    processMessageToChatGPT(newMessages);
  };

  const processMessageToChatGPT = async (chatMessages) => {
    let apiMessages = chatMessages.map(messageObject => {
      let role = '';
      if (messageObject.sender == 'ChatGPT') {
        role = 'system';
      } else {
        role = 'user';
      }
      return {role: role, content: messageObject.message};
    });

    setsenderMessage([
      ...chatMessages,
      {
        message: 'test',
        sender: 'ChatGpt',
      },
    ]);

    const options = {
      method: 'POST',
      url: 'https://open-ai21.p.rapidapi.com/conversationgpt35',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': 'ca80f283d4mshb1109d8a103cef0p1a05eajsn402ad423ce02',
        'X-RapidAPI-Host': 'open-ai21.p.rapidapi.com',
      },
      data: {
        messages: [systemMessage, ...apiMessages],
        web_access: false,
        system_prompt: '',
        temperature: 0.9,
        top_k: 5,
        top_p: 0.9,
        max_tokens: 256,
      },
    };

    try {
      const response = await axios.request(options);

      setsenderMessage([
        ...chatMessages,
        {
          message: response.data.result,
          sender: 'ChatGpt',
        },
      ]);
      dispatch(
        SetAIMessageHistory([
          ...getAIMessageHistory,
          ...chatMessages,
          {
            message: response.data.result,
            sender: 'ChatGpt',
          },
        ]),
      );
      setSearchText('');
      setreward(0);
      ReviewApp(temp);
    } catch (error) {
      console.error(error);
    }
  };

  const handleBackPress = useCallback(() => {
    Tts.stop();
    return false;
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress,
    );
    return () => backHandler.remove();
  }, [handleBackPress]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'#FFFFFF'} />
      <Wrapper styles={{backgroundColor: '#FFFFFF'}}>
        <NewHeader1
          header={translate('aiTrainerTitle') || 'FITME AI TRAINER'}
          onBackPress={() => {
            Tts.stop();
            navigation.goBack();
          }}
          backButton
          icon={getAIMessageHistory?.length > 0}
          iconSource={localImage.ChatHistory}
          onIconPress={() => navigation.navigate('AIMessageHistory')}
        />

        {/* Online Subheader Tag */}
        <View style={styles.onlineBadgeRow}>
          <View style={styles.onlineDot} />
          <Text style={styles.onlineText}>AI TRAINER ONLINE</Text>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS == 'ios' ? 'padding' : undefined}
          style={styles.keyboardContainer}>
          <ScrollView
            style={styles.scrollArea}
            ref={flatListRef}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({animated: true})
            }
            onLayout={() => flatListRef.current?.scrollToEnd({animated: true})}
            keyboardDismissMode="interactive"
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator={false}>
            
            <FlatList
              data={senderMessage}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item, index}) => {
                if (item.sender == 'ChatGpt' && item?.message != 'test') {
                  setTtsSound(item.message);
                }
                const isAi = item.sender === 'ChatGpt';
                const isThinking = item.message === 'test';

                return (
                  <Animated.View
                    entering={FadeInUp.duration(400).springify()}
                    style={[
                      styles.messageRow,
                      isAi ? styles.messageRowAi : styles.messageRowUser,
                    ]}>
                    {isAi ? (
                      isThinking ? (
                        <View style={styles.thinkingWrap}>
                          <Image
                            style={styles.avatarImg}
                            resizeMode="contain"
                            source={require('../../Icon/Images/NewImage2/mary.png')}
                          />
                          <View style={styles.thinkingBubble}>
                            <AnimatedLottieView
                              source={{
                                uri: 'https://lottie.host/a48740c2-459a-4b47-9106-7c9020469ac9/1PPt5ehAsa.json',
                              }}
                              autoPlay
                              loop
                              style={styles.lottieLoader}
                            />
                            <Text style={styles.thinkingText}>Thinking...</Text>
                          </View>
                        </View>
                      ) : (
                        <View style={styles.aiBubbleWrap}>
                          <Image
                            resizeMode="contain"
                            source={require('../../Icon/Images/NewImage2/mary.png')}
                            style={styles.avatarImg}
                          />
                          <View style={styles.aiBubble}>
                            <Text style={styles.aiText}>{item.message}</Text>
                            <TouchableOpacity
                              activeOpacity={0.8}
                              onPress={() => {
                                dispatch(setSoundOnOff(!getSoundOffOn));
                                setTtsSound(item.message);
                              }}
                              style={styles.audioBtn}>
                              <FitIcon
                                name={getSoundOffOn ? 'volume-high' : 'volume-off'}
                                size={18}
                                type="MaterialCommunityIcons"
                                color="#FF2A54"
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                      )
                    ) : (
                      <View style={styles.userBubbleWrap}>
                        <LinearGradient
                          colors={['#FF2A54', '#E11D48']}
                          start={{x: 0, y: 0}}
                          end={{x: 1, y: 1}}
                          style={styles.userBubble}>
                          <Text style={styles.userText}>{item.message}</Text>
                        </LinearGradient>
                        <Image
                          resizeMode="cover"
                          source={
                            getUserDataDetails?.image_path == null
                              ? localImage.User
                              : {uri: getUserDataDetails?.image_path}
                          }
                          style={styles.userAvatar}
                        />
                      </View>
                    )}
                  </Animated.View>
                );
              }}
            />

            {/* Quick Suggestion Chips */}
            {senderMessage.length <= 2 && (
              <View style={styles.promptsContainer}>
                <Text style={styles.promptsTitle}>Suggested Prompts</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.promptsScroll}>
                  {SUGGESTED_PROMPTS.map((prompt, pIdx) => (
                    <TouchableOpacity
                      key={pIdx}
                      activeOpacity={0.8}
                      onPress={() => sendMessage(prompt.text)}
                      style={styles.promptChip}>
                      <FitIcon
                        name={prompt.icon}
                        size={14}
                        type="MaterialCommunityIcons"
                        color="#FF2A54"
                      />
                      <Text style={styles.promptText}>{prompt.text}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </ScrollView>

          {/* Floating Modern Input Bar */}
          <View style={styles.inputContainer}>
            <TextInput
              placeholder={translate('inputPlaceholder') || 'Ask your fitness question...'}
              placeholderTextColor={'#94A3B8'}
              value={searchText}
              onChangeText={text => setSearchText(text)}
              style={styles.inputText}
              onSubmitEditing={() => sendMessage()}
            />
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => sendMessage()}
              style={styles.sendButtonWrap}>
              <LinearGradient
                colors={['#FF2A54', '#E11D48']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                style={styles.sendGradient}>
                <FitIcon
                  name="send"
                  size={16}
                  type="MaterialCommunityIcons"
                  color="#FFFFFF"
                />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Wrapper>
    </View>
  );
};

export default AITrainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  onlineBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    backgroundColor: '#FFF1F4',
    marginHorizontal: 20,
    borderRadius: 20,
    marginTop: 6,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  onlineText: {
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontSize: 10,
    color: '#FF2A54',
    letterSpacing: 1,
    fontWeight: '700',
  },
  keyboardContainer: {
    flex: 1,
    marginTop: 10,
  },
  scrollArea: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messageRow: {
    marginVertical: 6,
    flexDirection: 'row',
  },
  messageRowAi: {
    justifyContent: 'flex-start',
  },
  messageRowUser: {
    justifyContent: 'flex-end',
  },
  avatarImg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
    alignSelf: 'flex-end',
  },
  aiBubbleWrap: {
    flexDirection: 'row',
    maxWidth: '82%',
  },
  aiBubble: {
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    borderTopLeftRadius: 4,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.04,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  aiText: {
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    fontSize: 14,
    lineHeight: 21,
    color: '#0F172A',
    fontWeight: '500',
  },
  audioBtn: {
    alignSelf: 'flex-end',
    marginTop: 8,
    backgroundColor: '#FFF1F4',
    padding: 6,
    borderRadius: 12,
  },
  thinkingWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  thinkingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  lottieLoader: {
    width: 32,
    height: 32,
  },
  thinkingText: {
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    fontSize: 13,
    color: '#64748B',
    marginLeft: 6,
  },
  userBubbleWrap: {
    flexDirection: 'row',
    maxWidth: '82%',
    alignItems: 'flex-end',
  },
  userBubble: {
    borderRadius: 20,
    borderBottomRightRadius: 4,
    padding: 14,
    ...Platform.select({
      ios: {
        shadowColor: '#FF2A54',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  userText: {
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    fontSize: 14,
    lineHeight: 21,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginLeft: 8,
  },
  promptsContainer: {
    marginTop: 18,
    marginBottom: 10,
  },
  promptsTitle: {
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontSize: 12,
    color: '#94A3B8',
    letterSpacing: 0.8,
    marginBottom: 10,
    marginLeft: 4,
  },
  promptsScroll: {
    paddingRight: 16,
  },
  promptChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1F4',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFE4E8',
    marginRight: 10,
  },
  promptText: {
    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
    fontSize: 12,
    color: '#0F172A',
    fontWeight: '600',
    marginLeft: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: Platform.OS === 'ios' ? 24 : 12,
    marginTop: 8,
    paddingHorizontal: 16,
    height: 54,
    borderRadius: 27,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: {width: 0, height: 6},
        shadowOpacity: 0.06,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  inputText: {
    flex: 1,
    fontSize: 14,
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    color: '#0F172A',
    paddingRight: 10,
  },
  sendButtonWrap: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  sendGradient: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
