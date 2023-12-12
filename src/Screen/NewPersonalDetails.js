import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import NewHeader from '../Component/Headers/NewHeader';
import {AppColor} from '../Component/Color';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../Component/Config';
import Button from '../Component/Button';
import Goal from '../Screen/Yourself/Goal';
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';
import { setUserProfileData } from '../Component/ThemeRedux/Actions';

const NewPersonalDetails = ({route, navigation}) => {
  const {getUserDataDetails} = useSelector(state => state);
  const {completeProfileData}=useSelector(state=>state)
  console.log('userData', getUserDataDetails,completeProfileData);
  const Dispatch = useDispatch();
  useEffect(() => {
    getCustomWorkout();
  }, []);
  const getCustomWorkout = async () => {
    try {
      const data = await axios(
        `https://gofit.tentoptoday.com/adserver/public/api/userprofile`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          data: {
            id: 31,
          },
        },
      );
      if (data.data) {
        // setForLoading(false);
        Dispatch(setUserProfileData(data.data?.profile));
        // console.log(' Api data', data.data);
        // navigation.navigate('BottomTab');
      } else {
        // setForLoading(false);
        // dispatch(setCustomWorkoutData([]));
        // navigation.navigate('BottomTab');
      }
    } catch (error) {
      console.log('User Profile Error', error);
      // setForLoading(false);
    }
  };
  return (
    <View style={styles.Container}>
      <NewHeader header={'Personal Details'} backButton />
      <View style={styles.TopView}>
        {Object.entries(getUserDataDetails).map((item, index) => {
          if (['height', 'weight', 'age'].includes(item[0])) {
            return (
              <TouchableOpacity
                key={index}
                style={styles.View1}
                onPress={() => {
                  navigation.navigate('Yourself', {id: item[1], type: item[0]});
                }}>
                <Text style={styles.txt1}>
                  {item[1] == null ? 'No Data' : item[1]}
                </Text>
                <Text style={styles.txt2}>{item[0]}</Text>
              </TouchableOpacity>
            );
          }
          return null;
        })}
      </View>
      <View style={{flexDirection: 'column-reverse'}}>
        {Object.entries(getUserDataDetails).map((item, index) => {
          if (
            !['height', 'weight', 'age'].includes(item[0]) &&
            !['id', 'email', 'name', 'image', 'gender', 'image_path'].includes(
              item[0],
            )
          ) {
            return (
              <TouchableOpacity
                key={index}
                style={styles.middleView}
                onPress={() => {
                  selectedID(item.id);
                  navigation.navigate('Yourself', {id: item.SC});
                }}>
                <Text style={[styles.txt2, {textTransform: 'capitalize'}]}>
                  {item[0]?.replace('_', ' ')}
                </Text>
                <Text style={styles.txt1}>
                  {item[1] == null ? 'No Data' : item[1]}
                </Text>
              </TouchableOpacity>
            );
          }
          return null;
        })}
      </View>
      <View style={styles.buttonView}>
        <Button buttonText={'Save'} />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: AppColor.BACKGROUNG,
  },
  TopView: {
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    marginVertical: DeviceHeigth * 0.015,
    // borderWidth: 1,
  },
  View1: {
    backgroundColor: AppColor.WHITE,
    marginHorizontal: DeviceWidth * 0.06,
    marginVertical: DeviceHeigth * 0.02,
    paddingHorizontal: DeviceWidth * 0.05,
    paddingVertical: DeviceWidth * 0.03,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txt1: {
    color: AppColor.RED,
    fontFamily: 'Poppins-Medium',
    fontWeight: '400',
  },
  txt2: {
    color: AppColor.ProfileTextColor,
    fontFamily: 'Poppins-Regular',
  },
  middleView: {
    flexDirection: 'row',
    backgroundColor: AppColor.WHITE,
    marginHorizontal: DeviceWidth * 0.06,
    borderRadius: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: DeviceHeigth * 0.01,
    paddingVertical: DeviceWidth * 0.06,
    paddingHorizontal: DeviceWidth * 0.05,
  },
  buttonView: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: DeviceHeigth * 0.08,
  },
  noDataView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  NodataText: {
    color: AppColor.BLACK,
    fontSize: 18,
  },
});
export default NewPersonalDetails;
