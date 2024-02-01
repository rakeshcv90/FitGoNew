import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  RefreshControl,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AppColor} from '../../Component/Color';
import Header from '../../Component/Headers/NewHeader';
import RoundedCards from '../../Component/RoundedCards';
import {localImage} from '../../Component/Image';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../Component/Config';
import LinearGradient from 'react-native-linear-gradient';
import GradientButton from '../../Component/GradientButton';
import MediumRounded from '../../Component/MediumRounded';
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';
import {setAllWorkoutData} from '../../Component/ThemeRedux/Actions';
import NewHeader from '../../Component/Headers/NewHeader';
import VersionNumber, {appVersion} from 'react-native-version-number';
import {showMessage} from 'react-native-flash-message';
const Workouts = ({navigation}: any) => {
  const {allWorkoutData, getUserDataDetails} = useSelector(
    (state: any) => state,
  );
  const [popularData, setPopularData] = useState([]);
  const [trackerData, setTrackerData] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    allWorkoutData?.length == 0 && allWorkoutApi();
    popularData?.length == 0 && popularWorkoutApi();
    workoutStatusApi();
  }, []);
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

      setRefresh(false);
      // if (res.data?.status != 'Invalid token') {
      //   setRefresh(false);
      //   // console.log(res.data, 'Popular');
      //   setPopularData(res.data);
      // } else {
      //   // console.log(res.data, 'Popular Status');
      //   setPopularData([]);
      // }

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
        setPopularData(res.data);
      } else {
        setRefresh(false);
        setPopularData([]);
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
      payload.append('version',VersionNumber.appVersion);
      setRefresh(true);
      const res = await axios({
        url: NewAppapi.TRACK_WORKOUTS,
        method: 'post',
        data: payload,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Workout Status', res.data);
      if (res?.data?.msg == 'Please update the app to the latest version.') {
        setRefresh(false);
        showMessage({
          message: res?.data?.msg,
          type: 'danger',
          animationDuration: 500,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
      } else if (
        res?.data?.msg == 'No Completed Workouts Found'
      ) {
        setRefresh(false);
        setTrackerData([]);
      }
     else if (res?.data) {
        setRefresh(false);
        setTrackerData(res.data?.workout_ids);
      }else{
        setRefresh(false);
        setTrackerData([]);
      }
    } catch (error) {
      setRefresh(false);
      console.error(error, 'popularError');
      setTrackerData([]);
    }
  };

  const AdCard = () => {
    return (
      <View
        style={{
          width: DeviceWidth * 0.92,
          height: DeviceHeigth * 0.19,
          borderRadius: 20,
          padding: 15,
          alignItems: 'center',
          justifyContent: 'space-evenly',
          flexDirection: 'row',
          marginTop: 5,
          backgroundColor: '#94100033',
        }}>
        <View style={{marginLeft: -5}}>
          <Text
            numberOfLines={1}
            style={[styles.category, {width: DeviceWidth * 0.5}]}>
            Full Body Toning Workout
          </Text>
          <Text
            style={[
              styles.category,
              {
                width: DeviceWidth * 0.35,
                fontWeight: '600',
                fontSize: 12,
                lineHeight: 15,
                marginVertical: 10,
              },
            ]}>
            Includes circuits to work every muscle
          </Text>
          <GradientButton
            w={DeviceWidth * 0.3}
            onPress={() =>
              navigation?.navigate('AllWorkouts', {
                data: allWorkoutData,
                type: '',
                fav: false,
              })
            }
            h={35}
            mV={20}
            text="Start Training"
            textStyle={{
              fontSize: 12,
              fontFamily: 'Poppins',
              lineHeight: 18,
              color: AppColor.WHITE,
              fontWeight: '600',
            }}
          />
        </View>

        <Image
          source={localImage.GymImage}
          style={{
            height: DeviceHeigth * 0.2,
            width: DeviceWidth * 0.37,
            left: DeviceWidth * 0.03,
            top: -DeviceHeigth * 0.005,
          }}
          resizeMode="contain"></Image>
      </View>
    );
  };

  return (
    <>
      <NewHeader header={'Workouts'} SearchButton={false} backButton={false} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refresh}
            onRefresh={() => {
              allWorkoutApi();
              popularWorkoutApi();
              workoutStatusApi();
            }}
            colors={[AppColor.RED, AppColor.WHITE]}
          />
        }
        style={styles.container}
        nestedScrollEnabled>
        <RoundedCards
          data={allWorkoutData}
          trackerData={trackerData}
          viewAllPress={() =>
            navigation?.navigate('AllWorkouts', {
              data: allWorkoutData,
              type: '',
              fav: false,
            })
          }
          horizontal
          viewAllButton
          type="category"
        />

        <View style={{marginVertical: 15}}>
          <AdCard />
        </View>

        {popularData?.length != 0 && (
          <MediumRounded
            data={popularData}
            headText="Popular Workouts"
            viewAllButton
            viewAllPress={() =>
              navigation?.navigate('AllWorkouts', {
                data: popularData,
                type: 'popular',
              })
            }
          />
        )}
        <RoundedCards
          data={allWorkoutData}
          trackerData={trackerData}
          viewAllPress={() =>
            navigation?.navigate('AllWorkouts', {
              data: allWorkoutData,
              type: '',
              fav: false,
            })
          }
          horizontal={false}
          headText="Core Workouts"
          type="core"
          viewAllButton
        />
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColor.WHITE,
    paddingHorizontal: 15,
  },
  category: {
    fontFamily: 'Poppins',
    fontSize: 16,
    fontWeight: '700',
    color: AppColor.BoldText,
    lineHeight: 25,
  },
});

export default Workouts;
