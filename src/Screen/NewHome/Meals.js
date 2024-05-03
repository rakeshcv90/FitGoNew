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
import React, {useEffect, useMemo, useState} from 'react';
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
const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const Meals = ({navigation}) => {
  const [selectedMeal, setSelectedMeal] = useState(null);
  const mealData = useSelector(state => state.mealData);
  const [isLoading, setIsLoading] = useState(true);
  const [imageLoad, setImageLoad] = useState(true);
  const avatarRef = React.createRef();
  const [itemData, setItemData] = useState();
  const getFitmeMealAdsCount = useSelector(state => state.getFitmeMealAdsCount);
  const getPurchaseHistory = useSelector(state => state.getPurchaseHistory);
  const getStoreVideoLoc = useSelector(state => state.getStoreVideoLoc);
  const {initInterstitial, showInterstitialAd} = MyInterstitialAd();
  const dispatch = useDispatch();

  const generateRandomNumber = useMemo(() => {
    return () => {
      if (mealData.length > 0) {
        const min = 1;
        const max = mealData.length;
        const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

        const filteredMeals = mealData.filter(
          (item, index) => index + 1 === randomNumber,
        );

        if (filteredMeals.length > 0) {
          setSelectedMeal(filteredMeals[0]);
        }
      }
    };
  }, [mealData]);
  useEffect(() => {
    generateRandomNumber();
  }, [generateRandomNumber]);
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
  const resetFitmeCount = async () => {
    dispatch(setFitmeMealAdsCount(0));
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
        console.log('ImageExists', videoExists, filePath);
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
  return (
    <View style={styles.container}>
      <NewHeader header={'Meals'} SearchButton={false} backButton={true} />
      <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />
      <View
        style={{
          width: '95%',
          alignSelf: 'center',
          top: -DeviceHeigth * 0.02,
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
        {selectedMeal && (
          <>
            <View style={[styles.meditionBox, {marginVertical: 10}]}>
              {/* {isLoading && (
              <ShimmerPlaceholder
                style={{width: '100%', height: '100%', borderRadius: 15}}
                ref={avatarRef}
                autoRun
              />
            )} */}
              <TouchableOpacity
                style={{width: '100%', height: '100%', borderRadius: 15}}
                onPress={() => {
                  navigation.navigate('MealDetails', {item: selectedMeal});
                }}>
                <Image
                  style={{width: '100%', height: '100%', borderRadius: 15}}
                  resizeMode="cover"
                  // onLoad={() => setIsLoading(false)}
                  source={
                    selectedMeal.diet_image_link == null
                      ? localImage.Noimage
                      : {uri: selectedMeal.diet_image_link}
                  }></Image>
              </TouchableOpacity>
            </View>
            <View
              style={{
                width: '95%',
                alignSelf: 'center',
                top: DeviceHeigth * 0.02,
              }}>
              <Text
                style={{
                  color: AppColor.BLACK,
                  fontFamily: 'Montserrat-SemiBold',
                  fontWeight: '700',
                  lineHeight: 21,
                  fontSize: 14,
                  justifyContent: 'flex-start',
                }}>
                {selectedMeal.diet_title}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                top: DeviceHeigth * 0.03,
                width: '95%',
                alignSelf: 'center',
              }}>
              <View
                style={{
                  flexDirection: 'row',

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
                    marginHorizontal: 5,
                  }}>
                  {selectedMeal.diet_calories} kcal
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  marginHorizontal: DeviceWidth * 0.07,
                  alignSelf: 'center',
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
                  {selectedMeal.diet_time}
                </Text>
              </View>
            </View>
            <View
              style={{
                width: '95%',
                alignSelf: 'center',
                top: DeviceHeigth * 0.06,
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
                Recipes
              </Text>
            </View>
          </>
        )}
      </View>

      <View
        style={{
          top: DeviceHeigth * 0.05,
          alignSelf: 'center',
          height: DeviceHeigth * 0.48,
          width: '100%',
          alignItems: 'center',
          paddingBottom: Platform.OS == 'android' ? 50 : 50,
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
                    //
                    setItemData(item);
                    checkMealAddCount(item);
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

                  <Text
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
      <BannerAdd bannerAdId={bannerAdId} />
    </View>
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
    // height: DeviceWidth * 0.25,
    marginHorizontal: 12,
    top: 10,
    borderRadius: 10,
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
    backgroundColor: AppColor.WHITE,
    marginBottom: 20,
    shadowColor: 'rgba(0, 0, 0, 1)',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
});
export default Meals;
