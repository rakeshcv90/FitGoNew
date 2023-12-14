import {
  Animated,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
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
import Svg, {
  LinearGradient as SvgGrad,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import {setLaterButtonData} from '../../Component/ThemeRedux/Actions';

const GradientText = ({item}: any) => {
  const gradientColors = ['#D5191A', '#941000'];

  return (
    <View>
      <Svg height="40" width={item?.length * 10}>
        <SvgGrad id="grad" x1="0" y1="0" x2="100%" y2="0">
          <Stop offset="0" stopColor={gradientColors[0]} />
          <Stop offset="1" stopColor={gradientColors[1]} />
        </SvgGrad>
        <SvgText
          fontFamily="Verdana"
          fontWeight="700"
          fontSize="12"
          fill="url(#grad)"
          x="10"
          y="25">
          {item}
        </SvgText>
      </Svg>
    </View>
  );
};

const Level = ({route, navigation}: any) => {
  const {nextScreen} = route.params;
  const translateLevel = useRef(new Animated.Value(0)).current;

  const {defaultTheme, completeProfileData, getLaterButtonData} = useSelector(
    (state: any) => state,
  );
  const dispatch = useDispatch();
  const [selected, setSelected] = useState(-1);
  const [screen, setScreen] = useState(nextScreen);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    setScreen(nextScreen);
    setSelected(1);
  }, []);
  const toNextScreen = () => {
    const currentData = {
      level: selected,
    };
    dispatch(setLaterButtonData([...getLaterButtonData, currentData]));
    navigation.navigate('Injury', {nextScreen: screen + 1});
  };
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // marginTop: 50,
        backgroundColor: AppColor.WHITE,
      }}>
      <ProgressBar screen={screen} />
      <Bulb
          screen={'Select your Fitness level'}
          header={
            'Knowing your gender can help us for you based on different metabolic rates.'
          }
        />

      <View
        style={{
          // flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          alignSelf: 'center',
          height: DeviceHeigth * 0.6,
          // width: DeviceWidth,
        }}>
        <View
          style={{
            width: DeviceWidth,
            height: DeviceHeigth * 0.5,
            // backgroundColor: 'red',
          }}>
          <FlatList
            ref={flatListRef}
            keyExtractor={(index) => index.toString()}
            data={completeProfileData?.level}
            horizontal
            scrollEnabled={false}
            showsHorizontalScrollIndicator={false}
            renderItem={({item, index}: any) => (
              <Image
                resizeMode="contain"
                source={{uri: item?.level_image}}
                style={{
                  width: DeviceWidth,
                  height: DeviceHeigth * 0.5,
                  // backgroundColor: 'red',
                }}
              />
            )}
          />
        </View>
        <View style={{height: DeviceHeigth * 0.1}}>
          <View
            style={{
              width: DeviceWidth * 0.8,
              backgroundColor: AppColor.RED,
              height: 20,
              borderRadius: 20,
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'row',
              paddingHorizontal: 2,
              alignSelf: 'center',
            }}>
            {completeProfileData.level?.map((item: any, index: number) => {
              if (index == 3) return;
              return (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    // flex: 1,
                  }}>
                  {selected == item?.level_id ? (
                    <Image
                      resizeMode="contain"
                      source={localImage.SelectLevel}
                      style={{
                        width: 40,
                        height: 40,
                        // backgroundColor: 'red',
                        marginHorizontal: -10,
                      }}
                    />
                  ) : (
                    <TouchableOpacity
                      onPress={() => {
                        if (flatListRef.current) {
                          // Animated.timing(translateLevel, {
                          //   toValue: -DeviceWidth * index,
                          //   duration: 500,
                          //   useNativeDriver: true,
                          //   delay: 250,
                          // }).start(() => {
                          // });
                          flatListRef.current?.scrollToIndex({
                            index,
                            animated: true,
                          });
                        }
                        setSelected(item?.level_id);
                      }}
                      style={{
                        width: 18,
                        backgroundColor: AppColor.WHITE,
                        height: 18,
                        borderRadius: 20,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          width: 10,
                          backgroundColor: AppColor.WHITE,
                          height: 10,
                          borderRadius: 20,
                          borderColor: 'transparent',
                          borderWidth: 1,
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
                        }}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
          </View>
          <View
            style={{
              width: DeviceWidth * 0.85,
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'row',
              marginTop: 5,
              // paddingHorizontal: 2,
            }}>
            {completeProfileData.level?.map((item: any, index: number) => {
              if (index == 3) return;
              return (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                    // flex: 1,
                  }}>
                  {selected == item?.level_id ? (
                    <GradientText item={item?.level_title} />
                  ) : (
                    <Text
                      style={{
                        fontFamily: 'Verdana',
                        fontWeight: '400',
                        fontSize: 12,
                        lineHeight: 16,
                        color: '#505050',
                      }}>
                      {item?.level_title}
                    </Text>
                  )}
                </View>
              );
            })}
          </View>
        </View>
      </View>
      <View style={styles.buttons}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
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

export default Level;

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
