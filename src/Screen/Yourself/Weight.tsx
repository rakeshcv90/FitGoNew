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
const WeightArray: any = [];
for (let i = 40; i <= 150; i++) {
  WeightArray.push(i);
}
const Weight = ({route, navigation}: any) => {
  const {nextScreen} = route.params;
  const getLaterButtonData = useSelector(
    (state: any) => state.getLaterButtonData,
  );
  const dispatch = useDispatch();
  const [selected, setSelected] = useState(40);
  const [targetSelected, setTargetSelected] = useState(false);
  const [screen, setScreen] = useState(nextScreen);
  const [toggle, setToggle] = useState('kg');
  const [currentActiveIndex, setCurrentActiveIndex] = useState(-1);
  const translateTarget = useRef(new Animated.Value(DeviceHeigth)).current;
  const translateCurrent = useRef(new Animated.Value(0)).current;
  const mergedObject = Object.assign({}, ...getLaterButtonData);
  const [targetWeight, setTargetWeight] = useState(40);
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
      }),
      Animated.timing(translateTarget, {
        toValue: targetSelected ? DeviceHeigth : 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const toNextScreen = (weight: any) => {
    const currentData = {
      currentWeight: toggle == 'kg' ? selected : (selected * 2.2).toFixed(2),
      targetWeight: weight,
      type: toggle,
    };

    if (mergedObject.goal_name == 'Lose weight' && selected < weight) {
      showMessage({
        message:
          'Your target weight should not be greater than your current weight.',
        floating: true,
        duration: 2000,
        type: 'danger',
        icon: {icon: 'auto', position: 'left'},
      });
    } else if (weight != selected) {
      {
      }
      dispatch(setLaterButtonData([...getLaterButtonData, currentData]));
      navigation.navigate('Age', {nextScreen: screen + 1});
    } else {
      showMessage({
        message: 'Target weight cannot be equal to the current weight.',
        floating: true,
        duration: 500,
        type: 'danger',
        icon: {icon: 'auto', position: 'left'},
      });
    }
  };

  const toggleH = ['kg', 'lb'];
  return (
    <View style={{flex: 1, backgroundColor: AppColor.WHITE}}>
      <Animated.View
        style={{
          width: DeviceWidth,
          height: DeviceHeigth,
          transform: [{translateY: translateCurrent}],
          position: 'absolute',
        }}>
        <ProgressBar screen={screen} />
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <View
            style={{
              marginTop:
                Platform.OS == 'ios'
                  ? -DeviceHeigth * 0.06
                  : -DeviceHeigth * 0.02,
            }}>
            <Bulb screen={'What’s your current weight?'} />
          </View>
          <View style={{marginTop: 20}} />
          <Toggle
            data={toggleH}
            highlightColor={AppColor.RED}
            baseColor={AppColor.SOCIALBUTTON}
            selected={toggle}
            setSelected={setToggle}
          />
        </View>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: DeviceHeigth * 0.4,
            // borderWidth: 1,
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
        </View>
        <View style={[styles.buttons]}>
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
            onPress={() => navigation.goBack()}>
            <Icons name="chevron-left" size={25} color={'#000'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleAnimation(selected)}>
            <LinearGradient
              start={{x: 0, y: 1}}
              end={{x: 1, y: 0}}
              colors={[AppColor.RED, AppColor.RED]}
              style={[styles.nextButton]}>
              <Icons name="chevron-right" size={25} color={'#fff'} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Animated.View>
      <Animated.View
        style={{
          width: DeviceWidth,
          height: DeviceHeigth,
          transform: [{translateY: translateTarget}],
          position: 'absolute',
        }}>
        <ProgressBar screen={screen} />
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: -15,
          }}>
          <Bulb screen={'What’s your target weight?'} />
          <View style={{marginTop: 20}} />
          <Toggle
            data={toggleH}
            highlightColor={AppColor.RED}
            baseColor={AppColor.SOCIALBUTTON}
            selected={toggle}
            setSelected={setToggle}
          />
        </View>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: DeviceHeigth * 0.4,
            // borderWidth: 1,
          }}>
          <View style={{marginTop: DeviceHeigth * 0.08}}>
            <CustomPicker
              items={WeightArray}
              onIndexChange={index => {
                setTargetWeight(WeightArray[index]);
              }}
              itemHeight={80}
              toggle={toggle}
              ActiveIndex={currentActiveIndex}
            />
          </View>
        </View>
        <View style={[styles.buttons]}>
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
            onPress={() => handleAnimation(targetWeight)}>
            <Icons name="chevron-left" size={25} color={'#000'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => toNextScreen(targetWeight)}>
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
    </View>
  );
};
export default Weight;
const styles = StyleSheet.create({
  header: {
    height: Platform.OS === 'ios' ? DeviceHeigth * 0.12 : DeviceHeigth * 0.1,
    backgroundColor: AppColor.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    color: AppColor.BLACK,
    fontSize: 16,
  },
  container: {
    backgroundColor: AppColor.BACKGROUNG,
    flex: 1,
  },
  button: {
    backgroundColor: AppColor.SOCIALBUTTON,
    height: 48,
    borderRadius: 20,
    width: DeviceWidth - 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomButton: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginTop:
      Platform.OS === 'ios' ? DeviceHeigth * 0.06 : DeviceHeigth * 0.08,
  },
  nextButton: {
    width: 45,
    height: 45,
    borderRadius: 45 / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttons: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: DeviceHeigth * 0.1,
    width: DeviceWidth * 0.9,
    alignSelf: 'center',
  },
});
