import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {AppColor, PLATFORM_IOS} from './Color';
import {ADS_IDs, ADS_IOS, adUnitIDs, adUnitIDsTest} from './AdsId';
import MobileAds, {
  NativeAd,
  NativeAdEventType,
  NativeAdView,
  NativeAsset,
  NativeAssetType,
} from 'react-native-google-mobile-ads';
import AnimatedLottieView from 'lottie-react-native';
import {DeviceHeigth, DeviceWidth} from './Config';
import {MediaView} from './MediaView';

type Props = {
  type: 'image' | 'video';
  media?: boolean;
};

const NativeAdsView = ({type, media = false}: Props) => {
  const [aspectRatio, setAspectRatio] = useState(1.5);
  const [loading, setLoading] = useState(true);
  const [nativeAd, setNativeAd] = useState<NativeAd | null>(null);

  const DeviceID = useSelector((state: any) => state.getDeviceID);
  const getUserDataDetails = useSelector(
    (state: any) => state.getUserDataDetails,
  );

  const IsTesting = __DEV__
    ? true
    : PLATFORM_IOS
    ? getUserDataDetails?.social_id != null &&
      ADS_IOS.includes(getUserDataDetails?.social_id)
    : DeviceID != '' && ADS_IDs.includes(DeviceID);

  const NativeID =
    type === 'image'
      ? IsTesting
        ? adUnitIDsTest.image
        : adUnitIDs.image
      : IsTesting
      ? adUnitIDsTest.video
      : adUnitIDs.video;

  useEffect(() => {
    NativeAd.createForAdRequest(NativeID)
      .then((ad: NativeAd) => {
        console.log(ad);
        setNativeAd(ad);
        setAspectRatio(ad.mediaContent?.aspectRatio || 1.5);
        setLoading(false);
      })
      .catch(error => {
        console.error('Failed to load native ad', error);
        setLoading(false);
      });
    return () => nativeAd?.destroy();
  }, [NativeID]);

  useEffect(() => {
    nativeAd?.addAdEventListener(NativeAdEventType.CLICKED, () => {
      console.log('click')
    });
    nativeAd?.addAdEventListener(NativeAdEventType.CLOSED, () => {});
    nativeAd?.addAdEventListener(NativeAdEventType.OPENED, () => {});
    nativeAd?.addAdEventListener(NativeAdEventType.IMPRESSION, () => {});
    // Inspector()
  }, []);

  const Inspector = async () => {
    try {
      await MobileAds().initialize();
      const ad = MobileAds().openAdInspector();
      console.log(ad);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {loading && (
        <View style={styles.loaderContainer}>
          <AnimatedLottieView
            source={require('../Icon/Images/NewImage2/Adloader.json')}
            speed={2}
            autoPlay
            loop
            style={styles.loader}
          />
        </View>
      )}

      {nativeAd && (
        <NativeAdView nativeAd={nativeAd} style={styles.adContainer}>
          <View style={styles.adContent}>
            {nativeAd.icon && (
              <NativeAsset assetType={NativeAssetType.ICON}>
                <Image
                  style={styles.adIcon}
                  source={{uri: nativeAd.icon.url}}
                />
              </NativeAsset>
            )}
            <View style={styles.textContainer}>
              <NativeAsset assetType={NativeAssetType.HEADLINE}>
                <Text style={styles.adTitle}>{nativeAd.headline}</Text>
              </NativeAsset>
              <NativeAsset assetType={NativeAssetType.BODY}>
                <Text style={styles.adDescription}>{nativeAd.body}</Text>
              </NativeAsset>
              <NativeAsset assetType={NativeAssetType.STORE}>
                <Text style={styles.adRating}>
                  {nativeAd.store + ' '}
                  <NativeAsset assetType={NativeAssetType.ADVERTISER}>
                    <Text style={styles.adPrice}>{nativeAd.advertiser}</Text>
                  </NativeAsset>
                </Text>
              </NativeAsset>
              <View style={styles.row}>
                <NativeAsset assetType={NativeAssetType.STAR_RATING}>
                  <Text style={styles.adRating}>
                    ⭐ {nativeAd.starRating + ' '}
                    <NativeAsset assetType={NativeAssetType.PRICE}>
                      <Text style={styles.adPrice}>{nativeAd.price}</Text>
                    </NativeAsset>
                  </Text>
                </NativeAsset>

                <NativeAsset assetType={NativeAssetType.CALL_TO_ACTION}>
                    <Text style={{color: AppColor.WHITE,
                      padding: 7,
                      backgroundColor: '#4284f3',
                      paddingHorizontal: 20,
                      borderRadius: 5,}}>
                      {nativeAd.callToAction}
                    </Text>
                </NativeAsset>
              </View>
            </View>
          </View>

          {nativeAd.mediaContent && media && (
            // <NativeMediaView resizeMode={'contain'} style={{aspectRatio}} />
            <MediaView />
          )}
        </NativeAdView>
      )}
    </>
  );
};

export default NativeAdsView;

const styles = StyleSheet.create({
  loaderContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  loader: {
    width: DeviceWidth * 0.3,
    height: DeviceHeigth * 0.09,
  },
  adContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 10,
  },
  adContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 20,
  },
  adIcon: {
    width: 80,
    height: 80,
    marginRight: 20,
  },
  textContainer: {
    width: '80%',
  },
  adTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  adDescription: {
    color: 'black',
  },
  adRating: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  adPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  advertiser: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
});
