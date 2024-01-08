import {View, Text} from 'react-native';
import React from 'react';
import NewHeader from '../../Component/Headers/NewHeader';
import {StatusBar} from 'react-native';
import {StyleSheet} from 'react-native';
import {AppColor} from '../../Component/Color';
import AnimatedLottieView from 'lottie-react-native';
import {DeviceHeigth} from '../../Component/Config';
import Button from '../../Component/Button';

const Trainer = ({navigation}) => {
  return (
    <View style={styles.container}>
      <NewHeader header={'  Fitness Coach'} />

      <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <AnimatedLottieView
          source={require('../../Icon/Images/NewImage/ChatBoot.json')}
          speed={3}
          autoPlay
          loop
          style={{
            width: 300,
            height: 300,
            top: -70,
          }}
        />
      </View>
      <View
        style={{
          width: 300,
          height: 80,
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',

          top: -40,
        }}>
        <Text
          style={{
            fontFamily: 'Poppins',
            fontWeight: '600',
            fontSize: 12,
            lineHeight: 15,
            textAlign: 'center',
          }}>
          Welcome to your personalized fitness journey! I'm here to be your
          trusty fitness companion, guiding you through workouts, providing
          tips, and keeping you motivated every step of the way.
        </Text>
      </View>
      <View
        style={{
          marginTop: DeviceHeigth * 0.15,
          bottom: 10,
          position: 'absolute',
          alignItems: 'center',
          alignSelf: 'center',
        }}>
        <Button
          buttonText={'Start Now'}
          onPresh={() => {
            navigation.navigate('AITrainer');
          }}
        />
      </View>
    </View>
  );
};
var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColor.WHITE,
  },
});
export default Trainer;
