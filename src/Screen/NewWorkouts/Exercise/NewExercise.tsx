import {
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  BackHandler,
  StyleSheet,
  Platform,
  StatusBar,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {FadeIn, FadeInDown, FadeInUp} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Svg, {
  Line,
  Ellipse,
  Path,
  Defs,
  LinearGradient as SvgGradient,
  Stop,
  G,
} from 'react-native-svg';
import {AppColor, Fonts} from '../../../Component/Color';
import {DeviceHeigth, DeviceWidth} from '../../../Component/Config';
import Video from 'react-native-video';
import {useSelector} from 'react-redux';
import ExerciseControls from './ExerciseUtilities/ExerciseControls';
import Wrapper from '../../WorkoutCompleteScreen/Wrapper';

const isTablet = DeviceHeigth >= 1024;
const scale = (size: number) => (DeviceWidth / 390) * size;

// ── 3D Pedestal Platform Component ───────────────────
const PedestalPlatform = () => {
  const pWidth = DeviceWidth * 0.78;
  const pHeight = scale(56);
  const cx = pWidth / 2;
  const rx = pWidth * 0.42;
  const ry = scale(14);
  const topY = scale(16);
  const botY = scale(32);

  return (
    <View
      style={{
        width: pWidth,
        height: pHeight,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Svg width={pWidth} height={pHeight} viewBox={`0 0 ${pWidth} ${pHeight}`}>
        <Defs>
          {/* Cylinder 3D Side Wall Gradient */}
          <SvgGradient
            id="pedestalCylinderGradient"
            x1="0.5"
            y1="0"
            x2="0.5"
            y2="1">
            <Stop offset="0" stopColor="#FFFFFF" />
            <Stop offset="0.35" stopColor="#F1F5F9" />
            <Stop offset="1" stopColor="#CBD5E1" />
          </SvgGradient>

          {/* Neon Base Floor Glow Gradient */}
          <SvgGradient id="floorGlowGradient" x1="0.5" y1="0" x2="0.5" y2="1">
            <Stop offset="0" stopColor="#FF2A54" stopOpacity="0.6" />
            <Stop offset="0.6" stopColor="#FF2A54" stopOpacity="0.2" />
            <Stop offset="1" stopColor="#FF2A54" stopOpacity="0" />
          </SvgGradient>
        </Defs>

        {/* 1. Soft Pink Floor Glow Aura */}
        <Ellipse
          cx={cx}
          cy={botY + scale(6)}
          rx={rx * 1.15}
          ry={ry * 1.15}
          fill="url(#floorGlowGradient)"
        />

        {/* 2. Neon Pink Base Rings */}
        <Ellipse
          cx={cx}
          cy={botY + scale(3)}
          rx={rx * 1.08}
          ry={ry * 1.05}
          fill="none"
          stroke="#FF2A54"
          strokeWidth="6"
          opacity="0.35"
        />
        <Ellipse
          cx={cx}
          cy={botY + scale(3)}
          rx={rx * 1.06}
          ry={ry * 1.02}
          fill="none"
          stroke="#FF2A54"
          strokeWidth="3"
          opacity="0.9"
        />
        <Ellipse
          cx={cx}
          cy={botY + scale(3)}
          rx={rx * 1.04}
          ry={ry * 1.0}
          fill="none"
          stroke="#FF8DA1"
          strokeWidth="1.5"
          opacity="1.0"
        />

        {/* 3. 3D Pedestal Body Side Wall */}
        <G>
          <Path
            d={`M ${cx - rx} ${topY} L ${cx - rx} ${botY} A ${rx} ${ry} 0 0 0 ${
              cx + rx
            } ${botY} L ${cx + rx} ${topY} A ${rx} ${ry} 0 0 1 ${
              cx - rx
            } ${topY} Z`}
            fill="url(#pedestalCylinderGradient)"
            stroke="#CBD5E1"
            strokeWidth="0.5"
          />

          {/* 4. Pedestal Top Flat Surface */}
          <Ellipse
            cx={cx}
            cy={topY}
            rx={rx}
            ry={ry}
            fill="#FFFFFF"
            stroke="#E2E8F0"
            strokeWidth="1"
          />
          {/* Inner Top Inset Highlight Ring */}
          <Ellipse
            cx={cx}
            cy={topY}
            rx={rx * 0.96}
            ry={ry * 0.94}
            fill="#FAFAFA"
            stroke="#F1F5F9"
            strokeWidth="0.8"
          />
        </G>
      </Svg>
    </View>
  );
};

// ── Radial Tick Gauge Component ──────────────────────
const RadialTicks = ({size = 240}: {size?: number}) => {
  const center = size / 2;
  const rOuter = size / 2 - 2;
  const rInner = rOuter - 14;
  const tickCount = 72;

  const ticks = Array.from({length: tickCount}).map((_, i) => {
    const angle = ((i * 360) / tickCount) * (Math.PI / 180);
    const x1 = center + rInner * Math.cos(angle);
    const y1 = center + rInner * Math.sin(angle);
    const x2 = center + rOuter * Math.cos(angle);
    const y2 = center + rOuter * Math.sin(angle);
    return {x1, y1, x2, y2, key: i};
  });

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {ticks.map(t => (
        <Line
          key={t.key}
          x1={t.x1}
          y1={t.y1}
          x2={t.x2}
          y2={t.y2}
          stroke="#FF2A54"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity={0.7}
        />
      ))}
    </Svg>
  );
};

const NewExercise = ({navigation, route}: any) => {
  const {
    allExercise,
    currentExercise,
    data,
    day,
    exerciseNumber,
    trackerData,
    type,
    challenge,
    isEventPage,
    offerType,
  } = route.params;
  const [pause, setPause] = useState(false);
  const [back, setBack] = useState(false);
  const [isRest, setIsRest] = useState(false);
  const getStoreVideoLoc = useSelector((state: any) => state.getStoreVideoLoc);
  const [number, setNumber] = useState(0);
  const [restStart, setRestStart] = useState(true);
  const insets = useSafeAreaInsets();

  const backAction = () => {
    setBack(true);
    return true;
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);

  const totalCount = allExercise?.length || 1;

  return (
    <View style={styles.root}>
      <StatusBar barStyle={'dark-content'} backgroundColor="#F5F5F7" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* ═══ HEADER ROW ═══ */}
        <Animated.View
          entering={FadeIn.duration(350)}
          style={[
            styles.headerRow,
            // {paddingTop: Math.max(insets.top + 8, 20)},
          ]}>
          {/* Back Button */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              setBack(true);
              setPause(false);
            }}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
            style={styles.backBtn}>
            <Icon name="chevron-left" color="#1F2937" size={22} />
          </TouchableOpacity>

          {/* Exercise Title */}
          <Text style={styles.headerTitle} numberOfLines={1}>
            {allExercise[number]?.exercise_title ?? ''}
          </Text>

          {/* Counter Pill */}
          <LinearGradient
            colors={['#FF2A54', '#E11D48']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.counterPill}>
            <Icon name="lightning-bolt" size={11} color="#FFFFFF" />
            <Text style={styles.counterText}>
              {number + 1}/{totalCount}
            </Text>
          </LinearGradient>
        </Animated.View>

        {/* ═══ BADGE ROW ═══ */}
        <Animated.View
          entering={FadeIn.delay(80).duration(350)}
          style={styles.badgeRow}>
          <View style={styles.badge}>
            <View style={styles.liveDot} />
            <Text style={styles.badgeText}>HD DEMO</Text>
          </View>
          {allExercise[number]?.exercise_sets && (
            <View style={styles.badge}>
              <Icon name="layers-outline" size={13} color="#6B7280" />
              <Text style={styles.badgeText}>
                {allExercise[number]?.exercise_sets} Sets
              </Text>
            </View>
          )}
        </Animated.View>

        {/* ═══ PROGRESS BAR ═══ */}
        <Animated.View
          entering={FadeIn.delay(100).duration(350)}
          style={styles.progressBarContainer}>
          <View style={styles.progressBarTrack}>
            <LinearGradient
              colors={['#FF2A54', '#E11D48']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={[
                styles.progressBarFill,
                {width: `${Math.max(((number + 1) / totalCount) * 100, 5)}%`},
              ]}
            />
          </View>
        </Animated.View>

        {/* ═══ VIDEO AREA ═══ */}
        <Animated.View
          entering={FadeInDown.delay(180).duration(500).springify()}
          style={styles.videoSection}>
          {/* Video Card Container */}
          <View style={styles.videoCard}>
            {/* 1. Radial Gauge Ticks Ring Behind Figure — Only shown in Main Exercise Mode */}
            {!restStart && (
              <View style={styles.radialGaugeContainer}>
                <RadialTicks size={scale(240)} />
              </View>
            )}

            {/* 2. Video Player */}
            <Video
              source={{
                uri: getStoreVideoLoc[allExercise[number]?.exercise_title],
              }}
              onLoad={() => setPause(true)}
              paused={!pause}
              repeat={true}
              resizeMode="contain"
              style={styles.video}
            />

            {/* 3. 3D Pedestal Platform at Bottom */}
            <View style={styles.pedestalPositioner}>
              <PedestalPlatform />
            </View>
          </View>
        </Animated.View>

        {/* ═══ CONTROLS SECTION ═══ */}
        <Animated.View entering={FadeInUp.delay(300).duration(500).springify()}>
          <ExerciseControls
            pause={pause}
            setPause={setPause}
            number={number}
            setNumber={setNumber}
            getStoreVideoLoc={getStoreVideoLoc}
            back={back}
            setBack={setBack}
            setIsRest={setIsRest}
            setRestStartParent={setRestStart}
            allExercise={allExercise}
            currentExercise={currentExercise}
            data={data}
            day={day}
            exerciseNumber={exerciseNumber}
            trackerData={trackerData}
            type={type}
            challenge={challenge}
            isEventPage={isEventPage}
            offerType={offerType}
          />
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },

  // ── Header ─────────────────────────────────────────
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(18),
    marginBottom: 10,
  },
  backBtn: {
    width: scale(38),
    height: scale(38),
    borderRadius: scale(19),
    backgroundColor: '#EDEDED',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    color: '#1F2937',
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontSize: scale(15),
    fontWeight: '700',
    textAlign: 'center',
    marginHorizontal: scale(8),
  },
  counterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scale(5),
    paddingHorizontal: scale(10),
    borderRadius: scale(14),
    gap: 3,
  },
  counterText: {
    color: '#FFFFFF',
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontSize: scale(11),
    fontWeight: '700',
  },

  // ── Badge Row ──────────────────────────────────────
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(18),
    marginBottom: 6,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#10B981',
  },
  badgeText: {
    color: '#374151',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
    letterSpacing: 0.3,
  },

  // ── Progress Bar ───────────────────────────────────
  progressBarContainer: {
    paddingHorizontal: scale(18),
    marginBottom: scale(14),
  },
  progressBarTrack: {
    width: '100%',
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 1.5,
  },

  // ── Video Section ──────────────────────────────────
  videoSection: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scale(18),
    marginBottom: 4,
  },
  videoCard: {
    width: '100%',
    height: isTablet ? DeviceHeigth * 0.35 : DeviceHeigth * 0.38,
    borderRadius: scale(24),
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 6},
        shadowOpacity: 0.08,
        shadowRadius: 14,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  radialGaugeContainer: {
    position: 'absolute',
    top: scale(20),
    alignSelf: 'center',
    zIndex: 1,
  },
  pedestalPositioner: {
    position: 'absolute',
    bottom: scale(4),
    alignSelf: 'center',
    zIndex: 2,
  },
  video: {
    width: '100%',
    height: '100%',
    zIndex: 3,
  },
});

export default NewExercise;
