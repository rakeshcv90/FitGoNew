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
// import useRewardedAd from '../../Utils/Ads/useRewardedAd';
import {navigate} from '../../Component/Utilities/NavigationUtil';
import PredefinedStyles from '../../Component/Utilities/PredefineStyles';
import {Ad} from '../../Icon/Ad';
import { translate } from '../Translation/TranslationService';

const AdEventPopup = ({modalVisible,onClose}) => {
 
  // const [modalVisible, setModalVisible] = useState(false);
  const [loader, setLoader] = useState(false);

  const getUserDataDetails = useSelector(
    (state: any) => state.getUserDataDetails,
  );


  const adSubscriptionAPI = () => {
    // showAd(() => {
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
        onClose()
      });
    // });
  };

  return (
    <View style={styles.container}>

    <Modal
      visible={modalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => onClose()}>
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
              onPress={onClose}
              containerStyle={{
                position: 'absolute',
                top: 10,
                right: 10,
                zIndex: 999,
              }}
            />
            <FitText
              type="Heading"
              value={translate('eventdialogheading')}
              marginHorizontal={20}
              w={(DeviceWidth * 2) / 3}
              color={'#34258D'}
            />
            <FitText
              type="SubHeading"
              value={translate('eventdialogsub')}
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
            onPress={() => navigate('NewSubscription', {upgrade: true})}
            w={'90%'}
            textColor={AppColor.WHITE}
            titleText={translate('purchaseplan')}
            style={{marginTop: 20, marginBottom: 20, flexDirection: 'row-reverse'}}
            IconLeft={{
              name: 'tag',
              size: 15,
              type: 'FontAwesome5',
              color: AppColor.WHITE,
            }}
            hasIcon
          />
          {/* <FitButton
            onPress={adSubscriptionAPI}
            w={'half'}
            bgColor="#28A745"
            textColor={AppColor.WHITE}
            titleText="WATCH ADS "
            loaderColor={AppColor.RED}
            loader={loader || false}
            style={{marginBottom: 20, flexDirection: 'row-reverse'}}
            IconLComp={<Ad />}
            hasIcon={false}
          /> */}
        </View>
      </View>
    </Modal>
    </View>
  );
};

export default AdEventPopup;

const styles = StyleSheet.create({});
