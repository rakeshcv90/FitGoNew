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
import {adUnitIDs} from './utils';

const NativeAddTest = ({media, type}) => {
  const [aspectRatio, setAspectRatio] = useState(1.5);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [imageData, setImageData] = useState(null);
  const [headlineData, setHeadlineData] = useState(null);
  const nativeAdRef = useRef();
  const onAdFailedToLoad = event => {
    setError(true);
    setLoading(false);

    // console.log('AD', 'FAILED', event.message);
  };

  const onAdLoaded = () => {
    //console.log('AD', 'LOADED', 'Ad has loaded successfully');
  };

  const onAdClicked = () => {
    //console.log('AD', 'CLICK', 'User has clicked the Ad');
  };

  const onAdImpression = () => {
    //console.log('AD', 'IMPRESSION', 'Ad impression recorded');
  };

  const onNativeAdLoaded = event => {
    setLoading(false);
    setLoaded(true);
    setError(false);
    setAspectRatio(event.aspectRatio);
    setImageData(event.icon);
    setHeadlineData(event.headline.split(':'));
  };

  const onAdLeftApplication = () => {
    console.log('AD', 'LEFT', 'Ad left application');
  };

  useEffect(() => {
    nativeAdRef.current?.loadAd();
    // if (!loaded) {

    // } else {
    //   console.log('AD', 'LOADED ALREADY');
    // }
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
      }}
      videoOptions={{
        customControlsRequested: true,
      }}
      mediationOptions={{
        nativeBanner: true,
      }}
      adUnitID={type === 'image' ? adUnitIDs.image : adUnitIDs.video} // REPLACE WITH NATIVE_AD_VIDEO_ID for video ads.
      //   repository={type === 'image' ? 'imageAd' : 'videoAd'}
    >
      <View
        style={{
          width: '100%',
          alignItems: 'center',
        }}>
        <View
          style={{
            // width: '100%',
            // height: '100%',
            backgroundColor: '#f0f0f0',
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: !loading && !error && loaded ? 0 : 1,
            zIndex: !loading && !error && loaded ? 0 : 10,
          }}>
          {!loading && <ActivityIndicator size={28} color="#a9a9a9" />}
          {error && <Text style={{color: '#a9a9a9'}}>loading</Text>}
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
              backgroundColor: '#FFA500',
              borderRadius: 10,
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
