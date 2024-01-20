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
import React, {useMemo, useState} from 'react';
import NewHeader from '../../Component/Headers/NewHeader';
import {AppColor} from '../../Component/Color';
import {localImage} from '../../Component/Image';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../Component/Config';
import {Calendar} from 'react-native-calendars';
import AppleHealthKit from 'react-native-health';
import moment from 'moment';
import {useSelector, useDispatch} from 'react-redux';
import axios from 'axios';
const NewMonthlyAchievement = () => {
  const [getDate, setDate] = useState(moment().format('YYYY-MM-DD'));
  const [selected, setSelected] = useState(false);
  const [steps, setSteps] = useState(0);
  const [Distance, setDistance] = useState(0);
  const [calories, setCalories] = useState(0);
  const {getUserDataDetails} = useSelector(state => state);
  const [ApiData, setApiData] = useState([]);
  const Card_Data = [
    {
      id: 1,
      img: localImage.Fire1,
      txt1: '4',
      txt2: 'KCal',
    },
    {
      id: 2,
      img: localImage.Clock_p,
      txt1: '2',
      txt2: 'Min',
    },
    {
      id: 3,
      img: localImage.Biceps_p,
      txt1: '3',
      txt2: 'Actions',
    },
  ];
  const theme = useMemo(() => {
    return {
      backgroundColor: AppColor.WHITE,
      calendarBackground: AppColor.WHITE,
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
  const HandleStepsAndCalories = Date1 => {
    if (Platform.OS == 'ios') {
      let options = {
        date: new Date(Date1).toISOString(), // optional; default now
        includeManuallyAdded: true, // optional: default true
      };
      // console.log('options====>', options);
      AppleHealthKit.getStepCount(options, (callbackError, results) => {
        if (callbackError) {
          console.error('Error while getting the data:', callbackError);
          // Handle the error as needed
        } else {
          console.log('iOS ', results);
          setSteps(results?.value);
          setDistance(((results?.value / 20) * 0.01).toFixed(2));
          setCalories(((results?.value / 20) * 1).toFixed(1));
        }
      });
    } else if (Platform.OS == 'android') {
      console.log('android======>');
    }
  };

  const DateWiseData = async Date1 => {
    const payload = new FormData();
    payload.append('user_id', getUserDataDetails?.id);
    payload.append('date', Date1);
    try {
      const res = await axios({
        url: NewAppapi.DateWiseData,
        method: 'POST',
        headers: {'Content-Type': 'multipart/form-data'},
        data: payload,
      });
      if (res) {
        console.log('DateWiseData===>', res.data);
        setApiData(res.data.data);
      }
    } catch (error) {
      console.log('DatwWiseDataError', error);
    }
  };
  return (
    <SafeAreaView style={styles.Container}>
      <NewHeader header={'Monthly Achievement'} backButton={true} />
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
            console.log(day);
            setDate(day.dateString);
            setSelected(true);
            HandleStepsAndCalories(day.dateString);
            DateWiseData(day.dateString);
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
            color: AppColor.BoldText,
            fontFamily: 'Poppins-SemiBold',
            fontSize: 24,
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
        <Text
          style={{
            color: AppColor.BoldText,
            fontFamily: 'Poppins-SemiBold',
            fontSize: 14,
          }}>
          {'3 Workouts'}
        </Text>
      </View>
      {/* <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{alignSelf:'center'}}> */}
        <View style={styles.card}>
          <FlatList
            data={ApiData}
            horizontal
            renderItem={(value, index) => {
              console.log("image link",value)
              return (
                <View>
                 <TouchableOpacity
                  style={{
                    width: DeviceWidth * 0.16,
                    height: DeviceHeigth * 0.12,
                    marginHorizontal: 10,
                    borderRadius: 20,
                    justifyContent:'center',
                    alignItems:'center',
                    backgroundColor:AppColor.GRAY
                  }}>
                  <Image
                    source={{uri: value.item.exercise_image_link}}
                    style={{height: 100, width: 40}}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
                <Text style={{textAlign:'center',marginVertical:10,width:DeviceWidth*0.16,}}>{value.item.exercise_title}</Text>
                </View>
              );
            }}
          />
        </View>
      {/* </ScrollView> */}
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
    backgroundColor: AppColor.WHITE,
    width: DeviceWidth * 0.95,
    borderRadius: 20,
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
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    marginTop: 10,
  },
});
export default NewMonthlyAchievement;
