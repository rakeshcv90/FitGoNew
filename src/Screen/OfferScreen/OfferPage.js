import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ImageBackground,
  ScrollView,
} from 'react-native';
import React from 'react';
import {AppColor} from '../../Component/Color';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import OfferHeader from './OfferHeader';
import EventBanner from './EventBanner';
import OfferCards from './OfferCards';
import {localImage} from '../../Component/Image';
import {useSelector} from 'react-redux';

const OfferPage = ({navigation}) => {
  const enteredUpcomingEvent = useSelector(
    state => state?.enteredUpcomingEvent,
  );
  const enteredCurrentEvent = useSelector(state => state?.enteredCurrentEvent);
  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor={'transparent'} />
      <ScrollView>
        <OfferHeader />
        <EventBanner
         navigation={navigation}
        />
        <OfferCards
          imgSource={localImage.cardio_banner}
          header={'Cardio Point'}
          text1={'Cardio point'}
          text1Color={AppColor.WHITE}
          text2={'Lorem Ipsum is simply dummy text of the printing'}
          text3={'20 coins'}
          coinTextColor={AppColor.YELLOW}
        />
        <OfferCards
          imgSource={localImage.reffer_banner}
          header={'Refer and earn'}
          text1={'Refer and earn'}
          text1Color={AppColor.BLACK}
          text2={'Lorem Ipsum is simply dummy text of the printing'}
          text3={'20 coins'}
          coinTextColor={AppColor.BLACK}
          onPress={()=>navigation.navigate("Referral")}
        />
        <OfferCards
          imgSource={localImage.breathe_banner}
          header={'Breathe in and out'}
          text1={'Breathe in and out'}
          text1Color={AppColor.WHITE}
          text2={'Lorem Ipsum is simply dummy text of the printing'}
          text3={'20 coins'}
          coinTextColor={AppColor.WHITE}
          bannerType={'breathe'}
        />
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColor.GRAY,
  },
});
export default OfferPage;
