import {Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import {DeviceWidth} from '../../Component/Config';
import {localImage} from '../../Component/Image';
import {AppColor} from '../../Component/Color';

// Floating particle that drifts upward and fades
const FloatingParticle = ({
  delay,
  startX,
  size,
}: {
  delay: number;
  startX: number;
  size: number;
}) => {
  const progress = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, {duration: 3000, easing: Easing.out(Easing.quad)}),
        -1,
      ),
    );
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(0.7, {duration: 800}),
          withTiming(0.7, {duration: 1400}),
          withTiming(0, {duration: 800}),
        ),
        -1,
      ),
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    position: 'absolute',
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: AppColor.RED,
    opacity: opacity.value,
    transform: [
      {translateX: startX},
      {translateY: interpolate(progress.value, [0, 1], [20, -100])},
      {scale: interpolate(progress.value, [0, 0.5, 1], [0.3, 1, 0.2])},
    ],
  }));

  return <Animated.View style={style} />;
};

// Orbiting ring that expands and fades
const OrbitRing = ({delay, maxSize}: {delay: number; maxSize: number}) => {
  const scale = useSharedValue(0.3);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, {duration: 2800, easing: Easing.out(Easing.cubic)}),
        -1,
      ),
    );
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(0.35, {duration: 400}),
          withTiming(0, {duration: 2400}),
        ),
        -1,
      ),
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    position: 'absolute',
    width: maxSize,
    height: maxSize,
    borderRadius: maxSize / 2,
    borderWidth: 1.5,
    borderColor: AppColor.RED,
    opacity: opacity.value,
    transform: [{scale: scale.value}],
  }));

  return <Animated.View style={style} />;
};

const SplashAnimation = () => {
  const circleRef = useSharedValue(1);
  const logoRef = useSharedValue(0);
  const logoLeftRef = useSharedValue(0);
  const logoOpacityRef = useSharedValue(0);
  const textWidthRef = useSharedValue(0);
  const textOpacityRef = useSharedValue(0);

  // Decorative-only additions: ambient glow, landing impact ring,
  // logo heartbeat pulse and a text shimmer sweep. None of these
  // touch the original timings/state above.
  const glowOpacityRef = useSharedValue(0);
  const glowScaleRef = useSharedValue(0.8);
  const glowRotateRef = useSharedValue(0);
  const impactScaleRef = useSharedValue(0);
  const impactOpacityRef = useSharedValue(0);
  const logoPulseRef = useSharedValue(1);
  const shimmerRef = useSharedValue(-1);

  // Premium additions
  const outerGlowOpacity = useSharedValue(0);
  const outerGlowScale = useSharedValue(0.6);
  const logoShadowOpacity = useSharedValue(0);
  const shimmer2Ref = useSharedValue(-1);
  const taglineOpacity = useSharedValue(0);
  const taglineTranslateY = useSharedValue(12);

  useEffect(() => {
    logoOpacityRef.value = withTiming(1, {duration: 800});
    circleRef.value = withTiming(0, {duration: 1000});

    glowOpacityRef.value = withDelay(
      150,
      withRepeat(
        withSequence(
          withTiming(0.85, {duration: 1100, easing: Easing.out(Easing.ease)}),
          withTiming(0.45, {duration: 1100, easing: Easing.in(Easing.ease)}),
        ),
        -1,
        true,
      ),
    );
    glowScaleRef.value = withDelay(
      150,
      withRepeat(
        withSequence(
          withTiming(1.15, {duration: 1100, easing: Easing.out(Easing.ease)}),
          withTiming(0.95, {duration: 1100, easing: Easing.in(Easing.ease)}),
        ),
        -1,
        true,
      ),
    );
    glowRotateRef.value = withRepeat(
      withTiming(360, {duration: 7000, easing: Easing.linear}),
      -1,
    );

    // Second layer glow (outer)
    outerGlowOpacity.value = withDelay(
      400,
      withRepeat(
        withSequence(
          withTiming(0.5, {duration: 1600, easing: Easing.out(Easing.ease)}),
          withTiming(0.15, {duration: 1600, easing: Easing.in(Easing.ease)}),
        ),
        -1,
        true,
      ),
    );
    outerGlowScale.value = withDelay(
      400,
      withRepeat(
        withSequence(
          withTiming(1.3, {duration: 1600, easing: Easing.out(Easing.ease)}),
          withTiming(1.0, {duration: 1600, easing: Easing.in(Easing.ease)}),
        ),
        -1,
        true,
      ),
    );

    logoRef.value = withTiming(
      -150,
      {easing: Easing.out(Easing.cubic), duration: 1000},
      () =>
        (logoRef.value = withSpring(0, {stiffness: 150}, () => {
          impactScaleRef.value = withSequence(
            withTiming(1, {duration: 180, easing: Easing.out(Easing.ease)}),
            withTiming(1.6, {duration: 380, easing: Easing.in(Easing.ease)}),
          );
          impactOpacityRef.value = withSequence(
            withTiming(0.5, {duration: 120}),
            withTiming(0, {duration: 420}),
          );

          // Logo drop shadow appears after landing
          logoShadowOpacity.value = withDelay(
            200,
            withRepeat(
              withSequence(
                withTiming(0.3, {
                  duration: 900,
                  easing: Easing.out(Easing.ease),
                }),
                withTiming(0.1, {
                  duration: 900,
                  easing: Easing.in(Easing.ease),
                }),
              ),
              -1,
              true,
            ),
          );

          logoLeftRef.value = withTiming(-50, {duration: 1000}, () => {
            textWidthRef.value = withTiming(DeviceWidth, {
              duration: 2000,
            });
            textOpacityRef.value = 1;

            // Primary shimmer
            shimmerRef.value = withDelay(
              250,
              withTiming(1, {
                duration: 900,
                easing: Easing.inOut(Easing.ease),
              }),
            );

            // Second shimmer sweep with delay
            shimmer2Ref.value = withDelay(
              1400,
              withTiming(1, {
                duration: 800,
                easing: Easing.inOut(Easing.ease),
              }),
            );

            logoPulseRef.value = withDelay(
              300,
              withRepeat(
                withSequence(
                  withTiming(1.08, {
                    duration: 550,
                    easing: Easing.out(Easing.ease),
                  }),
                  withTiming(1, {
                    duration: 550,
                    easing: Easing.in(Easing.ease),
                  }),
                ),
                -1,
                true,
              ),
            );

            // Tagline fade-in
            taglineOpacity.value = withDelay(
              600,
              withTiming(1, {duration: 800}),
            );
            taglineTranslateY.value = withDelay(
              600,
              withTiming(0, {
                duration: 800,
                easing: Easing.out(Easing.cubic),
              }),
            );
          });
        })),
    );
  }, []);

  const circleStyle = useAnimatedStyle(() => ({
    transform: [{scale: circleRef.value}],
  }));
  const logoStyle = useAnimatedStyle(() => ({
    transform: [
      {translateY: logoRef.value},
      {translateX: logoLeftRef.value},
      {scale: logoPulseRef.value},
    ],
    opacity: logoOpacityRef.value,
  }));
  const textViewStyle = useAnimatedStyle(() => ({
    transform: [{translateX: textWidthRef.value}],
    // width: textWidthRef.value,
  }));
  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacityRef.value,
  }));
  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacityRef.value,
    transform: [
      {scale: glowScaleRef.value},
      {rotate: `${glowRotateRef.value}deg`},
    ],
  }));
  const outerGlowStyle = useAnimatedStyle(() => ({
    opacity: outerGlowOpacity.value,
    transform: [{scale: outerGlowScale.value}],
  }));
  const impactStyle = useAnimatedStyle(() => ({
    opacity: impactOpacityRef.value,
    transform: [{scale: impactScaleRef.value}],
  }));
  const logoShadowStyle = useAnimatedStyle(() => ({
    opacity: logoShadowOpacity.value,
  }));

  const shimmerMaskWidth = DeviceWidth / 4;
  const shimmerBandWidth = shimmerMaskWidth * 0.6;
  const shimmerStyle = useAnimatedStyle(() => ({
    opacity: textOpacityRef.value,
    transform: [
      {
        translateX:
          -shimmerBandWidth +
          ((shimmerRef.value + 1) / 2) *
            (shimmerMaskWidth + shimmerBandWidth),
      },
    ],
  }));
  const shimmer2Style = useAnimatedStyle(() => ({
    opacity: textOpacityRef.value,
    transform: [
      {
        translateX:
          -shimmerBandWidth +
          ((shimmer2Ref.value + 1) / 2) *
            (shimmerMaskWidth + shimmerBandWidth),
      },
    ],
  }));
  const taglineStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
    transform: [{translateY: taglineTranslateY.value}],
  }));

  const AnimatedImage = Animated.createAnimatedComponent(Image);
  return (
    <View style={styles.main}>
      {/* Floating particles */}
      <View style={styles.particleContainer} pointerEvents="none">
        <FloatingParticle delay={0} startX={-50} size={4} />
        <FloatingParticle delay={600} startX={30} size={3} />
        <FloatingParticle delay={1200} startX={-20} size={5} />
        <FloatingParticle delay={1800} startX={55} size={3} />
        <FloatingParticle delay={2400} startX={-40} size={4} />
        <FloatingParticle delay={800} startX={10} size={3} />
      </View>

      {/* Orbit rings */}
      <View style={styles.glowWrapper} pointerEvents="none">
        <OrbitRing delay={500} maxSize={180} />
        <OrbitRing delay={1400} maxSize={220} />
        <OrbitRing delay={2300} maxSize={160} />
      </View>

      {/* Outer glow layer */}
      <View style={styles.glowWrapper} pointerEvents="none">
        <Animated.View style={[styles.outerGlow, outerGlowStyle]}>
          <LinearGradient
            colors={[AppColor.RED + '33', AppColor.RED + '00']}
            style={styles.outerGlowGradient}
          />
        </Animated.View>
      </View>

      {/* Inner glow */}
      <View style={styles.glowWrapper} pointerEvents="none">
        <Animated.View style={[styles.glow, glowStyle]}>
          <LinearGradient
            colors={[AppColor.RED + '66', AppColor.RED + '00']}
            style={styles.glowGradient}
          />
        </Animated.View>
      </View>

      <AnimatedImage
        source={localImage.CircleSplash}
        style={[styles.circle, circleStyle]}
        resizeMode={'contain'}
      />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Animated.View
          style={[styles.impactRing, impactStyle]}
          pointerEvents="none"
        />

        {/* Logo drop shadow */}
        <Animated.View
          style={[styles.logoShadow, logoShadowStyle]}
          pointerEvents="none"
        />

        <AnimatedImage
          source={localImage.LogoSplash}
          style={[styles.logo, logoStyle]}
          resizeMode={'contain'}
        />
        <Animated.View
          style={[
            styles.textView,
            textStyle,
            {
              // backgroundColor: 'white',
            },
          ]}>
          <Animated.View
            style={[
              textViewStyle,
              styles.textView,
              {
                backgroundColor: 'white',
                zIndex: 1,
              },
            ]}
          />
          <AnimatedImage
            source={localImage.SplashText}
            style={[styles.text, textStyle]}
            resizeMode={'contain'}
          />
          {/* Primary shimmer */}
          <View style={styles.shimmerMask} pointerEvents="none">
            <Animated.View style={[styles.shimmerBand, shimmerStyle]}>
              <LinearGradient
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                colors={['#ffffff00', '#ffffffcc', '#ffffff00']}
                style={StyleSheet.absoluteFillObject}
              />
            </Animated.View>
          </View>
          {/* Second shimmer sweep */}
          <View style={styles.shimmerMask} pointerEvents="none">
            <Animated.View style={[styles.shimmerBand, shimmer2Style]}>
              <LinearGradient
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                colors={['#ffffff00', '#ffffff99', '#ffffff00']}
                style={StyleSheet.absoluteFillObject}
              />
            </Animated.View>
          </View>
        </Animated.View>
      </View>

      {/* Tagline */}
      <Animated.View style={[styles.taglineWrapper, taglineStyle]}>
        <Text style={styles.tagline}>Your Fitness Journey Starts Here</Text>
      </Animated.View>
    </View>
  );
};

export default SplashAnimation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  Textlogo: {
    width: DeviceWidth * 0.6,
  },
  main: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: DeviceWidth * 0.8,
    height: 160,
    // backgroundColor: 'red',
  },
  circle: {
    width: DeviceWidth / 2,
    height: 40,
    position: 'absolute',
  },
  logo: {
    width: 80,
    height: 80,
    position: 'absolute',
  },
  text: {
    height: 80,
    width: DeviceWidth / 4,
    zIndex: -1,
  },
  textView: {
    position: 'absolute',
    width: DeviceWidth / 4,
    left: -5,
    height: 80,
  },
  glowWrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glow: {
    width: 150,
    height: 150,
  },
  glowGradient: {
    flex: 1,
    borderRadius: 75,
  },
  outerGlow: {
    width: 220,
    height: 220,
  },
  outerGlowGradient: {
    flex: 1,
    borderRadius: 110,
  },
  impactRing: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: AppColor.RED,
  },
  logoShadow: {
    position: 'absolute',
    width: 60,
    height: 8,
    borderRadius: 30,
    backgroundColor: AppColor.RED,
    top: 44,
    transform: [{scaleX: 1.2}],
  },
  shimmerMask: {
    position: 'absolute',
    width: DeviceWidth / 4,
    left: -5,
    height: 80,
    overflow: 'hidden',
  },
  shimmerBand: {
    position: 'absolute',
    width: DeviceWidth / 4,
    height: 80,
  },
  particleContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taglineWrapper: {
    position: 'absolute',
    bottom: -14,
    left: 0,
    right: 0,
    alignItems: 'center',
    width: DeviceWidth * 0.8,
  },
  tagline: {
    fontSize: 10.5,
    letterSpacing: 3,
    color: AppColor.RED,
    fontFamily: 'Montserrat-SemiBold',
    textTransform: 'uppercase',
    opacity: 0.7,
    textAlign: 'center',
  },
});
