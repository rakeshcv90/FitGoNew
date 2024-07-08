import {
  View,
  Platform,
  TouchableOpacity,
  Animated,
  Easing,
  Text,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Image} from 'react-native';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import {AppColor, Fonts} from '../../Component/Color';
import ProgressBar from './ProgressBar';
import Bulb from './Bulb';
import {useDispatch, useSelector} from 'react-redux';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import analytics from '@react-native-firebase/analytics';
import {localImage} from '../../Component/Image';
const Gender = ({route, navigation}) => {
  const {data, nextScreen, name} = route?.params;
  const getUserDataDetails = useSelector(state => state.getUserDataDetails);
  const dispatch = useDispatch();
  const [screen, setScreen] = useState(nextScreen);
  const [selectedbutton, setSelectedButton] = useState('');
  useEffect(() => {
    setScreen(nextScreen);
  }, []);

  const handleImagePress = gender => {
    analytics().logEvent(`CV_FITME_GENDER_${gender}`);
    setSelectedButton(gender);
    toNextScreen(gender);
  };

  const toNextScreen = gender => {
    setTimeout(() => {
      const params = {
        // nextScreen: screen + 1,
        data: data,
        gender: gender,
      };

      if (name) {
        params.name = name;
      }
      navigation.navigate('Goal', params);
    }, 500);
  };

  return (
    <View
      style={{flex: 1, backgroundColor: AppColor.WHITE, alignItems: 'center'}}>
      {/* <ProgressBar screen={screen} /> */}
      <View
        style={{
          marginTop:
            Platform.OS === 'ios'
              ? DeviceHeigth >= 1024 || DeviceHeigth <= 667
                ? DeviceHeigth * 0.05
                : DeviceHeigth * 0.08
              : DeviceHeigth * 0.05,
        }}>
        <Bulb screen={'Select your gender'} />
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          // height: DeviceHeigth * 0.6,
          width: DeviceWidth,
          alignSelf: 'center',
          marginBottom:
            Platform.OS === 'ios'
              ? DeviceHeigth >= 1024 || DeviceHeigth <= 667
                ? DeviceHeigth * 0.05
                : DeviceHeigth * 0.08
              : DeviceHeigth * 0.05,
          flex: 1,
        }}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => handleImagePress('Male')}
          style={{
            alignSelf: 'center',
            width: DeviceWidth / 2.35,
            backgroundColor: AppColor.BACKGROUNG,
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: 16,
            borderRadius: 12,
            borderWidth: 2,
            borderColor:
              selectedbutton == 'Male' ? AppColor.RED : AppColor.WHITE,
          }}>
          <Image
            source={localImage.MaleNew}
            style={{height: DeviceHeigth * 0.15, width: '100%', marginTop: 20}}
            resizeMode="contain"
          />
          <Text
            style={{
              textAlign: 'center',
              fontSize: 18,
              fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
              color: selectedbutton == 'Male' ? AppColor.RED : AppColor.BLACK,
              marginVertical: 20,
            }}>
            Male
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => handleImagePress('Female')}
          style={{
            width: DeviceWidth / 2.35,
            backgroundColor: AppColor.BACKGROUNG,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 16,
            borderRadius: 12,
            borderWidth: 2,
            borderColor:
              selectedbutton == 'Female' ? AppColor.RED : AppColor.WHITE,
          }}>
          <Image
            source={localImage.FemaleNew}
            style={{height: DeviceHeigth * 0.15, width: '106%', marginTop: 20}}
            resizeMode="contain"
          />
          <Text
            style={{
              textAlign: 'center',
              fontSize: 18,
              fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
              color: selectedbutton == 'Female' ? AppColor.RED : AppColor.BLACK,
              marginVertical: 20,
            }}>
            Female
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Gender;
