/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  Platform,
  ImageBackground,
  StatusBar,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {AppColor, Fonts} from '../../Component/Color';
import {localImage} from '../../Component/Image';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import LinearGradient from 'react-native-linear-gradient';
import {useDispatch, useSelector} from 'react-redux';
import {setExerciseCount} from '../../Component/ThemeRedux/Actions';
import {useIsFocused} from '@react-navigation/native';
import AnimatedLottieView from 'lottie-react-native';
import {AnalyticsConsole} from '../../Component/AnalyticsConsole';
import {AddCountFunction} from '../../Component/Utilities/AddCountFunction';
import Wrapper from '../WorkoutCompleteScreen/Wrapper';
import NewHeader1 from '../../Component/Headers/NewHeader1';
import {translate} from '../Translation/TranslationService';
import AnimatedReanimated, {
  FadeInDown,
  FadeInRight,
  FadeInUp,
  Layout,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import FitIcon from '../../Component/Utilities/FitIcon';

const FocusCardPillItem = ({item, idx, onPress}: any) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: scale.value}],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.94, {damping: 12, stiffness: 220});
  };

  const handlePressOut = () => {
    scale.value = withSpring(1.0, {damping: 14, stiffness: 180});
  };

  return (
    <AnimatedReanimated.View
      entering={FadeInRight.delay(idx * 80)
        .duration(350)
        .springify()}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}>
        <AnimatedReanimated.View style={[animatedStyle]}>
          <LinearGradient
            colors={item.gradient}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={[styles.focusPillCardGradient, {shadowColor: item.accent}]}>
            <View style={styles.focusPillIconBox}>
              <Image
                source={item.image}
                defaultSource={localImage.NOWORKOUT}
                style={styles.focusPillImg}
                resizeMode="contain"
              />
            </View>

            <View style={styles.focusPillTextContainer}>
              <Text numberOfLines={1} style={styles.focusPillTitleTextWhite}>
                {item.title}
              </Text>
              <Text numberOfLines={2} style={styles.focusPillSubTextWhite}>
                {item.subTitle}
              </Text>
            </View>

            <View style={styles.focusPillArrowBadgeWhite}>
              <FitIcon
                name="arrow-forward"
                type="Ionicons"
                size={13}
                color="#FFFFFF"
              />
            </View>
          </LinearGradient>
        </AnimatedReanimated.View>
      </TouchableOpacity>
    </AnimatedReanimated.View>
  );
};

const CustomWorkoutBanner = ({navigation}: any) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: scale.value}],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.96, {damping: 12, stiffness: 220});
  };

  const handlePressOut = () => {
    scale.value = withSpring(1.0, {damping: 14, stiffness: 180});
  };

  const handlePress = () => {
    AnalyticsConsole(`CustomWrk_FR_WRK`);
    AddCountFunction();
    navigation.navigate('CustomWorkout', {routeName: 'Beginner'});
  };

  return (
    <AnimatedReanimated.View
      entering={FadeInDown.delay(200).duration(400).springify()}
      style={styles.sectionWrapper}>
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitleText}>{translate('customade')}</Text>
      </View>

      <TouchableOpacity
        activeOpacity={0.92}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}>
        <AnimatedReanimated.View style={[animatedStyle]}>
          <LinearGradient
            colors={['#667EEA', '#764BA2']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.customWorkoutCard}>
            {/* Ambient Lighting Overlay Circle */}
            <View style={styles.ambientGlowCircle} />

            <View style={styles.customWorkoutContent}>
              <View style={styles.customSparkTag}>
                <FitIcon
                  name="sparkles"
                  type="Ionicons"
                  size={12}
                  color="#F59E0B"
                />
                <Text style={styles.customSparkText}>TAILORED PLAN</Text>
              </View>

              <Text style={styles.customWorkoutTitle}>
                {translate('yourworkout')}
              </Text>
              <Text style={styles.customWorkoutSub}>
                {translate('customtext')}
              </Text>

              <View style={styles.customWorkoutPillBtn}>
                <Text style={styles.customWorkoutPillBtnText}>
                  Build Custom Plan
                </Text>
                <FitIcon
                  name="arrow-forward"
                  type="Ionicons"
                  size={14}
                  color="#667EEA"
                />
              </View>
            </View>

            <View style={styles.customWorkoutImgCircle}>
              <Image
                source={localImage.NewWorkout}
                style={styles.customWorkoutImg}
                resizeMode="contain"
              />
            </View>
          </LinearGradient>
        </AnimatedReanimated.View>
      </TouchableOpacity>
    </AnimatedReanimated.View>
  );
};

const CATEGORY_PALETTES = [
  {bg: '#EEF2FF', accent: '#667EEA', gradientEnd: '#C7D2FE'},
  {bg: '#FFF1F2', accent: '#FF6B6B', gradientEnd: '#FECDD3'},
  {bg: '#ECFDF5', accent: '#10B981', gradientEnd: '#A7F3D0'},
  {bg: '#FEF3C7', accent: '#F59E0B', gradientEnd: '#FDE68A'},
  {bg: '#ECFEFF', accent: '#06B6D4', gradientEnd: '#A5F3FC'},
  {bg: '#F3E8FF', accent: '#8B5CF6', gradientEnd: '#DDD6FE'},
  {bg: '#FFF7ED', accent: '#EA580C', gradientEnd: '#FED7AA'},
  {bg: '#FDF2F8', accent: '#EC4899', gradientEnd: '#FBCFE8'},
];

const CategorySquareCard = ({item, index, onPress}: any) => {
  const palette = CATEGORY_PALETTES[index % CATEGORY_PALETTES.length];
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, {damping: 12, stiffness: 200});
  };

  const handlePressOut = () => {
    scale.value = withSpring(1.0, {damping: 14, stiffness: 180});
  };

  return (
    <AnimatedReanimated.View
      style={styles.categorySquareWrapper}
      entering={FadeInUp.delay(Math.min(index * 50, 400))
        .duration(300)
        .springify()}>
      <TouchableOpacity
        activeOpacity={0.88}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}>
        <AnimatedReanimated.View
          style={[
            styles.categorySquareCard,
            {backgroundColor: palette.bg, shadowColor: palette.accent},
            animatedStyle,
          ]}>
          <View
            style={[
              styles.categorySquareIconBox,
              {borderColor: palette.accent + '20'},
            ]}>
            <Image
              source={item?.image}
              defaultSource={localImage.NOWORKOUT}
              style={styles.categorySquareImg}
              resizeMode="contain"
            />
          </View>

          <Text numberOfLines={1} style={styles.categorySquareTitle}>
            {item.title}
          </Text>

          <View
            style={[
              styles.categorySquareArrow,
              {backgroundColor: palette.accent + '15'},
            ]}>
            <FitIcon
              name="chevron-forward"
              type="Ionicons"
              size={14}
              color={palette.accent}
            />
          </View>
        </AnimatedReanimated.View>
      </TouchableOpacity>
    </AnimatedReanimated.View>
  );
};

const Workouts = ({navigation}: any) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const [currentCategories, setCurrentCategories] = useState<Array<any>>([]);

  const getUserDataDetails = useSelector(
    (state: any) => state.getUserDataDetails,
  );
  const getAllExercise = useSelector((state: any) => state.getAllExercise);
  const getChallengesData = useSelector(
    (state: any) => state.getChallengesData,
  );

  const MaleCategory = [
    {
      id: 230,
      title: translate('quickFit'),
      image: require('../../Icon/Images/WorkoutCategories/Quick_Fit.png'),
      category: 'Cardio',
    },
    {
      id: 231,
      title: translate('bodyBlast'),
      image: require('../../Icon/Images/WorkoutCategories/Body_Blast.png'),
      category: 'Chest/Back/Shoulders/Biceps/Triceps/Fourarms',
    },
    {
      id: 232,
      title: translate('flexFlow'),
      image: require('../../Icon/Images/WorkoutCategories/Flex_Flow.png'),
      category: 'Biceps/Triceps/Fourarms',
    },
    {
      id: 233,
      title: translate('lifeFit'),
      image: require('../../Icon/Images/WorkoutCategories/Fit_Life.png'),
      category: 'Legs/Cardio',
    },
    {
      id: 234,
      title: translate('blastBurn'),
      image: require('../../Icon/Images/WorkoutCategories/Blast_Burn.png'),
      category: 'Abs/Chest/Back',
    },
    {
      id: 235,
      title: translate('warriorWorkout'),
      image: require('../../Icon/Images/WorkoutCategories/Warrior_Workout.png'),
      category: 'Shoulders/Legs',
    },
    {
      id: 236,
      title: translate('dieselDrill'),
      image: require('../../Icon/Images/WorkoutCategories/Diesel_Drill.png'),
      category: 'Legs/Cardio/Abs/Back',
    },
    {
      id: 237,
      title: translate('beachReady'),
      image: require('../../Icon/Images/WorkoutCategories/Beach_Ready.png'),
      category: 'Abs/Chest',
    },
  ];

  const FemaleCategory = [
    {
      id: 230,
      title: translate('cardioQueen'),
      image: require('../../Icon/Images/WorkoutCategories/Cardio_Queen.png'),
      category: 'Cardio/Abs',
    },
    {
      id: 231,
      title: translate('bootyBoost'),
      image: require('../../Icon/Images/WorkoutCategories/Booty_Boost.png'),
      category: 'Legs',
    },
    {
      id: 232,
      title: translate('sweatShine'),
      image: require('../../Icon/Images/WorkoutCategories/sweat.png'),
      category: 'Chest/Back/Fourarms/Biceps/Triceps',
    },
    {
      id: 233,
      title: translate('tummyToners'),
      image: require('../../Icon/Images/WorkoutCategories/Tummy_Toning.png'),
      category: 'Abs/Cardio',
    },
    {
      id: 234,
      title: translate('totalBodyBlitz'),
      image: require('../../Icon/Images/WorkoutCategories/Total_Body_Blitz.png'),
      category: 'Chest/Back/Fourarms/Biceps/Triceps/Legs',
    },
    {
      id: 235,
      title: translate('strongHer'),
      image: require('../../Icon/Images/WorkoutCategories/Strong_Her.png'),
      category: 'Chest/Fourarms/Biceps/Triceps',
    },
    {
      id: 236,
      title: translate('leanLadies'),
      image: require('../../Icon/Images/WorkoutCategories/Lean_Ladies.png'),
      category: 'Legs/Cardio/Abs',
    },
    {
      id: 237,
      title: translate('quickFitF'),
      image: require('../../Icon/Images/WorkoutCategories/Quick_FitF.png'),
      category: 'Cardio',
    },
  ];

  const getUperBodyFilOption = useSelector(
    (state: any) => state?.getUperBodyFilOption,
  );
  const getLowerBodyFilOpt = useSelector(
    (state: any) => state.getLowerBodyFilOpt,
  );
  const getCoreFiltOpt = useSelector((state: any) => state.getCoreFiltOpt);

  useEffect(() => {
    if (isFocused) {
      setCurrentCategories(
        getUserDataDetails?.gender === 'Female' ? FemaleCategory : MaleCategory,
      );
    }
  }, [isFocused]);

  const focuseArea = [
    {
      id: 238,
      title: translate('upperbody'),
      subTitle: 'Chest, Arms & Shoulders',
      image: require('../../Icon/Images/NewImage2/uperBody.png'),
      gradient: ['#667EEA', '#764BA2'],
      bg: '#EEF2FF',
      accent: '#667EEA',
      searchCriteria: ['Chest', 'Back', 'Shoulders', 'Arms'],
      searchCriteriaRedux: getUperBodyFilOption,
    },
    {
      id: 239,
      title: translate('lowerbody'),
      subTitle: 'Legs, Quads & Glutes',
      image: require('../../Icon/Images/NewImage2/lowerBody.png'),
      gradient: ['#FF6B6B', '#FF8E53'],
      bg: '#FFF1F2',
      accent: '#FF6B6B',
      searchCriteria: ['Legs', 'Quads', 'Calves'],
      searchCriteriaRedux: getLowerBodyFilOpt,
    },
    {
      id: 240,
      title: translate('stretch'),
      subTitle: 'Full Body Mobility',
      image: require('../../Icon/Images/NewImage2/fullBody.png'),
      gradient: ['#10B981', '#059669'],
      bg: '#ECFDF5',
      accent: '#10B981',
      searchCriteria: [],
      searchCriteriaRedux: [],
    },
    {
      id: 241,
      title: translate('core'),
      subTitle: 'Abs & Cardio Burn',
      image: require('../../Icon/Images/NewImage2/core.png'),
      gradient: ['#F59E0B', '#D97706'],
      bg: '#FEF3C7',
      accent: '#F59E0B',
      searchCriteria: ['Abs', 'Cardio'],
      searchCriteriaRedux: getCoreFiltOpt,
    },
  ];

  const shuffleArray = (array: Array<any>) => {
    let currentIndex = array.length,
      randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  };

  const getFilterCategory = (categories: string, exerciseBodyPart: string) => {
    return categories.split('/').includes(exerciseBodyPart);
  };

  const handleNavigation = (mydata: any) => {
    let bodyexercise: Array<any> = getAllExercise?.filter((item: any) =>
      getFilterCategory(mydata.category, item?.exercise_bodypart),
    );
    bodyexercise = shuffleArray(bodyexercise);

    AnalyticsConsole(`${mydata?.title?.split(' ')[0]}_W_CATE`);
    AddCountFunction();

    navigation.navigate('WorkoutCategories', {
      categoryExercise: bodyexercise,
      CategoryDetails: mydata,
    });
  };

  const renderItem = useMemo(() => {
    return ({item, index}: any) => (
      <CategorySquareCard
        item={item}
        index={index}
        onPress={() => handleNavigation(item)}
      />
    );
  }, []);

  const renderItem1 = useMemo(() => {
    return ({item, index}: any) => {
      const daysCount = Object.values(item?.days || {}).length;
      return (
        <AnimatedReanimated.View
          entering={FadeInUp.delay(Math.min(index * 100, 500))
            .duration(400)
            .springify()}>
          <TouchableOpacity
            activeOpacity={0.92}
            onPress={() => {
              AnalyticsConsole(`D_Wrk_DAYS_FR_Wrk`);
              AddCountFunction();
              navigation.navigate('WorkoutDays', {
                data: item,
                challenge: true,
              });
            }}
            style={styles.challengeCardWrapper}>
            <ImageBackground
              source={{uri: item?.workout_image_link}}
              style={styles.challengeCardImgBg}
              resizeMode="cover">
              <LinearGradient
                start={{x: 0, y: 0}}
                end={{x: 0, y: 1}}
                colors={['rgba(15, 23, 42, 0.25)', 'rgba(15, 23, 42, 0.92)']}
                style={styles.challengeCardGradientOverlay}>
                {/* Top Badge Row */}
                <View style={styles.challengeTopRow}>
                  <View style={styles.challengeLevelTag}>
                    <FitIcon
                      name="fire"
                      type="MaterialCommunityIcons"
                      size={13}
                      color="#FF5E00"
                    />
                    <Text style={styles.challengeLevelText}>CHALLENGE</Text>
                  </View>

                  <LinearGradient
                    colors={['#FF9500', '#FF5E00']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    style={styles.daysRibbonBadge}>
                    <FitIcon
                      name="calendar-clock"
                      type="MaterialCommunityIcons"
                      size={13}
                      color="#FFFFFF"
                    />
                    <Text style={styles.daysRibbonText}>{daysCount} DAYS</Text>
                  </LinearGradient>
                </View>

                {/* Bottom Content & Play Circle */}
                <View style={styles.challengeBottomRow}>
                  <View style={{flex: 1, marginRight: 12}}>
                    <Text numberOfLines={1} style={styles.challengeTitleText}>
                      {item?.title}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={styles.challengeSubTitleText}>
                      {item?.sub_title}
                    </Text>
                  </View>

                  <View style={styles.playCircleBtn}>
                    <FitIcon
                      name="play"
                      type="Ionicons"
                      size={18}
                      color="#667EEA"
                    />
                  </View>
                </View>
              </LinearGradient>
            </ImageBackground>
          </TouchableOpacity>
        </AnimatedReanimated.View>
      );
    };
  }, []);

  const emptyComponent = () => {
    return (
      <View style={styles.emptyStateContainer}>
        <AnimatedLottieView
          source={require('../../Icon/Images/NewImage/NoData.json')}
          speed={1.5}
          autoPlay
          loop
          resizeMode="contain"
          style={{
            width: DeviceWidth * 0.35,
            height: DeviceHeigth * 0.14,
          }}
        />
        <Text style={styles.emptyStateText}>No workouts available</Text>
      </View>
    );
  };

  const getbodyPartWorkout = (data: any) => {
    AddCountFunction();
    AnalyticsConsole(`${data?.bodypart_title}_FR_Wrk`);

    if (data?.title === translate('upperbody')) {
      let Ccount = 0,
        Bcount = 0,
        Acount = 0,
        Scount = 0;
      let exercises = getAllExercise?.filter((item: any) => {
        if (item?.exercise_bodypart === 'Shoulders') {
          Scount++;
          return true;
        } else if (
          item?.exercise_bodypart === 'Triceps' ||
          item?.exercise_bodypart === 'Forearms' ||
          item?.exercise_bodypart === 'Biceps'
        ) {
          Acount++;
          return true;
        } else if (item?.exercise_bodypart === 'Chest') {
          Ccount++;
          return true;
        } else if (item?.exercise_bodypart === 'Back') {
          Bcount++;
          return true;
        }
        return false;
      });
      dispatch(
        setExerciseCount({
          exCount1: Ccount,
          exCount2: Bcount,
          exCount3: Scount,
          exCount4: Acount,
        }),
      );
      navigation.navigate('NewFocusWorkouts', {
        focusExercises: exercises,
        focusedPart: data?.title,
        searchCriteria: ['Chest', 'Back', 'Shoulders', 'Arms'],
        searchCriteriaRedux: getUperBodyFilOption,
        CategoryDetails: data,
      });
    } else if (data?.title === translate('lowerbody')) {
      let Lcount = 0,
        Qcount = 0,
        Ccount = 0;
      let exercises = getAllExercise?.filter((item: any) => {
        if (item?.exercise_bodypart === 'Legs') {
          Lcount++;
          return true;
        } else if (item?.exercise_bodypart === 'Quads') {
          Qcount++;
          return true;
        } else if (item?.exercise_bodypart === 'Calves') {
          Ccount++;
          return true;
        }
        return false;
      });
      dispatch(
        setExerciseCount({
          exCount1: Lcount,
          exCount2: Qcount,
          exCount3: Ccount,
        }),
      );
      navigation.navigate('NewFocusWorkouts', {
        focusExercises: exercises,
        focusedPart: data?.title,
        searchCriteria: ['Legs', 'Quads', 'Calves'],
        searchCriteriaRedux: getLowerBodyFilOpt,
        CategoryDetails: data,
      });
    } else if (data?.title === translate('core')) {
      let Acount = 0,
        Ccount = 0;
      let exercises = getAllExercise?.filter((item: any) => {
        if (item?.exercise_bodypart === 'Abs') {
          Acount++;
          return true;
        } else if (item?.exercise_bodypart === 'Cardio') {
          Ccount++;
          return true;
        }
        return false;
      });
      dispatch(
        setExerciseCount({
          exCount1: Acount,
          exCount2: Ccount,
        }),
      );
      navigation.navigate('NewFocusWorkouts', {
        focusExercises: exercises,
        focusedPart: data?.title,
        searchCriteria: ['Abs', 'Cardio'],
        searchCriteriaRedux: getCoreFiltOpt,
        CategoryDetails: data,
      });
    } else {
      const stretchEx = getAllExercise.filter((item: any) =>
        item?.exercise_title?.toLowerCase()?.includes('stretch'),
      );
      navigation.navigate('NewFocusWorkouts', {
        focusExercises: stretchEx,
        focusedPart: data?.title,
        searchCriteria: [],
        searchCriteriaRedux: [],
        CategoryDetails: data,
      });
    }
  };

  return (
    <Wrapper styles={{backgroundColor: '#F8FAFC'}}>
      <StatusBar backgroundColor="#F8FAFC" barStyle="dark-content" />

      {/* Screen Header */}
      <NewHeader1 header={translate('workouts') || 'Workouts'} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 40}}>
        {/* Section 1: Focus Area (Body Type) 2x2 Premium Grid */}
        <AnimatedReanimated.View
          entering={FadeInDown.delay(100).duration(400).springify()}
          style={styles.sectionWrapper}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitleText}>{translate('bodytype')}</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.focusPillScroll}>
            {focuseArea.map((item, idx) => (
              <FocusCardPillItem
                key={idx}
                item={item}
                idx={idx}
                onPress={() => getbodyPartWorkout(item)}
              />
            ))}
          </ScrollView>
        </AnimatedReanimated.View>

        {/* Section 2: Custom Made Workout Banner */}
        <CustomWorkoutBanner navigation={navigation} />

        {/* Section 3: Workout Categories */}
        <AnimatedReanimated.View
          entering={FadeInDown.delay(300).duration(400).springify()}
          style={styles.sectionWrapper}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitleText}>
              {translate('workoutcategories')}
            </Text>
          </View>

          {currentCategories.length > 0 ? (
            <FlatList
              data={currentCategories}
              numColumns={2}
              scrollEnabled={false}
              keyExtractor={(_, index) => index.toString()}
              renderItem={renderItem}
              contentContainerStyle={{paddingHorizontal: 12, gap: 12}}
              columnWrapperStyle={{gap: 12}}
            />
          ) : (
            emptyComponent()
          )}
        </AnimatedReanimated.View>

        {/* Section 4: Workout Challenges */}
        <AnimatedReanimated.View
          entering={FadeInDown.delay(400).duration(400).springify()}
          style={styles.sectionWrapper}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitleText}>
              {translate('workoutchallenge')}
            </Text>
          </View>

          {getChallengesData?.length > 0 ? (
            <FlatList
              data={getChallengesData}
              showsVerticalScrollIndicator={false}
              keyExtractor={(_, index) => index.toString()}
              renderItem={renderItem1}
              contentContainerStyle={{gap: 14, paddingHorizontal: 16}}
            />
          ) : (
            emptyComponent()
          )}
        </AnimatedReanimated.View>
      </ScrollView>
    </Wrapper>
  );
};

export default Workouts;

const styles = StyleSheet.create({
  heroGreetingCard: {
    marginHorizontal: 16,
    marginTop: 6,
    marginBottom: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  heroGreetingTitle: {
    fontSize: 15,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '800',
    color: '#0F172A',
  },
  heroGreetingSub: {
    fontSize: 11.5,
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    color: '#64748B',
    marginTop: 2,
  },
  heroBadgeBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  sectionWrapper: {
    marginTop: 12,
  },
  sectionHeaderRow: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  sectionTitleText: {
    fontSize: 17,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '800',
    color: '#0F172A',
  },

  // Focus Area Horizontal Gradient Floating Card Pills
  focusPillScroll: {
    paddingHorizontal: 16,
    gap: 12,
  },
  focusPillCardGradient: {
    width: DeviceWidth * 0.64,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    padding: 12,
    paddingHorizontal: 14,
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 6,
  },
  focusPillIconBox: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    shadowColor: '#0F172A',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  focusPillImg: {
    width: '100%',
    height: '100%',
  },
  focusPillTextContainer: {
    flex: 1,
    marginHorizontal: 10,
  },
  focusPillTitleTextWhite: {
    fontSize: 15,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  focusPillSubTextWhite: {
    fontSize: 11,
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 2,
  },
  focusPillArrowBadgeWhite: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },

  // Custom Workout Card (Ultra-Premium Hero Banner)
  customWorkoutCard: {
    marginHorizontal: 16,
    borderRadius: 22,
    padding: 18,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#667EEA',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.32,
    shadowRadius: 16,
    elevation: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  ambientGlowCircle: {
    position: 'absolute',
    right: -30,
    top: -30,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  customWorkoutImgCircle: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 7,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    shadowColor: '#FFFFFF',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  customWorkoutContent: {
    flex: 1,
    marginRight: 8,
  },
  customSparkTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
    gap: 4,
    marginBottom: 6,
  },
  customSparkText: {
    fontSize: 9.5,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    color: '#FFFFFF',
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  customWorkoutTitle: {
    fontSize: 17,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  customWorkoutSub: {
    fontSize: 11.5,
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    color: '#E0E7FF',
    marginTop: 2,
    lineHeight: 16,
  },
  customWorkoutPillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginTop: 10,
    gap: 5,
    shadowColor: '#0F172A',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  customWorkoutPillBtnText: {
    fontSize: 11,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    color: '#667EEA',
    fontWeight: '800',
  },
  customWorkoutImg: {
    width: 72,
    height: 72,
  },

  // Categories Grid
  categoriesGrid: {
    marginVertical: 2,
  },
  categorySquareWrapper: {
    flex: 1,
  },
  categorySquareCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 10,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  categorySquareIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6,
    borderWidth: 1,
  },
  categorySquareImg: {
    width: '100%',
    height: '100%',
  },
  categorySquareTitle: {
    fontSize: 12.5,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    color: '#1E293B',
    fontWeight: '700',
    flex: 1,
    marginHorizontal: 8,
  },
  categorySquareArrow: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Challenge Cards (Compact Height)
  challengeCardWrapper: {
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  challengeCardImgBg: {
    width: '100%',
    height: DeviceHeigth * 0.21,
  },
  challengeCardGradientOverlay: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 14,
  },
  challengeTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  challengeLevelTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  challengeLevelText: {
    fontSize: 9.5,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    color: '#FFFFFF',
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  daysRibbonBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    gap: 4,
    shadowColor: '#FF5E00',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  daysRibbonText: {
    fontSize: 11,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  challengeBottomRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  challengeTitleText: {
    fontSize: 19,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  challengeSubTitleText: {
    fontSize: 12,
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    color: '#E2E8F0',
    marginTop: 1,
  },
  playCircleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 2,
    shadowColor: '#0F172A',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },

  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  emptyStateText: {
    fontSize: 12,
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    color: '#64748B',
    marginTop: 4,
  },
});
