import {
  View,
  Text,
  Image,
  Platform,
  KeyboardAvoidingView,
  FlatList,
  ScrollView,
  BackHandler,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {StyleSheet} from 'react-native';
import {AppColor} from '../../Component/Color';
import {StatusBar} from 'react-native';
import NewHeader from '../../Component/Headers/NewHeader';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {localImage} from '../../Component/Image';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import {TextInput} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import AnimatedLottieView from 'lottie-react-native';
import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import {
  SetAIMessageHistory,
  setRewardedCount,
  setSoundOnOff,
} from '../../Component/ThemeRedux/Actions';
import {Alert} from 'react-native';
import {BannerAdd, MyRewardedAd} from '../../Component/BannerAdd';
import moment from 'moment';
import Tts from 'react-native-tts';
import {useIsFocused} from '@react-navigation/native';
import {bannerAdId} from '../../Component/AdsId';
import AntDesign from 'react-native-vector-icons/AntDesign';
// const apiKey = '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';
// const apiKey = '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';
const systemMessage = {
  role: 'system',
  content: `You are a Gym Traineer and you give response to uswho are  only related Gym Traineer, how to do Workouts,
   what diet have to take`,
};
const AITrainer = ({navigation}) => {
  const dispatch = useDispatch();
  const {rewardAdsLoad, showRewardAds} = MyRewardedAd();
  const isFocused = useIsFocused();
  const [ttsSound, setTtsSound] = useState(
    `Hello! I am your personal fitness instructor. I am here to assist you in your fitness journey.
    `,
  );

  const [searchText, setSearchText] = useState('');
  const flatListRef = useRef(null);
  const [reward, setreward] = useState(0);
  const getPurchaseHistory = useSelector(state => state.getPurchaseHistory);
  const getAIMessageHistory = useSelector(state => state.getAIMessageHistory);
  const getUserDataDetails = useSelector(state => state.getUserDataDetails);
  const getRerwardCount = useSelector(state => state.getRerwardCount);
  const [senderMessage, setsenderMessage] = useState([
    {
      message: `Hello! I am your personal fitness instructor. I am here to assist you in your fitness journey.
      `,
      sender: 'ChatGpt',
    },
  ]);
  const [ttsStatus, setTtsStatus] = useState('initiliazing');
  const [speechRate, setSpeechRate] = useState(0.5);
  const [speechPitch, setSpeechPitch] = useState(1);
  const getSoundOffOn = useSelector(state => state.getSoundOffOn);

  useEffect(() => {
    rewardAdsLoad(); // Load the ad when the component mounts
  }, []);
  useEffect(() => {
    Tts.addEventListener('tts-start', _event => setTtsStatus('started'));
    Tts.addEventListener('tts-finish', _event => setTtsStatus('finished'));
    Tts.addEventListener('tts-cancel', _event => setTtsStatus('cancelled'));
    Tts.setDefaultRate(speechRate);
    Tts.setDefaultPitch(speechPitch);
    Tts.getInitStatus().then(initTts);
  }, [getSoundOffOn]);
  const initTts = async () => {
    await Tts.setDefaultLanguage('en-IN');

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
    flatListRef.current.scrollToEnd({animated: true});
  }, [senderMessage]);
  const sendMessage = async () => {
    if (searchText.trim().length <= 0) {
      showMessage({
        message: 'Please Enter Message',
        type: 'danger',
        animationDuration: 500,

        floating: true,
        icon: {icon: 'auto', position: 'left'},
      });
      return false;
    } else {
      console.log('sdfsdfsdfdsf', getRerwardCount);
      if (getRerwardCount < 5) {
        dispatch(setRewardedCount(getRerwardCount + 1));
        handleSend(searchText);
        setSearchText('');
      } else {
        Alert.alert(
          'Questions Limit Reached!',
          'Do you want to Continue Asking Questions? Watch Ads',
          [
            {
              text: 'No',
              onPress: () => console.log('Cancel Pressed'),
              style: 'Yes',
            },
            {
              text: 'Yes',
              onPress: async () => {
                dispatch(setRewardedCount(0));
                await showRewardAds();
              },
            },
          ],
          {
            cancelable: false,
          },
        );
      }
    }
    // else if (reward == 1) {
    //   handleSend(searchText);
    //   setSearchText('');
    // } else {
    //   // handleSend(searchText);
    //   if (getPurchaseHistory.length > 0) {
    //     if (
    //       getPurchaseHistory[0]?.plan_end_date >= moment().format('YYYY-MM-DD')
    //     ) {
    //       handleSend(searchText);
    //       setSearchText('');
    //     } else {
    //       if (reward == 1) {
    //         handleSend(searchText);
    //         setSearchText('');
    //       } else {
    //         Alert.alert(
    //           'Questions Limit Reached!',
    //           'Do you want to Continue Asking Questions? Watch Ads or Upgrade your Subscription',
    //           [
    //             {
    //               text: 'No',
    //               onPress: () => console.log('Cancel Pressed'),
    //               style: 'Yes',
    //             },
    //             {
    //               text: 'Yes',
    //               onPress: () => {
    //                 MyRewardedAd(setreward).load();
    //               },
    //             },
    //           ],
    //           {
    //             cancelable: false,
    //           },
    //         );
    //       }
    //     }
    //   } else {
    //     if (reward == 1) {
    //       handleSend(searchText);
    //       setSearchText('');
    //     } else {
    //       Alert.alert(
    //         'Questions Limit Reached!',
    //         'Do you want to Continue Asking Questions? Watch Ads or Upgrade your Subscription',
    //         [
    //           {
    //             text: 'No',
    //             onPress: () => console.log('Cancel Pressed'),
    //             style: 'Yes',
    //           },
    //           {
    //             text: 'Yes',
    //             onPress: () => {
    //               MyRewardedAd(setreward).load();
    //             },
    //           },
    //         ],
    //         {
    //           cancelable: false,
    //         },
    //       );
    //     }
    //   }
    // }
  };
  const handleSend = async data => {
    const newMessage = {
      message: data,
      sender: 'user',
    };
    const newMessages = [...senderMessage, newMessage];

    processMessageToChatGPT(newMessages, newMessage);
  };
  const processMessageToChatGPT = async chatMessages => {
    let apiMessages = chatMessages.map(messageObject => {
      let role = '';
      if (messageObject.sender == 'ChatGPT') {
        role = 'system';
      } else {
        role = 'user';
      }
      return {role: role, content: messageObject.message};
    });

    const apiRequestBody = {
      model: 'gpt-3.5-turbo',
      messages: [systemMessage, ...apiMessages],
      web_access: false,
      system_prompt: '',
      temperature: 0.5,
      top_k: 10,
      top_p: 0.1,
      max_tokens: 256,
    };
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
        // 'content-type': 'application/json',
        // 'X-RapidAPI-Key': '7be654b7aemsh655aa83390ba17bp103b88jsn2fa0e7203912',
        // 'X-RapidAPI-Host': 'open-ai21.p.rapidapi.com',
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': '9f5e35e1cdmsh0e06fab358b1d30p11fb66jsnb6ce0886d0aa',
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
    } catch (error) {
      console.error(error);
    }
    // try {
    //   const response = await axios.post(
    //     'https://api.openai.com/v1/chat/completions',
    //     apiRequestBody,
    //     {
    //       // headers: {
    //       //   Authorization: `Bearer ${apiKey}`,
    //       //   'Content-Type': 'application/json',
    //       // },
    //       'content-type': 'application/json',
    //       'X-RapidAPI-Key': 'SIGN-UP-FOR-KEY',
    //       'X-RapidAPI-Host': 'open-ai21.p.rapidapi.com',
    //     },
    //   );

    //   const data = response.data;

    //   // setsenderMessage([
    //   //   ...chatMessages,
    //   //   {
    //   //     message: data.choices[0].message.content,
    //   //     sender: 'ChatGpt',
    //   //   },
    //   // ]);

    //   // dispatch(
    //   //   SetAIMessageHistory([
    //   //     ...getAIMessageHistory,

    //   //     ...chatMessages,
    //   //     {
    //   //       message: data.choices[0].message.content,
    //   //       sender: 'ChatGpt',
    //   //     },
    //   //   ]),
    //   // );

    //   setSearchText('');
    // } catch (error) {
    //   console.error('Error fetching data:', error);
    // }
  };
  // const bannerAdsDisplay = () => {
  //   if (getPurchaseHistory.length > 0) {
  //     if (
  //       getPurchaseHistory[0]?.plan_end_date >= moment().format('YYYY-MM-DD')
  //     ) {
  //       return null;
  //     } else {
  //       return <BannerAdd bannerAdId={bannerAdId} />;
  //     }
  //   } else {
  //     return <BannerAdd bannerAdId={bannerAdId} />;
  //   }
  // };

  const handleBackPress = useCallback(() => {
    Tts.stop();
    return false; // Allow default back behavior when switchButton is false
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
      <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />
      <View
        style={[
          {
            width: DeviceWidth,
            backgroundColor: '#fff',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            height:
              Platform.OS == 'ios'
                ? (DeviceHeigth * 13) / 100
                : (DeviceHeigth * 10) / 100,
            left: 1,
            paddingTop:
              Platform.OS == 'android'
                ? DeviceHeigth * 0.03
                : DeviceHeigth * 0.06,
          },
        ]}>
        <TouchableOpacity
          style={{left: 10}}
          onPress={() => {
            Tts.stop();
            navigation.goBack();
          }}>
          <AntDesign
            name={'arrowleft'}
            size={25}
            color={AppColor.INPUTTEXTCOLOR}
          />
        </TouchableOpacity>

        <Text
          style={[
            styles.headerstyle,
            {
              color: AppColor.INPUTTEXTCOLOR,
              fontFamily: 'Montserrat-SemiBold',
              fontWeight: '700',

              width: DeviceWidth * 0.8,
              textAlign: 'center',
            },
          ]}>
          Fitness Coach
        </Text>

        <View onPress={() => {}}>
          {/* <Icons name={'magnify'} size={25} color={AppColor.INPUTTEXTCOLOR} /> */}
        </View>
      </View>
      {getAIMessageHistory?.length > 0 && (
        <TouchableOpacity
          style={{
            width: 25,
            height: 25,
            justifyContent: 'flex-end',
            alignSelf: 'flex-end',
            top: -DeviceHeigth * 0.065,
            marginHorizontal: DeviceWidth * 0.03,
          }}
          onPress={() => {
            navigation.navigate('AIMessageHistory');
          }}>
          <Image
            resizeMode="contain"
            source={localImage.ChatHistory}
            style={{
              width: 25,
              height: 25,
              justifyContent: 'flex-end',
              alignSelf: 'flex-end',
            }}
          />
        </TouchableOpacity>
      )}
      <KeyboardAvoidingView
        behavior={Platform.OS == 'ios' ? 'padding' : undefined}
        contentContainerStyle={{flexGrow: 1}}
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          top:
            Platform.OS == 'android'
              ? DeviceHeigth * 0.09
              : DeviceHeigth * 0.12,
        }}>
        <ScrollView
          style={{flexGrow: 1, marginVertical: DeviceHeigth * 0.0}}
          ref={flatListRef}
          onContentSizeChange={() =>
            flatListRef.current.scrollToEnd({animated: true})
          }
          onLayout={() => flatListRef.current.scrollToEnd({animated: true})}
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
              return (
                <>
                  <View
                    style={
                      item.sender == 'ChatGpt'
                        ? item.message == 'test'
                          ? styles.messageContainer3
                          : styles.messageContainer
                        : styles.messageContainer1
                    }>
                    <View
                      style={
                        item.message == 'test'
                          ? styles.messageBubble1
                          : styles.messageBubble
                      }>
                      {item.sender == 'ChatGpt' ? (
                        item.message == 'test' ? (
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'center',
                              alignSelf: 'flex-start',
                              shadowColor: '#000',
                              shadowOffset: {width: 0, height: 5},
                              shadowOpacity: 0.25,
                              shadowRadius: 3.84,
                              elevation: 5,
                            }}>
                            <Image
                              style={{
                                width: 40,
                                height: 40,
                                marginHorizontal: 15,
                              }}
                              resizeMode="contain"
                              source={localImage.Noimage}
                            />
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
                        ) : (
                          <>
                            <Image
                              resizeMode="contain"
                              source={require('../../Icon/Images/NewImage2/mary.png')}
                              style={{
                                width: 35,
                                height: 35,
                                justifyContent: 'flex-end',
                                alignSelf: 'flex-end',
                                marginHorizontal: 5,
                              }}
                            />
                            <View
                              style={{
                                width: 250,
                                backgroundColor: '#fff',
                                borderRadius: 16,
                                //borderWidth: 1,
                                // borderColor: '#f4c7c3',
                                shadowColor: '#000',
                                shadowOffset: {
                                  width: 0,
                                  height: 2,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,
                                elevation: 5,
                              }}>
                              <View
                                style={{
                                  width: 250,

                                  borderRadius: 16,
                                  borderColor: '#f4c7c3',
                                  borderWidth: 1,
                                  backgroundColor: '#9410001A',
                                  padding: 10,
                                }}>
                                <Text
                                  style={{
                                    fontFamily: 'Poppins',
                                    fontWeight: '400',
                                    fontSize: 12,
                                    lineHeight: 15,
                                    color: AppColor.LITELTEXTCOLOR,
                                  }}>
                                  {item.message}
                                </Text>
                                <TouchableOpacity
                                  onPress={() => {
                                    if (getSoundOffOn) {
                                      dispatch(setSoundOnOff(false));
                                    } else {
                                      dispatch(setSoundOnOff(true));
                                    }
                                    setTtsSound(item.message);
                                  }}
                                  style={{
                                    justifyContent: 'center',
                                    alignSelf: 'flex-end',
                                  }}>
                                  {/* <AnimatedLottieView
                                    source={require('../../Icon/Images/NewImage2/Sound.json')}
                                    autoPlay
                                    loop
                                    style={{
                                      width: 30,
                                      height: 30,
                                      marginBottom: -10,
                                    }}
                                  /> */}
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
                            </View>
                          </>
                        )
                      ) : (
                        <>
                          <View
                            style={{
                              width: 250,
                              backgroundColor: '#ffffff',
                              borderRadius: 16,
                              borderWidth: 1,
                              borderColor: '#5050501A',
                              padding: 10,
                              shadowColor: '#000',
                              shadowOffset: {
                                width: 0,
                                height: 2,
                              },
                              shadowOpacity: 0.25,
                              shadowRadius: 3.84,
                              elevation: 5,
                            }}>
                            <Text
                              style={{
                                fontFamily: 'Poppins',
                                fontWeight: '400',
                                fontSize: 12,
                                lineHeight: 15,
                                marginHorizontal: 5,
                                color: AppColor.LITELTEXTCOLOR,
                              }}>
                              {item.message}
                            </Text>
                          </View>
                          <Image
                            resizeMode="contain"
                            // source={localImage.User}
                            source={
                              getUserDataDetails?.image_path == null
                                ? localImage.User
                                : {uri: getUserDataDetails?.image_path}
                            }
                            style={{
                              width: 30,
                              height: 30,
                              borderRadius: 30 / 2,
                              marginHorizontal: 5,
                              justifyContent: 'flex-end',
                              alignSelf: 'flex-end',
                            }}
                          />
                        </>
                      )}
                    </View>
                  </View>
                </>
              );
            }}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            updateCellsBatchingPeriod={100}
            removeClippedSubviews={true}
          />
        </ScrollView>

        <View
          style={{
            width: '100%',
            height: 50,
            alignSelf: 'center',
            backgroundColor: '#FCFCFC',
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            borderWidth: 1,
            bottom: 0,
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: 20,
          }}>
          <TextInput
            placeholder="Type Here...."
            placeholderTextColor={'rgba(80, 80, 80, 0.6)'}
            value={searchText}
            onChangeText={text => {
              setSearchText(text);
            }}
            style={styles.inputText}
          />
          <TouchableOpacity
            onPress={() => {
              sendMessage();
            }}>
            <Image
              style={{
                width: 20,
                height: 20,
                marginHorizontal: -10,
              }}
              tintColor={'#f0013b'}
              resizeMode="contain"
              source={localImage.Send}
            />
          </TouchableOpacity>
        </View>
        {/* {bannerAdsDisplay()} */}
        <BannerAdd bannerAdId={bannerAdId} />
      </KeyboardAvoidingView>
    </View>
  );
};
var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColor.WHITE,
  },
  inputText: {
    paddingLeft: 15,
    paddingRight: 30,
    width: '90%',
    height: 50,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '600',
    fontFamily: 'Poppins',
    // backgroundColor:'red',
    color: AppColor.BLACK,
  },
  messageContainer3: {
    flexDirection: 'row',
  },
  messageContainer: {
    flexDirection: 'row',
  },
  messageContainer1: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
  },
  messageBubble1: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
    left: -15,
  },
  messageBubble: {
    flexDirection: 'row',
    paddingVertical: 5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  messageText: {
    fontSize: 16,
    color: AppColor.BLACK,
    fontFamily: 'Poppins',
    textAlignVertical: 'center',
    fontWeight: '400',
    lineHeight: 29,
  },
});
export default AITrainer;
