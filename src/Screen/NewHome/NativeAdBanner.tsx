import {Image, ImageBackground, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {AppColor} from '../../Component/Color';
import PredefinedStyles from '../../Component/Utilities/PredefineStyles';
import FitText from '../../Component/Utilities/FitText';
import {ScrollView} from 'react-native';
import {DeviceWidth} from '../../Component/Config';
import NativeAddTest from '../../Component/NativeAddTest';
import {API_CALLS} from '../../API/API_CALLS';
import {useSelector} from 'react-redux';
import NativeAdsView from '../../Component/NativeAd';
import {useIsFocused} from '@react-navigation/native';
import NewBanner from '../../Component/NewHomeUtilities/NewBanner';

type Props = {
  loader: boolean;
};

const NativeAdBanner = ({loader}: Props) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const enteredCurrentEvent = useSelector(
    (state: any) => state?.enteredCurrentEvent,
  );
  const getUserDataDetails = useSelector(
    (state: any) => state?.getUserDataDetails,
  );
  const enteredUpcomingEvent = useSelector(
    (state: any) => state?.enteredUpcomingEvent,
  );
  const getPurchaseHistory = useSelector(
    (state: any) => state.getPurchaseHistory,
  );
  const Sat = getPurchaseHistory?.currentDay == 6;
  const Sun = getPurchaseHistory?.currentDay == 0;

  return (
    <View style={{padding: 20}}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: currentIndex == 1 ? AppColor.WHITE : 'transparent',
            borderRadius: 20,
          },
        ]}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={event => {
            const newIndex = Math.round(
              event.nativeEvent.contentOffset.x / DeviceWidth,
            );
            setCurrentIndex(newIndex);
          }}
          scrollEventThrottle={16}>
          <NewBanner
            purchaseHistory={getPurchaseHistory}
            userDetails={getUserDataDetails}
            setLocation={() => {}}
            Sat={Sat}
            Sun={Sun}
            enteredCurrentEvent={enteredCurrentEvent}
            enteredUpcomingEvent={enteredUpcomingEvent}
          />
          <NativeAdsView
            width={DeviceWidth * 0.95}
            media={false}
            type="image"
          />
        </ScrollView>
      </View>
      <View style={[PredefinedStyles.rowCenter, {marginTop: 15}]}>
        {[1, 2].map(i => (
          <View
            style={[
              styles.box,
              {
                backgroundColor:
                  currentIndex == i - 1 ? AppColor.RED : '#D9D9D9',
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

export default NativeAdBanner;

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    height: DeviceWidth * 0.35,
    width: DeviceWidth * 0.9,
    overflow: 'hidden',
  },
  page: {
    justifyContent: 'center',
    // alignItems: 'center',
  },
  box: {
    width: 10,
    height: 10,
    borderRadius: 10,
    marginHorizontal: 2,
  },
});
