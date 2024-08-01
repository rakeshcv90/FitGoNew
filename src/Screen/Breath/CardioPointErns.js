import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  StatusBar,
  Platform,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import FitCoins from '../../Component/Utilities/FitCoins';
import {AppColor, Fonts} from '../../Component/Color';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import AnimatedLottieView from 'lottie-react-native';
import LinearGradient from 'react-native-linear-gradient';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {useSelector} from 'react-redux';

const CardioPointErns = () => {
  const fitCoins = useSelector(state => state.fitCoins);
  const getAllExercise = useSelector(state => state.getAllExercise);
  const [cardioExxercise, setCardioExercise] = useState([]);
  useEffect(() => {
    filterCardioExercise();
  }, []);
  const filterCardioExercise = () => {
    let exercises = getAllExercise?.filter(item => {
      return item?.exercise_bodypart == 'Cardio';
    });
    setCardioExercise(exercises)
  };
  return (
    <View style={[styles.container]}>
      <StatusBar barStyle={'default'} backgroundColor={'#7473e1'} />
      <LinearGradient
        colors={['#4348EE', '#9280F6']}
        style={[styles.container, {opacity: 0.8}]}
        start={{x: 1, y: 0}}
        end={{x: 2, y: 1}}>
        <AnimatedLottieView
          source={require('../../Icon/Images/CardioScreenImage/backgroung.json')}
          speed={1}
          autoPlay
          loop
          resizeMode="cover"
          style={{
            width: '100%',
            height: '100%',
          }}
        />
        <View style={{position: 'absolute', flex: 1, alignSelf: 'center'}}>
          <View
            style={{
              flex: 0.8,
              justifyContent: 'center',
              paddingTop: Platform.OS == 'ios' ? DeviceHeigth * 0.07 : 0,
            }}>
            <View
              style={{
                alignSelf: 'flex-end',
                marginRight: 16,
                marginVertical: 10,
                marginRight: -5,
              }}>
              <FitCoins coins={fitCoins > 0 ? fitCoins : 0} />
            </View>
          </View>
          <View
            style={{
              flex: 1.5,
              justifyContent: 'center',
              alignItems: 'center',

              marginVertical: 10,
            }}>
            <ImageBackground
              source={require('../../Icon/Images/CardioScreenImage/CardioBanner.png')}
              style={{
                width: DeviceWidth * 0.9,
                height: 80,
                alignSelf: 'center',
                marginVertical: 10,
              }}
              resizeMode="contain">
              <AnimatedLottieView
                source={require('../../Icon/Images/CardioScreenImage/watch.json')}
                speed={1}
                autoPlay
                loop
                resizeMode="cover"
                style={{
                  width: 80,
                  height: 80,
                  left: -DeviceWidth * 0.05,
                  top: -DeviceWidth * 0.1,
                }}
              />
            </ImageBackground>
          </View>
          <View style={{flex: 5.5}}>
            <AnimatedLottieView
              source={require('../../Icon/Images/CardioScreenImage/runing.json')}
              speed={1}
              autoPlay
              loop
              resizeMode="cover"
              style={{
                width: '100%',
                height: DeviceHeigth * 0.5,
                marginTop: -70,
              }}
            />
          </View>
          <View style={{flex: 2.2, flexDirection: 'column'}}>
            <TouchableOpacity
              onPress={() => {}}
              style={{
                width: DeviceWidth * 0.7,
                marginVertical: 10,
                alignSelf: 'center',
              }}>
              <Image
                source={require('../../Icon/Images/CardioScreenImage/CardioCoin.png')}
                style={{
                  width: DeviceWidth * 0.9,
                  height: DeviceHeigth * 0.08,
                  alignSelf: 'center',
                  marginVertical: 20,
                }}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
            
              }}
              style={{
                width: 268,
                height: 40,

                alignSelf: 'center',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: AppColor.WHITE,
                  fontWeight: '700',
                  lineHeight: 25,
                  fontSize: 20,
                  fontFamily: Fonts.MONTSERRAT_BOLD,
                }}>
                Skip
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#FDFDFD',
  },
});
export default CardioPointErns;
