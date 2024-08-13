import {View, Text, StyleSheet, Image} from 'react-native';
import React from 'react';
import {DeviceWidth} from '../../Component/Config';
import {AppColor} from '../../Component/Color';
import {localImage} from '../../Component/Image';

const ExtraWorkouts = ({icon,coins,border,txt}) => {
  return (
  
        <View
          style={{
            width: DeviceWidth * 0.9,
            alignSelf: 'center',
            marginTop: 15,
          }}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                source={icon}
                style={{height: 40, width: 40, marginRight: 8}}
                resizeMode="contain"
              />
              <Text style={styles.txt2}>{txt}</Text>
            </View>

            <View style={{flexDirection: 'row',alignItems:'center'}}>
              <Image
                source={localImage.FitCoin}
                style={{height: 25, width: 25}}
                resizeMode="contain"
              />
              <Text
                style={[
                  styles.txt2,
                  {
                    fontFamily: 'Helvetica-Bold',
                    fontSize: 20,
                    color: AppColor.NEW_GREEN,
                  },
                ]}>
              {coins??0}
              </Text>
            </View>
          </View>
          {border? <View style={styles.border} />:null} 
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    width: DeviceWidth,
    backgroundColor: AppColor.WHITE,
    paddingVertical: 15,
    marginBottom: 15,
  },
  txt1: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: AppColor.BLACK,
    alignSelf: 'center',
    width: DeviceWidth * 0.9,
  },
  txt2: {
    color: AppColor.BLACK,
    fontFamily: 'Helvetica',
    fontSize: 16,
  },
  txt3: {
    color: AppColor.GRAAY6,
    fontFamily: 'Helvetica',
  },
  border: {
    height: 0,
    width: DeviceWidth,
    borderWidth: 0.4,
    borderColor: AppColor.GRAY,
    marginVertical: 15,
  },
});
export default ExtraWorkouts;
