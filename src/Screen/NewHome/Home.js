import {
  View,
  Text,
  SafeAreaView,
  Image,
  ImageBackground,
  ScrollView,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {AppColor} from '../../Component/Color';
import {
  DeviceHeigth,
  DeviceWidth,
  NewApi,
  NewAppapi,
} from '../../Component/Config';
import {localImage} from '../../Component/Image';
import Calories from '../../Component/Calories';
import axios from 'axios';
import ActivityLoader from '../../Component/ActivityLoader';
import AnimatedLottieView from 'lottie-react-native';
import PercentageBar from '../../Component/PercentageBar';
import {useDispatch, useSelector} from 'react-redux';
import { setCustomWorkoutData } from '../../Component/ThemeRedux/Actions';

const Home = ({navigation}) => {
  const [selectedButton, setSelectedButton] = useState('1');
  const {getUserDataDetails, customWorkoutData} = useSelector(state => state);
const dispatch = useDispatch()
  const [isLoaded, setLoaded] = useState(false);
  const [WorkoutData, setWorkoutData] = useState([]);
  const handleButtonColor = ButtonNumber => {
    setSelectedButton(ButtonNumber);
    //setLoaded(false);
  };
  useEffect(() => {
    getData();
  }, [selectedButton]);

  const onSelectSwitch = index => {
    alert('Selected index: ' + index);
  };

  const IntroductionData = [
    {
      id: 1,
      text1: 'Meet your coach,',
      text2: 'start your juorney',
      img: localImage.Inrtoduction1,
    },
    {
      id: 2,
      text1: 'Create a workout plan,',
      text2: 'to stay fit',
      img: localImage.Inrtoduction2,
    },
    {
      id: 3,
      text1: 'Action is the ',
      text2: 'key to all success',
      img: localImage.Inrtoduction3,
    },
  ];

  const getData = async () => {
    setLoaded(true);
    try {
      let payload = new FormData();
      payload.append('id', 6);
      const data = await axios(`${NewApi}${NewAppapi.All_Workouts}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: payload,
      });
      setLoaded(false);

      if (data.data) {
        if (selectedButton == '1') {
          setWorkoutData(
            data.data.workout_details.filter(
              item => item.level_title == 'Beginner',
            ),
          );
          //setLoaded(true);
        } else if (selectedButton == '2') {
          setWorkoutData(
            data.data.workout_details.filter(
              item => item.level_title == 'Intermediate',
            ),
          );
          //setLoaded(true);
        } else if (selectedButton == '3') {
          setWorkoutData(
            data.data.workout_details.filter(
              item => item.level_title == 'Advanced',
            ),
          );
          // setLoaded(true);
        }
      } else {
        console.log('No data available');
        setLoaded(false);
      }
    } catch (error) {
      console.log('Workout Error', error);
    }
  };
  const noData = () => {
    return (
      <View style={{marginTop: 10, paddingBottom: DeviceHeigth * 0.03}}>
        <AnimatedLottieView
          source={require('../../Icon/Images/NewImage/NoData.json')}
          speed={2}
          autoPlay
          loop
          style={[
            styles.card,
            {
              borderRadius: 20,
              overflow: 'hidden',
              margin: 5,
              resizeMode: 'contain',
              width: DeviceWidth * 0.91,
              borderColor: AppColor.GRAY,
            },
          ]}></AnimatedLottieView>
      </View>
    );
  };
  // useEffect(() => {
  //  getCustomWorkout()
  // }, [])
  // const getCustomWorkout = async() => {
  //   try {
  //     const data = await axios('https://gofit.tentoptoday.com/adserver/public/api/usercustomworkout', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //       data: {
  //         id: 31,
  //       },
  //     });
  //     console.log(data.data?.workout[0]?.image_path,"DATA")
  //     if (data.data) {
  //       dispatch(setCustomWorkoutData(data.data?.workout));
  //      await Image.prefetch(data.data?.workout[0]?.image_path);
  //       // navigation.navigate('BottomTab');
  //     } else { 
  //       dispatch(setCustomWorkoutData([]));
  //       // navigation.navigate('BottomTab');
  //     }
  //   } catch (error) {
  //     console.log('User Profile Error', error);
  //   }
  // };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />
      <ScrollView
        keyboardDismissMode="interactive"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{flexGrow: 1, marginTop: 20}}
        keyboardShouldPersistTaps="handled">
        <ImageBackground
          source={localImage.CARD}
          style={styles.card}
          resizeMode="contain">
          <View style={styles.cardheader}>
            {getUserDataDetails.image_path == null ? (
              <Image
                source={localImage.avt}
                style={styles.profileImage}
                resizeMode="contain"
              />
            ) : (
              <Image
                source={{
                  uri: getUserDataDetails.image_path,
                }}
                style={styles.profileImage}
                resizeMode="contain"
              />
            )}
            {/* <Image
              source={getUserDataDetails.image_path==null?localImage.avt:getUserDataDetails.image_path}
              style={styles.profileImage}
              resizeMode="contain"
            /> */}
            <View style={styles.textcontainer}>
              <Text style={styles.nameText}>Hello, Good Morning</Text>
              <Text style={styles.subText}>{getUserDataDetails.name}</Text>
            </View>

            <TouchableOpacity
              onPress={() => {
                navigation.navigate('AppNotification');
              }}>
              <Image
                source={localImage.BELL}
                style={styles.bellImage}
                resizeMode="contain"
              />
              <View style={styles.circle} />
            </TouchableOpacity>
          </View>
        </ImageBackground>
        <View style={styles.dailyContainer}>
          <Text style={styles.dailyText}>Daily progress</Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginLeft: 0,
              marginRight: 0,
            }}>
            <Calories type={'Calories'} />
            <Calories type={'Steps'} />
          </View>
        </View>
        {customWorkoutData.length > 0 && (
          <>
            <View style={styles.progressBar}>
              <Text style={styles.text}>Overall progress</Text>
              <Text style={styles.text2}>50%</Text>
              <Text style={styles.text3}>200 Calories Burn | 30minutes</Text>
              <View
                style={{
                  width: '90%',
                  justifyContent: 'center',
                  marginLeft: 15,
                  marginTop: 10,
                }}>
                <PercentageBar
                  height={20}
                  backgroundColor={'grey'}
                  percentage={'50%'}
                />
              </View>
            </View>
            <View style={styles.dailyContainer}>
              <Text style={styles.dailyText}>My workout</Text>
              <FlatList
                data={customWorkoutData}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({item, index}) => {
                  return (
                    <TouchableOpacity
                      onPress={() => {}}
                      style={{marginTop: 10}}
                      activeOpacity={0.7}>
                      <ImageBackground
                        source={{uri: item?.image_path}}
                        style={[
                          styles.card,
                          {
                            borderRadius: 20,
                            overflow: 'hidden',
                            margin: 5,
                            resizeMode: 'contain',
                            width: DeviceWidth * 0.91,
                          },
                        ]}>
                        <View style={styles.LinearG}>
                          <View style={styles.TitleText}>
                            <Text style={styles.Text}>{item.workout_title}</Text>
                            <Text
                              style={[
                                styles.Text,
                                {fontSize: 14, fontWeight: 'bold'},
                              ]}>
                              {' '}
                              {item.workout_duration}
                            </Text>
                          </View>
                        </View>
                      </ImageBackground>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          </>
        )}
        <View style={[styles.dailyContainer, {marginTop: 20}]}>
          <Text style={styles.dailyText}>Featured workout</Text>
          <FlatList
            data={IntroductionData}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({item, index}) => {
              return (
                <TouchableOpacity
                  onPress={() => {}}
                  style={{marginTop: 10}}
                  activeOpacity={0.7}>
                  <ImageBackground
                    source={localImage.Inrtoduction3}
                    style={[
                      styles.card,
                      {
                        borderRadius: 20,
                        overflow: 'hidden',
                        margin: 5,
                        resizeMode: 'contain',
                        width: DeviceWidth * 0.91,
                      },
                    ]}>
                    <View style={styles.LinearG}>
                      <View style={styles.TitleText}>
                        <Text style={styles.Text}>{item.text1}</Text>
                        <Text
                          style={[
                            styles.Text,
                            {fontSize: 14, fontWeight: 'bold'},
                          ]}>
                          {' '}
                          {item.text2}
                        </Text>
                      </View>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              );
            }}
          />
        </View>
        <View style={[styles.dailyContainer, {marginTop: 20}]}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.dailyText}>Workout Categories</Text>
            <Text
              style={styles.seeAll}
              onPress={() => {
                navigation.navigate('WorkoutCategories');
              }}>
              See all
            </Text>
          </View>
          <View style={styles.buttonView}>
            <TouchableOpacity
              style={[
                styles.Buttons,
                selectedButton == '1' ? {backgroundColor: AppColor.RED} : null,
              ]}
              onPress={() => {
                handleButtonColor('1');
              }}>
              <Text
                style={[
                  ,
                  selectedButton == '1'
                    ? {color: AppColor.WHITE}
                    : {color: AppColor.INPUTTEXTCOLOR},
                  {fontFamily: 'Verdana', fontWeight: '600'},
                ]}>
                Beginner
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.Buttons,
                selectedButton == '2' ? {backgroundColor: AppColor.RED} : null,
              ]}
              onPress={() => {
                handleButtonColor('2');
              }}>
              <Text
                style={[
                  ,
                  selectedButton == '2'
                    ? {color: AppColor.WHITE}
                    : {color: AppColor.INPUTTEXTCOLOR},
                  {fontFamily: 'Verdana', fontWeight: '600'},
                ]}>
                Intermediate
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.Buttons,
                selectedButton == '3' ? {backgroundColor: AppColor.RED} : null,
              ]}
              onPress={() => {
                handleButtonColor('3');
              }}>
              <Text
                style={[
                  ,
                  selectedButton == '3'
                    ? {color: AppColor.WHITE}
                    : {color: AppColor.INPUTTEXTCOLOR},
                  {fontFamily: 'Verdana', fontWeight: '600'},
                ]}>
                Advance
              </Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={WorkoutData}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={elements => {
              return (
                <TouchableOpacity
                  onPress={() => {}}
                  style={{marginTop: 10, paddingBottom: DeviceHeigth * 0.03}}
                  activeOpacity={0.7}>
                  <ImageBackground
                    source={{uri: elements.item.image_path}}
                    style={[
                      styles.card,
                      {
                        borderRadius: 20,
                        overflow: 'hidden',
                        margin: 5,
                        resizeMode: 'contain',
                        width: DeviceWidth * 0.91,
                      },
                    ]}>
                    {isLoaded ? <ActivityLoader /> : ''}
                    <View style={styles.LinearG}>
                      <View style={styles.TitleText}>
                        <Text style={styles.Text}>
                          {elements.item.workout_title}
                        </Text>
                        <Text
                          style={[
                            styles.Text,
                            {fontSize: 14, fontWeight: 'bold'},
                          ]}>
                          {' '}
                          {elements.item.workout_duration}
                        </Text>
                      </View>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              );
            }}
            ListEmptyComponent={noData}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColor.WHITE,
  },
  card: {
    height: DeviceHeigth * 0.2,
    alignSelf: 'center',
    marginTop: 10,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 120 / 2,

    left: -40,
    top: DeviceHeigth * 0.01,
  },
  cardheader: {
    top: DeviceHeigth * 0.02,
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: 50,
  },
  textcontainer: {
    left: -30,
    top: DeviceHeigth * 0.01,
  },
  nameText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    fontWeight: '500',
    color: AppColor.INPUTLABLECOLOR,
    lineHeight: 18,
  },
  subText: {
    fontSize: 20,
    fontFamily: 'Verdana',
    fontWeight: '400',
    color: AppColor.LITELTEXTCOLOR,
    lineHeight: 24,
  },
  bellImage: {
    width: 30,
    height: 30,
    right: -DeviceWidth * 0.1,
    top: Platform.OS == 'ios' ? -DeviceHeigth * 0.05 : -DeviceHeigth * 0.05,
  },
  circle: {
    width: 7,
    height: 7,
    backgroundColor: '#B0C929',
    borderRadius: 5.5 / 2,
    position: 'absolute',
    right: -DeviceWidth * 0.09,
    top: -DeviceHeigth * 0.043,
  },
  dailyContainer: {
    top: DeviceHeigth * 0.02,
    marginHorizontal: DeviceWidth * 0.04,
  },
  dailyText: {
    fontSize: 15,
    fontFamily: 'Verdana',
    fontWeight: '700',
    color: AppColor.LITELTEXTCOLOR,
    lineHeight: 24,
  },
  Text: {
    color: 'white',
    fontFamily: 'Poppins',
    fontWeight: '600',
    marginLeft: 15,
    fontSize: 18,
    marginBottom: 5,
    width: (DeviceWidth * 70) / 100,
  },
  TextDesign: {
    borderRadius: 8,
    overflow: 'hidden',
    margin: 15,
    resizeMode: 'contain',
  },
  LinearG: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    height: (DeviceHeigth * 20) / 100,
    justifyContent: 'flex-end',
    paddingBottom: 4,
  },
  FlatListView: {
    marginBottom: (DeviceHeigth * 2) / 100,
    flex: 1,
  },
  TitleText: {
    flexDirection: 'column',
  },
  seeAll: {
    fontSize: 15,
    fontFamily: 'Poppins',
    fontWeight: '400',
    color: '#191919',
    lineHeight: 18,
    textDecorationLine: 'underline',
  },
  buttonView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: DeviceHeigth * 0.02,
    marginHorizontal: DeviceWidth * 0.05,
  },
  Buttons: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: AppColor.GRAY,
    padding: 10,
  },
  progressBar: {
    marginVertical: 15,
    marginHorizontal: DeviceWidth * 0.04,
    backgroundColor: '#D7EFFE',
    height: DeviceHeigth * 0.15,
    alignSelf: 'center',
    marginTop: 30,
    width: DeviceWidth * 0.91,
    borderRadius: 20,
  },
  text3: {
    fontSize: 14,
    fontFamily: 'Poppins',
    fontWeight: '400',
    color: AppColor.DARKGRAY,
    lineHeight: 21,
    // marginTop: -30,
    marginLeft: 15,
  },
  text: {
    fontSize: 15,
    fontFamily: 'Poppins',
    fontWeight: '500',
    color: AppColor.BLACK,
    lineHeight: 18,
    marginTop: 20,
    marginLeft: 15,
  },
  text2: {
    fontSize: 20,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: AppColor.BLACK,
    lineHeight: 30,
    marginLeft: 15,
    marginTop: -20,
    textAlign: 'right',
    marginRight: DeviceWidth * 0.04,
  },
});
export default Home;
