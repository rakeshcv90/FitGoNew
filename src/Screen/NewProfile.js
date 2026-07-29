/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  StyleSheet,
  Image,
  Platform,
  TouchableOpacity,
  ScrollView,
  Modal,
  Linking,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';

import {AppColor, Fonts} from '../Component/Color';
import {useDispatch, useSelector} from 'react-redux';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../Component/Config';
import {localImage} from '../Component/Image';
import Reminder from '../Component/Reminder';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {showMessage} from 'react-native-flash-message';

import VersionNumber from 'react-native-version-number';
import ActivityLoader from '../Component/ActivityLoader';
import analytics from '@react-native-firebase/analytics';
import notifee from '@notifee/react-native';
import moment from 'moment';
import axios from 'axios';
import {BlurView} from '@react-native-community/blur';
import KeepAwake from 'react-native-keep-awake';

import {
  setIsAlarmEnabled,
  setMusicOnOff,
  setProfileImg_Data,
  setScreenAwake,
  setSoundOnOff,
  setUserProfileData,
} from '../Component/ThemeRedux/Actions';
import {LogOut} from '../Component/LogOut';
import {AnalyticsConsole} from '../Component/AnalyticsConsole';
import RatingModal from '../Component/RatingModal';
import FitIcon from '../Component/Utilities/FitIcon';
import Wrapper from './WorkoutCompleteScreen/Wrapper';
import NewHeader1 from '../Component/Headers/NewHeader1';
import NewButton from '../Component/NewButton';
import {useGalleryPermission} from '../Component/Permissions/PermissionHooks';
import FitToggle from '../Component/Utilities/FitToggle';
import PersonalDetails from './PersonalDetails';
import FitSheet from '../Component/Utilities/FitSheet';
import {translate} from '../Screen/Translation/TranslationService';
import LanguageSelectorModal from '../Screen/Translation/LanguageSelectorModal';
import AnimatedReanimated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeInDown,
  FadeInUp,
  ZoomIn,
} from 'react-native-reanimated';

// Action Card Icons
const ACTION_CARD_ICONS = {
  1: {
    type: 'Ionicons',
    name: 'notifications',
    colors: ['#FF9500', '#FF5E00'],
  },
  2: {
    type: 'Ionicons',
    name: 'sparkles',
    colors: ['#8B5CF6', '#6366F1'],
  },
  3: {
    type: 'Ionicons',
    name: 'person',
    colors: ['#0EA5E9', '#2563EB'],
  },
};

// Setting Item Icons
const SETTING_ITEM_ICONS = {
  1: {
    type: 'Ionicons',
    name: 'volume-high',
    colors: ['#3B82F6', '#1D4ED8'],
    sub: 'Voice prompts during workout',
  },
  2: {
    type: 'Ionicons',
    name: 'musical-notes',
    colors: ['#8B5CF6', '#6D28D9'],
    sub: 'Background music & sound effects',
  },
  3: {
    type: 'MaterialCommunityIcons',
    name: 'cellphone',
    colors: ['#F59E0B', '#D97706'],
    sub: 'Keep screen active while exercising',
  },
  4: {
    type: 'Ionicons',
    name: 'help-buoy',
    colors: ['#10B981', '#059669'],
    sub: 'Frequently asked questions',
  },
  5: {
    type: 'Ionicons',
    name: 'trophy',
    colors: ['#EC4899', '#DB2777'],
    sub: 'Monthly workout summary',
  },
  6: {
    type: 'Ionicons',
    name: 'chatbubbles',
    colors: ['#06B6D4', '#0891B2'],
    sub: 'Get in touch with support team',
  },
  7: {
    type: 'Ionicons',
    name: 'shield-checkmark',
    colors: ['#6366F1', '#4F46E5'],
    sub: 'Terms of service & privacy',
  },
  9: {
    type: 'Ionicons',
    name: 'star',
    colors: ['#F59E0B', '#EAB308'],
    sub: 'Love the app? Rate us',
  },
  10: {
    type: 'Ionicons',
    name: 'trash-bin',
    colors: ['#EF4444', '#DC2626'],
    sub: 'Permanently remove your data',
  },
  11: {
    type: 'Ionicons',
    name: 'log-out',
    colors: ['#F43F5E', '#E11D48'],
    sub: 'Sign out from this device',
  },
};

// Animated Action Card Component
const ActionCard = ({v, isGuest, onPress}) => {
  const scale = useSharedValue(1);
  const iconConfig = ACTION_CARD_ICONS[v.id] || {
    type: 'Ionicons',
    name: 'star',
    colors: ['#667EEA', '#764BA2'],
  };

  const cardTints = {
    1: ['#FFFFFF', '#FFF7ED'],
    2: ['#FFFFFF', '#F5F3FF'],
    3: ['#FFFFFF', '#F0F9FF'],
  };

  const cardBg = cardTints[v.id] || ['#FFFFFF', '#F8FAFC'];

  const animStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  const onPressIn = () => {
    scale.value = withSpring(0.93, {damping: 14, stiffness: 280});
  };
  const onPressOut = () => {
    scale.value = withSpring(1, {damping: 14, stiffness: 280});
  };

  return (
    <AnimatedReanimated.View style={[{flex: 1}, animStyle]}>
      <TouchableOpacity
        activeOpacity={0.88}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={onPress}
        style={styles.actionCardItem}>
        <LinearGradient
          colors={cardBg}
          start={{x: 0, y: 0}}
          end={{x: 0, y: 1}}
          style={StyleSheet.absoluteFill}
        />

        <LinearGradient
          colors={iconConfig.colors}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.actionCardIconBox}>
          <FitIcon
            name={iconConfig.name}
            type={iconConfig.type}
            size={22}
            color="#FFFFFF"
          />
        </LinearGradient>

        <View style={styles.actionCardTitleContainer}>
          <Text style={styles.actionCardTitle} numberOfLines={2}>
            {v.txt}
          </Text>
        </View>

        <View style={styles.actionCardPillSlot}>
          {v.txt1 && v.txt1 !== 'Invalid date' ? (
            <LinearGradient
              colors={['#FF3366', '#E11D48']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.actionCardPill}>
              <Text style={styles.actionCardPillText}>{v.txt1}</Text>
            </LinearGradient>
          ) : null}
        </View>
      </TouchableOpacity>
    </AnimatedReanimated.View>
  );
};

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const NewProfile = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(true);
  const avatarRef = React.createRef();
  const [isEnabled, setIsEnabled] = useState(false);
  const [PhotoUploaded, setPhotoUploaded] = useState(true);
  const dispatch = useDispatch();
  const [UpdateScreenVisibility, setUpadteScreenVisibilty] = useState(false);
  const [visible, setVisible] = useState(false);

  const [notificationTimer, setNotificationTimer] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [ratingVisibilty, setRatingVisibilty] = useState(false);
  const [modalImageUploaded, setModalImageUploaded] = useState(false);
  const [IsimgUploaded, setImguploaded] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [userAvatar, setUserAvatar] = useState(null);

  const getMusicOffOn = useSelector(state => state.getMusicOffOn);
  const getUserDataDetails = useSelector(state => state.getUserDataDetails);
  const getSoundOffOn = useSelector(state => state.getSoundOffOn);
  const getScreenAwake = useSelector(state => state.getScreenAwake);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const bottomRef = useRef(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [snapPoints, setSnapPoints] = useState(0.68);
  const {launchLibrary} = useGalleryPermission();

  useEffect(() => {
    notifee.getTriggerNotifications().then(res => {
      if (res.length > 0) {
        setNotificationTimer(res[0].trigger.timestamp);
        dispatch(setIsAlarmEnabled(true));
      } else {
        setNotificationTimer('');
        dispatch(setIsAlarmEnabled(false));
      }
    });
  }, []);

  const setAlarmIsEnabled = data => {
    dispatch(setIsAlarmEnabled(data));
  };

  useEffect(() => {
    if (getScreenAwake) {
      KeepAwake.activate();
    } else {
      KeepAwake.deactivate();
    }
  }, [getScreenAwake]);

  useEffect(() => {
    !isSheetOpen && setSnapPoints(0.68);
  }, [isSheetOpen]);

  const CardData = [
    {
      id: 1,
      txt: translate('dailyreminder'),
      img: localImage.Bell,
      txt1:
        moment(notificationTimer).format('LT') == 'Invalid date'
          ? '1:00 AM'
          : moment(notificationTimer).format('LT'),
    },
    {
      id: 2,
      txt: translate('subscription'),
      img: localImage.Planning,
    },
    {
      id: 3,
      txt: translate('mydetails'),
      img: localImage.NewPrfile,
    },
  ];

  const CardData1 = [
    {
      id: 1,
      txt: 'Reminder',
      img: localImage.Bell,
      txt1:
        moment(notificationTimer).format('LT') == 'Invalid date'
          ? '1:00 AM'
          : moment(notificationTimer).format('LT'),
    },
    {
      id: 2,
      txt: 'My Details',
      img: localImage.NewPrfile,
    },
  ];

  const handleCardDataPress = id => {
    if (id == 1) {
      AnalyticsConsole('REMINDER_BUTTON');
      setVisible(true);
    } else if (id == 2) {
      AnalyticsConsole('SUBSCRIPTION_BUTTON');
      navigation.navigate('NewSubscription', {upgrade: false});
    } else if (id == 3) {
      AnalyticsConsole('PERSO_DETAILS_BUTTON');
      bottomRef.current && bottomRef.current?.open();
    }
  };

  const handleCardDataPress1 = id => {
    if (id == 1) {
      AnalyticsConsole('REMINDER_BUTTON');
      setVisible(true);
    } else if (id == 2) {
      AnalyticsConsole('PERSO_DETAILS_BUTTON');
      navigation.navigate('NewPersonalDetails');
    }
  };

  const openMailApp = () => {
    Linking.openURL(
      'mailto:thefitnessandworkout@gmail.com?subject=Feedback&body=Hello%20there!',
    );
  };

  const HandleButtons = (ids, value) => {
    const id = ids;
    if (id == 4) {
      navigation.navigate('Questions', {screenName: 'Home'});
    }
    if (id == 5) {
      navigation.navigate('NewMonthlyAchievement');
    } else if (id == 6) {
      analytics().logEvent(
        `CV_FITME_CLICKED_ON_${value?.replace?.(' ', '_') || 'CONTACT'}`,
      );
      openMailApp();
    } else if (id == 7) {
      AnalyticsConsole('PRIVACY_BUTTON');
      navigation.navigate('TermaAndCondition', {
        title: 'Privacy Policy',
      });
    } else if (id == 8) {
      AnalyticsConsole('T_n_CBUTTON');
      setLanguageModalVisible(true);
    } else if (id == 9) {
      AnalyticsConsole('APP_RATING_BUTTON');
      setRatingVisibilty(true);
    } else if (id == 10) {
      setModalVisible(true);
    } else if (id == 11) {
      AnalyticsConsole('LOGOUT_BUTTON');
      setLogoutModalVisible(true);
    }
  };

  const ListData = [
    {
      id: 1,
      txt: translate('voiceassistant'),
      img: localImage.NSounds,
    },
    {
      id: 2,
      txt: translate('musicsound'),
      img: localImage.NMusic,
    },
    {
      id: 3,
      txt: translate('displayon'),
      img: localImage.DisplayOn,
    },
    {
      id: 4,
      txt: translate('faqs'),
      img: localImage.FAQ,
    },
    {
      id: 5,
      txt: translate('report'),
      img: localImage.REPORT,
    },
    {
      id: 6,
      txt: translate('contactus'),
      img: localImage.NContact,
    },
    {
      id: 7,
      txt: translate('privacypolicy'),
      img: localImage.NPrivacy,
    },
    {
      id: 9,
      txt: translate('rate'),
      img: localImage.NRate,
    },
    {
      id: 10,
      txt: translate('deleteaccount'),
      img: localImage.NDelete,
    },
    {
      id: 11,
      txt: 'Log Out',
      img: localImage.NLogOut,
    },
  ];

  const renderUpdateProfileModal = () => {
    const getUserDetailDataApi = async userId => {
      try {
        const responseData = await axios.get(
          `${NewAppapi.ALL_USER_DETAILS}?version=${VersionNumber.appVersion}&user_id=${userId}`,
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
          dispatch(setUserProfileData(responseData?.data?.profile));
        }
      } catch (error) {
        console.log('GET-USER-DATA', error);
      }
    };

    const UploadImage = async selectedImage => {
      setUploading(true);
      try {
        let payload = new FormData();
        payload.append('token', getUserDataDetails?.login_token);
        payload.append('version', VersionNumber.appVersion);
        payload.append('user_id', getUserDataDetails?.id);
        payload.append('image', {
          name: selectedImage?.fileName || 'profile.jpg',
          type: selectedImage?.type || 'image/jpeg',
          uri: selectedImage?.uri,
        });

        const ProfileData = await axios({
          url: NewAppapi.Upload_Profile_picture,
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          data: payload,
        });
        if (ProfileData?.data) {
          showMessage({
            message: 'Profile photo updated successfully',
            type: 'success',
            animationDuration: 500,
            floating: true,
            icon: {icon: 'auto', position: 'left'},
          });

          setImguploaded(true);
          if (IsimgUploaded == true) {
            setUpadteScreenVisibilty(false);
            setPhotoUploaded(false);
          }
        }
      } catch (error) {
        setImguploaded(true);
        if (IsimgUploaded == true) {
          setPhotoUploaded(false);
          setUpadteScreenVisibilty(false);
        }
        console.log('UpdateProfileError', error);
      } finally {
        setUploading(false);
      }
    };

    const openLibrary = async () => {
      try {
        const resultLibrary = await launchLibrary();
        if (resultLibrary?.assets?.[0]) {
          setUserAvatar(resultLibrary.assets[0]);
          setModalImageUploaded(true);
        }
      } catch (error) {
        console.log('LibimageError', error);
      }
    };

    const handleUploadButton = () => {
      if (modalImageUploaded) {
        AnalyticsConsole('UPLOAD_IMAGE');
        UploadImage(userAvatar)
          .then(() => {
            getUserDetailDataApi(getUserDataDetails?.id);
          })
          .catch(err => {
            console.log('some error', err);
          });
      } else {
        openLibrary();
      }
    };

    return (
      <View
        style={{flex: 1, position: 'absolute', width: '100%', height: '100%'}}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={true}
          onRequestClose={() => setUpadteScreenVisibilty(false)}>
          <View style={styles.uploadModalBackdrop}>
            <BlurView
              style={StyleSheet.absoluteFill}
              blurType="dark"
              blurAmount={5}
              reducedTransparencyFallbackColor="black"
            />

            <TouchableOpacity
              style={StyleSheet.absoluteFill}
              activeOpacity={1}
              onPress={() => setUpadteScreenVisibilty(false)}
            />

            <AnimatedReanimated.View
              entering={FadeInUp.duration(400).springify()}
              style={styles.uploadModalCard}>
              {/* Top Handle Bar */}
              <View style={styles.modalHandleBar} />

              {/* Header */}
              <View style={styles.uploadModalHeader}>
                <View>
                  <Text style={styles.uploadModalTitle}>Profile Photo</Text>
                  <Text style={styles.uploadModalSubtitle}>
                    Upload a new avatar picture for your account
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => setUpadteScreenVisibilty(false)}
                  style={styles.closeBtnCircle}
                  activeOpacity={0.7}>
                  <FitIcon
                    name="close"
                    type="Ionicons"
                    size={20}
                    color="#64748B"
                  />
                </TouchableOpacity>
              </View>

              {/* Avatar Preview */}
              <View style={styles.uploadAvatarContainer}>
                <LinearGradient
                  colors={['#667EEA', '#764BA2', '#F093FB', '#00F2FE']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}
                  style={styles.uploadAvatarRing}>
                  <Image
                    defaultSource={localImage.avt}
                    source={
                      userAvatar != null
                        ? {uri: userAvatar.uri}
                        : getUserDataDetails?.image_path
                        ? {uri: getUserDataDetails?.image_path}
                        : localImage.avt
                    }
                    style={styles.uploadAvatarImg}
                  />
                </LinearGradient>

                <View style={styles.uploadAvatarBadge}>
                  <FitIcon
                    name={modalImageUploaded ? 'checkmark' : 'camera'}
                    type="Ionicons"
                    size={16}
                    color="#FFFFFF"
                  />
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.uploadBtnSection}>
                {!modalImageUploaded ? (
                  <TouchableOpacity
                    activeOpacity={0.88}
                    onPress={openLibrary}
                    style={styles.pickOptionCard}>
                    <LinearGradient
                      colors={['#667EEA', '#764BA2']}
                      start={{x: 0, y: 0}}
                      end={{x: 1, y: 1}}
                      style={styles.pickOptionIconBox}>
                      <FitIcon
                        name="images"
                        type="Ionicons"
                        size={24}
                        color="#FFFFFF"
                      />
                    </LinearGradient>
                    <View style={{flex: 1, marginLeft: 14}}>
                      <Text style={styles.pickOptionTitle}>
                        Select from Photos
                      </Text>
                      <Text style={styles.pickOptionSub}>
                        Browse & select image from photo library
                      </Text>
                    </View>
                    <FitIcon
                      name="chevron-forward"
                      type="Ionicons"
                      size={20}
                      color="#94A3B8"
                    />
                  </TouchableOpacity>
                ) : (
                  <>
                    <TouchableOpacity
                      activeOpacity={0.88}
                      disabled={uploading}
                      onPress={handleUploadButton}
                      style={styles.mainUploadBtnWrapper}>
                      <LinearGradient
                        colors={['#667EEA', '#764BA2']}
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 1}}
                        style={styles.mainUploadBtn}>
                        {uploading ? (
                          <ActivityIndicator size="small" color="#FFFFFF" />
                        ) : (
                          <>
                            <FitIcon
                              name="cloud-upload"
                              type="Ionicons"
                              size={20}
                              color="#FFFFFF"
                            />
                            <Text style={styles.mainUploadBtnText}>
                              Upload Profile Photo
                            </Text>
                          </>
                        )}
                      </LinearGradient>
                    </TouchableOpacity>

                    {!uploading && (
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={openLibrary}
                        style={styles.secondaryChooseBtn}>
                        <Text style={styles.secondaryChooseBtnText}>
                          Choose Different Photo
                        </Text>
                      </TouchableOpacity>
                    )}
                  </>
                )}
              </View>
            </AnimatedReanimated.View>
          </View>
        </Modal>
      </View>
    );
  };

  const renderDeleteAccountModal = () => {
    const Delete = async () => {
      setDeleteLoading(true);
      AnalyticsConsole('DEL_BUTTON_API');
      try {
        const res = await axios({
          url: `${NewAppapi.Delete_Account}?id=${getUserDataDetails?.id}`,
          method: 'get',
        });
        if (res.data) {
          setDeleteLoading(false);
          setModalVisible(false);
          showMessage({
            message: 'Your account deleted successfully',
            floating: true,
            type: 'info',
            animationDuration: 750,
            icon: {icon: 'none', position: 'left'},
          });
          LogOut(dispatch);
        }
      } catch (error) {
        console.log('Delete Account Api Error', error);
        setDeleteLoading(false);
        setModalVisible(false);
        showMessage({
          message: 'Something went wrong',
          floating: true,
          type: 'danger',
          animationDuration: 750,
          icon: {icon: 'none', position: 'left'},
        });
        setModalVisible(false);
      }
    };

    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          if (!deleteLoading) setModalVisible(false);
        }}>
        <StatusBar barStyle="light-content" backgroundColor="rgba(15, 23, 42, 0.65)" />
        <View style={styles.modalOverlayContainer}>
          <AnimatedReanimated.View
            entering={ZoomIn.duration(350).springify()}
            style={styles.deleteModalCardContainer}>
            {/* Top Danger Warning Halo Icon */}
            <LinearGradient
              colors={['#FEF2F2', '#FEE2E2']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={styles.dangerIconHaloCircle}>
              <FitIcon
                name="trash-can-outline"
                type="MaterialCommunityIcons"
                size={28}
                color="#EF4444"
              />
            </LinearGradient>

            {/* Modal Title & Warning Copy */}
            <Text style={styles.deleteModalTitleText}>Delete Account?</Text>
            <Text style={styles.deleteModalSubtitleText}>
              This action is permanent and cannot be undone. You will immediately lose access to:
            </Text>

            {/* Impact Loss List */}
            <View style={styles.impactLossContainer}>
              <View style={styles.impactLossItem}>
                <FitIcon
                  name="close-circle-outline"
                  type="Ionicons"
                  size={16}
                  color="#EF4444"
                />
                <Text style={styles.impactLossText}>Workout History & Calorie Logs</Text>
              </View>
              <View style={styles.impactLossItem}>
                <FitIcon
                  name="close-circle-outline"
                  type="Ionicons"
                  size={16}
                  color="#EF4444"
                />
                <Text style={styles.impactLossText}>Saved Custom Meal & Exercise Plans</Text>
              </View>
              <View style={styles.impactLossItem}>
                <FitIcon
                  name="close-circle-outline"
                  type="Ionicons"
                  size={16}
                  color="#EF4444"
                />
                <Text style={styles.impactLossText}>Achievements, Badges & Streaks</Text>
              </View>
            </View>

            {/* Action Buttons Row */}
            <View style={styles.deleteModalBtnRow}>
              <TouchableOpacity
                activeOpacity={0.8}
                disabled={deleteLoading}
                style={styles.deleteModalCancelBtn}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.deleteModalCancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.88}
                disabled={deleteLoading}
                style={styles.deleteModalConfirmBtnWrapper}
                onPress={() => Delete()}>
                <LinearGradient
                  colors={['#EF4444', '#DC2626']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.deleteModalConfirmBtn}>
                  {deleteLoading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <>
                      <FitIcon
                        name="delete-outline"
                        type="MaterialCommunityIcons"
                        size={16}
                        color="#FFFFFF"
                      />
                      <Text style={styles.deleteModalConfirmBtnText}>
                        Delete Account
                      </Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </AnimatedReanimated.View>
        </View>
      </Modal>
    );
  };

  const renderLogoutConfirmModal = () => {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={logoutModalVisible}
        onRequestClose={() => {
          if (!logoutLoading) setLogoutModalVisible(false);
        }}>
        <StatusBar barStyle="light-content" backgroundColor="rgba(15, 23, 42, 0.65)" />
        <View style={styles.modalOverlayContainer}>
          <AnimatedReanimated.View
            entering={ZoomIn.duration(350).springify()}
            style={styles.logoutModalCardContainer}>
            
            {/* Top Logout Icon Halo */}
            <LinearGradient
              colors={['#EEF2FF', '#E0E7FF']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={styles.logoutIconHaloCircle}>
              <FitIcon
                name="logout"
                type="MaterialCommunityIcons"
                size={28}
                color="#667EEA"
              />
            </LinearGradient>

            {/* Modal Title & Subtitle */}
            <Text style={styles.logoutModalTitleText}>Log Out of FitMe?</Text>
            <Text style={styles.logoutModalSubtitleText}>
              Are you sure you want to log out? You can log back in anytime to access your progress.
            </Text>

            {/* Action Buttons Row */}
            <View style={styles.logoutModalBtnRow}>
              <TouchableOpacity
                activeOpacity={0.8}
                disabled={logoutLoading}
                style={styles.logoutModalCancelBtn}
                onPress={() => setLogoutModalVisible(false)}>
                <Text style={styles.logoutModalCancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.88}
                disabled={logoutLoading}
                style={styles.logoutModalConfirmBtnWrapper}
                onPress={() => {
                  setLogoutLoading(true);
                  setTimeout(() => {
                    setLogoutLoading(false);
                    setLogoutModalVisible(false);
                    LogOut(dispatch);
                  }, 1200);
                }}>
                <LinearGradient
                  colors={['#667EEA', '#764BA2']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.logoutModalConfirmBtn}>
                  {logoutLoading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <>
                      <FitIcon
                        name="logout"
                        type="MaterialCommunityIcons"
                        size={16}
                        color="#FFFFFF"
                      />
                      <Text style={styles.logoutModalConfirmBtnText}>Log Out</Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </AnimatedReanimated.View>
        </View>
      </Modal>
    );
  };

  const onChange = (value, name) => {
    const isSound = name == 'Sound' ? 'Sound' : 'Music';
    AnalyticsConsole(`${isSound}_ON_OFF`);
    if (!value) {
      showMessage({
        message:
          name == 'Screen' ? 'Display always on.' : isSound + ' unmuted.',
        type: 'success',
        animationDuration: 500,
        floating: true,
      });
    } else {
      showMessage({
        message: name == 'Screen' ? 'Display always off.' : isSound + ' muted.',
        animationDuration: 500,
        type: 'danger',
        floating: true,
      });
    }
    name == 'Screen'
      ? dispatch(setScreenAwake(!value))
      : name == 'Sound'
      ? dispatch(setSoundOnOff(!value))
      : dispatch(setMusicOnOff(!value));
  };

  const isGuest = getUserDataDetails?.email == null;
  const activeCards = isGuest ? CardData1 : CardData;

  return (
    <>
      <View style={styles.Container}>
        <Wrapper styles={{backgroundColor: '#F8FAFC'}}>
          <StatusBar barStyle={'dark-content'} backgroundColor={'#F8FAFC'} />
          <NewHeader1 header={translate('profile') || 'Profile'} />

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 40}}>
            <AnimatedReanimated.View
              entering={FadeInDown.duration(500).springify()}
              style={styles.heroProfileCard}>
              <LinearGradient
                colors={['#667EEA', '#764BA2', '#F093FB']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                style={StyleSheet.absoluteFill}
              />

              <View
                style={[
                  styles.heroOrb,
                  {top: -30, right: -20, width: 110, height: 110},
                ]}
              />
              <View
                style={[
                  styles.heroOrb,
                  {bottom: -40, left: 30, width: 140, height: 140},
                ]}
              />

              <View style={styles.profileRow}>
                {/* Avatar with Glow Ring */}
                <View style={styles.avatarWrapper}>
                  <View style={styles.avatarGradientRing}>
                    <Image
                      source={
                        getUserDataDetails?.image_path == null
                          ? localImage.avt
                          : {uri: getUserDataDetails?.image_path}
                      }
                      style={styles.avatarImage}
                      onLoad={() => setIsLoading(false)}
                      resizeMode="cover"
                    />
                  </View>

                  <TouchableOpacity
                    style={styles.penEditCircle}
                    onPress={() => setUpadteScreenVisibilty(true)}
                    activeOpacity={0.85}>
                    <FitIcon
                      name="camera"
                      type="Ionicons"
                      size={14}
                      color="#FFFFFF"
                    />
                  </TouchableOpacity>
                </View>

                {/* User Details */}
                <View style={styles.userDetailsCol}>
                  <View style={styles.nameRow}>
                    <Text style={styles.userNameText} numberOfLines={1}>
                      {getUserDataDetails?.name || 'Guest User'}
                    </Text>
                  </View>

                  <Text style={styles.userEmailText} numberOfLines={1}>
                    {getUserDataDetails?.email || 'guest@gmail.com'}
                  </Text>
                </View>
              </View>
            </AnimatedReanimated.View>

            <AnimatedReanimated.View
              entering={FadeInDown.delay(200).duration(500).springify()}
              style={styles.actionCardsRow}>
              {activeCards.map((v, i) => (
                <ActionCard
                  key={i}
                  v={v}
                  isGuest={isGuest}
                  onPress={() =>
                    isGuest
                      ? handleCardDataPress1(v.id)
                      : handleCardDataPress(v.id)
                  }
                />
              ))}
            </AnimatedReanimated.View>
            {/* Section 1: Preferences */}
            <AnimatedReanimated.View
              entering={FadeInDown.delay(300).duration(500).springify()}
              style={styles.sectionCard}>
              <View style={styles.sectionHeaderRow}>
                <View
                  style={[styles.headerDot, {backgroundColor: '#3B82F6'}]}
                />
                <Text style={styles.sectionHeaderTitle}>Preferences</Text>
              </View>

              {ListData.slice(0, 3).map((v, i) => {
                const iconConfig = SETTING_ITEM_ICONS[v.id] || {
                  type: 'Ionicons',
                  name: 'options',
                  colors: ['#3B82F6', '#1D4ED8'],
                  sub: '',
                };
                return (
                  <View key={i} style={styles.settingItemRow}>
                    <View style={styles.settingItemLeft}>
                      <LinearGradient
                        colors={iconConfig.colors}
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 1}}
                        style={styles.settingIconBadge}>
                        <FitIcon
                          name={iconConfig.name}
                          type={iconConfig.type}
                          size={18}
                          color="#FFFFFF"
                        />
                      </LinearGradient>
                      <View>
                        <Text style={styles.settingItemText}>{v.txt}</Text>
                        <Text style={styles.settingItemSubText}>
                          {iconConfig.sub}
                        </Text>
                      </View>
                    </View>

                    <FitToggle
                      key={v.id}
                      value={
                        v.id == 1
                          ? getSoundOffOn
                          : v.id == 2
                          ? getMusicOffOn
                          : getScreenAwake
                      }
                      name={
                        v.id == 1 ? 'Sound' : v.id == 2 ? 'Music' : 'Screen'
                      }
                      onChange={onChange}
                    />
                  </View>
                );
              })}
            </AnimatedReanimated.View>
            {/* Section 2: General Settings */}
            <AnimatedReanimated.View
              entering={FadeInDown.delay(400).duration(500).springify()}
              style={styles.sectionCard}>
              <View style={styles.sectionHeaderRow}>
                <View
                  style={[styles.headerDot, {backgroundColor: '#10B981'}]}
                />
                <Text style={styles.sectionHeaderTitle}>General</Text>
              </View>

              {ListData.slice(3, 8).map((v, i) => {
                const iconConfig = SETTING_ITEM_ICONS[v.id] || {
                  type: 'Ionicons',
                  name: 'document-text',
                  colors: ['#6366F1', '#4F46E5'],
                  sub: '',
                };
                return (
                  <TouchableOpacity
                    key={i}
                    style={styles.settingItemRow}
                    activeOpacity={0.7}
                    onPress={() => HandleButtons(v.id, v.txt)}>
                    <View style={styles.settingItemLeft}>
                      <LinearGradient
                        colors={iconConfig.colors}
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 1}}
                        style={styles.settingIconBadge}>
                        <FitIcon
                          name={iconConfig.name}
                          type={iconConfig.type}
                          size={18}
                          color="#FFFFFF"
                        />
                      </LinearGradient>
                      <View>
                        <Text style={styles.settingItemText}>{v.txt}</Text>
                        <Text style={styles.settingItemSubText}>
                          {iconConfig.sub}
                        </Text>
                      </View>
                    </View>

                    <FitIcon
                      name="chevron-forward"
                      type="Ionicons"
                      size={18}
                      color="#94A3B8"
                    />
                  </TouchableOpacity>
                );
              })}
            </AnimatedReanimated.View>
            {/* Section 3: Account Actions */}
            <AnimatedReanimated.View
              entering={FadeInDown.delay(500).duration(500).springify()}
              style={styles.sectionCard}>
              <View style={styles.sectionHeaderRow}>
                <View
                  style={[styles.headerDot, {backgroundColor: '#EF4444'}]}
                />
                <Text style={styles.sectionHeaderTitle}>Account</Text>
              </View>

              {ListData.slice(8).map((v, i) => {
                const isDestructive = v.id === 10 || v.id === 11;
                const iconConfig = SETTING_ITEM_ICONS[v.id] || {
                  type: 'Ionicons',
                  name: 'trash-bin',
                  colors: ['#EF4444', '#DC2626'],
                  sub: '',
                };
                return (
                  <TouchableOpacity
                    key={i}
                    style={styles.settingItemRow}
                    activeOpacity={0.7}
                    onPress={() => HandleButtons(v.id, v.txt)}>
                    <View style={styles.settingItemLeft}>
                      <LinearGradient
                        colors={iconConfig.colors}
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 1}}
                        style={styles.settingIconBadge}>
                        <FitIcon
                          name={iconConfig.name}
                          type={iconConfig.type}
                          size={18}
                          color="#FFFFFF"
                        />
                      </LinearGradient>
                      <View>
                        <Text
                          style={[
                            styles.settingItemText,
                            isDestructive && {
                              color: '#EF4444',
                              fontWeight: '700',
                            },
                          ]}>
                          {v.txt}
                        </Text>
                        <Text style={styles.settingItemSubText}>
                          {iconConfig.sub}
                        </Text>
                      </View>
                    </View>

                    <FitIcon
                      name="chevron-forward"
                      type="Ionicons"
                      size={18}
                      color={isDestructive ? '#FCA5A5' : '#94A3B8'}
                    />
                  </TouchableOpacity>
                );
              })}
            </AnimatedReanimated.View>
            {/* Footer Version */}
            <View style={styles.versionFooter}>
              <Text style={styles.versionText}>
                FitMe App v{VersionNumber.appVersion || '1.0.0'}
              </Text>
            </View>
            <Reminder
              visible={visible}
              setVisible={setVisible}
              setAlarmIsEnabled={setAlarmIsEnabled}
              setNotificationTimer={setNotificationTimer}
            />
          </ScrollView>

          {UpdateScreenVisibility ? renderUpdateProfileModal() : null}
          {ratingVisibilty ? (
            <RatingModal
              setModalVisibilty={setRatingVisibilty}
              getVisibility={ratingVisibilty}
            />
          ) : null}
          {renderDeleteAccountModal()}
          {renderLogoutConfirmModal()}
          <LanguageSelectorModal
            visible={languageModalVisible}
            onClose={() => setLanguageModalVisible(false)}
            dispatch={dispatch}
          />
        </Wrapper>
      </View>

      <FitSheet
        ref={bottomRef}
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        initialSnapPoint={snapPoints}
        bottomTabHeight={140}
        minHeight={200}>
        <PersonalDetails
          changeSheetPoint={setSnapPoints}
          setIsSheetOpen={setIsSheetOpen}
        />
      </FitSheet>
    </>
  );
};

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  // --- Hero Banner Card ---
  heroProfileCard: {
    width: DeviceWidth * 0.92,
    alignSelf: 'center',
    borderRadius: 24,
    padding: 20,
    marginVertical: 10,
    overflow: 'hidden',
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: '#764BA2',
        shadowOffset: {width: 0, height: 8},
        shadowOpacity: 0.25,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  heroOrb: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatarGradientRing: {
    width: 86,
    height: 86,
    borderRadius: 43,
    padding: 3,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  avatarImage: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: '#FFFFFF',
  },
  penEditCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FF3366',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 2,
    right: 2,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userDetailsCol: {
    flex: 1,
    marginLeft: 16,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userNameText: {
    fontSize: 20,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '800',
    color: '#FFFFFF',
    maxWidth: DeviceWidth * 0.42,
  },
  proBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 4,
  },
  proBadgeText: {
    fontSize: 9.5,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  userEmailText: {
    fontSize: 13,
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 4,
  },

  // --- Quick Stats Grid ---
  statsGridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: DeviceWidth * 0.92,
    alignSelf: 'center',
    marginVertical: 4,
    gap: 10,
  },
  statGlassCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.04,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  statIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  statValueText: {
    fontSize: 16,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '800',
    color: '#0F172A',
  },
  statLabelText: {
    fontSize: 11,
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    color: '#64748B',
    marginTop: 1,
  },

  // --- Action Cards Row ---
  actionCardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: DeviceWidth * 0.92,
    alignSelf: 'center',
    marginVertical: 8,
    gap: 10,
  },
  actionCardItem: {
    height: 135,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F1F5F9',
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
  actionCardIconBox: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.18,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  actionCardTitleContainer: {
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  actionCardTitle: {
    fontSize: 11.5,
    lineHeight: 15,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
  },
  actionCardPillSlot: {
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionCardPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  actionCardPillText: {
    fontSize: 10,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // --- Section Group Card ---
  sectionCard: {
    width: DeviceWidth * 0.92,
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.04,
        shadowRadius: 10,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  headerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  sectionHeaderTitle: {
    fontSize: 13.5,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '800',
    color: '#0F172A',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  settingItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  settingIconBadge: {
    width: 38,
    height: 38,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  settingItemText: {
    fontSize: 14.5,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
    color: '#0F172A',
  },
  settingItemSubText: {
    fontSize: 11,
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    color: '#64748B',
    marginTop: 1.5,
  },

  // --- Upload Modal ---
  uploadModalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  uploadModalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: -6},
        shadowOpacity: 0.15,
        shadowRadius: 16,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  modalHandleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E2E8F0',
    marginBottom: 16,
  },
  uploadModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  uploadModalTitle: {
    color: '#0F172A',
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontSize: 20,
    fontWeight: '800',
  },
  uploadModalSubtitle: {
    color: '#64748B',
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    fontSize: 12,
    marginTop: 2,
  },
  closeBtnCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadAvatarContainer: {
    position: 'relative',
    marginVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadAvatarRing: {
    width: 156,
    height: 156,
    borderRadius: 78,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadAvatarImg: {
    width: 148,
    height: 148,
    borderRadius: 74,
    backgroundColor: '#F1F5F9',
  },
  uploadAvatarBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#7C3AED',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 6,
    right: 8,
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
  },
  uploadBtnSection: {
    width: '100%',
    alignItems: 'center',
    marginTop: 16,
    gap: 10,
  },
  pickOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
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
  pickOptionIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickOptionTitle: {
    color: '#0F172A',
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontSize: 15,
    fontWeight: '700',
  },
  pickOptionSub: {
    color: '#64748B',
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    fontSize: 12,
    marginTop: 2,
  },
  mainUploadBtnWrapper: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  mainUploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 10,
    borderRadius: 16,
  },
  mainUploadBtnText: {
    color: '#FFFFFF',
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryChooseBtn: {
    paddingVertical: 10,
  },
  secondaryChooseBtnText: {
    color: '#64748B',
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontSize: 13,
    fontWeight: '600',
  },

  // --- Delete & Logout Modals ---
  modalContainer1: {
    ...StyleSheet.absoluteFillObject,
  },
  deleteModalCard: {
    padding: 24,
    borderRadius: 24,
    width: DeviceWidth * 0.88,
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    top: DeviceHeigth * 0.32,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowOffset: {height: 10, width: 0},
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  deleteIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  deleteTitle: {
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
    fontSize: 19,
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 6,
  },
  deleteSubtitle: {
    fontFamily: Fonts.MONTSERRAT_REGULAR,
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  modalOverlayContainer: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  deleteModalCardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    width: '100%',
    maxWidth: 360,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#EF4444',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
    borderWidth: 1.5,
    borderColor: '#FEE2E2',
  },
  dangerIconHaloCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#FEE2E2',
    shadowColor: '#EF4444',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  deleteModalTitleText: {
    fontSize: 20,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
  },
  deleteModalSubtitleText: {
    fontSize: 12,
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
  },

  impactLossContainer: {
    width: '100%',
    backgroundColor: '#FEF2F2',
    borderRadius: 14,
    padding: 12,
    marginTop: 12,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    gap: 8,
  },
  impactLossItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  impactLossText: {
    fontSize: 11.5,
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    color: '#991B1B',
    fontWeight: '600',
    flex: 1,
  },

  deleteModalBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '100%',
  },
  deleteModalCancelBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  deleteModalCancelBtnText: {
    fontSize: 13.5,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    color: '#475569',
    fontWeight: '700',
  },
  deleteModalConfirmBtnWrapper: {
    flex: 1.2,
    borderRadius: 14,
    overflow: 'hidden',
  },
  deleteModalConfirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    paddingHorizontal: 10,
    borderRadius: 14,
    gap: 6,
    shadowColor: '#EF4444',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  deleteModalConfirmBtnText: {
    fontSize: 13.5,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    color: '#FFFFFF',
    fontWeight: '800',
  },

  // Logout Modal Styles
  logoutModalCardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    width: '100%',
    maxWidth: 360,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#667EEA',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 8,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  logoutIconHaloCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#C7D2FE',
    shadowColor: '#667EEA',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  logoutModalTitleText: {
    fontSize: 20,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
  },
  logoutModalSubtitleText: {
    fontSize: 12.5,
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 20,
    lineHeight: 18,
    paddingHorizontal: 6,
  },
  logoutModalBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '100%',
  },
  logoutModalCancelBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  logoutModalCancelBtnText: {
    fontSize: 13.5,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    color: '#475569',
    fontWeight: '700',
  },
  logoutModalConfirmBtnWrapper: {
    flex: 1,
    borderRadius: 14,
    overflow: 'hidden',
  },
  logoutModalConfirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    paddingHorizontal: 10,
    borderRadius: 14,
    gap: 6,
    shadowColor: '#667EEA',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutModalConfirmBtnText: {
    fontSize: 13.5,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    color: '#FFFFFF',
    fontWeight: '800',
  },

  confirmLogoutBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmLogoutBtnText: {
    color: '#FFFFFF',
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontSize: 14,
    fontWeight: '700',
  },

  // --- Version Footer ---
  versionFooter: {
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 10,
  },
  versionText: {
    fontSize: 12,
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    color: '#94A3B8',
  },
});

export default NewProfile;
