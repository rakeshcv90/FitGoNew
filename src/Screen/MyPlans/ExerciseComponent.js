import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AnimatedLottieView from 'lottie-react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {localImage} from '../../Component/Image';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import {AppColor, Fonts} from '../../Component/Color';
import WorkoutsDescription from '../NewWorkouts/WorkoutsDescription';
import {translate} from '../Translation/TranslationService';

export const ExerciseComponetWithoutEvents = ({
  dayObject,
  day,
  onPress,
  WeekStatus,
  getWeeklyPlansData,
  download,
  isClicked,
  setIsClicked,
  overExerciseVisible,
}) => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const insets = useSafeAreaInsets();

  const renderExerciseItem = ({item, index}) => {
    const time = parseInt(item?.exercise_rest?.split(' ')[0]) || 0;
    const timeDisplay =
      time > 60 ? `${Math.floor(time / 60)} min` : `${time} sec`;

    return (
      <TouchableOpacity
        key={index}
        activeOpacity={0.88}
        style={styles.exerciseCard}
        onPress={() => {
          setData(item);
          setOpen(true);
        }}>
        {/* Left Thumbnail Image */}
        <View style={styles.thumbWrapper}>
          <Image
            source={{uri: item?.exercise_image_link}}
            style={styles.thumbImage}
            resizeMode="contain"
            defaultSource={localImage.NOWORKOUT}
          />
        </View>

        {/* Middle Content */}
        <View style={styles.cardContent}>
          <Text numberOfLines={1} style={styles.cardTitle}>
            {item?.exercise_title}
          </Text>

          {/* Badges Row */}
          <View style={styles.badgeRow}>
            <View style={[styles.badge, styles.timeBadge]}>
              <Icon name="clock-outline" size={12} color="#7C3AED" />
              <Text style={[styles.badgeText, {color: '#7C3AED'}]}>
                1 x {timeDisplay}
              </Text>
            </View>

            <View style={[styles.badge, styles.setBadge]}>
              <Icon name="repeat" size={12} color="#059669" />
              <Text style={[styles.badgeText, {color: '#059669'}]}>
                Set {item?.exercise_sets}
              </Text>
            </View>
          </View>
        </View>

        {/* Right Info Icon */}
        <View style={styles.infoCircleBtn}>
          <Icon name="chevron-right" size={20} color="#9CA3AF" />
        </View>
      </TouchableOpacity>
    );
  };

  if (WeekStatus.includes(day)) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.completedWrapper}>
          <AnimatedLottieView
            source={require('../../Icon/Images/NewImage/Subscription.json')}
            autoPlay
            loop={false}
            style={styles.lottie}
          />

          <View style={styles.completedCard}>
            <Image
              source={{uri: getWeeklyPlansData[day]?.image}}
              style={styles.completedImage}
              resizeMode="contain"
              defaultSource={localImage.NOWORKOUT}
            />
            <View style={styles.completedBadge}>
              <Icon name="check-circle" size={14} color="#FFFFFF" />
              <Text style={styles.completedBadgeText}>Completed</Text>
            </View>
            <Text style={styles.completedTitle}>
              {getWeeklyPlansData[day]?.title}
            </Text>
            <Text style={styles.completedDay}>{day}</Text>
          </View>

          <Text style={styles.completedText}>
            Great job! You finished your{' '}
            <Text style={styles.completedTextBold}>{day}</Text> workout.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={dayObject?.exercises}
        ListHeaderComponent={
          <>
            {/* Header Hero Banner Card */}
            <View style={styles.heroCard}>
              <View style={styles.heroRow}>
                <View style={styles.heroImgRing}>
                  <Image
                    source={{uri: dayObject?.image}}
                    style={styles.heroImg}
                    resizeMode="contain"
                    defaultSource={localImage?.NOWORKOUT}
                  />
                </View>

                <View style={styles.heroInfo}>
                  <Text numberOfLines={1} style={styles.heroTitle}>
                    {dayObject?.title ?? 'Power Hour'}
                  </Text>
                  <View style={styles.dayPill}>
                    <Icon name="calendar-today" size={12} color="#FF2A54" />
                    <Text style={styles.dayPillText}>{day ?? 'Monday'}</Text>
                  </View>
                </View>
              </View>

              {/* Start Workout CTA Button */}
              <TouchableOpacity
                activeOpacity={0.88}
                onPress={onPress}
                style={styles.startBtnTouch}>
                <LinearGradient
                  colors={['#FF2A54', '#E11D48']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.startBtnGradient}>
                  <View style={styles.playIconWrap}>
                    <Icon name="play" size={16} color="#E11D48" />
                  </View>
                  <Text style={styles.startBtnText}>
                    {translate('startworkout')}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Exercises List Title */}
            <View style={styles.listHeaderRow}>
              <Text style={styles.listHeaderTitle}>
                {dayObject?.exercises?.length ?? 0} Exercises
              </Text>
            </View>
          </>
        }
        renderItem={renderExerciseItem}
        keyExtractor={(item, index) =>
          item?.exercise_id?.toString() || index.toString()
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 140,
          paddingHorizontal: DeviceWidth * 0.04,
        }}
      />
      <WorkoutsDescription
        data={data}
        open={open}
        setOpen={setOpen}
        id={data.exercise_id}
      />
    </SafeAreaView>
  );
};

export const ExerciseComponentWithEvent = ({
  dayObject,
  day,
  onPress,
  navigation,
  dayWiseCoins,
  WeekArray,
  getWeeklyPlansData,
  selectedDay,
  currentDay,
  download,
  overExerciseVisible,
}) => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const insets = useSafeAreaInsets();

  const renderExerciseItem = ({item, index}) => {
    const time = parseInt(item?.exercise_rest?.split(' ')[0]) || 0;
    const timeDisplay =
      time > 60 ? `${Math.floor(time / 60)} min` : `${time} sec`;

    return (
      <TouchableOpacity
        key={index}
        activeOpacity={0.88}
        style={styles.exerciseCard}
        onPress={() => {
          setData(item);
          setOpen(true);
        }}>
        {/* Left Thumbnail Image */}
        <View style={styles.thumbWrapper}>
          <Image
            source={{uri: item?.exercise_image_link || ''}}
            style={styles.thumbImage}
            resizeMode="contain"
            defaultSource={localImage.NOWORKOUT}
          />
        </View>

        {/* Middle Content */}
        <View style={styles.cardContent}>
          <Text numberOfLines={1} style={styles.cardTitle}>
            {item?.exercise_title}
          </Text>

          {/* Badges Row */}
          <View style={styles.badgeRow}>
            <View style={[styles.badge, styles.timeBadge]}>
              <Icon name="clock-outline" size={12} color="#7C3AED" />
              <Text style={[styles.badgeText, {color: '#7C3AED'}]}>
                1 x {timeDisplay}
              </Text>
            </View>

            <View style={[styles.badge, styles.setBadge]}>
              <Icon name="repeat" size={12} color="#059669" />
              <Text style={[styles.badgeText, {color: '#059669'}]}>
                Set {item?.exercise_sets}
              </Text>
            </View>
          </View>
        </View>

        {/* Right Info Icon */}
        <View style={styles.infoCircleBtn}>
          <Icon name="chevron-right" size={20} color="#9CA3AF" />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      {dayWiseCoins[day] == null || dayWiseCoins[day] < 0 ? (
        <>
          <FlatList
            data={dayObject?.exercises}
            ListHeaderComponent={
              <>
                {/* Hero Banner */}
                <View style={styles.heroCard}>
                  <View style={styles.heroRow}>
                    <View style={styles.heroImgRing}>
                      <Image
                        source={{uri: dayObject?.image}}
                        style={styles.heroImg}
                        resizeMode="contain"
                        defaultSource={localImage?.NOWORKOUT}
                      />
                    </View>

                    <View style={styles.heroInfo}>
                      <Text numberOfLines={1} style={styles.heroTitle}>
                        {dayObject?.title ?? 'Power Hour'}
                      </Text>
                      <View style={styles.dayPill}>
                        <Icon name="calendar-today" size={12} color="#FF2A54" />
                        <Text style={styles.dayPillText}>{day ?? '--'}</Text>
                      </View>
                    </View>
                  </View>

                  {day === WeekArray[currentDay] && (
                    <TouchableOpacity
                      activeOpacity={0.88}
                      onPress={onPress}
                      style={styles.startBtnTouch}>
                      <LinearGradient
                        colors={['#FF2A54', '#E11D48']}
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 0}}
                        style={styles.startBtnGradient}>
                        <View style={styles.playIconWrap}>
                          <Icon name="play" size={16} color="#E11D48" />
                        </View>
                        <Text style={styles.startBtnText}>
                          {translate('startworkout')}
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  )}
                </View>

                {/* Exercises List Title */}
                <View style={styles.listHeaderRow}>
                  <Text style={styles.listHeaderTitle}>
                    {dayObject?.exercises?.length ?? 0} Exercises
                  </Text>
                </View>
              </>
            }
            renderItem={renderExerciseItem}
            keyExtractor={(item, index) =>
              item?.exercise_id?.toString() || index.toString()
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: insets.bottom + 120,
              paddingHorizontal: DeviceWidth * 0.04,
            }}
          />
          <WorkoutsDescription data={data} open={open} setOpen={setOpen} />
        </>
      ) : (
        <View style={styles.completedEventCard}>
          <AnimatedLottieView
            source={require('../../Icon/Images/RedTick.json')}
            speed={1}
            autoPlay
            loop
            resizeMode="contain"
            style={styles.completedLottie}
          />
          <Text style={styles.completedEventTitle}>Workout Completed</Text>
          <Text style={styles.completedEventSub}>{day}</Text>
          <View style={styles.completedDivider} />
          <View style={styles.completedFooterRow}>
            <Image
              source={
                getWeeklyPlansData[WeekArray[selectedDay]]?.image == null
                  ? localImage.NOWORKOUT
                  : {
                      uri: getWeeklyPlansData[WeekArray[selectedDay]]?.image,
                    }
              }
              style={styles.completedFooterImg}
              resizeMode="contain"
            />
            <Text style={styles.completedFooterTitle}>
              {getWeeklyPlansData[day]?.title ?? 'Completed'}
            </Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },

  // ── Hero Banner Card ────────────────────────────────
  heroCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    marginTop: 12,
    marginBottom: 10,
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
        elevation: 3,
      },
    }),
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 14,
  },
  heroImgRing: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FFF1F2',
    borderWidth: 2,
    borderColor: 'rgba(255, 42, 84, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroImg: {
    width: 54,
    height: 54,
  },
  heroInfo: {
    flex: 1,
  },
  heroTitle: {
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  dayPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1F2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    gap: 4,
  },
  dayPillText: {
    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
    fontSize: 12,
    fontWeight: '600',
    color: '#FF2A54',
  },

  // ── Start Workout Button ───────────────────────────
  startBtnTouch: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#FF2A54',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  startBtnGradient: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  playIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  startBtnText: {
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // ── List Header ────────────────────────────────────
  listHeaderRow: {
    marginVertical: 10,
    paddingHorizontal: 4,
  },
  listHeaderTitle: {
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontSize: 15,
    fontWeight: '700',
    color: '#374151',
  },

  // ── Exercise Item Card ─────────────────────────────
  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F3F4F6',
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
  thumbWrapper: {
    width: 64,
    height: 64,
    borderRadius: 14,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbImage: {
    width: 54,
    height: 54,
  },
  cardContent: {
    flex: 1,
    marginLeft: 12,
    marginRight: 6,
  },
  cardTitle: {
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 4,
  },
  timeBadge: {
    backgroundColor: '#F3E8FF',
  },
  setBadge: {
    backgroundColor: '#D1FAE5',
  },
  badgeText: {
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontSize: 11,
    fontWeight: '700',
  },
  infoCircleBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ── Completed Screen Styles ────────────────────────
  completedWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: DeviceWidth * 0.06,
    backgroundColor: '#F5F5F7',
  },
  lottie: {
    width: DeviceWidth * 0.6,
    height: DeviceWidth * 0.6,
    position: 'absolute',
    top: DeviceWidth * 0.05,
  },
  completedCard: {
    width: DeviceWidth * 0.88,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
    marginBottom: 24,
  },
  completedImage: {
    height: 90,
    width: 90,
    marginBottom: 16,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: '#FFF1F2',
    backgroundColor: '#FFF1F2',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 5,
    marginBottom: 12,
    gap: 4,
  },
  completedBadgeText: {
    color: '#FFFFFF',
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontSize: 12,
    fontWeight: '700',
  },
  completedTitle: {
    color: '#111827',
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 4,
  },
  completedDay: {
    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
    color: '#6B7280',
    fontSize: 14,
    textAlign: 'center',
  },
  completedText: {
    fontFamily: Fonts.MONTSERRAT_REGULAR,
    color: '#4B5563',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  completedTextBold: {
    fontFamily: Fonts.MONTSERRAT_BOLD,
    color: '#111827',
  },

  // Event Completed Card
  completedEventCard: {
    width: DeviceWidth * 0.88,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 24,
    paddingHorizontal: 20,
    marginTop: DeviceHeigth * 0.04,
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
        elevation: 3,
      },
    }),
  },
  completedLottie: {
    width: 80,
    height: 80,
  },
  completedEventTitle: {
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginTop: 8,
  },
  completedEventSub: {
    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 2,
  },
  completedDivider: {
    width: '100%',
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 16,
  },
  completedFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  completedFooterImg: {
    width: 36,
    height: 36,
  },
  completedFooterTitle: {
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontSize: 15,
    fontWeight: '700',
    color: '#FF2A54',
  },
});
