import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AnimatedReanimated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeInDown,
  FadeInUp,
} from 'react-native-reanimated';
import {AppColor, Fonts} from '../../Component/Color';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import {localImage} from '../../Component/Image';
import {useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import HTMLRender from 'react-native-render-html';
import {ArrowLeft} from '../../Component/Utilities/Arrows/Arrow';
import {ReviewApp} from '../../Component/ReviewApp';
import FitIcon from '../../Component/Utilities/FitIcon';

const MacroCardItem = ({
  iconName,
  iconColor,
  value,
  label,
  gradientColors,
  borderStyle,
  index,
}: any) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  const onPressIn = () => {
    scale.value = withSpring(0.94, {damping: 12, stiffness: 260});
  };

  const onPressOut = () => {
    scale.value = withSpring(1, {damping: 12, stiffness: 260});
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={{flex: 1}}>
      <AnimatedReanimated.View
        entering={FadeInUp.delay(100 + index * 50)
          .duration(350)
          .springify()}
        style={[animatedStyle]}>
        <LinearGradient
          colors={gradientColors}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={[styles.macroCard, borderStyle]}>
          <View style={styles.macroIconCircle}>
            <FitIcon
              type="MaterialCommunityIcons"
              name={iconName}
              size={18}
              color={iconColor}
            />
          </View>
          <Text style={styles.macroValueText}>{value || '0g'}</Text>
          <Text style={styles.macroLabelText}>{label}</Text>
        </LinearGradient>
      </AnimatedReanimated.View>
    </TouchableOpacity>
  );
};

const MealDetails = ({route, navigation}) => {
  const getStoreVideoLoc = useSelector(state => state.getStoreVideoLoc);
  const getPurchaseHistory = useSelector(state => state.getPurchaseHistory);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    ReviewApp(temp);
  }, []);

  const temp = () => {};

  const item = route?.params?.item || {};
  const imageSource =
    item?.diet_image == null ? localImage.Noimage : {uri: item?.diet_image};

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent={true}
        backgroundColor="transparent"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        style={{flex: 1, backgroundColor: '#FFFFFF'}}
        contentContainerStyle={{flexGrow: 1, paddingBottom: 60}}>
        {/* Hero Image Header with Scrim Gradient */}
        <View style={styles.heroImageContainer}>
          <ImageBackground
            style={styles.heroImage}
            resizeMode="cover"
            source={imageSource}>
            <LinearGradient
              colors={['rgba(0,0,0,0.6)', 'transparent', 'rgba(0,0,0,0.8)']}
              locations={[0, 0.4, 1]}
              style={styles.heroGradientOverlay}
            />

            {/* Top Action Row: Back & Favorite Buttons */}
            <View style={styles.topActionRow}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => navigation.goBack()}
                style={styles.glassCircleButton}>
                <ArrowLeft fillColor={AppColor.WHITE} />
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setIsLiked(!isLiked)}
                style={styles.glassCircleButton}>
                <FitIcon
                  type="MaterialCommunityIcons"
                  name={isLiked ? 'heart' : 'heart-outline'}
                  size={20}
                  color={isLiked ? AppColor.RED : '#FFFFFF'}
                />
              </TouchableOpacity>
            </View>

            {/* Hero Recipe Badges Row */}
            <View style={styles.heroBadgesRow}>
              <View style={styles.heroRatingBadge}>
                <FitIcon
                  type="MaterialIcons"
                  name="star"
                  size={14}
                  color="#F59E0B"
                />
                <Text style={styles.heroRatingText}>4.9 (120+)</Text>
              </View>

              {item?.diet_calories && (
                <View style={styles.heroCalorieBadge}>
                  <LinearGradient
                    colors={['#FF3366', '#E11D48']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    style={styles.heroCalorieGradient}>
                    <FitIcon
                      type="MaterialCommunityIcons"
                      name="fire"
                      size={14}
                      color="#FFFFFF"
                    />
                    <Text style={styles.heroCalorieText}>
                      {item?.diet_calories} kcal
                    </Text>
                  </LinearGradient>
                </View>
              )}
            </View>
          </ImageBackground>
        </View>

        {/* Main Content Sheet Container */}
        <AnimatedReanimated.View
          entering={FadeInDown.duration(380).springify()}
          style={styles.contentSheet}>
          {/* Recipe Title */}
          <Text style={styles.recipeTitle}>{item?.diet_title}</Text>

          {/* Quick Metrics Badges Row */}
          <View style={styles.metricsBadgeRow}>
            {item?.diet_time && (
              <View style={styles.timeMetricBadge}>
                <FitIcon
                  type="AntDesign"
                  name="clockcircle"
                  size={12}
                  color="#7C3AED"
                />
                <Text style={styles.timeMetricText}>{item?.diet_time}</Text>
              </View>
            )}

            {item?.diet_servings && (
              <View style={styles.servingsMetricBadge}>
                <FitIcon
                  type="MaterialCommunityIcons"
                  name="silverware-fork-knife"
                  size={12}
                  color="#059669"
                />
                <Text style={styles.servingsMetricText}>
                  {item?.diet_servings} Servings
                </Text>
              </View>
            )}

            <View style={styles.healthMetricBadge}>
              <FitIcon
                type="MaterialCommunityIcons"
                name="shield-check-outline"
                size={12}
                color="#2563EB"
              />
              <Text style={styles.healthMetricText}>Healthy Recipe</Text>
            </View>
          </View>

          {/* Macro Nutrient Cards (Protein, Carbs, Fat) */}
          <View style={styles.macrosContainer}>
            <Text style={styles.sectionHeaderTitle}>Nutrition Breakdown</Text>
            <View style={styles.macrosRow}>
              <MacroCardItem
                index={0}
                iconName="food-steak"
                iconColor="#E11D48"
                value={item?.diet_protein}
                label="Protein"
                gradientColors={['#FFF1F2', '#FFE4E6']}
                borderStyle={styles.proteinCardBorder}
              />
              <MacroCardItem
                index={1}
                iconName="barley"
                iconColor="#D97706"
                value={item?.diet_carbs}
                label="Carbs"
                gradientColors={['#FFFBEB', '#FEF3C7']}
                borderStyle={styles.carbsCardBorder}
              />
              <MacroCardItem
                index={2}
                iconName="oil"
                iconColor="#7E22CE"
                value={item?.diet_fat}
                label="Fat"
                gradientColors={['#FAF5FF', '#F3E8FF']}
                borderStyle={styles.fatCardBorder}
              />
            </View>
          </View>

          {/* Detail Sections: Summary, Ingredients, Instructions */}
          <View style={{gap: 18}}>
            {/* Section 1: Summary */}
            {item?.diet_description ? (
              <AnimatedReanimated.View
                entering={FadeInDown.delay(140).duration(360).springify()}
                style={styles.detailsCardSection}>
                <LinearGradient
                  colors={['#3B82F6', '#2563EB']}
                  style={styles.cardAccentBar}
                />

                <View style={styles.cardHeaderContainer}>
                  <View style={styles.sectionTitleRow}>
                    <View
                      style={[
                        styles.titleIconBadge,
                        {backgroundColor: '#EFF6FF'},
                      ]}>
                      <FitIcon
                        type="MaterialCommunityIcons"
                        name="file-document-outline"
                        size={20}
                        color="#2563EB"
                      />
                    </View>
                    <Text style={styles.sectionTitle}>Overview</Text>
                  </View>

                  <LinearGradient
                    colors={['#3B82F6', '#2563EB']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    style={styles.headerGradientPill}>
                    <Text style={styles.headerGradientPillText}>Summary</Text>
                  </LinearGradient>
                </View>

                <View style={styles.htmlContentBox}>
                  <HTMLRender
                    source={{html: item?.diet_description}}
                    contentWidth={DeviceWidth - 72}
                    tagsStyles={htmlTagStyles}
                  />
                </View>
              </AnimatedReanimated.View>
            ) : null}

            {/* Section 2: Ingredients */}
            {item?.diet_ingredients ? (
              <AnimatedReanimated.View
                entering={FadeInDown.delay(200).duration(360).springify()}
                style={styles.detailsCardSection}>
                <LinearGradient
                  colors={['#10B981', '#059669']}
                  style={styles.cardAccentBar}
                />

                <View style={styles.cardHeaderContainer}>
                  <View style={styles.sectionTitleRow}>
                    <View
                      style={[
                        styles.titleIconBadge,
                        {backgroundColor: '#ECFDF5'},
                      ]}>
                      <FitIcon
                        type="MaterialCommunityIcons"
                        name="basket-outline"
                        size={20}
                        color="#059669"
                      />
                    </View>
                    <Text style={styles.sectionTitle}>Ingredients</Text>
                  </View>

                  <LinearGradient
                    colors={['#10B981', '#059669']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    style={styles.headerGradientPill}>
                    <Text style={styles.headerGradientPillText}>
                      Fresh Items
                    </Text>
                  </LinearGradient>
                </View>

                <View style={styles.htmlContentBox}>
                  <HTMLRender
                    source={{html: item?.diet_ingredients}}
                    contentWidth={DeviceWidth - 72}
                    tagsStyles={htmlTagStyles}
                  />
                </View>
              </AnimatedReanimated.View>
            ) : null}

            {/* Section 3: Instructions / Steps */}
            {item?.diet_direction ? (
              <AnimatedReanimated.View
                entering={FadeInDown.delay(260).duration(360).springify()}
                style={styles.detailsCardSection}>
                <LinearGradient
                  colors={['#FF2A54', '#E11D48']}
                  style={styles.cardAccentBar}
                />

                <View style={styles.cardHeaderContainer}>
                  <View style={styles.sectionTitleRow}>
                    <View
                      style={[
                        styles.titleIconBadge,
                        {backgroundColor: '#FFF1F2'},
                      ]}>
                      <FitIcon
                        type="MaterialCommunityIcons"
                        name="chef-hat"
                        size={20}
                        color="#E11D48"
                      />
                    </View>
                    <Text style={styles.sectionTitle}>Instructions</Text>
                  </View>

                  <LinearGradient
                    colors={['#FF2A54', '#E11D48']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    style={styles.headerGradientPill}>
                    <Text style={styles.headerGradientPillText}>
                      Step-by-Step
                    </Text>
                  </LinearGradient>
                </View>

                <View style={styles.htmlContentBox}>
                  <HTMLRender
                    source={{html: item?.diet_direction}}
                    contentWidth={DeviceWidth - 72}
                    tagsStyles={htmlTagStyles}
                  />
                </View>
              </AnimatedReanimated.View>
            ) : null}
          </View>
        </AnimatedReanimated.View>
      </ScrollView>
    </View>
  );
};

export default MealDetails;

const htmlTagStyles = {
  p: {
    color: '#374151',
    fontSize: 14,
    lineHeight: 23,
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    marginVertical: 4,
  },
  strong: {
    color: '#E11D48',
    fontSize: 14,
    fontFamily: Fonts.MONTSERRAT_BOLD,
  },
  li: {
    color: '#374151',
    fontSize: 14,
    lineHeight: 23,
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    marginVertical: 3,
  },
  ul: {
    color: '#374151',
    paddingLeft: 16,
  },
  ol: {
    color: '#374151',
    paddingLeft: 16,
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  heroImageContainer: {
    width: DeviceWidth,
    height: DeviceHeigth * 0.38,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  topActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop:
      Platform.OS === 'ios' ? 44 : (StatusBar.currentHeight || 24) - 35,
    width: '100%',
  },
  glassCircleButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  heroBadgesRow: {
    position: 'absolute',
    bottom: 42,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroRatingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.48)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  heroRatingText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
  },
  heroCalorieBadge: {
    borderRadius: 20,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: AppColor.RED,
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.35,
        shadowRadius: 6,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  heroCalorieGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  heroCalorieText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
  },
  contentSheet: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -28,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
  },
  recipeTitle: {
    fontSize: 22,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
    color: '#111827',
    lineHeight: 28,
    marginBottom: 10,
  },
  metricsBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  timeMetricBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F3FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
  },
  timeMetricText: {
    fontSize: 12,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
    color: '#6D28D9',
  },
  servingsMetricBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
  },
  servingsMetricText: {
    fontSize: 12,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
    color: '#059669',
  },
  healthMetricBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
  },
  healthMetricText: {
    fontSize: 12,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
    color: '#2563EB',
  },
  macrosContainer: {
    marginBottom: 22,
  },
  sectionHeaderTitle: {
    fontSize: 15.5,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  macrosRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  macroCard: {
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.04,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  macroIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  proteinCardBorder: {
    borderWidth: 1.5,
    borderColor: '#FECDD3',
  },
  carbsCardBorder: {
    borderWidth: 1.5,
    borderColor: '#FDE68A',
  },
  fatCardBorder: {
    borderWidth: 1.5,
    borderColor: '#E9D5FF',
  },
  macroValueText: {
    fontSize: 15.5,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
    color: '#111827',
    marginVertical: 2,
  },
  macroLabelText: {
    fontSize: 11,
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    fontWeight: '600',
    color: '#6B7280',
  },
  detailsCardSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 6},
        shadowOpacity: 0.06,
        shadowRadius: 14,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  cardAccentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4.5,
  },
  cardHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  titleIconBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
    color: '#111827',
  },
  headerGradientPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  headerGradientPillText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  htmlContentBox: {
    marginTop: 2,
  },
});
