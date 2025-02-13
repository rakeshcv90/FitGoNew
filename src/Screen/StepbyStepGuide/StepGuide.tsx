import {
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {AppColor, Fonts} from '../../Component/Color';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../Component/Config';
import {localImage} from '../../Component/Image';
import FitText from '../../Component/Utilities/FitText';
import {StepsArray, StepsArrayType} from './StepsArray';
import GradientButton from '../../Component/GradientButton';
import {useSelector} from 'react-redux';
import {RequestAPI} from '../../Component/Utilities/RequestAPI';
import VersionNumber from 'react-native-version-number';
import FitIcon from '../../Component/Utilities/FitIcon';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AnalyticsConsole} from '../../Component/AnalyticsConsole';
import WithoutEvent from '../../Component/NewHomeUtilities/WithoutEvent';
import {ArrowLeft} from '../../Component/Utilities/Arrows/Arrow';
type StepItem = {
  item: StepsArrayType;
  index: number;
};
const IPAD_HEIGHT = DeviceHeigth >= 1024;
const SMALL_SCREEN_HEIGHT = DeviceHeigth <= 640;
const PIXEL_HEIGHT = DeviceHeigth <= 808;
const StepItems = ({item, index}: StepItem) => {
  const odd = (index + 1) % 2;

  return (
    <View
      style={{
        flexDirection: odd ? 'row' : 'row-reverse',
        // justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginTop: 20,
        marginBottom: index + 1 == StepsArray.length ? 0 : 20,
        // backgroundColor: 'red',
        paddingHorizontal: 10,
      }}>
      <Image
        source={item.image}
        resizeMode="contain"
        style={{
          width: IPAD_HEIGHT ? '50%' : '30%',
          height: IPAD_HEIGHT ? 225 : 100,
          marginLeft: IPAD_HEIGHT ? -50 : odd && index > 3 ? -10 : 0,
          marginRight: odd ? 10 : 0,
          // backgroundColor: 'red',
        }}
      />
      <View
        style={{
          width: IPAD_HEIGHT ? '50%' : '70%',
          marginTop: IPAD_HEIGHT ? -50 : -10,
        }}>
        <FitText
          type="Heading"
          value={`${index + 1}. ${item.heading}`}
          color={AppColor.BLACK}
          lineHeight={IPAD_HEIGHT ? 40 : 30}
          fontWeight="600"
          fontSize={IPAD_HEIGHT ? 25 : 20}
        />
        <FitText
          type="normal"
          value={item.text}
          color={AppColor.BLACK}
          fontFamily={Fonts.MONTSERRAT_REGULAR}
          fontWeight="500"
          fontSize={IPAD_HEIGHT ? 16 : 14}>
          <FitText
            type="normal"
            value={item.bold}
            color={AppColor.BLACK}
            fontFamily={Fonts.MONTSERRAT_REGULAR}
            fontWeight="bold"
            fontSize={IPAD_HEIGHT ? 16 : 14}
          />
        </FitText>
      </View>
    </View>
  );
};

const HeartCom = () => (
  <Image
    source={localImage.StepHealth}
    resizeMode="contain"
    style={{
      width: '60%',
      alignSelf: 'center',
      marginVertical: IPAD_HEIGHT ? 10 : 0,
    }}
  />
);

const StepGuide = ({navigation}: any) => {
  const getPastWinner = useSelector((state: any) => state.getPastWinners);
  const enteredCurrentEvent = useSelector((state: any) => state.enteredCurrentEvent);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={AppColor.RED} barStyle={'light-content'} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{width: '100%', alignSelf: 'center'}}>
        <TouchableOpacity
          onPress={() => navigation?.goBack()}
          style={{
            position: 'absolute',
            top: (DeviceWidth * 0.1) / 2,
            zIndex: 1,
            marginLeft: 20,
          }}>
          <ArrowLeft fillColor={AppColor.WHITE} />
        </TouchableOpacity>
        <View style={styles.topBox}>
          <Image
            source={localImage.StepGuidHead}
            resizeMode="contain"
            style={{
              width: '60%',
              height: '50%',
              marginBottom: 40,
              alignSelf: 'center',
            }}
          />
        </View>
        <View style={styles.mainBox}>
          <FitText
            type="Heading"
            value="Step-by-Step Guide"
            textAlign="center"
          />
          <HeartCom />
          <FitText
            type="SubHeading"
            value="Join the challenge & earn your way to"
            textAlign="center"
          />
          <FitText
            type="SubHeading"
            value="WIN BIG!"
            textAlign="center"
            fontWeight="bold"
          />
          <View style={{width: '95%', alignSelf: 'center', marginTop: 20}}>
            {StepsArray.map((item: StepsArrayType, index: number) => (
              <StepItems item={item} index={index} />
            ))}
            {/* <FitText
              type="Heading"
              value="Unleash your Fitness Star"
              textAlign="center"
            /> */}
            <HeartCom />
            {/* <FitText
              type="normal"
              value="Win prizes worth of"
              textAlign="center"
            />
            <FitText
              type="Heading"
              value="₹1000"
              textAlign="center"
              fontSize={70}
              lineHeight={100}
            />
            <View style={styles.yellowContainer}>
              <View style={{width: '55%', alignItems: 'flex-start'}}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <FitText type="normal" value="Position" />
                  <View
                    style={{
                      width: IPAD_HEIGHT ? 30 : 20,
                      height: IPAD_HEIGHT ? 30 : 20,
                      borderRadius: 15,
                      backgroundColor: AppColor.WHITE,
                      borderWidth: 1,
                      borderColor: '#E0B016',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginLeft: 10,
                    }}>
                    <FitText type="normal" value="1" />
                  </View>
                </View>

                <FitText
                  type="Heading"
                  value="Win ₹1000"
                  fontSize={IPAD_HEIGHT ? 50 : PIXEL_HEIGHT ? 30 : 35}
                  lineHeight={IPAD_HEIGHT ? 60 : PIXEL_HEIGHT ? 50 : 50}
                />
                <FitText
                  type="normal"
                  value="Per week without missing the streak"
                />
              </View>
              <View style={{width: '60%', height: DeviceHeigth * 0.15}}>
                <Image
                  source={localImage.StepTrophy}
                  resizeMode="contain"
                  style={{
                    width: '100%',
                    height: DeviceHeigth * 0.22,
                    top: IPAD_HEIGHT ? -72 : -56,
                    overflow: 'hidden',
                  }}
                />
              </View>
            </View> */}
            <FitText type="Heading" value="Event Winners" />
            <WithoutEvent pastWinners={getPastWinner} pV={0} noText />
            {/* <FitText
              type="SubHeading"
              value="Terms & Conditions"
              marginVertical={10}
              onPress={() => {
                navigation.navigate('TermaAndCondition', {
                  title: 'Terms & Conditions',
                });
              }}
              textAlign="center"
              textDecorationLine="underline"
            /> */}
          </View>
        </View>
      </ScrollView>
      <View style={styles.btmButton}>
        <GradientButton
          text="Join Challenge"
          colors={['#F0013B', '#F0013B']}
          bR={10}
          h={50}
          onPress={() => {
            AnalyticsConsole('STEP_Sub');
            if (enteredCurrentEvent) {
              navigation.navigate('UpcomingEvent', {
                eventType: 'upcoming',
              });
            } else {
              navigation?.navigate('NewSubscription', {upgrade: true});
            }
          }}
          alignSelf
        />
      </View>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          navigation.navigate('Questions');
        }}
        style={{
          //
          width: 120,
          height: 56,
          backgroundColor: '#F7F7F7',
          flexDirection: 'row',
          position: 'absolute',

          bottom: 90,
          right: 15,
          borderRadius: 16,
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: 'rgba(0, 0, 0, 1)',
          ...Platform.select({
            ios: {
              shadowColor: 'rgba(0, 0, 0, 1)',
              shadowOffset: {width: 0, height: 2},
              shadowOpacity: 0.3,
              shadowRadius: 3,
            },
            android: {
              elevation: 4,
            },
          }),
        }}>
        <Image
          source={require('../../Icon/Images/InAppRewards/FAQ.png')}
          style={{height: 25, width: 25, marginRight: 5}}
          resizeMode="contain"
        />
        <Text
          style={{
            fontFamily: Fonts.HELVETICA_BOLD,
            fontSize: 16,
            lineHeight: 30,
            color: AppColor.RED,
          }}>
          FAQs
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default StepGuide;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColor.WHITE,
  },
  topBox: {
    height: DeviceHeigth / 3,
    backgroundColor: AppColor.RED,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainBox: {
    flex: 1,
    width: '100%',
    paddingTop: 20,
    backgroundColor: AppColor.WHITE,
    top: -50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 50,
  },
  btmButton: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    padding: 10,
    backgroundColor: AppColor.WHITE,
  },
  yellowContainer: {
    width: '100%',
    borderRadius: 10,
    alignSelf: 'center',
    borderWidth: 5,
    borderColor: AppColor.DARK_YELLOW,
    backgroundColor: AppColor.LIGHT_YELLOW,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 0,
    marginVertical: DeviceWidth * 0.05,
  },
  greyContainer: {
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D1D1',
    backgroundColor: '#E9ECEF',
    padding: 5,
    alignItems: 'center',
    width: '30%',
  },
  mainImage: {
    borderRadius: 30,
    height: 60,
    width: 60,
  },
  mainImage1: {
    borderRadius: 30,
    height: 50,
    width: 50,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 10,
  },
  image: {
    height: 60,
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
