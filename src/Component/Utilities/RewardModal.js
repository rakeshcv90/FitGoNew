import {View, Text, StyleSheet, Modal, Alert} from 'react-native';
import React, {useState} from 'react';
import {AppColor, Fonts} from '../Color';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../Config';
import {Image} from 'react-native';
import {localImage} from '../Image';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {BlurView} from '@react-native-community/blur';
import NewButton from '../NewButton';
import {
  openSettings,
  PERMISSIONS,
  requestMultiple,
  RESULTS,
} from 'react-native-permissions';
import axios from 'axios';
import VersionNumber from 'react-native-version-number';
import {useSelector, useDispatch} from 'react-redux';
import {showMessage} from 'react-native-flash-message';
import {setOfferAgreement, setRewardModal} from '../ThemeRedux/Actions';
import {locationPermission} from '../../Screen/Terms&Country/LocationPermission';
import ActivityLoader from '../ActivityLoader';
const RewardModal = ({visible, navigation}) => {
  const dispatch = useDispatch();
  // const handleButton = () => {
  //   setloaded(false);
  //   getAgreementStatus().then(result => {
  //     if (result == null) {
  //       locationPermission().then(result => {
  //         if (result == 'India') {
  //           StoreAgreementApi(result); //
  //         } else if (result == 'blocked') {
  //           showPermissionAlert(); //
  //           setloaded(true);
  //         } else {
  //           //
  //           console.log('nothing'); //
  //           setloaded(true);
  //         }
  //       });
  //     } else if (result == 'India') {
  //       setloaded(true); //
  //       navigation.navigate('NewSubscription')
  //       console.log('India');
  //     } else {
  //       setloaded(true);
  //       console.log('anything'); //
  //     }
  //   });
  // };
  //
  // const showPermissionAlert = () => {
  //   Alert.alert(
  //     'Permission Required',
  //     'To use the rewards feature, please enable location access in settings',
  //     [
  //       {text: 'Cancel', style: 'cancel'},
  //       {text: 'Open settings', onPress: openSettings},
  //     ],
  //     {cancelable: false},
  //   );
  // };
  //
  // const getAgreementStatus = async () => {
  //   return new Promise((resolve, reject) => {
  //     try {
  //       const ApiCall = axios(NewAppapi.GET_AGR_STATUS, {
  //         method: 'POST',
  //         data: {
  //           user_id: getUserDataDetails?.id,
  //           version: VersionNumber?.appVersion,
  //         },
  //         headers: {
  //           'Content-Type': 'multipart/form-data',
  //         },
  //       });

  //       // Check if response is what you expect
  //       ApiCall.then(response => {
  //         if (
  //           response?.data?.msg ===
  //           'Please update the app to the latest version.'
  //         ) {
  //           showMessage({
  //             message: response?.data?.msg,
  //             floating: true,
  //             duration: 500,
  //             type: 'danger',
  //             icon: {icon: 'auto', position: 'left'},
  //           });
  //           resolve('update Api version');
  //         } else {
  //           resolve(response?.data?.location);
  //           dispatch(setOfferAgreement(response?.data));
  //         }
  //       }).catch(error => {
  //         // Catch any errors during API call
  //         reject(error);
  //       });
  //     } catch (error) {
  //       reject(error);
  //     }
  //   });
  // };
  //
  // const StoreAgreementApi = async country => {
  //   const payload = new FormData();
  //   payload.append('version', VersionNumber?.appVersion);
  //   payload.append('user_id', getUserDataDetails?.id);
  //   payload.append('country', country);
  //   payload.append('term_conditons', 'Accepted');
  //   try {
  //     const Apicall = await axios(NewAppapi.STORE_USER_AGR_COUNTRY, {
  //       method: 'POST',
  //       data: payload,
  //       headers: {'Content-Type': 'multipart/form-data'},
  //     });
  //     if( Apicall?.data){
  //       setloaded(true);
  //       dispatch(setRewardModal(false))
  //       navigation.navigate('NewSubscription')
  //     }

  //    else if (
  //       Apicall?.data?.msg == 'Please update the app to the latest version.' ||
  //       Apicall?.data?.msg == 'user not found'
  //     ) {
  //       setloaded(true);
  //       showMessage({
  //         message: Apicall?.data?.msg,
  //         floating: true,
  //         duration: 500,
  //         type: 'danger',
  //         icon: {icon: 'auto', position: 'left'},
  //       });
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     setloaded(true);
  //   }
  // };
  return (
    <Modal transparent visible={visible}>
      <View style={{backgroundColor: `rgba(0,0,0,0.4)`, flex: 1}}>
        <View style={styles.View1}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Image
              source={localImage.Modal_img}
              style={styles.img1}
              resizeMode="stretch"
            />
            <Image
              source={localImage.ModalCoin}
              style={[styles.img2]}
              resizeMode="contain"
            />
            <Icon
              name="close"
              size={30}
              color={AppColor.BLACK}
              style={{margin: 16}}
              onPress={() => {
                dispatch(setRewardModal(false));
              }}
            />
          </View>
          <View style={{marginVertical: 30}}>
            <Text style={styles.txt1}>
              <Text style={{color: AppColor.RED}}>
                {'Earn While You Burn\n'}
              </Text>
              Join the fitness challenge today for a healthier you and a
              wealthier wallet!
            </Text>
            <NewButton
              pV={15}
              title={'Get Started'}
              ButtonWidth={DeviceWidth * 0.6}
              onPress={() => {
                dispatch(setRewardModal(false));
                navigation.navigate('NewSubscription',{upgrade: false});
              }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
  //view
  View1: {
    backgroundColor: AppColor.WHITE,
    // height: 300,
    width: DeviceWidth * 0.9,
    alignSelf: 'center',
    borderRadius: 8,
    top: DeviceHeigth / 4,
    overflow: 'hidden',
    position: 'absolute',
  },
  //img
  img1: {
    height: 100,
    width: 100,
    overflow: 'hidden',
  },
  img2: {
    height: DeviceHeigth * 0.2,
    width: DeviceWidth * 0.45,
    right: DeviceWidth * 0.04,
  },
  //texts
  txt1: {
    color: AppColor.BLACK,
    fontSize: 22,
    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalContainer1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // Semi-transparent background
  },
});
export default RewardModal;
