import {View, Text, Image, Platform, KeyboardAvoidingView} from 'react-native';
import React from 'react';
import {StyleSheet} from 'react-native';
import {AppColor} from '../../Component/Color';
import {StatusBar} from 'react-native';
import NewHeader from '../../Component/Headers/NewHeader';
import Icons from 'react-native-vector-icons/FontAwesome5';
import {localImage} from '../../Component/Image';
import {DeviceHeigth} from '../../Component/Config';
import {TextInput} from 'react-native';

const AITrainer = () => {
  return (
    <View style={styles.container}>
      <NewHeader header={'  Fitness Coach'} backButton={true} />

      <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />
      <View style={{flexDirection: 'row'}}>
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
            width: 200,
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
              width: 200,

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
              Hey there! I'm your friendly chat bot here to assist you.
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          alignSelf: 'flex-end',
          top: 20,
        }}>
        <View
          style={{
            width: 200,
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
            Lorem ipsum dolor sit amet consectetur adipiscing elit. Lorem ipsum
            dolor sit amet consectetur adipiscing elit.
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
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS == 'ios' ? 'position' : undefined}
        contentContainerStyle={{flexGrow: 1}}
        style={{position: 'absolute', bottom: 0,width: '100%',}}>
        <View
          style={{
            width: '100%',
            height: 70,
            alignSelf: 'center',
            // backgroundColor: '#FCFCFC',
            backgroundColor: 'red',

            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: 20,

            shadowColor: 'rgba(0, 0, 0, 1)',
            ...Platform.select({
              ios: {
                shadowColor: '#000000',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.1,
                shadowRadius: 4,
              },
              android: {
                elevation: 5,
              },
            }),
          }}>
          <Icons name="search" size={25} color={'rgba(80, 80, 80, 0.6)'} />
          <TextInput
            placeholder="Search Products"
            placeholderTextColor={'rgba(80, 80, 80, 0.6)'}
            //value={searchText}

            // onChangeText={text => {
            //   setsearchText(text);
            //   updateFilteredCategories(text)
            // }}
            style={styles.inputText}
          />
        </View>
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
    paddingRight: 15,
    width: '90%',
    height: 50,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '600',
    fontFamily: 'Poppins',
    color: 'rgba(80, 80, 80, 0.6)',
  },
});
export default AITrainer;
