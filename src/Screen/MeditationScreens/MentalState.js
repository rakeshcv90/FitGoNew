import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  Animated,
  SafeAreaView,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import MeditationTitleComponent from './MeditationTitleComponent';
import Bulb from '../../Screen/Yourself/Bulb';
import {AppColor} from '../../Component/Color';
import {localImage} from '../../Component/Image';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import Carousel from 'react-native-snap-carousel';
import Progressbar from '../../Screen/Yourself/ProgressBar';
import {setMindset_Data} from '../../Component/ThemeRedux/Actions';
import {useDispatch, useSelector} from 'react-redux';
import {color} from 'd3';
const MentalState = ({navigation, route}) => {
  const [getMentalstate, setMentalState] = useState('Normal');
  const {mindSetData} = useSelector(state => state);
  const Dispatch = useDispatch();
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // for unselecting the item when user hit the back button from next screen
      // setSelectedB(0);
    });

    return unsubscribe;
  }, [navigation]);
  const [itemIndex, setItemIndex] = useState(0);
  const {nextScreen} = route.params;
  const [screen, setScreen] = useState(nextScreen);
  const MentalStateData = [
    {
      id: 1,
      txt: 'Normal',
      img: localImage.Normal,
      img1: localImage.face1,
    },
    {
      id: 2,
      txt: 'Stress',
      img: localImage.Stress,
      img1: localImage.face2,
    },
    {
      id: 3,
      txt: 'Anxiety',
      img: localImage.Anxiety,
      img1: localImage.face3,
    },
    {
      id: 4,
      txt: 'Depression',
      img: localImage.Depression,
      img1: localImage.face4,
    },
  ];
  const carouselRef = useRef(null);
  const handleSnapToItem = useCallback(index => {
    setItemIndex(index);
    setMentalState(
      index == 0
        ? 'Normal'
        : index == 1
        ? 'Stress'
        : index == 2
        ? 'Anxiety'
        : index == 3
        ? 'Depression'
        : '',
    );
  }, []);
  const renderItem = ({item, index}) => {
    return (
      <View style={styles.slide}>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.5}
          onPress={() => {
            // navigation.navigate('AlcoholConsent');
            setItemIndex(index);
            setMentalState(item.txt);
            console.log('value', item.txt);
          }}>
          <Text style={styles.txts}>{item.txt}</Text>
          <Image source={item.img} style={styles.img} resizeMode="contain" />
        </TouchableOpacity>
      </View>
    );
  };
  console.log('mental State', mindSetData);
  return (
    <View style={styles.Container}>
      <Progressbar screen={screen} Type />
      <Bulb
        header="Meditation helps in keep your body and mind calm, peaceful and relax."
        screen={'What is your mental state ?'}
      />
      <View
        style={{height: DeviceHeigth * 0.4, marginBottom: DeviceHeigth * 0.05}}>
        <Carousel
          ref={carouselRef}
          data={MentalStateData}
          renderItem={renderItem}
          sliderWidth={DeviceWidth}
          itemWidth={DeviceWidth * 0.6}
          itemHeight={DeviceHeigth * 0.4}
          layout={'default'}
          layoutCardOffset={18}
          inactiveSlideOpacity={0.3}
          inactiveSlideScale={1}
          firstItem={itemIndex}
          enableSnap={true}
          onSnapToItem={handleSnapToItem}
        />
      </View>
      <LinearGradient
        start={{x: 1, y: 0}}
        end={{x: 0, y: 1}}
        colors={['#941000', '#D5191A']}
        style={[styles.bottomProgressbar]}>
        {MentalStateData?.map((value, index) => (
          <>
            <TouchableOpacity
              key={index}
              style={{
                width: 20,
                height: 20,
                backgroundColor: AppColor.WHITE,
                borderRadius: 25 / 2,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                setMentalState(value.txt);
                carouselRef.current.snapToItem(index);
              }}>
              {itemIndex == index ? (
                <Image
                  source={value.img1}
                  style={{width: 30, height: 30}}
                  resizeMode="contain"
                />
              ) : (
                <View
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 10 / 2,
                    backgroundColor: AppColor.WHITE,
                    ...Platform.select({
                      ios: {
                        shadowColor: '#000000',
                        shadowOffset: {width: 0, height: 2},
                        shadowOpacity: 0.3,
                        shadowRadius: 4,
                      },
                      android: {
                        elevation: 5,
                      },
                    }),
                  }}></View>
              )}
              <Text
                style={{
                  position: 'absolute',
                  bottom: -45,
                  padding: 2,
                  width: 100,
                  textAlign: 'center',
                  color: itemIndex == index ? AppColor.RED : AppColor.DARKGRAY,
                  fontSize: itemIndex == index ? 15 : 12,
                  fontFamily: 'Poppins-SemiBold',
                  textAlign: 'center',
                }}>
                {value.txt}
              </Text>
            </TouchableOpacity>
          </>
        ))}
      </LinearGradient>
      {/* <View
        style={{
          width: DeviceWidth*0.90,
          justifyContent: 'space-between',
          flexDirection: 'row',
         
        }}>
        {MentalStateData?.map((value, index) => (
          <View key={index} style={{}}>
            <Text
              style={{
                color: itemIndex == index ? AppColor.RED : AppColor.DARKGRAY,
                fontSize: itemIndex == index ? 18 : 12,
                fontFamily: 'Poppins-SemiBold',
                textAlign: 'center',
                paddingVertical:10
              }}>
              {value.txt}
            </Text>
          </View>
        ))}
      </View> */}
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
        <TouchableOpacity
          onPress={() => {
            Dispatch(
              setMindset_Data([...mindSetData, {mState: getMentalstate}]),
            );
            navigation.navigate('AlcoholConsent', {nextScreen: screen + 1});
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
    </View>
  );
};
const styles = StyleSheet.create({
  Container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor:AppColor.WHITE
  },
  img: {
    width: DeviceWidth * 0.6,
    height: DeviceHeigth * 0.25,
  },
  button: {
    // width: DeviceWidth * 0.9,
    // height: DeviceHeigth *0.8,
    marginVertical: DeviceHeigth * 0.015,
    borderRadius: 20,
    backgroundColor: 'transparent',
    // justifyContent:'center',
    alignItems: 'center',
    // flexDirection: 'row',
    // borderWidth:1
  },
  txts: {
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
    marginBottom: DeviceHeigth * 0.03,
    fontSize: 25,
    color: AppColor.RED,
  },
  slide: {
    justifyContent: 'center',
    alignItems: 'center',
    height: DeviceHeigth * 0.4,
  },
  bottomProgressbar: {
    width: DeviceWidth * 0.8,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
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
export default MentalState;
