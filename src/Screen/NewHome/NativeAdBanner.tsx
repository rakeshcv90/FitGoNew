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

type Props = {
  loader: boolean;
};


const NativeAdBanner = ({loader}: Props) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <ImageBackground
      source={require('./BG.png')}
      resizeMode="cover"
      style={{padding: 20}}>
      <View style={styles.container}>
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
          <View style={[styles.page, {width: DeviceWidth, padding: 10}]}>
            <FitText
              type="SubHeading"
              marginHorizontal={10}
              fontWeight="700"
              value="Daily Progress"
            />
            <FitText
              type="normal"
              marginHorizontal={10}
              value="Check your daily progress report"
            />
          </View>
          <View style={[styles.page, {width: DeviceWidth}]}>
            <NativeAdsView width={'90%'} media={false} type="image" />
          </View>
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
    </ImageBackground>
  );
};

export default NativeAdBanner;

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    backgroundColor: AppColor.WHITE,
    // padding: 10,
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
