import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Platform,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {AppColor, Fonts} from '../../Component/Color';
import LinearGradient from 'react-native-linear-gradient';
import ActivityLoader from '../../Component/ActivityLoader';
import {useDispatch, useSelector} from 'react-redux';
import {
  setCustomDietData,
  setCustomWorkoutData,
  setOfferAgreement,
  setMealTypeData,
  setUserProfileData,
} from '../../Component/ThemeRedux/Actions';
import {NewAppapi} from '../../Component/Config';
import {Image} from 'react-native';
import {localImage} from '../../Component/Image';
import VersionNumber from 'react-native-version-number';
import {showMessage} from 'react-native-flash-message';
import axios from 'axios';
import AnimatedReanimated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeInDown,
  Layout,
} from 'react-native-reanimated';
import Wrapper from '../WorkoutCompleteScreen/Wrapper';
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

  const imageSource = item?.diet_image == null
    ? localImage.NOWORKOUT
    : {uri: item.diet_image};

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
              isSelected && {borderColor: '#A7F3D0', backgroundColor: '#ECFDF5'},
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

const EditCustomMeal = ({navigation, route}) => {
  const [forLoading, setForLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const getUserDataDetails = useSelector(state => state.getUserDataDetails);
  const getCustomDietData = useSelector(state => state.getCustomDietData);
  const [filterMealList, setFilterMealList] = useState(
    route?.params?.totalMealData || [],
  );
  const dispatch = useDispatch();

  useEffect(() => {
    filterData();
  }, [filterMealList]);

  const filterData = () => {
    const MealIds = [];
    getCustomDietData.map(item => MealIds.push(item.diet_id));
    setSelectedItems(MealIds);
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

  const UpdateCustomMealList = async () => {
    const url =
      'https://fitme.cvinfotechserver.com/adserver/public/api/test_update_custom_diet';

    setForLoading(true);
    const payload = new FormData();

    for (var i = 0; i < selectedItems.length; i++) {
      payload.append('meal_id[]', selectedItems[i]);
    }

    payload.append('user_id', getUserDataDetails?.id);
    payload.append('version', VersionNumber.appVersion);

    try {
      const res = await axios(`${url}`, {
        data: payload,
        method: 'post',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res?.data?.msg == 'diet updated successfully.') {
        showMessage({
          message: 'Meal updated successfully.',
          type: 'success',
          animationDuration: 500,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });

        getUserDetailData();
      } else {
        setForLoading(false);
        showMessage({
          message: 'Something went wrong please try again!',
          type: 'danger',
          animationDuration: 500,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
      }
    } catch (error) {
      setForLoading(false);
      console.log(error);
      showMessage({
        message: 'Something went wrong please try again',
        type: 'danger',
        animationDuration: 500,
        floating: true,
        icon: {icon: 'auto', position: 'left'},
      });
    }
  };

  const getUserDetailData = async () => {
    try {
      const responseData = await axios.get(
        `${NewAppapi.ALL_USER_DETAILS}?version=${VersionNumber.appVersion}&user_id=${getUserDataDetails?.id}`,
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
        setForLoading(false);
        dispatch(setCustomWorkoutData(responseData?.data?.workout_data));
        dispatch(setOfferAgreement(responseData?.data?.additional_data));
        dispatch(setUserProfileData(responseData?.data?.profile));
        dispatch(setCustomDietData(responseData?.data?.diet_data));
        navigation?.goBack();
      }
    } catch (error) {
      console.log('GET-USER-DATA UpdateMeal List', error);
      setForLoading(false);
    }
  };

  // Sort list to show selected items first
  const displayData = useMemo(() => {
    return [
      ...filterMealList.filter(item =>
        selectedItems.includes(item.diet_id),
      ),
      ...filterMealList.filter(
        item => !selectedItems.includes(item.diet_id),
      ),
    ];
  }, [filterMealList, selectedItems]);

  return (
    <View style={styles.container}>
      {forLoading && (
        <View style={styles.loaderContainer}>
          <ActivityLoader />
        </View>
      )}
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
              Edit Meals
            </Text>
            <Text style={styles.headerSubtitleText}>
              Edit recipes in your custom diet
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
          data={displayData}
          itemLayoutAnimation={Layout.springify().damping(14).stiffness(200)}
          contentContainerStyle={{
            paddingBottom: 90,
            paddingTop: 10,
          }}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => item?.diet_id?.toString() || index.toString()}
          renderItem={renderItem1}
        />

        {/* Compact Floating Action Pill Button */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => {
            if (selectedItems.length > 0) {
              UpdateCustomMealList();
            } else {
              showMessage({
                message:
                  'Select a meal from the given list to create your personalized diet plan!',
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
              {`Update Custom (${selectedItems?.length})`}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
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
});

export default EditCustomMeal;
