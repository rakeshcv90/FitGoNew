import {View, Text, StyleSheet, Image} from 'react-native';
import React from 'react';
import NewHeader from '../Headers/NewHeader';
import {AppColor} from '../Color';
import DietPlanHeader from '../Headers/DietPlanHeader';
import {localImage} from '../Image';
import {DeviceHeigth, DeviceWidth} from '../Config';

const OfferGuidelines = () => {
  return (
    <View style={styles.Container}>
      <DietPlanHeader header={'How to Earn'} />
      <View style={{width: DeviceWidth, height: DeviceHeigth * 0.33,borderWidth:1}}>
        <Image
          source={localImage.Offer_Img}
          style={{width: '80%', height: '100%',alignSelf:'center'}}
          resizeMode="contain"
        />
      </View>
      <Text>Points</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: AppColor.WHITE,
  },
});
export default OfferGuidelines;
