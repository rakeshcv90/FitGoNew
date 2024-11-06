import {
  Animated,
  Button,
  LogBox,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Svg, {Circle, Defs, G, LinearGradient, Stop} from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

/**
 * Props for the CircleProgress component.
 */
type CircleProgressProps = {
  /**
   * The radius of the circle.
   */
  radius: number;

  /**
   * The width of the circle's stroke.
   * @default 30
   */
  strokeWidth?: number;

  /**
   * Value controlling the progress of the circle.
   */
  progress: number;

  /**
   * Whether the progress animation should be clockwise.
   * @default false
   */
  clockwise?: boolean;

  /**
   * The start angle of the circle in degrees.
   * @default 270
   */
  startAngle?: number;

  /**
   * Array of colors for the gradient if `changingColors` is false.
   * @example ['#ff0000', '#0000ff']
   */
  gradientColors?: Array<string>;
  /**
   * Whether to use a gradient for the progress circle.
   * @default false
   */
  changingColors?: boolean;

  /**
   * Array of colors for the gradient if `changingColors` is true.
   * @example ['#ff0000', '#0000ff']
   */
  changingColorsArray?: Array<string>;

  /**
   * Color stops to use for the gradient when `changingColors` is true.
   * This array should be normalized to match the `inputRange`.
   * @default [0, 100]
   */
  inputRange?: Array<number>;

  /**
   * Any additional components or elements to render inside the circle.
   */
  children?: React.ReactNode;

  /**
   * Container Style
   */
  containerStyle?: StyleProp<ViewStyle>;

  /**
   * Color of BackgroundCircle
   */
  secondayCircleColor?: string;

  /**
   * Fixed Value which will used to get the Stroke Position while animating
   */
  strokeLinecap?: 'round' | 'butt';

  /**
   * Fixed Category Issue wanted to proper 0 at initial
   */
  forCategoryList?: boolean;
};
LogBox.ignoreLogs(['No stops in gradient'])
const CircleProgress: React.FC<CircleProgressProps> = ({
  radius = 60,
  strokeWidth = 30, // Default strokeWidth
  progress,
  clockwise = false, // Default clockwise direction
  startAngle = 270, // Default start angle
  gradientColors = [],
  changingColors = false,
  changingColorsArray = ['#3498db', '#f39c12', '#e74c3c', '#9b59b6', '#2ecc71'],
  inputRange = [0, 100],
  children,
  containerStyle,
  secondayCircleColor,
  strokeLinecap,
  forCategoryList = false
}) => {
  const size = radius * 2.5;
  const circumference = 2 * Math.PI * radius;
  //   const output = circumference - circumference * progress;
  
  const animatedProgress = useRef<Animated.Value>(
    new Animated.Value(0),
  ).current;

  useEffect(() => {
    if(progress == 0){
      animatedProgress.setValue(0)
    }
    Animated.timing(animatedProgress, {
      toValue:
      forCategoryList ? Math.round(progress) > 100 ? 0 : Math.round(progress)
      :  Math.round(progress) == 100 ? 0 : Math.round(progress),
      duration: 500, // Duration of the animation (500ms)
      useNativeDriver: true,
    }).start();
  }, [progress, forCategoryList]);

  // Interpolating the animated value to strokeDashoffset
  const strokeDashoffset = animatedProgress.interpolate({
    inputRange: inputRange,
    outputRange: clockwise ? [circumference, 0] : [0, circumference],
  });
//   console.log(strokeDashoffset, animatedProgress);
  const strokeColorInput =
    changingColorsArray.length == 5
      ? [0, 25, 50, 75, 100]
      : Array(changingColorsArray.length)
          .fill(0)
          .map((_, index) => 100 / index + 1)
          .reverse();

  // Get the stroke color based on the animated progress value
  const strokeColor = animatedProgress.interpolate({
    inputRange: strokeColorInput,
    outputRange: changingColorsArray, // Define colors for each section
  });

  const StopOffset = () =>
    gradientColors.map((item, index) => {
      const offset = 100 - (100 / index + 1) + '%';
      return <Stop key={index} offset={offset} stopColor={item} />;
    });

  const Def = () => (
    <Defs>
      <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        {StopOffset()}
      </LinearGradient>
    </Defs>
  );

  return (
    <View style={styles.container || containerStyle}>
      <Svg height={size} width={size}>
        {!changingColors && <Def />}
        <G rotation={startAngle} origin={`${size / 2}, ${size / 2}`}>
          <Circle
            stroke={secondayCircleColor??'grey'} // Background Circle Color
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
          />
          <AnimatedCircle
            stroke={'red'} // Progress Circle Color
            // stroke={changingColors ? strokeColor : 'url(#grad)'} // Progress Circle Color
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap={strokeLinecap}
          />
        </G>
      </Svg>
      <View style={styles.centerText}>{children}</View>
    </View>
  );
};

export default CircleProgress;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  centerText: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3498db',
  },
  appContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});


// const ProgressCircle = () => {
//   const [progress, setProgress] = useState(0);
//   const [timer, setTimer] = useState(30);

//   const animatedProgress = useRef(new Animated.Value(0)).current; // Animated value for progress

//   const increaseProgress = () => {
//     setProgress(() => (timer == 0 ? 0 : timer - timer));
//   };

//   useEffect(() => {
//     if (timer == 0) return;
//     else
//       setTimeout(() => {
//         setTimer(timer - 1);
//         setProgress(progress + 100 / 30);
//       }, 1000);
//     Animated.timing(animatedProgress, {
//       toValue: progress,
//       duration: 500, // Duration of the animation (500ms)
//       useNativeDriver: true,
//     }).start();
//     console.log(timer, 'strokeDashoffset', progress);
//   }, [timer, progress]);
//   const strokeLinecap = progress >= 100 ? 'butt' : 'round'; // Handle strokeLinecap logic here

//   return (
//     <View style={styles.appContainer}>
//       <CircleProgress
//         radius={60}
//         strokeWidth={20}
//         animatedProgress={animatedProgress}
//         startAngle={270} // Start from the top
//         clockwise={false} // Anticlockwise animation
//         strokeLinecap={strokeLinecap}
//       />
//       <Button title="Increase Progress" onPress={increaseProgress} />
//     </View>
//   );
// };
