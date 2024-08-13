import {View, Text, StyleSheet, Platform, Image} from 'react-native';
import React from 'react';
import {DeviceWidth} from '../../Component/Config';
import {AppColor} from '../../Component/Color';
import {localImage} from '../../Component/Image';

const Overview = ({data}) => {
  const TextComponent = ({t1, t2, color}) => {
    return (
      <View>
        <Text style={[styles.txt2, {fontSize: 18, color: AppColor.GRAAY6}]}>
          {t1}:
        </Text>
        <Text style={[styles.txt2, {fontSize: 18, color: color}]}>{t2}</Text>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <Text style={styles.txt1}>Overview</Text>
      <View style={styles.card1}>
        <Image
          source={localImage.cornerimg}
          style={styles.img1}
          resizeMode="stretch"
        />
        <View style={{flexDirection: 'row'}}>
          <Image
            source={localImage.calender}
            style={{height: 32, width: 25}}
            resizeMode="contain"
          />
          <View style={{marginLeft: 15}}>
            <Text style={styles.txt2}>{`${data?.day}, ${data?.time??""}`}</Text>
            <Text style={[styles.txt2, {fontSize: 15, color: AppColor.GRAAY6}]}>
              {data?.date=="Invalid date"?"--":data?.date}
            </Text>
          </View>
        </View>
        <View style={styles.card2}>
          <TextComponent
            t1={'Exercises'}
            t2={data?.exerciseCount ?? 0}
            color={AppColor.GREEN}
          />
          <TextComponent
            t1={'Missed'}
            t2={data?.missedExercise ?? 0}
            color={AppColor.RED}
          />
          <TextComponent
            t1={'Duration'}
            t2={`${isNaN(data?.duration) ? 0 : data?.duration}Min`}
            color={AppColor.YELLOW}
          />
        </View>
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
    width: DeviceWidth * 0.9,
    backgroundColor: AppColor.WHITE,
    alignSelf: 'center',
    borderRadius: 16,
    marginTop: 15,
    padding: 15,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOpacity: 0.3,
        shadowOffset: {height: 5, width: 0},
        shadowRadius: 20,
      },
      android: {
        elevation: 3,
        shadowColor: AppColor.NewGray,
      },
    }),
  },
  img1: {height: 100, width: '40%', right: 0, position: 'absolute'},
  txt2: {
    color: AppColor.BLACK,
    fontFamily: 'Helvetica',
    fontSize: 20,
  },
  card2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: DeviceWidth * 0.8,
    alignSelf: 'center',
    marginTop: 15,
    padding: 15,
    backgroundColor: AppColor.GRAY,
    borderRadius: 16,
  },
});
export default Overview;
