import {
  Animated,
  ImageBackground,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {FC, useEffect, useRef, useState} from 'react';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../Component/Config';
import {AppColor, Fonts} from '../../Component/Color';
import {useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NewButton from '../../Component/NewButton';
import {RequestAPI} from '../../Component/Utilities/RequestAPI';
import ActivityLoader from '../../Component/ActivityLoader';
import {navigationRef} from '../../../App';
import {showMessage} from 'react-native-flash-message';
import {localImage} from '../../Component/Image';
import {Image} from 'react-native';
import {TextInput} from 'react-native-paper';
import axios from 'axios';
import {err} from 'react-native-svg';
interface Props {
  visible: boolean | false;
  setVisible: Function;
  afterRefer: Function;
}

const ReferByScreen: FC<Props> = ({visible, setVisible, afterRefer}) => {
  const [referralCode, setReferralCode] = useState('');
  const [loader, setLoader] = useState(false);
  const [text, setText] = useState('Apply Code');
  const [codeStatus, setCodeStatus] = useState('');
  const getUserDataDetails = useSelector(
    (state: any) => state.getUserDataDetails,
  );
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    getReferralCode();
  }, []);
  const getReferralCode = async () => {
    try {
      const code = await AsyncStorage.getItem('referalID');
      if (code != undefined || code != null) {
        setReferralCode(code);
      } else setReferralCode('');
    } catch (error) {
      setReferralCode('');
    }
  };
  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };
  const checkCode = async () => {
    setLoader(true);
    setText('Applying code...');
    try {
      const payload = new FormData();
      payload.append('referral_code', referralCode);
      payload.append('user_id',10281);
      const res = await axios(NewAppapi.SEND_REFERRAL_API, {
        method: 'POST',
        data: payload,
        headers:{
          'Content-Type':'multipart/form-data'
        }
      });
      setLoader(false);
      setVisible(false);
      console.log('POST DATA', res.data);
      if (res?.data?.msg == 'Referral coin added') {
        setText('Apply Code');
        setCodeStatus('Successfully applied');
        showMessage({
          message: 'Referral code applied successfully.',
          type: 'success',
          animationDuration: 1000,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
        navigationRef?.navigate('Yourself');
      } else if (res?.data?.msg == 'Invalid referral code') {
        setCodeStatus('Incorrect code');
        setText('Try Again');
        shake();
        showMessage({
          message: 'Invalid referral code',
          type: 'danger',
          animationDuration: 1000,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
      } else if (res?.data?.msg == 'This code has already been used') {
        setText('Try Again');
        setCodeStatus('Code already used');
        shake();
        showMessage({
          message: 'This code has already been used',
          type: 'danger',
          animationDuration: 1000,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
      } else if (
        res?.data?.msg == 'You are not able to use this referal code'
      ) {
        setText('Try Again');
        setCodeStatus('Incorrect code');
        setVisible(false)
        shake();
        showMessage({
          message: 'You cannot use this referral code.',
          type: 'info',
          animationDuration: 1000,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
        navigationRef?.navigate('Yourself');
      } else if (
        res?.data?.msg == 'you are not in current plan please try later.'
      ) {
        setCodeStatus('Incorrect code');
        showMessage({
          message: 'You cannot use this referral code.',
          type: 'info',
          animationDuration: 1000,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
        navigationRef?.navigate('Yourself');
      }
      else if (res?.data?.msg == 'user not exist') {
        setCodeStatus('Incorrect code');
        setText('Try Again');
        shake();
        showMessage({
          message: 'Invalid referral code',
          type: 'danger',
          animationDuration: 1000,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
      }
    } catch (error) {
      console.log('error--->', err);
      setText('Apply Code');
      showMessage({
        message: 'Something error',
        type: 'danger',
        animationDuration: 1000,
        floating: true,
        icon: {icon: 'auto', position: 'left'},
      });
    }
  };

  return (
    <Modal transparent visible={visible}>
      <View
        style={{
          backgroundColor: `rgba(0,0,0,0.6)`,
          flex: 1,
          justifyContent: 'center',
        }}>
        <TouchableOpacity onPress={() => setVisible(false)}>
          <Image
            source={localImage.closeButton}
            style={{
              width: 15,
              height: 15,
              alignSelf: 'flex-end',
              marginRight: DeviceWidth * 0.05,
              marginBottom: 8,
            }}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <View style={styles.imgView}>
          <ImageBackground
            source={localImage.RefferalOutline}
            style={styles.outline}
            resizeMode="stretch">
            <View style={{marginTop: DeviceHeigth * 0.03}}>
              <Text
                style={{
                  color: AppColor.BLACK,
                  fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                  fontSize: 18,
                  textAlign: 'center',
                  fontWeight: '600',
                  fontSize: DeviceHeigth >= 1024 ? 18 : 14,
                }}>
                {' '}
                Referral Code
              </Text>
              <Image
                source={localImage.RefferalCodeImg}
                style={{
                  height:
                    DeviceHeigth >= 1024
                      ? DeviceHeigth * 0.27
                      : DeviceHeigth * 0.24,
                  width: DeviceWidth,
                }}
                resizeMode="contain"
              />
              <Text
                style={[
                  styles.txt1,
                  {fontSize: DeviceHeigth >= 1024 ? 18 : 14,width:DeviceWidth*0.75},
                ]}>
                Enter your referral code below to enjoy exclusive rewards and
                benefits.
              </Text>
              <Text
                style={[
                  styles.txt1,
                  {fontSize: DeviceHeigth >= 1024 ? 18 : 14},
                ]}>
                Enter Referral Code
              </Text>
              <Animated.View
                style={{transform: [{translateX: shakeAnimation}]}}>
                <TextInput
                  style={styles.input}
                  onChangeText={txt => {
                    setReferralCode(txt);
                    setText('Apply Code');
                  }}
                  value={referralCode}
                  placeholder="Enter code"
                  activeOutlineColor="transparent"
                  underlineColor="transparent"
                  activeUnderlineColor="transparent"
                  maxLength={8}
                />
              </Animated.View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={[
                    styles.txt1,
                    {
                      marginVertical: DeviceHeigth >= 1024 ? 12 : 7,
                      fontSize: 12,
                      color:
                        codeStatus == 'Successfully applied'
                          ? '#009B51'
                          : codeStatus == 'Incorrect code'
                          ? AppColor.RED
                          : AppColor.YELLOW,
                    },
                  ]}>
                  {codeStatus}
                </Text>
                {codeStatus !== '' && (
                  <Image
                    source={
                      codeStatus == 'Successfully applied'
                        ? localImage.success
                        : codeStatus == 'Incorrect code'
                        ? localImage.danger
                        : localImage.warning
                    }
                    style={{width: 15, height: 15}}
                    resizeMode="contain"
                  />
                )}
              </View>
            </View>
            <NewButton
              ButtonWidth={DeviceWidth * 0.6}
              position={'absolute'}
              bottom={20}
              title={text}
              pV={14}
              onPress={checkCode}
              disabled={referralCode == '' && true}
            />
          </ImageBackground>
        </View>
      </View>
    </Modal>
  );
};

export default ReferByScreen;
const styles = StyleSheet.create({
  View1: {
    backgroundColor: AppColor.WHITE,
    width: DeviceWidth * 0.9,
    alignSelf: 'center',
    borderRadius: 8,
    top: DeviceHeigth / 5,
    overflow: 'hidden',
    position: 'absolute',
  },
  outline: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
  },
  imgView: {
    height: DeviceHeigth * 0.65,
    width: DeviceWidth * 0.9,
    alignSelf: 'center',
  },
  txt1: {
    alignSelf: 'center',
    textAlign: 'center',
    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
    marginVertical: 10,
    marginRight: 8,
    color: AppColor.BLACK,
  },
  input: {
    backgroundColor: AppColor.GRAY2,
    borderWidth: 1.5,
    borderRadius: 6,
    borderColor: AppColor.Gray5,
    borderStyle: 'dashed',
    width: DeviceWidth * 0.65,
    alignSelf: 'center',
    height: DeviceHeigth * 0.06,
  },
});
