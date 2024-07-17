import {View, Text, StyleSheet, Image} from 'react-native';
import React from 'react';
import {DeviceWidth} from '../Config';
import {localImage} from '../Image';
import {AppColor, Fonts} from '../Color';

export const OfferBox = ({
  headingColor,
  heading,
  subHeading,
  coins,
  coinColor,
}) => {
  return (
    <View style={styles.boxes}>
      <View style={styles.headingContainer}>
        <Text style={[styles.heading, {color: headingColor ?? AppColor.BLACK}]}>
          {heading ?? 'hello'}
        </Text>
      </View>
      <View style={styles.view1}>
        <Text style={styles.txt1}>{subHeading ?? 'Each day,Earn 50'}</Text>
        <View style={styles.view2}>
          <Image
            source={localImage.FitCoin}
            style={styles.img1}
            resizeMode="contain"
          />
          <Text style={[styles.txt2, {color: coinColor ?? AppColor.RED}]}>
            {coins ?? '+50'}
          </Text>
        </View>
      </View>
    </View>
  );
};
export const MultipleBoxes = ({
  arrayData,
  headingColor,
  heading,
  coinColor,
}) => {
  return (
    <View style={styles.boxes}>
      <View style={styles.headingContainer}>
        <Text style={[styles.heading, {color: headingColor ?? AppColor.BLACK}]}>
          {heading ?? 'hello'}
        </Text>
      </View>
      {arrayData &&
        arrayData.map((v, i) => (
          <>
            <View style={styles.view1}>
              <Text style={styles.txt1}>
                {v?.txt1 ?? 'Each day, Earn 50 '}
                <Text style={{color: AppColor.Gray5}}>{` (${v.txt2})`}</Text>
              </Text>
              <View style={styles.view2}>
                <Image
                  source={localImage.FitCoin}
                  style={styles.img1}
                  resizeMode="contain"
                />
                <Text style={[styles.txt2, {color: coinColor ?? AppColor.RED}]}>
                  {v.coins ?? v.coins}
                </Text>
              </View>
            </View>
            {i < arrayData.length - 1 && (
              <View style={{borderWidth: 0.3, borderColor: AppColor.Gray5}} />
            )}
          </>
        ))}
    </View>
  );
};
const styles = StyleSheet.create({
  boxes: {
    width: DeviceWidth * 0.9,
    borderWidth: 0.7,
    borderRadius: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  headingContainer: {
    position: 'absolute',
    top: -12,
    left: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 5,
  },
  heading: {
    fontSize: 14,
    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
  },
  view1: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 12,
  },
  view2: {flexDirection: 'row', alignItems: 'center'},
  img1: {height: 25, width: 25},
  txt1: {
    fontFamily: Fonts.MONTSERRAT_BOLD,
    color: AppColor.BLACK,
  },
  txt2: {
    fontFamily: Fonts.MONTSERRAT_BOLD,
    width: DeviceWidth * 0.1,
    textAlign: 'right',
  },
});
