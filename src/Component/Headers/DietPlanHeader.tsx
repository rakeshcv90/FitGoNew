import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  Image,
  ImageRequireSource,
} from 'react-native';
import React, {FC} from 'react';
import {DeviceHeigth, DeviceWidth} from '../Config';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {AppColor} from '../Color';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {useDispatch, useSelector} from 'react-redux';

import {setExperience} from '../ThemeRedux/Actions';
import {navigationRef} from '../../../App';

type Props = {
  header: string;
  backButton?: boolean;
  SearchButton?: boolean;
  onPress?: () => void;
  source?: ImageRequireSource | any;
  onPressImage?: () => void;
  backPressCheck?: boolean;
  workoutCat?: boolean;
  shadow?: boolean;
  left?: number;
  h?: number;
  paddingTop?: number;
  introType?:boolean;
};

const DietPlanHeader: FC<Props> = ({
  header,
  backButton,
  SearchButton,
  onPress,
  source,
  onPressImage,
  backPressCheck,
  workoutCat,
  shadow,
  left,
  h,
  paddingTop,
  introType,
}) => {
  const navigation = useNavigation();
  const getExperience = useSelector((state: any) => state.getExperience);
  const dispatch = useDispatch();
  return (
    <View
      style={[
        style.container,
        !shadow && style.shadow,
        {
          height: h
            ? h
            : Platform.OS == 'ios'
            ? (DeviceHeigth * 13) / 100
            : (DeviceHeigth * 10) / 100,
          // left: 1,
          paddingTop: paddingTop
            ? paddingTop
            : Platform.OS == 'android'
            ? DeviceHeigth * 0.035
            : DeviceHeigth * 0.055,
        },
      ]}>
      {backButton ? (
        <View style={{width: 20}}></View>
      ) : (
        <TouchableOpacity
          // style={{
          //   left: left
          //     ? left
          //     : DeviceHeigth >= 1024
          //     ? DeviceWidth * 0.045
          //     : DeviceWidth * 0.04,
          // }}
          onPress={() => {
            if (backPressCheck && onPress) {
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
              } else if (introType) {
                navigation.navigate('BottomTab', {screen: 'Home'});
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
            textTransform: 'capitalize',
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
  shadow: {
    shadowColor: 'grey',
    ...Platform.select({
      ios: {
        //shadowColor: '#000000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
});
export default DietPlanHeader;
