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
const MentalState = ({navigation}) => {
  const [itemIndex, setItemIndex] = useState(0);

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
    // console.log(index);
  }, []);
  const renderItem = ({item, index}) => {
    return (
      <View style={styles.slide}>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.5}
          onPress={() => {
            navigation.navigate('Alcohalinfo');
          }}>
          <Text style={styles.txts}>{item.txt}</Text>
          <Image source={item.img} style={styles.img} resizeMode="contain" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.Container}>
      {/* <MeditationTitleComponent Title={'What is your mental state ?'} /> */}
      <Bulb screen={'What is your mental state ?'}header="Meditation helps in keep your body and mind calm, peaceful and relax." />
      <View style={{height: DeviceHeigth * 0.5}}>
        <Carousel
          ref={carouselRef}
          data={MentalStateData}
          renderItem={renderItem}
          sliderWidth={DeviceWidth}
          itemWidth={DeviceWidth * 0.65}
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
          <TouchableOpacity
            key={index}
            style={{
              width: DeviceWidth * 0.09,
              height: DeviceHeigth * 0.04,
              backgroundColor: AppColor.WHITE,
              borderRadius: (DeviceWidth * 0.09 + DeviceHeigth * 0.04) / 2,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => {
              carouselRef.current.snapToItem(index);
            }}>
            {itemIndex == index ? (
              <Image
                source={value.img1}
                style={{width: DeviceWidth * 0.15, height: DeviceHeigth * 0.04}}
                resizeMode="contain"
              />
            ) : (
              <View
                style={{
                  width: 15,
                  height: 15,
                  borderRadius: 15 / 2,
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
          </TouchableOpacity>
        ))}
        {/* <View>{value.txt}</View> */}
      </LinearGradient>
      <View
        style={{
          width: DeviceWidth * 0.95,
          justifyContent: 'space-around',
          flexDirection: 'row',
        }}>
        {MentalStateData?.map((value, index) => (
          <View
            key={index}
            style={{}}>
            <Text
              style={{
                color: itemIndex == index ? AppColor.RED : AppColor.DARKGRAY,
                fontSize: itemIndex == index ? 20 : 16,
                fontFamily: 'Poppins-SemiBold',
                textAlign: 'right',
                padding: 10,
              }}>
              {value.txt}
            </Text>
          </View>
        ))}
      </View>
      <TouchableOpacity
      onPress={()=>{
        navigation.goBack()
      }}
        style={{
          justifyContent: 'flex-end',
          flex: 1,
          marginBottom: DeviceHeigth*0.05,
          alignItems: 'flex-start',
          width: DeviceWidth * 0.9,
        }}>
        <Icons name="chevron-left" size={25} color={AppColor.BLACK} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  Container: {
    flex: 1,
    alignItems: 'center',
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
    height: DeviceWidth * 0.1,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
  },
});
export default MentalState;
