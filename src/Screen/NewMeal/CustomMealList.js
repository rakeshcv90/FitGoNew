/* eslint-disable react/no-unstable-nested-components */
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  FlatList,
  Platform,
} from 'react-native';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {AppColor, Fonts} from '../../Component/Color';
import LinearGradient from 'react-native-linear-gradient';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../Component/Config';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import FitText from '../../Component/Utilities/FitText';
import {Image} from 'react-native';
import {localImage} from '../../Component/Image';
import {showMessage} from 'react-native-flash-message';
import AnimatedReanimated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeInDown,
  Layout,
} from 'react-native-reanimated';

import {AnalyticsConsole} from '../../Component/AnalyticsConsole';
import ActivityLoader from '../../Component/ActivityLoader';
import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import VersionNumber from 'react-native-version-number';
import {
  setCustomDietData,
  setMealTypeData,
} from '../../Component/ThemeRedux/Actions';
import Wrapper from '../WorkoutCompleteScreen/Wrapper';
import BottomSheet1 from '../../Component/BottomSheet';
import {translate, getCurrentLanguage} from '../Translation/TranslationService';
import FitIcon from '../../Component/Utilities/FitIcon';
import {ArrowLeft} from '../../Component/Utilities/Arrows/Arrow';

// --- Animated Recipe Card Component ---
const RecipeCard = ({item, index, isSelected, onSelect}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  const onPressIn = () => {
    scale.value = withSpring(0.95, {damping: 14, stiffness: 280});
  };

  const onPressOut = () => {
    scale.value = withSpring(1, {damping: 14, stiffness: 280});
  };

  const imageSource =
    item?.diet_image == null ? localImage.NOWORKOUT : {uri: item.diet_image};

  return (
    <AnimatedReanimated.View
      entering={FadeInDown.delay((index % 6) * 55)
        .duration(400)
        .springify()
        .damping(13)
        .stiffness(220)}
      layout={Layout.springify().damping(14).stiffness(200)}
      style={[animatedStyle]}>
      <TouchableOpacity
        activeOpacity={0.92}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={onSelect}
        style={[
          styles.recipeCardContainer,
          isSelected && styles.recipeCardSelected,
        ]}>
        {/* Dual-Tone Accent Bar */}
        <LinearGradient
          colors={isSelected ? ['#10B981', '#059669'] : ['#FF2A54', '#E11D48']}
          style={styles.cardAccentBar}
        />

        <View style={styles.cardContentRow}>
          {/* Image Ring */}
          <View
            style={[
              styles.foodImageWrapper,
              isSelected && {
                borderColor: '#A7F3D0',
                backgroundColor: '#ECFDF5',
              },
            ]}>
            <Image
              style={styles.foodImage}
              source={imageSource}
              defaultSource={localImage.NOWORKOUT}
              resizeMode={'cover'}
            />
          </View>

          {/* Recipe Info Column */}
          <View style={styles.recipeInfoColumn}>
            <Text numberOfLines={1} style={styles.recipeTitleText}>
              {item?.diet_title}
            </Text>

            {/* Micro Badges Row */}
            <View style={styles.recipeBadgesRow}>
              <View style={styles.caloriePill}>
                <FitIcon
                  type="MaterialCommunityIcons"
                  name="fire"
                  size={12}
                  color="#E11D48"
                />
                <Text style={styles.caloriePillText}>
                  {item?.diet_calories || 0} kcal
                </Text>
              </View>

              <View style={styles.categoryPill}>
                <FitIcon
                  type="MaterialCommunityIcons"
                  name="silverware-fork-knife"
                  size={11}
                  color="#059669"
                />
                <Text style={styles.categoryPillText}>Healthy</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Selection Checkbox Button */}
        <View
          style={[
            styles.selectionCircle,
            isSelected && styles.selectionCircleActive,
          ]}>
          {isSelected ? (
            <FitIcon
              type="MaterialCommunityIcons"
              name="check-bold"
              size={14}
              color="#FFFFFF"
            />
          ) : (
            <FitIcon
              type="MaterialCommunityIcons"
              name="plus"
              size={16}
              color="#E11D48"
            />
          )}
        </View>
      </TouchableOpacity>
    </AnimatedReanimated.View>
  );
};

const CustomMealList = ({navigation, route}) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const getUserDataDetails = useSelector(state => state.getUserDataDetails);
  const getCustomDietData = useSelector(state => state.getCustomDietData);
  const getDietFilterData = useSelector(state => state?.getDietFilterData);
  const dispatch = useDispatch();

  const [filterMealList, setFilterMealList] = useState(
    route?.params?.totalMealData || [],
  );

  const [forLoading, setForLoading] = useState(false);
  const lang = getCurrentLanguage();

  const refStandard = useRef();
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

  useEffect(() => {
    updateFilteredCategories(getDietFilterData);
  }, [getDietFilterData]);

  const BottomSheet = () => {
    const [selectedItem, setSelectedItem] = useState(getDietFilterData);
    return (
      <View style={styles.listContainer}>
        <View style={styles.sheetHeaderRow}>
          <View style={{width: 24}} />
          <Text style={styles.sheetTitle}>{translate('filter')}</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => refStandard.current.closeSheet()}>
            <Icons name={'close'} size={22} color="#1F2937" />
          </TouchableOpacity>
        </View>
        <View style={styles.sheetDivider} />
        <Text style={styles.sheetCategoryHeading}>
          {translate('foodCategories')}
        </Text>
        <View style={styles.sheetCardsRow}>
          {meal_type.map((item, index) => {
            const isSelected = selectedItem === index;
            return (
              <TouchableOpacity
                key={index}
                activeOpacity={0.85}
                onPress={() => setSelectedItem(index)}
                style={[
                  styles.filterCard,
                  isSelected && styles.filterCardSelected,
                ]}>
                <Image
                  source={item.ima}
                  defaultSource={localImage?.NOWORKOUT}
                  style={styles.filterCardImage}
                  resizeMode="contain"
                />
                <Text
                  style={[
                    styles.filterCardText,
                    isSelected && styles.filterCardTextSelected,
                  ]}>
                  {item?.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={styles.sheetDivider} />
        <View style={styles.sheetFooterRow}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              setSelectedItem(-1);
              dispatch(setMealTypeData(-1));
              refStandard.current.closeSheet();
            }}>
            <Text style={styles.clearAllText}>{translate('clearAll')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => {
              dispatch(setMealTypeData(selectedItem));
              refStandard.current.closeSheet();
            }}>
            <LinearGradient
              colors={['#FF2A54', '#E11D48']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.showResultBtn}>
              <Text style={styles.showResultText}>
                {translate('showResult')}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const selectedMealData = data => {
    const index = selectedItems.indexOf(data);

    const newSelectedItems = [...selectedItems];
    if (index === -1) {
      newSelectedItems.push(data);
    } else {
      newSelectedItems.splice(index, 1);
    }

    setSelectedItems(newSelectedItems);
  };

  const renderItem1 = useMemo(
    () =>
      ({index, item}) => {
        const isSelected = selectedItems?.includes(item?.diet_id);

        return (
          <RecipeCard
            item={item}
            index={index}
            isSelected={isSelected}
            onSelect={() => selectedMealData(item?.diet_id)}
          />
        );
      },
    [selectedItems, filterMealList],
  );

  const createMealPlan = async () => {
    AnalyticsConsole(`Custom_Meal_BUTTON`);
    const url =
      'https://fitme.cvinfotechserver.com/adserver/public/api/test_create_custom_diet';
    if (selectedItems.length <= 0) {
      showMessage({
        message: 'Please select meal',
        type: 'danger',
        animationDuration: 500,
        floating: true,
        icon: {icon: 'auto', position: 'left'},
      });
    } else {
      setForLoading(true);
      const payload = new FormData();

      for (var i = 0; i < selectedItems.length; i++) {
        payload.append('meal_id[]', selectedItems[i]);
      }
      payload.append('version', VersionNumber?.appVersion);
      payload.append('user_id', getUserDataDetails?.id);

      try {
        const res = await axios(`${url}`, {
          data: payload,
          method: 'post',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        if (res.data.msg == 'diet updated successfully.') {
          showMessage({
            message: 'Custom diet created successfully.',
            type: 'success',
            animationDuration: 500,
            floating: true,
            icon: {icon: 'auto', position: 'left'},
          });
          getUserDetailData();
        } else {
          getUserDetailData();
        }
      } catch (error) {
        setForLoading(false);

        showMessage({
          message: 'Something went wrong please try again!',
          type: 'danger',
          animationDuration: 500,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
      }
    }
  };

  const getUserDetailData = async () => {
    try {
      const responseData = await axios.get(
        `${NewAppapi.ALL_USER_DETAILS}?version=${VersionNumber.appVersion}&user_id=${getUserDataDetails.id}&lang=${lang}`,
      );
      setForLoading(false);
      if (
        responseData?.data?.msg ==
        'Please update the app to the latest version.'
      ) {
        showMessage({
          message: responseData?.data?.msg,
          type: 'danger',
          animationDuration: 500,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
      } else {
        dispatch(setCustomDietData(responseData?.data?.diet_data));
        navigation?.goBack();
      }
    } catch (error) {
      console.log('GET-USER-DATA', error);
    }
  };

  const updateFilteredCategories = test => {
    let filteredItems = [];
    if (test == -1) {
      setFilterMealList(route?.params?.totalMealData);
      refStandard.current?.closeSheet();
    } else if (test == 0) {
      filteredItems = (route?.params?.totalMealData || []).filter(
        item => item?.meal_type.toLowerCase() == 'veg',
      );
      refStandard.current?.closeSheet();
      setFilterMealList(filteredItems);
    } else {
      filteredItems = (route?.params?.totalMealData || []).filter(
        item => item?.meal_type.toLowerCase() == 'non_veg',
      );
      refStandard.current?.closeSheet();
      setFilterMealList(filteredItems);
    }
  };

  return (
    <View style={styles.container}>
      {forLoading && (
        <View style={styles.loaderContainer}>
          <ActivityLoader />
        </View>
      )}
      <StatusBar barStyle={'dark-content'} backgroundColor={'white'} />
      <Wrapper styles={{backgroundColor: '#FDFDFD'}}>
        {/* Top Header Bar */}
        <View style={styles.topHeaderBarRow}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              navigation?.goBack();
              dispatch(setMealTypeData(-1));
            }}
            style={styles.backButtonCircle}>
            <ArrowLeft fillColor={AppColor.BLACK} />
          </TouchableOpacity>

          <View style={styles.headerTitleCenterColumn}>
            <Text style={styles.headerTitleText} numberOfLines={1}>
              Select Meals
            </Text>
            <Text style={styles.headerSubtitleText}>
              Pick recipes for your custom diet
            </Text>
          </View>

          <View
            style={[
              styles.headerBadgeRight,
              selectedItems.length > 0 && styles.headerBadgeRightActive,
            ]}>
            <Text
              style={[
                styles.headerBadgeText,
                selectedItems.length > 0 && styles.headerBadgeTextActive,
              ]}>
              {selectedItems.length}
            </Text>
          </View>
        </View>

        {/* Animated Recipe List */}
        <AnimatedReanimated.FlatList
          data={filterMealList}
          itemLayoutAnimation={Layout.springify().damping(14).stiffness(200)}
          contentContainerStyle={{
            paddingBottom: 90,
            paddingTop: 10,
          }}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) =>
            item?.diet_id?.toString() || index.toString()
          }
          renderItem={renderItem1}
        />

        {/* Compact Floating Action Pill Button */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => {
            if (selectedItems.length > 0) {
              createMealPlan();
            } else {
              showMessage({
                message: translate('selectMealReminder'),
                type: 'danger',
                animationDuration: 500,
                floating: true,
                icon: {icon: 'auto', position: 'left'},
              });
            }
          }}
          style={styles.compactFloatingAddButton}>
          <LinearGradient
            colors={['#FF2A54', '#E11D48']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.compactGradientFabPill}>
            <Image
              source={localImage.Plus}
              tintColor={AppColor.WHITE}
              style={{width: 18, height: 18}}
              resizeMode="contain"
            />
            <Text style={styles.compactFabBtnText}>
              {translate('addCustom')}
            </Text>
            <Text style={styles.compactFabCountText}>
              ({selectedItems?.length})
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <BottomSheet1 ref={refStandard}>
          <BottomSheet />
        </BottomSheet1>
      </Wrapper>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFDFD',
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    zIndex: 9999,
  },

  // --- Top Header Bar ---
  topHeaderBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButtonCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleCenterColumn: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  headerTitleText: {
    fontSize: 18,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },
  headerSubtitleText: {
    fontSize: 11.5,
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    color: '#6B7280',
    marginTop: 1,
  },
  headerBadgeRight: {
    minWidth: 34,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  headerBadgeRightActive: {
    backgroundColor: '#FFF1F2',
    borderColor: '#FECDD3',
  },
  headerBadgeText: {
    color: '#6B7280',
    fontSize: 12.5,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
  },
  headerBadgeTextActive: {
    color: '#E11D48',
  },

  // --- Recipe Card ---
  recipeCardContainer: {
    width: '92%',
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 12,
    marginVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 5},
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  recipeCardSelected: {
    borderColor: '#A7F3D0',
    backgroundColor: '#F0FDF4',
  },
  cardAccentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4.5,
  },
  cardContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
    paddingLeft: 6,
  },
  foodImageWrapper: {
    width: 66,
    height: 66,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.08,
        shadowRadius: 5,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  foodImage: {
    width: 62,
    height: 62,
    borderRadius: 15,
  },
  recipeInfoColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  recipeTitleText: {
    fontSize: 15.5,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  recipeBadgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  caloriePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1F2',
    paddingHorizontal: 9,
    paddingVertical: 3.5,
    borderRadius: 9,
    gap: 4,
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  caloriePillText: {
    fontSize: 11,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
    color: '#E11D48',
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 9,
    paddingVertical: 3.5,
    borderRadius: 9,
    gap: 4,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  categoryPillText: {
    fontSize: 11,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
    color: '#059669',
  },
  selectionCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF1F2',
    borderWidth: 1.5,
    borderColor: '#FECDD3',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  selectionCircleActive: {
    backgroundColor: '#10B981',
    borderColor: '#059669',
  },

  // --- Compact Floating Action Pill Button ---
  compactFloatingAddButton: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: Platform.OS === 'ios' ? 20 : 12,
    borderRadius: 23,
    ...Platform.select({
      ios: {
        shadowColor: '#FF2A54',
        shadowOffset: {width: 0, height: 6},
        shadowOpacity: 0.35,
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  compactGradientFabPill: {
    height: 45,
    paddingHorizontal: 22,
    borderRadius: 23,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  compactFabBtnText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
    fontWeight: '600',
  },
  compactFabCountText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
    fontWeight: '600',
    marginLeft: -4,
  },

  // --- Filter Bottom Sheet ---
  listContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  sheetHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sheetTitle: {
    fontSize: 16,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
    color: '#111827',
  },
  sheetDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 12,
  },
  sheetCategoryHeading: {
    fontSize: 14,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 12,
  },
  sheetCardsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  filterCard: {
    flex: 1,
    height: 80,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  filterCardSelected: {
    borderColor: '#E11D48',
    backgroundColor: '#FFF1F2',
  },
  filterCardImage: {
    width: 36,
    height: 36,
  },
  filterCardText: {
    fontSize: 13,
    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
    color: '#4B5563',
  },
  filterCardTextSelected: {
    color: '#E11D48',
    fontFamily: Fonts.MONTSERRAT_BOLD,
  },
  sheetFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  clearAllText: {
    color: '#E11D48',
    fontSize: 14,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    textDecorationLine: 'underline',
  },
  showResultBtn: {
    paddingHorizontal: 24,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  showResultText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: Fonts.MONTSERRAT_BOLD,
  },
});

export default CustomMealList;
