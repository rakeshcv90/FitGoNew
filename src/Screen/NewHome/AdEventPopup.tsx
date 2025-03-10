import {
  Image,
  ImageBackground,
  Modal,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
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
import PredefinedStyles from '../../Component/Utilities/PredefineStyles';
import {Ad} from '../../Icon/Ad';

const AdEventPopup = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [loader, setLoader] = useState(false);

  const getUserDataDetails = useSelector(
    (state: any) => state.getUserDataDetails,
  );
  const getPurchaseHistory = useSelector(
    (state: any) => state.getPurchaseHistory,
  );

  const {isAdReady, showAd} = useRewardedAd();

  useEffect(() => {
    // hasFreeEvent(getPurchaseHistory) &&
     setModalVisible(true);
  }, []);

  const adSubscriptionAPI = () => {
    showAd(() => {
      setLoader(true);
      API_CALLS.createSubscriptionPlan({
        user_id: getUserDataDetails.id,
        transaction_id: 'free',
        plan: 'free',
        platform: Platform.OS,
        product_id: 'fitme_free',
        plan_value: 0,
      }).finally(() => {
        setLoader(false);
        setModalVisible(false);
      });
    });
  };

  return (
    <Modal
      visible={modalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setModalVisible(false)}>
      <StatusBar backgroundColor={AppColor.WHITE} barStyle={'dark-content'} />
      <View
        style={{
          justifyContent: 'center',
          flex: 1,
          backgroundColor: '#00000099',
        }}>
        <View
          style={[
            PredefinedStyles.NormalCenter,
            {
              backgroundColor: AppColor.WHITE,
              borderRadius: 20,
              margin: 20,
              overflow: 'hidden',
            },
          ]}>
          <View
            style={{
              backgroundColor: '#D3DBFF',
              width: '100%',
              paddingTop: 30,
              alignItems: 'center',
            }}>
            <FitIcon
              name="close"
              size={25}
              type="MaterialCommunityIcons"
              onPress={() => setModalVisible(false)}
              containerStyle={{
                position: 'absolute',
                top: 10,
                right: 10,
                zIndex: 999,
              }}
            />
            <FitText
              type="Heading"
              value="Want to Join the Event?"
              marginHorizontal={20}
              w={(DeviceWidth * 2) / 3}
              color={'#34258D'}
            />
            <FitText
              type="SubHeading"
              value="When you start the event, you can earn amazing rewards."
              marginHorizontal={20}
              // fontSize={20}
              // lineHeight={25}
              textAlign="center"
              w={'80%'}
              color={'#34258D'}
            />
            <Image
              source={localImage.AdPopupIMG}
              style={{width: '100%', height: 100}}
              resizeMode="contain"
            />
          </View>
          <FitButton
            onPress={() => navigate('NewSubscription')}
            w={'90%'}
            textColor={AppColor.WHITE}
            titleText="PURCHASE PLAN "
            style={{marginTop: 20, flexDirection: 'row-reverse'}}
            IconLeft={{
              name: 'tag',
              size: 15,
              type: 'FontAwesome5',
              color: AppColor.WHITE,
            }}
            hasIcon
          />
          {isAdReady && (
            <FitButton
              onPress={adSubscriptionAPI}
              w={'half'}
              bgColor="#28A745"
              textColor={AppColor.WHITE}
              titleText="WATCH ADS "
              loaderColor={AppColor.RED}
              loader={loader}
              style={{marginBottom: 20, flexDirection: 'row-reverse'}}
              IconLComp={<Ad />}
              hasIcon
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

export default AdEventPopup;

const styles = StyleSheet.create({});
