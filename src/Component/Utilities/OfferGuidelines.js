import {View, Text, StyleSheet, Image} from 'react-native';
import React from 'react';
import NewHeader from '../Headers/NewHeader';
import {AppColor, Fonts} from '../Color';
import DietPlanHeader from '../Headers/DietPlanHeader';
import {localImage} from '../Image';
import {DeviceHeigth, DeviceWidth} from '../Config';
import {TextInput} from 'react-native-paper';
import {MultipleBoxes, OfferBox} from './OfferBox';
import {ScrollView} from 'react-native-gesture-handler';

const OfferGuidelines = () => {
  const multipleData = [
    {
      id: 0,
      txt1: 'Next',
      txt2: 'if you move to next',
      coins: '-1',
    },
    {
      id: 1,
      txt1: 'Previous',
      txt2: 'if you repeat',
      coins: '-1',
    },
    {
      id: 2,
      txt1: 'Skip',
      txt2: 'if you skip the current',
      coins: '-1',
    },
  ];
  return (
    <View style={styles.Container}>
      <NewHeader header={'How To Earn ?'} backButton/>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.View1}>
          <Image
            source={localImage.Offer_Img}
            style={styles.img1}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.txt1}>Points</Text>
        <OfferBox heading={'Earn Coin'} headingColor={'#009B51'} coinColor={'#009B51'} subHeading={'Each day, Earn 50'}/>
        <MultipleBoxes arrayData={multipleData} heading={'Exercise'} headingColor={AppColor.RED}/>
        <OfferBox heading={'Days'} headingColor={AppColor.RED} coins={'-5'} subHeading={'Per day miss'}/>
        <OfferBox heading={'Time'} headingColor={AppColor.RED} coins={'-1'} subHeading={'Per hour miss'}/>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: AppColor.WHITE,
  },
  View1: {
    width: DeviceWidth,
    height: DeviceHeigth * 0.33,
  },
  txt1: {
    color: AppColor.BLACK,
    fontFamily: 'Helvetica-Bold',
    fontSize: 16,
    marginLeft: 18,
    marginBottom: 14,
  },
  img1: {
    width: '80%',
    height: '100%',
    alignSelf: 'center',
  },
});
export default OfferGuidelines;
