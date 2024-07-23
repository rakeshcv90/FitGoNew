import {View, Text, StyleSheet, StatusBar, Animated} from 'react-native';
import React, {useEffect} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import AnimatedLottieView from 'lottie-react-native';
import {localImage} from '../../Component/Image';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import {AppColor} from '../../Component/Color';

const CollectCoins = () => {
  useEffect(() => {
    animate();
  }, []);
  // Animated values
  const fadeAnim = new Animated.Value(0);
  const moveAnim = new Animated.Value(0);
  const fadeView = new Animated.Value(0);
  const moveView = new Animated.Value(0);
  const animate = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    Animated.timing(moveAnim, {
      toValue: -8,
      duration: 1500,
      useNativeDriver: true,
    }).start(() => {
      animateView1();
    });
  };
  const animateView1 = () => {
    Animated.timing(fadeView, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();
    Animated.timing(moveView, {
      toValue: -8,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => {
      console.log('animation has ended');
    });
  };
  return (
    <LinearGradient
      colors={['#FFE7AC', '#FEF7E4', '#FFE7AC', '#FFE7AC']}
      style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'#FFE7AC'} />
      <View style={{height: DeviceHeigth * 0.45, borderWidth: 1}}>
        <AnimatedLottieView
          source={localImage.Party}
          speed={0.7}
          autoPlay
          loop
          resizeMode="contain"
          style={{
            width: DeviceWidth,
            height: DeviceHeigth * 0.4,
          }}
        />
        <AnimatedLottieView
          source={localImage.thumbAnimation}
          speed={1}
          autoPlay
          resizeMode="contain"
          style={styles.l2}
        />
      </View>
      <Animated.Text
        style={{
          opacity: fadeAnim,
          transform: [{translateY: moveAnim}],
          fontSize: 26,
          color: AppColor.BLACK,
          fontFamily: 'Helvetica-Bold',
          alignSelf: 'center',
        }}>
        Congratulations!
      </Animated.Text>
      <Animated.View
        style={{
          opacity: fadeView,
          transform: [{translateY: moveView}],
        }}></Animated.View>
    </LinearGradient>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  l2: {
    width: DeviceWidth * 0.5,
    height: DeviceHeigth * 0.25,
    position: 'absolute',
    borderWidth: 1,
    alignSelf: 'center',
    bottom: 0,
  },
});
export default CollectCoins;
