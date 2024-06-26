import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import ProgressBar from './Yourself/ProgressBar';
import Bulb from './Yourself/Bulb';
import {AppColor} from '../Component/Color';
import {DeviceHeigth, DeviceWidth} from '../Component/Config';
import {
  setLaterButtonData,
  setProgressBarCounter,
} from '../Component/ThemeRedux/Actions';
import {useDispatch, useSelector} from 'react-redux';
import {localImage} from '../Component/Image';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Card} from './Yourself/Card';
import LinearGradient from 'react-native-linear-gradient';
const Experience = ({route, navigation}) => {
  const {data, nextScreen, gender, name} = route?.params;
  const [screen, setScreen] = useState(nextScreen);
  const dispatch = useDispatch();
  const getLaterButtonData = useSelector(state => state.getLaterButtonData);
  const getProgressBarCounter = useSelector(
    state => state?.getProgressBarCounter,
  );
  const [selectedB, setSelectedB] = useState(0);
  const [selected, setSelected] = useState();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      startAnimation();
      // for unselecting the item when user hit the back button from next screen
      setSelectedB(0);
    });

    return () => unsubscribe;
  }, [navigation]);
  const ExperienceArray = [
    {
      id: 1,
      txt: 'Experienced',
      img: localImage.Experienced,
    },
    {
      id: 2,
      txt: 'Beginner',
      img: localImage.Begginer,
    },
  ];
  //animation
  const translateXValues = useRef(
    ExperienceArray?.map(() => new Animated.Value(-DeviceWidth)),
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
    setSelectedB(item?.id);
  };
  const handleButtonPress = () => {
    if (selected?.txt != 'Beginner') {
      const params = {
        nextScreen: screen + 1,
        data: data,
        gender: gender,
        experience: selected?.txt,
      };

      if (name) {
        params.name = name;
      }
      dispatch(setProgressBarCounter(getProgressBarCounter + 1));
      navigation.navigate('AskToCreateWorkout', params);
    } else {
      const params = {
        nextScreen: screen + 1,
        data: data,
        gender: gender,
        experience: selected?.txt,
        workout_plans: 'AppCreated',
      };

      if (name) {
        params.name = name;
      }
      navigation.navigate('Goal', params);
    }
  };
  return (
    <View style={styles.Container}>
      <ProgressBar screen={screen} Type />
      <View
        style={{
          marginTop:
            Platform.OS == 'ios' ? -DeviceHeigth * 0.06 : -DeviceHeigth * 0.03,
        }}>
        <Bulb screen={'Choose your fitness level'} />
      </View>

      <View style={{marginTop: DeviceHeigth * 0.06}}>
        <Card
          ItemArray={ExperienceArray}
          Ih={30}
          Iw={40}
          selectedB={selectedB}
          translateXValues={translateXValues}
          SelectedButton={SelectedButton}
          Styletxt1={styles.txt}
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
          <TouchableOpacity onPress={handleButtonPress}>
            <LinearGradient
              start={{x: 0, y: 1}}
              end={{x: 1, y: 0}}
              colors={['#941000', '#D5191A']}
              style={[styles.nextButton]}>
              <Icons name="chevron-right" size={25} color={'#fff'} />
            </LinearGradient>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  Container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: AppColor.WHITE,
  },
  button: {
    flexDirection: 'row',
    width: DeviceWidth * 0.9,
    marginTop: 15,
    borderRadius: 7,
    backgroundColor: AppColor.WHITE,
    alignItems: 'center',
    padding: 10,
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
  txt: {
    paddingVertical: 14,
    fontSize: 19,
    color: AppColor.BLACK,
    fontFamily: 'Montserrat-SemiBold',
    fontWeight: '500',
    textAlign: 'center',
    marginLeft: 15,
  },
  img: {
    height: 28,
    width: 28,
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
  nextButton: {
    backgroundColor: 'white',
    width: 45,
    height: 45,
    borderRadius: 50 / 2,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default Experience;
