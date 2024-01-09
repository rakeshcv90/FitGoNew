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

const Workouts = () => {
  const {allWorkoutData, getUserDataDetails} = useSelector(
    (state: any) => state,
  );
  const [popularData, setPopularData] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    allWorkoutData?.length == 0 && allWorkoutApi();
    popularData?.length == 0 && popularWorkoutApi();
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
        console.log(res.data, 'AllWorkouts');
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
      const res = await axios(NewAppapi.POPULAR_WORKOUTS);
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
        <View style={{marginVertical: 5, marginLeft: 30}}>
          <Text
            numberOfLines={1}
            style={[styles.category, {width: DeviceWidth * 0.6}]}>
            Full Body Toning Workout
          </Text>
          <Text
            style={[
              styles.category,
              {
                width: DeviceWidth * 0.35,
                fontSize: 12,
                lineHeight: 15,
                marginVertical: 10,
              },
            ]}>
            Includes circuits to work every muscle
          </Text>
          <GradientButton
            w={DeviceWidth * 0.3}
            h={50}
            mV={10}
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
            height: DeviceHeigth * 0.45,
            width: DeviceWidth * 0.37,
            left: -15,
            top:-10
    
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
            }}
            colors={[AppColor.RED, AppColor.WHITE]}
          />
        }
        style={styles.container}
        nestedScrollEnabled>
        <RoundedCards data={allWorkoutData} horizontal viewAllButton />
        <View style={{marginVertical:15}}>
        <AdCard />
        </View>
      
        {popularData?.length != 0 && (
          <MediumRounded
            data={popularData}
            headText="Popular Workouts"
            viewAllButton
          />
        )}
        <RoundedCards
          data={allWorkoutData}
          horizontal={false}
          headText="Core Workouts"
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
    fontSize: 18,
    fontWeight: '600',
    color: AppColor.BoldText,
    lineHeight: 25,
  },
});

export default Workouts;
