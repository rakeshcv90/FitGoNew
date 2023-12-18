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
import {AppColor} from '../../Component/Color';
import {setLaterButtonData} from '../../Component/ThemeRedux/Actions';
import {useDispatch, useSelector} from 'react-redux';
import Bulb from './Bulb';
import ProgressBar from './ProgressBar';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';

const Goal = ({navigation, route}: any) => {
  const {data, nextScreen, gender} = route.params;
  const goalsAnimation = useRef(new Animated.Value(0)).current;

  const dispatch = useDispatch();
  const [selected, setSelected] = useState('');
  const [screen, setScreen] = useState(nextScreen);

  const {defaultTheme, completeProfileData, getLaterButtonData} = useSelector(
    (state: any) => state,
  );
  useEffect(() => {
    setScreen(nextScreen);
    goalsAnimation.setValue(gender == 'M' ? -DeviceWidth : DeviceWidth);
    setTimeout(() => {
      handleImagePress(gender);
    }, 500);
  }, []);

  const toNextScreen = (item: any) => {
    setSelected(item);
    const currentData = [
      {
        gender: gender,
        image:
          gender == 'M'
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

  const handleImagePress = (gender: string) => {
    // Set the selected gender
    const easing = Easing.linear(1);
    console.log(gender, DeviceWidth / 2, -DeviceWidth * 0.4);

    // Animate the translation of the unselected image
    Animated.parallel([
      Animated.timing(goalsAnimation, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
        delay: gender == 'M' ? 1500 : 500, // Delay the return to center animation for a smoother effect
      }),
    ]).start();
    setTimeout(() => {
      // setSelected(gender);
      //   toNextScreen(gender);
    }, 1000);
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
        screen={'Select your Goal'}
        header={
          'Knowing your gender can help us for you based on different metabolic rates.'
        }
      />

      <Animated.View
        style={{
          flexDirection: gender == 'F' ? 'row-reverse' : 'row',
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
          height: DeviceHeigth * 0.6,
          transform: [{translateX: goalsAnimation}],
          width: DeviceWidth,
          marginLeft: gender == 'F' ? 50 : 0,
        }}>
        <View>
          {data &&
            data?.map((item: any, index: number) => {
              if (item?.goal_gender != gender) return;
              // console.log(item);

              return (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.8}
                  onPress={() => toNextScreen(item)}>
                  <View
                    style={[
                      styles.box2,
                      {
                        padding: 10,
                        borderWidth: 0,
                        borderColor: AppColor.WHITE,
                      },
                    ]}>
                    <Image
                      source={{uri: item.goal_image}}
                      resizeMode="contain"
                      style={{
                        height: 30,
                        width: 30,
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
                  </View>
                </TouchableOpacity>
              );
            })}
        </View>
        <Image
          source={{
            uri:
              gender == 'M'
                ? 'https://imagedelivery.net/PG2LvcyKPE1-GURD0XmG5A/fc1e357f-2310-4e50-8087-519663fe9400/public'
                : 'https://imagedelivery.net/PG2LvcyKPE1-GURD0XmG5A/e71b96f8-e68c-462e-baaf-a371b6fbc100/public',
          }}
          style={{height: DeviceHeigth * 0.6, width: DeviceWidth / 2}}
          resizeMode="contain"
        />
      </Animated.View>
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
});
