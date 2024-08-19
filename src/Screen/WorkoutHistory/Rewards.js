import {View, Text, StyleSheet, Image} from 'react-native';
import React from 'react';
import {DeviceWidth} from '../../Component/Config';
import {AppColor} from '../../Component/Color';
import {localImage} from '../../Component/Image';
import {Platform} from 'react-native';

const Rewards = ({data}) => {
  const Cards = ({
    marginLeft,
    img1,
    img2,
    txt1,
    txt2,
    txt3,
    count,
    alingItems,
    countColor,
  }) => {
    return (
      <View style={[styles.card2, {marginLeft: marginLeft ?? 0}]}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image source={img1} style={{height: 35, width: 35}} />
          <View style={{marginLeft: 6}}>
            <Text
              style={{
                color: AppColor.GRAAY6,
                fontFamily: 'Helvetica',
                lineHeight: 23,
              }}>
              {txt1}
            </Text>
            <Text
              style={[
                styles.txt4,
                {color: countColor},
              ]}>{`${txt2}=${txt3}pts`}</Text>
          </View>
        </View>
        <View
          style={{flexDirection: 'row', alignItems: 'center', marginRight: 4}}>
          <Image
            source={img2}
            style={{height: 20, width: 20, marginRight: 3}}
            resizeMode="contain"
          />
          <Text style={{color: countColor}}>{count}</Text>
        </View>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <Text style={styles.txt1}>Refer Rewards</Text>
      <View style={styles.card1}>
        <Image
          source={localImage.starCorner}
          style={styles.img1}
          resizeMode="stretch"
        />
        <View style={{marginVertical: 18, flexDirection: 'row'}}>
          <Image
            source={localImage.gift_icon}
            style={{height: 80, width: 80, marginLeft: 16}}
            resizeMode="contain"
          />
          <View style={{marginLeft: 8, marginTop: 10}}>
            <Text style={styles.txt2}>My total rewards</Text>
            <Text style={styles.txt3}>{`${
              data?.total_points ?? -1
            } total points`}</Text>
          </View>
        </View>
      </View>
      <View style={{flexDirection: 'row', alignSelf: 'center'}}>
        <Cards
          img1={localImage.person_profile}
          img2={localImage.persons}
          txt1={'Successful\nRegistration'}
          txt2={'1 Sent'}
          txt3={" +2"}
          count={`${data?.reffered}`}
          countColor={AppColor.NAVY_BLUE}
        />
        <Cards
          marginLeft={16}
          img1={localImage.calender_icon}
          img2={localImage.person_plus}
          txt1={'Event joined'}
          txt2={'1 Join'}
          txt3={' +5'}
          count={data?.joined ?? -1}
          alingItems={'center'}
          countColor={AppColor.ORANGE}
        />
      </View>
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
  card1: {
    marginTop: 15,
    width: DeviceWidth * 0.9,
    justifyContent: 'center',
    backgroundColor: AppColor.PINK1,
    borderRadius: 12,
    alignSelf: 'center',
    overflow: 'hidden',
  },
  img1: {
    height: '100%',
    width: DeviceWidth * 0.3,
    position: 'absolute',
    right: 0,
  },
  txt2: {
    color: AppColor.WHITE,
    fontFamily: 'Helvetica',
    fontSize: 16,
  },
  txt3: {
    color: AppColor.WHITE,
    fontFamily: 'Helvetica-Bold',
    fontSize: 14,
  },
  card2: {
    flexDirection: 'row',
    marginTop: 20,
    paddingVertical: 10,
    width: DeviceWidth / 2.35,
    backgroundColor: AppColor.WHITE,
    justifyContent: 'space-between',
    borderRadius: 14,
    ...Platform.select({
      android: {elevation: 3},
      ios: {
        shadowColor: '#000000',
        shadowOpacity: 0.3,
        shadowOffset: {height: 5, width: 0},
        shadowRadius: 20,
      },
    }),
  },
  txt4: {
    fontFamily: 'Helvetica',
    color: AppColor.ORANGE,
    lineHeight: 22.5,
    fontSize: 13,
  },
});
export default Rewards;
