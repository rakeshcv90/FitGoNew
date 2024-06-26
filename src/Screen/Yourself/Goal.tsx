import {
  Animated,
  Easing,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Image} from 'react-native';
import {AppColor, Fonts} from '../../Component/Color';
import {setLaterButtonData} from '../../Component/ThemeRedux/Actions';
import {useDispatch} from 'react-redux';
import Bulb from './Bulb';
import ProgressBar from './ProgressBar';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import analytics from '@react-native-firebase/analytics';
import {localImage} from '../../Component/Image';
import LinearGradient from 'react-native-linear-gradient';
import {Card} from './Card';
const Goal = ({navigation, route}: any) => {
  const {data, nextScreen, gender, experience, workout_plans,name} = route?.params;
  const goalsAnimation = useRef(new Animated.Value(0)).current;
  const [selectedB, setSelectedB] = useState(0);
  const dispatch = useDispatch();
  const [selected, setSelected] = useState<any>({});
  const [screen, setScreen] = useState(nextScreen);
  const [goalsData, setGoalsData] = useState([]);

  useEffect(() => {
    setScreen(nextScreen);
    const temp = data?.filter((item: any) => item?.goal_gender == gender);
    setGoalsData(temp);
  }, []);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      startAnimation();
      // for unselecting the item when user hit the back button from next screen
      setSelectedB(0);
    });

    return () => unsubscribe;
  }, [navigation]);
  const toNextScreen = () => {
    const currentData = [
      {
        gender: gender,
        image:
          gender == 'Male'
            ? 'https://imagedelivery.net/PG2LvcyKPE1-GURD0XmG5A/fc1e357f-2310-4e50-8087-519663fe9400/public'
            : 'https://imagedelivery.net/PG2LvcyKPE1-GURD0XmG5A/e71b96f8-e68c-462e-baaf-a371b6fbc100/public',
      },
      {
        goal: selected?.goal_id,
        goal_name: selected?.goal_title,
      },
      {
        experience: experience,
      },
      {
        workout_plans: workout_plans,
      },
    ];
    if (name) {
      currentData.push({name: name });
    }
    dispatch(setLaterButtonData(currentData));
    navigation.navigate('Weight', {nextScreen: screen + 1});
  };

  const GoalData = [
    {
      id: 1,
      img: localImage.WeightLoss,

      txt: 'Loss weight',
      txt1: 'Burn Calories & get the ideal body',
    },
    {
      id: 2,
      img: localImage.BuildMuscle,
      txt: 'Build muscle',
      txt1: 'Build mass & strength',
    },
    {
      id: 3,
      img: localImage.Strength,
      txt: 'Strength',
      txt1: 'Feel more healthy',
    },
  ];
  //animation
  const translateXValues = useRef(
    GoalData?.map(() => new Animated.Value(-DeviceWidth)),
  ).current;
  const startAnimation = () => {
    Animated.stagger(
      300,
      translateXValues.map(
        (
          item, // stagger is used map over an array with a delay eg. 500
        ) =>
          Animated.timing(item, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
      ),
    ).start();
  };
  // selected Buttons
  const SelectedButton = item => {
    setSelected(item);
    setSelectedB(item?.goal_id);
  };
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        backgroundColor: AppColor.WHITE,
      }}>
      <ProgressBar screen={screen} Type />

      <View
        style={{
          marginTop:
            Platform.OS == 'ios' ? -DeviceHeigth * 0.06 : -DeviceHeigth * 0.03,
        }}>
        <Bulb screen={'What is your fitness goal?'} />
      </View>
      <View style={{justifyContent: 'center', marginTop: DeviceHeigth * 0.06}}>
        <Card
          ItemArray={goalsData}
          Ih={37}
          Iw={37}
          selectedB={selectedB}
          translateXValues={translateXValues}
          SelectedButton={SelectedButton}
          Goal
          Styletxt1={styles.txt1}
          Styletxt2={styles.txt2}
        />
      </View>
      <View style={styles.buttons}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            backgroundColor: '#F7F8F8',
            width: 45,
            height: 45,
            borderRadius: 15,
            overflow: 'hidden',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Icons name="chevron-left" size={25} color={'#000'} />
        </TouchableOpacity>
        {selectedB != 0 ? (
          <TouchableOpacity
            onPress={() => {
              toNextScreen();
            }}>
            <LinearGradient
              start={{x: 0, y: 1}}
              end={{x: 1, y: 0}}
              colors={[AppColor.RED,AppColor.RED]}
              style={[styles.nextButton]}>
              <Icons name="chevron-right" size={25} color={'#fff'} />
            </LinearGradient>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

export default Goal;

const styles = StyleSheet.create({
  box: {
    width: DeviceWidth * 0.8,
    height: DeviceHeigth / 7,
    borderRadius: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // overflow: 'hidden',
    backgroundColor: AppColor.WHITE,
    shadowColor: 'rgba(0, 0, 0, 1)',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  box2: {
    width: DeviceWidth * 0.45,
    height: DeviceHeigth * 0.08,
    borderRadius: 20,
    marginBottom: 30,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    // overflow: 'hidden',
    backgroundColor: AppColor.WHITE,
    shadowColor: 'rgba(0, 0, 0, 1)',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  nextButton: {
    backgroundColor: 'white',
    width: 45,
    height: 45,
    borderRadius: 50 / 2,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  animatedButtons: {
    width: DeviceWidth * 0.95,
    padding: 14,
    backgroundColor: AppColor.WHITE,
    margin: 10,
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  txt1: {
    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
    color: AppColor.BLACK,
    fontSize: 17,
    // marginBottom: 7,
  },
  txt2: {
    fontFamily: 'Montserrat-Regular',
    color: AppColor.BLACK,
    fontSize: 14,
  },
  img: {
    width: 45,
    height: 38,
    alignSelf: 'center',
  },
  nextButton1: {
    width: DeviceWidth * 0.95,
    height: 50,
    backgroundColor: '#C21718',
    position: 'absolute',
    bottom: 20,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextTxt: {
    fontFamily: 'Montserrat-SemiBold',
    color: AppColor.WHITE,
    fontSize: 16,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: DeviceWidth * 0.9,
    alignItems: 'center',
    alignSelf: 'center',

    bottom: DeviceHeigth * 0.02,
    position: 'absolute',
  },
});
