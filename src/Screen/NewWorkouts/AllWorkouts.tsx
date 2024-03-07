import {
  Animated,
  Easing,
  FlatList,
  Image,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AppColor} from '../../Component/Color';
import NewHeader from '../../Component/Headers/NewHeader';
import axios from 'axios';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../Component/Config';
import {setAllWorkoutData} from '../../Component/ThemeRedux/Actions';
import {useDispatch, useSelector} from 'react-redux';
import GradientText from '../../Component/GradientText';
import moment from 'moment';
import {localImage} from '../../Component/Image';
import {showMessage} from 'react-native-flash-message';
// import LinearGradient from 'react-native-linear-gradient';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import VersionNumber, {appVersion} from 'react-native-version-number';
const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);
import Svg, {Path, Defs, LinearGradient, Stop} from 'react-native-svg';
import AnimatedLottieView from 'lottie-react-native';
import {useFocusEffect} from '@react-navigation/native';
const AllWorkouts = ({navigation, route}: any) => {
  const {data, type, fav} = route.params;
  // const {allWorkoutData, getUserDataDetails} = useSelector(
  //   (state: any) => state,
  // );
  const allWorkoutData = useSelector((state: any) => state.allWorkoutData);
  const getUserDataDetails = useSelector(
    (state: any) => state.getUserDataDetails,
  );
  const [popularData, setPopularData] = useState([]);
  const [trackerData, setTrackerData] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [selected, setSelected] = useState(0);
  const [phase, setPhase] = useState(1);
  const [open, setOpen] = useState(true);
  const [day, setDay] = useState(1);
  const [trainingCount, setTrainingCount] = useState(-1);
  const [totalCount, setTotalCount] = useState(0);
  const [likeData, setLikeData] = useState<Array<[]>>([]);
  const [favData, setFavData] = useState<Array<any>>([]);
  const [datas, setData] = useState<Array<any>>([]);
  const dispatch = useDispatch();
  let total_Workouts_Time = 0;

  useEffect(() => {
    // allWorkoutApi();
    popularData?.length == 0 && popularWorkoutApi();
    workoutStatusApi();
    getFavStatusAPI();
    data?.map((item: any) => {
      let totalTime = 0;
      for (const day in item?.days) {
        totalTime = totalTime + parseInt(item?.days[day]?.total_rest);
      }
      total_Workouts_Time = total_Workouts_Time + totalTime;
    });
    setTotalCount(total_Workouts_Time);
  }, []);
  useFocusEffect(
    useCallback(() => {
      getAllLikeStatusAPI();
    }, []),
  );
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
  const popularWorkoutApi = async () => {
    try {
      setRefresh(true);
      const res = await axios(
        NewAppapi.POPULAR_WORKOUTS + '/' + VersionNumber.appVersion,
      );
      if (res?.data?.msg == 'Please update the app to the latest version.') {
        showMessage({
          message: res?.data?.msg,
          type: 'danger',
          animationDuration: 500,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
        setRefresh(false);
      } else if (res.data) {
        setRefresh(false);

        setPopularData(res.data);
      } else {
        setPopularData([]);
        setRefresh(false);
      }
    } catch (error) {
      setRefresh(false);
      console.error(error, 'popularError');
      setPopularData([]);
    }
  };

  const workoutStatusApi = async () => {
    try {
      const payload = new FormData();
      payload.append('token', getUserDataDetails?.login_token);
      payload.append('id', getUserDataDetails?.id);
      payload.append('version', VersionNumber.appVersion);
      setRefresh(true);
      const res = await axios({
        url: NewAppapi.TRACK_WORKOUTS,
        method: 'post',
        data: payload,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (res?.data?.msg == 'Please update the app to the latest version.') {
        setRefresh(false);
        showMessage({
          message: res?.data?.msg,
          type: 'danger',
          animationDuration: 500,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
      } else if (res?.data?.msg == 'No Completed Workouts Found') {
        setRefresh(false);
        setTrackerData([]);
      } else if (res?.data) {
        setRefresh(false);
        setTrackerData(res.data?.workout_ids);
      } else {
        setRefresh(false);
        setTrackerData([]);
      }
    } catch (error) {
      setRefresh(false);
      console.error(error, 'popularError');
      setTrackerData([]);
    }
  };

  const getFavStatusAPI = async () => {
    try {
      const payload = new FormData();
      payload.append('login_token', getUserDataDetails?.login_token);
      payload.append('user_id', getUserDataDetails?.id);
      setRefresh(true);
      const res = await axios({
        url: NewAppapi.GET_FAV_WORKOUTS,
        method: 'post',
        data: payload,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (res.data) {
        setRefresh(false);


        setFavData(...res.data);

      }
    } catch (error) {
      setRefresh(false);
      console.error(error, 'LikeError');
      setFavData([]);
    }
  };
  const getAllLikeStatusAPI = async () => {
    const payload = new FormData();
    payload.append('user_id', getUserDataDetails?.id);
    try {
      // setRefresh(true);
      const res = await axios({
        url: NewAppapi.GET_LIKE_WORKOUTS,
        method: 'post',
        data: payload,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (res.data) {
        // setRefresh(false);
        // Merge likeData into each corresponding WorkoutData object
        const like = res.data?.user_like[0]?.workout_id
          ?.split(',')
          ?.map(str => parseInt(str));
        const WorkoutData = data.map(workout => {
          // Find the corresponding like data for the workout
          const likeInfo = res.data?.total?.find(
            like => like.workout_id === workout.workout_id,
          );

          // If like data is found, merge it into the workout object
          if (likeInfo) {
            return {
              ...workout, // Existing workout details
              ...likeInfo, // Add like data
              user_like: like,
            };
          }

          // If no like data is found, return the workout as is
          return workout;
        });
        setLikeData(WorkoutData);
      }
    } catch (error) {
      // setRefresh(false);
      console.error(error, 'LikeError');
      setLikeData([]);
    }
  };

  const postFavAPI = async (workoutID: any) => {
    try {
      const payload = new FormData();
      payload.append('user_id', getUserDataDetails?.id);
      payload.append('workout_id', workoutID);
      setRefresh(true);
      const res = await axios({
        url: NewAppapi.POST_FAV_WORKOUT,
        method: 'post',
        data: payload,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (res.data) {
        setRefresh(false);
        console.log(res.data, 'POST LIKE');
        getFavStatusAPI();
      }
    } catch (error) {
      setRefresh(false);
      console.error(error, 'likeERRPost');
    }
  };
  const postLikeAPI = async (workoutID: any) => {
    try {
      const payload = new FormData();
      payload.append('user_id', getUserDataDetails?.id);
      payload.append('workout_id', workoutID);
      // setRefresh(true);
      const res = await axios({
        url: NewAppapi.POST_LIKE_WORKOUT,
        method: 'post',
        data: payload,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (res.data) {
        // setRefresh(false);
        console.log(res.data, 'POST LIKE');
        getAllLikeStatusAPI();
      }
    } catch (error) {
      // setRefresh(false);
      console.error(error, 'likeERRPost');
    }
  };
  const SvgComponent = ({fill, border}: any) => (
    <Svg width="20" height="20" viewBox="0 0 24 24">
      <Path
        fill={fill}
        stroke={border}
        strokeWidth={0.5}
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      />
    </Svg>
  );
  const likeAnimation = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    datas?.includes(1) &&
      Animated.sequence([
        Animated.timing(likeAnimation, {
          toValue: 1.1,
          duration: 200,
          easing: Easing.bounce,
          useNativeDriver: false,
          delay: 100,
        }),
        Animated.timing(likeAnimation, {
          toValue: 1,
          duration: 200,
          easing: Easing.bounce,
          useNativeDriver: false,
          delay: 100,
        }),
      ]).start();
  }, [datas]);
  const BlackCircle = ({indexes, select, index, item}: any) => {
    return (
      <TouchableOpacity
        // disabled={!fav}
        // onPress={() => postLike(item?.workout_id)}
        style={{
          backgroundColor: 'white',
          marginRight: 10,
          marginLeft: 0,
          width: 40,
          overflow: 'hidden',
          height: DeviceHeigth * 0.2,
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: -DeviceHeigth * 0.05,
        }}>
        {favData?.includes(item?.workout_id) ? (
          <Image
            source={fav ? localImage.Heart : localImage.BlackCircle}
            style={{height: 30, width: 30}}
          />
        ) : (
          <Image
            source={fav ? localImage.dw7 : localImage.GreyCircle}
            style={{height: 30, width: 30}}
          />
        )}
      </TouchableOpacity>
    );
  };

  const Time = () => {
    return (
      <LinearGradient
        start={{x: 1, y: 0}}
        end={{x: 0, y: 1}}
        colors={['#941000', '#D5191A']}
        style={[
          {
            width: DeviceWidth,
            height: 80,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            marginLeft: -15,
            // justifyContent: 'center',
            alignItems: 'center',
            paddingTop: 10,
          },
        ]}>
        <Text
          style={{
            color: AppColor.WHITE,
            fontSize: 18,
            lineHeight: 30,
            fontFamily: 'Poppins',
            fontWeight: '500',
          }}>
          Time
        </Text>
        <Text
          style={{
            color: AppColor.WHITE,
            fontSize: 28,
            lineHeight: 30,
            fontFamily: 'Poppins',
            fontWeight: '600',
          }}>
          {totalCount > 3600
            ? `${(totalCount / 3600).toFixed(0)} hrs ${Math.floor(
                (totalCount % 60) / 60,
              )} min ${totalCount % 60} sec`
            : totalCount > 60
            ? `${(totalCount / 60).toFixed(0)} min ${totalCount % 60} sec`
            : `${totalCount} sec`}
        </Text>
      </LinearGradient>
    );
  };
  const Box = ({selected, item, index}: any) => {
    let totalTime = 0;
    for (const day in item?.days) {
      totalTime = totalTime + parseInt(item?.days[day]?.total_rest);
    }
    const getBackgroundColor = (index: number) => {
      const colors = ['#CEF2F9', '#F3F4F7', '#EAEBFF', '#FFE8E1'];
      return colors[index % colors.length];
    };
    return (
      <View style={{marginBottom: DeviceHeigth * 0.01}}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            navigation?.navigate('WorkoutDays', {data: item});
          }}
          style={[
            styles.box,
            {
              backgroundColor: getBackgroundColor(index),
              height: DeviceHeigth * 0.2,
            },
          ]}>
          {/* <Text>{item?.workout_price}</Text> */}
          <Image
            source={
              item.workout_price == 'Premium'
                ? require('../../Icon/Images/NewImage/premium.png')
                : require('../../Icon/Images/NewImage/free.png')
            }
            resizeMode="contain"
            style={{
              width: 100,
              height: 50,
              top:
                Platform.OS == 'android'
                  ? -DeviceHeigth * 0.029
                  : -DeviceHeigth * 0.029,
              left:
                Platform.OS == 'android'
                  ? -DeviceWidth * 0.04
                  : -DeviceWidth * 0.035,
            }}></Image>
          <Image
            source={{uri: item?.workout_image_link}}
            style={{
              height: DeviceHeigth * 0.18,
              width: DeviceWidth * 0.45,
              bottom: 0,
              // position: 'absolute',
              //left: 10,
              right: 50,
            }}
            resizeMode="contain"
          />
          {type != 'custom' && !fav && (
            <TouchableOpacity onPress={() => postFavAPI(item?.workout_id)}>
              {favData.includes(item?.workout_id) ? (
                <Image
                  source={localImage.Heart}
                  resizeMode="contain"
                  style={{height: 25, width: 25, right: 25}}
                />
              ) : (
                <Image
                  source={localImage.dw7}
                  resizeMode="contain"
                  style={{height: 25, width: 25, right: 25}}
                />
              )}
            </TouchableOpacity>
          )}
        </TouchableOpacity>

        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: DeviceWidth * 0.775,
            }}>
            <Text style={[styles.category]}>{item?.workout_title}</Text>
            <Text style={styles.small}>
              Approx.{' '}
              {totalTime > 60
                ? `${(totalTime / 60).toFixed(0)} min`
                : `${totalTime} sec`}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: DeviceWidth * 0.775,
            }}>
            <View style={{width: DeviceWidth * 0.5}}>
              {trackerData?.includes(item?.workout_id) ? (
                <Text style={[styles.small, {color: '#008C28'}]}>
                  Completed
                </Text>
              ) : index + 1 ? (
                <Text style={[styles.small, {color: '#E0855C'}]}>
                  In Progress
                </Text>
              ) : (
                <Text style={[styles.small, {color: '#D5191A'}]}>Upcoming</Text>
              )}
            </View>
            <TouchableOpacity onPress={() => postLikeAPI(item?.workout_id)}>
              {item?.user_like?.includes(item?.workout_id) ? (
                <AnimatedLottieView
                  source={require('../../Icon/Images/NewImage/Heart.json')}
                  autoPlay
                  speed={0.5}
                  style={{
                    width: 40,
                    height: 40,
                  }}
                />
              ) : (
                <AnimatedLottieView
                  source={require('../../Icon/Images/NewImage/Heartless.json')}
                  autoPlay
                  speed={0.5}
                  style={{
                    width: 40,
                    height: 40,
                  }}
                />
              )}
            </TouchableOpacity>
            <Text
              style={{
                color: AppColor.BLACK,
                marginRight: 10,
                left: item?.user_like?.includes(item?.workout_id) ? -2 : 5,
              }}>
              {item?.total_workout_like}
            </Text>

            <AnimatedLottieView
              source={require('../../Icon/Images/NewImage/Eye.json')}
              speed={0.5}
              autoPlay
              style={{width: 30, height: 30}}
            />
            <Text style={{color: AppColor.BLACK, marginLeft: 10}}>
              {item?.total_workout_views}
            </Text>
          </View>
        </View>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <NewHeader
        header={
          fav
            ? 'Popular Workouts'
            : type == 'custom'
            ? 'Custom Workouts'
            : type == 'popular'
            ? 'Popular Workouts'
            : 'All Workouts'
        }
        SearchButton={false}
        backButton
      />
      <GradientText
        text={'Today'}
        fontWeight={'500'}
        fontSize={22}
        width={150}
        x={1}
        marginTop={-10}
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 10,
        }}>
        <Text style={[styles.category, {marginTop: 0}]}>
          {moment().format('dddd DD MMMM')}
        </Text>
        <Text style={[styles.category, {color: '#E0855C'}]}>
          {/* <View
            style={{
              width: 2,
              height: 2,
              backgroundColor: AppColor.BoldText,
              borderRadius: 20,
            }}
          /> */}
          {' ' + 'In Progress'}
        </Text>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refresh}
            onRefresh={() => {
              allWorkoutApi();
              popularWorkoutApi();
            }}
            colors={[AppColor.RED, AppColor.WHITE]}
          />
        }
        // style={styles.container}
        nestedScrollEnabled>

   
        <FlatList
          data={likeData}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item: any) => item?.workout_id?.toString()}
          renderItem={({item, index}: any) => {
            if (fav && favData?.includes(item?.workout_id))
              return (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <BlackCircle
                    index={index}
                    select={index == selected}
                    item={item}
                  />
                  <Box
                    selected={selected != 0 && index == selected}
                    index={index + 1}
                    item={item}
                  />
                </View>
              );
            else
              return (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <BlackCircle
                    index={index}
                    select={index == selected}
                    item={item}
                  />
                  <Box
                    selected={selected != 0 && index == selected}
                    index={index + 1}
                    item={item}
                  />
                </View>
              );
          }}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={100}
          removeClippedSubviews={true}
        />

      </ScrollView>
      <Time />
    </View>
  );
};

export default AllWorkouts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColor.WHITE,
    paddingHorizontal: 15,
  },
  category: {
    fontFamily: 'Poppins',
    fontSize: 18,
    fontWeight: '600',
    color: AppColor.BoldText,
    lineHeight: 30,
  },
  small: {
    fontFamily: 'Poppins',
    fontSize: 12,
    fontWeight: '500',
    color: AppColor.BoldText,
    lineHeight: 30,
  },
  box: {
    //   flex: 1,
    width: DeviceWidth * 0.8,
    justifyContent: 'space-between',
    // alignItems: 'center',
    padding: 10,
    borderRadius: 15,
    marginVertical: 8,
    marginRight: 8,
    marginLeft: -8,
    paddingRight: 8,
    flexDirection: 'row',
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0, 0, 0, 0.6)',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.5,
        // shadowRadius: 10,
      },
      android: {
        elevation: 10,
        shadowColor: 'rgba(0, 0, 0, 0.6)',
        shadowOffset: {width: 1, height: 1},
        shadowOpacity: 0.1,
        // shadowRadius: 10,
      },
    }),
  },
});
