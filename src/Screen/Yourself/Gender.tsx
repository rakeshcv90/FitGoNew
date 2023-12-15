import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Image} from 'react-native';
import {localImage} from '../../Component/Image';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {AppColor} from '../../Component/Color';
import ProgressBar from './ProgressBar';
import Bulb from './Bulb';
import {useDispatch, useSelector} from 'react-redux';
import {setLaterButtonData} from '../../Component/ThemeRedux/Actions';

const Gender = ({route, navigation}: any) => {
  const {data, nextScreen} = route.params;

  const dispatch = useDispatch();
  const [selected, setSelected] = useState('');
  const [screen, setScreen] = useState(nextScreen);
  const translateX = useRef(new Animated.Value(0)).current;
  const translateX1 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setScreen(nextScreen);
  }, []);

  const handleImagePress = (gender: string) => {
    // Set the selected gender
    console.log(gender, selected, DeviceWidth / 2, -DeviceWidth * 0.4);
    if (gender === '') {
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: DeviceWidth / 2,
          duration: 500,
          useNativeDriver: true,
          delay: 250, // Delay the return to center animation for a smoother effect
        }),
        Animated.timing(translateX1, {
          toValue: 0,
          // toValue: selected == 'M' ? 0 : DeviceWidth / 2,
          duration: 500,
          useNativeDriver: true,
          delay: 500, // Delay the return to center animation for a smoother effect
        }),
      ]).start();
      setTimeout(() => {
        setScreen(screen - 1);
        setSelected('');
      }, 1000);
    } else {
      // Animate the translation of the unselected image
      Animated.parallel([
        Animated.timing(gender === 'F' ? translateX : translateX1, {
          toValue: gender == 'F' ? 0 : DeviceWidth / 2,
          duration: 500,
          useNativeDriver: true,
          delay: gender == 'F' ? 500 : 0, // Delay the return to center animation for a smoother effect
        }),
      ]).start();
      setTimeout(() => {
        setSelected(gender);
        setScreen(screen + 1);
      }, 500);
    }
  };
  const toNextScreen = (item: any) => {
    const currentData = [
      {
        gender: selected,
        image:
          selected == 'M'
            ? 'https://imagedelivery.net/PG2LvcyKPE1-GURD0XmG5A/fc1e357f-2310-4e50-8087-519663fe9400/public'
            : 'https://imagedelivery.net/PG2LvcyKPE1-GURD0XmG5A/e71b96f8-e68c-462e-baaf-a371b6fbc100/public',
      },
      {
        goal: item?.goal_id,
      },
    ];
    dispatch(setLaterButtonData(currentData));
    navigation.navigate('Level', {nextScreen: screen + 1});
  };

  const Goal = () => {
    const goalsAnimation = useRef(new Animated.Value(0)).current;

    const startGoalsAnimation = () => {
      Animated.stagger(250, [
        Animated.timing(goalsAnimation, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    };

    useEffect(() => {
      startGoalsAnimation();
    }, []);
    return (
      <Animated.View style={{}}>
        {data &&
          data?.map((item: any, index: number) => {
            if (item?.goal_gender != selected) return;
            // console.log(goalsAnimation);
            const goalAnimationStyle = {
              opacity: goalsAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
              }),
              transform: [
                {
                  translateX: goalsAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange:
                      selected == 'F' ? [0, -index * 5] : [0, index * 5],
                  }),
                },
              ],
            };
            return (
              <TouchableWithoutFeedback
                key={index}
                onPress={() => toNextScreen(item)}>
                <Animated.View
                  style={[
                    styles.box2,
                    goalAnimationStyle,
                    {
                      padding: 10,
                      // paddingRight: 10,
                      borderWidth: 0,
                      borderColor: AppColor.WHITE,
                    },
                  ]}>
                  <Image
                    source={{uri: item.goal_image}}
                    resizeMode="contain"
                    style={{
                      height: 50,
                      width: 40,
                      marginRight: 10,
                    }}
                  />
                  <Text
                    style={{
                      color: '#505050',
                      fontSize: 18,
                      fontWeight: '600',
                      fontFamily: 'Poppins',
                      lineHeight: 27,
                    }}>
                    {item.goal_title}
                  </Text>
                </Animated.View>
              </TouchableWithoutFeedback>
            );
          })}
      </Animated.View>
    );
  };
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: DeviceWidth,
        backgroundColor: AppColor.WHITE,
      }}>
      <ProgressBar screen={screen} />
      {/* <Bulb screen={screen} /> */}
      <Bulb
        screen={'Select your Gender'}
        header={
          'Knowing your gender can help us for you based on different metabolic rates.'
        }
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          alignSelf: 'flex-end',
          height: DeviceHeigth * 0.6,
        }}>
        {/* {selected != 'F' ? ( */}
        <Animated.View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            alignSelf: 'center',
            transform: [{translateX: translateX1}],
            width: selected == 'M' ? DeviceWidth : DeviceWidth / 2,
            marginLeft: 50,
          }}>
          {selected == 'M' && <Goal />}
          <View
            style={{
              width: DeviceWidth / 2,
              alignItems: 'center',
            }}>
            <TouchableWithoutFeedback
              onPress={() => {
                nextScreen == screen && handleImagePress('M');
              }}>
              <Image
                source={{uri:'https://imagedelivery.net/PG2LvcyKPE1-GURD0XmG5A/fc1e357f-2310-4e50-8087-519663fe9400/public'}}
                style={{height: 450, width: 300}}
                resizeMode="contain"
              />
            </TouchableWithoutFeedback>
          </View>
        </Animated.View>
        {/* ) : (
          <View style={{width: DeviceWidth / 2}} />
        )} */}
        <Animated.View
          style={{
            flexDirection: 'row-reverse',
            justifyContent: 'space-around',
            alignItems: 'center',
            alignSelf: 'center',
            transform: [
              {translateX: selected === 'F' ? translateX : translateX1},
            ],
            width: selected == 'F' ? DeviceWidth : DeviceWidth / 2,
            // marginLeft: selected == 'F' ? 50 : 0,
          }}>
          {selected == 'F' && <Goal />}
          <View
            style={{
              width: DeviceWidth / 2,
              alignItems: 'center',
            }}>
            <TouchableWithoutFeedback
              onPress={() => {
                nextScreen == screen && handleImagePress('F');
              }}>
              <Image
                source={{uri:'https://imagedelivery.net/PG2LvcyKPE1-GURD0XmG5A/e71b96f8-e68c-462e-baaf-a371b6fbc100/public'}}
                style={{
                  height: 450,
                  width: 300,
                }}
                resizeMode="contain"
              />
            </TouchableWithoutFeedback>
          </View>
        </Animated.View>
      </View>
      {selected != '' ? (
        <TouchableOpacity
          style={{
            alignSelf: 'flex-start',
            marginLeft: DeviceWidth * 0.1,
            backgroundColor: '#F7F8F8',
            width: 45,
            height: 45,
            borderRadius: 15,
            overflow: 'hidden',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => {
            handleImagePress('');
          }}>
          <Icons name="chevron-left" size={25} color={'#000'} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={{alignSelf: 'flex-start', marginLeft: DeviceWidth * 0.1}}
          onPress={() => {
            null;
          }}>
          <Icons name="chevron-left" size={25} color={'#fff'} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Gender;

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
});
