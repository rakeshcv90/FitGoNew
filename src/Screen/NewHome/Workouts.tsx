import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  RefreshControl,
  FlatList,
  Platform,
  ImageBackground,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {AppColor, Fonts} from '../../Component/Color';
import {localImage} from '../../Component/Image';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../Component/Config';
import LinearGradient from 'react-native-linear-gradient';
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';
import {setAllWorkoutData} from '../../Component/ThemeRedux/Actions';
import NewHeader from '../../Component/Headers/NewHeader';
import VersionNumber, {appVersion} from 'react-native-version-number';
import {showMessage} from 'react-native-flash-message';

import {useIsFocused} from '@react-navigation/native';

import AnimatedLottieView from 'lottie-react-native';
const Workouts = ({navigation}: any) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const completeProfileData = useSelector(
    (state: any) => state.completeProfileData,
  );
  const allWorkoutData = useSelector((state: any) => state.allWorkoutData);
  const getUserDataDetails = useSelector(
    (state: any) => state.getUserDataDetails,
  );
console.log("All workout data",allWorkoutData)
  useEffect(() => {
    if (isFocused) {
      allWorkoutApi();
      allWorkoutData?.length == 0 && allWorkoutApi();
      getUserCustomeWorkout()
    }
  }, [isFocused]);
  const [refresh, setRefresh] = useState(false);
  let catogery = [
    {
      id: 1,
      title: 'Get Fit',
      subtitle:'weight loss data',
      img: require('../../Icon/Images/NewImage2/Img7.png'),
    },
    {
      id: 2,
      title: 'Lose Weight',
      subtitle:'weight loss data',
      img: require('../../Icon/Images/NewImage2/Img6.png'),
    },
    {
      id: 3,
      title: 'HIIT',
      subtitle:'Strength',
      img: require('../../Icon/Images/NewImage2/Img5.png'),
    },
  ];
  let catogery2 = [
    {
      id: 1,
      title: 'Immunity Booster',
      subtitle:'Strength',
      img: require('../../Icon/Images/NewImage2/Img4.png'),
    },
    {
      id: 2,
      title: 'Build Muscle',
      subtitle:'Build',
      img: require('../../Icon/Images/NewImage2/Img3.png'),
    },
    {
      id: 3,
      title: 'Corporate Cardio',
      subtitle:'Strength / Weight loss',
      img: require('../../Icon/Images/NewImage2/Img2.png'),
    },
    {
      id: 4,
      title: 'Beach Ready',
      subtitle:'Build muscle/ weight loss / strength data',
      img: require('../../Icon/Images/NewImage2/Img1.png'),
    },
  ];
  const allWorkoutApi = async () => {
    try {
      setRefresh(true);
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
        dispatch(setAllWorkoutData(res.data));
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
const getUserCustomeWorkout=async()=>{
  
}
  // const workoutStatusApi = async () => {
  //   try {
  //     const payload = new FormData();
  //     payload.append('token', getUserDataDetails?.login_token);
  //     payload.append('id', getUserDataDetails?.id);
  //     payload.append('version', VersionNumber.appVersion);
  //     setRefresh(true);
  //     const res = await axios({
  //       url: NewAppapi.TRACK_WORKOUTS,
  //       method: 'post',
  //       data: payload,
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     });

  //     if (res?.data?.msg == 'Please update the app to the latest version.') {
  //       setRefresh(false);
  //       showMessage({
  //         message: res?.data?.msg,
  //         type: 'danger',
  //         animationDuration: 500,
  //         floating: true,
  //         icon: {icon: 'auto', position: 'left'},
  //       });
  //     } else if (res?.data?.msg == 'No Completed Workouts Found') {
  //       setRefresh(false);
  //       setTrackerData([]);
  //     } else if (res?.data) {
  //       setRefresh(false);
  //       setTrackerData(res.data?.workout_ids);
  //     } else {
  //       setRefresh(false);
  //       setTrackerData([]);
  //     }
  //   } catch (error) {
  //     setRefresh(false);
  //     console.error(error, 'popularError');
  //     setTrackerData([]);
  //   }
  // };

  // const AdCard = () => {
  //   return (
  //     <View
  //       style={{
  //         width: DeviceHeigth < 1280 ? DeviceWidth * 0.92 : DeviceWidth * 0.96,
  //         height: DeviceHeigth * 0.19,
  //         borderRadius: 20,
  //         padding: 15,
  //         alignItems: 'center',
  //         justifyContent: 'space-evenly',
  //         flexDirection: 'row',
  //         marginTop: 5,
  //         backgroundColor: '#94100033',
  //       }}>
  //       <View style={{marginLeft: -5}}>
  //         <Text
  //           // numberOfLines={1}
  //           style={[styles.category]}>
  //           {`Full Body Toning\nWorkout`}
  //         </Text>
  //         <Text
  //           style={[
  //             styles.category,
  //             {
  //               width: DeviceWidth * 0.35,
  //               fontWeight: '600',
  //               fontSize: 12,
  //               lineHeight: 15,
  //               marginVertical: 10,
  //             },
  //           ]}>
  //           Includes circuits to work every muscle
  //         </Text>
  //         <GradientButton
  //           w={DeviceWidth * 0.3}
  //           onPress={() =>
  //             navigation?.navigate('AllWorkouts', {
  //               data: allWorkoutData,
  //               type: '',
  //               fav: false,
  //             })
  //           }
  //           h={35}
  //           //  mV={15}
  //           text="Start Training"
  //           textStyle={{
  //             fontSize: 12,
  //             fontFamily: 'Poppins',
  //             lineHeight: 18,
  //             textAlign: 'center',
  //             color: AppColor.WHITE,
  //             fontWeight: '600',
  //           }}
  //         />
  //       </View>

  //       <Image
  //         source={localImage.GymImage}
  //         style={{
  //           height: DeviceHeigth * 0.2,
  //           width: DeviceWidth * 0.37,
  //           left: DeviceWidth * 0.03,
  //           top: -DeviceHeigth * 0.005,
  //         }}
  //         resizeMode="contain"></Image>
  //     </View>
  //   );
  // };

  const renderItem = useMemo(() => {
    return ({item}: any) => (
     
      <>
        <View
          style={{
            marginHorizontal: 5,
          }}>
          <TouchableOpacity
          onPress={()=>{

          }}
            style={{
              //width: DeviceWidth * 0.6,
              //height: DeviceHeigth * 0.1,
              borderRadius: 50,
              borderWidth: 2,
              borderColor: '#D9D9D9',
              marginVertical: DeviceHeigth * 0.01,
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: AppColor.WHITE,
              flexDirection: 'row',
              padding: 5,

              // shadowColor: 'rgba(0, 0, 0, 1)',
              ...Platform.select({
                ios: {
                  //shadowColor: '#000000',
                  shadowOffset: {width: 0, height: 2},
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                },
                android: {
                  elevation: 5,
                },
              }),
            }}>
            <Image
              source={item.img}
              style={{
                width: 50,
                height: 50,
                justifyContent: 'center',
                alignSelf: 'center',
                borderRadius: 16,
              }}
              resizeMode="contain"
            />

            <Text
              style={{
                marginHorizontal: 10,
                fontSize: 15,
                fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                fontWeight: '500',
                lineHeight: 15,
                color: '#434343',
              }}>
              {item.title}
            </Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }, []);

  const renderItem1 = useMemo(() => {
    return ({item}: any) => (
      <>
        <TouchableOpacity
          activeOpacity={0.8}
          style={{
            width: DeviceWidth * 0.95,
            height: DeviceHeigth * 0.45,

            //margin:10,
            marginVertical: DeviceHeigth * 0.015,
          }}>
          <ImageBackground
            source={require('../../Icon/Images/product_1631791758.jpg')}
            style={{
              width: DeviceWidth * 0.95,
              height: DeviceHeigth * 0.45,
              borderRadius: 20,
              overflow: 'hidden',
            }}
            resizeMode="cover">
            <LinearGradient
              start={{x: 1, y: 0}}
              end={{x: 0, y: 1}}
              colors={['transparent', 'transparent', '#194ED5', '#003B94']}
              style={{
                width: DeviceWidth * 0.95,
                height: DeviceHeigth * 0.45,
                borderRadius: 20,
                opacity: 0.9,
              }}>
              <ImageBackground
                source={localImage.CalenderNew}
                style={{
                  width: 60,
                  height: 110,
                  alignSelf: 'flex-end',
                  justifyContent: 'center',
                  alignItems: 'center',
                  top: 0,
                  zIndex: 1,
                  right: 10,
                }}
                resizeMode="contain">
                <Text
                  style={{
                    color: AppColor.WHITE,
                    fontFamily: Fonts.MONTSERRAT_MEDIUM,
                    fontWeight: '700',
                    fontSize: 14,
                    top: 0,
                    textAlign: 'center',
                  }}>
                  {`30\nDAYS`}
                </Text>
              </ImageBackground>
              <View
                style={{
                  marginTop: DeviceHeigth * 0.1,
                  marginHorizontal: 10,
                  zIndex: 1,
                }}>
                <Text
                  style={{
                    fontFamily: Fonts.MONTSERRAT_BOLD,
                    lineHeight: 40,
                    fontWeight: '700',
                    fontSize: 32,
                    color: AppColor.WHITE,
                  }}>{`30-Day\nCore Challenge`}</Text>
              </View>
              <View style={{marginHorizontal: 10, zIndex: 1}}>
                <Text
                  style={{
                    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                    lineHeight: 40,
                    fontWeight: '600',
                    fontSize: 18,
                    color: AppColor.WHITE,
                  }}>{`Daily 50 Crunches`}</Text>
              </View>
            </LinearGradient>
          </ImageBackground>
        </TouchableOpacity>
      </>
    );
  }, []);
  const emptyComponent = () => {
    return (
      <View
        style={{
          // flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
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
            alignSelf: 'center',
          }}
        />
      </View>
    );
  };

  const getbodyPartWorkout = (data: any) => {
    const bodyexercise = allWorkoutData.filter((item: any) => {
      return item.workout_bodypart == data.bodypart_id;
    });
    navigation.navigate('FocuseWorkoutList', {
      bodyexercise: bodyexercise,
      item: data,
    });
  };
  return (
    <>
      <NewHeader header={'Workouts'} SearchButton={false} backButton={false} />
      <ScrollView
        keyboardDismissMode="interactive"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: DeviceHeigth * 0.01,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refresh}
            onRefresh={() => {
              allWorkoutApi();

              // workoutStatusApi();
            }}
            colors={[AppColor.RED, AppColor.WHITE]}
          />
        }
        style={styles.container}
        nestedScrollEnabled>
        <>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              alignSelf: 'center',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                color: AppColor.HEADERTEXTCOLOR,
                fontFamily: Fonts.MONTSERRAT_BOLD,
                fontWeight: '600',
                lineHeight: 30,
                fontSize: 18,
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}>
              Focus Area
            </Text>
          </View>
          <View style={styles.meditionBox}>
            <FlatList
              data={completeProfileData?.focusarea}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item: any, index: number) => index.toString()}
              // ListEmptyComponent={emptyComponent}
              renderItem={({item, index}: any) => {
                return (
                  <>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => {
                        getbodyPartWorkout(item);
                      }}
                      style={{
                        marginHorizontal: 10,
                        paddingBottom: 10,
                        alignItems: 'center',
                        justifyContent: 'center',
                        alignSelf: 'center',
                      }}>
                      <View
                        style={{
                          width: 80,
                          height: 80,
                          borderRadius: 40,
                          backgroundColor: '#FFFFFF',
                          borderColor: '#D9D9D9',
                          borderWidth: 1,
                          marginVertical: DeviceHeigth * 0.015,
                          alignItems: 'center',
                          justifyContent: 'center',
                          alignSelf: 'center',
                          padding: 7,
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
                        }}>
                        <Image
                          source={require('../../Icon/Images/NewImage2/human.png')}
                          style={{
                            width: '100%',
                            height: '100%',
                            justifyContent: 'center',
                            alignSelf: 'center',
                          }}
                          resizeMode="contain"
                        />
                      </View>
                      <Text
                        style={{
                          color: 'black',
                          fontSize: 12,
                          fontWeight: '500',
                          lineHeight: 30,
                          top: -8,
                          fontFamily: Fonts.MONTSERRAT_MEDIUM,
                        }}>
                        {item.bodypart_title}
                      </Text>
                    </TouchableOpacity>
                  </>
                );
              }}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              updateCellsBatchingPeriod={100}
              removeClippedSubviews={true}
            />
          </View>
        </>
        <>
          <View
            style={{
              width: '100%',
              alignSelf: 'center',
              // marginVertical: DeviceHeigth * 0.02,
            }}>
            <Text
              style={{
                color: AppColor.HEADERTEXTCOLOR,
                fontFamily: Fonts.MONTSERRAT_BOLD,
                fontWeight: '600',
                lineHeight: 30,
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
              width: '100%',

              borderRadius: 20,
              marginVertical: 25,
              paddingVertical: 15,
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
                        ? -DeviceWidth * 0.03
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
        <>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              alignSelf: 'center',
              marginVertical: DeviceHeigth * 0.0,
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                color: AppColor.HEADERTEXTCOLOR,
                fontFamily: Fonts.MONTSERRAT_BOLD,
                fontWeight: '600',
                lineHeight: 30,
                fontSize: 18,
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}>
              Workout Categories
            </Text>
          </View>
          <View
            style={[
              styles.meditionBox,
              {alignItems: 'center', marginVertical: 15},
            ]}>
            <FlatList
              data={catogery}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item: any, index: number) => index.toString()}
              renderItem={renderItem}
              ListEmptyComponent={emptyComponent}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              updateCellsBatchingPeriod={100}
              removeClippedSubviews={true}
            />
          </View>
          <View style={[styles.meditionBox, {alignItems: 'center', top: -10}]}>
            <FlatList
              data={catogery2}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item: any, index: number) => index.toString()}
              renderItem={renderItem}
              ListEmptyComponent={emptyComponent}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              updateCellsBatchingPeriod={100}
              removeClippedSubviews={true}
            />
          </View>
        </>
        <>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              alignSelf: 'center',
              marginVertical: DeviceHeigth * 0.02,
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                color: AppColor.HEADERTEXTCOLOR,
                fontFamily: Fonts.MONTSERRAT_BOLD,
                fontWeight: '600',
                lineHeight: 30,
                fontSize: 18,
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}>
              Workout Challenges
            </Text>
          </View>
          <View
            style={[
              styles.meditionBox,
              {marginVertical: DeviceHeigth * 0.01, alignItems: 'center'},
            ]}>
            <FlatList
              data={completeProfileData?.focusarea}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item: any, index: number) => index.toString()}
              renderItem={renderItem1}
              ListEmptyComponent={emptyComponent}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              updateCellsBatchingPeriod={100}
              removeClippedSubviews={true}
            />
          </View>
        </>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColor.WHITE,
    paddingHorizontal: 10,
  },
  category: {
    fontFamily: 'Poppins',
    fontSize: 16,
    fontWeight: '700',
    color: AppColor.BoldText,
    lineHeight: 25,
  },
  meditionBox: {
    backgroundColor: 'white',
    //top: DeviceHeigth * 0.015,
  },
});

export default Workouts;
