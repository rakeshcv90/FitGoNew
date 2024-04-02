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
import {AppColor} from '../../Component/Color';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import {Image} from 'react-native';
import {localImage} from '../../Component/Image';
import {useDispatch, useSelector} from 'react-redux';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import {MyInterstitialAd} from '../../Component/BannerAdd';
import {setFitmeMealAdsCount} from '../../Component/ThemeRedux/Actions';
import moment from 'moment';
import axios from 'axios';
const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const Meals = ({navigation}) => {
  const [selectedMeal, setSelectedMeal] = useState(null);
  const mealData = useSelector(state => state.mealData);
  const [isLoading, setIsLoading] = useState(true);
  const [imageLoad, setImageLoad] = useState(true);
  const avatarRef = React.createRef();
  const [itemData, setItemData] = useState();
  const [data, setTSata] = useState();
  const getFitmeMealAdsCount = useSelector(state => state.getFitmeMealAdsCount);
  const getPurchaseHistory = useSelector(state => state.getPurchaseHistory);
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
          // setTimeout(() => {

          // }, 1200);
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
        // setTimeout(() => {

        // }, 1200);
      }
    }
  };
  useEffect(() => {
    TEAI();
  }, []);

  const TEAI = async () => {
    try {
      const res = await axios.post(
        'https://fitme.cvinfotech.in/adserver/public/api/get_categorie?version=1.14',
        {
          data: '',
        },
      );
      if (res.data) {
        setTSata(res.data?.diets);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const resetFitmeCount = async () => {
    dispatch(setFitmeMealAdsCount(0));
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
            color: AppColor.BoldText,
            fontFamily: 'Poppins',
            fontWeight: '700',
            lineHeight: 24,
            fontSize: 16,
            marginLeft: 20,
            justifyContent: 'flex-start',
          }}>
          Top diet recipes
        </Text>
      </View>
      {selectedMeal && (
        <>
          <View style={styles.meditionBox}>
            {isLoading && (
              <ShimmerPlaceholder
                style={{width: '100%', height: '100%', borderRadius: 15}}
                ref={avatarRef}
                autoRun
              />
            )}
            <Image
              style={{width: '100%', height: '100%', borderRadius: 15}}
              resizeMode="cover"
              onLoad={() => setIsLoading(false)}
              source={
                selectedMeal.diet_image_link == null
                  ? localImage.Noimage
                  : {uri: selectedMeal.diet_image_link}
              }></Image>
          </View>
          <View
            style={{
              width: '95%',
              alignSelf: 'center',
              top: DeviceHeigth * 0.02,
            }}>
            <Text
              style={{
                color: AppColor.BoldText,
                fontFamily: 'Poppins',
                fontWeight: '700',
                lineHeight: 24,
                fontSize: 16,
                marginLeft: 20,

                justifyContent: 'flex-start',
              }}>
              {selectedMeal.diet_title}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              top: DeviceHeigth * 0.03,
              width: '86%',
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
                  fontFamily: 'Poppins',
                  fontSize: 13,
                  fontWeight: '500',
                  color: AppColor.INPUTLABLECOLOR,
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
                  fontFamily: 'Poppins',
                  fontSize: 13,
                  fontWeight: '500',
                  color: AppColor.INPUTLABLECOLOR,
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
              top: DeviceHeigth * 0.07,
            }}>
            <Text
              style={{
                color: AppColor.BoldText,
                fontFamily: 'Poppins',
                fontWeight: '700',
                lineHeight: 24,
                fontSize: 16,
                marginLeft: 20,
                justifyContent: 'flex-start',
              }}>
              Categories
            </Text>
          </View>
        </>
      )}

      <View
        style={{
          top: DeviceHeigth * 0.085,
          alignSelf: 'center',
          height: DeviceHeigth * 0.4,

          paddingBottom: Platform.OS == 'android' ? 30 : 0,
        }}>
        <FlatList
          data={data}
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
                  {imageLoad && (
                    <ShimmerPlaceholder
                      style={{
                        height: 70,
                        width: 70,
                        borderRadius: 140 / 2,
                        alignSelf: 'center',
                      }}
                      ref={avatarRef}
                      autoRun
                    />
                  )}
                  <Image
                    source={
                      item.diet_image_link == null
                        ? localImage.Noimage
                        : {
                            uri:
                              index % 2 == 0
                                ? item.diet_image_link
                                : item.diet_image,
                          }
                    }
                    onLoad={() => setImageLoad(false)}
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
                        fontWeight: '500',
                        lineHeight: 18,
                        fontFamily: 'Poppins',
                        textAlign: 'center',
                        color: AppColor.BoldText,
                      },
                    ]}>
                    {index % 2 == 0 ? 'Other one' : 'CV SERVER'}
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
    </View>
  );
};
var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColor.WHITE,
  },
  meditionBox: {
    width: '86%',
    height: DeviceHeigth * 0.2,
    borderRadius: 15,
    alignSelf: 'center',
    alignItems: 'center',
  },
  listItem2: {
    width: DeviceWidth * 0.25,
    // height: DeviceWidth * 0.25,
    marginHorizontal: 10,
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
