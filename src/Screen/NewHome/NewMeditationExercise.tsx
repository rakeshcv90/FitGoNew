import {Image, StatusBar, StyleSheet, Text, View, Platform} from 'react-native';
import React, {useState, useEffect} from 'react';
import Wrapper from '../WorkoutCompleteScreen/Wrapper';
import NewHeader1 from '../../Component/Headers/NewHeader1';
import {AppColor, Fonts} from '../../Component/Color';
import MeditationMusic from './MeditationMusic';
import LinearGradient from 'react-native-linear-gradient';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import FitIcon from '../../Component/Utilities/FitIcon';
import AnimatedReanimated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
  withSpring,
  interpolate,
  Easing,
  FadeIn,
  FadeInUp,
  FadeInDown,
} from 'react-native-reanimated';

// --- Orbiting Particle ---
const OrbitingParticle = ({
  orbitSize,
  particleSize,
  duration,
  delay,
  color,
  isPlaying,
}: any) => {
  const rotation = useSharedValue(0);
  const glow = useSharedValue(0.3);

  useEffect(() => {
    if (isPlaying) {
      rotation.value = withDelay(
        delay,
        withRepeat(
          withTiming(360, {duration, easing: Easing.linear}),
          -1,
          false,
        ),
      );
      glow.value = withRepeat(
        withSequence(
          withTiming(1, {duration: 1500}),
          withTiming(0.3, {duration: 1500}),
        ),
        -1,
        true,
      );
    } else {
      rotation.value = withTiming(rotation.value, {duration: 800});
      glow.value = withTiming(0.2, {duration: 600});
    }
  }, [isPlaying]);

  const orbitStyle = useAnimatedStyle(() => ({
    transform: [{rotate: `${rotation.value}deg`}],
  }));

  const particleStyle = useAnimatedStyle(() => ({
    opacity: glow.value,
    transform: [{scale: interpolate(glow.value, [0.3, 1], [0.8, 1.3])}],
  }));

  return (
    <AnimatedReanimated.View
      style={[
        {
          position: 'absolute',
          width: orbitSize,
          height: orbitSize,
          justifyContent: 'flex-start',
          alignItems: 'center',
        },
        orbitStyle,
      ]}>
      <AnimatedReanimated.View
        style={[
          {
            width: particleSize,
            height: particleSize,
            borderRadius: particleSize / 2,
            backgroundColor: color,
          },
          particleStyle,
        ]}
      />
    </AnimatedReanimated.View>
  );
};

// --- Pulsing Glow Ring ---
const PulsingRing = ({size, delay, isPlaying, color}: any) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.15);

  useEffect(() => {
    if (isPlaying) {
      scale.value = withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(1.35, {
              duration: 2200 + delay,
              easing: Easing.out(Easing.ease),
            }),
            withTiming(1, {
              duration: 2200 + delay,
              easing: Easing.in(Easing.ease),
            }),
          ),
          -1,
          true,
        ),
      );
      opacity.value = withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(0.04, {duration: 2200 + delay}),
            withTiming(0.2, {duration: 2200 + delay}),
          ),
          -1,
          true,
        ),
      );
    } else {
      scale.value = withTiming(1, {duration: 800});
      opacity.value = withTiming(0.08, {duration: 800});
    }
  }, [isPlaying]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
    opacity: opacity.value,
  }));

  return (
    <AnimatedReanimated.View
      style={[
        {
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 1.5,
          borderColor: color || 'rgba(255,255,255,0.4)',
          backgroundColor: `${color || 'rgba(120,80,220,0.1)'}`,
        },
        animatedStyle,
      ]}
    />
  );
};

// --- Breathing Glow Aura ---
const BreathingAura = ({isPlaying}: any) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.1);

  useEffect(() => {
    if (isPlaying) {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.15, {duration: 3000, easing: Easing.inOut(Easing.ease)}),
          withTiming(0.95, {duration: 3000, easing: Easing.inOut(Easing.ease)}),
        ),
        -1,
        true,
      );
      opacity.value = withRepeat(
        withSequence(
          withTiming(0.2, {duration: 3000}),
          withTiming(0.05, {duration: 3000}),
        ),
        -1,
        true,
      );
    } else {
      scale.value = withTiming(1, {duration: 1000});
      opacity.value = withTiming(0.05, {duration: 1000});
    }
  }, [isPlaying]);

  const style = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
    opacity: opacity.value,
  }));

  return (
    <AnimatedReanimated.View style={[styles.breathingAura, style]}>
      <LinearGradient
        colors={[
          'rgba(102,126,234,0.4)',
          'rgba(118,75,162,0.25)',
          'rgba(240,147,251,0.1)',
          'transparent',
        ]}
        start={{x: 0.5, y: 0}}
        end={{x: 0.5, y: 1}}
        style={StyleSheet.absoluteFill}
      />
    </AnimatedReanimated.View>
  );
};

// --- Waveform Bar (with mirrored reflection) ---
const WaveBar = ({index, isPlaying, total}: any) => {
  const height = useSharedValue(5);
  const barOpacity = useSharedValue(0.35);

  const progress = index / total;
  // Gradient from cyan → purple → pink
  const r = Math.round(70 + progress * 180);
  const g = Math.round(200 - progress * 120);
  const b = Math.round(255 - progress * 40);
  const barColor = `rgb(${r}, ${g}, ${b})`;
  const reflectionColor = `rgba(${r}, ${g}, ${b}, 0.25)`;

  useEffect(() => {
    if (isPlaying) {
      const baseDelay = index * 30;
      // Center bars peak higher, edge bars shorter
      const centerFactor = 1 - Math.abs(index - total / 2) / (total / 2);
      const maxH = 12 + centerFactor * 28;
      height.value = withDelay(
        baseDelay,
        withRepeat(
          withSequence(
            withTiming(maxH + Math.random() * 10, {
              duration: 200 + Math.random() * 300,
              easing: Easing.inOut(Easing.ease),
            }),
            withTiming(4 + Math.random() * 6, {
              duration: 200 + Math.random() * 300,
              easing: Easing.inOut(Easing.ease),
            }),
            withTiming(maxH * 0.7 + Math.random() * 8, {
              duration: 180 + Math.random() * 250,
              easing: Easing.inOut(Easing.ease),
            }),
            withTiming(3 + Math.random() * 5, {
              duration: 220 + Math.random() * 280,
              easing: Easing.inOut(Easing.ease),
            }),
          ),
          -1,
          true,
        ),
      );
      barOpacity.value = withDelay(
        baseDelay,
        withRepeat(
          withSequence(
            withTiming(1, {duration: 350}),
            withTiming(0.55, {duration: 350}),
          ),
          -1,
          true,
        ),
      );
    } else {
      height.value = withTiming(5, {duration: 700});
      barOpacity.value = withTiming(0.25, {duration: 700});
    }
  }, [isPlaying]);

  const mainStyle = useAnimatedStyle(() => ({
    height: height.value,
    opacity: barOpacity.value,
  }));

  // Mirrored reflection (inverted, faded)
  const reflectionStyle = useAnimatedStyle(() => ({
    height: height.value * 0.45,
    opacity: barOpacity.value * 0.3,
  }));

  return (
    <View style={{alignItems: 'center', marginHorizontal: 1}}>
      {/* Main bar */}
      <AnimatedReanimated.View
        style={[
          {
            width: 3.5,
            borderRadius: 2,
            backgroundColor: barColor,
          },
          mainStyle,
        ]}
      />
      {/* Glow center line */}
      <View
        style={{
          width: 5,
          height: 1.5,
          borderRadius: 1,
          backgroundColor: barColor,
          opacity: 0.6,
        }}
      />
      {/* Reflection bar */}
      <AnimatedReanimated.View
        style={[
          {
            width: 3.5,
            borderRadius: 2,
            backgroundColor: reflectionColor,
          },
          reflectionStyle,
        ]}
      />
    </View>
  );
};

// --- Scanning Glow Line ---
const ScanningGlow = ({isPlaying}: any) => {
  const posX = useSharedValue(0);

  useEffect(() => {
    if (isPlaying) {
      posX.value = withRepeat(
        withSequence(
          withTiming(1, {duration: 2000, easing: Easing.inOut(Easing.ease)}),
          withTiming(0, {duration: 2000, easing: Easing.inOut(Easing.ease)}),
        ),
        -1,
        true,
      );
    } else {
      posX.value = withTiming(0.5, {duration: 600});
    }
  }, [isPlaying]);

  const style = useAnimatedStyle(() => ({
    left: `${posX.value * 85}%`,
    opacity: isPlaying ? 0.7 : 0,
  }));

  return (
    <AnimatedReanimated.View
      style={[
        {
          position: 'absolute',
          width: 30,
          height: '100%',
          borderRadius: 15,
          backgroundColor: 'rgba(102,126,234,0.15)',
        },
        style,
      ]}
    />
  );
};

// --- Rotating Ring ---
const RotatingRing = ({size, isPlaying}: any) => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (isPlaying) {
      rotation.value = withRepeat(
        withTiming(360, {duration: 12000, easing: Easing.linear}),
        -1,
        false,
      );
    } else {
      rotation.value = withTiming(rotation.value, {duration: 1000});
    }
  }, [isPlaying]);

  const style = useAnimatedStyle(() => ({
    transform: [{rotate: `${rotation.value}deg`}],
  }));

  return (
    <AnimatedReanimated.View
      style={[
        {
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 2,
          borderColor: 'transparent',
          borderTopColor: 'rgba(102,126,234,0.5)',
          borderRightColor: 'rgba(240,147,251,0.3)',
        },
        style,
      ]}
    />
  );
};

const NewMeditationExercise = ({navigation, route}: any) => {
  const {index, allMeditation} = route.params;
  const [number, setNumber] = useState(index);
  const [backPressed, setBackPressed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentItem = allMeditation[number];
  const hasImage =
    currentItem?.exercise_mindset_image_link != null &&
    currentItem?.exercise_mindset_image_link !== '' &&
    currentItem?.exercise_mindset_image_link?.trim()?.length > 0;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0A0618', '#120D2E', '#1A1245', '#0F0C29']}
        locations={[0, 0.3, 0.6, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Background Stars */}
      {[
        {top: '8%', left: '10%', size: 2, opacity: 0.3},
        {top: '15%', right: '15%', size: 3, opacity: 0.5},
        {top: '25%', left: '80%', size: 2, opacity: 0.2},
        {top: '5%', left: '50%', size: 2.5, opacity: 0.4},
        {top: '35%', left: '5%', size: 2, opacity: 0.25},
        {top: '45%', right: '8%', size: 3, opacity: 0.35},
        {top: '12%', left: '35%', size: 1.5, opacity: 0.3},
        {top: '30%', right: '30%', size: 2, opacity: 0.2},
      ].map((star: any, i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            top: star.top,
            left: star.left,
            right: star.right,
            width: star.size,
            height: star.size,
            borderRadius: star.size,
            backgroundColor: '#FFFFFF',
            opacity: star.opacity,
          }}
        />
      ))}

      <Wrapper styles={{backgroundColor: 'transparent'}}>
        <StatusBar
          barStyle={'light-content'}
          backgroundColor={'transparent'}
          translucent={true}
        />

        {/* Header */}
        <NewHeader1
          header={currentItem?.exercise_mindset_title}
          fillColor={AppColor.WHITE}
          headerStyle={{
            color: AppColor.WHITE,
            fontFamily: Fonts.MONTSERRAT_BOLD,
            fontSize: 17,
            textTransform: 'capitalize',
          }}
          backButton
          onBackPress={() => setBackPressed(true)}
        />

        {/* Visual Area */}
        <AnimatedReanimated.View
          entering={FadeIn.duration(1000)}
          style={styles.visualArea}>
          {/* Breathing Aura */}
          <BreathingAura isPlaying={isPlaying} />

          {/* Pulsing Rings */}
          <PulsingRing
            size={300}
            delay={0}
            isPlaying={isPlaying}
            color="rgba(102,126,234,0.15)"
          />
          <PulsingRing
            size={250}
            delay={400}
            isPlaying={isPlaying}
            color="rgba(118,75,162,0.12)"
          />
          <PulsingRing
            size={200}
            delay={800}
            isPlaying={isPlaying}
            color="rgba(240,147,251,0.1)"
          />

          {/* Rotating Ring */}
          <RotatingRing size={190} isPlaying={isPlaying} />

          {/* Orbiting Particles */}
          <OrbitingParticle
            orbitSize={220}
            particleSize={6}
            duration={8000}
            delay={0}
            color="#667EEA"
            isPlaying={isPlaying}
          />
          <OrbitingParticle
            orbitSize={260}
            particleSize={4}
            duration={12000}
            delay={500}
            color="#F093FB"
            isPlaying={isPlaying}
          />
          <OrbitingParticle
            orbitSize={190}
            particleSize={5}
            duration={6000}
            delay={1000}
            color="#00F2FE"
            isPlaying={isPlaying}
          />
          <OrbitingParticle
            orbitSize={300}
            particleSize={3}
            duration={15000}
            delay={300}
            color="#FA709A"
            isPlaying={isPlaying}
          />

          {/* Artwork Circle */}
          <View style={styles.artworkOuter}>
            <LinearGradient
              colors={['#667EEA', '#764BA2', '#F093FB', '#667EEA']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={styles.artworkGradientBorder}>
              <View style={styles.artworkInner}>
                {hasImage ? (
                  <Image
                    style={styles.artworkImage}
                    resizeMode="cover"
                    source={{uri: currentItem.exercise_mindset_image_link}}
                  />
                ) : (
                  <LinearGradient
                    colors={['#302B63', '#1A1040', '#667EEA']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 1}}
                    style={[
                      styles.artworkImage,
                      {justifyContent: 'center', alignItems: 'center'},
                    ]}>
                    <FitIcon
                      type="MaterialCommunityIcons"
                      name="meditation"
                      size={55}
                      color="rgba(255,255,255,0.7)"
                    />
                  </LinearGradient>
                )}
              </View>
            </LinearGradient>
          </View>
        </AnimatedReanimated.View>

        {/* Waveform Visualizer */}
        <AnimatedReanimated.View
          entering={FadeInUp.delay(400).duration(600)}
          style={styles.waveformContainer}>
          <ScanningGlow isPlaying={isPlaying} />
          {Array.from({length: 35}).map((_, i) => (
            <WaveBar key={i} index={i} isPlaying={isPlaying} total={35} />
          ))}
        </AnimatedReanimated.View>

        {/* Title + Meta */}
        <AnimatedReanimated.View
          entering={FadeInUp.delay(500).duration(500)}
          style={styles.titleContainer}>
          <Text style={styles.exerciseTitle} numberOfLines={2}>
            {currentItem?.exercise_mindset_title}
          </Text>
          <View style={styles.titleMetaRow}>
            <LinearGradient
              colors={['rgba(102,126,234,0.3)', 'rgba(118,75,162,0.2)']}
              style={styles.titleMetaPill}>
              <FitIcon
                type="MaterialCommunityIcons"
                name="clock-outline"
                size={12}
                color="rgba(255,255,255,0.8)"
              />
              <Text style={styles.titleMetaText}>
                {currentItem?.exercise_mindset_time || '5'} min
              </Text>
            </LinearGradient>
            <LinearGradient
              colors={['rgba(240,147,251,0.3)', 'rgba(245,87,108,0.2)']}
              style={styles.titleMetaPill}>
              <FitIcon
                type="MaterialCommunityIcons"
                name="meditation"
                size={12}
                color="rgba(255,255,255,0.8)"
              />
              <Text style={styles.titleMetaText}>Mindfulness</Text>
            </LinearGradient>
          </View>
        </AnimatedReanimated.View>

        {/* Music Player */}
        <MeditationMusic
          allMeditation={allMeditation}
          number={number}
          setNumber={setNumber}
          backPressed={backPressed}
          onPlayStateChange={setIsPlaying}
        />
      </Wrapper>
    </View>
  );
};

export default NewMeditationExercise;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0618',
  },
  visualArea: {
    width: '100%',
    height: '45%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  breathingAura: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    overflow: 'hidden',
  },
  artworkOuter: {
    ...Platform.select({
      ios: {
        shadowColor: '#764BA2',
        shadowOffset: {width: 0, height: 12},
        shadowOpacity: 0.6,
        shadowRadius: 25,
      },
      android: {
        elevation: 20,
      },
    }),
  },
  artworkGradientBorder: {
    width: 170,
    height: 170,
    borderRadius: 85,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  artworkInner: {
    width: 162,
    height: 162,
    borderRadius: 81,
    overflow: 'hidden',
    backgroundColor: '#1A1040',
  },
  artworkImage: {
    width: '100%',
    height: '100%',
    borderRadius: 81,
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 70,
    marginTop: 4,
    marginBottom: 4,
    position: 'relative',
    overflow: 'hidden',
    paddingHorizontal: 10,
  },
  titleContainer: {
    alignItems: 'center',
    paddingHorizontal: 30,
    marginBottom: 4,
  },
  exerciseTitle: {
    fontSize: 20,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(102,126,234,0.4)',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 8,
  },
  titleMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  titleMetaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    gap: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  titleMetaText: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 11.5,
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    fontWeight: '600',
  },
});
