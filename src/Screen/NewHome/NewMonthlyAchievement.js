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
import {AppColor} from '../../Component/Color';
import {localImage} from '../../Component/Image';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../Component/Config';
import {Calendar} from 'react-native-calendars';
import AppleHealthKit from 'react-native-health';
import moment from 'moment';
import {useSelector, useDispatch} from 'react-redux';
import axios from 'axios';
import AnimatedLottieView from 'lottie-react-native';
import Calories from '../../Component/Calories';
import ActivityLoader from '../../Component/ActivityLoader';
import VersionNumber, {appVersion} from 'react-native-version-number';
import {showMessage} from 'react-native-flash-message';
import GoogleFit, {Scopes} from 'react-native-google-fit';
import Loader from '../../Component/Loader';
const NewMonthlyAchievement = () => {
  const [getDate, setDate] = useState(moment().format('YYYY-MM-DD'));
  const [selected, setSelected] = useState(false);
  const [steps, setSteps] = useState(0);
  const [Distance, setDistance] = useState(0);
  const [calories, setCalories] = useState(0);
  const {getUserDataDetails, getCustttomeTimeCal, getStepCounterOnoff} =
    useSelector(state => state);
  const [ApiData, setApiData] = useState([]);
  const [WorkoutCount, setWorkoutCount] = useState(0);
  const [WokoutCalories, setWorkoutCalories] = useState(0);
  const [WokroutTime_m, setWorkoutTime_m] = useState(0);
  const [WokroutTime_s, setWorkoutTime_s] = useState(0);
  const [calories1, setCalories1] = useState(0);
  const [Wtime, setWtime] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    const Calories1 = getCustttomeTimeCal.map(value => value.totalCalories);
    const Calories2 = Calories1?.reduce((acc, ind) => acc + ind, 0);
    const time1 = getCustttomeTimeCal?.map(value =>
      parseInt(value.totalRestTime),
    );
    const Time2 = time1?.reduce((acc, ind) => Math.ceil((acc + ind) / 60), 0);
    setWtime(Time2);
    if (Platform.OS == 'ios') {
      let options = {
        date: new Date().toISOString(), // optional; default now
        includeManuallyAdded: true, // optional: default true
      };
      AppleHealthKit.getStepCount(options, (callbackError, results) => {
        if (callbackError) {
          console.error('Error while getting the data:', callbackError);
          // Handle the error as needed
        } else {
          setCalories1(
            parseInt(((results?.value / 20) * 1).toFixed(0)) +
              parseInt(Calories2),
          );
        }
      });
    } else if (Platform.OS == 'android') {
      if (getStepCounterOnoff) {
        const getDailyData = async () => {
          try {
            const dailySteps = await GoogleFit.getDailySteps();
            const totalSteps = dailySteps.reduce(
              (total, acc) => (total + acc.steps[0] ? acc.steps[0].value : 0),
              0,
            );
            setCalories1(
              parseInt(totalSteps ? ((totalSteps / 20) * 1).toFixed(0) : 0) +
                parseInt(Calories2),
            );
          } catch (error) {
            console.error('Error fetching total steps', error);
          }
        };
        getDailyData();
      } else {
        setCalories1(parseInt(Calories2));
      }
    }
  }, []);
  const theme = useMemo(() => {
    return {
      calendarBackground: AppColor.BACKGROUNG,
      selectedDayBackgroundColor: AppColor.RED,
      selectedDayTextColor: AppColor.WHITE,
      todayTextColor: AppColor.BLACK,
      arrowColor: AppColor.RED,
      monthTextColor: AppColor.RED,
      indicatorColor: AppColor.RED,
      textMonthFontSize: 17,
      textDayFontFamily: 'Poppins-SemiBold',
      textMonthFontFamily: 'Poppins-SemiBold',
      dayTextColor: AppColor.BLACK,
    };
  }, []);
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
        const Calories = res.data.data.map(value =>
          parseInt(value.exercise_calories),
        );
        //  cont Time=res.data.data.map((value)=>parseInt(value.))
        setWorkoutCalories(Calories?.reduce((acc, num) => acc + num, 0)); // adding steps calories here
        setIsLoaded(true);

        if (Platform.OS == 'android') {
          setSteps(res?.data?.steps[0]?.steps ? res?.data?.steps[0]?.steps : 0);
          setCalories(
            res?.data?.steps[0]?.calories ? res?.data?.steps[0]?.calories : 0,
          );
          setDistance(
            res?.data?.steps[0]?.distance ? res?.data?.steps[0]?.distance : 0,
          );
        }
      }
    } catch (error) {
      console.log('DatwWiseDataError', error);
      setIsLoaded(true);
    }
  };
  const HandleStepsAndCalories = Date1 => {
    if (Platform.OS == 'ios') {
      let options = {
        date: new Date(Date1).toISOString(), // optional; default now
        includeManuallyAdded: true, // optional: default true
      };
      AppleHealthKit.getStepCount(options, (callbackError, results) => {
        if (callbackError) {
          console.error('Error while getting the data:', callbackError);
          // Handle the error as needed
        } else {
          setSteps(results?.value);
          setDistance(((results?.value / 20) * 0.01).toFixed(2));
          setCalories(((results?.value / 20) * 1).toFixed(0));
        }
      });
    } else if (Platform.OS == 'android') {
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
  const DailyData = [
    {
      id: 1,
      img: (
        <Image
          source={localImage.Step1}
          style={{height: 25, width: 25}}
          resizeMode="contain"
        />
      ),
      txt: `${parseInt(calories) + WokoutCalories} Kcal`,
    },
    {
      id: 2,
      img: (
        <Image
          source={localImage.Step2}
          style={{height: 25, width: 25}}
          resizeMode="contain"
        />
      ),
      txt: `${Distance} Km`,
    },
    {
      id: 3,
      img: (
        <Image
          source={localImage.Step3}
          style={{height: 25, width: 25}}
          resizeMode="contain"
          tintColor={AppColor.RED}
        />
      ),
      txt: steps,
    },
  ];
  const Card_Data = [
    {
      id: 1,
      img: localImage.Fire1,
      txt1: calories1,
      txt2: 'Kcal',
    },
    {
      id: 2,
      img: localImage.Clock_p,
      txt1: Wtime,
      txt2: 'Min',
    },
    {
      id: 3,
      img: localImage.Biceps_p,
      txt1: getCustttomeTimeCal[0]
        ? getCustttomeTimeCal[0]?.exerciseCount
        : '0',
      txt2: 'Actions',
    },
  ];
  return (
    <SafeAreaView style={styles.Container}>
      <NewHeader header={'Monthly Achievement'} backButton={true} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            width: DeviceWidth * 0.9,
            alignSelf: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          {Card_Data.map((value, index) => (
            <View key={index} style={styles.cards}>
              <Image
                source={value.img}
                style={{width: 50, height: 50, alignSelf: 'center'}}
                resizeMode="contain"
              />
              <Text style={[styles.txts, {color: AppColor.RED}]}>
                {value?.txt1}
              </Text>
              <Text style={styles.txts}>{value.txt2}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Calendar
            onDayPress={day => {
              setDate(day.dateString);
              setSelected(true);
              HandleStepsAndCalories(day.dateString);
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
                color: AppColor.RED,
                endingDay: true,
                textColor: AppColor.WHITE,
              },
            }}
            style={[
              styles.calender,
              {
                width: DeviceWidth * 0.85,
                backgroundColor: AppColor.BACKGROUNG,
              },
            ]}
            theme={theme}
          />
        </View>
        <View
          style={{
            marginVertical: 20,
            width: DeviceWidth * 0.9,
            alignSelf: 'center',
          }}>
          <Text
            style={{
           
              fontSize: 24,
              color: AppColor.BLACK,
              fontFamily: 'Montserrat-SemiBold',
              fontWeight: 'bold',
              lineHeight: 19.5,
              fontSize: 18,
              alignItems: 'center',
             
            }}>
            {moment(getDate).format('MMM DD, YYYY')}
          </Text>
        </View>
        <View
          style={{
            marginBottom: 20,
            width: DeviceWidth * 0.9,
            alignSelf: 'center',
          }}>
          {ApiData.length == 0 ? null : (
            <Text
              style={{
                color: AppColor.BoldText,
                fontFamily: 'Poppins-SemiBold',
                fontSize: 14,
              }}>
              {`${ApiData?.length} Workouts`}
            </Text>
          )}
        </View>

        {ApiData.length == 0 ? (
          isLoaded ? (
            <EmptyComponent />
          ) : (
            <Loader />
          )
        ) : isLoaded ? (
          <View style={[styles.card, {flexDirection: 'column'}]}>
            {isLoaded ? null : <ActivityLoader />}
            <FlatList
              data={ApiData}
              horizontal
              renderItem={(value, index) => {
                return (
                  <View>
                    <View
                      style={{
                        width: 90,
                        height: 80,
                        marginHorizontal: 10,
                        borderRadius: 20,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: AppColor.GRAY,
                      }}>
                      <Image
                        source={{uri: value.item.exercise_image_link}}
                        style={{
                          height: 70,
                          width: 70,
                        }}
                        resizeMode="contain"
                      />
                    </View>
                    <Text
                      style={{
                        textAlign: 'center',
                        marginVertical: 10,
                        width: 90,
                        fontFamily: 'Poppins-SemiBold',
                        color: AppColor.BoldText,
                        fontSize: 12,
                        marginLeft: 4,
                      }}>
                      {value.item.exercise_title}
                    </Text>
                  </View>
                );
              }}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              updateCellsBatchingPeriod={100}
              removeClippedSubviews={true}
              keyExtractor={(item, index) => index.toString()}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginVertical: 10,
              }}>
              {DailyData.map((value, index) => (
                <View
                  key={index}
                  style={{
                    marginHorizontal: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  {value.img}
                  <Text
                    style={{
                      textAlign: 'center',
                      color: AppColor.BoldText,
                      fontSize: 14,
                      fontWeight: '600',
                      marginLeft: 8,
                    }}>
                    {value.txt}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <Loader />
        )}
      </ScrollView>
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
    padding: 20,
    backgroundColor: AppColor.BACKGROUNG,
    width: DeviceWidth * 0.95,
    borderRadius: 20,
    marginVertical: 10,
    alignSelf: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 5, height: 5},
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  cards: {
    backgroundColor: AppColor.BACKGROUNG,
    width: (DeviceWidth * 0.9) / 3.2,
    marginRight: 5,
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
  txts: {
    color: AppColor.BLACK,
    textAlign: 'center',
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    marginTop: 10,
    
  },
});
export default NewMonthlyAchievement;
