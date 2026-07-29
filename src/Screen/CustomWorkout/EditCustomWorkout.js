import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import React, {useEffect, useMemo, useState} from 'react';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../Component/Config';
import {AppColor, Fonts} from '../../Component/Color';
import {useDispatch, useSelector} from 'react-redux';
import AnimatedReanimated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeInDown,
  Layout,
} from 'react-native-reanimated';
import {Image} from 'react-native';
import {localImage} from '../../Component/Image';
import axios from 'axios';
import {showMessage} from 'react-native-flash-message';
import ActivityLoader from '../../Component/ActivityLoader';
import AnimatedLottieView from 'lottie-react-native';
import {setCustomWorkoutData} from '../../Component/ThemeRedux/Actions';
import VersionNumber from 'react-native-version-number';
import {translate} from '../Translation/TranslationService';
import FitIcon from '../../Component/Utilities/FitIcon';
import {ArrowLeft} from '../../Component/Utilities/Arrows/Arrow';
import Wrapper from '../WorkoutCompleteScreen/Wrapper';

// --- Body Part Icon Map ---
const getBodyPartIcon = (title) => {
  const name = title?.toLowerCase() || '';
  if (name.includes('bicep')) return {type: 'MaterialCommunityIcons', name: 'arm-flex'};
  if (name.includes('tricep')) return {type: 'MaterialCommunityIcons', name: 'arm-flex'};
  if (name.includes('forearm')) return {type: 'MaterialCommunityIcons', name: 'arm-flex'};
  if (name.includes('chest')) return {type: 'MaterialCommunityIcons', name: 'dumbbell'};
  if (name.includes('back')) return {type: 'MaterialCommunityIcons', name: 'human-handsup'};
  if (name.includes('leg') || name.includes('calv') || name.includes('quad')) return {type: 'MaterialCommunityIcons', name: 'run'};
  if (name.includes('cardio')) return {type: 'MaterialCommunityIcons', name: 'heart-pulse'};
  if (name.includes('abs') || name.includes('core')) return {type: 'MaterialCommunityIcons', name: 'lightning-bolt'};
  if (name.includes('shoulder')) return {type: 'MaterialCommunityIcons', name: 'dumbbell'};
  if (name.includes('full') || name.includes('body')) return {type: 'MaterialCommunityIcons', name: 'fire'};
  return {type: 'MaterialCommunityIcons', name: 'dumbbell'};
};

// --- Exercise Card Component ---
const ExerciseCard = ({item, index, isSelected, onSelect, getStoreVideoLoc}) => {
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

  const exerciseImageUri = getStoreVideoLoc?.[item?.exercise_title + 'Image']
    ? 'file://' + getStoreVideoLoc[item?.exercise_title + 'Image']
    : item?.exercise_image_link ?? localImage.NOWORKOUT;

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
          styles.exerciseCardContainer,
          isSelected && styles.exerciseCardSelected,
        ]}>
        {/* Left Accent Bar */}
        <LinearGradient
          colors={isSelected ? ['#10B981', '#059669'] : ['#FF2A54', '#E11D48']}
          style={styles.cardAccentBar}
        />

        <View style={styles.cardContentRow}>
          {/* Exercise Image */}
          <View
            style={[
              styles.exerciseImageWrapper,
              isSelected && {borderColor: '#A7F3D0', backgroundColor: '#ECFDF5'},
            ]}>
            <Image
              style={styles.exerciseImage}
              source={{uri: exerciseImageUri}}
              defaultSource={localImage.NOWORKOUT}
              resizeMode={'contain'}
            />
          </View>

          {/* Exercise Info */}
          <View style={styles.exerciseInfoColumn}>
            <Text numberOfLines={1} style={styles.exerciseTitleText}>
              {item?.exercise_title}
            </Text>

            {/* Micro Pills Row */}
            <View style={styles.exerciseBadgesRow}>
              <View style={styles.exerciseTimePill}>
                <FitIcon
                  type="AntDesign"
                  name="clockcircle"
                  size={10}
                  color="#7C3AED"
                />
                <Text style={styles.exerciseTimePillText}>
                  {item?.exercise_rest || '30s'}
                </Text>
              </View>

              <View style={styles.exerciseBodyPill}>
                <FitIcon
                  type="MaterialCommunityIcons"
                  name="arm-flex"
                  size={11}
                  color="#059669"
                />
                <Text style={styles.exerciseBodyPillText}>
                  {item?.exercise_bodypart || 'Muscle'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Selection Checkbox Toggle */}
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

// --- Animated Perfect Category Filter Tab Item ---
const BodyPartTabItem = ({item, index, isActive, onPress, totalItems}) => {
  const iconConfig = getBodyPartIcon(item.bodypart_title);
  const scale = useSharedValue(1);

  useEffect(() => {
    if (isActive) {
      scale.value = withSpring(1.04, {damping: 14, stiffness: 260});
    } else {
      scale.value = withSpring(1, {damping: 14, stiffness: 260});
    }
  }, [isActive]);

  const animatedTabStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={{
        marginLeft: index === 0 ? 14 : 0,
        marginRight: index === totalItems - 1 ? 14 : 6,
      }}>
      <AnimatedReanimated.View style={animatedTabStyle}>
        {isActive ? (
          <LinearGradient
            colors={['#FF2A54', '#E11D48']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.tabGradientActive}>
            <View style={styles.tabIconCircleActive}>
              <FitIcon
                type={iconConfig.type}
                name={iconConfig.name}
                size={11.5}
                color="#E11D48"
              />
            </View>
            <Text style={styles.tabTextActive}>{item.bodypart_title}</Text>
          </LinearGradient>
        ) : (
          <View style={styles.tabPillInactive}>
            <View style={styles.tabIconCircleInactive}>
              <FitIcon
                type={iconConfig.type}
                name={iconConfig.name}
                size={11.5}
                color="#6B7280"
              />
            </View>
            <Text style={styles.tabTextInactive}>{item.bodypart_title}</Text>
          </View>
        )}
      </AnimatedReanimated.View>
    </TouchableOpacity>
  );
};

const EditCustomWorkout = ({navigation, route}) => {
  const data = route?.params?.item;
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch();
  const getUserDataDetails = useSelector(state => state.getUserDataDetails);
  const getAllExercise = useSelector(state => state.getAllExercise);
  const getStoreVideoLoc = useSelector(state => state.getStoreVideoLoc);
  const [workoutList, setWorkoutList] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [forLoading, setForLoading] = useState(false);
  const completeProfileData = useSelector(state => state.completeProfileData);
  const [bodyPart, setBodyPart] = useState(
    completeProfileData?.focusarea?.[0]?.bodypart_title || 'Biceps',
  );
  const [filteredCategories, setFilteredCategories] = useState([]);

  useEffect(() => {
    const datalist = getAllExercise?.filter(listdata => {
      if (bodyPart == 'Biceps') {
        return listdata.exercise_bodypart == 'Triceps';
      } else if (bodyPart == 'Quads') {
        return listdata.exercise_bodypart == 'Abs';
      } else if (bodyPart == 'Calves') {
        return listdata.exercise_bodypart == 'Legs';
      } else {
        return listdata.exercise_bodypart == bodyPart;
      }
    });

    setWorkoutList(datalist || []);
    setFilteredCategories(datalist || []);
  }, [bodyPart]);

  useEffect(() => {
    filterData();
  }, []);

  const filterData = () => {
    const ExerciseIds = [];
    data?.exercise_data?.map(item => ExerciseIds.push(item.exercise_id));
    setSelectedItems(ExerciseIds);
  };

  const renderItem1 = useMemo(
    () =>
      ({item, index}) => {
        const isSelected = selectedItems?.includes(item?.exercise_id);

        return (
          <ExerciseCard
            item={item}
            index={index}
            isSelected={isSelected}
            onSelect={() => selectedExercise(item?.exercise_id)}
            getStoreVideoLoc={getStoreVideoLoc}
          />
        );
      },
    [selectedItems, filteredCategories],
  );

  const emptyComponent = () => {
    return (
      <View style={styles.emptyContainer}>
        <AnimatedLottieView
          source={require('../../Icon/Images/NewImage/NoData.json')}
          speed={2}
          autoPlay
          loop
          resizeMode="contain"
          style={styles.emptyLottie}
        />
        <Text style={styles.emptyTitle}>No Exercises Found</Text>
        <Text style={styles.emptySubtitle}>
          Try selecting a different category tab above
        </Text>
      </View>
    );
  };

  const selectedExercise = data => {
    const index = selectedItems.indexOf(data);

    const newSelectedItems = [...selectedItems];
    if (index === -1) {
      newSelectedItems.push(data);
    } else {
      newSelectedItems.splice(index, 1);
    }

    setSelectedItems(newSelectedItems);
  };

  const submitCustomExercise = async () => {
    setForLoading(true);
    const payload = new FormData();

    for (var i = 0; i < selectedItems.length; i++) {
      payload.append('exercises[]', selectedItems[i]);
    }
    payload.append('workout_name', data?.workout_name);
    payload.append('user_id', getUserDataDetails?.id);
    payload.append('version', VersionNumber.appVersion);
    payload.append('custom_workout_id', data?.custom_workout_id);

    try {
      const res = await axios(`${NewAppapi.EDIT_CUSTOM_WORKOUY}`, {
        data: payload,
        method: 'post',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res?.data?.msg == 'data updated successfully') {
        showMessage({
          message: 'Workout updated successfully.',
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
        navigation.navigate('CustomWorkout');
      }
    } catch (error) {
      console.log('GET-USER-DATA', error);
      setForLoading(false);
    }
  };

  const updateFilteredCategories = test => {
    const filteredItems = workoutList.filter(item =>
      item.exercise_title.toLowerCase().includes(test.toLowerCase()),
    );

    setFilteredCategories(filteredItems);
  };

  // Sort list to show selected items first
  const displayData = useMemo(() => {
    return [
      ...filteredCategories.filter(item =>
        selectedItems.includes(item.exercise_id),
      ),
      ...filteredCategories.filter(
        item => !selectedItems.includes(item.exercise_id),
      ),
    ];
  }, [filteredCategories, selectedItems]);

  return (
    <View style={styles.container}>
      {forLoading ? <ActivityLoader /> : ''}
      <Wrapper styles={{backgroundColor: '#FDFDFD'}}>
        {/* Header Bar */}
        <View style={styles.topHeaderBarRow}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.goBack()}
            style={styles.backButtonCircle}>
            <ArrowLeft fillColor={AppColor.BLACK} />
          </TouchableOpacity>

          <View style={styles.headerTitleCenterColumn}>
            <Text style={styles.headerTitleText} numberOfLines={1}>
              {data?.workout_name || 'Edit Custom Workout'}
            </Text>
            <Text style={styles.headerSubtitleText}>
              Edit exercises in your plan
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

        {/* Search Bar */}
        <View style={styles.searchBarContainer}>
          <FitIcon
            type="FontAwesome5"
            name="search"
            size={14}
            color="#9CA3AF"
          />
          <TextInput
            placeholder="Search exercises..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={text => {
              setSearchQuery(text);
              updateFilteredCategories(text);
            }}
            style={styles.searchInput}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearchQuery('');
                updateFilteredCategories('');
              }}
              activeOpacity={0.7}>
              <FitIcon
                type="MaterialCommunityIcons"
                name="close-circle"
                size={18}
                color="#D1D5DB"
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Tight & Perfect Animated Segmented Top Tab Bar */}
        <View style={styles.segmentedTabTrackContainer}>
          <FlatList
            data={completeProfileData?.focusarea}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) => (
              <BodyPartTabItem
                item={item}
                index={index}
                isActive={bodyPart === item.bodypart_title}
                onPress={() => setBodyPart(item.bodypart_title)}
                totalItems={completeProfileData?.focusarea?.length}
              />
            )}
          />
        </View>

        {/* Animated Exercise List with Scroll & Filter Entrance Animations */}
        <AnimatedReanimated.FlatList
          data={displayData}
          itemLayoutAnimation={Layout.springify().damping(14).stiffness(200)}
          contentContainerStyle={{
            paddingBottom: 90,
            paddingTop: 4,
          }}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => item?.exercise_id?.toString() || index.toString()}
          renderItem={renderItem1}
          ListEmptyComponent={emptyComponent}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={100}
          removeClippedSubviews={Platform.OS === 'android'}
        />

        {/* Compact Floating Action Pill Button */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => submitCustomExercise()}
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
              {`Update Workout (${selectedItems?.length})`}
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

  // --- Search Bar ---
  searchBarContainer: {
    width: '92%',
    height: 44,
    alignSelf: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginTop: 8,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    gap: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.04,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 13,
    fontWeight: '600',
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    color: '#1F2937',
  },

  // --- Tight & Perfect Animated Segmented Top Tab Bar ---
  segmentedTabTrackContainer: {
    height: 36,
    marginTop: 2,
    marginBottom: 6,
    justifyContent: 'center',
  },
  tabGradientActive: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 32,
    borderRadius: 16,
    gap: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    ...Platform.select({
      ios: {
        shadowColor: '#FF2A54',
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.3,
        shadowRadius: 5,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  tabIconCircleActive: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabTextActive: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: Fonts.MONTSERRAT_BOLD,
  },
  tabPillInactive: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 5,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.03,
        shadowRadius: 3,
      },
      android: {
        elevation: 1.5,
      },
    }),
  },
  tabIconCircleInactive: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabTextInactive: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
  },

  // --- Exercise Card ---
  exerciseCardContainer: {
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
  exerciseCardSelected: {
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
  exerciseImageWrapper: {
    width: 66,
    height: 66,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
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
  exerciseImage: {
    width: 58,
    height: 58,
    borderRadius: 14,
  },
  exerciseInfoColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  exerciseTitleText: {
    fontSize: 15.5,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  exerciseBadgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  exerciseTimePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F3FF',
    paddingHorizontal: 9,
    paddingVertical: 3.5,
    borderRadius: 9,
    gap: 4,
    borderWidth: 1,
    borderColor: '#DDD6FE',
  },
  exerciseTimePillText: {
    fontSize: 11,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
    color: '#7C3AED',
  },
  exerciseBodyPill: {
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
  exerciseBodyPillText: {
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

  // --- Empty State ---
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: DeviceHeigth * 0.05,
  },
  emptyLottie: {
    width: DeviceWidth * 0.45,
    height: DeviceHeigth * 0.3,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    fontFamily: Fonts.MONTSERRAT_BOLD,
    marginTop: -20,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    marginTop: 6,
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

export default EditCustomWorkout;
