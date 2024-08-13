import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {localImage} from '../../Component/Image';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import {AppColor, Fonts} from '../../Component/Color';
import NewButton from '../../Component/NewButton';
import {FlatList} from 'react-native';
import WorkoutsDescription from '../NewWorkouts/WorkoutsDescription';
import AnimatedLottieView from 'lottie-react-native';
import {AnalyticsConsole} from '../../Component/AnalyticsConsole';
export const ExerciseComponetWithoutEvents = ({
  dayObject,
  day,
  onPress,
  WeekStatus,
  getWeeklyPlansData,
  download,
  isClicked,
  setIsClicked,
}) => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  return (
    <View style={styles.View1}>
      {!WeekStatus.includes(day) ? (
        <>
          <View style={[styles.View2, {justifyContent: 'flex-start'}]}>
            <Image
              source={{uri: dayObject?.image}}
              style={styles.img}
              resizeMode="contain"
              defaultSource={localImage?.NOWORKOUT}
            />
            <View style={styles.View3}>
              <Text style={styles.txt1}>
                {dayObject?.title ?? 'Power hour'}
              </Text>
              <Text style={styles.txt2}>{day ?? 'Monday'}</Text>
            </View>
          </View>
          <NewButton
            title={'Start'}
            onPress={onPress}
            withAnimation
            download={download}
            isClicked={isClicked}
            setIsClicked={setIsClicked}
          />
          <Text
            style={[
              styles.txt3,
              {
                width: DeviceWidth * 0.9,
                alignSelf: 'center',
                marginVertical: 15,
              },
            ]}>
            {dayObject?.exercises?.length
              ? dayObject?.exercises?.length + ' Exercises'
              : '10 Exercises'}
          </Text>
          <FlatList
            data={dayObject?.exercises}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom:
                DeviceHeigth <= 667 ? DeviceHeigth * 0.5 : DeviceHeigth * 0.42,
            }}
            style={{
              width: DeviceWidth * 0.9,
              alignSelf: 'center',
            }}
            renderItem={({item, index}) => (
              <View key={index}>
                <TouchableOpacity
                  style={[styles.button, {justifyContent: 'flex-start'}]}
                  onPress={() => {
                    setData(item);
                    setOpen(true);
                  }}>
                  <View style={[styles.View4]}>
                    <Image
                      source={{uri: item?.exercise_image_link}}
                      style={{height: 70, width: 70}}
                      resizeMode="contain"
                      defaultSource={localImage.NOWORKOUT}
                    />
                  </View>
                  <View style={{marginLeft: 15}}>
                    <Text style={[styles.txt3, {marginVertical: 6}]}>
                      {item?.exercise_title}
                    </Text>
                    <Text style={styles.txt2}>
                      {'Time - ' + item?.exercise_rest}
                    </Text>
                  </View>
                </TouchableOpacity>
                {dayObject?.exercises.length - 1 == index ? null : (
                  <View style={styles.border} />
                )}
              </View>
            )}
          />
          <WorkoutsDescription data={data} open={open} setOpen={setOpen} />
        </>
      ) : (
        <>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 5,
              borderWidth: 1,
              borderColor: AppColor.RED,
              borderRadius: 15,
              alignSelf: 'center',
              marginTop: DeviceHeigth * 0.05,
              width: DeviceWidth * 0.9,
            }}>
            <AnimatedLottieView
              source={require('../../Icon/Images/RedTick.json')}
              speed={1}
              autoPlay
              loop
              resizeMode="contain"
              style={{
                width: DeviceWidth * 0.2,
                height: DeviceHeigth * 0.2,
              }}
            />
            <Text
              style={{
                fontFamily: Fonts.MONTSERRAT_BOLD,
                fontSize: 18,
                fontWeight: '600',
                top: -20,
                color: AppColor.LITELTEXTCOLOR,
                lineHeight: 30,
              }}>
              Workout Completed
            </Text>
            <Text
              style={{
                fontFamily: Fonts.MONTSERRAT_MEDIUM,
                fontSize: 14,
                fontWeight: '500',
                top: -10,
                color: AppColor.LITELTEXTCOLOR,
                lineHeight: 20,
              }}>
              {day}
            </Text>
            <View
              style={{
                width: DeviceWidth * 0.8,
                height: 1,
                backgroundColor: 'lightgrey',
                marginTop: DeviceWidth * 0.05,
              }}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginVertical: DeviceWidth * 0.05,
              }}>
              <Image
                source={{
                  uri: getWeeklyPlansData[day]?.image,
                }}
                // onLoad={() => setIsLoading(false)}
                style={{
                  height: 40,
                  width: 40,
                  alignSelf: 'center',
                  marginRight: 20,
                }}
                resizeMode="contain"
              />
              <Text
                style={{
                  fontFamily: Fonts.MONTSERRAT_BOLD,
                  fontSize: 16,
                  fontWeight: '700',
                  color: AppColor.RED,
                  lineHeight: 30,
                }}>
                {getWeeklyPlansData[day]?.title}
              </Text>
            </View>
          </View>
        </>
      )}
    </View>
  );
};
export const ExerciseComponentWithEvent = ({
  dayObject,
  day,
  onPress,
  navigation,
  dayWiseCoins,
  WeekArray,
  getWeeklyPlansData,
  selectedDay,
  currentDay,
  download,
}) => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
console.log(dayWiseCoins[day])
  return (
    <View style={styles.View1}>
      {dayWiseCoins[day] == null || dayWiseCoins[day] < 0 ? (
        <>
          <View style={styles.View2}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                source={{uri: dayObject?.image}}
                style={styles.img}
                resizeMode="contain"
              />
              <View style={styles.View3}>
                <Text style={styles.txt1}>
                  {dayObject?.title ?? 'Power hour'}
                </Text>
                <Text style={styles.txt2}>{day ?? '--'}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={{}}
              onPress={() => {
                AnalyticsConsole(`O_EWS`);
                navigation.navigate('AddWorkouts', {
                  dayExercises: dayObject?.exercises,
                  day: day,
                  image: dayObject?.image,
                  title: dayObject?.title,
                });
              }}>
              {day == WeekArray[currentDay] ? (
                <Image source={localImage.EditPen} style={styles.edit} />
              ) : null}
            </TouchableOpacity>
          </View>
          {day == WeekArray[currentDay] ? (
            <NewButton
              title={'Start'}
              onPress={onPress}
              withAnimation
              download={download}
            />
          ) : null}
          <Text
            style={[
              styles.txt3,
              {
                width: DeviceWidth * 0.9,
                alignSelf: 'center',
                marginVertical: 15,
              },
            ]}>
            {dayObject?.exercises?.length
              ? dayObject?.exercises?.length + ' Exercises'
              : '10 Exercises'}
          </Text>
          <FlatList
            data={dayObject?.exercises}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom:
                DeviceHeigth <= 667 ? DeviceHeigth * 0.5 : DeviceHeigth * 0.42,
            }}
            style={{
              width: DeviceWidth * 0.9,
              alignSelf: 'center',
              // marginBottom: DeviceHeigth * 0.35,
            }}
            renderItem={({item, index}) => (
              <View key={index}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    setData(item);
                    setOpen(true);
                  }}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View style={styles.View4}>
                      <Image
                        source={{uri: item?.exercise_image_link}}
                        style={{height: 70, width: 70}}
                        resizeMode="contain"
                        defaultSource={localImage.NOWORKOUT}
                      />
                    </View>
                    <View style={{marginLeft: 15, width: DeviceWidth * 0.55}}>
                      <Text style={[styles.txt3]}>{item?.exercise_title}</Text>
                      <Text style={styles.txt2}>
                        {'Time - ' + item?.exercise_rest}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
                {dayObject?.exercises.length - 1 == index ? null : (
                  <View style={styles.border} />
                )}
              </View>
            )}
          />
          <WorkoutsDescription data={data} open={open} setOpen={setOpen} />
        </>
      ) : (
        <>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 5,
              borderColor: AppColor.RED,
              borderRadius: 15,
              alignSelf: 'center',
              marginTop: DeviceHeigth * 0.05,
              borderWidth: 1,
              borderColor: AppColor.RED,
              borderRadius: 15,
              width: DeviceWidth * 0.9,
            }}>
            <AnimatedLottieView
              source={require('../../Icon/Images/RedTick.json')}
              speed={1}
              autoPlay
              loop
              resizeMode="contain"
              style={{
                width: DeviceWidth * 0.2,
                height: DeviceHeigth * 0.2,
              }}
            />
            <Text
              style={{
                fontFamily: Fonts.MONTSERRAT_BOLD,
                fontSize: 18,
                fontWeight: '600',
                top: -20,
                color: AppColor.LITELTEXTCOLOR,
                lineHeight: 30,
              }}>
              Workout Completed
            </Text>
            <Text
              style={{
                fontFamily: Fonts.MONTSERRAT_MEDIUM,
                fontSize: 14,
                fontWeight: '500',
                top: -10,
                color: AppColor.LITELTEXTCOLOR,
                lineHeight: 20,
              }}>
              {day}
            </Text>
            <View
              style={{
                width: DeviceWidth * 0.8,
                height: 1,
                backgroundColor: 'lightgrey',
                marginTop: DeviceWidth * 0.05,
              }}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginVertical: DeviceWidth * 0.05,
              }}>
              <Image
                // source={{
                //   uri: getWeeklyPlansData[WeekArray[selectedDay]]?.image,
                // }}
                source={
                  getWeeklyPlansData[WeekArray[selectedDay]]?.image == null
                    ? localImage.NOWORKOUT
                    : {
                        uri: getWeeklyPlansData[WeekArray[selectedDay]]?.image,
                      }
                }
                // onLoad={() => setIsLoading(false)}
                style={{
                  height: 40,
                  width: 40,
                  alignSelf: 'center',
                  marginRight: 25,
                }}
                resizeMode="contain"
              />
              {console.log('Zxcvxvdsfdsd', getWeeklyPlansData[day]?.title)}
              <Text
                style={{
                  fontFamily: Fonts.MONTSERRAT_BOLD,
                  fontSize: 16,
                  fontWeight: '700',
                  color: AppColor.RED1,
                  lineHeight: 30,
                }}>
                {getWeeklyPlansData[day]?.title != null
                  ? getWeeklyPlansData[day]?.title
                  : 'Commpleted'}
              </Text>
            </View>
          </View>
        </>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  View1: {
    width: DeviceWidth * 0.95,
    alignSelf: 'center',
  },
  View2: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    width: DeviceWidth * 0.9,
    alignSelf: 'center',
    justifyContent: 'space-between',
  },
  View3: {
    marginLeft: 10,
  },
  View4: {
    borderWidth: 1,
    borderColor: AppColor.GRAY1,
    height: 80,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  View5: {
    // flexDirection:
  },
  border: {
    height: 0,
    borderWidth: 0.2,
    borderColor: AppColor.GRAY1,
  },
  img: {
    height: 70,
    width: 70,
  },
  edit: {height: 23, width: 23, alignItems: 'flex-end'},
  //txts
  txt1: {
    color: AppColor.BLACK,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontSize: 20,
    marginBottom: 4,
  },
  txt2: {
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    color: AppColor.BLACK,
    fontSize: 16,
    lineHeight: 30,
  },
  txt3: {
    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
    color: AppColor.BLACK,
    fontSize: 18,
    textAlign: 'left',
  },
  //  buttons
  button: {
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
