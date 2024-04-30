import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Animated,
  FlatList,
  Easing,
  ImageBackground,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Image} from 'react-native';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import {AppColor} from '../../Component/Color';
import {localImage} from '../../Component/Image';
import LinearGradient from 'react-native-linear-gradient';
import ProgressBar from './ProgressBar';
import Bulb from './Bulb';
import {setLaterButtonData} from '../../Component/ThemeRedux/Actions';
import {useDispatch, useSelector} from 'react-redux';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import Scale from './Scale';
import Toggle from '../../Component/Toggle';
import {showMessage} from 'react-native-flash-message';
import CustomPicker from '../../Component/CustomPicker';

const BOX_HEIGHT = DeviceHeigth * 0.7;
const ITEM_HEIGHT = 25;

const halfItemCount = Math.floor(BOX_HEIGHT / 7 / ITEM_HEIGHT);
const height = [
  // ...Array(halfItemCount + 5).fill(''), // Empty items for the top half
  ...Array(2500)
    .fill(0)
    .map((item: any, index, arr) => index / 10),
  // ...Array(halfItemCount + 4).fill(''), // Empty items for the bottom half
];
const positions = height.map(
  (item: any, index) =>
    (item = {
      start: index * ITEM_HEIGHT,
      end: index * ITEM_HEIGHT + ITEM_HEIGHT,
    }),
);
const WeightArray: any = [];
for (let i = 40; i <= 150; i++) {
  WeightArray.push(i);
}
const Weight = ({route, navigation}: any) => {
  const {nextScreen} = route.params;

  const defaultTheme = useSelector((state: any) => state.defaultTheme);
  const completeProfileData = useSelector(
    (state: any) => state.completeProfileData,
  );
  const getLaterButtonData = useSelector(
    (state: any) => state.getLaterButtonData,
  );
  const dispatch = useDispatch();
  const [selected, setSelected] = useState(40);
  const ref = useRef(selected);
  const [targetSelected, setTargetSelected] = useState(false);
  const [screen, setScreen] = useState(nextScreen);
  const [toggle, setToggle] = useState('kg');
  const [currentActiveIndex, setCurrentActiveIndex] = useState(-1);
  const translateTarget = useRef(new Animated.Value(DeviceHeigth * 2)).current;
  const translateCurrent = useRef(new Animated.Value(0)).current;
  const mergedObject = Object.assign({}, ...getLaterButtonData);
  const [targetWeight, setTargetWeight] = useState(40);
  const [BackHight, setBackHight] = useState(0);
  const [getActiveIndex, setActiveIndex] = useState(0);
  useEffect(() => {
    setScreen(nextScreen);
  }, []);
  const handleAnimation = (weight: number) => {
    setTimeout(() => {
      if (targetSelected) {
        setTargetSelected(false);
        setScreen(screen - 1);
      } else {
        setSelected(weight);

        setTargetSelected(true);
        setScreen(screen + 1);
      }
    }, 700);
    Animated.parallel([
      Animated.timing(translateCurrent, {
        toValue: targetSelected ? 0 : -DeviceHeigth,
        duration: 500,
        useNativeDriver: true,
        delay: 500,
      }),
      Animated.timing(translateTarget, {
        toValue: targetSelected ? DeviceHeigth / 3 : -DeviceHeigth / 3,
        // toValue: selected == 'M' ? 0 : DeviceWidth / 2,
        duration: 500,
        useNativeDriver: true,
        delay: 500, // Delay the return to center animation for a smoother effect
      }),
    ]).start();
  };
  const toNextScreen = (weight: any) => {
    const currentData = {
      currentWeight: toggle == 'kg' ? selected : (selected * 2.2).toFixed(2),
      targetWeight: weight,
      type: toggle,
    };
    if (mergedObject.goal_name == 'Weight Loss' && selected <= weight) {
      showMessage({
        message: 'Target weight can not be greater than Current Weight',
        floating: true,
        duration: 2000,
        type: 'danger',
        icon: {icon: 'auto', position: 'left'},
      });
    } else if (weight != selected) {
      {
      }
      dispatch(setLaterButtonData([...getLaterButtonData, currentData]));
      navigation.navigate('WorkoutArea', {nextScreen: screen + 1});
    } else {
      showMessage({
        message: 'Current Weight can not be equal to Target weight',
        floating: true,
        duration: 500,
        type: 'danger',
        icon: {icon: 'auto', position: 'left'},
      });
    }
  };

  const toggleH = ['kg', 'lb'];
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: AppColor.WHITE,
       
        // height: DeviceHeigth * 0.8,
      }}>
      <Animated.View
        style={{
          width: DeviceWidth,
          transform: [{translateY: translateCurrent}],
          justifyContent: 'center',
          alignItems: 'center',
          // backgroundColor: AppColor.RED,
          height: DeviceHeigth * 0.54,
          top:-DeviceHeigth*0.05
        }}>
        <ProgressBar screen={screen} />
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Bulb
            screen={'What’s your Current weight?'}
    
          />
          <View style={{marginTop: 20}} />
          <Toggle
            data={toggleH}
            highlightColor={AppColor.RED}
            baseColor={AppColor.SOCIALBUTTON}
            selected={toggle}
            setSelected={setToggle}
          />
        </View>

        <ImageBackground
          resizeMode="contain"
          source={
            getLaterButtonData[0]?.gender == 'Male'
              ? localImage.MaleWeight
              : localImage.FemaleWeight
          }
          style={{
            flexDirection: 'row',
            width: DeviceWidth,
            height: DeviceHeigth * 0.55,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          imageStyle={{
            width: DeviceWidth,
            height: DeviceHeigth * 0.5,
            opacity: 0.3,
            marginLeft: -10,
          }}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              // backgroundColor: 'red',
              height: DeviceHeigth * 0.4,
            }}>
            <View style={{marginTop: DeviceHeigth * 0.08}}>
              <CustomPicker
                items={WeightArray}
                onIndexChange={index => {
                  setSelected(WeightArray[index]);
                }}
                itemHeight={80}
                toggle={toggle}
                ActiveIndex={currentActiveIndex}
              />
            </View>
            <View style={{height: DeviceHeigth * 0.2}} />
          </View>
        </ImageBackground>
        <View
          style={[
            styles.buttons,
            {
              // bottom: -DeviceHeigth * 0.17,
            },
          ]}>
          <TouchableOpacity
            style={{
              backgroundColor: '#F7F8F8',
              width: 45,
              height: 45,
              borderRadius: 15,
              overflow: 'hidden',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() =>
              //   selected != '' ? handleImagePress('') :
              navigation.goBack()
            }>
            <Icons name="chevron-left" size={25} color={'#000'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleAnimation(selected)}>
            <LinearGradient
              start={{x: 0, y: 1}}
              end={{x: 1, y: 0}}
              colors={[AppColor.RED1, AppColor.RED]}
              style={[styles.nextButton]}>
              <Icons name="chevron-right" size={25} color={'#fff'} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Animated.View>
      <Animated.View
        style={{
          // flexDirection: 'row',
          // justifyContent: 'flex-start',
          // alignItems: 'center',
          //   alignSelf: 'flex-start',
          height: DeviceHeigth * 0.58,
          width: DeviceWidth,
          transform: [{translateY: translateTarget}],
          backgroundColor: AppColor.WHITE,
          display: targetSelected ? 'flex' : 'none',
          justifyContent: 'center',
          alignItems: 'center',
          top:-DeviceHeigth*0.05
        }}>
        <ProgressBar screen={screen} />
        <View
          style={{
            // marginTop: 30,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Bulb
            screen={'What’s your Target weight?'}
          />
          <View style={{marginTop: 20}} />
          <Toggle
            data={toggleH}
            highlightColor={AppColor.RED}
            baseColor={AppColor.SOCIALBUTTON}
            selected={toggle}
            setSelected={setToggle}
          />
        </View>

        <ImageBackground
          resizeMode="contain"
          source={
            getLaterButtonData[0]?.gender == 'Male'
              ? localImage.MaleWeight
              : localImage.FemaleWeight
          }
          style={{
            flexDirection: 'row',
            width: DeviceWidth,
            height: DeviceHeigth * 0.45,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          imageStyle={{
            width: DeviceWidth,
            height: DeviceHeigth * 0.45,
            opacity: 0.3,
            marginLeft: -10,
          }}>
          {/* <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              // backgroundColor: 'red',
              height: DeviceHeigth * 0.4,
            }}>
            <View style={{height: DeviceHeigth * 0.05}} />
            {currentActiveIndex > 7 ? (
              toggle == 'kg' ? (
                <Text
                  style={{
                    color: AppColor.RED,
                    fontSize: 36,
                    fontWeight: '600',
                  }}>
                  {height[currentActiveIndex]}
                  <Text
                    style={{
                      color: AppColor.RED,
                      fontSize: 16,
                      fontWeight: '400',
                    }}>
                    {' kg '}
                  </Text>
                </Text>
              ) : (
                <Text
                  style={{
                    color: AppColor.RED,
                    fontSize: 36,
                    fontWeight: '600',
                  }}>
                  {(height[currentActiveIndex] * 2.2).toFixed(2)}
                  <Text
                    style={{
                      color: AppColor.RED,
                      fontSize: 16,
                      fontWeight: '400',
                    }}>
                    {' lbs '}
                  </Text>
                </Text>
              )
            ) : (
              <Text
                style={{
                  color: AppColor.RED,
                  fontSize: 36,
                  fontWeight: '600',
                }}>
                0 kg
              </Text>
            )}
            {/* </View> */}
          {/* <View style={{position: 'absolute', top: 100}}>
              <Scale
                h={true}
                setActiveIndex={setCurrentActiveIndex}
                activeIndex={currentActiveIndex}
                data={height}
                posData={positions}
                activeItem={currentActiveIndex}
              />
            </View>
            <View style={{height: DeviceHeigth * 0.2}} />
          </View>  */}
          <CustomPicker
            items={WeightArray}
            onIndexChange={index => setTargetWeight(WeightArray[index])}
            itemHeight={60}
            toggle={toggle}
          />
        </ImageBackground>
        <View>
          <View style={[styles.buttons,{bottom: -DeviceHeigth * 0.2,}]}>
            <TouchableOpacity
              style={{
                backgroundColor: '#F7F8F8',
                width: 45,
                height: 45,
                borderRadius: 15,
                overflow: 'hidden',
                justifyContent: 'center',

                alignItems: 'center',
              }}
              onPress={() =>
                //   selected != '' ? handleImagePress('') :
                {
                  setBackHight(1);
                  targetSelected ? handleAnimation(0) : navigation.goBack();
                }
              }>
              <Icons name="chevron-left" size={25} color={'#000'} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                toNextScreen(
                  toggle == 'kg'
                    ? targetWeight
                    : (targetWeight * 2.2).toFixed(2),
                )
              }>
              <LinearGradient
                start={{x: 0, y: 1}}
                end={{x: 1, y: 0}}
                colors={[AppColor.RED1, AppColor.RED]}
                style={{
                  backgroundColor: 'red',
                  width: DeviceWidth * 0.35,
                  height: 45,
                  borderRadius: 50 / 2,
                  overflow: 'hidden',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                }}>
                <Text
                  style={{
                    color: AppColor.WHITE,
                    fontFamily: 'Poppins',
                    fontWeight: '500',
                    fontSize: 14,
                    lineHeight: 24,
                  }}>
                  Save your target
                </Text>
                {/* <Icons name="chevron-right" size={25} color={'#fff'} /> */}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

export default Weight;

const styles = StyleSheet.create({
  box: {
    width: DeviceWidth * 0.8,
    height: DeviceHeigth / 10,
    borderRadius: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // overflow: 'hidden',
    backgroundColor: '#fff',
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
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: DeviceWidth * 0.9,
    alignItems: 'center',
    alignSelf: 'center',
    position: 'absolute',
    bottom: -DeviceHeigth * 0.2,
  },
  nextButton: {
    backgroundColor: 'red',
    width: 45,
    height: 45,
    borderRadius: 50 / 2,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttons1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: DeviceWidth * 0.9,
    alignItems: 'center',
    alignSelf: 'center',

    bottom: DeviceHeigth * 0.02,
    position: 'absolute',
  },
});
