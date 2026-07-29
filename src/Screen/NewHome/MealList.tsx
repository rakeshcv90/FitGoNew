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
import LinearGradient from 'react-native-linear-gradient';
import AnimatedReanimated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeInDown,
  Layout,
} from 'react-native-reanimated';
// import {MyInterstitialAd} from '../../Component/BannerAdd';
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

const RecipeCard = ({item, index, checkMealAddCount}: any) => {
  const scale = useSharedValue(1);
  const [isLiked, setIsLiked] = useState(false);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  const onPressIn = () => {
    scale.value = withSpring(0.94, {damping: 14, stiffness: 280});
  };

  const onPressOut = () => {
    scale.value = withSpring(1, {damping: 14, stiffness: 280});
  };

  const imageSource =
    item.diet_image == null ? localImage.Noimage : {uri: item.diet_image};

  return (
    <AnimatedReanimated.View
      entering={FadeInDown.delay((index % 6) * 70)
        .duration(380)
        .springify()}
      layout={Layout.springify()}
      style={[styles.cardContainer, animatedStyle]}>
      <TouchableOpacity
        activeOpacity={0.92}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={() => checkMealAddCount(item)}
        style={styles.cardInnerTouchable}>
        {/* Heart Favorite Badge */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setIsLiked(!isLiked)}
          style={styles.favoriteBadge}>
          <FitIcon
            type="MaterialCommunityIcons"
            name={isLiked ? 'heart' : 'heart-outline'}
            size={16}
            color={isLiked ? AppColor.RED : '#9CA3AF'}
          />
        </TouchableOpacity>

        {/* Food Image Ring with Floating Calorie Badge */}
        <View style={styles.imageRingWrapper}>
          <Image
            source={imageSource}
            defaultSource={localImage?.NOWORKOUT}
            style={styles.foodImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['#FF3366', '#E11D48']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.floatingCaloriePill}>
            <FitIcon
              type="MaterialCommunityIcons"
              name="fire"
              size={10}
              color="#FFFFFF"
            />
            <Text style={styles.floatingCalorieText}>
              {item?.diet_calories}
            </Text>
          </LinearGradient>
        </View>

        {/* Recipe Title */}
        <Text style={styles.recipeTitle} numberOfLines={2}>
          {item?.diet_title}
        </Text>

        {/* Metrics Row */}
        <View style={styles.metricsRow}>
          <View style={styles.timePill}>
            <FitIcon
              type="AntDesign"
              name="clockcircle"
              size={10}
              color="#7C3AED"
            />
            <Text style={styles.timeText}>{item?.diet_time}</Text>
          </View>

          <View style={styles.servingsPill}>
            <FitIcon
              type="MaterialCommunityIcons"
              name="silverware-fork-knife"
              size={10}
              color="#059669"
            />
            <Text style={styles.servingsText}>Healthy</Text>
          </View>
        </View>
      </TouchableOpacity>
    </AnimatedReanimated.View>
  );
};

const MealList = ({data}: any) => {
  // const {showInterstitialAd} = MyInterstitialAd();
  const getDietFilterData = useSelector(
    (state: any) => state?.getDietFilterData,
  );
  const mealData = useSelector((state: any) => state.mealData);
  const [filterMealList, setFilterMealList] = useState(data);

  const checkMealAddCount = (item: Item) => {
    let checkAdsShow = AddCountFunction();

    if (checkAdsShow == true) {
      // showInterstitialAd();
      navigate('MealDetails', {item: item});
    } else {
      navigate('MealDetails', {item: item});
    }
  };

  useEffect(() => {
    updateFilteredCategories(getDietFilterData);
  }, [getDietFilterData, data]);

  const updateFilteredCategories = (test: number) => {
    let filteredItems = [];
    if (test == -1) {
      setFilterMealList(data);
    } else if (test == 0) {
      filteredItems = data?.filter(
        (item: any) => item?.meal_type?.toLowerCase() == 'veg',
      );
      setFilterMealList(filteredItems);
    } else {
      filteredItems = data?.filter(
        (item: any) => item?.meal_type?.toLowerCase() == 'non_veg',
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
        contentContainerStyle={{paddingBottom: 90, paddingHorizontal: 10}}
        ListEmptyComponent={emptyComponent}
        renderItem={({item, index}: any) => (
          <RecipeCard
            item={item}
            index={index}
            checkMealAddCount={checkMealAddCount}
          />
        )}
      />

      <TouchableOpacity
        activeOpacity={0.88}
        onPress={() => {
          const allMealList = [
            ...(mealData?.breakfast || []),
            ...(mealData?.lunch || []),
            ...(mealData?.dinner || []),
          ];
          navigate('CustomMealList', {
            totalMealData: allMealList,
          });
        }}
        style={styles.floatingAddButton}>
        <LinearGradient
          colors={['#FF2A54', '#E11D48']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.floatingGradientFab}>
          <View style={styles.fabIconBadge}>
            <FitIcon
              type="MaterialCommunityIcons"
              name="plus"
              size={18}
              color="#FFFFFF"
            />
          </View>
          <Text style={styles.fabText}>Create Meal</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

export default MealList;

const styles = StyleSheet.create({
  cardContainer: {
    width: (DeviceWidth - 44) / 2,
    marginHorizontal: 5,
    marginVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.06,
        shadowRadius: 10,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  cardInnerTouchable: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 155,
    position: 'relative',
  },
  favoriteBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    zIndex: 10,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  imageRingWrapper: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: AppColor.RED,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.14,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  foodImage: {
    width: 62,
    height: 62,
    borderRadius: 31,
  },
  floatingCaloriePill: {
    position: 'absolute',
    bottom: -5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 8,
    gap: 2,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: AppColor.RED,
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  floatingCalorieText: {
    fontSize: 9,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  recipeTitle: {
    fontSize: 12,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginVertical: 1,
    height: 28,
    lineHeight: 14,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    gap: 4,
  },
  timePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F3FF',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 3,
  },
  timeText: {
    fontSize: 10.5,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
    color: '#6D28D9',
  },
  servingsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 3,
  },
  servingsText: {
    fontSize: 10.5,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
    color: '#059669',
  },
  floatingAddButton: {
    position: 'absolute',
    bottom: DeviceHeigth >= 1024 ? 20 : 24,
    right: 16,
    borderRadius: 25,
    ...Platform.select({
      ios: {
        shadowColor: '#FF2A54',
        shadowOffset: {width: 0, height: 6},
        shadowOpacity: 0.38,
        shadowRadius: 10,
      },
      android: {
        elevation: 9,
      },
    }),
  },
  floatingGradientFab: {
    height: 48,
    paddingHorizontal: 16,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  fabIconBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  fabText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
