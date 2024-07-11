import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {FC, useEffect, useState} from 'react';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../Component/Config';
import {AppColor} from '../../Component/Color';
import FitText from '../../Component/Utilities/FitText';
import InputText from '../../Component/InputText';
import {useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NewButton from '../../Component/NewButton';
import {RequestAPI} from '../../Component/Utilities/RequestAPI';
import ActivityLoader from '../../Component/ActivityLoader';
import {navigationRef} from '../../../App';

interface Props {
  visible: boolean | false;
  setVisible: Function;
  afterRefer: Function;
}

const ReferByScreen: FC<Props> = ({visible, setVisible, afterRefer}) => {
  const [referralCode, setReferralCode] = useState('');
  const [loader, setLoader] = useState(false);

  const getUserDataDetails = useSelector(
    (state: any) => state.getUserDataDetails,
  );

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

  const checkCode = () => {
    setLoader(true);
    console.log(loader);
    RequestAPI.makeRequest(
      'POST',
      NewAppapi.SEND_REFERRAL_API,
      {
        referral_code: referralCode.toLowerCase(),
        user_id: getUserDataDetails?.id
      },
      (res: any) => {
        setLoader(false);
        setVisible(false);
        if (res?.status == 200 && res?.data?.msg == 'Referral coin added') {
          console.log('POST DATA', res?.data);
          //   afterRefer()
        } else if (
          res?.status == 200 &&
          res?.data?.msg == 'Invalid referral code'
        ) {
          console.log('POST DATA', res?.data);
          //   afterRefer()
        } else if (
          res?.status == 200 &&
          res?.data?.msg == 'This code has already been used'
        ) {
          console.log('POST DATA', res?.data);
          //   afterRefer()
        } else if (
          res?.status == 200 &&
          res?.data?.msg == 'You are not able to use this referal code'
        ) {
          console.log('POST DATA', res?.data);
          //   afterRefer()
        }
        navigationRef?.navigate('Yourself');
      },
    );
  };

  return (
    <Modal
      visible={visible}
      onRequestClose={() => setVisible(false)}
      animationType="slide"
      transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'position' : undefined}
        style={{
          flex: 1,
          //   backgroundColor: '#f2f2f2',
          justifyContent: 'flex-end',
        }}>
        <View
          style={[
            {
              width: DeviceWidth,
              height: DeviceHeigth / 2,
              backgroundColor: AppColor.WHITE,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              ...Platform.select({
                ios: {
                  shadowColor: '#000000',
                  shadowOffset: {width: 0, height: 2},
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                },
                android: {
                  elevation: 4,
                },
              }),
            },
          ]}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 10,
              paddingHorizontal: 20,
            }}>
            <FitText type="Heading" value="" />
            <FitText type="Heading" value="Referral Code ?" />
            <FitText
              type="Heading"
              value="X"
              onPress={() => setVisible(false)}
            />
          </View>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: DeviceWidth / 8,
            }}>
            <FitText
              type="Heading"
              value="Have a referral code ?"
              marginVertical={20}
            />
            <InputText
              placeholder="Enter the referral code here"
              value={referralCode}
              onChangeText={(text: string) => setReferralCode(text)}
            />
            <NewButton
              ButtonWidth={DeviceWidth / 2}
              title={'Submit'}
              onPress={checkCode}
              mV={20}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
      <ActivityLoader visible={loader} />
    </Modal>
  );
};

export default ReferByScreen;

const styles = StyleSheet.create({});
