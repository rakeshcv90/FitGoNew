import {View, Text, StatusBar, StyleSheet, FlatList, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import {AppColor, Fonts} from '../../Component/Color';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import FitText from '../../Component/Utilities/FitText';
import {TouchableOpacity} from 'react-native';
import {localImage} from '../../Component/Image';
import {BannerAdd, MyInterstitialAd} from '../../Component/BannerAdd';
import {bannerAdId} from '../../Component/AdsId';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {AddCountFunction} from '../../Component/Utilities/AddCountFunction';
import {useSelector} from 'react-redux';

const NewMealList = ({navigation, route}) => {
  const {showInterstitialAd} = MyInterstitialAd();
  const getDietFilterData = useSelector(state => state?.getDietFilterData);
  const mealData = useSelector(state => state.mealData);
  const [filterMealList, setFilterMealList] = useState(route?.params?.data)
  const checkMealAddCount = item => {
    let checkAdsShow = AddCountFunction();

    if (checkAdsShow == true) {
      showInterstitialAd();
      navigation.navigate('MealDetails', {item: item});
    } else {
      navigation.navigate('MealDetails', {item: item});
    }
  };
  useEffect(() => {
    updateFilteredCategories(getDietFilterData);
  }, [getDietFilterData]);

  const updateFilteredCategories = test => {
    let filteredItems = [];
    if (test == -1) {
      setFilterMealList(route?.params?.data);
    } else if (test == 0) {
      filteredItems = (route?.params?.data).filter(
        item => item?.meal_type.toLowerCase() == 'veg',
      );

      setFilterMealList(filteredItems);
    } else {
      filteredItems = (route?.params?.data).filter(
        item => item?.meal_type.toLowerCase() == 'non_veg',
      );

      setFilterMealList(filteredItems);
    }
  };

  const emptyComponent = () => {
    return (
      <View
        style={{
          flex: 1,

          alignItems: 'center',
        }}>
        <Image
          source={localImage.NoMeal}
          resizeMode="contain"
          style={{
            width: DeviceWidth * 0.7,
            height: DeviceHeigth * 0.3,

            marginTop: DeviceHeigth * 0.07,
          }}
        />
        <View
          style={{
            width: DeviceWidth,
            alignItems: 'center',
            marginTop: DeviceHeigth * 0.02,
          }}>
          <Text
            style={{
              color: '#1E1E1E',
              fontSize: 18,
              fontWeight: '700',
              lineHeight: 26,
              fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
            }}>
            No Meal Available !
          </Text>
        </View>
        <View
          style={{
            width: DeviceWidth,
            alignItems: 'center',
            zIndex: -1,
            marginVertical: 15,
          }}>
          <Text
            style={{
              color: '#333333',
              fontSize: 14,
              fontWeight: '400',
              lineHeight: 16,
              opacity: 0.6,
              fontFamily: Fonts.MONTSERRAT_MEDIUM,
            }}>
            No meals available right now.
          </Text>
          <Text
            style={{
              color: '#333333',
              fontSize: 14,
              fontWeight: '400',
              lineHeight: 30,
              opacity: 0.6,
              fontFamily: Fonts.MONTSERRAT_MEDIUM,
            }}>
           Check back later for healthier options!
          </Text>
         
        </View>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      {filterMealList?.length > 0 && (
      <View
        style={{
          width: '95%',
          alignSelf: 'center',
          marginVertical: DeviceHeigth * 0.02,
        }}>
        <FitText
          type="Heading"
          value={'Top Recipes'}
          fontWeight="700"
          fontSize={16}
          lineHeight={24}
          color={AppColor.LITELTEXTCOLOR}
          fontFamily={Fonts.MONTSERRAT_REGULAR}
        />
      </View>)}
      <View
        style={{
          flex: 9,

          alignSelf: 'center',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <FlatList
          data={filterMealList}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 20}}
          ListEmptyComponent={emptyComponent}
          renderItem={({item, index}) => {
            return (
              <TouchableOpacity
                style={styles.listItem2}
                onPress={() => {
                  checkMealAddCount(item);
                }}>
                <View
                  style={{
                    height: 100,
                    width: 100,
                    alignItems: 'center',
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
                    defaultSource={localImage?.NOWORKOUT}
                    style={{
                      height: 100,
                      width: 100,
                      borderRadius: 200 / 2,

                      alignSelf: 'center',
                    }}
                    resizeMode="cover"></Image>
                </View>
                <View
                  style={{
                    marginVertical: 10,
                    alignSelf: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 120,
                  }}>
                  <FitText
                    type="SubHeading"
                    value={item?.diet_title}
                    fontWeight="700"
                    fontSize={14}
                    lineHeight={24}
                    color={AppColor.LITELTEXTCOLOR}
                    numberOfLines={1}
                    fontFamily={Fonts.MONTSERRAT_REGULAR}
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    alignSelf: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      alignSelf: 'center',
                      // justifyContent: 'space-between',
                    }}>
                    <Image
                      source={localImage.Step1}
                      style={{width: 20, height: 20, marginHorizontal: 5}}
                      resizeMode="contain"
                      tintColor={AppColor.RED}
                    />
                    <Text
                      style={{
                        fontFamily: 'Montserrat-SemiBold',
                        fontSize: 13,
                        fontWeight: '500',
                        color: AppColor.BLACK,
                        marginHorizontal: 2,
                        opacity: 0.7,
                      }}>
                      {item?.diet_calories} kcal
                    </Text>
                  </View>
                  <View
                    style={{
                      width: 2,
                      height: 20,
                      backgroundColor: '#333333',
                      opacity:0.6,
                      marginHorizontal: 5,
                    }}
                  />
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      alignSelf: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <Image
                      source={localImage.Watch}
                      style={{width: 15, height: 15}}
                      resizeMode="contain"
                      tintColor={AppColor.RED}
                    />
                    <Text
                      style={{
                        fontFamily: 'Montserrat-SemiBold',
                        fontSize: 13,
                        fontWeight: '500',
                        color: AppColor.BLACK,
                        marginHorizontal: 2,
                        opacity: 0.7,
                      }}>
                      {item?.diet_time}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
        {filterMealList?.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              const allMealList = [
                ...mealData?.breakfast,
                ...mealData?.lunch,
                ...mealData?.dinner,
              ];
              navigation.navigate('CustomMealList', {
                totalMealData: allMealList,
              });
            }}
            style={{
              width: 50,
              height: 50,
              borderRadius: 100 / 2,
              backgroundColor: 'red',
              position: 'absolute',
              bottom: DeviceHeigth >= 1024 ? 15 : 10,
              right: 0,
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: 'rgba(0, 0, 0, 1)',
              ...Platform.select({
                ios: {
                  shadowColor: '#000000',
                  shadowOffset: {width: 0, height: 2},
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                },
                android: {
                  elevation: 10,
                },
              }),
            }}>
            <Icons name={'plus'} size={35} color={AppColor.WHITE} />
          </TouchableOpacity>
        )}
      </View>
      <View
        style={{
          flex: 1,
          backgroundColor: 'transparent',
          justifyContent: 'flex-end',
        }}>
        <BannerAdd bannerAdId={bannerAdId} />
      </View>
    </View>
  );
};
var styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: AppColor.WHITE,
  },

  listItem2: {
    width: DeviceWidth * 0.45,
    marginHorizontal: 5,
    marginVertical: 5,
    borderRadius: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    marginBottom: 5,
    padding: 15,
  },
});
export default NewMealList;
