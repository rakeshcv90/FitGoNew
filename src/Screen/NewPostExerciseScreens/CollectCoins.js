import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Animated,
  Image,
  Easing,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AnimatedLottieView from 'lottie-react-native';
import {localImage} from '../../Component/Image';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import {AppColor} from '../../Component/Color';
import NewButton from '../../Component/NewButton';
import AnimatedNumber from 'react-native-animated-numbers';

const CollectCoins = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const moveAnim = useRef(new Animated.Value(0)).current;
  const fadeView = useRef(new Animated.Value(0)).current;
  const moveView = useRef(new Animated.Value(0)).current;
  const moveButton = useRef(new Animated.Value(0)).current;
  const fadeButton = useRef(new Animated.Value(0)).current;
  const [count, setCount] = useState(1);

  useEffect(() => {
    animate();
  }, []);

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
      duration: 1000,
      useNativeDriver: true,
    }).start();

    Animated.timing(moveView, {
      toValue: -8,
      duration: 1500,
      useNativeDriver: true,
    }).start(() => {
      animateButton();
    });
  };

  const animateButton = () => {
    Animated.timing(fadeButton, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    Animated.timing(moveButton, {
      toValue: -8,
      duration: 1500,
      useNativeDriver: true,
    }).start();
    setCount(50);
  };

  return (
    <LinearGradient
      colors={['#FFE7AC', '#FEF7E4', '#FFE7AC', '#FFE7AC']}
      style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'#FFE7AC'} />

      <View style={{height: DeviceHeigth * 0.45}}>
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
          marginTop: DeviceHeigth * 0.02,
        }}>
        Congratulations!
      </Animated.Text>

      <Animated.View
        style={[
          styles.animatedView,
          {opacity: fadeView, transform: [{translateY: moveView}]},
        ]}>
        <View style={{alignItems: 'center', width: DeviceWidth * 0.3}}>
          <Image
            source={localImage.FitCoin}
            style={{height: 40, width: 40}}
            resizeMode="contain"
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 14, fontFamily: 'Helvetica-Bold',color:AppColor.BLACK}}>+</Text>
            <AnimatedNumber
              animateToNumber={count}
              fontStyle={{
                fontSize: 14,
                fontFamily: 'Helvetica-Bold',
                color: AppColor.BLACK,
              }}
              easing={Easing.ease}
              animationDuration={1500}
              // Ensure key changes when count changes to force re-mounting of AnimatedNumber
            />
          </View>
          <Text style={{color: '#575757', fontFamily: 'Helvetica'}}>
            Fitcoins Earned
          </Text>
        </View>

        <Image
          source={localImage.line}
          style={{height: DeviceHeigth * 0.15}}
          resizeMode="contain"
        />

        <View style={{alignItems: 'center', width: DeviceWidth * 0.3}}>
          <Image
            source={localImage.watch3d}
            style={{height: 40, width: 40}}
            resizeMode="contain"
          />
          <Text style={{color: AppColor.BLACK, fontFamily: 'Helvetica-Bold'}}>
            x30
          </Text>
          <Text style={{color: '#575757', fontFamily: 'Helvetica'}}>
            Minutes
          </Text>
        </View>
      </Animated.View>

      <Animated.View
        style={{
          position: 'absolute',
          bottom: DeviceHeigth * 0.04,
          alignSelf: 'center',
          opacity: fadeButton,
          transform: [{translateY: moveButton}],
        }}>
        <NewButton pV={14} title={'Collect'} />
      </Animated.View>
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
    alignSelf: 'center',
    bottom: 0,
  },
  animatedView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: DeviceWidth * 0.06,
    marginTop: DeviceHeigth * 0.05,
  },
});

export default CollectCoins;
