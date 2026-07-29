/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  FlatList,
  ActivityIndicator,
  BackHandler,
  Platform,
} from 'react-native';
import React, {useState, useMemo, useEffect} from 'react';
import {AppColor, Fonts} from '../../Component/Color';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../Component/Config';
import {BlurView} from '@react-native-community/blur';
import {useDispatch, useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import {localImage} from '../../Component/Image';
import AnimatedLottieView from 'lottie-react-native';
import ActivityLoader from '../../Component/ActivityLoader';
import axios from 'axios';
import VersionNumber from 'react-native-version-number';
import {
  setCustomWorkoutData,
  setVideoLocation,
} from '../../Component/ThemeRedux/Actions';
import {showMessage} from 'react-native-flash-message';
import {useIsFocused} from '@react-navigation/native';
import RNFetchBlob from 'rn-fetch-blob';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import {AnalyticsConsole} from '../../Component/AnalyticsConsole';
import Wrapper from '../WorkoutCompleteScreen/Wrapper';
import {ArrowLeft} from '../../Component/Utilities/Arrows/Arrow';
import FitIcon from '../../Component/Utilities/FitIcon';
import AnimatedReanimated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeInDown,
} from 'react-native-reanimated';
import {translate} from '../Translation/TranslationService';

const CustomWorkoutDetails = ({navigation, route}) => {
  const data = route?.params?.item;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [forLoading, setForLoading] = useState(false);
  const [trackerData, setTrackerData] = useState([]);
  const [downloaded, setDownloade] = useState(false);
  const [backBlock, setBackBlock] = useState(false);
  const [VideoDownload, setVideoDownload] = useState(0);

  const getPurchaseHistory = useSelector(state => state.getPurchaseHistory);
  const getUserDataDetails = useSelector(state => state.getUserDataDetails);
  const dispatch = useDispatch();
  let isFocuse = useIsFocused();

  useEffect(() => {
    if (isFocuse) {
      getExerciseTrackAPI();
    }
  }, [isFocuse]);

  const sanitizeFileName = fileName => {
    fileName = fileName.replace(/\s+/g, '_');
    return fileName;
  };

  let StoringData = {};
  let downloadCounter = 0;
  const downloadVideos = async (dataItem, index, len) => {
    const filePath = `${RNFetchBlob.fs.dirs.CacheDir}/${sanitizeFileName(
      dataItem?.exercise_title,
    )}.mp4`;
    try {
      const videoExists = await RNFetchBlob.fs.exists(filePath);
      if (videoExists) {
        StoringData[dataItem?.exercise_title] = filePath;
        setDownloade(true);
        downloadCounter++;
        setVideoDownload((downloadCounter / len) * 100);
      } else {
        await RNFetchBlob.config({
          fileCache: true,
          path: filePath,
          appendExt: '.mp4',
        })
          .fetch('GET', dataItem?.exercise_video, {
            'Content-Type': 'application/mp4',
          })
          .then(res => {
            StoringData[dataItem?.exercise_title] = res.path();
            setDownloade(true);
            downloadCounter++;
            setVideoDownload((downloadCounter / len) * 100);
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

  const getExerciseTrackAPI = async () => {
    const payload = new FormData();
    payload.append('user_id', getUserDataDetails?.id);
    payload.append('workout_id', route?.params?.item?.custom_workout_id);
    payload.append('user_day', -10);
    payload.append('version', VersionNumber.appVersion);

    try {
      const res = await axios({
        url: NewAppapi.TRACK_CURRENT_DAY_EXERCISE,
        method: 'Post',
        data: payload,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        lang: 'en',
      });

      if (res?.data?.msg == 'Please update the app to the latest version.') {
        showMessage({
          message: res?.data?.msg,
          type: 'danger',
          animationDuration: 500,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
      } else if (res.data?.user_details) {
        setTrackerData(res.data?.user_details);
      } else {
        setTrackerData([]);
      }
    } catch (error) {
      console.error(error, 'PostDaysAPIERror');
      setTrackerData([]);
    }
  };

  const postCurrentDayAPI = async () => {
    let datas = [];
    let trainingCount = -1;
    trainingCount = trackerData.findIndex(
      item => item?.exercise_status == 'undone',
    );

    for (const exercise of data?.exercise_data) {
      datas.push({
        user_id: getUserDataDetails?.id,
        workout_id: data?.custom_workout_id,
        user_day: -10,
        user_exercise_id: exercise?.exercise_id,
      });
    }

    Promise.all(
      data?.exercise_data.map((item, index) =>
        downloadVideos(item, index, data?.exercise_data.length),
      ),
    ).finally(async () => {
      try {
        const res = await axios({
          url: NewAppapi.CURRENT_DAY_EXERCISE,
          method: 'Post',
          data: {user_details: datas, type: 'custom'},
          lang: 'en',
        });

        if (res.data) {
          setBackBlock(false);
          if (
            res.data?.msg ==
            'Exercise Status for All Users Inserted Successfully'
          ) {
            setDownloade(false);
            navigation.navigate('Exercise', {
              allExercise: data?.exercise_data,
              currentExercise:
                trainingCount != -1
                  ? data?.exercise_data[trainingCount]
                  : data?.exercise_data[0],
              data: data,
              day: -10,
              exerciseNumber: trainingCount != -1 ? trainingCount : 0,
              trackerData: res?.data?.inserted_data,
              type: 'custom',
              challenge: false,
              isEventPage: false,
            });
          } else {
            setDownloade(false);
            navigation.navigate('Exercise', {
              allExercise: data?.exercise_data,
              currentExercise:
                trainingCount != -1
                  ? data?.exercise_data[trainingCount]
                  : data?.exercise_data[0],
              data: data,
              day: -10,
              exerciseNumber: trainingCount != -1 ? trainingCount : 0,
              trackerData: trackerData,
              type: 'custom',
              challenge: false,
              isEventPage: false,
            });
          }
        }
      } catch (error) {
        console.error(error, 'PostDaysAPIERror');
      }
    });
  };

  const ExerciseItemCard = ({item, index, onPress}: any) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{scale: scale.value}],
    }));

    const onPressIn = () => {
      scale.value = withSpring(0.96, {damping: 14, stiffness: 280});
    };

    const onPressOut = () => {
      scale.value = withSpring(1, {damping: 14, stiffness: 280});
    };

    const rawTime = parseInt(item?.exercise_rest?.split(' ')[0]) || 30;
    const formattedTime =
      rawTime > 60 ? Math.floor(rawTime / 60) + ' min' : rawTime + ' sec';

    return (
      <AnimatedReanimated.View
        entering={FadeInDown.delay((index % 8) * 60)
          .duration(360)
          .springify()}
        style={[animatedStyle]}>
        <TouchableOpacity
          activeOpacity={0.92}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          onPress={onPress}
          style={styles.exerciseCard}>
          <View style={styles.exerciseCardInner}>
            {/* Image Thumbnail Container */}
            <View style={styles.exerciseImageWrapper}>
              <Image
                style={styles.exerciseImage}
                source={{
                  uri: item?.exercise_image_link ?? localImage.NOWORKOUT,
                }}
                resizeMode={'contain'}
              />
            </View>

            {/* Exercise Title & Details */}
            <View style={styles.exerciseInfoColumn}>
              <Text numberOfLines={1} style={styles.exerciseTitleText}>
                {item?.exercise_title}
              </Text>

              {/* Time & Sets Pill Badges */}
              <View style={styles.exerciseBadgesRow}>
                <View style={styles.timePill}>
                  <FitIcon
                    type="AntDesign"
                    name="clockcircle"
                    size={10}
                    color="#E11D48"
                  />
                  <Text style={styles.timePillText}>1 x {formattedTime}</Text>
                </View>

                <View style={styles.setsPill}>
                  <FitIcon
                    type="MaterialCommunityIcons"
                    name="repeat"
                    size={11}
                    color="#7C3AED"
                  />
                  <Text style={styles.setsPillText}>
                    {item?.exercise_sets} Sets
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Right Action Chevron Button */}
          <View style={styles.exerciseChevronCircle}>
            <FitIcon
              type="MaterialCommunityIcons"
              name="chevron-right"
              size={20}
              color="#6B7280"
            />
          </View>
        </TouchableOpacity>
      </AnimatedReanimated.View>
    );
  };

  const renderItem = useMemo(
    () =>
      ({item, index}) => {
        return (
          <ExerciseItemCard
            item={item}
            index={index}
            onPress={() => {
              AnalyticsConsole(`${item?.exercise_title?.split(' ')[0]}_DESC`);
              navigation.navigate('WorkoutDetail', {item: item});
            }}
          />
        );
      },
    [trackerData],
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
          style={{
            width: DeviceWidth * 0.5,
            height: DeviceHeigth * 0.4,
          }}
        />
      </View>
    );
  };

  const deleteCustomeWorkout = async () => {
    setForLoading(true);
    setIsMenuOpen(false);

    try {
      const response = await axios.get(
        `${NewAppapi.DELETE_CUSTOM_WORKOUT}?user_id=${getUserDataDetails.id}&custom_workout_id=${data?.custom_workout_id}&version=${VersionNumber.appVersion}`,
      );

      if (response?.data?.msg == 'data deleted successfully') {
        getUserDetailData();
        showMessage({
          message: 'Workout deleted successfully.',
          type: 'success',
          animationDuration: 500,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
      } else {
        setForLoading(false);
        showMessage({
          message: response?.data?.msg,
          type: 'danger',
          animationDuration: 500,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
      }
    } catch (error) {
      setForLoading(false);
      showMessage({
        message: 'Something went wrong please try again',
        type: 'danger',
        animationDuration: 500,
        floating: true,
        icon: {icon: 'auto', position: 'left'},
      });
      console.log('Custom Workout Delete Error', error);
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
        navigation.goBack();
      }
    } catch (error) {
      console.log('GET-USER-DATA', error);
      setForLoading(false);
    }
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true,
    );
    return () => backHandler.remove();
  }, []);

  return (
    <>
      <Wrapper>
        {/* Navigation Bar */}
        <View style={styles.navigationHeader}>
          <TouchableOpacity
            style={styles.navCircleBtn}
            onPress={() => {
              if (backBlock) {
                showMessage({
                  message:
                    'Please wait, downloading in progress. Do not press back.',
                  type: 'info',
                  animationDuration: 500,
                  floating: true,
                  icon: {icon: 'auto', position: 'left'},
                });
              } else {
                navigation?.goBack();
              }
            }}>
            <ArrowLeft fillColor={AppColor.BLACK} />
          </TouchableOpacity>

          <Text style={styles.navHeaderTitle}>Workout Details</Text>

          <TouchableOpacity
            style={styles.navCircleBtn}
            onPress={() => {
              setIsMenuOpen(true);
            }}>
            <FitIcon
              type="MaterialCommunityIcons"
              name="dots-vertical"
              size={22}
              color="#111827"
            />
          </TouchableOpacity>
        </View>

        {forLoading ? <ActivityLoader /> : null}

        <View style={styles.container}>
          <View style={styles.mainContentPadding}>
            {/* Hero Workout Header Card */}
            <View style={styles.heroWorkoutCard}>
              <LinearGradient
                colors={['#FF2A54', '#E11D48']}
                style={styles.heroAccentBar}
              />
              <View style={styles.heroRow}>
                <View style={styles.heroImageWrapper}>
                  <Image
                    source={
                      data?.image == '' || !data?.image
                        ? localImage.NOWORKOUT
                        : {uri: data?.image}
                    }
                    defaultSource={localImage.NOWORKOUT}
                    style={styles.heroImage}
                    resizeMode="cover"
                  />
                </View>

                <View style={styles.heroInfoColumn}>
                  <Text numberOfLines={1} style={styles.heroTitleText}>
                    {data?.workout_name}
                  </Text>
                  <View style={styles.heroBadgePill}>
                    <FitIcon
                      type="MaterialCommunityIcons"
                      name="dumbbell"
                      size={12}
                      color="#E11D48"
                    />
                    <Text style={styles.heroBadgeText}>
                      {data?.total_exercises} Exercises
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Exercises Section Header */}
            <View style={styles.sectionHeaderRow}>
              <LinearGradient
                colors={['#FF2A54', '#E11D48']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.sectionBadgeIcon}>
                <FitIcon
                  type="MaterialCommunityIcons"
                  name="format-list-bulleted"
                  size={16}
                  color="#FFFFFF"
                />
              </LinearGradient>
              <Text style={styles.sectionTitleText}>Exercises</Text>
            </View>

            {/* Exercise FlatList */}
            <FlatList
              data={data?.exercise_data}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderItem}
              ListEmptyComponent={emptyComponent}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              updateCellsBatchingPeriod={100}
              removeClippedSubviews={true}
              contentContainerStyle={{paddingBottom: DeviceHeigth * 0.25}}
              showsVerticalScrollIndicator={false}
            />
          </View>

          {data?.exercise_data?.length > 0 && (
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={() => {
                setBackBlock(true);
                postCurrentDayAPI();
              }}
              style={styles.floatingStartBtn}>
              <LinearGradient
                colors={['#FF2A54', '#E11D48']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.floatingStartGradient}>
                <View style={styles.floatingStartIconCircle}>
                  <FitIcon
                    type="MaterialCommunityIcons"
                    name="play"
                    size={18}
                    color="#E11D48"
                  />
                </View>
                <Text style={styles.floatingStartText}>
                  {VideoDownload > 0 && VideoDownload < 100
                    ? `Downloading ${Math.round(VideoDownload)}%`
                    : 'Start Workout'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      </Wrapper>

      {/* Options Dropdown Menu Modal */}
      <Modal
        animationType="fade"
        visible={isMenuOpen}
        transparent={true}
        onRequestClose={() => {
          setIsMenuOpen(!isMenuOpen);
        }}>
        <TouchableOpacity
          style={styles.menuModalBackdrop}
          activeOpacity={1}
          onPress={() => setIsMenuOpen(false)}>
          <View style={styles.menuPopupCard}>
            <TouchableOpacity
              onPress={() => {
                setIsMenuOpen(false);
                AnalyticsConsole(`Custom_EDIT_BUTTON`);
                navigation.navigate('EditCustomWorkout', {item: data});
              }}
              style={styles.menuOptionRow}>
              <View
                style={[
                  styles.menuOptionIconCircle,
                  {backgroundColor: '#F3F4F6'},
                ]}>
                <FitIcon
                  type="MaterialCommunityIcons"
                  name="pencil"
                  size={16}
                  color="#111827"
                />
              </View>
              <Text style={styles.menuOptionText}>Edit Workout</Text>
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            <TouchableOpacity
              onPress={() => {
                AnalyticsConsole(`Custom_DEL_BUTTON`);
                deleteCustomeWorkout();
              }}
              style={styles.menuOptionRow}>
              <View
                style={[
                  styles.menuOptionIconCircle,
                  {backgroundColor: '#FFF1F2'},
                ]}>
                <FitIcon
                  type="MaterialCommunityIcons"
                  name="trash-can-outline"
                  size={16}
                  color="#E11D48"
                />
              </View>
              <Text style={[styles.menuOptionText, {color: '#E11D48'}]}>
                Delete Workout
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default CustomWorkoutDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFDFD',
  },
  navigationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  navCircleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navHeaderTitle: {
    fontSize: 17,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
    color: '#111827',
  },
  mainContentPadding: {
    width: '94%',
    alignSelf: 'center',
    flex: 1,
  },
  heroWorkoutCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 14,
    marginVertical: 10,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 6},
        shadowOpacity: 0.06,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  heroAccentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4.5,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingLeft: 4,
  },
  heroImageWrapper: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: AppColor.RED,
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.15,
        shadowRadius: 5,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  heroImage: {
    width: 66,
    height: 66,
    borderRadius: 17,
  },
  heroInfoColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  heroTitleText: {
    fontSize: 18,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  heroBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1F2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: 'flex-start',
    gap: 5,
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  heroBadgeText: {
    fontSize: 12,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
    color: '#E11D48',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 12,
  },
  sectionBadgeIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitleText: {
    fontSize: 18,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
    color: '#111827',
  },
  exerciseCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 12,
    marginVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  exerciseCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  exerciseImageWrapper: {
    width: 62,
    height: 62,
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  exerciseImage: {
    width: 54,
    height: 54,
  },
  exerciseInfoColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  exerciseTitleText: {
    fontSize: 16,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  exerciseBadgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1F2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 4,
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  timePillText: {
    fontSize: 11.5,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
    color: '#E11D48',
  },
  setsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F3FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 3,
    borderWidth: 1,
    borderColor: '#DDD6FE',
  },
  setsPillText: {
    fontSize: 11.5,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
    color: '#7C3AED',
  },
  exerciseChevronCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingStartBtn: {
    position: 'absolute',
    bottom: DeviceHeigth * 0.02,
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
  floatingStartGradient: {
    height: 48,
    paddingHorizontal: 20,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  floatingStartIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingStartText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  menuModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingRight: 16,
  },
  menuPopupCard: {
    width: 170,
    alignSelf: 'flex-end',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 6,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 8},
        shadowOpacity: 0.12,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  menuOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 10,
  },
  menuOptionIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuOptionText: {
    fontSize: 14,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
    color: '#111827',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 2,
    marginHorizontal: 8,
  },
});
