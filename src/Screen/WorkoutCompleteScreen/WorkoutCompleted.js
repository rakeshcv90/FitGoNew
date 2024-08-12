import {View, Text, StyleSheet, StatusBar} from 'react-native';
import React, {useEffect} from 'react';
import {AppColor} from '../../Component/Color';
import NewHeader from '../../Component/Headers/NewHeader';
import {Image} from 'react-native';
import {localImage} from '../../Component/Image';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import WorkoutCard from './WorkoutCard';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const WorkoutCompleted = () => {
  const streakCardOffset = useSharedValue(0);
  const cardioCardOffset = useSharedValue(DeviceWidth);
  const breatheCardOffset = useSharedValue(DeviceWidth);
  const completeCardOffset = useSharedValue(DeviceWidth);
  useEffect(() => {
    let timeOut = setTimeout(() => {
      AnimationStart();
    }, 2000);
    return () => clearTimeout(timeOut);
  }, []);
  const AnimationStart = () => {
    streakCardOffset.value = withTiming(-DeviceWidth, {duration: 500}, () => {
      cardioCardOffset.value = withSpring(0);
    });
  };
  const streakAnimation = useAnimatedStyle(() => {
    return {
      transform: [{translateX: streakCardOffset.value}],
    };
  });
  const cardioAnimation = useAnimatedStyle(() => {
    return {
      transform: [{translateX: cardioCardOffset.value}],
    };
  });
  const breatheAnimation = useAnimatedStyle(() => {
    return {
      transform: [{translateX: breatheCardOffset.value}],
    };
  });
  const completeAnimation = useAnimatedStyle(() => {
    return {
      transform: [{translateX: completeCardOffset.value}],
    };
  });
  const handleCardioButton = () => {
    cardioCardOffset.value=withTiming(-DeviceWidth,{duration:500},()=>{
        breatheCardOffset.value = withSpring(0);
    })

  };
  const handleBreatheButton=()=>{
    breatheCardOffset.value=withTiming(-DeviceWidth,{duration:500},()=>{
        completeCardOffset.value=withSpring(0)
    })
  }
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={AppColor.GRAY} barStyle={'dark-content'} />
      <NewHeader backButton header={'Exercise Completed'} />
      <View style={{flex: 1}}>
        <Animated.View style={[styles.imgView, streakAnimation]}>
          <Image source={localImage.offer_girl} style={styles.imgStyle1} />
          <WorkoutCard cardType={'streak'} />
        </Animated.View>
        <Animated.View style={[styles.imgView, cardioAnimation]}>
          <Image source={localImage.cardioImage} style={styles.imgStyle1} />
          <WorkoutCard
            cardType={'cardio'}
            cardHeader={'Cardio Point'}
            onPress={()=>handleCardioButton()}
          />
        </Animated.View>
        <Animated.View style={[styles.imgView, breatheAnimation]}>
          <Image source={localImage.breahteImage} style={styles.imgStyle1} />
          <WorkoutCard cardType={'breathe'} cardHeader={'Breathe in & out'} onPress={()=>{handleBreatheButton()}}/>
        </Animated.View>
        <Animated.View style={[styles.imgView,completeAnimation ]}>
          <Image source={localImage.offer_girl} style={styles.imgStyle1} />
          <WorkoutCard cardType={'complete'} cardHeader={'Exercise Completed'} />
        </Animated.View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColor.GRAY,
  },
  imgView: {
    height: DeviceHeigth * 0.5,
    width: DeviceWidth * 0.95,
    alignSelf: 'center',
    marginBottom: 10,
    position: 'absolute',
  },
  imgStyle1: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
    marginBottom: 10,
  },
  cardHolder: {position: 'absolute', bottom: 15, alignSelf: 'center'},
});
export default WorkoutCompleted;
