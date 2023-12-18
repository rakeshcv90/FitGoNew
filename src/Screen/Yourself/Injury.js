import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  FlatList,
  Image,
  TouchableOpacity,
  Animated,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet} from 'react-native';
import {AppColor} from '../../Component/Color';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import {localImage} from '../../Component/Image';
import ProgressBar from './ProgressBar';
import Bulb from './Bulb';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import {showMessage} from 'react-native-flash-message';
import {useDispatch, useSelector} from 'react-redux';
import {setLaterButtonData} from '../../Component/ThemeRedux/Actions';

const Injury = ({route, navigation}) => {
  const dispatch = useDispatch();
  const {nextScreen} = route.params;
  const {getLaterButtonData} = useSelector(state => state);
  const [selectedItems, setSelectedItems] = useState([]);
  const [imageView, setImageVIew] = useState([]);
  const [screen, setScreen] = useState(nextScreen);


  useEffect(() => {
    setScreen(nextScreen);

  }, []);
  const toNextScreen = () => {
    const currentData = {
      injury: imageView,
    };
    {console.log("Injury Screen Data",[...getLaterButtonData, currentData])}
    dispatch(setLaterButtonData([...getLaterButtonData, currentData]));
    navigation.navigate('Height', {nextScreen: screen + 1});
  };

  const buttonName = [
    {
      id: 1,
      text1: 'Shoulder',
      image: require('../../Icon/Images/NewImage/Injury.png'),
    },
    {
      id: 2,
      text1: 'Ankle',
      image: require('../../Icon/Images/NewImage/Injury1.png'),
    },
    {
      id: 3,
      text1: 'Elbow',
      image: require('../../Icon/Images/NewImage/Injury2.png'),
    },
  ];
  const buttonName1 = [
    {
      id: 4,
      text1: 'Knee',
      image: require('../../Icon/Images/NewImage/Injury3.png'),
    },
    {
      id: 5,
      text1: 'Back',
      image: require('../../Icon/Images/NewImage/Injury4.png'),
    },

    // {
    //   id: 7,
    //   text1: 'Back',
    // },
  ];
  const translateXValues = useRef(
    buttonName.map(() => new Animated.Value(-DeviceWidth)),
  ).current;
  useEffect(() => {
    startAnimation();
  }, []);
  const startAnimation = () => {
    Animated.stagger(
      500,
      translateXValues.map(item =>
        Animated.timing(item, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ),
    ).start();
    setTimeout(() => {
      startAnimation1();
    }, 1500);
  };

  const translateXValues1 = useRef(
    buttonName1.map(() => new Animated.Value(DeviceWidth)),
  ).current;

  const startAnimation1 = () => {
    Animated.stagger(
      500,
      translateXValues1.map(item =>
        Animated.timing(item, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ),
    ).start();
  };
  const setImageFocusArea = (itemId, item) => {
    const index = selectedItems.indexOf(itemId);
    const newSelectedItems = [...selectedItems];
    const newImageVIew = [...imageView];
    if (index === -1) {
      if (imageView.length < 2) {
        newSelectedItems.push(itemId);
        newImageVIew.push(item);
      } else {
        showMessage({
          message: 'You Can select only Two Item',
          floating: true,
          duration: 500,
          type: 'danger',
          icon: {icon: 'auto', position: 'left'},
        });
      }
    } else {
      newSelectedItems.splice(index, 1);

      const imageVIewIndex = newImageVIew.indexOf(item);
      if (imageVIewIndex !== -1) {
        newImageVIew.splice(imageVIewIndex, 1);
      }
    }

    setSelectedItems(newSelectedItems);
    setImageVIew(newImageVIew);
  };

  return (
    <SafeAreaView style={styles.Container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />

      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',

          marginTop: DeviceHeigth * 0.05,
        }}>
        <ProgressBar screen={screen} />
      </View>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',

          marginTop: -DeviceHeigth * 0.015,
        }}>
        <Bulb
          screen={'Do you have Injury in any body part?'}
          header={
            'We will filter unsuitable workouts for you, Also you can select 1 or 2 Injuries only'
          }
        />
      </View>
      <View style={{flexDirection: 'row', height: DeviceHeigth * 0.6}}>
        <View
          style={{
            width: DeviceWidth / 2.7,
            height: DeviceHeigth * 0.6,
          }}>
          <View style={{top: DeviceHeigth * 0.03, height: DeviceHeigth * 0.7}}>
            <FlatList
              data={buttonName}
              scrollEnabled={false}
              extraData={({item, index}) => index.toString()}
              renderItem={({item, index}) => {
                const isSelected = selectedItems.includes(item.id);
                return (
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginLeft:
                        item.id == 1
                          ? DeviceWidth * 0.06
                          : item.id == 2
                          ? -DeviceWidth * 0.06
                          : DeviceWidth * 0.06,
                    }}
                    
                  >
                    <Animated.View
                      style={[
                        styles.TextView,
                        {transform: [{translateX: translateXValues[index]}]},
                      ]}>
                      <TouchableOpacity
                      activeOpacity={1}
                        style={{
                          width: 110,
                          height: 110,

                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: 110 / 2,
                          borderWidth: isSelected ? 1 : 0,
                          borderColor: isSelected ? 'red' : AppColor.WHITE,
                        }}
                        onPress={() => {
                          setImageFocusArea(item.id, item.text1);
                        }}>
                        <Image
                          source={item.image}
                          style={styles.Image}
                          resizeMode="contain"
                        />
                      </TouchableOpacity>
                      <Text
                        style={{
                          color: isSelected ? 'red' : '#505050',
                          fontFamily: 'Poppins',
                          fontWeight: '500',
                          marginVertical: 15,
                        }}>
                        {item.text1}
                      </Text>
                    </Animated.View>
                  </View>
                );
              }}
            />
          </View>
        </View>
        <View
          style={{
            height: DeviceHeigth,
          }}>
          <View
            style={{
              height: DeviceHeigth * 0.5,
              left:
                getLaterButtonData[0].gender == 'M'
                  ? -DeviceWidth * 0.2
                  : -DeviceWidth * 0.15,
            }}>
            <Image
              source={
                {uri: getLaterButtonData[0].image}
           
              }
              style={[
                styles.Image,
                {
                  width:
                    getLaterButtonData[0].gender == 'M'
                      ? DeviceWidth * 0.6
                      : DeviceWidth * 0.5,
                  height: DeviceHeigth * 0.6,
                },
              ]}
              resizeMode="contain"
            />
          </View>
        </View>

        <View
          style={{
            width: DeviceWidth / 3,
            height: DeviceHeigth,
          }}>
          <View
            style={{
              top: DeviceHeigth * 0.08,
              height: DeviceHeigth * 0.7,
              left:
                getLaterButtonData[0].gender == 'F'
                  ? -DeviceWidth * 0.25
                  : -DeviceWidth * 0.3,
            }}>
            <FlatList
              data={buttonName1}
              scrollEnabled={false}
              extraData={({item, index}) => index.toString()}
              renderItem={({item, index}) => {
                const isSelected = selectedItems.includes(item.id);
                return (
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginVertical: DeviceHeigth * 0.03,
                    }}>
                    <Animated.View
                      style={[
                        styles.TextView,
                        {transform: [{translateX: translateXValues1[index]}]},
                      ]}>
                      <TouchableOpacity
                        activeOpacity={1}
                        style={{
                          width: 110,
                          height: 110,

                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: 110 / 2,
                          borderWidth: isSelected ? 1 : 0,
                          borderColor: isSelected ? 'red' : AppColor.WHITE,
                        }}
                        onPress={() => {
                          setImageFocusArea(item.id, item.text1);
                        }}>
                        <Image
                          source={item.image}
                          style={styles.Image}
                          resizeMode="contain"
                        />
                      </TouchableOpacity>
                      <Text
                        style={{
                          color: isSelected ? 'red' : '#505050',
                          fontFamily: 'Poppins',
                          fontWeight: '500',
                          marginVertical: 15,
                        }}>
                        {item.text1}
                      </Text>
                    </Animated.View>
                  </View>
                );
              }}
            />
          </View>
        </View>
      </View>
    
      <View style={styles.buttons}>
        <TouchableOpacity onPress={() => {
            const prevPop = getLaterButtonData.pop();
            dispatch(setLaterButtonData(getLaterButtonData));
            navigation.goBack();
          }}
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
      
        <TouchableOpacity
          onPress={() => {
            toNextScreen();
          }}>
          <LinearGradient
            start={{x: 0, y: 1}}
            end={{x: 1, y: 0}}
            colors={['#941000', '#D5191A']}
            style={[styles.nextButton]}>
            <Icons name="chevron-right" size={25} color={'#fff'} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: 'white',
  },

  imageView: {
    flexDirection: 'row',
    width: DeviceWidth,
    height: DeviceHeigth * 0.7,
  },
  shadow: {
    width: DeviceWidth,
  },
  Image: {
    width: 100,
    height: 100,
  },
  textStyle: {
    color: 'black',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Poppins',
  },
  LoginText2: {
    fontSize: 16,
    fontFamily: 'Poppins',
    color: '#3A4750',
    lineHeight: 20,
  },
  Image2: {
    width: DeviceWidth * 0.2,
    height: DeviceHeigth * 0.1,
    marginLeft: DeviceWidth * 0.02,
  },
  TextView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: (DeviceWidth * 85) / 100,
    alignItems: 'center',
    alignSelf: 'center',
    top:
      Platform.OS == 'android'
        ? 0
        : DeviceHeigth == '1024'
        ? DeviceHeigth * 0.04
        : 0,
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
export default Injury;
