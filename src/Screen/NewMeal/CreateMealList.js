import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';
import {AppColor, Fonts} from '../../Component/Color';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import FitText from '../../Component/Utilities/FitText';
import {Image} from 'react-native';
import {localImage} from '../../Component/Image';
import {BannerAdd} from '../../Component/BannerAdd';
import {bannerAdId} from '../../Component/AdsId';
import Icons from 'react-native-vector-icons/FontAwesome5';
const CreateMealList = () => {
  const getCustomDietData = useSelector(state => state.getCustomDietData);
  const mealData = useSelector(state => state.mealData);
  return (
    <View style={styles.container}>
      <View
        style={{
          flex: 9,

          alignSelf: 'center',
          // alignItems: 'center',
          justifyContent: 'center',
          marginVertical: DeviceHeigth * 0.02,
        }}>
        <FlatList
          data={getCustomDietData}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 20}}
          renderItem={({item, index}) => {
            return (
              <TouchableOpacity
                style={styles.listItem2}
                onPress={() => {
                  navigation.navigate('MealDetails', {item: item});
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
                      height: 90,
                      width: 90,
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
        {getCustomDietData?.length > 0 && (
          <View
            style={{
              width: DeviceWidth,
              height: 50,
              bottom: DeviceHeigth >= 1024 ? 15 : 10,
              justifyContent: 'center',
              alignItems: 'flex-end',
            }}>
            <TouchableOpacity
              onPress={() => {
                const allMealList = [
                  ...mealData?.breakfast,
                  ...mealData?.lunch,
                  ...mealData?.dinner,
                ];
                navigation.navigate('EditCustomMeal', {
                  totalMealData: allMealList,
                });
              }}
              style={{
                width: 50,
                height: 50,
                borderRadius: 100 / 2,
                backgroundColor: 'red',

                right: 5,
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
              <Icons name={'edit'} size={20} color={AppColor.WHITE} />
            </TouchableOpacity>
          </View>
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
export default CreateMealList;
