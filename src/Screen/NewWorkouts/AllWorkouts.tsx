import {
  Image,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
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
import LinearGradient from 'react-native-linear-gradient';

const AllWorkouts = ({navigation, route}: any) => {
  const {allWorkoutData, getUserDataDetails} = useSelector(
    (state: any) => state,
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
  const [likeData, setLikeData] = useState<Array<any>>([]);
  const dispatch = useDispatch();
  let total_Workouts_Time = 0;
  useEffect(() => {
    allWorkoutApi();
    popularData?.length == 0 && popularWorkoutApi();
    workoutStatusApi();
    likeStatusApi();
  }, []);

  const allWorkoutApi = async () => {
    try {
      setRefresh(true);
      const payload = new FormData();
      payload.append('id', getUserDataDetails?.id);
      const res = await axios({
        url: NewAppapi.ALL_WORKOUTS,
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: payload,
      });
      if (res.data) {
        setRefresh(false);
        res.data?.map((item: any) => {
          let totalTime = 0;
          for (const day in item?.days) {
            totalTime = totalTime + parseInt(item?.days[day]?.total_rest);
          }
          total_Workouts_Time = total_Workouts_Time + totalTime;
        });
        setTotalCount(total_Workouts_Time);
        console.log(res.data?.length, 'AllWorkouts', total_Workouts_Time);
        dispatch(setAllWorkoutData(res.data));
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
        NewAppapi.POPULAR_WORKOUTS + '/' + getUserDataDetails?.login_token,
      );
      if (res.data) {
        setRefresh(false);
        console.log(res.data?.length, 'Popular');
        setPopularData(res.data);
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
      setRefresh(true);
      const res = await axios({
        url: NewAppapi.TRACK_WORKOUTS,
        method: 'post',
        data: payload,
      });
      if (res.data) {
        setRefresh(false);
        console.log(res.data?.workout_ids?.length, 'Popular');
        setTrackerData(res.data?.workout_ids);
      }
    } catch (error) {
      setRefresh(false);
      console.error(error, 'popularError');
      setTrackerData([]);
    }
  };

  const likeStatusApi = async () => {
    try {
      const payload = new FormData();
      payload.append('login_token', getUserDataDetails?.login_token);
      payload.append('user_id', getUserDataDetails?.id);
      setRefresh(true);
      const res = await axios({
        url: NewAppapi.GET_LIKE_WORKOUTS,
        method: 'post',
        data: payload,
      });
      if (res.data) {
        setRefresh(false);
        console.log(...res.data, 'GET LIKES ');
        setLikeData(...res.data);
      }
    } catch (error) {
      setRefresh(false);
      console.error(error, 'LikeError');
      setLikeData([]);
    }
  };

  const postLike = async (workoutID: any) => {
    try {
      const payload = new FormData();
      payload.append('user_id', getUserDataDetails?.id);
      payload.append('workout_id', workoutID);
      setRefresh(true);
      const res = await axios({
        url: NewAppapi.POST_LIKE_WORKOUT,
        method: 'post',
        data: payload,
      });
      if (res.data) {
        setRefresh(false);
        console.log(res.data, 'POST LIKE');
        likeStatusApi();
      }
    } catch (error) {
      setRefresh(false);
      console.error(error, 'likeERRPost');
    }
  };

  const BlackCircle = ({indexes, select, index, item}: any) => {
    return (
      <View
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
        {trackerData?.includes(item?.workout_id) ? (
          <Image
            source={localImage.BlackCircle}
            style={{height: 30, width: 30}}
          />
        ) : (
          <Image
            source={localImage.GreyCircle}
            style={{height: 30, width: 30}}
          />
        )}
      </View>
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
            height: 100,
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
          <Image
            source={{uri: item?.workout_image_link}}
            style={{height: DeviceHeigth * 0.18, width: DeviceWidth * 0.7}}
            resizeMode="contain"
          />
          <TouchableOpacity onPress={() => postLike(item?.workout_id)}>
            {likeData.includes(item?.workout_id) ? (
              <Image
                source={localImage.Heart}
                resizeMode="contain"
                style={{height: 25, width: 25}}
              />
            ) : (
              <Image
                source={localImage.dw7}
                resizeMode="contain"
                style={{height: 25, width: 25}}
              />
            )}
          </TouchableOpacity>
        </TouchableOpacity>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginHorizontal: 10,
            width: '80%',
          }}>
          <View>
            <Text style={[styles.category]}>{item?.workout_title}</Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '84%',
              }}>
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
              <Text style={styles.small}>
                Approx.{' '}
                {totalTime > 60
                  ? `${(totalTime / 60).toFixed(0)} min`
                  : `${totalTime} sec`}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <NewHeader header={'All Workouts'} SearchButton={false} backButton />
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
        {allWorkoutData.map((item: any, index: number) => {
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
        })}
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
