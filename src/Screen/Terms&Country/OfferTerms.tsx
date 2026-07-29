import {
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
  StatusBar,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import {AppColor, Fonts} from '../../Component/Color';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  DeviceHeigth,
  DeviceWidth,
  NewAppapi,
} from '../../Component/Config';
import FitText from '../../Component/Utilities/FitText';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import VersionNumber from 'react-native-version-number';
import axios from 'axios';
import {showMessage} from 'react-native-flash-message';
import HTML from 'react-native-render-html';
import ActivityLoader from '../../Component/ActivityLoader';
import {RadioButton} from 'react-native-paper';
import {
  setAgreementContent,
  setBanners,
  setCompleteProfileData,
  Setmealdata,
  setOfferAgreement,
  setStoreData,
} from '../../Component/ThemeRedux/Actions';
import {useSelector, useDispatch} from 'react-redux';
import {BlurView} from '@react-native-community/blur';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {AnalyticsConsole} from '../../Component/AnalyticsConsole';
import {storeAgreementApi} from '../../Component/Permissions/PermissionHooks';
import {
  permissionMethods,
  UIArray,
} from '../../Component/Permissions/PermissionMethods';
import {RESULTS} from 'react-native-permissions';
import {AuthorizationStatus} from '@notifee/react-native';
import {LogOut} from '../../Component/LogOut';
import {translate} from '../Translation/TranslationService';
import FitIcon from '../../Component/Utilities/FitIcon';

// Feature Badges Header Component
const FeatureBadges = () => (
  <View style={styles.featureBadgesContainer}>
    <View style={styles.featurePill}>
      <FitIcon
        name="shield-check"
        size={14}
        type="MaterialCommunityIcons"
        color="#10B981"
      />
      <Text style={styles.featurePillText}>Encrypted & Secure</Text>
    </View>
    <View style={styles.featurePill}>
      <FitIcon
        name="star-circle"
        size={14}
        type="MaterialCommunityIcons"
        color="#8B5CF6"
      />
      <Text style={styles.featurePillText}>Personalized AI</Text>
    </View>
    <View style={styles.featurePill}>
      <FitIcon
        name="check-decagram"
        size={14}
        type="MaterialCommunityIcons"
        color="#FF2A54"
      />
      <Text style={styles.featurePillText}>No Hidden Fees</Text>
    </View>
  </View>
);

const OfferTerms = ({navigation, route}: any) => {
  const dispatch = useDispatch();
  const [language, setLanguage] = useState('English');
  const [opened, setOpened] = useState(false);
  const [checked, setChecked] = useState(false);
  const [content, setContent] = useState('');
  const [loaded, setLoaded] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(15);

  const getAgreementContent = useSelector(
    (state: any) => state.getAgreementContent,
  );
  const screenType = route?.params?.type;
  const {width: windowWidth} = useWindowDimensions();
  const contentWidth = windowWidth - 32;
  const getUserDataDetails = useSelector((state: any) => state.getUserDataDetails);

  const checkScale = useSharedValue(1);

  useEffect(() => {
    checkScale.value = withSpring(checked ? 1.05 : 1, {damping: 12, stiffness: 200});
  }, [checked]);

  const checkAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: checkScale.value}],
  }));

  useEffect(() => {
    setContent(getAgreementContent['term_condition_english']);
    if (Object.keys(getAgreementContent).length == 0) {
      getUserAllInData();
    }
  }, []);

  const getUserAllInData = async () => {
    try {
      const responseData = await axios.get(
        `${NewAppapi.GET_ALL_IN_ONE}?version=${VersionNumber.appVersion}`,
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
      } else if (responseData?.data?.msg == 'version is required') {
      } else {
        const objects: any = {};
        responseData.data.data.forEach((item: any) => {
          objects[item?.type] = item?.image;
        });

        dispatch(setBanners(objects));
        dispatch(setAgreementContent(responseData?.data?.terms[0]));
        dispatch(Setmealdata(responseData?.data?.diets));
        dispatch(setStoreData(responseData?.data?.types));
        dispatch(setCompleteProfileData(responseData?.data?.additional_data));
      }
    } catch (error) {
      console.log('all_in_one_api_error', error);
    }
  };

  const handleRadioButton = (param: any) => {
    setContent(getAgreementContent[param]);
  };

  const isObject = (result: any) => {
    return !!(typeof result === 'object' && result != null);
  };

  const checkPermissions = () => {
    Promise.all(
      UIArray.map(item => {
        if (permissionMethods[item.checkPermission]) {
          return permissionMethods[item.checkPermission]().then(res => ({
            key: item.key,
            result: res,
          }));
        }
        return Promise.resolve({key: item.key, result: null});
      }),
    ).then(results => {
      const condition = results.some(result => {
        return (
          result?.result == RESULTS.DENIED ||
          result.result == RESULTS.BLOCKED ||
          (isObject(result?.result) &&
            result?.result['android.permission.ACCESS_FINE_LOCATION'] ==
              RESULTS.BLOCKED) ||
          (isObject(result?.result) &&
            result?.result['android.permission.ACCESS_FINE_LOCATION'] ==
              RESULTS.DENIED) ||
          (isObject(result?.result) &&
            result?.result['authorizationStatus'] ===
              AuthorizationStatus.DENIED)
        );
      });
      if (condition) {
        navigation.navigate('PermissionScreen');
      } else {
        navigation.navigate('BottomTab', {});
      }
    });
  };

  const handleAgreement = () => {
    AnalyticsConsole('IAR_ACC');
    if (!checked) {
      showMessage({
        message: 'Please agree the terms and conditions',
        type: 'danger',
        animationDuration: 500,
        floating: true,
        icon: {icon: 'auto', position: 'left'},
      });
    } else {
      storeAgreementApi(getUserDataDetails).then(res => {
        if (res == 'Account Deleted') {
          LogOut(dispatch);
        } else {
          dispatch(setOfferAgreement(res));
          checkPermissions();
        }
      });
    }
  };

  const handleScroll = (event: any) => {
    const {contentOffset, layoutMeasurement, contentSize} = event.nativeEvent;
    const scrollPosition = layoutMeasurement.height + contentOffset.y;
    const scrollHeight = contentSize.height;

    const progress = Math.min(100, Math.max(15, (scrollPosition / scrollHeight) * 100));
    setScrollProgress(Math.round(progress));

    if (scrollPosition >= scrollHeight - 40) {
      setChecked(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header Container */}
      <Animated.View
        entering={FadeInDown.duration(500).springify()}
        style={styles.headerContainer}>
        {!loaded && <ActivityLoader />}
        
        {screenType && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('BottomTab', {screen: 'Home'})}>
            <Icon name="arrow-left" color="#0F172A" size={22} />
          </TouchableOpacity>
        )}

        <View style={styles.headerTitleRow}>
          <View style={styles.titleWrap}>
            <Text style={styles.subHeadingText}>
              {translate('termsuse') || 'TERMS OF SERVICE'}
            </Text>
            <Text style={styles.headingText}>
              {translate('appreward') || 'User Agreement'}
            </Text>
          </View>

          {/* Language Picker Pill */}
          <TouchableOpacity
            onPress={() => setOpened(true)}
            activeOpacity={0.8}
            style={styles.langPill}>
            <FitIcon
              name="web"
              size={14}
              type="MaterialCommunityIcons"
              color="#FF2A54"
            />
            <Text style={styles.langText}>{language}</Text>
            <AntDesign name="caretdown" size={9} color="#64748B" />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Language Selector Modal */}
      {opened && (
        <Modal transparent visible={opened} animationType="fade">
          <BlurView
            style={styles.modalBlur}
            blurType="light"
            blurAmount={4}
            reducedTransparencyFallbackColor="white">
            <TouchableOpacity
              activeOpacity={1}
              style={styles.modalOverlay}
              onPress={() => setOpened(false)}>
              <Animated.View
                entering={FadeInDown.duration(300).springify()}
                style={styles.modalCard}>
                <Text style={styles.modalTitle}>Select Language</Text>

                <TouchableOpacity
                  style={[
                    styles.langOption,
                    language === 'English' && styles.langOptionSelected,
                  ]}
                  onPress={() => {
                    setLanguage('English');
                    handleRadioButton('term_condition_english');
                    setOpened(false);
                  }}>
                  <RadioButton
                    value="English"
                    status={language === 'English' ? 'checked' : 'unchecked'}
                    color="#FF2A54"
                    uncheckedColor="#94A3B8"
                  />
                  <Text style={styles.langOptionText}>English</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.langOption,
                    language === 'Hindi' && styles.langOptionSelected,
                  ]}
                  onPress={() => {
                    setLanguage('Hindi');
                    handleRadioButton('term_condition_hindi');
                    setOpened(false);
                  }}>
                  <RadioButton
                    value="Hindi"
                    status={language === 'Hindi' ? 'checked' : 'unchecked'}
                    color="#FF2A54"
                    uncheckedColor="#94A3B8"
                  />
                  <Text style={styles.langOptionText}>Hindi (हिंदी)</Text>
                </TouchableOpacity>
              </Animated.View>
            </TouchableOpacity>
          </BlurView>
        </Modal>
      )}

      {/* Scrollable Terms Content */}
      <View style={styles.contentWrap}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={styles.scrollContent}>
          {/* Feature Badges Banner */}
          <FeatureBadges />

          {/* Reading Progress Track */}
          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>
                Terms Verification ({scrollProgress}%)
              </Text>
              {checked && <Text style={styles.verifiedText}>VERIFIED ✓</Text>}
            </View>
            <View style={styles.progressBarTrack}>
              <View style={[styles.progressBarFill, {width: `${scrollProgress}%`}]} />
            </View>
          </View>

          <View style={styles.htmlCard}>
            <HTML
              source={{html: content}}
              tagsStyles={tagStyle}
              contentWidth={contentWidth}
            />
          </View>
        </ScrollView>
      </View>

      {/* Bottom Agreement Sticky Bar */}
      {!screenType && (
        <Animated.View
          entering={FadeInUp.duration(600).springify()}
          style={styles.bottomBarContainer}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setChecked(!checked)}
            style={[
              styles.checkboxRow,
              checked && styles.checkboxRowChecked,
            ]}>
            <View style={[styles.customCheck, checked && styles.customCheckActive]}>
              {checked && (
                <FitIcon
                  name="check"
                  size={14}
                  type="MaterialCommunityIcons"
                  color="#FFFFFF"
                />
              )}
            </View>
            <Text style={styles.policyText}>
              {translate('acceptterm') || 'I read and accept all terms & privacy policies'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.9}
            disabled={!checked}
            onPress={handleAgreement}
            style={[styles.buttonWrap, !checked && {opacity: 0.55}]}>
            <LinearGradient
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              colors={['#FF2A54', '#E11D48', '#C2255C']}
              style={styles.agreeButton}>
              <Text style={styles.agreeButtonText}>
                {translate('iagree') || 'I AGREE & CONTINUE'}
              </Text>
              <FitIcon
                name="arrowright"
                size={18}
                type="AntDesign"
                color="#FFFFFF"
              />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

export default OfferTerms;

const tagStyle = {
  h1: {
    color: '#0F172A',
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontSize: 20,
    marginTop: 14,
    marginBottom: 8,
  },
  h2: {
    color: '#0F172A',
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontSize: 18,
    marginTop: 12,
    marginBottom: 6,
  },
  p: {
    color: '#334155',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 10,
    fontFamily: Fonts.MONTSERRAT_REGULAR,
  },
  ul: {
    color: '#334155',
    marginBottom: 10,
  },
  li: {
    color: '#334155',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 8 : 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleWrap: {
    flex: 1,
  },
  subHeadingText: {
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontSize: 11,
    color: '#FF2A54',
    letterSpacing: 1.2,
    fontWeight: '700',
  },
  headingText: {
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontSize: 20,
    color: '#0F172A',
    fontWeight: '800',
    marginTop: 2,
  },
  langPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  langText: {
    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '600',
    marginHorizontal: 6,
  },
  modalBlur: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: {width: 0, height: 10},
        shadowOpacity: 0.2,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  modalTitle: {
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontSize: 18,
    color: '#0F172A',
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  langOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginBottom: 8,
    backgroundColor: '#F8FAFC',
  },
  langOptionSelected: {
    backgroundColor: '#FFF1F4',
    borderWidth: 1.5,
    borderColor: '#FF2A54',
  },
  langOptionText: {
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '600',
    marginLeft: 8,
  },
  contentWrap: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 140,
  },
  htmlCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.04,
        shadowRadius: 10,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  bottomBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: {width: 0, height: -6},
        shadowOpacity: 0.06,
        shadowRadius: 12,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  checkboxRowChecked: {
    backgroundColor: '#FFF1F4',
    borderColor: '#FF2A54',
  },
  customCheck: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#94A3B8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  customCheckActive: {
    borderColor: '#FF2A54',
    backgroundColor: '#FF2A54',
  },
  policyText: {
    flex: 1,
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '600',
  },
  buttonWrap: {
    borderRadius: 28,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#FF2A54',
        shadowOffset: {width: 0, height: 8},
        shadowOpacity: 0.35,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  featureBadgesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  featurePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.04,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  featurePillText: {
    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
    fontSize: 11,
    color: '#334155',
    fontWeight: '600',
    marginLeft: 5,
  },
  progressContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressTitle: {
    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  verifiedText: {
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontSize: 11,
    color: '#10B981',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FF2A54',
    borderRadius: 3,
  },
  agreeButton: {
    height: 54,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  agreeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
    letterSpacing: 1,
    marginRight: 8,
  },
});
