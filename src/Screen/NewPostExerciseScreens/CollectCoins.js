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
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../Component/Config';
import {AppColor} from '../../Component/Color';
import NewButton from '../../Component/NewButton';
import AnimatedNumber from 'react-native-animated-numbers';
import axios from 'axios';
import {useSelector} from 'react-redux';
import moment from 'moment';

const WeekArray = Array(7)
  .fill(0)
  .map(
    (item, index) =>
      (item = moment()
        .add(index, 'days')
        .subtract(moment().isoWeekday() - 1, 'days')
        .format('dddd')),
  );
const CollectCoins = ({navigation, route}) => {
  const {day, allExercise, type} = route?.params;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const moveAnim = useRef(new Animated.Value(0)).current;
  const fadeView = useRef(new Animated.Value(0)).current;
  const moveView = useRef(new Animated.Value(0)).current;
  const moveButton = useRef(new Animated.Value(0)).current;
  const fadeButton = useRef(new Animated.Value(0)).current;
  const [count, setCount] = useState(0);
  const [exerciseTime, setExerciseTime] = useState(0);
  const [exerciseCal, setExerciseCal] = useState(0);

  const getUserDataDetails = useSelector(state => state.getUserDataDetails);

  useEffect(() => {
    getEventEarnedCoins();
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
  };

  const getEventEarnedCoins = async () => {
    const payload = new FormData();
    payload.append('user_id', getUserDataDetails?.id);
    payload.append('user_day', WeekArray[day]);
    payload.append('type', type);
    try {
      const res = await axios(
        // 'https://fitme.cvinfotech.in/adserver/public/api/testing_add_coins',
        NewAppapi.POST_API_FOR_COIN_CALCULATION,
        {
          method: 'post',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          data: payload,
        },
      );
      console.log('WEEKLY CAL', res.data, payload);
      if (res.data) {
        console.log('WEEKLY CAL', res.data);
        let complete = res.data?.completed_exercise;
        let totalExerciseTime = 0,
          totalCalories = 0;
        allExercise?.map((item, index) => {
          if (index + 1 <= complete) {
            // Assuming exercise_rest is a string like '30 sec'
            let restPeriod = parseInt(item?.exercise_rest?.split(' ')[0]);
            let numberOfSets = 3; // Assuming each exercise has 3 sets
            totalExerciseTime += restPeriod * numberOfSets;
            totalCalories = parseInt(item?.exercise_calories) + totalCalories;
            console.log(totalCalories, totalExerciseTime);
          }
        });
        setExerciseTime(totalExerciseTime);
        setExerciseCal(totalCalories);
        (complete = 0), (totalCalories = 0), (totalExerciseTime = 0);
        setCount(res.data?.coins);

        // animate();
      }
    } catch (error) {
      console.log('ERRRRRR', error);
    }
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
          // opacity: fadeAnim,
          // transform: [{translateY: moveAnim}],
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
          // {opacity: fadeView, transform: [{translateY: moveView}]},
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
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Helvetica-Bold',
                color: AppColor.BLACK,
              }}>
              +
            </Text>
            {/* <AnimatedNumber
              animateToNumber={count}
              fontStyle={{
                fontSize: 14,
                fontFamily: 'Helvetica-Bold',
                color: AppColor.BLACK,
              }}
              easing={Easing.ease}
              animationDuration={1500}
              // Ensure key changes when count changes to force re-mounting of AnimatedNumber
            /> */}
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
            x{exerciseTime / 60}
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
          // opacity: fadeButton,
          // transform: [{translateY: moveButton}],
        }}>
        <NewButton
          pV={14}
          title={'Collect'}
          onPress={() =>
            navigation?.navigate('CardioPointErns', {
              type: type,
              day: day,
              weeklyTime: exerciseTime,
              weeklyCal: exerciseCal,
              weeklyCoins: count,
              allExercise:allExercise
            })
          }
        />
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
