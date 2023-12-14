import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Animated,
  FlatList,
  Easing,
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

const BOX_HEIGHT = DeviceHeigth * 0.7;
const ITEM_HEIGHT = 25;

const halfItemCount = Math.floor(BOX_HEIGHT / 7 / ITEM_HEIGHT);
const height = [
  ...Array(halfItemCount + 5).fill(''), // Empty items for the top half
  ...Array(1000)
    .fill(0)
    .map((item: any, index, arr) => parseFloat((index / 10).toFixed(2))),
  ...Array(halfItemCount + 4).fill(''), // Empty items for the bottom half
];
const positions = height.map(
  (item, index) =>
    (item = {
      start: index * ITEM_HEIGHT,
      end: index * ITEM_HEIGHT + ITEM_HEIGHT,
    }),
);

const Height = ({route, navigation}: any) => {
  const {nextScreen} = route.params;

  const {defaultTheme, completeProfileData, getLaterButtonData} = useSelector(
    (state: any) => state,
  );
  const dispatch = useDispatch();
  const [selected, setSelected] = useState('');
  const [screen, setScreen] = useState(nextScreen);
  const [toggle, setToggle] = useState('ft');
  const [currentActiveIndex, setCurrentActiveIndex] = useState(-1);
  useEffect(() => {
    setScreen(nextScreen);
  }, []);
  // useEffect(() => {
  //     if (toggle === 'cm') {
  //       const te: any = height.map(item => parseFloat((item * 30.48).toFixed(2)));
  //       setToggleData(te);
  //     } else {
  //       // const te: any = height.map(item => parseFloat((item / 30.48).toFixed(2)));
  //       setToggleData(height);
  //     }
  //   }, [toggle]);

  const toNextScreen = () => {
    const currentData = {
      height: currentActiveIndex,
    };
    dispatch(setLaterButtonData([...getLaterButtonData, currentData]));
    navigation.navigate('Weight', {nextScreen: screen + 1});
  };
  const data = [
    {
      gender: 'M',
      name: 'With\nEquipment',
      image: localImage.WithEquipment,
    },
    {
      gender: 'F',
      name: 'Without\nEquipment',
      image: localImage.WithoutEquipment,
    },
  ];
  const toggleH = ['ft', 'cm'];
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 20,
        backgroundColor: AppColor.WHITE,
      }}>
      <ProgressBar screen={screen} />
      <Bulb
          screen={'What’s your Height?'}
          header={
            'Knowing your height  can help us for you based on different metabolic rates.'
          }
        />
      <View
        style={{
          marginTop: 30,
        }}>
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
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          //   alignSelf: 'flex-start',
          height: DeviceHeigth * 0.6,
          width: DeviceWidth,
        }}>
        <Scale
          h={false}
          setActiveIndex={setCurrentActiveIndex}
          activeIndex={currentActiveIndex}
          data={height}
          posData={positions}
        />
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {currentActiveIndex > 7 ? (
            toggle == 'ft' ? (
              <Text
                style={{
                  color: AppColor.RED,
                  fontSize: 36,
                  fontWeight: '600',
                }}>
                {parseInt(height[currentActiveIndex])}
                <Text
                  style={{
                    color: AppColor.RED,
                    fontSize: 16,
                    fontWeight: '400',
                  }}>
                  {' ft '}
                  <Text
                    style={{
                      color: AppColor.RED,
                      fontSize: 36,
                      fontWeight: '600',
                    }}>
                    {Math.round((height[currentActiveIndex] % 1) * 10)}
                    <Text
                      style={{
                        color: AppColor.RED,
                        fontSize: 16,
                        fontWeight: '400',
                      }}>
                      {' inch '}
                    </Text>
                  </Text>
                </Text>
              </Text>
            ) : (
              <Text
                style={{
                  color: AppColor.RED,
                  fontSize: 36,
                  fontWeight: '600',
                }}>
                {currentActiveIndex}
                <Text
                  style={{
                    color: AppColor.RED,
                    fontSize: 16,
                    fontWeight: '400',
                  }}>
                  {' cm '}
                </Text>
              </Text>
            )
          ) : (
            <Text
              style={{
                color: AppColor.WHITE,
                fontSize: 36,
                fontWeight: '600',
              }}>
              0
            </Text>
          )}
          <Image
            resizeMode="contain"
            source={
              getLaterButtonData[0]?.gender == 'M'
                ? localImage.MaleHeight
                : localImage.FemaleHeight
            }
            style={{
              width: DeviceWidth * 0.45,
              height: DeviceHeigth * 0.35,
            }}
          />
        </View>
      </View>
      <View style={styles.buttons}>
        <TouchableOpacity
          onPress={() =>
            //   selected != '' ? handleImagePress('') :
            navigation.goBack()
          }>
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
    </View>
  );
};

export default Height;

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
    width: (DeviceWidth * 85) / 100,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: -60
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
});
