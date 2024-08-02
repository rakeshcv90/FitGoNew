import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  StatusBar,
  Image,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {localImage} from '../../Component/Image';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import {AppColor} from '../../Component/Color';
import NewButton from '../../Component/NewButton';
import AnimatedLottieView from 'lottie-react-native';
import Carousel from 'react-native-snap-carousel';
const BreathSessionInfo = () => {
  const exerciseData = [
    {id: 1, img: localImage.FitCoin, txt1: '+2', txt2: 'Fitcoins'},
    {id: 1, img: localImage.timer3d, txt1: 'x30', txt2: 'Seconds'},
    {id: 1, img: localImage.fire3d, txt1: `${10}Kcal`, txt2: 'Calories'},
  ];
  const fadeInAnimation = useRef(
    exerciseData.map(() => new Animated.Value(0)),
  ).current;
  const fadeOutAnimation = useRef(
    exerciseData.map(() => new Animated.Value(1)),
  ).current;
  const moveView = useRef(new Animated.Value(0)).current;
  const moveViewIn = useRef(new Animated.Value(-DeviceWidth)).current;
  const [animationEnded, setAnimationEnded] = useState(false);
  const [inAnimation, setInAnimation] = useState(true);

  useEffect(() => {
    startAninmation();
    setTimeout(() => {
      endAninmation();
    }, 2500);
  }, []);
  const startAninmation = () => {
    Animated.stagger(
      500,
      fadeInAnimation.map(item =>
        Animated.timing(item, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ),
    ).start(() => {
      setInAnimation(false);
    });
  };
  const endAninmation = () => {
    Animated.stagger(
      500,
      fadeOutAnimation.map(item =>
        Animated.timing(item, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ),
    ).start(() => {
      moveAnimation();
    });
  };
  const moveAnimation = () => {
    Animated.timing(moveView, {
      toValue: DeviceWidth,
      duration: 400,
      useNativeDriver: true,
    }).start(() => {
      setAnimationEnded(true);
      setTimeout(() => {
        moveNewView();
      }, 100);
    });
  };
  const moveNewView = () => {
    Animated.spring(moveViewIn, {
      toValue: 0,
      bounciness: 5,
      speed: 3,
      useNativeDriver: true,
    }).start();
  };
  const cardData = [
    {
      id: 1,
      img: localImage.sun,
      txt1: 'Morning Energizer',
      txt2: '6AM-7AM',
    },
    {
      id: 1,
      img: localImage.sun1,
      txt1: 'Afternoon Refresher',
      txt2: '11AM-12PM',
    },
    {
      id: 1,
      img: localImage.dawn,
      txt1: 'Deep Relax',
      txt2: '4PM-5PM',
    },
    {
      id: 1,
      img: localImage.cnight,
      txt1: 'Night',
      txt2: '7PM-8PM',
    },
  ];

  const BreathingCards = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const renderItem = ({item, index}) => (
      <>
        <TouchableOpacity
          style={[styles.button, {borderColor: AppColor.ORANGE}]}
          key={index}>
          <View
            style={{
              position: 'absolute',
              right: 8,
              top: 7,
              flexDirection: 'row',
            }}>
            <View
              style={{
                backgroundColor: AppColor.ORANGE,
                overflow: 'hidden',
                marginRight: 4,
                padding: 4,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 100,
              }}>
              <Image
                source={localImage.Lock}
                style={{width: 16, height: 16}}
                resizeMode="contain"
                tintColor={AppColor.WHITE}
              />
            </View>
            <View
              style={{
                backgroundColor: AppColor.ORANGE,
                borderRadius: 18,
                paddingHorizontal: 10,
                paddingVertical: 2,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: AppColor.WHITE,
                  fontFamily: 'Helvetica-Bold',
                  fontSize: 11,
                }}>
                Upcoming
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: 13,
              marginVertical: DeviceHeigth * 0.045,
            }}>
            <Image
              source={item?.img}
              style={{height: 50, width: 50}}
              resizeMode="contain"
            />
            <View style={{marginLeft: 10}}>
              <Text style={styles.t2}>{item.txt1}</Text>
              <Text style={{color: AppColor.ORANGE, fontFamily: 'Helvetica'}}>
                {item.txt2}
              </Text>
            </View>
          </View>
          <View style={[styles.sticker, {backgroundColor: AppColor.ORANGE}]}>
            <Text
              style={{
                color: AppColor.WHITE,
                fontFamily: 'Helvetica-Bold',
                top: 2,
              }}>
              +2
            </Text>
            <Image
              source={localImage.FitCoin}
              style={{height: 25, width: 25, marginLeft: 3}}
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>
      </>
    );
    return (
      <>
        <Carousel
          data={cardData}
          renderItem={renderItem}
          sliderWidth={DeviceWidth}
          itemWidth={DeviceWidth * 0.9}
          inactiveSlideOpacity={0.5}
          snapToInterval={DeviceWidth * 0.9}
          enableMomentum={false}
          decelerationRate="normal"
          autoplay
          lockScrollWhileSnapping
          enableSnap
          loop
          onSnapToItem={index => setActiveIndex(index)}
        />
        <View style={styles.dotsContainer}>
          {/* {Array.from({length: 4}).map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    i == activeIndex ? AppColor.RED : AppColor.GRAY2,
                }, // Adjust based on active index if needed
              ]}
            />
          ))} */}
        </View>
      </>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.v1}>
        <AnimatedLottieView
          source={localImage.checkLottie}
          speed={1}
          autoPlay
          loop
          resizeMode="contain"
          style={{
            width: '50%',
            height: '70%',
          }}
        />
      </View>
      <View style={styles.v2}>
        <View style={styles.v3}>
          <Text style={styles.t1}>Nicely Done</Text>
          {!animationEnded ? (
            <Animated.View
              style={{
                flexDirection: 'row',
                flex: 3,
                alignSelf: 'center',
                transform: [{translateX: moveView}],
              }}>
              {exerciseData.map((element, index) => (
                <Animated.View
                  key={index}
                  style={[
                    styles.aniV1,
                    {
                      opacity: inAnimation
                        ? fadeInAnimation[index]
                        : fadeOutAnimation[index],
                    },
                  ]}>
                  <Image
                    source={element.img}
                    style={{width: '50%', height: '50%'}}
                    resizeMode="contain"
                  />
                  <Text style={styles.t2}>{element.txt1}</Text>
                  <Text
                    style={{color: AppColor.NewGray, fontFamily: 'Helvetica'}}>
                    {element.txt2}
                  </Text>
                </Animated.View>
              ))}
            </Animated.View>
          ) : (
            <Animated.View
              style={{
                transform: [{translateX: moveViewIn}],
                flex: 3,
              }}>
              <BreathingCards />
            </Animated.View>
          )}
        </View>
        <View style={styles.v4}>
          <NewButton title={'Save and continue'} />
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColor.WHITE,
  },
  bI: {
    width: DeviceWidth,
    height: DeviceHeigth * 0.4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  v1: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  v2: {
    flex: 6,
  },
  v3: {
    flex: 3,
  },
  v4: {
    flex: 1.5,
  },
  aniV1: {
    width: '28%',
    height: '65%',
    borderWidth: 1.5,
    borderRadius: 14,
    marginHorizontal: 8,

    backgroundColor: AppColor.GRAY,
    alignItems: 'center',
    padding: 5,

    // justifyContent:'space-between'
  },
  h1: {
    color: AppColor.BoldText,
    fontFamily: 'Helvetica-Bold',
    fontSize: 14,
    width: DeviceWidth * 0.4,
  },
  t1: {
    color: AppColor.RED,
    fontFamily: 'Helvetica-Bold',
    fontSize: 26,
    alignSelf: 'center',
    flex: 2,
  },
  button: {
    width: DeviceWidth * 0.9,
    borderWidth: 1.5,
    borderRadius: 14,
    alignSelf: 'center',
    overflow: 'hidden',
    marginHorizontal: 8,
    // paddingVertical:DeviceHeigth*0.02

    // paddingVertical: DeviceHeigth * 0.025,
  },
  b: {
    height: 0,
    width: DeviceWidth * 0.8,
    borderWidth: 0.5,
    borderColor: AppColor.GRAY2,
    marginVertical: DeviceHeigth * 0.01,
    alignSelf: 'center',
  },
  t2: {
    color: AppColor.BoldText,
    fontFamily: 'Helvetica-Bold',
    fontSize: 16,
  },
  sticker: {
    backgroundColor: 'red',
    position: 'absolute',
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: DeviceWidth * 0.03,
    paddingVertical: DeviceHeigth * 0.007,
  },
  dotsContainer: {
    flexDirection: 'row',
    flex: 4,
    justifyContent: 'center',
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 100,
    marginHorizontal: 5,
  },
});
export default BreathSessionInfo;
