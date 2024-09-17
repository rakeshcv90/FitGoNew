import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  DeviceEventEmitter,
  Platform,
  Text,
  View,
} from 'react-native';
import NativeAdView, {
  AdvertiserView,
  CallToActionView,
  HeadlineView,
  IconView,
  StarRatingView,
  StoreView,
  TaglineView,
} from 'react-native-admob-native-ads';
import {MediaView} from './MediaView';
import {ADS_IDs, ADS_IOS, adUnitIDs, adUnitIDsTest} from './AdsId';
import AnimatedLottieView from 'lottie-react-native';
import {DeviceHeigth, DeviceWidth} from './Config';
import {AppColor, PLATFORM_IOS} from './Color';
import {useSelector} from 'react-redux';
// import {adUnitIDs} from './utils';

const NativeAddTest = ({media, type}) => {
  const [aspectRatio, setAspectRatio] = useState(1.5);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [imageData, setImageData] = useState(null);
  const [headlineData, setHeadlineData] = useState(null);
  const nativeAdRef = useRef();
  const adLoadedRef = useRef(false); // Track ad loading state
  const DeviceID = useSelector(state => state.getDeviceID);
  const getUserDataDetails = useSelector(state => state.getUserDataDetails);
  
  const IsTesting = PLATFORM_IOS
    ? getUserDataDetails?.social_id != null &&
      ADS_IOS.includes(getUserDataDetails?.social_id)
    : DeviceID != '' && ADS_IDs.includes(DeviceID);

  const onAdFailedToLoad = event => {
    setError(true);
    setLoading(false);
  };

  const onAdLoaded = () => {};

  const onAdClicked = () => {};

  const onAdImpression = () => {};

  const onNativeAdLoaded = event => {
    setLoading(false);
    setLoaded(true);
    setError(false);
    setAspectRatio(event.aspectRatio);
    setImageData(event.icon);
    setHeadlineData(event.headline.split(':'));
    adLoadedRef.current = true; // Mark ad as loaded
    console.log('NATIVE LOADED');
  };

  const onAdLeftApplication = () => {};

  useEffect(() => {
    if (!adLoadedRef.current && nativeAdRef.current) {
      setLoading(true);
      nativeAdRef.current.loadAd(); // Only load the ad once
      console.log('NATIVE AD LOADED');
    }
  }, []);

  return (
    <NativeAdView
      ref={nativeAdRef}
      onAdLoaded={onAdLoaded}
      onAdFailedToLoad={onAdFailedToLoad}
      onAdLeftApplication={onAdLeftApplication}
      onAdClicked={onAdClicked}
      onAdImpression={onAdImpression}
      onNativeAdLoaded={onNativeAdLoaded}
      refreshInterval={60000 * 2}
      style={{
        width: '100%',
        alignSelf: 'center',
        backgroundColor: '#fff',
      }}
      videoOptions={{
        customControlsRequested: true,
      }}
      mediationOptions={{
        nativeBanner: true,
      }}
      adUnitID={
        type === 'image'
          ? IsTesting
            ? adUnitIDsTest.image
            : adUnitIDs.image
          : IsTesting
          ? adUnitIDsTest.video
          : adUnitIDs.video
      } // REPLACE WITH NATIVE_AD_VIDEO_ID for video ads.
      //   repository={type === 'image' ? 'imageAd' : 'videoAd'}
    >
      <View
        style={{
          width: '100%',
          alignItems: 'center',
          backgroundColor: '#fff',
          marginVertical: 10
        }}>
        <View
          style={{
            // width: '100%',
            // height: '100%',
            // backgroundColor: '#f0f0f0',
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: !loading && !error && loaded ? 0 : 1,
            zIndex: !loading && !error && loaded ? 10 : 10,
          }}>
          {!loading && (
            <AnimatedLottieView
              // source={{
              //   uri: 'https://assets7.lottiefiles.com/packages/lf20_qgq2nqsy.json',
              // }} // Replace with your animation file
              source={require('../Icon/Images/NewImage2/Adloader.json')}
              speed={2}
              autoPlay
              loop
              style={{
                width: DeviceWidth * 0.3,
                height: DeviceHeigth * 0.09,
                top: -10,
              }}
            />
          )}
          {/* {error && (
            <Text style={{color: '#a9a9a9', fontSize: 17}}>loading</Text>
          )} */}
        </View>

        <View
          style={{
            // height: 100,
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 10,
            opacity: loading || error || !loaded ? 0 : 1,
            maxWidth: '100%',
          }}>
          {imageData && (
            <IconView
              style={{
                width: 60,
                height: 60,
              }}
              adIcon={imageData}
            />
          )}

          <View
            style={{
              paddingHorizontal: 6,
              flexShrink: 1,
            }}>
            <HeadlineView
              style={{
                fontWeight: 'bold',
                fontSize: 13,
                color: 'black',
              }}
            />

            {headlineData && (
              <Text style={{fontSize: 16, fontWeight: 'bold', color: 'black'}}>
                {headlineData[1]}
              </Text>
            )}
            <TaglineView
              numberOfLines={2}
              style={{
                fontSize: 11,
                color: 'black',
              }}
            />
            <AdvertiserView
              style={{
                fontSize: 10,
                color: 'gray',
              }}
            />

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <StoreView
                style={{
                  fontSize: 12,
                  color: 'black',
                }}
              />
              <StarRatingView
                starSize={12}
                fullStarColor="orange"
                emptyStarColor="gray"
                style={{
                  width: 65,
                  marginLeft: 10,
                }}
              />
            </View>
          </View>

          <CallToActionView
            style={[
              {
                minHeight: 45,
                paddingHorizontal: 12,
                justifyContent: 'center',
                alignItems: 'center',
                elevation: 10,
                maxWidth: 100,
                width: 80,
              },
              Platform.OS === 'ios'
                ? {
                    backgroundColor: '#FFA500',
                    borderRadius: 10,
                  }
                : {},
            ]}
            buttonAndroidStyle={{
              backgroundColor: AppColor.RED,
              borderRadius: 8,
            }}
            allCaps
            textStyle={{
              fontSize: 13,
              flexWrap: 'wrap',
              textAlign: 'center',
              color: 'white',
            }}
          />
        </View>
        {media ? <MediaView aspectRatio={aspectRatio} /> : null}
      </View>
    </NativeAdView>
  );
};

export default NativeAddTest;
