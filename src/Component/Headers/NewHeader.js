import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  SafeAreaView,
} from 'react-native';
import React from 'react';
import {DeviceHeigth, DeviceWidth} from '../Config';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {AppColor} from '../Color';
import {useNavigation} from '@react-navigation/native';
import {getStatusBarHeight} from 'react-native-status-bar-height';
const NewHeader = ({header, backButton, SearchButton}) => {
  const navigation = useNavigation();

  return (
    <SafeAreaView
      style={[
        style.container,
        {
          height:
            Platform.OS == 'ios'
              ? (DeviceHeigth * 13) / 100  //adding statusbar height for the ios
              : (DeviceHeigth * 10) / 100,
          left: 1,
          paddingTop: Platform.OS == 'android' ? DeviceHeigth * 0.03 : 0.01,
        },
      ]}>
      {!backButton ? (
        <View style={{width: 0}}></View>
      ) : (
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <Icons
            name={'chevron-left'}
            size={25}
            color={AppColor.INPUTTEXTCOLOR}
          />
        </TouchableOpacity>
      )}

      <Text
        style={[
          style.headerstyle,
          {
            color: AppColor.INPUTTEXTCOLOR,
            fontFamily: 'Verdana',
          },
        ]}>
        {header}
      </Text>
      {!SearchButton ? (
        <View style={{width: 25}}></View>
      ) : (
        <TouchableOpacity onPress={() => {}}>
          <Icons name={'magnify'} size={25} color={AppColor.INPUTTEXTCOLOR} />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};
const style = StyleSheet.create({
  container: {
    width: DeviceWidth,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerstyle: {
    fontWeight: '600',
    fontSize: 19,
  },
});
export default NewHeader;
