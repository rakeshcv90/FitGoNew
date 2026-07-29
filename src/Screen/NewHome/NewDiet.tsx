/* eslint-disable react/no-unstable-nested-components */
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import AnimatedReanimated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  FadeInUp,
} from 'react-native-reanimated';
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
import {translate} from '../Translation/TranslationService';
// import { BannerAdd } from '../../Component/BannerAdd';
// import { bannerAdId } from '../../Component/AdsId';

const eatTime = ['Breakfast', 'Lunch', 'Dinner', 'Your meal'];

const mealIcons: any = {
  0: {icon: 'weather-sunny', type: 'MaterialCommunityIcons'},
  1: {icon: 'food-apple-outline', type: 'MaterialCommunityIcons'},
  2: {icon: 'weather-night', type: 'MaterialCommunityIcons'},
  3: {icon: 'chef-hat', type: 'MaterialCommunityIcons'},
};

const TopTabItem = ({item, index, isSelected, onPress}: any) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (isSelected) {
      scale.value = withSpring(1.04, {damping: 14, stiffness: 220});
    } else {
      scale.value = withSpring(1, {damping: 14, stiffness: 220});
    }
  }, [isSelected]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  const iconInfo = mealIcons[index] || {
    icon: 'food',
    type: 'MaterialCommunityIcons',
  };

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      style={styles.tabItemWrapper}>
      <AnimatedReanimated.View
        style={[{width: '100%', height: '100%'}, animatedStyle]}>
        {isSelected ? (
          <LinearGradient
            colors={[AppColor.RED, '#E11D48', '#C026D3']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.activeTabGradient}>
            <FitIcon
              type={iconInfo.type}
              name={iconInfo.icon}
              size={15}
              color="#FFFFFF"
            />
            <Text style={styles.activeTabText} numberOfLines={1}>
              {item}
            </Text>
          </LinearGradient>
        ) : (
          <View style={styles.inactiveTabPill}>
            <FitIcon
              type={iconInfo.type}
              name={iconInfo.icon}
              size={15}
              color="#9CA3AF"
            />
            <Text style={styles.inactiveTabText} numberOfLines={1}>
              {item}
            </Text>
          </View>
        )}
      </AnimatedReanimated.View>
    </TouchableOpacity>
  );
};

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
      title: translate('veg'),
      ima: require('../../Icon/Images/InAppRewards/Veg.png'),
    },
    {
      id: 2,
      title: translate('nonVeg'),
      ima: require('../../Icon/Images/InAppRewards/Nonveg.png'),
    },
  ];

  const CategoryFilterCard = ({item, index, isSelected, onPress}: any) => {
    const scale = useSharedValue(1);
    const badgeScale = useSharedValue(1);
    const imageScale = useSharedValue(1);

    useEffect(() => {
      if (isSelected) {
        scale.value = withSpring(1.05, {damping: 12, stiffness: 240});
        imageScale.value = withSpring(1.12, {damping: 12, stiffness: 240});
        badgeScale.value = withSequence(
          withTiming(1.35, {duration: 100}),
          withSpring(1, {damping: 10, stiffness: 260}),
        );
      } else {
        scale.value = withSpring(1, {damping: 12, stiffness: 240});
        imageScale.value = withSpring(1, {damping: 12, stiffness: 240});
        badgeScale.value = withSpring(1);
      }
    }, [isSelected]);

    const animatedCardStyle = useAnimatedStyle(() => ({
      transform: [{scale: scale.value}],
    }));

    const animatedBadgeStyle = useAnimatedStyle(() => ({
      transform: [{scale: badgeScale.value}],
    }));

    const animatedImageStyle = useAnimatedStyle(() => ({
      transform: [{scale: imageScale.value}],
    }));

    const activeGradient =
      index === 0 ? ['#10B981', '#059669'] : ['#FF2A54', '#E11D48'];
    const inactiveBg = index === 0 ? '#F0FDF4' : '#FFF1F2';
    const inactiveBorder = index === 0 ? '#A7F3D0' : '#FECDD3';
    const inactiveTextColor = index === 0 ? '#047857' : '#BE123C';

    return (
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={onPress}
        style={{flex: 1}}>
        <AnimatedReanimated.View
          entering={FadeInUp.delay(index * 90)
            .duration(380)
            .springify()}
          style={[styles.animatedCategoryCard, animatedCardStyle]}>
          {isSelected ? (
            <LinearGradient
              colors={activeGradient}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={styles.cardGradientInner}>
              <AnimatedReanimated.View
                style={[styles.cardCheckBadgeActive, animatedBadgeStyle]}>
                <FitIcon
                  type="MaterialCommunityIcons"
                  name="check-bold"
                  size={12}
                  color={index === 0 ? '#10B981' : AppColor.RED}
                />
              </AnimatedReanimated.View>

              <AnimatedReanimated.View
                style={[styles.cardImageCircle, animatedImageStyle]}>
                <Image
                  source={item.ima}
                  defaultSource={localImage?.NOWORKOUT}
                  style={styles.categoryCardImage}
                  resizeMode="contain"
                />
              </AnimatedReanimated.View>

              <Text style={styles.categoryTitleActive}>{item?.title}</Text>
            </LinearGradient>
          ) : (
            <View
              style={[
                styles.cardInactiveInner,
                {backgroundColor: inactiveBg, borderColor: inactiveBorder},
              ]}>
              <AnimatedReanimated.View
                style={[styles.cardImageCircle, animatedImageStyle]}>
                <Image
                  source={item.ima}
                  defaultSource={localImage?.NOWORKOUT}
                  style={styles.categoryCardImage}
                  resizeMode="contain"
                />
              </AnimatedReanimated.View>

              <Text
                style={[
                  styles.categoryTitleInactive,
                  {color: inactiveTextColor},
                ]}>
                {item?.title}
              </Text>
            </View>
          )}
        </AnimatedReanimated.View>
      </TouchableOpacity>
    );
  };

  const BottomSheetContent = () => {
    const getDietFilterData = useSelector(
      (state: any) => state?.getDietFilterData,
    );
    const dispatch = useDispatch();
    const [selectedItem, setSelectedItem] = useState(getDietFilterData);

    return (
      <View style={styles.sheetMainContainer}>
        {/* Header Row with Filter Title & Close X Button */}
        <View style={styles.sheetHeaderRow}>
          <View style={{width: 32}} />
          <Text style={styles.sheetFilterTitle}>{translate('filter')}</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => refStandard.current.closeSheet()}
            style={styles.sheetCloseBtn}>
            <FitIcon
              type="MaterialCommunityIcons"
              name="close"
              size={20}
              color="#374151"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.sheetHeaderDivider} />

        {/* Section Heading */}
        <Text style={styles.sheetCategoryHeading}>
          {translate('foodCategories')}
        </Text>

        {/* Responsive Colorful Category Selector Cards */}
        <View style={styles.sheetCardsRow}>
          {meal_type.map((item: (typeof meal_type)[0], index: number) => {
            return (
              <CategoryFilterCard
                key={index}
                item={item}
                index={index}
                isSelected={selectedItem === index}
                onPress={() => setSelectedItem(index)}
              />
            );
          })}
        </View>

        <View style={styles.sheetHeaderDivider} />

        {/* Footer Actions Row */}
        <View style={styles.sheetFooterRow}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              setSelectedItem(-1);
              dispatch(setMealTypeData(-1));
              refStandard.current.closeSheet();
            }}
            style={styles.clearAllButton}>
            <Text style={styles.clearAllButtonText}>
              {translate('clearAll')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => {
              dispatch(setMealTypeData(selectedItem));
              refStandard.current.closeSheet();
            }}>
            <LinearGradient
              colors={[AppColor.RED, '#E11D48']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.showResultGradientBtn}>
              <Text style={styles.showResultBtnText}>
                {translate('showResult')}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  return (
    <Wrapper styles={{backgroundColor: AppColor.WHITE}}>
      <NewHeader1
        header={translate('dietPlan')}
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
      <View style={styles.segmentedTabContainer}>
        {eatTime.map((item, index) => {
          if (index == 3 && (getCustomDietData?.length ?? 0) <= 0) return null;
          return (
            <TopTabItem
              key={index}
              item={item}
              index={index}
              isSelected={selectedItem == index}
              onPress={() => setSelectedItem(index)}
            />
          );
        })}
      </View>
      {selectedItem == 3 ? (
        <CreateMealList />
      ) : (
        <MealList data={mealData[eatTime[selectedItem]?.toLowerCase()]} />
      )}

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
  segmentedTabContainer: {
    height: 52,
    width: DeviceWidth * 0.94,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    padding: 4,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  tabItemWrapper: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTabGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: 4,
    ...Platform.select({
      ios: {
        shadowColor: AppColor.RED,
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  inactiveTabPill: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: 4,
    backgroundColor: 'transparent',
  },
  activeTabText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
  },
  inactiveTabText: {
    color: '#6B7280',
    fontSize: 12.5,
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    fontWeight: '600',
  },
  sheetMainContainer: {
    width: DeviceWidth,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  sheetHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingBottom: 10,
  },
  sheetFilterTitle: {
    fontSize: 17,
    fontWeight: '700',
    fontFamily: Fonts.MONTSERRAT_BOLD,
    color: '#1F2937',
  },
  sheetCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetHeaderDivider: {
    width: '100%',
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 14,
  },
  sheetCategoryHeading: {
    fontSize: 15,
    fontWeight: '700',
    fontFamily: Fonts.MONTSERRAT_BOLD,
    color: '#1F2937',
    marginBottom: 14,
  },
  sheetCardsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
    width: '100%',
  },
  animatedCategoryCard: {
    width: '100%',
    height: 128,
    borderRadius: 20,
    overflow: 'hidden',
  },
  cardGradientInner: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  cardInactiveInner: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1.5,
  },
  cardCheckBadgeActive: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.15,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cardImageCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  categoryCardImage: {
    width: 44,
    height: 44,
  },
  categoryTitleActive: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
  },
  categoryTitleInactive: {
    fontSize: 14,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
  },
  sheetFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: 4,
  },
  clearAllButton: {
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  clearAllButtonText: {
    fontSize: 14,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
    color: '#E11D48',
    textDecorationLine: 'underline',
  },
  showResultGradientBtn: {
    paddingHorizontal: 24,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: AppColor.RED,
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  showResultBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    fontFamily: Fonts.MONTSERRAT_BOLD,
  },
});
