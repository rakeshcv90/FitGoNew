import {
  Image,
  Linking,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import AnimatedReanimated, {
  FadeInUp,
  FadeInDown,
  Layout,
} from 'react-native-reanimated';
import {AppColor, Fonts, PLATFORM_IOS} from '../../Component/Color';
import {QuestionsArray, QuestionsArrayType} from './QuestionsArray';
import {useSelector} from 'react-redux';
import FitText from '../../Component/Utilities/FitText';
import {localImage} from '../../Component/Image';
import moment from 'moment';
import {AnalyticsConsole} from '../../Component/AnalyticsConsole';
import AnimatedLottieView from 'lottie-react-native';
import {DeviceHeigth} from '../../Component/Config';
import Wrapper from '../WorkoutCompleteScreen/Wrapper';
import {translate} from '../Translation/TranslationService';
import LinearGradient from 'react-native-linear-gradient';
import {ArrowLeft} from '../../Component/Utilities/Arrows/Arrow';
import FitIcon from '../../Component/Utilities/FitIcon';

const ChatBot = ({navigation, route}: any) => {
  const {quesNo, screenName} = route.params || {};
  const getUserDataDetails = useSelector(
    (state: any) => state.getUserDataDetails,
  );
  const [currentQData, setCurrentQData] = useState<Array<QuestionsArrayType>>(
    [],
  );
  const [showChatBot, setShowChatBot] = useState(false);
  const [showChatBot2, setShowChatBot2] = useState(false);
  const [answerFalse, setAnswerFalse] = useState(false);
  const [answerTrue, setAnswerTrue] = useState(false);
  const [showLoader, setshowLoader] = useState(false);
  const [showButtons, setshowButtons] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    const question = QuestionsArray.filter(item => item.id == quesNo);
    setCurrentQData(question.length > 0 ? question : [QuestionsArray[0]]);
    setshowLoader(true);
    setAnswerTrue(false);

    const loadTimer = setTimeout(() => {
      setshowLoader(false);
      setShowChatBot(true);
    }, 1200);

    const buttonTimer = setTimeout(() => {
      setShowChatBot2(true);
      setshowButtons(true);
    }, 2400);

    return () => {
      clearTimeout(loadTimer);
      clearTimeout(buttonTimer);
    };
  }, [quesNo]);

  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({animated: true});
    }, 300);
  }, [showChatBot, showChatBot2, answerFalse, answerTrue, showLoader]);

  const handleEmail = async () => {
    AnalyticsConsole('FAQ_GMAIL');
    const supported = await Linking.canOpenURL('googlegmail://');

    if (supported) Linking.openURL('googlegmail://');
    else if (PLATFORM_IOS) Linking.openURL('mailto:thefitnessandworkout@gmail.com');
    else Linking.openURL('https://mail.google.com');
  };

  const UserBox = () => {
    const nameInitial = getUserDataDetails?.name?.substring(0, 1) || 'U';
    const data: QuestionsArrayType = currentQData[0];

    return (
      <AnimatedReanimated.View
        entering={FadeInUp.duration(350).springify()}
        style={styles.msgWrapperRight}>
        <View style={styles.msgContainerRight}>
          <View style={styles.msgHeaderRowRight}>
            <Text style={styles.userNameText}>You</Text>
            <Text style={styles.timeTextRight}>{moment().format('h:mm A')}</Text>
          </View>

          <LinearGradient
            colors={['#667EEA', '#764BA2']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.userBubble}>
            <Text style={styles.userMsgText}>{data?.question}</Text>
          </LinearGradient>
        </View>

        {/* User Avatar */}
        <View style={styles.userAvatarContainer}>
          {getUserDataDetails?.image_path ? (
            <Image
              style={styles.avatarImg}
              source={{uri: getUserDataDetails.image_path}}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.avatarInitialBox}>
              <Text style={styles.avatarInitialText}>{nameInitial}</Text>
            </View>
          )}
        </View>
      </AnimatedReanimated.View>
    );
  };

  const ChatBox = ({answer, conditionAnswer}: any) => {
    const data: QuestionsArrayType = currentQData[0];
    const isFeedbackPrompt = !answer && conditionAnswer === false;
    const isFeedbackTrue = conditionAnswer === 'T';
    const isFeedbackFalse = conditionAnswer === 'F';

    return (
      <AnimatedReanimated.View
        entering={FadeInUp.duration(350).springify()}
        layout={Layout.springify()}
        style={styles.msgWrapperLeft}>
        {/* Bot Avatar */}
        <LinearGradient
          colors={['#667EEA', '#764BA2']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.botAvatarContainer}>
          <FitIcon
            name="robot"
            type="MaterialCommunityIcons"
            size={14}
            color="#FFFFFF"
          />
        </LinearGradient>

        <View style={styles.msgContainerLeft}>
          <View style={styles.msgHeaderRowLeft}>
            <Text style={styles.botNameText}>FitMe AI Assistant</Text>
            <Text style={styles.timeTextLeft}>{moment().format('h:mm A')}</Text>
          </View>

          <View style={styles.botBubble}>
            <Text style={styles.botMsgText}>
              {answer
                ? data?.answer
                : isFeedbackTrue
                ? translate('thankYouFeedback')
                : isFeedbackFalse
                ? translate('contactUsAt')
                : translate('areYouSatisfied')}
            </Text>

            {/* Email Contact Box if feedback is No */}
            {isFeedbackFalse && (
              <TouchableOpacity
                activeOpacity={0.88}
                onPress={handleEmail}
                style={styles.emailCardBtn}>
                <FitIcon
                  name="mail"
                  type="Ionicons"
                  size={16}
                  color="#2563EB"
                />
                <Text style={styles.emailCardText}>
                  thefitnessandworkout@gmail.com
                </Text>
                <FitIcon
                  name="arrow-forward"
                  type="Ionicons"
                  size={14}
                  color="#2563EB"
                />
              </TouchableOpacity>
            )}

            {/* Feedback Options (Yes / No Pills) */}
            {showButtons && isFeedbackPrompt && (
              <View style={styles.feedbackRow}>
                <TouchableOpacity
                  activeOpacity={0.88}
                  onPress={() => {
                    setshowButtons(false);
                    setAnswerTrue(true);
                  }}
                  style={styles.feedbackYesBtn}>
                  <FitIcon
                    name="checkmark-circle"
                    type="Ionicons"
                    size={16}
                    color="#10B981"
                  />
                  <Text style={styles.feedbackYesText}>Yes, Helpful</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.88}
                  onPress={() => {
                    setshowButtons(false);
                    setAnswerFalse(true);
                  }}
                  style={styles.feedbackNoBtn}>
                  <FitIcon
                    name="close-circle"
                    type="Ionicons"
                    size={16}
                    color="#EF4444"
                  />
                  <Text style={styles.feedbackNoText}>Need Support</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </AnimatedReanimated.View>
    );
  };

  return (
    <Wrapper styles={{backgroundColor: '#F8FAFC'}}>
      <StatusBar backgroundColor="#F8FAFC" barStyle="dark-content" />

      {/* Top Header */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.backCircleBtn}
          onPress={() => navigation.goBack()}>
          <ArrowLeft width={20} height={10} fillColor="#0F172A" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>AI Fitness Assistant</Text>
          <View style={styles.onlineBadgeRow}>
            <View style={styles.greenDot} />
            <Text style={styles.onlineText}>Always Active</Text>
          </View>
        </View>

        <View style={{width: 36}} />
      </View>

      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {currentQData.length > 0 && (
          <View style={styles.chatSection}>
            <UserBox />

            {/* Typing Loader */}
            {showLoader && (
              <AnimatedReanimated.View
                entering={FadeInUp.duration(300)}
                style={styles.msgWrapperLeft}>
                <LinearGradient
                  colors={['#667EEA', '#764BA2']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}
                  style={styles.botAvatarContainer}>
                  <FitIcon
                    name="robot"
                    type="MaterialCommunityIcons"
                    size={14}
                    color="#FFFFFF"
                  />
                </LinearGradient>
                <View style={styles.loaderBubble}>
                  <Text style={styles.typingText}>FitMe AI is typing...</Text>
                  <AnimatedLottieView
                    source={{
                      uri: 'https://lottie.host/a48740c2-459a-4b47-9106-7c9020469ac9/1PPt5ehAsa.json',
                    }}
                    autoPlay
                    loop
                    style={{width: 36, height: 36}}
                  />
                </View>
              </AnimatedReanimated.View>
            )}

            {/* Answer Message */}
            {showChatBot && (!answerFalse || !answerTrue) && (
              <ChatBox answer={true} conditionAnswer={false} />
            )}

            {/* Satisfaction Query */}
            {showChatBot2 && (!answerFalse || !answerTrue) && (
              <ChatBox answer={false} conditionAnswer={false} />
            )}

            {/* Feedback Response */}
            {answerFalse && <ChatBox answer={false} conditionAnswer={'F'} />}
            {answerTrue && <ChatBox answer={false} conditionAnswer={'T'} />}
          </View>
        )}
      </ScrollView>
    </Wrapper>
  );
};

export default ChatBot;

const styles = StyleSheet.create({
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 10,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
  },
  backCircleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16.5,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '800',
    color: '#0F172A',
  },
  onlineBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    gap: 5,
  },
  greenDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#10B981',
  },
  onlineText: {
    fontSize: 11,
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    color: '#10B981',
    fontWeight: '600',
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 30,
  },
  chatSection: {
    gap: 16,
  },

  // User Message Right
  msgWrapperRight: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginBottom: 6,
  },
  msgContainerRight: {
    alignItems: 'flex-end',
    maxWidth: '82%',
    marginRight: 10,
  },
  msgHeaderRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 6,
  },
  userNameText: {
    fontSize: 11.5,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    color: '#64748B',
  },
  timeTextRight: {
    fontSize: 10.5,
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    color: '#94A3B8',
  },
  userBubble: {
    borderRadius: 20,
    borderBottomRightRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#667EEA',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  userMsgText: {
    fontSize: 13.5,
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    color: '#FFFFFF',
    lineHeight: 19,
  },
  userAvatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
  },
  avatarImg: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  avatarInitialBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  avatarInitialText: {
    fontSize: 13,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    color: '#4338CA',
  },

  // Bot Message Left
  msgWrapperLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  botAvatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginTop: 20,
    shadowColor: '#667EEA',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  msgContainerLeft: {
    maxWidth: '88%',
    flex: 1,
  },
  msgHeaderRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 6,
  },
  botNameText: {
    fontSize: 11.5,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    color: '#667EEA',
  },
  timeTextLeft: {
    fontSize: 10.5,
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    color: '#94A3B8',
  },
  botBubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  botMsgText: {
    fontSize: 13.5,
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    color: '#0F172A',
    lineHeight: 20,
  },

  loaderBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    gap: 8,
    marginTop: 18,
  },
  typingText: {
    fontSize: 12,
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    color: '#64748B',
  },

  // Feedback Buttons
  feedbackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  feedbackYesBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ECFDF5',
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 5,
  },
  feedbackYesText: {
    fontSize: 11.5,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    color: '#047857',
    fontWeight: '700',
  },
  feedbackNoBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1.5,
    borderColor: '#FECACA',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 5,
  },
  feedbackNoText: {
    fontSize: 11.5,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    color: '#B91C1C',
    fontWeight: '700',
  },

  emailCardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 12,
    gap: 8,
  },
  emailCardText: {
    fontSize: 12,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    color: '#1D4ED8',
    flex: 1,
  },
});
