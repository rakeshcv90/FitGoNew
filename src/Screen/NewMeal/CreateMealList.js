import {
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import AnimatedReanimated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeInDown,
  Layout,
} from 'react-native-reanimated';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {localImage} from '../../Component/Image';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import {AppColor, Fonts} from '../../Component/Color';
import PredefinedStyles from '../../Component/Utilities/PredefineStyles';
import FitIcon from '../../Component/Utilities/FitIcon';

const RecipeCard = ({item, index, onCardPress}) => {
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
    item?.diet_image == null ? localImage.Noimage : {uri: item.diet_image};

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
        onPress={() => onCardPress(item)}
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
            <Text style={styles.servingsText}>Custom</Text>
          </View>
        </View>
      </TouchableOpacity>
    </AnimatedReanimated.View>
  );
};

const CreateMealList = () => {
  const navigation = useNavigation();
  const getCustomDietData = useSelector(state => state.getCustomDietData);
  const mealData = useSelector(state => state.mealData);

  const onCardPress = item => {
    navigation.navigate('MealDetails', {item: item});
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={getCustomDietData}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 90, paddingHorizontal: 10}}
        renderItem={({item, index}) => (
          <RecipeCard item={item} index={index} onCardPress={onCardPress} />
        )}
      />

      {getCustomDietData?.length > 0 && (
        <TouchableOpacity
          activeOpacity={0.88}
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
          style={styles.floatingEditButton}>
          <LinearGradient
            colors={['#FF2A54', '#E11D48']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.floatingCircleFab}>
            <FitIcon
              type="MaterialCommunityIcons"
              name="pencil"
              size={22}
              color={AppColor.WHITE}
            />
          </LinearGradient>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default CreateMealList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColor.WHITE,
    alignItems: 'center',
  },
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
  floatingEditButton: {
    position: 'absolute',
    bottom: DeviceHeigth >= 1024 ? 20 : 24,
    right: 20,
    borderRadius: 26,
    ...Platform.select({
      ios: {
        shadowColor: '#FF2A54',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.35,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  floatingCircleFab: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
});
