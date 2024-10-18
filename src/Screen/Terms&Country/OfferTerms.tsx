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
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {AppColor, Fonts} from '../../Component/Color';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  Api,
  DeviceHeigth,
  DeviceWidth,
  NewApi,
  NewAppapi,
} from '../../Component/Config';
import FitText from '../../Component/Utilities/FitText';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import VersionNumber from 'react-native-version-number';
import NewButton from '../../Component/NewButton';
import axios from 'axios';
import {showMessage} from 'react-native-flash-message';
import HTML from 'react-native-render-html';
import ActivityLoader from '../../Component/ActivityLoader';
import {RadioButton} from 'react-native-paper';
import {
  setAgreementContent,
  setBanners,
  setChallengesData,
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
import { AuthorizationStatus } from '@notifee/react-native';
const OfferTerms = ({navigation, route}: any) => {
  const dispatch = useDispatch();
  const [language, setLanguage] = useState('English');
  const [opened, setOpened] = useState(false);
  const [checked, setChecked] = useState(false);
  const [content, setContent] = useState('');
  const [loaded, setLoaded] = useState(true);
  const getAgreementContent = useSelector(
    (state: any) => state.getAgreementContent,
  );
  const [modalVisible, setModalVisible] = useState(true);
  const screenType = route?.params?.type;
  const {width: windowWidth} = useWindowDimensions();
  const contentWidth = windowWidth;
  const getUserDataDetails = useSelector(state => state.getUserDataDetails);
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
        const objects = {};
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
  const CheckBox = () => {
    return (
      <View style={styles.checkBoxContainer}>
        <TouchableOpacity onPress={() => setChecked(!checked)}>
          <Icons
            name={checked ? 'checkbox-marked' : 'checkbox-blank-outline'}
            size={28}
            color={checked ? AppColor.RED : '#333333'}
          />
        </TouchableOpacity>
        <View>
          <Text style={styles.policyText}>
            By continuing you accept our terms and conditions
          </Text>
        </View>
      </View>
    );
  };
  //check permissions
  const isObject = result => {
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
          result?.result['authorizationStatus'] === AuthorizationStatus.DENIED)
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
        message: 'Please agree the terms and conditons',
        type: 'danger',
        animationDuration: 500,
        floating: true,
        icon: {icon: 'auto', position: 'left'},
      });
    } else {
      storeAgreementApi(getUserDataDetails).then(res => {
        dispatch(setOfferAgreement(res));
        checkPermissions();
      });
    }
  };
  // to check and uncheck the box automatically
  const handleScroll = event => {
    const {contentOffset, layoutMeasurement, contentSize} = event.nativeEvent;
    // If the user scrolls to the top (offset is 0), uncheck the box
    if (contentOffset.y === 0) {
      setChecked(false);
    } // Calculate the scroll position relative to the bottom of the content
    const scrollPosition = layoutMeasurement.height + contentOffset.y;
    const scrollHeight = contentSize.height;

    // If the user scrolls to the bottom, check the box
    if (scrollPosition >= scrollHeight) {
      setChecked(true);
    }
  };
  // Agreement Api

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          backgroundColor: 'white',
          paddingVertical: (DeviceWidth * 0.1) / 2,
          // shadowColor: 'grey',
          // ...Platform.select({
          //   ios: {
          //     shadowOffset: {width: 1, height: 0},
          //     shadowOpacity: 0.3,
          //     shadowRadius: 2,
          //   },
          //   android: {
          //     elevation: 4,
          //   },
          // }),
        }}>
        {loaded ? null : <ActivityLoader />}
        {screenType ? (
          <Icon
            name="arrow-left"
            color={AppColor.BLACK}
            size={25}
            style={{marginLeft: 14}}
            onPress={() => navigation.navigate('BottomTab', {screen: 'Home'})}
          />
        ) : (
          <></>
        )}
        <View
          style={{
            marginTop: 10,
            paddingHorizontal: 16,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View>
            <FitText
              value="Terms of Use for"
              type="SubHeading"
              textTransform="uppercase"
              fontWeight="500"
              letterSpacing={0.2}
              fontSize={14}
            />
            <FitText value="In-App Rewards" type="Heading" fontSize={22} />
          </View>
          <TouchableOpacity
            onPress={() => setOpened(!opened)}
            activeOpacity={1}
            style={{
              width: DeviceWidth * 0.22,
              marginRight: 10,
            }}>
            <View
              style={{
                backgroundColor: '#3333330A',
                padding: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <FitText
                type="normal"
                value={language}
                fontWeight="500"
                fontSize={12}
              />
              <AntDesign
                name={opened ? 'caretup' : 'caretdown'}
                size={10}
                color={AppColor.BLACK}
              />
            </View>
            {opened && (
              <View
                style={{
                  marginRight: 16,
                }}>
                <Modal transparent visible={opened} animationType="slide">
                  <BlurView
                    style={styles.modalContainer1}
                    blurType="light"
                    blurAmount={1}
                    reducedTransparencyFallbackColor="white">
                    <TouchableOpacity
                      activeOpacity={1}
                      style={{flex: 1}}
                      onPress={() => setOpened(false)}>
                      <View
                        style={{
                          // width: DeviceWidth * 0.3,
                          backgroundColor: AppColor.BACKGROUNG,
                          justifyContent: 'flex-end',
                          alignSelf: 'flex-end',
                          top: DeviceHeigth * 0.1,
                          marginRight: 8,
                          paddingHorizontal: 12,
                          paddingVertical: 8,
                          borderRadius: 12,
                          // borderWidth: 1,
                        }}>
                        <View
                          style={{flexDirection: 'row', alignItems: 'center'}}>
                          <RadioButton
                            value="English"
                            status={
                              language === 'English' ? 'checked' : 'unchecked'
                            }
                            onPress={() => {
                              setLanguage('English');
                              handleRadioButton('term_condition_english');
                              setTimeout(() => {
                                setOpened(!opened);
                              }, 250);
                            }}
                            color={AppColor.RED}
                            uncheckedColor="grey"
                          />
                          <Text
                            style={{color: AppColor.BLACK}}
                            onPress={() => {
                              setLanguage('English');
                              handleRadioButton('term_condition_english');
                              setTimeout(() => {
                                setOpened(!opened);
                              }, 250);
                            }}>
                            English
                          </Text>
                        </View>
                        <View
                          style={{flexDirection: 'row', alignItems: 'center'}}>
                          <RadioButton
                            value="Hindi"
                            status={
                              language === 'Hindi' ? 'checked' : 'unchecked'
                            }
                            onPress={() => {
                              setLanguage('Hindi');
                              handleRadioButton('term_condition_hindi');
                              setTimeout(() => {
                                setOpened(!opened);
                              }, 250);
                            }}
                            color={AppColor.RED}
                            uncheckedColor="grey"
                          />
                          <Text
                            style={{color: AppColor.BLACK}}
                            onPress={() => {
                              setLanguage('Hindi');
                              handleRadioButton('term_condition_hindi');
                              setTimeout(() => {
                                setOpened(!opened);
                              }, 250);
                            }}>
                            Hindi
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </BlurView>
                </Modal>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
      <View style={{flex: 1}}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}>
          <View
            style={{
              marginHorizontal: 16,
            }}>
            <HTML
              source={{html: content}}
              tagsStyles={tagStyle}
              contentWidth={contentWidth}
            />
          </View>

          {!screenType ? (
            <>
              <View style={styles.HLine} />
              <CheckBox />
              <View style={{marginBottom: 15}}>
                <NewButton
                  pV={14}
                  title={'I Agree'}
                  disabled={!checked}
                  opacity={checked ? 1 : 0.7}
                  onPress={() => handleAgreement()}
                />
              </View>
            </>
          ) : (
            <></>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default OfferTerms;
const tagStyle = {
  h1: {
    color: AppColor.BLACK,
  },
  h2: {
    color: AppColor.BLACK,
  },
  p: {
    color: AppColor.BLACK,
    fontSize: 15,
    lineHeight: 20,
  },
  ul: {
    color: AppColor.BLACK,
  },
  li: {
    color: AppColor.BLACK,
  },
};
const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: AppColor.WHITE},
  policyText: {
    fontFamily: Fonts.MONTSERRAT_REGULAR,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
    color: AppColor.BLACK,
    marginLeft: 10,
  },
  buttonText: {
    fontSize: 14,
    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
    lineHeight: 20,
    fontWeight: '500',
    zIndex: 1,
    color: AppColor.WHITE,
  },
  HLine: {
    backgroundColor: '#3333331A',
    height: 1,
    width: '100%',
  },
  checkBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '85%',
    alignSelf: 'center',
    paddingRight: DeviceWidth * 0.08,
    marginTop: DeviceHeigth * 0.02,
    marginBottom: DeviceWidth * 0.1,
  },
  modalContainer1: {
    flex: 1,
    backgroundColor: `rgba(0,0,0,0.2)`,
  },
});
