import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Platform,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {AppColor, Fonts} from '../../Component/Color';
import VersionNumber from 'react-native-version-number';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../Component/Config';
import {useDispatch, useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import {localImage} from '../../Component/Image';
import {showMessage} from 'react-native-flash-message';
import {useIsFocused} from '@react-navigation/native';
import ActivityLoader from '../../Component/ActivityLoader';
import AnimatedLottieView from 'lottie-react-native';
import axios from 'axios';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import {setVideoLocation} from '../../Component/ThemeRedux/Actions';
import RNFetchBlob from 'rn-fetch-blob';
import RewardModal from '../../Component/Utilities/RewardModal';
import UpcomingEventModal from '../../Component/Utilities/UpcomingEventModal';
import {AnalyticsConsole} from '../../Component/AnalyticsConsole';
import Wrapper from '../WorkoutCompleteScreen/Wrapper';
import FitIcon from '../../Component/Utilities/FitIcon';
import {ArrowLeft} from '../../Component/Utilities/Arrows/Arrow';
import {ReviewApp} from '../../Component/ReviewApp';
import NewHeader1 from '../../Component/Headers/NewHeader1';
import AnimatedReanimated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  withSequence,
  FadeInDown,
  FadeInRight,
  FadeInUp,
  FadeIn,
  SlideInRight,
  Layout,
  Easing,
} from 'react-native-reanimated';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

// Vibrant color palette for meditation categories
const VIBRANT_COLORS = [
  {color1: '#667EEA', color2: '#764BA2', glow: '#8B5CF6'},
  {color1: '#F093FB', color2: '#F5576C', glow: '#EC4899'},
  {color1: '#4FACFE', color2: '#00F2FE', glow: '#06B6D4'},
  {color1: '#43E97B', color2: '#38F9D7', glow: '#10B981'},
  {color1: '#FA709A', color2: '#FEE140', glow: '#F59E0B'},
  {color1: '#A18CD1', color2: '#FBC2EB', glow: '#A78BFA'},
];

// --- Animated Category Chip ---
const CategoryChip = ({item, index, isSelected, onPress}) => {
  const scale = useSharedValue(1);
  const chipColors = VIBRANT_COLORS[index % VIBRANT_COLORS.length];

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  const onPressIn = () => {
    scale.value = withSpring(0.9, {damping: 12, stiffness: 300});
  };
  const onPressOut = () => {
    scale.value = withSpring(1, {damping: 12, stiffness: 300});
  };

  return (
    <AnimatedReanimated.View
      entering={SlideInRight.delay(index * 90)
        .duration(450)
        .springify()
        .damping(13)
        .stiffness(200)}
      style={animatedStyle}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={onPress}>
        <LinearGradient
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          colors={[chipColors.color1, chipColors.color2]}
          style={[
            styles.categoryChip,
            isSelected && styles.categoryChipSelected,
          ]}>
          {/* Decorative glow circles */}
          <View
            style={[
              styles.chipGlowCircle,
              {top: -15, right: -10, backgroundColor: 'rgba(255,255,255,0.12)'},
            ]}
          />
          <View
            style={[
              styles.chipGlowCircle,
              {
                bottom: -20,
                left: -15,
                width: 50,
                height: 50,
                backgroundColor: 'rgba(255,255,255,0.08)',
              },
            ]}
          />

          {isSelected && (
            <View style={styles.chipCheckCircle}>
              <FitIcon
                type="MaterialCommunityIcons"
                name="check-bold"
                size={10}
                color="#FFFFFF"
              />
            </View>
          )}

          <FitIcon
            type="MaterialCommunityIcons"
            name="meditation"
            size={22}
            color="rgba(255,255,255,0.9)"
          />
          <Text style={styles.categoryChipText} numberOfLines={1}>
            {item.workout_mindset_title}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </AnimatedReanimated.View>
  );
};

// --- Meditation Session Card ---
const MeditationCard = ({item, index, onPress}) => {
  const scale = useSharedValue(1);
  const cardColors = VIBRANT_COLORS[index % VIBRANT_COLORS.length];
  const [imgError, setImgError] = useState(false);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  const onPressIn = () => {
    scale.value = withSpring(0.96, {damping: 14, stiffness: 280});
  };
  const onPressOut = () => {
    scale.value = withSpring(1, {damping: 14, stiffness: 280});
  };

  const hasValidImage =
    item.exercise_mindset_image_link != null &&
    item.exercise_mindset_image_link !== '' &&
    item.exercise_mindset_image_link.trim().length > 0 &&
    !imgError;

  return (
    <AnimatedReanimated.View
      entering={FadeInDown.delay((index % 6) * 70)
        .duration(400)
        .springify()
        .damping(13)
        .stiffness(220)}
      layout={Layout.springify().damping(14).stiffness(200)}
      style={animatedStyle}>
      <TouchableOpacity
        activeOpacity={0.92}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={onPress}
        style={styles.meditationCard}>
        {/* Always render vibrant gradient background */}
        <LinearGradient
          colors={[cardColors.color1, cardColors.color2]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={StyleSheet.absoluteFill}>
          {/* Decorative orbs */}
          <View
            style={{
              position: 'absolute',
              top: -20,
              right: 60,
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: 'rgba(255,255,255,0.12)',
            }}
          />
          <View
            style={{
              position: 'absolute',
              bottom: -30,
              left: 40,
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: 'rgba(255,255,255,0.08)',
            }}
          />
          <View
            style={{
              position: 'absolute',
              top: 10,
              left: '38%',
              width: 45,
              height: 45,
              borderRadius: 25,
              backgroundColor: 'rgba(255,255,255,0.1)',
            }}
          />
        </LinearGradient>

        {/* Image overlay (only if valid image) */}
        {hasValidImage && (
          <ImageBackground
            source={{uri: item.exercise_mindset_image_link}}
            style={StyleSheet.absoluteFill}
            imageStyle={styles.cardImageStyle}
            resizeMode="cover"
            onError={() => setImgError(true)}>
            <LinearGradient
              colors={[
                'transparent',
                'rgba(0,0,0,0.15)',
                'rgba(0,0,0,0.65)',
                'rgba(0,0,0,0.9)',
              ]}
              locations={[0, 0.3, 0.65, 1]}
              style={StyleSheet.absoluteFill}
            />
          </ImageBackground>
        )}

        {/* Card content (always on top) */}
        <View style={styles.cardGradientOverlay}>
          {/* Play Button */}
          <View style={styles.playButtonContainer}>
            <View style={styles.playButtonGlow}>
              <LinearGradient
                colors={[cardColors.color1, cardColors.color2]}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                style={styles.playButtonGradient}>
                <FitIcon type="Ionicons" name="play" size={20} color="#FFFFFF" />
              </LinearGradient>
            </View>
          </View>

          {/* Bottom Info */}
          <View style={styles.cardBottomRow}>
            <View style={styles.cardTitleColumn}>
              <Text style={styles.cardTitle} numberOfLines={2}>
                {item.exercise_mindset_title}
              </Text>
              <View style={styles.cardMetaRow}>
                <LinearGradient
                  colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.1)']}
                  style={styles.metaPillGradient}>
                  <FitIcon
                    type="MaterialCommunityIcons"
                    name="clock-outline"
                    size={11}
                    color="#FFFFFF"
                  />
                  <Text style={styles.metaPillTextWhite}>
                    {item.exercise_mindset_time || '5'} min
                  </Text>
                </LinearGradient>

                <LinearGradient
                  colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.1)']}
                  style={styles.metaPillGradient}>
                  <FitIcon
                    type="MaterialCommunityIcons"
                    name="meditation"
                    size={11}
                    color="#FFFFFF"
                  />
                  <Text style={styles.metaPillTextWhite}>Mindfulness</Text>
                </LinearGradient>
              </View>
            </View>

            {/* Index Badge */}
            <View style={styles.indexBadge}>
              <Text style={styles.indexBadgeText}>
                {String(index + 1).padStart(2, '0')}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </AnimatedReanimated.View>
  );
};

const MeditationDetails = ({navigation, route}) => {
  let isFocused = useIsFocused();
  const customWorkoutData = useSelector(state => state.customWorkoutData);
  const getPurchaseHistory = useSelector(state => state.getPurchaseHistory);
  const [forLoading, setForLoading] = useState(true);
  const [mindsetExercise, setmindsetExercise] = useState([]);
  const [headerTitle, setHeaderTitle] = useState(route?.params?.item);
  const [selectedTitle, setSelectedTitle] = useState(
    route?.params?.item?.workout_mindset_title,
  );

  const [downloaded, setDownloade] = useState(0);
  const avatarRef = React.createRef();
  const allWorkoutData = useSelector(state => state.allWorkoutData);
  const enteredCurrentEvent = useSelector(state => state?.enteredCurrentEvent);
  const enteredUpcomingEvent = useSelector(
    state => state?.enteredUpcomingEvent,
  );
  const getOfferAgreement = useSelector(state => state?.getOfferAgreement);
  const dispatch = useDispatch();

  useEffect(() => {
    ReviewApp(temp);
  }, []);

  const temp = () => {};

  useEffect(() => {
    if (isFocused) {
      if (route?.params?.item) {
        getCaterogy(
          route?.params?.item.id,
          route?.params?.item.workout_mindset_level,
        );
      }
      setDownloade(0);
    }
  }, [isFocused]);

  const getCaterogy = async (id, level) => {
    setForLoading(true);
    try {
      const data = await axios(`${NewAppapi.Get_Mindset_Excise}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: {
          workout_mindset_id: id,
          health_level: level,
          version: VersionNumber.appVersion,
        },
      });

      if (data?.data?.msg == 'Please update the app to the latest version.') {
        showMessage({
          message: data?.data?.msg,
          type: 'danger',
          animationDuration: 500,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
        setForLoading(false);
      } else if (data?.data?.status == 'data found') {
        setForLoading(false);
        setmindsetExercise(data.data);
      } else {
        setForLoading(false);
        setmindsetExercise([]);
      }
    } catch (error) {
      setForLoading(false);
      setmindsetExercise([]);
      console.log('MindSet  List Error', error);
    }
  };

  let StoringData = {};
  const downloadVideos = async (data, index, len) => {
    const filePath = `${RNFetchBlob.fs.dirs.CacheDir}/${data?.id}.mp3`;
    try {
      const videoExists = await RNFetchBlob.fs.exists(filePath);
      if (videoExists) {
        StoringData[data?.id] = filePath;
        setDownloade(100 / (len - index));
      } else {
        await RNFetchBlob.config({
          fileCache: true,
          path: filePath,
          appendExt: '.mp3',
        })
          .fetch('GET', data?.exercise_mindset_audio, {
            'Content-Type': 'application/mp4',
          })
          .then(res => {
            StoringData[data?.id] = res.path();
            setDownloade(100 / (len - index));
          })
          .catch(err => {
            console.log(err);
          });
      }
    } catch (error) {
      console.log('ERRRR', error);
    }
    dispatch(setVideoLocation(StoringData));
  };

  const EmptyComponent = () => {
    return (
      <View
        style={{
          alignSelf: 'center',
          marginTop: 30,
          width: DeviceWidth,
        }}>
        <AnimatedLottieView
          source={require('../../Icon/Images/NewImage/NoData.json')}
          speed={2}
          autoPlay
          loop
          resizeMode="contain"
          style={{
            width: DeviceWidth * 0.6,
            height: DeviceHeigth * 0.3,
            alignSelf: 'center',
          }}
        />
      </View>
    );
  };

  const ShimmerCard = () => (
    <View style={styles.shimmerCard}>
      <ShimmerPlaceholder
        ref={avatarRef}
        autoRun
        style={styles.shimmerFull}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'#FDFDFD'} />
      <Wrapper styles={{backgroundColor: '#FDFDFD'}}>
        {/* Original Header with ArrowLeft */}
        <NewHeader1 header={headerTitle?.workout_mindset_title} backButton />

        {/* Colorful Hero Banner */}
        <AnimatedReanimated.View
          entering={FadeIn.duration(500)}>
          <LinearGradient
            colors={['#667EEA', '#764BA2', '#F093FB']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.heroBanner}>
            {/* Decorative floating orbs */}
            <View style={[styles.floatingOrb, {top: -20, right: 30, width: 80, height: 80, backgroundColor: 'rgba(255,255,255,0.08)'}]} />
            <View style={[styles.floatingOrb, {bottom: -15, left: 20, width: 60, height: 60, backgroundColor: 'rgba(255,255,255,0.06)'}]} />
            <View style={[styles.floatingOrb, {top: 10, left: -10, width: 40, height: 40, backgroundColor: 'rgba(255,255,255,0.1)'}]} />

            <View style={styles.bannerContent}>
              <View style={styles.bannerTextColumn}>
                <Text style={styles.bannerTitle}>
                  🧘 Meditation
                </Text>
                <Text style={styles.bannerSubtitle}>
                  Calm your mind, find inner peace
                </Text>
                <View style={styles.bannerStatsRow}>
                  <View style={styles.bannerStat}>
                    <FitIcon type="MaterialCommunityIcons" name="play-circle" size={14} color="rgba(255,255,255,0.9)" />
                    <Text style={styles.bannerStatText}>
                      {mindsetExercise?.data?.length || 0} Sessions
                    </Text>
                  </View>
                  <View style={styles.bannerStatDivider} />
                  <View style={styles.bannerStat}>
                    <FitIcon type="MaterialCommunityIcons" name="clock-outline" size={14} color="rgba(255,255,255,0.9)" />
                    <Text style={styles.bannerStatText}>5-15 min</Text>
                  </View>
                </View>
              </View>
              <View style={styles.bannerIconCircle}>
                <FitIcon
                  type="MaterialCommunityIcons"
                  name="meditation"
                  size={36}
                  color="rgba(255,255,255,0.9)"
                />
              </View>
            </View>
          </LinearGradient>
        </AnimatedReanimated.View>

        {/* Categories Section */}
        <AnimatedReanimated.View
          entering={FadeInUp.delay(200).duration(400).springify()}
          style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleRow}>
              <LinearGradient
                colors={['#667EEA', '#764BA2']}
                style={styles.sectionIconBadge}>
                <FitIcon
                  type="MaterialCommunityIcons"
                  name="shape"
                  size={14}
                  color="#FFFFFF"
                />
              </LinearGradient>
              <Text style={styles.sectionTitleText}>Categories</Text>
            </View>
            <LinearGradient
              colors={['#EDE9FE', '#F5F3FF']}
              style={styles.sectionPill}>
              <Text style={[styles.sectionPillText, {color: '#7C3AED'}]}>
                {allWorkoutData?.mindset_workout_data?.length || 0} types
              </Text>
            </LinearGradient>
          </View>

          <FlatList
            data={allWorkoutData?.mindset_workout_data}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingVertical: 12,
              gap: 12,
            }}
            ListEmptyComponent={<EmptyComponent />}
            renderItem={({item, index}) => (
              <CategoryChip
                item={item}
                index={index}
                isSelected={headerTitle?.id == item?.id}
                onPress={() => {
                  setHeaderTitle(item);
                  getCaterogy(item.id, item.workout_mindset_level);
                  setSelectedTitle(item?.workout_mindset_title);
                }}
              />
            )}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            updateCellsBatchingPeriod={100}
            removeClippedSubviews={true}
          />
        </AnimatedReanimated.View>

        {/* Explore Section */}
        <AnimatedReanimated.View
          entering={FadeInUp.delay(350).duration(400).springify()}
          style={[styles.sectionContainer, {flex: 1}]}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleRow}>
              <LinearGradient
                colors={['#F093FB', '#F5576C']}
                style={styles.sectionIconBadge}>
                <FitIcon
                  type="MaterialCommunityIcons"
                  name="compass-outline"
                  size={14}
                  color="#FFFFFF"
                />
              </LinearGradient>
              <Text style={styles.sectionTitleText}>Explore</Text>
            </View>
            <LinearGradient
              colors={['#FFF1F2', '#FFF7ED']}
              style={styles.sectionPill}>
              <Text style={[styles.sectionPillText, {color: '#E11D48'}]}>
                {mindsetExercise?.data?.length || 0} sessions
              </Text>
            </LinearGradient>
          </View>

          {forLoading ? (
            <FlatList
              data={[1, 2, 3, 4]}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={{paddingHorizontal: 16, paddingBottom: 20}}
              renderItem={() => <ShimmerCard />}
            />
          ) : mindsetExercise?.data?.length > 0 ? (
            <FlatList
              data={mindsetExercise?.data}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={{paddingHorizontal: 16, paddingBottom: 30}}
              ListEmptyComponent={<EmptyComponent />}
              renderItem={({item, index}) => (
                <MeditationCard
                  item={item}
                  index={index}
                  onPress={() => {
                    navigation.navigate('MeditationExerciseDetails', {
                      index: index,
                      allMeditation: mindsetExercise?.data,
                    });
                  }}
                />
              )}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              updateCellsBatchingPeriod={100}
              removeClippedSubviews={true}
            />
          ) : (
            <EmptyComponent />
          )}
        </AnimatedReanimated.View>
      </Wrapper>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFDFD',
  },

  // --- Hero Banner ---
  heroBanner: {
    marginHorizontal: 16,
    marginTop: 2,
    marginBottom: 4,
    borderRadius: 20,
    padding: 14,
    overflow: 'hidden',
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: '#764BA2',
        shadowOffset: {width: 0, height: 8},
        shadowOpacity: 0.3,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  floatingOrb: {
    position: 'absolute',
    borderRadius: 999,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bannerTextColumn: {
    flex: 1,
    marginRight: 12,
  },
  bannerTitle: {
    fontSize: 19,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  bannerSubtitle: {
    fontSize: 12,
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
  },
  bannerStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bannerStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  bannerStatText: {
    fontSize: 11.5,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.9)',
  },
  bannerStatDivider: {
    width: 1,
    height: 14,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  bannerIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.2)',
  },

  // --- Section ---
  sectionContainer: {
    marginTop: 4,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 2,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sectionIconBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitleText: {
    fontSize: 17,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
    color: '#111827',
  },
  sectionPill: {
    paddingHorizontal: 10,
    paddingVertical: 4.5,
    borderRadius: 10,
  },
  sectionPillText: {
    fontSize: 10.5,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
  },

  // --- Category Chip ---
  categoryChip: {
    height: 82,
    width: 85,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 6},
        shadowOpacity: 0.15,
        shadowRadius: 10,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  categoryChipSelected: {
    borderWidth: 2.5,
    borderColor: 'rgba(255,255,255,0.6)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 8},
        shadowOpacity: 0.25,
        shadowRadius: 14,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  chipGlowCircle: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 999,
  },
  chipCheckCircle: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(255,255,255,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryChipText: {
    fontSize: 10.5,
    fontWeight: '700',
    fontFamily: Fonts.MONTSERRAT_BOLD,
    textTransform: 'uppercase',
    textAlign: 'center',
    color: '#FFFFFF',
    marginTop: 6,
    letterSpacing: 0.3,
  },

  // --- Meditation Card ---
  meditationCard: {
    width: '100%',
    height: DeviceHeigth * 0.17,
    borderRadius: 18,
    overflow: 'hidden',
    marginVertical: 5,
    ...Platform.select({
      ios: {
        shadowColor: '#764BA2',
        shadowOffset: {width: 0, height: 8},
        shadowOpacity: 0.18,
        shadowRadius: 14,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  cardImageBg: {
    width: '100%',
    height: '100%',
  },
  cardImageStyle: {
    borderRadius: 22,
  },
  cardGradientOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 16,
  },
  playButtonContainer: {
    position: 'absolute',
    top: 14,
    right: 14,
  },
  playButtonGlow: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.35)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  playButtonGradient: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBottomRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  cardTitleColumn: {
    flex: 1,
    marginRight: 10,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
    fontSize: 18,
    lineHeight: 23,
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 6,
  },
  cardMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaPillGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4.5,
    borderRadius: 10,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  metaPillTextWhite: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
  },
  indexBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  indexBadgeText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '800',
  },

  // --- Shimmer ---
  shimmerCard: {
    width: '100%',
    height: DeviceHeigth * 0.18,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    marginVertical: 6,
    overflow: 'hidden',
  },
  shimmerFull: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
  },
});

export default MeditationDetails;
