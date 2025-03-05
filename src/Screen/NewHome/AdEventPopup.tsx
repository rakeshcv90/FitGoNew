import {ImageBackground, Modal, Platform, StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {localImage} from '../../Component/Image';
import {DeviceWidth} from '../../Component/Config';
import FitIcon from '../../Component/Utilities/FitIcon';
import {AppColor, PLATFORM_IOS} from '../../Component/Color';
import FitText from '../../Component/Utilities/FitText';
import FitButton from '../../Component/Utilities/FitButton';
import {useSelector} from 'react-redux';
import {API_CALLS} from '../../API/API_CALLS';
import {StatusBar} from 'react-native';
import {hasFreeEvent} from '../Event/EnteringEventFunction';
import useRewardedAd from '../../Utils/Ads/useRewardedAd';
import {navigate} from '../../Component/Utilities/NavigationUtil';

const AdEventPopup = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [loader, setLoader] = useState(false);

  const getUserDataDetails = useSelector(
    (state: any) => state.getUserDataDetails,
  );
  const getPurchaseHistory = useSelector(
    (state: any) => state.getPurchaseHistory,
  );

  // const {isAdReady, showAd} = useRewardedAd();

  useEffect(() => {
    hasFreeEvent(getPurchaseHistory) && setModalVisible(true);
  }, []);

  const adSubscriptionAPI = () => {
    // showAd(() => {
    //   setLoader(true);
    //   API_CALLS.createSubscriptionPlan({
    //     user_id: getUserDataDetails.id,
    //     transaction_id: 'free',
    //     plan: 'free',
    //     platform: Platform.OS,
    //     product_id: 'fitme_free',
    //     plan_value: 0,
    //   }).finally(() => {
    //     setLoader(false);
    //     setModalVisible(false);
    //   });
    // });
  };

  return (
    <Modal
      visible={modalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setModalVisible(false)}>
      <StatusBar backgroundColor={AppColor.WHITE} barStyle={'dark-content'} />
      <View style={{justifyContent: 'flex-end', flex: 1}}>
        <ImageBackground
          source={localImage.AdPopupIMG}
          imageStyle={{width: '100%', height: '90%'}}
          style={{
            flex: 1,
            width: DeviceWidth,
            height: '70%',
            justifyContent: 'center',
          }}
          resizeMode="contain">
          <FitIcon
            name="close"
            size={30}
            type="MaterialCommunityIcons"
            color={AppColor.WHITE}
            bW={0}
            roundBackground="#00000080"
            containerStyle={{
              position: 'absolute',
              top: 30,
              right: 20,
              zIndex: 999,
            }}
            onPress={() => setModalVisible(false)}
            roundIcon
          />
          <FitText
            type="Heading"
            value="Want to Join the Event?"
            marginHorizontal={20}
            fontSize={40}
            lineHeight={60}
            w={(DeviceWidth * 2) / 3}
            color={AppColor.PrimaryTextColor}
          />
          <FitText
            type="SubHeading"
            value="When you start the event, you can earn amazing rewards."
            marginHorizontal={20}
            fontSize={20}
            lineHeight={25}
            w={'80%'}
            color={AppColor.SecondaryTextColor}
          />
          <View style={{marginBottom: 20}} />
          <FitButton
            onPress={() => navigate('NewSubscription')}
            w={'90%'}
            textColor={AppColor.WHITE}
            titleText="GET Premium"
            mV={20}
          />
          {/* {isAdReady && (
            <FitButton
              onPress={adSubscriptionAPI}
              w={'90%'}
              textColor={AppColor.RED}
              bgColor={AppColor.WHITE}
              titleText="WATCH ADS"
              loaderColor={AppColor.RED}
              loader={loader}
            />
          )} */}
        </ImageBackground>
      </View>
    </Modal>
  );
};

export default AdEventPopup;

const styles = StyleSheet.create({});
