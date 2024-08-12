import {View, Text, StyleSheet, Platform} from 'react-native';
import React from 'react';
import {AppColor} from '../../Component/Color';
import {DeviceWidth} from '../../Component/Config';
import {FlatList} from 'react-native';
import {Image} from 'react-native';
import {localImage} from '../../Component/Image';

const SingleWorkout = () => {
  const renderItem = ({item, index}) => {
    return (
      <View style={[styles.card, {marginRight: index == 4 ? 20 : 0}]}>
        <View style={styles.imgContainer}></View>
        <Text style={styles.txt2}>Push-Ups</Text>
        <View style={styles.view2}>
          <Image
            source={localImage.FitCoin}
            style={{height: 25, width: 30}}
            resizeMode="contain"
          />
          <Text>+2 Points</Text>
        </View>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <Text style={styles.txt1}>Single Workout</Text>
      <FlatList
        showsHorizontalScrollIndicator={false}
        horizontal
        data={Array.from({length: 5})}
        renderItem={renderItem}
        contentContainerStyle={{marginLeft: 10}}
      />
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
    marginBottom: 15,
  },
  txt2: {
    textAlign: 'center',
    fontFamily: 'Helvetica',
    color: AppColor.BLACK,
    marginVertical: 10,
  },
  card: {
    width: DeviceWidth / 3.4,
    borderWidth: 0.7,
    borderRadius: 16,
    marginHorizontal: 10,
    backgroundColor: AppColor.WHITE,
    borderColor: AppColor.GRAY,
  },
  imgContainer: {
    height: 70,
    width: 70,
    backgroundColor: AppColor.SKY_BLUE,
    borderRadius: 25,
    alignSelf: 'center',
    marginTop: 15,
  },
  view2: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 10,
  },
});
export default SingleWorkout;
