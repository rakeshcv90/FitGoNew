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
import {CommonActions, useNavigation} from '@react-navigation/native';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {useDispatch, useSelector} from 'react-redux';

import { setExperience } from '../ThemeRedux/Actions';
import { navigationRef } from '../../../App';

const NewHeader = ({header, backButton, SearchButton}) => {
  const navigation = useNavigation();
const getExperience=useSelector(state=>state.getExperience)
const dispatch=useDispatch()
  return (
    <SafeAreaView
      style={[
        style.container,
        {
          height:
            Platform.OS == 'ios'
              ? (DeviceHeigth * 13) / 100
              : (DeviceHeigth * 10) / 100,
          left: 1,
          paddingTop:
            Platform.OS == 'android'
              ? DeviceHeigth * 0.03
              : DeviceHeigth * 0.01,
        },
      ]}>
      {!backButton ? (
        <View style={{width: 20}}></View>
      ) : (
        <TouchableOpacity
        style={{left:0}}
          onPress={() => {
      
          if(getExperience==true){
            dispatch(setExperience(false))
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes:[{name:'BottomTab'}]
              })
            );
           // navigationRef.current.navigate('BottomTab',{screen:'Home'})
          }
          else{
           navigation.goBack()
          }
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
            fontFamily: 'Montserrat-SemiBold',
            fontWeight: '700',

            width: DeviceWidth * 0.8,
            textAlign: 'center',
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
