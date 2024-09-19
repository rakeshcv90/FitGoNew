import {
  FlatList,
  Image,
  Linking,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {AppColor, Fonts, PLATFORM_IOS} from '../../Component/Color';
import DietPlanHeader from '../../Component/Headers/DietPlanHeader';
import {QuestionsArray, QuestionsArrayType} from './QuestionsArray';
import {useSelector} from 'react-redux';
import FastImage from 'react-native-fast-image';
import FitText from '../../Component/Utilities/FitText';
import {localImage} from '../../Component/Image';
import moment from 'moment';
import {AnalyticsConsole} from '../../Component/AnalyticsConsole';
import AnimatedLottieView from 'lottie-react-native';
import {DeviceHeigth} from '../../Component/Config';
import NewHeader1 from '../../Component/Headers/NewHeader1';
import Wrapper from '../WorkoutCompleteScreen/Wrapper';

type TYPE = 'USER' | 'ADMIN';

const ChatBot = ({navigation, route}: any) => {
  const {quesNo, screenName} = route.params;
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
  let nav: any;

  useEffect(() => {
    const question = QuestionsArray.filter(item => item.id == quesNo);
    setCurrentQData(question);
    setshowLoader(true);
    setAnswerTrue(false);
    const button = setTimeout(() => {
      setShowChatBot2(true);
      setshowButtons(true);
    }, 6000);
    return () => {
      clearTimeout(button);
    };
  }, []);
  useEffect(() => {
    const load = setTimeout(() => {
      setshowLoader(false);
      setShowChatBot(true);
    }, 3000);
    return () => {
      clearTimeout(load);
      clearTimeout(nav);
    };
  }, [showChatBot, showChatBot2]);

  const handleEmail = async () => {
    AnalyticsConsole('FAQ_GMAIL');
    const supported = await Linking.canOpenURL('googlegmail://');

    if (supported) Linking.openURL('googlegmail://');
    else if (PLATFORM_IOS) Linking.openURL('mailto:');
    else Linking.openURL('https://mail.google.com');
  };
  const UserBox = () => {
    const Name = getUserDataDetails?.name.substring(0, 1);
    const data: QuestionsArrayType = currentQData[0];

    return (
      <View style={{marginVertical: 5}}>
        <View
          style={{
            flexDirection: 'row-reverse',
            alignItems: 'flex-end',
          }}>
          <View style={{marginLeft: 10}}>
            {getUserDataDetails?.image_path == null ? (
              <View style={styles.imgContainer}>
                <View style={styles.textInitialContainer}>
                  <FitText
                    type="normal"
                    value={Name}
                    color="#1E40AF"
                    textTransform="uppercase"
                    fontWeight="700"
                  />
                </View>
              </View>
            ) : (
              <View style={styles.imgContainer}>
                <FastImage
                  style={styles.mainImage}
                  source={{
                    uri: getUserDataDetails?.image_path,
                    headers: {Authorization: 'someAuthToken'},
                    priority: FastImage.priority.high,
                  }}
                  resizeMode={FastImage.resizeMode.cover}
                  defaultSource={localImage.NOWORKOUT}
                />
              </View>
            )}
          </View>
          <View
            style={[
              styles.userBox,
              {width: DeviceHeigth >= 1024 ? '50%' : '70%'},
            ]}>
            <FitText
              type="normal"
              fontWeight="600"
              fontFamily={Fonts.MONTSERRAT_MEDIUM}
              value={'You' + '\n'}
              color={AppColor.WHITE}
            />
            <FitText
              type="normal"
              fontWeight="600"
              fontFamily={Fonts.MONTSERRAT_MEDIUM}
              value={data.question}
              color={AppColor.WHITE}
            />
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row-reverse',
            alignItems: 'flex-end',
            right: 40,
          }}>
          <FitText
            type="normal"
            value={moment().format('h:mm A')}
            color="#7F7F7F"
            lineHeight={30}
          />
        </View>
      </View>
    );
  };
  const ChatBox = ({answer, conditionAnswer}: any) => {
    const data: QuestionsArrayType = currentQData[0];
    return (
      <View style={{marginVertical: 5}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
          }}>
          <View style={styles.chatImage}>
            <Image
              resizeMode="contain"
              source={localImage.ChatBotImage}
              style={{
                borderRadius: 15,
                height: 15,
                width: 15,
              }}
            />
          </View>
          <View
            style={[
              styles.chatBox,
              {width: DeviceHeigth >= 1024 ? '50%' : '70%'},
            ]}>
            <FitText
              type="normal"
              fontWeight="600"
              fontFamily={Fonts.MONTSERRAT_MEDIUM}
              color={AppColor.HEADERTEXTCOLOR}
              value={
                answer
                  ? data.answer
                  : answerTrue && conditionAnswer == 'T'
                  ? 'Thank you for your feedback!'
                  : answerFalse && conditionAnswer == 'F'
                  ? 'Contact us at '
                  : 'Are you satisfied with this response?'
              }>
              {answerFalse && conditionAnswer == 'F' && (
                <FitText
                  type="normal"
                  fontWeight="600"
                  fontFamily={Fonts.MONTSERRAT_MEDIUM}
                  color="blue"
                  value="thefitnessandworkout@gmail.com >"
                  onPress={handleEmail}
                />
              )}
            </FitText>
            {showButtons && !answer && (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  alignSelf: 'center',
                  width: '50%',
                  marginTop: 10,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    setshowButtons(false);
                    setAnswerTrue(true);
                  }}>
                  <FitText
                    type="normal"
                    fontWeight="600"
                    fontFamily={Fonts.MONTSERRAT_MEDIUM}
                    color={AppColor.RED}
                    value="< Yes"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setshowButtons(false);
                    setAnswerFalse(true);
                  }}>
                  <FitText
                    type="normal"
                    fontWeight="600"
                    fontFamily={Fonts.MONTSERRAT_MEDIUM}
                    color={AppColor.RED}
                    value="No >"
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            left: 40,
          }}>
          <FitText
            type="normal"
            value={moment().format('h:mm A')}
            color="#7F7F7F"
            lineHeight={30}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: AppColor.WHITE}}>
      <StatusBar backgroundColor="white" barStyle={'dark-content'} />
      <Wrapper>
        <NewHeader1 header="Frequently Asked Questions" backButton />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flex: 1,
            justifyContent: 'flex-end',
          }}>
          <View
            style={{
              flex: 1,
              width: '95%',
              alignSelf: 'center',
              justifyContent: 'flex-end',
              marginBottom: 20,
            }}>
            {currentQData.length != 0 && (
              <>
                <UserBox />
                {showLoader && (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'flex-end',
                    }}>
                    <View style={styles.chatImage}>
                      <Image
                        resizeMode="contain"
                        source={localImage.ChatBotImage}
                        style={{
                          borderRadius: 15,
                          height: 15,
                          width: 15,
                        }}
                      />
                    </View>
                    <View style={styles.loaderBox}>
                      <AnimatedLottieView
                        source={{
                          uri: 'https://lottie.host/a48740c2-459a-4b47-9106-7c9020469ac9/1PPt5ehAsa.json',
                        }} // Replace with your animation file
                        autoPlay
                        loop
                        style={{
                          width: 45,
                          height: 45,
                        }}
                      />
                    </View>
                  </View>
                )}
                {showChatBot && (!answerFalse || !answerTrue) && (
                  <ChatBox answer={true} conditionAnswer={false} />
                )}
                {showChatBot2 && (!answerFalse || !answerTrue) && (
                  <ChatBox answer={false} conditionAnswer={false} />
                )}
                {answerFalse && (
                  <ChatBox answer={false} conditionAnswer={'F'} />
                )}
                {answerTrue && <ChatBox answer={false} conditionAnswer={'T'} />}
              </>
            )}
          </View>
        </ScrollView>
      </Wrapper>
    </View>
  );
};

export default ChatBot;

const styles = StyleSheet.create({
  imgContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  mainImage: {
    borderWidth: 0.5,
    borderColor: '#3333334D',
    borderRadius: 25,
    height: 25,
    width: 25,
    marginRight: 10,
  },
  chatImage: {
    backgroundColor: '#5C4DFF',
    borderRadius: 25,
    height: 25,
    width: 25,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInitialContainer: {
    height: 25,
    width: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DBEAFE',
    borderRadius: 25,
  },
  userBox: {
    backgroundColor: AppColor.RED,
    borderRadius: 10,
    borderBottomRightRadius: 0,
    padding: 10,
  },
  chatBox: {
    backgroundColor: '#F7F7F7',
    borderRadius: 10,
    borderBottomLeftRadius: 0,
    padding: 10,
  },
  loaderBox: {
    width: '20%',
    backgroundColor: '#F7F7F7',
    borderRadius: 10,
    borderBottomLeftRadius: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
