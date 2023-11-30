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
const NewHeader = ({
  header,
  icon1,
  icon2,
  SearchScreenName,
  HeaderSize,
  LeftIconSize,
  RightIconSize,
}) => {
  const navigation = useNavigation();
  return (
    <SafeAreaView
      style={[
        style.container,
        {
          height:
            Platform.OS == 'ios'
              ? (DeviceHeigth * 5) / 100 + getStatusBarHeight() //adding statusbar height for the ios

              : (DeviceHeigth * 5) / 100,
        },
      ]}>
      {icon1 == null ? (
        <View></View>
      ) : (
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <Icons
            name={icon1}
            size={LeftIconSize}
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
            fontSize: HeaderSize,
          },
        ]}>
        {header}
      </Text>
      {icon2 == null ? (
        <View></View>
      ) : (
        <TouchableOpacity onPress={() => {}}>
          <Icons
            name={icon2}
            size={RightIconSize}
            color={AppColor.INPUTTEXTCOLOR}
          />
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
    alignItems: 'center',
    padding: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.3,
        // shadowRadius: 10,
      },
      android: {
        elevation: 10,
        shadowColor: '#000000',
        shadowOffset: {width: 5, height: 5},
        shadowOpacity: 0.9,
        // shadowRadius: 10,
      },
    }),
  },
  headerstyle: {
    fontWeight: '600',
  },
});
export default NewHeader;
