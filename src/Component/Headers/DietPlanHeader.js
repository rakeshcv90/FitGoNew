import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  Image,
} from 'react-native';
import React from 'react';
import {DeviceHeigth, DeviceWidth} from '../Config';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {AppColor} from '../Color';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {useDispatch, useSelector} from 'react-redux';

import {setExperience} from '../ThemeRedux/Actions';
import {navigationRef} from '../../../App';

const DietPlanHeader = ({
  header,
  backButton,
  SearchButton,
  onPress,
  source,
  onPressImage,
  backPressCheck,
  workoutCat,
}) => {
  const navigation = useNavigation();
  const getExperience = useSelector(state => state.getExperience);
  const dispatch = useDispatch();
  return (
    <View
      style={[
        style.container,
        {
          height:
            Platform.OS == 'ios'
              ? (DeviceHeigth * 5) / 100
              : (DeviceHeigth * 7) / 100,
          left: 1,
          paddingTop:
            Platform.OS == 'android'
              ? DeviceHeigth * 0.02
              : DeviceHeigth * 0.01,
        },
      ]}>
      {!backButton ? (
        <View style={{width: 20}}></View>
      ) : (
        <TouchableOpacity
          style={{left: 16}}
          onPress={() => {
            if (backPressCheck) {
              onPress();
            } else {
              if (getExperience == true) {
                dispatch(setExperience(false));
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{name: 'BottomTab'}],
                  }),
                );
                // navigationRef.current.navigate('BottomTab',{screen:'Home'})
              } else {
                navigation.goBack();
              }
            }
          }}>
          {workoutCat ? (
            <Icons name={'close'} size={25} color={AppColor.INPUTTEXTCOLOR} />
          ) : (
            <AntDesign
              name={'arrowleft'}
              size={25}
              color={AppColor.INPUTTEXTCOLOR}
            />
          )}
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
        <TouchableOpacity onPress={onPressImage} style={{marginRight: 5}}>
          <Image
            source={source}
            style={{
              height: 28,
              width: 28,
              alignSelf: 'center',
            }}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};
const style = StyleSheet.create({
  container: {
    width: DeviceWidth,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerstyle: {
    fontWeight: '600',
    fontSize: 19,
  },
});
export default DietPlanHeader;
