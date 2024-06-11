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
import RadioButtons from '../../Component/Utilities/RadioButtons';
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
  setChallengesData,
} from '../../Component/ThemeRedux/Actions';
import {useSelector, useDispatch} from 'react-redux';
const radioData = [
  {
    id: 1,
    title: 'English',
  },
  {
    id: 2,
    title: 'Hindi',
  },
];
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
  const routeName = route?.params?.routeName;
  const CustomCreated = route?.params?.CustomCreated;
  const {width: windowWidth} = useWindowDimensions();
  const contentWidth = windowWidth;
  useEffect(() => {
    setContent(getAgreementContent['term_condition_english']);
    if (Object.keys(getAgreementContent).length == 0) {
      getAgreementContentApi();
    }
  }, []);
  const getAgreementContentApi = async () => {
    setLoaded(false);
    try {
      const ApiCall = await axios(
        `${NewAppapi.GET_AGREEMENT}?version=${VersionNumber.appVersion}`,
        {
          method: 'GET',
        },
      );

      if (
        ApiCall?.data?.msg == 'Please update the app to the latest version.'
      ) {
        setLoaded(true);
        showMessage({
          message: ApiCall?.data?.msg,
          floating: true,
          duration: 500,
          type: 'danger',
          icon: {icon: 'auto', position: 'left'},
        });
      } else {
        setLoaded(true);
        dispatch(setAgreementContent(ApiCall?.data?.data[0]));
      }
    } catch (error) {
      console.log(error);
      setLoaded(true);
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
            color={checked ? '#A93737' : '#333333'}
          />
        </TouchableOpacity>
        <View>
          <Text style={styles.policyText}>By continuing you accept our</Text>
        </View>
      </View>
    );
  };
  const handleAgreement = () => {
    navigation.navigate('CountryLocation', {CustomCreated: CustomCreated});
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
          shadowColor: 'grey',
          ...Platform.select({
            ios: {
              shadowOffset: {width: 1, height: 0},
              shadowOpacity: 0.3,
              shadowRadius: 2,
            },
            android: {
              elevation: 4,
            },
          }),
        }}>
        {loaded ? null : <ActivityLoader />}
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
              value="Terms and Conditions"
              type="SubHeading"
              textTransform="uppercase"
              fontWeight="500"
              letterSpacing={0.2}
            />
            <FitText value="for In-App Cash Rewards" type="Heading" />
          </View>
          <TouchableOpacity
            onPress={() => setOpened(!opened)}
            activeOpacity={1}
            style={{
              width: DeviceWidth * 0.22,
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
              <AntDesign name={opened ? 'caretdown' : 'caretup'} size={10} />
            </View>
            {opened && (
              <View
                style={{
                  marginRight: 16,
                }}>
                <Modal
                  transparent
                  visible={opened}
                  style={{backgroundColor: 'red'}}>
                  <View
                    style={{
                      // width: DeviceWidth * 0.3,
                      backgroundColor: 'lightgrey',
                      justifyContent: 'flex-end',
                      alignSelf: 'flex-end',
                      top: DeviceHeigth * 0.1,
                      marginRight: 16,
                      paddingHorizontal: 10,
                      paddingVertical: 8,
                    }}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
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
                      />
                      <Text style={{color: AppColor.BLACK}}>English</Text>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <RadioButton
                        value="Hindi"
                        status={language === 'Hindi' ? 'checked' : 'unchecked'}
                        onPress={() => {
                          setLanguage('Hindi');
                          handleRadioButton('term_condition_hindi');
                          setTimeout(() => {
                            setOpened(!opened);
                          }, 250);
                        }}
                        color={AppColor.RED}
                      />
                      <Text style={{color: AppColor.BLACK}}>Hindi</Text>
                    </View>
                  </View>
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
});
