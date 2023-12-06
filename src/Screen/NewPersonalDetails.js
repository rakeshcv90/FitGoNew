import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import NewHeader from '../Component/Headers/NewHeader';
import {AppColor} from '../Component/Color';
import {DeviceHeigth, DeviceWidth} from '../Component/Config';
import Button from '../Component/Button';
import Goal from '../Screen/Yourself/Goal';
import {useDispatch, useSelector} from 'react-redux';
import Index from '../Screen/Yourself/Index';
const NewPersonalDetails = ({route, navigation}) => {
  const data1 = [
    {
      id: 1,
      text1: '180cm',
      text2: 'Height',
      SC: 4,
    },
    {
      id: 2,
      text1: '57Kg',
      text2: 'Weight',
      SC: 3,
    },
    {
      id: 3,
      text1: '33yrs',
      text2: 'Age',
      SC: 5,
    },
    {
      id: 4,
      text1: 'target Area',
      text2: 'Legs,Shoulder & Back',
      SC: 6,
    },
    {
      id: 5,
      text1: 'Fitness level',
      text2: 'Intermediate',
      SC: 2,
    },
    {
      id: 6,
      text1: 'Goal',
      text2: 'Build muscle',
      SC: 1,
    },
  ];
  const txtData = [
    {
      id: 1,
      txt1: 'Upate your goal here!',
    },
  ];
  const firstViewData = data1.slice(0, 3);
  const secondViewData = data1.slice(3);
  const ScreenTitle = route?.params?.title;
  const [SId, setSId] = useState();
  const selectedID = ID => {
    setSId(ID);
    // console.log(ID);
  };

  return (
    <View style={styles.Container}>
      <NewHeader header={'Personal Details'} backButton />
      <View style={styles.TopView}>
        {firstViewData.map((value, index) => (
          <TouchableOpacity
            key={index}
            style={styles.View1}
            onPress={() => {
              //   selectedID(value.id);
              navigation.navigate('Yourself', {id: value.SC});
            }}>
            <Text style={styles.txt1}>{value.text1}</Text>
            <Text style={styles.txt2}>{value.text2}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {secondViewData.map((value, index) => (
        <TouchableOpacity
          key={index}
          style={styles.middleView}
          onPress={() => {
            selectedID(value.id);
            navigation.navigate('Yourself', {id: value.SC});
          }}>
          <Text style={styles.txt2}>{value.text1}</Text>
          <Text style={[styles.txt1, {width: DeviceWidth * 0.3}]}>
            {value.text2}
          </Text>
        </TouchableOpacity>
      ))}
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
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: DeviceHeigth * 0.015,
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
});
export default NewPersonalDetails;
