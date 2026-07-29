import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {ExerciseData} from '../NewWorkouts/Exercise/ExerciseUtilities/useExerciseHook';
// import NativeAddTest from '../../Component/NativeAd';
import {DeviceHeigth} from '../../Component/Config';
import {Fonts} from '../../Component/Color';
import {localImage} from '../../Component/Image';
import FitIcon from '../../Component/Utilities/FitIcon';
import {showMessage} from 'react-native-flash-message';
import WorkoutsDescription from '../NewWorkouts/WorkoutsDescription';
import CircleProgress from '../../Component/Utilities/ProgressCircle';
import {downloadVideos, EmptyComponent} from './categoriesHelper';
import {AnalyticsConsole} from '../../Component/AnalyticsConsole';
import {useFocusEffect, useNavigation} from '@react-navigation/native';

type ListProps = {
  exerciseData: Array<ExerciseData>;
  switchButton: boolean;
  CategoryDetails: any;
  selectedExIDs: Array<number>;
  setSeletedExIDs: Function;
  progressPercent: number;
  setProgressPercent: Function;
};

type RenderItemProps = {
  item: ExerciseData;
  index: number;
  switchButton: boolean;
  handleSelect: (id: number) => void;
  isSelected: boolean;
  progressPercent: number;
  onPlay: (item: ExerciseData) => void;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
};

type PlayProps = {
  progressPercent: number;
  currentIndex: number;
  index: number;
  onPlay: () => void;
};

const AnimatedCard = ({
  index = 0,
  style,
  onPress,
  children,
}: {
  index?: number;
  style?: any;
  onPress: () => void;
  children?: React.ReactNode;
}) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(16);
  const scale = useSharedValue(1);

  useEffect(() => {
    const delay = Math.min(index, 6) * 55;
    opacity.value = withDelay(delay, withTiming(1, {duration: 320}));
    translateY.value = withDelay(delay, withTiming(0, {duration: 320}));
  }, []);

  const enterStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{translateY: translateY.value}],
  }));
  const pressStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  return (
    <Animated.View style={enterStyle}>
      <Animated.View style={pressStyle}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={style}
          onPressIn={() => {
            scale.value = withTiming(0.97, {duration: 100});
          }}
          onPressOut={() => {
            scale.value = withSpring(1, {damping: 14, stiffness: 220});
          }}
          onPress={onPress}>
          {children}
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};

const PlaySelect = ({
  onPlay,
  progressPercent,
  currentIndex,
  index,
}: PlayProps) => {
  const isActive =
    currentIndex === index && progressPercent > 0 && progressPercent < 100;

  if (isActive) {
    return (
      <TouchableOpacity onPress={onPlay} style={styles.actionWrap}>
        <CircleProgress
          radius={14}
          progress={progressPercent}
          strokeWidth={3}
          secondayCircleColor="#FFD9E0"
          containerStyle={{padding: 0}}>
          <Image
            source={localImage.ExercisePlay}
            tintColor="#E11D48"
            resizeMode="contain"
            style={{width: 14, height: 14, marginLeft: 2}}
          />
        </CircleProgress>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity onPress={onPlay} style={styles.actionWrap}>
      <LinearGradient
        colors={['#FF2A54', '#E11D48']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.playCircle}>
        <Image
          source={localImage.ExercisePlay}
          tintColor="#FFFFFF"
          resizeMode="contain"
          style={{width: 14, height: 14, marginLeft: 2}}
        />
      </LinearGradient>
    </TouchableOpacity>
  );
};

const RenderItem = ({
  index,
  item,
  switchButton,
  isSelected,
  progressPercent,
  currentIndex,
  onPlay,
  handleSelect,
  setCurrentIndex,
}: RenderItemProps) => {
  const time = parseInt(item?.exercise_rest.split(' ')[0]);
  const [visible, setVisible] = useState(false);

  const onSelect = () => {
    switchButton ? handleSelect(item.exercise_id) : setVisible(true);
  };
  const onPlayPress = () => {
    setCurrentIndex(index);
    onPlay(item);
  };

  return (
    <>
      <AnimatedCard index={index} style={styles.card} onPress={onSelect}>
        <LinearGradient
          colors={['#FF2A54', '#E11D48']}
          style={styles.cardAccent}
        />
        <View style={styles.cardImage}>
          <Image
            style={{
              width: '100%',
              height: '100%',
              justifyContent: 'center',
              alignSelf: 'center',
            }}
            source={{
              uri: item?.exercise_image_link ?? localImage.NOWORKOUT,
            }}
            resizeMode={'contain'}
          />
        </View>
        <View style={styles.cardTextWrap}>
          <Text numberOfLines={1} style={styles.cardTitle}>
            {item?.exercise_title}
          </Text>
          <View style={styles.cardMetaRow}>
            <View style={[styles.metaBadge, styles.timeBadge]}>
              <FitIcon
                type="MaterialCommunityIcons"
                name="clock-outline"
                size={12}
                color="#7C3AED"
              />
              <Text style={[styles.metaBadgeText, {color: '#7C3AED'}]}>
                {'1 x ' +
                  (time > 60
                    ? Math.floor(time / 60) + ' min'
                    : time + ' sec')}
              </Text>
            </View>
            <View style={[styles.metaBadge, styles.setBadge]}>
              <FitIcon
                type="MaterialCommunityIcons"
                name="repeat"
                size={12}
                color="#059669"
              />
              <Text style={[styles.metaBadgeText, {color: '#059669'}]}>
                {'Set ' + item?.exercise_sets}
              </Text>
            </View>
          </View>
        </View>
        {switchButton ? (
          <TouchableOpacity
            onPress={onSelect}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
            style={[
              styles.checkboxChip,
              isSelected && styles.checkboxChipActive,
            ]}>
            {isSelected && (
              <FitIcon
                type="MaterialCommunityIcons"
                name="check-circle"
                color="#E11D48"
                size={20}
              />
            )}
            {!isSelected && (
              <FitIcon
                type="MaterialCommunityIcons"
                name="checkbox-blank-circle-outline"
                color="#9CA3AF"
                size={20}
              />
            )}
          </TouchableOpacity>
        ) : (
          <PlaySelect
            progressPercent={progressPercent}
            onPlay={onPlayPress}
            currentIndex={currentIndex}
            index={index}
          />
        )}
      </AnimatedCard>
      <WorkoutsDescription data={item} open={visible} setOpen={setVisible} />
    </>
  );
};

const CategoriesList = ({
  exerciseData,
  switchButton,
  CategoryDetails,
  selectedExIDs,
  setSeletedExIDs,
  progressPercent,
  setProgressPercent,
}: ListProps) => {
  const navigation: any = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(-1);

  const handleProgress = (value: number) => setProgressPercent(value);

  useFocusEffect(
    useCallback(() => {
      setCurrentIndex(-1);
    }, []),
  );

  const onPlay = (item: ExerciseData) => {
    AnalyticsConsole('S_E_S_WC');
    downloadVideos(item, 1, handleProgress).finally(() => {
      navigation.navigate('Exercise', {
        allExercise: [item],
        currentExercise: item,
        data: CategoryDetails,
        day: -12,
        exerciseNumber: 0,
        trackerData: [],
        type: 'focus',
        challenge: false,
        isEventPage: false,
      });
    });
  };

  const handleSelect = useCallback(
    (id: number) => {
      const newSelectedItems = new Set(selectedExIDs);
      if (newSelectedItems.has(id)) {
        newSelectedItems.delete(id);
      } else {
        if (selectedExIDs.length > 9) {
          showMessage({
            message: 'You can select upto 10 exercises at a time.',
            type: 'info',
            animationDuration: 500,
            floating: true,
          });
          return;
        }
        newSelectedItems.add(id);
      }
      setSeletedExIDs(Array.from(newSelectedItems));
    },
    [selectedExIDs],
  );

  return (
    <View style={{flex: 1}}>
      <Text style={styles.resultCountText}>
        {exerciseData?.length ?? 0} Exercises
      </Text>
      <FlatList
        data={exerciseData}
        keyExtractor={item => item.exercise_id.toString()}
        ListEmptyComponent={<EmptyComponent />}
        contentContainerStyle={{paddingTop: 8, paddingBottom: DeviceHeigth * 0.1}}
        renderItem={({item, index}: {item: ExerciseData; index: number}) => (
          <RenderItem
            key={index}
            index={index}
            item={item}
            switchButton={switchButton}
            handleSelect={handleSelect}
            isSelected={selectedExIDs.includes(item.exercise_id)}
            progressPercent={progressPercent}
            onPlay={onPlay}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  resultCountText: {
    marginBottom: 4,
    marginLeft: 20,
    fontSize: 12,
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    color: '#9CA3AF',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    marginHorizontal: 16,
    marginBottom: 10,
    paddingVertical: 10,
    paddingLeft: 20,
    paddingRight: 14,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.06,
        shadowRadius: 10,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  cardAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4.5,
  },
  cardImage: {
    width: 58,
    height: 58,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  cardTextWrap: {
    flex: 1,
    marginHorizontal: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 19,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    color: '#111827',
  },
  cardMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9,
    marginRight: 6,
    marginTop: 2,
    borderWidth: 1,
  },
  timeBadge: {
    backgroundColor: '#F5F3FF',
    borderColor: '#DDD6FE',
  },
  setBadge: {
    backgroundColor: '#D1FAE5',
    borderColor: '#A7F3D0',
  },
  metaBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
    marginLeft: 4,
  },
  actionWrap: {
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    ...Platform.select({
      ios: {
        shadowColor: '#FF2A54',
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.35,
        shadowRadius: 6,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  checkboxChip: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  checkboxChipActive: {
    backgroundColor: '#FFF1F2',
    borderColor: '#FECDD3',
  },
});

export default CategoriesList;
