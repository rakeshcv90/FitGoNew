// import {View, Text, StyleSheet, StatusBar, Button} from 'react-native';
// import React, {useEffect, useRef, useState} from 'react';
// import DietPlanHeader from '../../Component/Headers/DietPlanHeader';
// import AnimatedLottieView from 'lottie-react-native';
// import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
// import {Fonts} from '../../Component/Color';

// const Breath = () => {
//   const [timerId, setTimerId] = useState(null);
//   const [timeLeft, setTimeLeft] = useState(45);
//   const [timerCompleted, setTimerCompleted] = useState(false);
//   const [play, setPlay] = useState(false);
//   const animation = useRef(null);
//   useEffect(() => {
//     if (timeLeft <= 0 && timerId) {
//       clearTimeout(timerId);
//       clearInterval(timerId); // Clear interval as well
//       setTimerCompleted(true);
//     }
//   }, [timeLeft]);

//   const startTimer = () => {
//     setTimerCompleted(false);
//     setTimeLeft(45); // Reset time
    
//     setPlay(true)
//     animation.current.play();
//     const id = setTimeout(() => {
//       console.log('45 seconds have passed');
//       setTimeLeft(0); // Reset or perform any action after the timer completes
//     }, 45000);

//     setTimerId(id);

//     const intervalId = setInterval(() => {
//       setTimeLeft(prevTimeLeft => prevTimeLeft - 1);
//     }, 1200);

//     setTimerId(intervalId);
//   };

//   const stopTimer = () => {
//     if (timerId) {
//       clearTimeout(timerId);
//       clearInterval(timerId); // Clear interval as well
//       setTimerId(null);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <DietPlanHeader
//         header={'Breath'}
//         // SearchButton={
//         //   route?.params?.focusedPart == 'Full Body' ? false : true
//         // }
//         shadow
//         backPressCheck={true}
//         onPress={() => {
//           console.log('ZXczxczx')
//           setPlay(false)
//           animation.current.pause();
//         }}
//         onPressImage={() => {}}
//         source={require('../../Icon/Images/NewImage2/filter.png')}
//       />
//       <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />
//       <View style={{flex: 6, justifyContent: 'center', alignItems: 'center'}}>
//         <AnimatedLottieView
//         ref={animation}
//           source={require('../../Icon/Images/InAppRewards/breath.json')}
//           speed={2}
//           autoPlay={play}
//           loop={true}
//           resizeMode="contain"
//           style={{width: '100%', height: DeviceHeigth * 0.45, top: -50}}
//         />
//       </View>
//       <View
//         style={{
//           flex: 3,

//           justifyContent: 'center',
//           alignItems: 'center',
//           top: -100,
//         }}>
//         <Text
//           style={{
//             fontFamily: Fonts.MONTSERRAT_BOLD,
//             fontSize: 30,
//           }}>{`${timeLeft} seconds`}</Text>
//         <Button onPress={startTimer} title="Start Timer" />
//       </View>
//       <View style={{flex: 1, backgroundColor: 'red'}}></View>
//     </View>
//   );
// };
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FDFDFD',
//   },
// });
// export default Breath;
import { View, Text, StyleSheet, StatusBar, Button } from 'react-native';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import DietPlanHeader from '../../Component/Headers/DietPlanHeader';
import AnimatedLottieView from 'lottie-react-native';
import { DeviceHeigth } from '../../Component/Config';
import { Fonts } from '../../Component/Color';
import { useFocusEffect } from '@react-navigation/native';

const Breath = () => {
  const [timerId, setTimerId] = useState(null);
  const [timeLeft, setTimeLeft] = useState(45);
  const [play, setPlay] = useState(false);
  const animation = useRef(null);

  useEffect(() => {
    if (timeLeft <= 0 && timerId) {
      clearTimeout(timerId);
      clearInterval(timerId); // Clear interval as well
      setTimeLeft(0);
      setPlay(false);
    }
  }, [timeLeft]);

  const startStopTimer = () => {
    if (play) {
      stopTimer();
    } else {
      startTimer();
    }
  };

  const startTimer = () => {
    setTimeLeft(45); // Reset time
    setPlay(true);
    animation.current.play();

    const id = setTimeout(() => {
      console.log('45 seconds have passed');
      animation.current.pause();
      setTimeLeft(0); // Reset or perform any action after the timer completes
    }, 45000);

    setTimerId(id);

    const intervalId = setInterval(() => {
      setTimeLeft(prevTimeLeft => Math.max(prevTimeLeft - 1, 0));
    }, 1000);

    setTimerId(intervalId);
  };

  const stopTimer = () => {
    if (timerId) {
      clearTimeout(timerId);
      clearInterval(timerId); // Clear interval as well
      setTimerId(null);
      setPlay(false);
      animation.current.pause();
    }
  };

  useFocusEffect(
    useCallback(() => {
      return () => {
        stopTimer();
      };
    }, [])
  );

  return (
    <View style={styles.container}>
      <DietPlanHeader
        header={'Breath'}
        shadow
        backPressCheck={true}
        onPress={() => {
          console.log('Back button pressed');
          stopTimer();
        }}
        onPressImage={() => {}}
        source={require('../../Icon/Images/NewImage2/filter.png')}
      />
      <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />
      <View style={{ flex: 6, justifyContent: 'center', alignItems: 'center' }}>
        <AnimatedLottieView
          ref={animation}
          source={require('../../Icon/Images/InAppRewards/breath.json')}
          speed={2}
          autoPlay={play}
          loop={true}
          resizeMode="contain"
          style={{ width: '100%', height: DeviceHeigth * 0.45, top: -50 }}
        />
      </View>
      <View
        style={{
          flex: 3,
          justifyContent: 'center',
          alignItems: 'center',
          top: -100,
        }}>
        <Text
          style={{
            fontFamily: Fonts.MONTSERRAT_BOLD,
            fontSize: 30,
          }}>{`${timeLeft} seconds`}</Text>
        <Text
          style={{
            fontFamily: Fonts.MONTSERRAT_BOLD,
            fontSize: 20,
            marginBottom: 20,
          }}>
          {play && timeLeft % 2 === 0 ?  'Breath Out': 'Breath In'}
        </Text>
        <Button onPress={startStopTimer} title={play ? "Stop Timer" : "Start Timer"} />
      </View>
      <View style={{ flex: 1, backgroundColor: 'red' }}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFDFD',
  },
});

export default Breath;
