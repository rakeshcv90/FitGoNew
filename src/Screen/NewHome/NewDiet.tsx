import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Wrapper from '../WorkoutCompleteScreen/Wrapper';
import {AppColor, Fonts} from '../../Component/Color';
import NewHeader1 from '../../Component/Headers/NewHeader1';
import {goBack} from '../../Component/Utilities/NavigationUtil';
import {AnalyticsConsole} from '../../Component/AnalyticsConsole';
import {useDispatch, useSelector} from 'react-redux';
import {DeviceWidth} from '../../Component/Config';
import {localImage} from '../../Component/Image';
import FitText from '../../Component/Utilities/FitText';
import {setMealTypeData} from '../../Component/ThemeRedux/Actions';
import BottomSheet1 from '../../Component/BottomSheet';
import FitIcon from '../../Component/Utilities/FitIcon';
import PredefinedStyles from '../../Component/Utilities/PredefineStyles';
import MealList from './MealList';
import CreateMealList from '../NewMeal/CreateMealList';
import { BannerAdd } from '../../Component/BannerAdd';
import { bannerAdId } from '../../Component/AdsId';

const eatTime = ['Breakfast', 'Lunch', 'Dinner', 'Your meal'];

const NewDiet = () => {
  const getCustomDietData = useSelector(
    (state: any) => state.getCustomDietData,
  );
  const refStandard = useRef<any>();
  const mealData = useSelector((state: any) => state.mealData);
  const [showSearchButton, setShowSearchButton] = useState(true);
  const [selectedItem, setSelectedItem] = useState(0);

  useEffect(() => {
    setShowSearchButton(true);
  }, []);
  const meal_type = [
    {
      id: 1,
      title: 'Veg',
      ima: require('../../Icon/Images/InAppRewards/Veg.png'),
    },
    {
      id: 2,
      title: 'Non-Veg',
      ima: require('../../Icon/Images/InAppRewards/Nonveg.png'),
    },
  ];

  const BottomSheetContent = () => {
    const getDietFilterData = useSelector(
      (state: any) => state?.getDietFilterData,
    );
    const dispatch = useDispatch();
    const [selectedItem, setSelectedItem] = useState(getDietFilterData);
    return (
      <View style={styles.listContainer}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: DeviceWidth * 0.9,
            alignSelf: 'center',
            alignItems: 'center',
            // top: -10,
          }}>
          <View />
          <Text
            style={{
              fontSize: 16,
              fontWeight: '600',
              lineHeight: 24,
              fontFamily: Fonts.MONTSERRAT_BOLD,
              color: '#1E1E1E',
              marginLeft: DeviceWidth * 0.06,
            }}>
            Filter
          </Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              refStandard.current.closeSheet();
            }}>
            <FitIcon
              type="MaterialCommunityIcons"
              name={'close'}
              size={24}
              color={AppColor.BLACK}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            width: DeviceWidth,
            height: 1,
            backgroundColor: '#1E1E1E',
            opacity: 0.2,
            marginVertical: 16,
            alignSelf: 'center',
          }}
        />
        <Text
          style={{
            fontSize: 16,
            fontWeight: '600',
            lineHeight: 24,
            fontFamily: Fonts.MONTSERRAT_BOLD,
            color: '#1E1E1E',

            width: DeviceWidth * 0.9,
            alignSelf: 'center',
          }}>
          Food Categories
        </Text>
        <View
          style={{
            flex: 1,
            //height: DeviceHeigth * 0.35,
            marginTop: 20,
            justifyContent: 'center',
            width: DeviceWidth * 0.9,
            alignSelf: 'center',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          {meal_type.map((item: (typeof meal_type)[0], index) => {
            return (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setSelectedItem(index);
                }}
                style={{
                  marginHorizontal: 10,
                  // marginEnd: 20,
                  width: DeviceWidth / 2.4,
                  //height: 124,
                  justifyContent: 'center',
                  marginBottom: 20,
                  alignSelf: 'center',
                  backgroundColor: '#F9F9F9',
                  alignItems: 'center',
                  borderRadius: 10,
                  borderWidth: 1.5,
                  borderColor: selectedItem == index ? AppColor.RED : '#fff',
                }}>
                <View
                  style={{
                    width: 25,
                    height: 25,
                    top: 15,
                    left: 10,
                  }}
                />
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingBottom: 20,
                  }}>
                  <Image
                    source={item.ima}
                    // onLoad={() => setImageLoad(false)}
                    defaultSource={localImage?.NOWORKOUT}
                    style={{
                      width: 60,
                      height: 60,
                      top: -10,
                      justifyContent: 'center',
                      alignSelf: 'center',
                    }}
                    resizeMode="contain"
                  />
                  <FitText
                    type="SubHeading"
                    value={item?.title}
                    fontWeight="700"
                    fontSize={15}
                    lineHeight={20}
                    color={AppColor.BLACK}
                    fontFamily={Fonts.MONTSERRAT_REGULAR}
                  />
                </View>

                <View />
              </TouchableOpacity>
            );
          })}
        </View>
        <View
          style={{
            width: DeviceWidth,
            height: 1,
            backgroundColor: '#1E1E1E',
            opacity: 0.2,
            marginVertical: 10,
            alignSelf: 'center',
          }}
        />
        <View
          style={{
            width: DeviceWidth * 0.9,
            alignSelf: 'center',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <FitText
            type="normal"
            value="Clear All"
            color={AppColor.RED}
            fontSize={15}
            textDecorationLine="underline"
            onPress={() => {
              setSelectedItem(-1);
              dispatch(setMealTypeData(-1));
              refStandard.current.closeSheet();
            }}
          />

          <TouchableOpacity
            onPress={() => {
              dispatch(setMealTypeData(selectedItem));
              refStandard.current.closeSheet();
            }}
            style={{
              width: 150,
              height: 50,
              backgroundColor: AppColor.RED,
              borderRadius: 6,
              // alignSelf: 'flex-end',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: '#FFFFFF',
                fontSize: 14,
                fontWeight: '500',
                lineHeight: 20,

                textAlign: 'center',
                fontFamily: Fonts.MONTSERRAT_MEDIUM,
              }}>
              Show Result
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  return (
    <Wrapper styles={{backgroundColor: AppColor.WHITE}}>
      <NewHeader1
        header={'Diet plan'}
        backButton
        icon={showSearchButton ? true : false}
        onBackPress={() => {
          goBack();
        }}
        onIconPress={() => {
          AnalyticsConsole('Diet_Item_Click');
          refStandard.current.openSheet();
        }}
        iconSource={require('../../Icon/Images/NewImage2/filter.png')}
      />
      <View style={[PredefinedStyles.rowBetween, styles.tab]}>
        {eatTime.map((item, index) => {
          if (index == 3 && getCustomDietData.length <= 0) return;
          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setSelectedItem(index);
              }}
              activeOpacity={0.8}
              style={{
                height: 50,
                width: '25%',
                backgroundColor:
                  selectedItem == index ? AppColor.RED : '#f0f1f3',
                justifyContent: 'center',
                alignItems: 'center',
                borderTopLeftRadius: index == 0 ? 30 : 0,
                borderTopRightRadius: index == eatTime.length - 1 ? 30 : 0,
                borderBottomLeftRadius: index == 0 ? 30 : 0,
                borderBottomRightRadius: index == eatTime.length - 1 ? 30 : 0,
                overflow: 'hidden',
              }}>
              <FitText
                type="SubHeading"
                value={item}
                color={
                  index == selectedItem
                    ? AppColor.WHITE
                    : AppColor.PrimaryTextColor
                }
                fontSize={15}
              />
            </TouchableOpacity>
          );
        })}
      </View>
      {selectedItem == 3 ? (
        <CreateMealList />
      ) : (
        <MealList data={mealData[eatTime[selectedItem]?.toLowerCase()]} />
      )}
      <BannerAdd bannerAdId={bannerAdId} />
      <BottomSheet1 ref={refStandard}>
        <BottomSheetContent />
      </BottomSheet1>
    </Wrapper>
  );
};

export default NewDiet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  listContainer: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
  },
  tab: {
    height: 50,
    width: DeviceWidth * 0.9,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 10,
  },
});
