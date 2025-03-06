import {
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {MyInterstitialAd} from '../../Component/BannerAdd';
import {useSelector} from 'react-redux';
import {AddCountFunction} from '../../Component/Utilities/AddCountFunction';
import {navigate} from '../../Component/Utilities/NavigationUtil';
import {localImage} from '../../Component/Image';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import {AppColor, Fonts} from '../../Component/Color';
import PredefinedStyles from '../../Component/Utilities/PredefineStyles';
import FitIcon from '../../Component/Utilities/FitIcon';
import FitText from '../../Component/Utilities/FitText';

type Item = {
  diet_calories: string;
  diet_carbs: string;
  diet_category: number;
  diet_description: string;
  diet_price: string;
  diet_protein: string;
  diet_servings: string;
  diet_status: string;
  diet_time: string;
  diet_title: string;
  meal_type: string;
  diet_fat: string;
  diet_featured: string;
  diet_image: string;
  diet_image_link: string;
  diet_id: number;
  diet_ingredients: string;
};

const MealList = ({data}: any) => {
  const {showInterstitialAd} = MyInterstitialAd();
  const getDietFilterData = useSelector(
    (state: any) => state?.getDietFilterData,
  );
  const mealData = useSelector((state: any) => state.mealData);
  const [filterMealList, setFilterMealList] = useState(data);
  const checkMealAddCount = (item: Item) => {
    let checkAdsShow = AddCountFunction();

    if (checkAdsShow == true) {
      showInterstitialAd();
      navigate('MealDetails', {item: item});
    } else {
      navigate('MealDetails', {item: item});
    }
  };
  useEffect(() => {
    updateFilteredCategories(getDietFilterData);
  }, [getDietFilterData]);

  const updateFilteredCategories = (test: number) => {
    let filteredItems = [];
    if (test == -1) {
      setFilterMealList(data);
    } else if (test == 0) {
      filteredItems = data.filter(
        (item: any) => item?.meal_type.toLowerCase() == 'veg',
      );

      setFilterMealList(filteredItems);
    } else {
      filteredItems = data.filter(
        (item: any) => item?.meal_type.toLowerCase() == 'non_veg',
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
    <View style={PredefinedStyles.FlexCenter}>
      <View style={{alignSelf: 'flex-start', marginLeft: 20}}>
        <FitText
          type="Heading"
          value="Top Recipies"
          fontSize={20}
          marginVertical={10}
        />
      </View>
      <FlatList
        data={filterMealList}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 20}}
        ListEmptyComponent={emptyComponent}
        renderItem={items => {
          const item: Item = items?.item;
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
                  lineHeight={20}
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
                    opacity: 0.6,
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
                  <FitIcon
                    name="clockcircle"
                    size={15}
                    type="AntDesign"
                    color={AppColor.RED}
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
            navigate('CustomMealList', {
              totalMealData: allMealList,
            });
          }}
          style={[
            PredefinedStyles.NormalCenter,
            PredefinedStyles.ShadowStyle,
            {
              width: 50,
              height: 50,
              borderRadius: 30 / 2,
              backgroundColor: '#F7F7F7',
              position: 'absolute',
              bottom: DeviceHeigth >= 1024 ? 15 : 30,
              right: 10,
            },
          ]}>
          <FitIcon
            type="MaterialCommunityIcons"
            name={'plus'}
            size={35}
            color={AppColor.RED}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default MealList;

const styles = StyleSheet.create({
  listItem2: {
    width: DeviceWidth * 0.45,
    height: DeviceWidth * 0.5,
    marginHorizontal: 7,
    marginVertical: 8,
    borderRadius: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColor.WHITE,

    padding: 15,
    ...PredefinedStyles.ShadowStyle,
  },
});
