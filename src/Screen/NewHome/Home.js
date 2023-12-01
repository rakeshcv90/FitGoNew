import {
  View,
  Text,
  SafeAreaView,
  Image,
  ImageBackground,
  ScrollView,
} from 'react-native';
import React from 'react';
import {StyleSheet} from 'react-native';
import {AppColor} from '../../Component/Color';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import {localImage} from '../../Component/Image';
import Calories from '../../Component/Calories';
import { HeadlessJsTaskContext } from '@react-native-community/headless-js-task';
import {AppRegistry} from 'react-native';

const Home = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        keyboardDismissMode="interactive"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{flexGrow: 1}}
        keyboardShouldPersistTaps="handled">
        <ImageBackground
          source={localImage.CARD}
          style={styles.card}
          resizeMode="contain">
          <View style={styles.cardheader}>
            <Image
              source={localImage.avt}
              style={styles.profileImage}
              resizeMode="contain"
            />
            <View style={styles.textcontainer}>
              <Text style={styles.nameText}>Hello, Good Morning</Text>
              <Text style={styles.subText}>Jamie !</Text>
            </View>
            <Image
              source={localImage.BELL}
              style={styles.bellImage}
              resizeMode="contain"
            />
          </View>
          <View style={styles.circle} />
        </ImageBackground>
        <View style={styles.dailyContainer}>
          <Text style={styles.dailyText}>Daily progress</Text>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Calories backgroundColor={'#FFF6E0'} />
            <Calories backgroundColor={'#EFF0FF'} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColor.WHITE,
  },
  card: {
    height: DeviceHeigth * 0.2,
    alignSelf: 'center',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 120 / 2,
    // overflow: 'hidden',
    left: -40,
    top: DeviceHeigth * 0.01,
  },
  cardheader: {
    top: DeviceHeigth * 0.02,
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: 50,
  },
  textcontainer: {
    left: -30,
    top: DeviceHeigth * 0.01,
  },
  nameText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    fontWeight: '500',
    color: AppColor.INPUTLABLECOLOR,
    lineHeight: 18,
  },
  subText: {
    fontSize: 20,
    fontFamily: 'Verdana',
    fontWeight: '400',
    color: AppColor.LITELTEXTCOLOR,
    lineHeight: 24,
  },
  bellImage: {
    width: 30,
    height: 30,
    right: -DeviceWidth * 0.1,
    top: -DeviceHeigth * 0.05,
  },
  circle: {
    width: 7,
    height: 7,
    backgroundColor: '#B0C929',
    borderRadius: 5.5 / 2,
    position: 'absolute',
    right: DeviceWidth * 0.04,
    top: DeviceHeigth * 0.03,
  },
  dailyContainer: {
    top: DeviceHeigth * 0.03,
    marginHorizontal: DeviceWidth * 0.04,
  },
  dailyText: {
    fontSize: 20,
    fontFamily: 'Verdana',
    fontWeight: '700',
    color: AppColor.LITELTEXTCOLOR,
    lineHeight: 24,
  },
});
export default Home;
Home.taskName = 'Home';
AppRegistry.registerHeadlessTask('Home', () => Home);