import {StyleSheet, View, Platform, ScrollView, TouchableOpacity} from 'react-native';
import React, {useState, useRef} from 'react';
import Animated, {
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {AppColor} from '../../Component/Color';
import {DeviceWidth} from '../../Component/Config';
import {useSelector} from 'react-redux';
import NewBanner from '../../Component/NewHomeUtilities/NewBanner';

type Props = {
  loader: boolean;
};

const NativeAdBanner = ({loader}: Props) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scale = useSharedValue(1);

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

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  return (
    <Animated.View entering={FadeInUp.duration(550).springify()} style={styles.outerWrap}>
      <Animated.View style={[styles.container, animatedStyle]}>
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
        </ScrollView>
      </Animated.View>
    </Animated.View>
  );
};

export default NativeAdBanner;

const styles = StyleSheet.create({
  outerWrap: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
    alignItems: 'center',
  },
  container: {
    borderRadius: 24,
    width: DeviceWidth * 0.92,
    alignSelf: 'center',
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 6},
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
});
