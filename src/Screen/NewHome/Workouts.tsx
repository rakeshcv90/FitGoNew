import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import React, {useEffect} from 'react';
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

const data = [
  {
    id: 1,
    name: 'Cardio',
    image: localImage.GymImage,
  },
  {
    id: 2,
    name: 'Workout',
    image: localImage.GymImage,
  },
  {
    id: 3,
    name: 'Stretching',
    image: localImage.GymImage,
  },
  {
    id: 4,
    name: 'Weights',
    image: localImage.Abs,
  },
  {
    id: 5,
    name: 'Cardio',
    image: localImage.Abs,
  },
  {
    id: 6,
    name: 'Cardio',
    image: localImage.Abs,
  },
];

const Workouts = () => {
  const {allWorkoutData, getUserDataDetails} = useSelector(
    (state: any) => state,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    allWorkoutData.length == 0 &&
     allWorkoutApi();
  }, []);

  const allWorkoutApi = async () => {
    try {
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
        console.log(res.data, 'AllWorkouts');
        dispatch(setAllWorkoutData(res.data));
      }
    } catch (error) {
      console.error(error, 'customWorkoutDataApiError');
      dispatch(setAllWorkoutData([]));
    }
  };

  const AdCard = () => {
    return (
      <TouchableOpacity activeOpacity={1}>
        <LinearGradient
          colors={['rgba(213, 25, 26, 0.3)', 'rgba(148, 16, 0, 0.3)']}
          style={{
            width: DeviceWidth * 0.9,
            height: DeviceHeigth * 0.2,
            marginVertical: 20,
            borderRadius: 20,
            padding: 15,
            flexDirection: 'row',
            justifyContent: 'space-between',
            zIndex: -1,
            // overflow: 'hidden',
          }}>
          <View>
            <Text style={[styles.category, {width: DeviceWidth * 0.35}]}>
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
            source={localImage.FemaleHeight}
            resizeMode="contain"
            style={{
              height: DeviceHeigth * 0.23,
              width: DeviceWidth * 0.4,
              alignSelf: 'flex-end',
              marginBottom: -15,
            }}
          />
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Header header={'Workouts'} SearchButton={false} backButton={false} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.container}
        nestedScrollEnabled>
        <RoundedCards data={data} horizontal viewAllButton />
        <AdCard />
        <MediumRounded data={data} headText="Popular Workouts" viewAllButton />
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
    lineHeight: 30,
  },
});

export default Workouts;
