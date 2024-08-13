import {View, Text, StyleSheet, Image} from 'react-native';
import React from 'react';
import {AppColor} from '../../Component/Color';
import {DeviceWidth} from '../../Component/Config';
import {localImage} from '../../Component/Image';
const PointDeduction = ({border, icon, text1, text2, coins}) => {
  return (
    <View style={styles.container}>
      <View
        style={{flexDirection: 'row', alignItems: 'center',}}>
        <Image
          source={icon}
          style={{height: 60, width: 60}}
          resizeMode="contain"
        />
        <View style={{width: DeviceWidth * 0.6, marginLeft: 10}}>
          <Text style={styles.txt2}>{text1}</Text>
          <Text style={styles.txt3}>{text2}</Text>
        </View>
      </View>

      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Image
          source={localImage.FitCoin}
          style={{height: 30, width: 30}}
          resizeMode="contain"
        />
        <Text
          style={{
            color: AppColor.RED,
            fontSize: 20,
            fontFamily: 'Helvetica-Bold',
          }}>{`-${coins ?? 1}`}</Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    width: DeviceWidth * 0.9,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  txt2: {
    color: AppColor.BLACK,
    fontFamily: 'Helvetica',
    fontSize: 16,
    width: DeviceWidth * 0.6,
  },
  txt3: {
    color: AppColor.GRAAY6,
    fontFamily: 'Helvetica',
    width: DeviceWidth * 0.6,
  },
  border: {
    height: 0,
    width: DeviceWidth,
    borderWidth: 0.4,
    borderColor: AppColor.GRAY,
    marginVertical: 15,
  },
});
export default PointDeduction;
