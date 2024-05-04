import {
  Animated,
  FlatList,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Vibration,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Image} from 'react-native';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import {AppColor} from '../../Component/Color';
import {localImage} from '../../Component/Image';
import LinearGradient from 'react-native-linear-gradient';
import ProgressBar from './ProgressBar';
import Bulb from './Bulb';
import {useDispatch, useSelector} from 'react-redux';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Svg, {
  LinearGradient as SvgGrad,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import {setLaterButtonData} from '../../Component/ThemeRedux/Actions';

import {showMessage} from 'react-native-flash-message';

const GradientText = ({item}: any) => {
  const gradientColors = ['#D5191A', '#941000'];

  return (
    <View>
      <Svg height="50" width="100">
        <SvgGrad id="grad" x1="0" y1="0" x2="100%" y2="0">
          <Stop offset="0" stopColor={gradientColors[0]} />
          <Stop offset="1" stopColor={gradientColors[1]} />
        </SvgGrad>
        <SvgText
          fontFamily="Poppins"
          fontWeight="700"
          fontSize="54"
          fill="url(#grad)"
          x="20"
          y="50">
          {item}
        </SvgText>
      </Svg>
    </View>
  );
};

const BOX_HEIGHT = DeviceWidth;
const ITEM_HEIGHT = 50;

const halfItemCount = Math.floor(BOX_HEIGHT / 2 / ITEM_HEIGHT);
const data = [
  //   ...Array(halfItemCount - 1).fill(''),
  ...Array(80)
    .fill(15)
    .map((item, index) => {
      return item + index;
    }),
];

const positions = data.map(
  (item: any, index) =>
    (item = {
      start: index * ITEM_HEIGHT,
      end: index * ITEM_HEIGHT + ITEM_HEIGHT,
    }),
);
const Age = ({route, navigation}: any) => {
  const {nextScreen} = route.params;
  const translateLevel = useRef(new Animated.Value(0)).current;

  const getLaterButtonData = useSelector(
    (state: any) => state.getLaterButtonData,
  );
  const dispatch = useDispatch();

  const [selected, setSelected] = useState('');
  const [screen, setScreen] = useState(nextScreen);
  const [focused, setFocused] = useState(false);
  const flatListRef = useRef(null);
  //
  useEffect(() => {
    setScreen(nextScreen);
    getActiveItem(15);
  }, []);
  const getActiveItem = (y: number) => {
    const halfBoxH = BOX_HEIGHT * 0.4;
    const Inner = (halfBoxH - ITEM_HEIGHT) / 2;
    const center = y + halfBoxH - Inner;
    for (let index = 0; index < positions.length; index++) {
      const {start, end} = positions[index];
      if (center + 25 >= start && center - 25 <= end) {
        // setSelected(index);
      }
    }
  };

  const toNextScreen = () => {
    if (selected.length == 0) {
      showMessage({
        message: 'Please Enter your Age!!!',
        type: 'danger',
        animationDuration: 500,
        floating: true,
        icon: {icon: 'auto', position: 'left'},
      });
      return;
    } else if (parseInt(selected) < 15) {
      showMessage({
        message: 'You are below 15 !!!',
        type: 'danger',
        animationDuration: 500,
        floating: true,
        icon: {icon: 'auto', position: 'left'},
      });
      return;
    } else if (parseInt(selected) > 60) {
      showMessage({
        message: 'You are over age !!!',
        type: 'danger',
        animationDuration: 500,
        floating: true,
        icon: {icon: 'auto', position: 'left'},
      });
      return;
    }
    const currentData = {
      age: selected,
    };
    dispatch(setLaterButtonData([...getLaterButtonData, currentData]));
    navigation.navigate('PredictionScreen', {nextScreen: screen + 1});
  };
  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => Keyboard.dismiss()}
      style={{
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        // marginTop: 50,
        backgroundColor: AppColor.WHITE,
      }}>
      <ProgressBar screen={screen} />

      <View style={{marginTop: -DeviceHeigth * 0.06,alignSelf:"center"}}>
        <Bulb screen={'How old are you?'} />
      </View>
      {/* <View
        style={{
          // flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          alignSelf: 'center',
          height: DeviceHeigth * 0.6,
          // width: DeviceWidth,
        }}>*/}
      <View
        style={{
          width: DeviceWidth,
          height: DeviceHeigth * 0.58,
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
          // flex: 1
          flexDirection: 'row',

          //top: -DeviceHeigth * 0.1,
        }}>
        <TextInput
          keyboardType="number-pad"
          value={selected}
          onChangeText={text => {
            if (text == '.') {
              showMessage({
                message: 'Wrong Input',
                type: 'danger',
                animationDuration: 500,
                floating: true,
                icon: {icon: 'auto', position: 'left'},
              });
            } else setSelected(text);
          }}
          onFocus={setFocused}
          cursorColor={AppColor.RED}
          placeholder="15"
          autoFocus
          placeholderTextColor={AppColor.GRAY2}
          style={{
            fontSize: 56,
            fontWeight: '600',
            fontFamily: 'Poppins',
            color: AppColor.BLACK,
            borderWidth: 0,
            borderColor: focused ? AppColor.RED : AppColor.GRAY,
            borderBottomWidth: 1,
          }}
        />
        <Text
          style={{
            fontSize: 32,
            fontWeight: '600',
            fontFamily: 'Poppins',
            color: AppColor.BLACK,
            marginLeft: 10,
          }}>
          years old
        </Text>
        {/* <FlatList
          ref={flatListRef}
          data={data}
          horizontal
          onScroll={event => {
            Vibration.vibrate(200);
            const y = event.nativeEvent.contentOffset.x;
            getActiveItem(y);
          }}
          showsHorizontalScrollIndicator={false}
          renderItem={({item, index}: any) => {
            return (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                }}>
                {index == selected ? (
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      alignSelf: 'center',
                      width: 100,
                      height: 100,
                      marginRight: 20,
                      //   backgroundColor: 'blue',
                    }}>
                    <Icon
                      name="arrow-drop-down"
                      color={AppColor.RED}
                      size={20}
                    />
                    <GradientText item={item} />
                    <Text
                      style={{
                        fontSize: 12,
                        lineHeight: 16,
                        fontFamily: 'Poppins',
                        color: '#94989B',
                        marginTop: 10,
                      }}>
                      years old
                    </Text>
                    <Icon name="arrow-drop-up" color={AppColor.RED} size={20} />
                  </View>
                ) : (
                  <Text style={styles.text}>{item}</Text>
                )}
              </View>
            );
          }}
        /> */}
        {/* </View> */}
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
        <TouchableOpacity onPress={toNextScreen}>
          <LinearGradient
            start={{x: 0, y: 1}}
            end={{x: 1, y: 0}}
            colors={['#941000', '#D5191A']}
            style={[styles.nextButton]}>
            <Icons name="chevron-right" size={25} color={'#fff'} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default Age;

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
    bottom: DeviceHeigth * 0.02,
    position: 'absolute',
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
  text: {
    fontSize: 36,
    lineHeight: 54,
    fontFamily: 'Poppins',
    color: '#94989B',
    marginRight: 20,
  },
  selectText: {
    fontSize: 63,
    lineHeight: 96,
    fontFamily: 'Poppins',
    color: AppColor.RED,
  },
});
