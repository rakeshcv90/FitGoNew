import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  FlatList,
  Image,
  TouchableOpacity,
  Animated,
  Platform,
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
import analytics from '@react-native-firebase/analytics';
const Injury = ({route, navigation}) => {
  const dispatch = useDispatch();
  const {nextScreen} = route.params;
  const {getLaterButtonData, completeProfileData, getUserID} = useSelector(
    state => state,
  );
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
   
    dispatch(setLaterButtonData([...getLaterButtonData, currentData]));
    analytics().logEvent(`CV_FITME_INJURY_${imageView}`)
    navigation.navigate('Height', {nextScreen: screen + 1});
  };


  const [bodyPart, setBordyPart] = useState(
    completeProfileData?.injury.filter(
      part => part.injury_title !== 'Back' && part.injury_title !== 'Knee',
    ),
  );

  const [bodyPart2, setBordyPart2] = useState(
    completeProfileData?.injury.filter(
      part =>
        part.injury_title !== 'Shoulder' &&
        part.injury_title !== 'Ankle' &&
        part.injury_title !== 'Shoulders' &&
        part.injury_title !== 'Elbow',
    ),
  );
  const translateXValues = useRef(
    bodyPart.map(() => new Animated.Value(-DeviceWidth)),
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
          duration: 500,
          useNativeDriver: true,
        }),
      ),
    ).start();
    setTimeout(() => {
      startAnimation1();
    }, 1000);
  };

  const translateXValues1 = useRef(
    bodyPart2.map(() => new Animated.Value(DeviceWidth)),
  ).current;

  const startAnimation1 = () => {
    Animated.stagger(
      500,
      translateXValues1.map(item =>
        Animated.timing(item, {
          toValue: 0,
          duration: 500,
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
      if (imageView.length <1) {
        newSelectedItems.push(itemId);
        newImageVIew.push(item);
      } else {
        showMessage({
          message: 'You Can select only One Item',
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
    <View style={styles.Container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />

      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          //position: 'absolute',
          // marginTop:
          //   Platform.OS == 'ios' ? DeviceHeigth * 0.05 : DeviceHeigth * 0.06,
        }}>
        <ProgressBar screen={screen} />
      </View>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Bulb
          screen={'Do you have Injury in any body part?'}
          header={
            'This info will help us guide you to your fitness goals safely and quickly'
          }
        />
      </View>
      <View style={{flexDirection: 'row', height: DeviceHeigth * 0.6}}>
        <View
          style={{
            width: DeviceWidth / 2.7,
            height: DeviceHeigth * 0.6,
          }}>
          <View
            style={{
              top:
                DeviceHeigth <= '667'
                  ? DeviceHeigth * 0.05
                  : DeviceHeigth * 0.05,
              height: DeviceHeigth * 0.7,
            }}>
            <FlatList
              data={bodyPart}
              scrollEnabled={false}
              extraData={({item, index}) => index.toString()}
              renderItem={({item, index}) => {
             
                const isSelected = selectedItems.includes(item.injury_id);
                return (
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginVertical: DeviceHeigth * 0.005,
                    }}>
                    <Animated.View
                      style={[
                        styles.TextView,
                        {transform: [{translateX: translateXValues[index]}]},
                      ]}>
                      <TouchableOpacity
                        activeOpacity={1}
                        style={{
                          width: 85,
                          height: 85,

                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: 110 / 2,
                          borderWidth: isSelected ? 1 : 0,
                          borderColor: isSelected ? 'red' : AppColor.WHITE,
                        }}
                        onPress={() => {
                          setImageFocusArea(item.injury_id, item.injury_title);
                        }}>
                        <Image
                          source={{uri: item.injury_image}}
                          style={styles.Image}
                          resizeMode="contain"
                        />
                      </TouchableOpacity>
                      <Text
                        style={{
                          color: isSelected ? 'red' : '#505050',
                          fontFamily: 'Poppins',
                          fontWeight: '500',
                          top: -5,
                          textAlign: 'center',
                          marginVertical: 5,
                        }}>
                        {item.injury_title}
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
              top:
                DeviceHeigth <= '667'
                  ? DeviceHeigth * 0.02
                  : DeviceHeigth * 0.00,
              left:
                getLaterButtonData[0].gender == 'M'
                  ? -DeviceWidth * 0.2
                  : -DeviceWidth * 0.15,
            }}>
            <Image
              source={{uri: getLaterButtonData[0].image}}
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
              top: DeviceHeigth * 0.1,
              height: DeviceHeigth * 0.7,
              left:
                getLaterButtonData[0].gender == 'F'
                  ? -DeviceWidth * 0.25
                  : DeviceHeigth <= '667'
                  ? -DeviceWidth * 0.25
                  : -DeviceWidth * 0.25,
            }}>
            <FlatList
              data={bodyPart2}
              scrollEnabled={false}
              extraData={({item, index}) => index.toString()}
              renderItem={({item, index}) => {
                const isSelected = selectedItems.includes(item.injury_id);

                return (
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginVertical: -DeviceHeigth * 0.00,
                    }}>
                    <Animated.View
                      style={[
                        styles.TextView,
                        {transform: [{translateX: translateXValues1[index]}]},
                      ]}>
                      <TouchableOpacity
                        activeOpacity={1}
                        style={{
                          width: 85,
                          height: 85,

                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: 110 / 2,
                          borderWidth: isSelected ? 1 : 0,
                          borderColor: isSelected ? 'red' : AppColor.WHITE,
                        }}
                        onPress={() => {
                          setImageFocusArea(item.injury_id, item.injury_title);
                        }}>
                        <Image
                          source={{uri: item.injury_image}}
                          style={styles.Image}
                          resizeMode="contain"
                        />
                      </TouchableOpacity>
                      <Text
                        style={{
                          color: isSelected ? 'red' : '#505050',
                          fontFamily: 'Poppins',
                          fontWeight: '500',
                          top: -5,
                          textAlign: 'center',
                          marginVertical: 5,
                        }}>
                        {item.injury_title}
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
        <TouchableOpacity
          onPress={() => {
            // const prevPop = getLaterButtonData.pop();
            // dispatch(setLaterButtonData(getLaterButtonData));
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
            colors={[AppColor.RED1, AppColor.RED]}
            style={[styles.nextButton]}>
            <Icons name="chevron-right" size={25} color={'#fff'} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  Container: {
    flex: 1,
    justifyContent: 'center',
    //alignItems: 'center',
    width: DeviceWidth,
    backgroundColor: AppColor.WHITE,
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
    width: 80,
    height: 80,
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
});
export default Injury;
