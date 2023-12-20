import {View, Text, StyleSheet, StatusBar, Image} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native';
import {AppColor} from '../../Component/Color';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import {localImage} from '../../Component/Image';
import {
  Stop,
  Svg,
  Text as SvgText,
  LinearGradient as SvgGrad,
} from 'react-native-svg';

const GradientText = ({item}) => {
  const gradientColors = ['#D01818', '#941000'];

  return (
    <View
      style={{
        marginTop: 20,
        marginLeft: DeviceWidth * 0.03,
        justifyContent: 'center',
      }}>
      <Svg height="40" width={DeviceWidth * 0.9}>
        <SvgGrad id="grad" x1="0" y1="0" x2="100%" y2="0">
          <Stop offset="0" stopColor={gradientColors[0]} />
          <Stop offset="1" stopColor={gradientColors[1]} />
        </SvgGrad>
        <SvgText
          fontFamily="Poppins"
          fontWeight={'600'}
          fontSize={23}
          fill="url(#grad)"
          x="10"
          y="25">
          {item}
        </SvgText>
      </Svg>
    </View>
  );
};
const Home = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />
      <View style={styles.profileView}>
        <View style={styles.rewardView}>
          <Image
            source={localImage.Money}
            style={[
              styles.img,
              {
                height: 30,
                width: 30,
              },
            ]}
            resizeMode="cover"></Image>
          <Text style={styles.monetText}>500</Text>
        </View>
        <View style={styles.profileView1}>
          <Image
            source={localImage.avt}
            style={styles.img}
            resizeMode="cover"></Image>
        </View>
      </View>
      <GradientText item={'Good Morning, Jane'} />
      <View style={styles.CardBox}>
        <Text style={styles.healthText}>Health Overview</Text>
        <View style={styles.healthView}>
          <View style={styles.stepView}>
            <Text style={styles.healthText1}>Steps</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                source={localImage.Money}
                style={[
                  styles.img,
                  {
                    height: 30,
                    width: 30,
                  },
                ]}
                resizeMode="cover"></Image>
              <Text style={[styles.monetText, {color: '#5FB67B'}]}>
                2215
                <Text style={[styles.monetText, {color: '#505050'}]}>
                  /5000 steps
                </Text>
              </Text>
            </View>
            <Text style={styles.healthText1}>Distance</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                source={localImage.Money}
                style={[
                  styles.img,
                  {
                    height: 30,
                    width: 30,
                  },
                ]}
                resizeMode="cover"></Image>
              <Text style={[styles.monetText, {color: '#FCBB1D'}]}>
                2215
                <Text style={[styles.monetText, {color: '#505050'}]}>
                  /5000 steps
                </Text>
              </Text>
            </View>
            <Text style={styles.healthText1}>Calories</Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingBottom: 10,
              }}>
              <Image
                source={localImage.Money}
                style={[
                  styles.img,
                  {
                    height: 30,
                    width: 30,
                  },
                ]}
                resizeMode="cover"></Image>
              <Text style={[styles.monetText, {color: '#D01818'}]}>
                2215
                <Text style={[styles.monetText, {color: '#505050'}]}>
                  /5000 steps
                </Text>
              </Text>
            </View>
          </View>
          <View style={styles.stepImageView}></View>
        </View>
      </View>
    </SafeAreaView>
  );
};
var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColor.WHITE,
  },
  profileView: {
    flexDirection: 'row',
    width: '95%',
    justifyContent: 'space-between',
    height: DeviceHeigth * 0.06,
    alignItems: 'center',
    top: DeviceHeigth * 0.02,
  },
  profileView1: {
    height: 50,
    width: 50,
    borderRadius: 100 / 2,
  },
  img: {
    height: 50,
    width: 50,
    borderRadius: 100 / 2,
  },
  rewardView: {
    height: 40,
    width: 80,
    borderRadius: 30,
    borderColor: AppColor.RED,
    borderWidth: 1,
    marginLeft: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 5,
  },
  monetText: {
    fontSize: 10,
    fontWeight: '500',
    lineHeight: 15,
    fontFamily: 'Poppins',
    marginLeft: 10,
  },
  CardBox: {
    width: '95%',
    alignSelf: 'center',
    backgroundColor: 'white',
    top: DeviceHeigth * 0.02,
    borderRadius: 10,
    paddingBottom: DeviceHeigth * 0.04,
    paddingTop: DeviceWidth * 0.03,
    paddingLeft: DeviceWidth * 0.05,

    shadowColor: 'rgba(0, 0, 0, 1)',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  healthText: {
    fontFamily: 'Poppins',
    fontWeight: '500',
    lineHeight: 18,
    fontSize: 14,
    color: '#505050',
  },
  healthView: {
    flexDirection: 'row',
  },
  stepView: {
    height: DeviceHeigth * 0.2,
    width: '55%',
  },
  stepImageView: {
    height: DeviceHeigth * 0.2,
    backgroundColor: 'red',
    width: '40%',
  },
  healthText1: {
    fontFamily: 'Poppins',
    fontWeight: '500',
    lineHeight: 15,
    fontSize: 12,
    color: '#505050',
    marginVertical: DeviceHeigth * 0.01,
  },
});
export default Home;
