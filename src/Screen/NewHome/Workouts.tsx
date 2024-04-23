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
import {
  setAllWorkoutData,
  setChallengesData,
  setWorkoutTimeCal,
} from '../../Component/ThemeRedux/Actions';
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
  const getUserID = useSelector((state: any) => state.getUserID);
  const getChallengesData = useSelector(
    (state: any) => state.getChallengesData,
  );

  useEffect(() => {
    if (isFocused) {

     allWorkoutData?.workout_Data?.length == 0 && allWorkoutApi();

      getCustomeWorkoutTimeDetails();
    }
  }, [isFocused]);
  const [refresh, setRefresh] = useState(false);
  let catogery = [
    {
      id: 1,
      title: 'Get Fit',
      subtitle: 'weight loss data',
      img: require('../../Icon/Images/NewImage2/Img7.png'),
    },
    {
      id: 2,
      title: 'Lose Weight',
      subtitle: 'weight loss data',
      img: require('../../Icon/Images/NewImage2/Img6.png'),
    },
    {
      id: 3,
      title: 'HIIT',
      subtitle: 'Strength',
      img: require('../../Icon/Images/NewImage2/Img5.png'),
    },
  ];
  let catogery2 = [
    {
      id: 1,
      title: 'Immunity Booster',
      subtitle: 'Strength',
      img: require('../../Icon/Images/NewImage2/Img4.png'),
    },
    {
      id: 2,
      title: 'Build Muscle',
      subtitle: 'Build',
      img: require('../../Icon/Images/NewImage2/Img3.png'),
    },
    {
      id: 3,
      title: 'Corporate Cardio',
      subtitle: 'Strength / Weight loss',
      img: require('../../Icon/Images/NewImage2/Img2.png'),
    },
    {
      id: 4,
      title: 'Beach Ready',
      subtitle: 'Build muscle/Weight Loss/ Strength',
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

  const ChallengesDataAPI = async () => {
    try {
      const res = await axios({
        url:
          NewAppapi.GET_CHALLENGES_DATA +
          '?version=' +
          VersionNumber.appVersion+'&user_id='+getUserDataDetails?.id,
      });
      console.log(res.data,"CHALL")
      if (res.data?.msg != 'version  is required') {
        dispatch(setChallengesData(res.data));
      } else {
        dispatch(setChallengesData([]));
      }
    } catch (error) {
      console.error(error, 'ChallengesDataAPI ERRR');
    }
  };
  const getCustomeWorkoutTimeDetails = async () => {
    try {
      const data = await axios(`${NewAppapi.Custome_Workout_Cal_Time}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: {
          user_id: getUserID != 0 ? getUserID : getUserDataDetails.id,
        },
      });

      if (data.data.results.length > 0) {
        dispatch(setWorkoutTimeCal(data.data.results));
      } else {
        dispatch(setWorkoutTimeCal([]));
      }
    } catch (error) {
      console.log('UCustomeCorkout details', error);
    }
  };
  const renderItem = useMemo(() => {
    return ({item}: any) => (
      <>
        <View
          style={{
            marginHorizontal: 5,
          }}>
          <TouchableOpacity
            onPress={() => {
              getFiltyerCaterogy(item);
            }}
            style={{
              //width: DeviceWidth * 0.6,
              //height: DeviceHeigth * 0.1,
              borderRadius: 50,
              borderWidth: 2,
              borderColor: '#fff',
              marginVertical: DeviceHeigth * 0.01,
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: AppColor.WHITE,
              flexDirection: 'row',
              padding: 5,

              shadowColor: 'rgba(0, 0, 0, 1)',
              ...Platform.select({
                ios: {
                  //shadowColor: '#000000',
                  shadowOffset: {width: 0, height: 2},
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                },
                android: {
                  elevation: 3,
                },
              }),
            }}>
            <Image
              source={item.img}
              style={{
                width: 30,
                height: 30,
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
                lineHeight: 25,
                color: '#434343',
                textAlign: 'center',
              }}>
              {item.title}
            </Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }, []);
  const getFiltyerCaterogy = (mydata: any) => {
    let filterData: any = [];
    if (mydata?.title == 'Get Fit') {
      filterData = allWorkoutData?.workout_Data?.filter((item: any) => {
        return item.goal_title == 'Weight Loss';
      });
    } else if (mydata?.title == 'Lose Weight') {
      filterData = allWorkoutData?.workout_Data?.filter((item: any) => {
        return item.goal_title == 'Weight Loss';
      });
    } else if (mydata?.title == 'HIIT') {
      filterData = allWorkoutData?.workout_Data?.filter((item: any) => {
        return item.goal_title == 'Strength';
      });
    } else if (mydata?.title == 'Immunity Booster') {
      filterData = allWorkoutData?.workout_Data?.filter((item: any) => {
        return item.goal_title == 'Strength';
      });
    } else if (mydata?.title == 'Build Muscle') {
      filterData = allWorkoutData?.workout_Data?.filter((item: any) => {
        return item.goal_title == 'Build Muscle';
      });
    } else if (mydata?.title == 'Corporate Cardio') {
      filterData = allWorkoutData?.workout_Data?.filter((item: any) => {
        return (
          item.goal_title == 'Strength' || item.goal_title == 'Weight Loss'
        );
      });
    } else if (mydata?.title == 'Beach Ready') {
      filterData = allWorkoutData?.workout_Data?.filter((item: any) => {
        return (
          item.goal_title == 'Build Muscle' ||
          item.goal_title == 'Weight Loss' ||
          item.goal_title == 'Strength'
        );
      });
    }
    navigation.navigate('FocuseWorkoutList', {
      bodyexercise: filterData,
      item: mydata,
    });
  };
  const renderItem1 = useMemo(() => {
    return ({item}: any) => (
      <>
        <TouchableOpacity
          onPress={() => {
            getFiltyerCaterogy(item);
          }}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('WorkoutDays', {data: item})}
          style={{
            width: DeviceWidth * 0.95,
            height: DeviceHeigth * 0.35,

            marginVertical: DeviceHeigth * 0.015,
          }}>
          <ImageBackground
            source={require('../../Icon/Images/product_1631791758.jpg')}
            style={{
              width: DeviceWidth * 0.95,
              height: DeviceHeigth * 0.35,
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
                  {`${item?.days}\nDAYS`}
                </Text>
              </ImageBackground>
              <View
                style={{
                  marginTop: DeviceHeigth * 0.05,
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
                  }}>
                  {item?.title}
                </Text>
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
    const bodyexercise = allWorkoutData?.workout_Data?.filter((item: any) => {
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
      <View style={styles.container}>
        
        <FlatList
          data={[1, 2, 3, 4]}
          showsVerticalScrollIndicator={false}
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
          renderItem={({item, index}: any) => {
            return (
              <View style={{width: '100%'}}>
                {index == 0 && (
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
                        keyExtractor={(item: any, index: number) =>
                          index.toString()
                        }
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
                                    borderColor: '#fff',
                                    borderWidth: 1,
                                    marginVertical: DeviceHeigth * 0.015,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    alignSelf: 'center',
                                    padding: 7,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                                    ...Platform.select({
                                      ios: {
                                        shadowColor: '#000000',
                                        shadowOffset: {width: 0, height: 2},
                                        shadowOpacity: 0.3,
                                        shadowRadius: 4,
                                      },
                                      android: {
                                        elevation: 10,
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
                )}
                {index == 1 && (
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
                )}
                {index == 2 && (
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
                        keyExtractor={(item: any, index: number) =>
                          index.toString()
                        }
                        renderItem={renderItem}
                        ListEmptyComponent={emptyComponent}
                        initialNumToRender={10}
                        maxToRenderPerBatch={10}
                        updateCellsBatchingPeriod={100}
                        removeClippedSubviews={true}
                      />
                    </View>
                    <View
                      style={[
                        styles.meditionBox,
                        {alignItems: 'center', top: -10},
                      ]}>
                      <FlatList
                        data={catogery2}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item: any, index: number) =>
                          index.toString()
                        }
                        renderItem={renderItem}
                        ListEmptyComponent={emptyComponent}
                        initialNumToRender={10}
                        maxToRenderPerBatch={10}
                        updateCellsBatchingPeriod={100}
                        removeClippedSubviews={true}
                      />
                    </View>
                  </>
                )}
                {index==3&&(
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
                        {marginVertical: DeviceHeigth * 0.0, alignItems: 'center'},
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
                )}
              </View>
            );
          }}
        />
      </View>
      
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColor.WHITE,
    paddingHorizontal: 10,
    marginTop: -30,
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
