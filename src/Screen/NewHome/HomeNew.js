import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  Platform,
  Image,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native';
import {AppColor, Fonts} from '../../Component/Color';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../Component/Config';
import {useSelector, useDispatch} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import PercentageBar from '../../Component/PercentageBar';
import VersionNumber, {appVersion} from 'react-native-version-number';

import {useIsFocused} from '@react-navigation/native';
import {
  Stop,
  Circle,
  Svg,
  Line,
  Text as SvgText,
  LinearGradient as SvgGrad,
} from 'react-native-svg';

import {localImage} from '../../Component/Image';
import {FlatList} from 'react-native';
import AnimatedLottieView from 'lottie-react-native';
import {navigationRef} from '../../../App';
import {showMessage} from 'react-native-flash-message';
import {setAllWorkoutData} from '../../Component/ThemeRedux/Actions';
import axios from 'axios';

const GradientText = ({item}) => {
  const gradientColors = ['#D01818', '#941000'];

  return (
    <View
      style={{
        marginTop: Platform.OS == 'android' ? 10 : 0,
        //marginLeft: DeviceWidth * 0.03,
        justifyContent: 'flex-start',

        alignItems: 'flex-start',
        alignSelf: 'center',
      }}>
      <Svg height="40" width={DeviceWidth * 0.9}>
        <SvgGrad id="grad" x1="0" y1="0" x2="100%" y2="0">
          <Stop offset="0" stopColor={gradientColors[0]} />
          <Stop offset="1" stopColor={gradientColors[1]} />
        </SvgGrad>
        <SvgText
          // fontFamily="Montserrat-SemiBold"
          lineHeight={20}
          width={50}
          fontWeight={'700'}
          fontSize={20}
          numberOfLines={1}
          fill="url(#grad)"
          x="0"
          y="20">
          {item}
        </SvgText>
      </Svg>
    </View>
  );
};
const HomeNew = ({navigation}) => {
  const dispatch = useDispatch();
  const getUserDataDetails = useSelector(state => state.getUserDataDetails);
  const getStoreData = useSelector(state => state.getStoreData);
  const allWorkoutData = useSelector(state => state.allWorkoutData);
  const [progressHight, setProgressHight] = useState('80%');
  const [refresh, setRefresh] = useState(false);
  const isFocused = useIsFocused();
  const colors = [
    {color1: '#E3287A', color2: '#EE7CBA'},
    {color1: '#5A76F4', color2: '#61DFF6'},
    {color1: '#33B6C0', color2: '#9FCCA6'},
    {color1: '#08B9BF', color2: '#07F3E9'},
  ];
  useEffect(() => {
    if (isFocused) {
      allWorkoutApi();
       allWorkoutData?.length == 0 && allWorkoutApi();
    }
  }, [isFocused]);

  const allWorkoutApi = async () => {
    try {
      //  setRefresh(true);
      const payload = new FormData();
      payload.append('id', getUserDataDetails?.id);
      payload.append('version', VersionNumber.appVersion);
      const res = await axios({
        url: NewAppapi.ALL_WORKOUTS,
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: payload,
      });
      console.log('DADADADADADADADA', res?.data?.workout_Data);
      if (res?.data?.msg == 'Please update the app to the latest version.') {
        showMessage({
          message: res?.data?.msg,
          type: 'danger',
          animationDuration: 500,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
        setRefresh(false);
      } else if (res?.data) {
        setRefresh(false);
        dispatch(setAllWorkoutData(res?.data));
      } else {
        setRefresh(false);
        dispatch(setAllWorkoutData([]));
      }
    } catch (error) {
      setRefresh(false);
      console.error(error, 'customWorkoutDataApiError');
      dispatch(setAllWorkoutData([]));
    }
  };
  const getTimeOfDayMessage = () => {
    const currentHour = new Date().getHours();

    if (currentHour >= 5 && currentHour < 12) {
      return 'Good Morning';
    } else if (currentHour >= 12 && currentHour < 17) {
      return 'Good Afternoon';
    } else if (currentHour >= 17 && currentHour < 21) {
      return 'Good Evening';
    } else {
      return 'Good Night';
    }
  };
  const ListItem = React.memo(({title, color}) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {
        //navigation.navigate('MeditationDetails', {item: title});
      }}>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginHorizontal: 20,
        }}>
        {console.log('dvfdsf', title.workout_mindset_image_link)}
        <LinearGradient
          start={{x: 0, y: 2}}
          end={{x: 1, y: 0}}
          colors={[color.color1, color.color2]}
          style={styles.listItem}>
          <Image
            source={
              title.workout_mindset_image_link != null
                ? {uri: title.workout_mindset_image_link}
                : localImage.Noimage
            }
            style={[
              styles.img,
              {
                height: 60,
                width: 60,
                alignSelf: 'center',
              },
            ]}
            resizeMode="contain"></Image>
        </LinearGradient>
        <View style={{marginVertical: 10}}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 13,

              fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
              fontWeight: '500',
              lineHeight: 15,
              color: AppColor.SUBHEADING,
            }}>
            {title?.workout_mindset_title}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  ));
  const emptyComponent = () => {
    return (
      <View
        style={{
          flex: 1,
        }}>
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
  const MyStoreItem = React.memo(({item, index}) => {
    return (
      <>
        <TouchableOpacity
          style={styles.listItem2}
          onPress={() => {
            navigation.navigate('ProductsList', {item: item});
          }}>
          {/* {imageLoad && (
            <ShimmerPlaceholder
              style={{
                height: 90,
                width: 90,
                borderRadius: 180 / 2,
                alignSelf: 'center',
                top: -5,
              }}
              ref={avatarRef}
              autoRun
            />
          )} */}
          <Image
            source={
              item.type_image_link == null
                ? localImage.Noimage
                : {uri: item.type_image_link}
            }
            // onLoad={() => setImageLoad(false)}
            style={[
              styles.img,
              {
                height: 90,
                width: 90,
                borderRadius: 180 / 2,
                alignSelf: 'center',
                top: -5,
              },
            ]}
            resizeMode="cover"></Image>

          <Text
            numberOfLines={1}
            style={[
              styles.title,
              {
                fontSize: 13,
                fontWeight: '600',
                lineHeight: 20,
                fontFamily: 'Montserrat-SemiBold',
                textAlign: 'center',
                width: 100,
                color: '#505050',
              },
            ]}>
            {item.type_title}
          </Text>
        </TouchableOpacity>
      </>
    );
  });
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />
      <ScrollView
        keyboardDismissMode="interactive"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: DeviceHeigth * 0.05,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refresh}
            onRefresh={() => {}}
            colors={[AppColor.RED, AppColor.WHITE]}
          />
        }
        style={styles.container}
        nestedScrollEnabled>
        <View style={styles.profileView}>
          <GradientText
            item={
              getTimeOfDayMessage() +
              ', ' +
              (Object.keys(getUserDataDetails).length > 0
                ? getUserDataDetails.name.split(' ')[0]
                : 'Guest')
            }
          />
        </View>
        <View style={{width: '95%', alignSelf: 'center', marginVertical: 10}}>
          <Text
            style={{
              color: AppColor.HEADERTEXTCOLOR,
              fontFamily: 'Montserrat-SemiBold',
              fontWeight: '600',
              lineHeight: 21,
              fontSize: 18,
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}>
            Daily Challenge
          </Text>

          <View
            style={{
              width: '100%',
              marginVertical: 15,
              flexDirection: 'row',
              borderRadius: 16,
              borderWidth: 1,
              alignSelf: 'center',
              backgroundColor: AppColor.WHITE,
              shadowColor: 'rgba(0, 0, 0, 1)',
              ...Platform.select({
                ios: {
                  shadowColor: '#000000',
                  shadowOffset: {width: 0, height: 1},
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                },
                android: {
                  elevation: 4,
                },
              }),
              borderColor: '#D9D9D9',
            }}>
            <View
              style={{
                flexDirection: 'row',
                width: '90%',
                alignItems: 'center',
                top: 0,
              }}>
              <View
                style={{
                  width: 90,
                  height: 100,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: '#D9D9D9',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginHorizontal: 11,
                  marginVertical: 10,
                }}>
                <Image
                  source={require('../../Icon/Images/NewImage2/human.png')}
                  style={{
                    width: 70,
                    height: 70,
                  }}
                  resizeMode="contain"
                />
              </View>
              <View
                style={{
                  width: DeviceHeigth >= 1024 ? '97%' : '85%',
                  alignSelf: 'center',
                  top: 15,
                }}>
                <Text
                  style={{
                    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                    fontSize: 14,
                    fontWeight: '600',
                    lineHeight: 18,
                    marginHorizontal: 10,
                    color: AppColor.HEADERTEXTCOLOR,
                  }}>
                  Daily Pushup Challenge
                </Text>
                <Text
                  style={{
                    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                    fontSize: 14,
                    fontWeight: '600',
                    lineHeight: 20,
                    marginHorizontal: 10,
                    top: 5,
                    color: AppColor.HEADERTEXTCOLOR,
                  }}>
                  You have to do 30 Push
                </Text>
                <View
                  style={{
                    alignSelf: 'flex-end',
                    top: 10,
                    marginRight:
                      DeviceHeigth >= 1024
                        ? DeviceWidth * 0.03
                        : DeviceWidth * 0.085,
                  }}>
                  <Text
                    style={{
                      fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                      fontSize: 12,
                      fontWeight: '600',
                      lineHeight: 20,
                      color: AppColor.SUBHEADING,
                    }}>
                    6/14 Days
                  </Text>
                </View>

                <PercentageBar height={20} percentage={progressHight} />
              </View>
            </View>
            <TouchableOpacity
              style={{width: '10%', alignItems: 'center', top: 20}}>
              <Image
                source={require('../../Icon/Images/NewImage2/play.png')}
                style={{
                  width: 50,
                  height: 50,
                  marginRight: 10,
                  //alignContent: 'flex-end',
                }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{width: '95%', alignSelf: 'center', marginTop: 15}}>
          <Text
            style={{
              color: AppColor.HEADERTEXTCOLOR,
              fontFamily: 'Montserrat-SemiBold',
              fontWeight: '600',
              lineHeight: 21,
              fontSize: 18,
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}>
            Health Overview
          </Text>
        </View>
        <View style={{width: '95%', alignSelf: 'center', marginTop: -5}}>
          <View style={styles.CardBox}>
            <TouchableOpacity
              //    onPress={handleLongPress}
              activeOpacity={0.5}
              style={{
                width: 20,
                height: 20,
                right: -5,
                top: -10,
                margin: 10,
                alignItems: 'center',
                alignSelf: 'flex-end',
                justifyContent: 'center',
                zIndex: 1,
              }}>
              <Image
                source={require('../../Icon/Images/NewImage/editpen.png')}
                style={[
                  styles.img,
                  {
                    height: 20,
                    width: 20,
                  },
                ]}
                resizeMode="contain"></Image>
            </TouchableOpacity>

            <View
              style={{
                width: '100%',
                padding: 10,

                marginTop: -40,
                justifyContent: 'space-evenly',
                flexDirection: 'row',
                //marginHorizontal:-
              }}>
              <View style={{alignItems: 'center'}}>
                <View style={styles.circle}>
                  <LinearGradient
                    style={[styles.circleFill, {height: '70%'}]}
                    start={{x: 0, y: 1}}
                    end={{x: 1, y: 0}}
                    colors={['#5FB67B', '#00B53A']}
                  />
                  <Image
                    source={localImage.Step3}
                    style={[
                      styles.img,
                      {
                        height: 25,
                        width: 25,
                        tintColor: 'white',
                      },
                    ]}
                    resizeMode="contain"></Image>
                </View>

                <View style={{marginVertical: 10}}>
                  <Text
                    style={[
                      styles.monetText,
                      {
                        color: '#5FB67B',
                        fontSize: 12,
                        fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                      },
                    ]}>
                    2215/
                    <Text
                      style={[
                        styles.monetText,
                        {
                          color: '#505050',
                          fontSize: 10,
                          fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                        },
                      ]}>
                      500
                    </Text>
                  </Text>
                </View>
                <View>
                  <Text style={styles.monetText2}>Steps</Text>
                </View>
              </View>
              <View style={{alignItems: 'center'}}>
                <View style={styles.circle}>
                  <LinearGradient
                    style={[styles.circleFill, {height: '70%'}]}
                    start={{x: 0, y: 1}}
                    end={{x: 1, y: 0}}
                    colors={['#FFBA12', '#F1AC02']}
                  />
                  <Image
                    source={localImage.Step2}
                    style={[
                      styles.img,
                      {
                        height: 25,
                        width: 25,
                        tintColor: 'white',
                      },
                    ]}
                    resizeMode="contain"></Image>
                </View>
                <View style={{marginVertical: 10}}>
                  <Text
                    style={[
                      styles.monetText,
                      {
                        color: '#FCBB1D',
                        fontSize: 12,
                        fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                      },
                    ]}>
                    2215/
                    <Text
                      style={[
                        styles.monetText,
                        {
                          color: '#505050',
                          fontSize: 10,
                          fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                        },
                      ]}>
                      5.00 km
                    </Text>
                  </Text>
                </View>
                <View>
                  <Text style={styles.monetText2}>Distance</Text>
                </View>
              </View>
              <View style={{alignItems: 'center'}}>
                <View style={styles.circle}>
                  <LinearGradient
                    style={[styles.circleFill, {height: '70%'}]}
                    start={{x: 0, y: 1}}
                    end={{x: 1, y: 0}}
                    colors={['#941000', '#D5191A']}
                  />
                  <Image
                    source={localImage.Step1}
                    style={[
                      styles.img,
                      {
                        height: 25,
                        width: 25,
                        tintColor: 'white',
                      },
                    ]}
                    resizeMode="contain"></Image>
                </View>
                <View style={{marginVertical: 10}}>
                  <Text
                    style={[
                      styles.monetText,
                      {
                        color: '#D01818',
                        fontSize: 12,
                        fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                      },
                    ]}>
                    2215/
                    <Text
                      style={[
                        styles.monetText,
                        {
                          color: '#505050',
                          fontSize: 10,
                          fontFamily: Fonts.MONTSERRAT_MEDIUM,
                        },
                      ]}>
                      500 Kcal
                    </Text>
                  </Text>
                </View>
                <View>
                  <Text style={styles.monetText2}>Calories</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View
          style={{
            width: '95%',
            alignSelf: 'center',
            top: DeviceHeigth * 0.07,
          }}>
          <Text
            style={{
              color: AppColor.HEADERTEXTCOLOR,
              fontFamily: 'Montserrat-SemiBold',
              fontWeight: '600',
              lineHeight: 21,
              fontSize: 18,
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}>
            Nearby Gyms
          </Text>
        </View>
        <LinearGradient
          start={{x: 1, y: 0}}
          end={{x: 0, y: 1}}
          colors={['#142D91', '#142D91', '#27A4C2']}
          style={{
            width: '95%',
            alignSelf: 'center',
            borderRadius: 20,
            top: DeviceHeigth * 0.09,
            // top: DeviceHeigth >= 1024 ? -30 : -20,
            paddingVertical: 15,
            opacity: 0.8,
            justifyContent: 'center',
          }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigationRef.navigate('GymListing')}
            style={
              {
                //  backgroundColor: AppColor.WHITE,
              }
            }>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  marginHorizontal:
                    Platform.OS == 'android'
                      ? DeviceWidth * 0.03
                      : DeviceHeigth >= 1024
                      ? DeviceWidth * 0.03
                      : DeviceWidth * 0.02,
                }}>
                <Text
                  style={{
                    fontSize: 20,
                    color: AppColor.WHITE,
                    lineHeight: 30,
                    fontWeight: '600',
                    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                  }}>
                  Nearby Gyms
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: AppColor.WHITE,

                    fontWeight: '500',
                    fontFamily: Fonts.MONTSERRAT_MEDIUM,
                  }}>{`Gyms near your location`}</Text>
              </View>
              <Image
                source={localImage.Gym}
                style={{
                  width: DeviceWidth * 0.3,
                  height: 70,
                  //backgroundColor: 'red',
                }}
                resizeMode="contain"
              />
            </View>
          </TouchableOpacity>
        </LinearGradient>
        <View
          style={{
            flexDirection: 'row',
            width: '95%',
            alignSelf: 'center',
            marginVertical: DeviceHeigth * 0.135,
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              color: AppColor.HEADERTEXTCOLOR,
              fontFamily: 'Montserrat-SemiBold',
              fontWeight: '600',
              lineHeight: 21,
              fontSize: 18,
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}>
            Meditation
          </Text>

          {/* {customWorkoutData?.minset_workout?.length > 0 && ( */}
          <TouchableOpacity
            onPress={() => {
              analytics().logEvent('CV_FITME_CLICKED_ON_MEDITATION');
              // navigation.navigate('MeditationDetails', {
              //   item: customWorkoutData?.minset_workout[0],
              // });
            }}>
            <Text
              style={{
                color: AppColor.BoldText,
                fontFamily: 'Montserrat-SemiBold',
                fontWeight: '600',
                color: AppColor.RED1,
                fontSize: 12,
                lineHeight: 14,
              }}>
              View All
            </Text>
          </TouchableOpacity>
          {/* )} */}
        </View>
        <View style={[styles.meditionBox, {top: -DeviceHeigth * 0.115}]}>
          <FlatList
            data={allWorkoutData?.mindset_wrkout_data}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={emptyComponent}
            renderItem={({item, index}) => {
              return (
                <ListItem title={item} color={colors[index % colors.length]} />
              );
            }}
            // renderItem={(item, index) => <MyListItem1 item={item} index={index}/>}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            updateCellsBatchingPeriod={100}
            removeClippedSubviews={true}
          />
        </View>
        <>
          <View
            style={{
              width: '95%',
              alignSelf: 'center',
              top: -DeviceHeigth * 0.085,
            }}>
            <Text
              style={{
                color: AppColor.HEADERTEXTCOLOR,
                fontFamily: 'Montserrat-SemiBold',
                fontWeight: '600',
                lineHeight: 21,
                fontSize: 18,
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}>
              Personalized Workouts
            </Text>
          </View>
          <LinearGradient
            start={{x: 1, y: 0}}
            end={{x: 0, y: 1}}
            colors={['#379CBE', '#81CAF1', '#81CAF1']}
            style={{
              width: '95%',
              borderRadius: 20,
              top: -DeviceHeigth * 0.06,
              paddingVertical: 15,
              alignSelf: 'center',
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                navigation.navigate('CustomWorkout');
              }}
              style={
                {
                  //  backgroundColor: AppColor.WHITE,
                }
              }>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <View
                  style={{
                    marginHorizontal:
                      Platform.OS == 'android'
                        ? DeviceWidth * 0.03
                        : DeviceHeigth >= 1024
                        ? DeviceWidth * 0.03
                        : DeviceWidth * 0.02,
                  }}>
                  <Text
                    style={{
                      fontSize: 20,
                      color: AppColor.WHITE,
                      lineHeight: 30,
                      fontWeight: '600',
                      fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                    }}>
                    Custom Workout
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: AppColor.WHITE,

                      fontWeight: '500',
                      fontFamily: Fonts.MONTSERRAT_MEDIUM,
                    }}>{`A balanced diet is a healthy life`}</Text>
                </View>
                <Image
                  source={localImage.NewWorkout}
                  style={{
                    width: DeviceWidth * 0.3,
                    height: 70,
                    //backgroundColor: 'red',
                  }}
                  resizeMode="contain"
                />
              </View>
            </TouchableOpacity>
          </LinearGradient>
        </>
        <View
          style={{
            flexDirection: 'row',
            width: '95%',
            alignSelf: 'center',
            // backgroundColor:'red',
            //top: DeviceHeigth * 0.03,
            alignItems: 'center',
            justifyContent: 'space-between',
            top: -DeviceHeigth * 0.015,
          }}>
          <Text
            style={{
              color: AppColor.HEADERTEXTCOLOR,
              fontFamily: 'Montserrat-SemiBold',
              fontWeight: '600',
              lineHeight: 21,
              fontSize: 18,
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}>
            Fitness Instructor
          </Text>
        </View>
        <View
          style={{
            width: '95%',
            alignSelf: 'center',
            backgroundColor: 'white',
            top: -DeviceHeigth * 0.004,
            alignItems: 'center',
          }}>
          <FlatList
            // data={getStoreData?.slice(0, )}
            data={
              Platform.OS == 'android'
                ? getStoreData?.slice(0, 4)
                : DeviceHeigth >= 1024
                ? getStoreData?.slice(0, 7)
                : getStoreData?.slice(0, 4)
            }
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            pagingEnabled
            renderItem={({item, index}) => (
              <MyStoreItem item={item} index={index} />
            )}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            updateCellsBatchingPeriod={100}
            removeClippedSubviews={true}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            width: '95%',
            alignSelf: 'center',
            // backgroundColor:'red',
            //top: DeviceHeigth * 0.03,
            alignItems: 'center',
            justifyContent: 'space-between',
            top: DeviceHeigth * 0.01,
          }}>
          <Text
            style={{
              color: AppColor.HEADERTEXTCOLOR,
              fontFamily: 'Montserrat-SemiBold',
              fontWeight: '600',
              lineHeight: 21,
              fontSize: 18,
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}>
            Discover More
          </Text>
        </View>
        <View
          style={{
            width: '95%',
            //padding: 10,
            top: DeviceHeigth * 0.03,
            alignSelf: 'center',
            flexDirection: 'row',

            justifyContent: 'space-between',
          }}>
          <LinearGradient
            start={{x: 1, y: 0}}
            end={{x: 0, y: 0.5}}
            colors={['#2B4E9F', '#0A94F3']}
            style={{
              width: '47%',
              height: DeviceHeigth * 0.15,
              padding: 10,
              borderRadius: 16,
            }}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                navigation.navigate('Meals');
              }}
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View style={{zIndex: 1}}>
                <Text
                  style={{
                    color: 'white',
                    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                    fontWeight: '700',
                    lineHeight: 25,
                    fontSize: 15,
                  }}>
                  Diet
                </Text>
                <Text
                  style={{
                    color: 'white',
                    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                    fontWeight: '500',
                    lineHeight: 15,
                    fontSize: 12,
                  }}>
                  {'A balanced diet is \na healthy life'}
                </Text>
              </View>
              <View style={{}}>
                <Image
                  source={require('../../Icon/Images/NewImage2/diet.png')}
                  resizeMode="contain"
                  style={{
                    width: DeviceHeigth >= 1024 ? 100 : 70,
                    height: DeviceHeigth >= 1024 ? 250 : 80,
                    right: DeviceHeigth >= 1024 ? 0 : 20,
                    top: DeviceHeigth >= 1024 ? -40 : 35,
                  }}
                />
              </View>
            </TouchableOpacity>
          </LinearGradient>
          <LinearGradient
            start={{x: 1.2, y: 0}}
            end={{x: 0, y: 0}}
            colors={['#8172F3', '#6BD7E3']}
            style={{
              width: '47%',
              height: DeviceHeigth * 0.15,
              padding: 10,
              borderRadius: 16,
            }}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                navigation.navigate('Store');
              }}
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View>
                <Text
                  style={{
                    color: 'white',
                    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                    fontWeight: '700',
                    lineHeight: 25,
                    fontSize: 15,
                  }}>
                  Store
                </Text>
                <Text
                  style={{
                    color: 'white',
                    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                    fontWeight: '500',
                    lineHeight: 15,
                    fontSize: 12,
                  }}>
                  {'Quality over quantity for\noptimal health benefits'}
                </Text>
              </View>
              <View style={{}}>
                <Image
                  source={require('../../Icon/Images/NewImage2/store.png')}
                  resizeMode="contain"
                  style={{
                    width: DeviceHeigth >= 1024 ? 100 : 70,
                    height: DeviceHeigth >= 1024 ? 250 : 80,
                    right: DeviceHeigth >= 1024 ? 0 : 60,
                    top: DeviceHeigth >= 1024 ? -10 : 50,
                  }}
                />
              </View>
            </TouchableOpacity>
          </LinearGradient>
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
  profileView: {
    width: '95%',
    marginVertical: 10,
  },
  monetText: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 20,
    fontFamily: 'Montserrat-SemiBold',
    marginLeft: 10,
  },
  monetText2: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 20,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    marginLeft: 10,
    color: AppColor.SUBHEADING,
  },
  CardBox: {
    width: '100%',
    alignSelf: 'center',
    backgroundColor: 'white',
    top: DeviceHeigth * 0.025,
    borderRadius: 10,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: 'rgba(0, 0, 0, 1)',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  meditionBox: {
    width: '95%',
    alignSelf: 'center',
    backgroundColor: 'white',

    alignItems: 'center',
  },
  listItem: {
    width: 70,
    height: 70,

    borderRadius: 70 / 2,

    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(0, 0, 0, 1)',
    ...Platform.select({
      shadowColor: '#000000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.3,
      shadowRadius: 4,
      android: {
        elevation: 2,
      },
    }),
  },
  img: {
    height: 60,
    width: 60,

    borderRadius: 120 / 2,
  },
  listItem2: {
    marginHorizontal: 10,
    borderRadius: 10,
    padding: 20,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColor.WHITE,
    marginBottom: 30,
    shadowColor: 'rgba(0, 0, 0, 1)',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  circle: {
    width: 80,
    height: 80,
    borderRadius: 80 / 2,
    overflow: 'hidden',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#D9D9D9',
  },
  circleFill: {
    backgroundColor: 'orange',
    width: '100%',
    bottom: 0,
    position: 'absolute',
  },
});
export default HomeNew;
