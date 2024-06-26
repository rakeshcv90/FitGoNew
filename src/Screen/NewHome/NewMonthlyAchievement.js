import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  ScrollView,
  FlatList,
  Platform,
  TouchableOpacity,
} from 'react-native';
import React, {useMemo, useState, useEffect} from 'react';
import NewHeader from '../../Component/Headers/NewHeader';
import {AppColor, Fonts} from '../../Component/Color';
import {localImage} from '../../Component/Image';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../Component/Config';
import {Calendar} from 'react-native-calendars';
import moment from 'moment';
import {useSelector, useDispatch} from 'react-redux';
import axios from 'axios';
import AnimatedLottieView from 'lottie-react-native';
import VersionNumber, {appVersion} from 'react-native-version-number';
import {showMessage} from 'react-native-flash-message';
import Loader from '../../Component/Loader';
import {AnalyticsConsole} from '../../Component/AnalyticsConsole';
import {
  BmiMeter,
  BMImodal,
  CaloriesActionReport,
} from '../../Component/BmiComponent';
import { useFocusEffect } from '@react-navigation/native';
import { red } from 'react-native-reanimated/lib/typescript/reanimated2/Colors';
const NewMonthlyAchievement = ({navigation}) => {
  const [getDate, setDate] = useState(moment().format('YYYY-MM-DD'));
  const getUserDataDetails = useSelector(state => state?.getUserDataDetails);
  const getBmi = useSelector(state => state.getBmi);
  const [ApiData, setApiData] = useState([]);
  const [WokoutCalories, setWorkoutCalories] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    DateWiseData(moment.utc().format('YYYY-MM-DD')); // to get the datewise data
  }, []);
  const DateWiseData = async Date1 => {
    const payload = new FormData();
    payload.append('user_id', getUserDataDetails?.id);
    payload.append('date', Date1);
    payload.append('version', VersionNumber.appVersion);
    try {
      const res = await axios({
        url: NewAppapi.DateWiseData,
        method: 'POST',
        headers: {'Content-Type': 'multipart/form-data'},
        data: payload,
      });
      if (res?.data?.msg == 'Please update the app to the latest version.') {
        showMessage({
          message: res?.data?.msg,
          type: 'danger',
          animationDuration: 500,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
        setIsLoaded(true);
      } else if (res) {
        setIsLoaded(true);
        setApiData(res.data.data);
        console.log('apicall',res.data)
        const Calories = res?.data?.data?.map(value =>
          parseInt(value?.exercise_calories),
        );
        setWorkoutCalories(Calories?.reduce((acc, num) => acc + num, 0)); // adding steps calories here
        setIsLoaded(true);

        if (Platform.OS == 'android') {
          // nothing to show for now
        }
      }
    } catch (error) {
      console.log('DatwWiseDataError', error);
      setIsLoaded(true);
    }
  };
  const EmptyComponent = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {/* {isLoaded ? null : <ActivityLoader />} */}
        <AnimatedLottieView
          source={require('../../Icon/Images/NewImage/NoData.json')}
          speed={2}
          autoPlay
          loop
          resizeMode="contain"
          style={{
            width: DeviceWidth * 0.3,
            height: DeviceHeigth * 0.15,
          }}
        />
      </View>
    );
  };
  const theme = useMemo(() => {
    return {
      calendarBackground: AppColor.WHITE,
      selectedDayBackgroundColor: '#f0013b',
      selectedDayTextColor: AppColor.WHITE,
      todayTextColor: AppColor.BLACK,
      arrowColor: '#f0013b',
      monthTextColor: '#f0013b',
      indicatorColor: '#f0013b',
      textMonthFontSize: 17,
      textDayFontFamily: Fonts.MONTSERRAT_BOLD,
      textMonthFontFamily: Fonts.MONTSERRAT_BOLD,
      dayTextColor: AppColor.BLACK,
    };
  }, []);
  const CalroiesActionArr = [
    {id: 1, img: localImage.Fire1, txt: 'Total Kcal', value: WokoutCalories},
    {id: 1, img: localImage.Action, txt: 'Action', value: ApiData?.length},
  ];
  return (
    <SafeAreaView style={styles.Container}>
      <NewHeader header={'Report'} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {getBmi?.Bmi ? (
          <View>
            <View style={styles.View4}>
              <Text
                style={[
                  styles.txt1,
                  {fontFamily: Fonts.MONTSERRAT_BOLD, fontSize: 19},
                ]}>
                BMI
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Text
                  style={[styles.txt1, {fontSize: 19, color: AppColor.RED}]}>
                  Edit
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={[
                styles.card,
                {
                  justifyContent: 'center',
                  flexDirection: 'column',
                  alignItems: 'center',
                },
              ]}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: 10,
                  alignItems: 'center',
                }}>
                <Text style={styles.txt4}>Weight: {getBmi?.userWeight}</Text>
                <View
                  style={{
                    height: 20,
                    width: 0,
                    borderWidth: 0.3,
                    borderColor: AppColor.Gray5,
                    marginHorizontal: 10,
                  }}
                />
                <Text style={styles.txt4}>Height: {getBmi?.userHeight}</Text>
              </View>
              <View style={{marginTop: 20}}>
                <BmiMeter getBmi={getBmi?.Bmi} />
              </View>
            </View>
          </View>
        ) : (
          <View>
            <View style={styles.View4}>
              <Text
                style={[
                  styles.txt1,
                  {fontFamily: Fonts.MONTSERRAT_BOLD, fontSize: 19},
                ]}>
                BMI
              </Text>
            </View>
            <View style={styles.card}>
              <Text
                style={{
                  fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                  color: AppColor.BLACK,
                  fontSize: 16,
                }}>
                BMI (kg/m²)
              </Text>
              <Text
                style={{
                  color: '#f0013b',
                  fontFamily: Fonts.MONTSERRAT_MEDIUM,
                  fontSize: 17,
                }}
                onPress={() => {
                  setModalVisible(true);
                }}>
                Check
              </Text>
            </View>
          </View>
        )}
        <View>
          <View style={[styles.View4,{marginVertical:5}]}>
            <Text
              style={[
                styles.txt1,
                {fontFamily: Fonts.MONTSERRAT_BOLD, fontSize: 19},
              ]}>
              Achievement
            </Text>
          </View>
          <View style={[styles.card, {flexDirection: 'column'}]}>
            <Calendar
              onDayPress={day => {
                AnalyticsConsole(`${day.dateString.replaceAll('-', '_')}`);
                setDate(day.dateString);
                DateWiseData(day.dateString);
                setIsLoaded(false);
              }}
              allowSelectionOutOfRange={false}
              markingType="period"
              enableSwipeMonths
              hideExtraDays={true}
              hideDayNames={false}
              markedDates={{
                [getDate]: {
                  startingDay: true,
                  color: '#f0013b',
                  endingDay: true,
                  textColor: AppColor.WHITE,
                },
              }}
              style={[
                styles.calender,
                {
                  width: DeviceWidth * 0.85,
                  backgroundColor: AppColor.WHITE,
                },
              ]}
              theme={theme}
            />
            <View
              style={{
                borderWidth: 0.4,
                height: 0,
                marginTop: 15,
                borderColor: AppColor.GRAY2,
                marginHorizontal: -20,
              }}
            />
            <View style={{marginVertical: 20, marginHorizontal: -20}}>
              {ApiData.length == 0 ? (
                isLoaded ? (
                  <EmptyComponent />
                ) : (
                  <Loader />
                )
              ) : isLoaded ? (
                <>
                  <FlatList
                    data={ApiData}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={(value, index) => {
                      return (
                        <View>
                          <View
                            style={{
                              // width: 90,
                              borderColor: AppColor.GRAY1,
                              borderRadius: 6,
                              marginHorizontal: 10,
                              justifyContent: 'center',
                              alignItems: 'center',
                              backgroundColor: AppColor.WHITE,
                              borderWidth: 1,
                            }}>
                            <Image
                              source={{uri: value.item.exercise_image_link}}
                              style={{
                                height: 70,
                                width: 70,
                              }}
                              resizeMode="contain"
                            />
                            <Text
                              numberOfLines={1}
                              style={{
                                textAlign: 'center',
                                width: 100,
                                fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                                color: AppColor.BoldText,
                                fontSize: 12,
                                backgroundColor: AppColor.LIGHTGREY2,
                                padding: 10,
                                borderBottomRightRadius: 6,
                                borderBottomLeftRadius: 6,
                              }}>
                              {value.item.exercise_title}
                            </Text>
                          </View>
                        </View>
                      );
                    }}
                    initialNumToRender={10}
                    maxToRenderPerBatch={10}
                    updateCellsBatchingPeriod={100}
                    removeClippedSubviews={true}
                    keyExtractor={(item, index) => index.toString()}
                  />
                  <View style={{marginTop: 20, marginHorizontal: 10}}>
                    <CaloriesActionReport arr={CalroiesActionArr} />
                  </View>
                </>
              ) : (
                <Loader />
              )}
            </View>
          </View>
        </View>
      </ScrollView>
      <BMImodal
        setModalVisible={setModalVisible}
        modalVisible={modalVisible}
        dispatch={dispatch}
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: AppColor.WHITE,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: AppColor.WHITE,
    width: DeviceWidth * 0.95,
    borderRadius: 20,
    marginVertical: 10,
    alignSelf: 'center',
    shadowColor: 'grey',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 5, height: 5},
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cards: {
    backgroundColor: AppColor.BACKGROUNG,
    width: (DeviceWidth * 0.9) / 3.2,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
    padding: 10,
    borderRadius: 10,
  },
  View2: {},
  View4: {
    width: DeviceWidth * 0.9,
    alignSelf: 'center',
    flexDirection: 'row',

    justifyContent: 'space-between',
  },
  View5: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  // text styles
  txt1: {
    fontSize: 18,
    color: AppColor.BLACK,
    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
  },
  txt2: {
    color: AppColor.BLACK,
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    fontSize: 18,
    marginVertical: 15,
  },
  txt3: {
    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
    fontSize: 17,
  },
  txts: {
    color: AppColor.BLACK,
    textAlign: 'center',
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    marginTop: 10,
  },
  txt4: {
    color: AppColor.BLACK,
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    fontSize: 17,
  },
  // Button styles
});
export default NewMonthlyAchievement;
