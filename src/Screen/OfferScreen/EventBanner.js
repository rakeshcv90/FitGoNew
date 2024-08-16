import {View, Text, ImageBackground, StyleSheet} from 'react-native';
import React from 'react';
import {localImage} from '../../Component/Image';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import NewButton from '../../Component/NewButton';
import {AppColor} from '../../Component/Color';
import {useSelector} from 'react-redux';
import moment from 'moment';

const EventBanner = React.memo(({navigation}) => {
  const enteredUpcomingEvent = useSelector(
    state => state?.enteredUpcomingEvent,
  );
  const enteredCurrentEvent = useSelector(state => state?.enteredCurrentEvent);
  const getPurchaseHistory=useSelector(state=>state?.getPurchaseHistory);
  const dayLeft =
  getPurchaseHistory?.upcoming_day_status == 1 &&
  getPurchaseHistory?.event_start_date_upcoming != null
    ? getPurchaseHistory?.event_start_date_upcoming
    : getPurchaseHistory?.event_start_date_current;
  return (
    <View style={styles.container}>
      <ImageBackground
        source={
          enteredUpcomingEvent
            ? localImage.event_banner2
            : localImage.event_banner1
        }
        style={styles.imgbackground}
        resizeMode="stretch">
        <NewButton
          position={'absolute'}
          bottom={DeviceHeigth * 0.024}
          pV={13}
          buttonColor={AppColor.WHITE}
          disabled={enteredUpcomingEvent}
          ButtonWidth={DeviceWidth * 0.8}
          titleColor={AppColor.BLACK}
          title={enteredUpcomingEvent ? `${ 
             getPurchaseHistory?.upcoming_day_status == 1
            ? `${moment(dayLeft).diff(
                moment()
                  .day(getPurchaseHistory?.currentDay)
                  .format('YYYY-MM-DD'),
                'days',
              )} days left`
            : `${moment(dayLeft)
                .add(7, 'days')
                .diff(
                  moment()
                    .day(getPurchaseHistory?.currentDay)
                    .format('YYYY-MM-DD'),
                  'days',
                )} days left`}` : `Join Event`}
          fontFamily={'Helvetica-Bold'}
          svgArrowRight={!enteredCurrentEvent}
          iconSize={18}
          onPress={() => {
            if (enteredCurrentEvent) {
              navigation.navigate('UpcomingEvent',{});
            } else {
              navigation.navigate('NewSubscription',{upgrade:false});
            }
          }}
        />
      </ImageBackground>
    </View>
  );
});
const styles = StyleSheet.create({
  container: {
    width: DeviceWidth * 0.95,
    height: DeviceHeigth * 0.37,
    alignSelf: 'center',
    top: -DeviceHeigth * 0.16,
  },
  imgbackground: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default EventBanner;
