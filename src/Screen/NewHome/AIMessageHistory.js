import {View, Text, ScrollView, FlatList} from 'react-native';
import React, {useRef, useState} from 'react';
import {StyleSheet} from 'react-native';
import {AppColor} from '../../Component/Color';
import NewHeader from '../../Component/Headers/NewHeader';
import {StatusBar} from 'react-native';
import {useSelector} from 'react-redux';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import {Image} from 'react-native';
import {localImage} from '../../Component/Image';
import NewHeader1 from '../../Component/Headers/NewHeader1';
import Wrapper from '../WorkoutCompleteScreen/Wrapper';

const AIMessageHistory = () => {
  const {getAIMessageHistory} = useSelector(state => state);
  const [senderMessage, setsenderMessage] = useState(getAIMessageHistory);
   const getUserDataDetails=useSelector(state=>state?.getUserDataDetails)
  const flatListRef = useRef(null);
  return (
    <View style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />
      <Wrapper>
        <NewHeader1 header={'AI Message History'} backButton={true} />
        <ScrollView
          style={{flexGrow: 1}}
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
            contentContainerStyle={{paddingBottom: DeviceHeigth * 0.05}}
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
                          resizeMode="cover"
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
                </>
              );
            }}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            updateCellsBatchingPeriod={100}
            removeClippedSubviews={true}
          />
        </ScrollView>
      </Wrapper>
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
    marginTop: 20,
  },
  messageContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  messageContainer1: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    marginTop: 10,
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
