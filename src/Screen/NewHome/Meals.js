import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  FlatList,
  Platform,
  StatusBar,
} from 'react-native';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import NewHeader from '../../Component/Headers/NewHeader';
import {AppColor, Fonts} from '../../Component/Color';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import {Image} from 'react-native';
import {localImage} from '../../Component/Image';
import {useDispatch, useSelector} from 'react-redux';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import {BannerAdd, MyInterstitialAd} from '../../Component/BannerAdd';
import {
  setFitmeMealAdsCount,
  setVideoLocation,
} from '../../Component/ThemeRedux/Actions';
import moment from 'moment';
import axios from 'axios';
import RNFetchBlob from 'rn-fetch-blob';
import {bannerAdId} from '../../Component/AdsId';
import Carousel from 'react-native-snap-carousel';
import {Item} from 'react-native-paper/lib/typescript/components/Drawer/Drawer';
const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const Meals = ({navigation}) => {
  const [selectedMeal, setSelectedMeal] = useState(null);
  const mealData = useSelector(state => state.mealData);
  const [isLoading, setIsLoading] = useState(true);
  const [imageLoad, setImageLoad] = useState(true);
  const avatarRef = React.createRef();

  const getFitmeMealAdsCount = useSelector(state => state.getFitmeMealAdsCount);
  const getPurchaseHistory = useSelector(state => state.getPurchaseHistory);
  const getStoreVideoLoc = useSelector(state => state.getStoreVideoLoc);
  const {initInterstitial, showInterstitialAd} = MyInterstitialAd();
  const dispatch = useDispatch();
  const carouselRef = useRef(null);

  useEffect(() => {
    initInterstitial();
    mealData?.map((item, index) => downloadVideos(item, index));
  }, []);
  const checkMealAddCount = item => {
    if (getPurchaseHistory.length > 0) {
      if (
        getPurchaseHistory[0]?.plan_end_date >= moment().format('YYYY-MM-DD')
      ) {
        dispatch(setFitmeMealAdsCount(0));
        navigation.navigate('MealDetails', {item: item});
      } else {
        if (getFitmeMealAdsCount < 3) {
          dispatch(setFitmeMealAdsCount(getFitmeMealAdsCount + 1));
          navigation.navigate('MealDetails', {item: item});
        } else {
          showInterstitialAd();
          navigation.navigate('MealDetails', {item: item});
          dispatch(setFitmeMealAdsCount(0));
        }
      }
    } else {
      if (getFitmeMealAdsCount < 3) {
        dispatch(setFitmeMealAdsCount(getFitmeMealAdsCount + 1));
        navigation.navigate('MealDetails', {item: item});
      } else {
        showInterstitialAd();
        navigation.navigate('MealDetails', {item: item});
        dispatch(setFitmeMealAdsCount(0));
      }
    }
  };

  const sanitizeFileName = fileName => {
    fileName = fileName.replace(/\s+/g, '_');
    return fileName;
  };
  let StoringData = {};
  const downloadVideos = async (data, index) => {
    const filePath = `${RNFetchBlob.fs.dirs.CacheDir}/${sanitizeFileName(
      data?.diet_title,
    )}.jpg`;
    try {
      const videoExists = await RNFetchBlob.fs.exists(filePath);
      if (videoExists) {
        StoringData[data?.diet_title] = filePath;
      } else {
        await RNFetchBlob.config({
          fileCache: true,
          path: filePath,
          appendExt: '.jpg',
        })
          .fetch('GET', data?.diet_image, {
            'Content-Type': 'application/jpg',
          })
          .then(res => {
            StoringData[data?.diet_title] = res.path();
            console.log('Image downloaded successfully!', res.path());
          })
          .catch(err => {
            console.log(err);
          });
      }
    } catch (error) {
      console.log('ERRRR', error);
    }
    dispatch(setVideoLocation(StoringData));
  };

  const bannerAdsDisplay = () => {
    if (getPurchaseHistory.length > 0) {
      if (
        getPurchaseHistory[0]?.plan_end_date >= moment().format('YYYY-MM-DD')
      ) {
        return null;
      } else {
        return (
          <View style={{marginBottom: DeviceHeigth <= 846 ? -1 : -10}}>
            <BannerAdd bannerAdId={bannerAdId} />
          </View>
        );
      }
    } else {
      return (
        <View style={{marginBottom: DeviceHeigth <= 846 ? -1 : -10}}>
          <BannerAdd bannerAdId={bannerAdId} />
        </View>
      );
    }
  };
  const renderItem = ({item, index}) => {
    return (
      <View
        style={{
          borderRadius: 5,

          justifyContent: 'center',
          alignItems: 'center',
          width: 220,
          marginRight: 25,
        }}>
        <TouchableOpacity
          onPress={() => {
            checkMealAddCount(item);
          }}
          style={{
            width: 200,
            height: 150,
            borderRadius: 10,
            marginVertical: 10,
            //alignSelf:'center',
          }}>
          <Image
            source={{uri: item?.diet_image}}
            resizeMode="cover"
            style={{
              width: 200,
              height: 150,
              borderRadius: 10,
              marginVertical: 10,
              alignSelf: 'center',
            }}
          />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 18,
            fontWeight: '600',
            lineHeight: 27,
            fontFamily: 'Montserrat-SemiBold',
            textAlign: 'center',
            color: '#1E1E1E',
          }}>
          {item?.diet_title}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            top: DeviceHeigth * 0.01,
            width: '100%',
            marginBottom: 20,
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'center',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'center',

              alignItems: 'center',
            }}>
            <Image
              source={localImage.Step1}
              style={{width: 20, height: 20}}
              resizeMode="contain"
            />

            <Text
              style={{
                // fontFamily: 'Montserrat-SemiBold',
                fontSize: 13,
                fontWeight: '500',
                color: AppColor.BLACK,
              }}>
              {item?.diet_calories} kcal
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginLeft: 20,
              alignSelf: 'center',

              alignItems: 'center',
            }}>
            <Image
              source={localImage.Watch}
              style={{width: 17, height: 17}}
              resizeMode="contain"
            />

            <Text
              style={{
                // fontFamily: 'Montserrat-SemiBold',
                fontSize: 13,
                fontWeight: '500',
                color: AppColor.BLACK,
                marginHorizontal: 5,
              }}>
              {item?.diet_time}
            </Text>
          </View>
        </View>
      </View>
    );
  };
  return (
    <>
      <View style={styles.container}>
        <NewHeader header={'Meals'} SearchButton={false} backButton={true} />
        <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />
        <View
          style={{
            width: '95%',
            alignSelf: 'center',
            top: -20,
          }}>
          <Text
            style={{
              color: AppColor.HEADERTEXTCOLOR,
              fontFamily: Fonts.MONTSERRAT_BOLD,
              fontWeight: 'bold',
              lineHeight: 19.5,
              fontSize: 18,
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}>
            Top diet recipes
          </Text>

          <Carousel
            ref={carouselRef}
            layout={'default'}
            // horizontal

            keyExtractor={(_, index) => index.toString()}
            itemWidth={DeviceWidth * 0.63}
            sliderWidth={DeviceWidth}
            data={mealData}
            enableSnap
            renderItem={renderItem}
            firstItem={2}
          />
        </View>
        <View
          style={{
            width: '95%',
            alignSelf: 'center',
            top: -20,
          }}>
          <Text
            style={{
              color: AppColor.HEADERTEXTCOLOR,
              fontFamily: Fonts.MONTSERRAT_BOLD,
              fontWeight: 'bold',
              lineHeight: 19.5,
              fontSize: 18,
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}>
            Categories
          </Text>
        </View>
        <View
          style={{
            top: -DeviceHeigth * 0.015,
            alignSelf: 'center',

            width: '100%',
            alignItems: 'center',
            paddingBottom:
              Platform.OS == 'android'
                ? DeviceHeigth<=846?DeviceHeigth * 0.45:DeviceHeigth * 0.4
                : DeviceHeigth * 0.45,
          }}>
          <FlatList
            data={mealData}
            numColumns={3}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) => {
              return (
                <>
                  <TouchableOpacity
                    style={styles.listItem2}
                    onPress={() => {
                      checkMealAddCount(item);
                    }}>
                    <View
                      style={{
                        height: 100,
                        width: 110,
                        backgroundColor: '#F7F7F7',
                        justifyContent: 'center',
                        borderRadius: 10,
                      }}>
                      <Image
                        source={
                          item.diet_image == null
                            ? localImage.Noimage
                            : {
                                uri: item.diet_image,
                              }
                        }
                        style={{
                          height: 70,
                          width: 70,
                          borderRadius: 140 / 2,

                          alignSelf: 'center',
                        }}
                        resizeMode="cover"></Image>
                    </View>
                    <View
                      style={{
                        width: DeviceWidth * 0.2,
                        alignItems: 'center',
                        marginTop: 10,
                        justifyContent: 'center',
                      }}>
                      <Text
                        numberOfLines={1}
                        style={[
                          styles.title,
                          {
                            fontSize: 12,
                            fontWeight: '600',
                            lineHeight: 18,
                            fontFamily: 'Montserrat-SemiBold',
                            textAlign: 'center',
                            color: '#505050',
                            width: 100,
                          },
                        ]}>
                        {item?.diet_title}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </>
              );
            }}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            updateCellsBatchingPeriod={100}
            removeClippedSubviews={true}
          />
        </View>
      </View>
      {bannerAdsDisplay()}
    </>
  );
};
var styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: AppColor.WHITE,
  },
  meditionBox: {
    width: '98%',
    height: DeviceHeigth * 0.2,
    borderRadius: 15,
    alignSelf: 'center',
    alignItems: 'center',
  },
  listItem2: {
    width: DeviceWidth * 0.26,
    marginHorizontal: 12,
    top: 10,
    borderRadius: 10,
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: AppColor.WHITE,
    marginBottom: 10,
  },
});
export default Meals;
