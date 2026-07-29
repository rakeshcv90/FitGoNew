/* eslint-disable react/no-unstable-nested-components */
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Modal,
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import NewHeader from '../../Component/Headers/NewHeader';
import {useSelector, useDispatch} from 'react-redux';
import {TouchableOpacity} from 'react-native';
import {AppColor, Fonts} from '../../Component/Color';
import LinearGradient from 'react-native-linear-gradient';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../Component/Config';
import {localImage} from '../../Component/Image';
import {TextInput} from 'react-native-paper';
import {showMessage} from 'react-native-flash-message';
import {PERMISSIONS, openSettings, request} from 'react-native-permissions';
import {launchImageLibrary} from 'react-native-image-picker';
import {useIsFocused} from '@react-navigation/native';
import VersionNumber from 'react-native-version-number';
import {
  setAllExercise,
  setChallengesData,
} from '../../Component/ThemeRedux/Actions';
import axios from 'axios';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import FitIcon from '../../Component/Utilities/FitIcon';
import AnimatedReanimated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeInDown,
} from 'react-native-reanimated';
import moment from 'moment';
import {AnalyticsConsole} from '../../Component/AnalyticsConsole';
import RewardModal from '../../Component/Utilities/RewardModal';
import UpcomingEventModal from '../../Component/Utilities/UpcomingEventModal';
import DietPlanHeader from '../../Component/Headers/DietPlanHeader';
import Wrapper from '../WorkoutCompleteScreen/Wrapper';
import NewHeader1 from '../../Component/Headers/NewHeader1';
import {translate} from '../Translation/TranslationService';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const CustomWorkout = ({navigation}) => {
  const avatarRef = React.createRef();
  const dispatch = useDispatch();
  const customWorkoutData = useSelector(state => state.customWorkoutData);

  const [isCustomWorkout, setIsCustomWorkout] = useState(false);
  const [text, setText] = React.useState('');
  const [getWorkoutAvt, setWorkoutAvt] = useState(null);

  const isFocused = useIsFocused();
  const getUserDataDetails = useSelector(state => state.getUserDataDetails);
  const getPurchaseHistory = useSelector(state => state.getPurchaseHistory);

  const askPermissionForLibrary = async permission => {
    const resultLib = await request(permission);

    if (resultLib == 'granted' || resultLib == 'limited') {
      try {
        const resultLibrary = await launchImageLibrary({
          mediaType: 'photo',
          quality: 0.5,
          maxWidth: 300,
          maxHeight: 200,
        });
        setWorkoutAvt(resultLibrary.assets[0]);
      } catch (error) {
        console.log('image Error--', error);
      }
    } else if (resultLib == 'blocked' || resultLib == 'denied') {
      Alert.alert(
        'Storage permission needed',
        'Storage permission is mandatory for access your photos',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },

          {
            text: 'Open settings',
            onPress: openSettings,
          },
        ],
        {cancelable: false},
      );
    } else {
      showMessage({
        message: 'Something went wrong',
        type: 'danger',
        animationDuration: 500,
        floating: true,
        icon: {icon: 'auto', position: 'left'},
      });
    }
  };

  const CustomWorkoutCard = ({item, index, onPress}: any) => {
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

    const totalExerciseCount = item?.total_exercises || 0;
    const estimatedMinutes = Math.max(5, totalExerciseCount * 2);

    return (
      <AnimatedReanimated.View
        entering={FadeInDown.delay((index % 6) * 70)
          .duration(380)
          .springify()}
        style={[animatedStyle]}>
        <TouchableOpacity
          activeOpacity={0.92}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          onPress={onPress}
          style={styles.attractiveCardContainer}>
          {/* Left Dual Rose Gradient Accent Bar */}
          <LinearGradient
            colors={['#FF2A54', '#E11D48']}
            style={styles.attractiveCardAccentBar}
          />

          <View style={styles.cardContentMainRow}>
            {/* Cover Image Wrapper with Floating Badge */}
            <View style={styles.coverImageRingWrapper}>
              <Image
                style={styles.coverImageStyle}
                source={{
                  uri: item?.image ?? localImage.NOWORKOUT,
                }}
                resizeMode={'cover'}
              />
              <LinearGradient
                colors={['#FF3366', '#E11D48']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.imageFlameBadge}>
                <FitIcon
                  type="MaterialCommunityIcons"
                  name="fire"
                  size={10}
                  color="#FFFFFF"
                />
                <Text style={styles.imageFlameBadgeText}>Fit</Text>
              </LinearGradient>
            </View>

            {/* Workout Details Column */}
            <View style={styles.workoutInfoColumn}>
              <Text numberOfLines={1} style={styles.workoutTitleText}>
                {item?.workout_name}
              </Text>

              {/* Badges Row */}
              <View style={styles.cardBadgesRow}>
                <View style={styles.exerciseCountPill}>
                  <FitIcon
                    type="MaterialCommunityIcons"
                    name="dumbbell"
                    size={11}
                    color="#E11D48"
                  />
                  <Text style={styles.exerciseCountPillText}>
                    {totalExerciseCount} Exercises
                  </Text>
                </View>

                <View style={styles.estimatedTimePill}>
                  <FitIcon
                    type="AntDesign"
                    name="clockcircle"
                    size={10}
                    color="#7C3AED"
                  />
                  <Text style={styles.estimatedTimePillText}>
                    ~{estimatedMinutes} Min
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Right Action Start / Next Pill Button */}
          <LinearGradient
            colors={['#FF2A54', '#E11D48']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.actionStartPillBtn}>
            <Text style={styles.actionStartPillText}>Start</Text>
            <FitIcon
              type="MaterialCommunityIcons"
              name="chevron-right"
              size={18}
              color="#FFFFFF"
            />
          </LinearGradient>
        </TouchableOpacity>
      </AnimatedReanimated.View>
    );
  };

  const renderItem = useMemo(
    () =>
      ({index, item}) => {
        return (
          <>
            <CustomWorkoutCard
              item={item}
              index={index}
              onPress={() => {
                AnalyticsConsole(`OPEN_Custom_Wrk`);
                navigation.navigate('CustomWorkoutDetails', {item: item});
              }}
            />
            {getAdsDisplay(index, item)}
          </>
        );
      },
    [customWorkoutData],
  );

  const getAdsDisplay = (index, item) => {
    const noOrNoobPlan =
      getPurchaseHistory?.plan == null || getPurchaseHistory?.plan == 'noob';
    if (customWorkoutData.length >= 1) {
      if (index == 0 && customWorkoutData.length > 1 && noOrNoobPlan) {
        return getNativeAdsDisplay();
      } else if ((index + 1) % 8 == 0 && customWorkoutData.length > 8) {
        return getNativeAdsDisplay();
      }
    }
  };

  const getNativeAdsDisplay = () => {
    if (getPurchaseHistory?.plan != null) {
      return <View style={{alignSelf: 'center', alignItems: 'center'}} />;
    } else {
      return <View style={{alignSelf: 'center', alignItems: 'center'}} />;
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
          source={localImage.Createworkout}
          resizeMode="contain"
          style={{
            width: DeviceWidth * 0.7,
            height: DeviceHeigth * 0.3,
            marginTop: DeviceHeigth * 0.1,
          }}
        />
        <View
          style={{
            width: DeviceWidth,
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: '#1E1E1E',
              fontSize: 18,
              fontWeight: '700',
              lineHeight: 26,
              fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
            }}>
            {translate('noworkoutcreated')}
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
            {translate('createworkouttext')}
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
            {translate('onpreference')}
          </Text>
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => {
              setIsCustomWorkout(!isCustomWorkout);
            }}
            style={{
              marginTop: DeviceHeigth * 0.04,
              marginBottom: 80,
              borderRadius: 24,
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
            }}>
            <LinearGradient
              colors={['#FF2A54', '#E11D48']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={{
                height: 48,
                paddingHorizontal: 22,
                borderRadius: 24,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                borderWidth: 1.5,
                borderColor: 'rgba(255, 255, 255, 0.4)',
              }}>
              <View
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  backgroundColor: '#FFFFFF',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <FitIcon
                  type="MaterialCommunityIcons"
                  name="plus"
                  size={18}
                  color="#E11D48"
                />
              </View>
              <Text
                style={{
                  color: '#FFFFFF',
                  fontSize: 14,
                  fontFamily: Fonts.MONTSERRAT_BOLD,
                  fontWeight: '700',
                  letterSpacing: 0.3,
                }}>
                {translate('createworkout')}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const createWorkout = () => {
    if (text.trim().length <= 0) {
      showMessage({
        message: translate('workoutname'),
        type: 'danger',
        animationDuration: 500,
        floating: true,
        icon: {icon: 'auto', position: 'left'},
      });
    } else if (text.trim().length < 3) {
      showMessage({
        message: translate('workoutname'),
        type: 'danger',
        animationDuration: 500,
        floating: true,
        icon: {icon: 'auto', position: 'left'},
      });
    } else if (getWorkoutAvt == null) {
      showMessage({
        message: translate('workoutimage'),
        type: 'danger',
        animationDuration: 500,
        floating: true,
        icon: {icon: 'auto', position: 'left'},
      });
    } else {
      AnalyticsConsole(`Create_Wrk_BUTTON`);
      navigation.navigate('CreateWorkout', {
        workoutTitle: text,
        workoutImg: getWorkoutAvt,
      });
      setText('');
      setWorkoutAvt(null);
      setIsCustomWorkout(false);
    }
  };

  return (
    <View style={styles.container}>
      <Wrapper>
        <NewHeader1 header={translate('customade')} backButton />
        <View style={[styles.meditionBox, {marginTop: 10}]}>
          <FlatList
            data={customWorkoutData}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingVertical: 10, paddingBottom: 100}}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            ListEmptyComponent={emptyComponent}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            updateCellsBatchingPeriod={100}
            removeClippedSubviews={true}
          />
        </View>
        {customWorkoutData?.length > 0 && (
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => {
              setIsCustomWorkout(true);
            }}
            style={styles.floatingCreateWorkoutBtn}>
            <LinearGradient
              colors={['#FF2A54', '#E11D48']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.floatingCreateWorkoutGradient}>
              <View style={styles.floatingBtnIconCircle}>
                <FitIcon
                  type="MaterialCommunityIcons"
                  name="plus"
                  size={18}
                  color="#E11D48"
                />
              </View>
              <Text style={styles.floatingBtnText}>
                {translate('createworkout')}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </Wrapper>

      {/* Create Workout Modal */}
      <Modal
        animationType="fade"
        visible={isCustomWorkout}
        transparent={true}
        onRequestClose={() => {
          setIsCustomWorkout(!isCustomWorkout);
        }}>
        <TouchableOpacity
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            paddingHorizontal: 20,
          }}
          activeOpacity={1}
          onPress={() => setIsCustomWorkout(false)}>
          <TouchableOpacity
            activeOpacity={1}
            style={{
              width: DeviceWidth * 0.88,
              backgroundColor: '#FFFFFF',
              paddingHorizontal: 20,
              paddingVertical: 22,
              borderRadius: 24,
              ...Platform.select({
                ios: {
                  shadowColor: '#000',
                  shadowOffset: {width: 0, height: 10},
                  shadowOpacity: 0.15,
                  shadowRadius: 20,
                },
                android: {
                  elevation: 10,
                },
              }),
            }}>
            {/* Modal Header Bar */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 16,
              }}>
              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                <LinearGradient
                  colors={['#FF2A54', '#E11D48']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <FitIcon
                    type="MaterialCommunityIcons"
                    name="dumbbell"
                    size={18}
                    color="#FFFFFF"
                  />
                </LinearGradient>
                <Text
                  style={{
                    color: '#111827',
                    fontFamily: Fonts.MONTSERRAT_BOLD,
                    fontSize: 17,
                    fontWeight: '700',
                  }}>
                  {translate('enterworkoutname')}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => setIsCustomWorkout(false)}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  backgroundColor: '#F3F4F6',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <FitIcon
                  type="MaterialCommunityIcons"
                  name="close"
                  size={16}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>

            {/* Avatar / Cover Image Upload Area */}
            <TouchableOpacity
              activeOpacity={0.88}
              style={{
                alignSelf: 'center',
                width: 90,
                height: 90,
                borderRadius: 45,
                backgroundColor: '#FFF1F2',
                borderWidth: 2,
                borderColor: '#FECDD3',
                justifyContent: 'center',
                alignItems: 'center',
                marginVertical: 12,
                position: 'relative',
              }}
              onPress={async () => {
                if (Platform.OS === 'ios') {
                  askPermissionForLibrary(PERMISSIONS.IOS.PHOTO_LIBRARY);
                } else {
                  if (Platform.Version >= 33) {
                    try {
                      const resultLibrary = await launchImageLibrary({
                        mediaType: 'photo',
                        quality: 0.5,
                        maxWidth: 300,
                        maxHeight: 200,
                      });
                      if (resultLibrary?.assets?.[0]) {
                        setWorkoutAvt(resultLibrary.assets[0]);
                      }
                    } catch (error) {
                      console.log('image Error--', error);
                    }
                  } else {
                    askPermissionForLibrary(
                      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                    );
                  }
                }
              }}>
              <Image
                source={
                  getWorkoutAvt == null
                    ? require('../../Icon/Images/NewImage2/upload.png')
                    : getWorkoutAvt
                }
                resizeMode={getWorkoutAvt == null ? 'contain' : 'cover'}
                style={{
                  height: getWorkoutAvt == null ? 36 : 86,
                  width: getWorkoutAvt == null ? 36 : 86,
                  borderRadius: getWorkoutAvt == null ? 0 : 43,
                }}
              />
              <View
                style={{
                  position: 'absolute',
                  bottom: -2,
                  right: -2,
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  backgroundColor: AppColor.RED,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 2,
                  borderColor: '#FFFFFF',
                }}>
                <FitIcon
                  type="MaterialCommunityIcons"
                  name="camera-plus-outline"
                  size={14}
                  color="#FFFFFF"
                />
              </View>
            </TouchableOpacity>

            {/* Workout Title Input */}
            <TextInput
              value={text}
              mode="outlined"
              activeOutlineColor={AppColor.RED}
              outlineColor="#E5E7EB"
              placeholder="Eg: Monday, chest day"
              placeholderTextColor="#9CA3AF"
              style={{
                marginVertical: 12,
                backgroundColor: '#FFFFFF',
                fontSize: 14,
              }}
              theme={{
                roundness: 14,
                colors: {primary: AppColor.RED},
              }}
              onChangeText={text => setText(text)}
            />

            {/* Action Buttons Row */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-end',
                marginTop: 14,
                gap: 10,
              }}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setIsCustomWorkout(false);
                }}
                style={{
                  paddingHorizontal: 18,
                  paddingVertical: 10,
                  borderRadius: 16,
                  backgroundColor: '#F3F4F6',
                }}>
                <Text
                  style={{
                    color: '#4B5563',
                    fontFamily: Fonts.MONTSERRAT_BOLD,
                    fontSize: 13.5,
                    fontWeight: '700',
                  }}>
                  {translate('cancel')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.88}
                onPress={() => {
                  createWorkout();
                }}>
                <LinearGradient
                  colors={['#FF2A54', '#E11D48']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 22,
                    paddingVertical: 10,
                    borderRadius: 16,
                    gap: 6,
                  }}>
                  <FitIcon
                    type="MaterialCommunityIcons"
                    name="check"
                    size={16}
                    color="#FFFFFF"
                  />
                  <Text
                    style={{
                      color: '#FFFFFF',
                      fontFamily: Fonts.MONTSERRAT_BOLD,
                      fontSize: 13.5,
                      fontWeight: '700',
                    }}>
                    OK
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default CustomWorkout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFDFD',
  },
  meditionBox: {
    backgroundColor: 'transparent',
    width: '100%',
    flex: 1,
    alignSelf: 'center',
  },
  attractiveCardContainer: {
    width: '96%',
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 12,
    marginVertical: 7,
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
        shadowOffset: {width: 0, height: 6},
        shadowOpacity: 0.06,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  attractiveCardAccentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4.5,
  },
  cardContentMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 14,
    paddingLeft: 4,
  },
  coverImageRingWrapper: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
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
  coverImageStyle: {
    width: 66,
    height: 66,
    borderRadius: 17,
  },
  imageFlameBadge: {
    position: 'absolute',
    bottom: -4,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
    gap: 2,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  imageFlameBadgeText: {
    fontSize: 9,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  workoutInfoColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  workoutTitleText: {
    fontSize: 16.5,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  cardBadgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  exerciseCountPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1F2',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  exerciseCountPillText: {
    fontSize: 11.5,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
    color: '#E11D48',
  },
  estimatedTimePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F3FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 3,
    borderWidth: 1,
    borderColor: '#DDD6FE',
  },
  estimatedTimePillText: {
    fontSize: 11.5,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
    color: '#7C3AED',
  },
  actionStartPillBtn: {
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    marginLeft: 6,
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
  actionStartPillText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
  },
  floatingCreateWorkoutBtn: {
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
  floatingCreateWorkoutGradient: {
    height: 48,
    paddingHorizontal: 18,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  floatingBtnIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
