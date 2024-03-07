import {View, Text, ScrollView, FlatList} from 'react-native';
import React, {useRef, useState} from 'react';
import {StyleSheet} from 'react-native';
import {AppColor} from '../../Component/Color';
import NewHeader from '../../Component/Headers/NewHeader';
import {StatusBar} from 'react-native';
import {useSelector} from 'react-redux';
import {DeviceWidth} from '../../Component/Config';
import {Image} from 'react-native';
import {localImage} from '../../Component/Image';

const AIMessageHistory = () => {
  const {getAIMessageHistory} = useSelector(state => state);
  const [senderMessage, setsenderMessage] = useState(getAIMessageHistory);

  const flatListRef = useRef(null);
  return (
    <View style={styles.container}>
      <NewHeader header={'AI Message History'} backButton={true} />
      <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />
      <ScrollView
        style={{flexGrow: 1}}
        ref={flatListRef}
        onContentSizeChange={() =>
          flatListRef.current.scrollToEnd({animated: true})
        }
        onLayout={() => flatListRef.current.scrollToEnd({animated: true})}
        contentContainerStyle={{paddingBottom: (DeviceWidth * 20) / 100}}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}>
        <FlatList
          data={senderMessage}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => {
       
            return (
              <>
                <View
                  style={
                    item.sender == 'ChatGpt'
                      ? styles.messageContainer
                      : styles.messageContainer1
                  }>
                  {item.sender == 'ChatGpt' ? (
                    <>
                      <Image
                        resizeMode="contain"
                        source={localImage.Boot}
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
                          borderWidth: 1,
                          borderColor: '#f4c7c3',
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
                        </View>
                      </View>
                    </>
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
                        source={localImage.User}
                        style={{
                          width: 30,
                          height: 30,
                          justifyContent: 'flex-end',
                          alignSelf: 'flex-end',
                        }}
                      />
                    </>
                  )}
                </View>
                {/* <View
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
                            source={localImage.Boot}
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
                            source={localImage.Boot}
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
                              borderWidth: 1,
                              borderColor: '#f4c7c3',
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
                          source={localImage.User}
                          style={{
                            width: 30,
                            height: 30,
                            justifyContent: 'flex-end',
                            alignSelf: 'flex-end',
                          }}
                        />
                      </>
                    )}
                  </View>
                </View> */}
              </>
            );
          }}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={100}
          removeClippedSubviews={true}
        />
      </ScrollView>
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
    color: 'rgba(80, 80, 80, 0.6)',
  },
  messageContainer3: {
    flexDirection: 'row',
    marginTop:20
  },
  messageContainer: {
    flexDirection: 'row',
    marginTop:20
  },
  messageContainer1: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    marginTop:10
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
export default AIMessageHistory;
