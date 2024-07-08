import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import {DeviceWidth, DeviceHeigth} from '../../Component/Config';
import {AppColor, Fonts} from '../../Component/Color';

import {CircularProgressWithChild} from 'react-native-circular-progress-indicator';
import FitIcon from '../../Component/Utilities/FitIcon';
import {localImage} from '../../Component/Image';
import {
  setHindiLanuage,
  setShowIntro,
} from '../../Component/ThemeRedux/Actions';
import {useDispatch, useSelector} from 'react-redux';
import AnimatedLottieView from 'lottie-react-native';
import {AnalyticsConsole} from '../../Component/AnalyticsConsole';
import {IntroductionData} from './IntroductionScreenData';
import {navigationRef} from '../../../App';

const IntroScreen = ({slide, index}: any) => {
  const dispatch = useDispatch();
  const hindiLanguage = useSelector((state: any) => state.hindiLanguage);
  const COLOR = slide?.color == AppColor.WHITE ? AppColor.RED : AppColor.WHITE;
  const TEXT_COLOR =
    slide?.color == AppColor.WHITE ? '#333333CC' : AppColor.WHITE;

  const buttons = IntroductionData.filter((_, i) => i != 3);
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: slide?.color,
        display:slide?.id == 4 ? 'none': 'flex',
      }}>
      <StatusBar barStyle={'dark-content'} backgroundColor={AppColor.WHITE} />
      <View
        style={{
          width: '100%',
          height: '50%',
          opacity: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            height: 30,
            width: '90%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',

            zIndex: 1,
            top: Platform.OS == 'ios' && DeviceHeigth <= 1024 ? 15 : -5,
          }}>
          <TouchableOpacity
            style={{
              justifyContent: 'center',
              alignItems: 'center',

              zIndex: 1,
              overflow: 'hidden',
              width: DeviceWidth * 0.08,
              height: DeviceHeigth * 0.05,
            }}
            onPress={() => {
              AnalyticsConsole(`LAN_C_TO_${hindiLanguage ? 'H' : 'E'}`);
              dispatch(setHindiLanuage(!hindiLanguage));
            }}>
            <Image
              source={localImage.TranslateIntro}
              resizeMode="contain"
              style={{height: 30, width: 30}}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              AnalyticsConsole('SKIP_IS');
              dispatch(setShowIntro(true));
              navigationRef.navigate('LogSignUp', {screen: 'Log In'});
            }}>
            <Text
              style={{
                textDecorationLine: 'underline',
                color: COLOR,
                textAlign: 'center',
                fontWeight: '600',
                lineHeight: 20,
                fontSize: 14,
              }}>
              Skip
            </Text>
          </TouchableOpacity>
        </View>

        <Image
          source={
            slide?.id == 1
              ? localImage.Intro1
              : slide?.id == 2
              ? localImage.Intro2
              : slide?.id == 3
              ? localImage.Intro3
              : ''
          }
          resizeMode="contain"
          style={{
            width: '80%',
            height: '80%',
            // top: DeviceHeigth * 0.04,
          }}></Image>
      </View>
      <View
        style={{
          height: '40%',
          paddingLeft: 20,
          paddingTop: 24,
          paddingRight: 20,
        }}>
        <Text
          style={{
            fontFamily: Fonts.MONTSERRAT_REGULAR,
            fontSize: 36,
            lineHeight: 40,
            fontWeight: '500',
            color: COLOR,
            marginLeft: 10,
          }}>
          {hindiLanguage
            ? slide?.headingHindi?.split(',')[0]
            : slide.headingEnglish?.split(',')[0]}
        </Text>
        <Text
          style={{
            fontFamily: Fonts.MONTSERRAT_BOLD,
            fontSize: 36,
            lineHeight: 40,
            fontWeight: '700',
            color: COLOR,
          }}>
          {hindiLanguage
            ? slide.headingHindi?.split(',')[1]
            : slide.headingEnglish?.split(',')[1]}
        </Text>

        <Text
          style={{
            fontFamily: Fonts.MONTSERRAT_REGULAR,
            fontSize: 16,
            lineHeight: 25,
            fontWeight: '500',
            color: TEXT_COLOR,
            opacity: 0.8,
            marginTop: 16,
          }}>
          {hindiLanguage ? slide.textHindi : slide.textEnglish}
        </Text>
      </View>
      <View
        style={{
          // alignSelf: 'flex-end',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '10%',
          paddingRight: 20,
          flexDirection: 'row',
        }}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: 'row',
            width: '20%',
            marginLeft: 30,
          }}>
          {buttons.map((_, i) => {
            return (
              <View
                style={{
                  backgroundColor:
                    slide.id != 2
                      ? i == index
                        ? AppColor.WHITE
                        : '#848484'
                      : i == index
                      ? AppColor.RED
                      : '#B6002C',
                  width: 15,
                  height: 15,
                  borderRadius: 15,
                }}
              />
            );
          })}
        </View>
        <TouchableOpacity
          onPress={() => {
            AnalyticsConsole('IV_F_IS');
            navigation.navigate('IntroVideo', {type: 'intro'});
          }}>
          <AnimatedLottieView
            source={localImage.IntroJSON}
            speed={1}
            autoPlay
            loop
            resizeMode="cover"
            style={{
              width: DeviceWidth * 0.3,
              height: '100%',
            }}
          />
        </TouchableOpacity>
        {/* <CircularProgressWithChild
          value={33}
          activeStrokeColor={'#f0013b'}
          radius={DeviceHeigth >= 1024 ? 35 : 25}
          initialValue={33}
          maxValue={100}
          // clockwise={false}
          inActiveStrokeColor={AppColor.WHITE}
          activeStrokeWidth={3}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              AnalyticsConsole('TO_IS2');
              navigation.navigate('IntroductionScreen2');
            }}
            style={{
              backgroundColor: AppColor.WHITE,
              width:
                DeviceHeigth >= 1024 ? DeviceWidth * 0.08 : DeviceWidth * 0.1,
              height:
                DeviceHeigth >= 1024 ? DeviceWidth * 0.08 : DeviceWidth * 0.1,
              borderRadius: 100,
              margin: 5,

              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <FitIcon
              name="arrowright"
              size={25}
              type="AntDesign"
              color={COLOR}
            />
          </TouchableOpacity>
        </CircularProgressWithChild> */}
      </View>
    </View>
  );
};

export default IntroScreen;

// import React from "react";
// import { View, Text, StyleSheet, Dimensions, Image } from "react-native";
// import Svg, { RadialGradient, Defs, Rect, Stop } from "react-native-svg";

// const { width, height } = Dimensions.get("screen");
// const SIZE = width - 75;
// const styles = StyleSheet.create({
//   container: {
//     ...StyleSheet.absoluteFillObject,
//     padding: 75,
//     paddingTop: 150,
//     alignItems: "center",
//   },
//   image: {
//     width: SIZE,
//     height: SIZE,
//   },
//   title: {
//     fontSize: 48,
//     color: "white",
//     textAlign: "center",
//     marginBottom: 16,
//     fontFamily: "SFProDisplay-Bold",
//   },
//   description: {
//     fontSize: 18,
//     color: "white",
//     textAlign: "center",
//     fontFamily: "SFProDisplay-Regular",
//   },
// });

// export interface SlideProps {
//   slide: {
//     color: string;
//     title: string;
//     description: string;
//     picture: ReturnType<typeof require>;
//   };
// }

// const Slide = ({
//   slide: { picture, color, title, description },
// }: SlideProps) => {
//   const lighterColor = 'grey';
//   return (
//     <>
//       <Svg style={StyleSheet.absoluteFill}>
//         <Defs>
//           <RadialGradient id="gradient" cx="50%" cy="35%">
//             <Stop offset="0%" stopColor={lighterColor} />
//             <Stop offset="100%" stopColor={color} />
//           </RadialGradient>
//         </Defs>
//         <Rect x={0} y={0} width={width} height={height} fill="url(#gradient)" />
//       </Svg>
//       <View style={styles.container}>
//         <Image source={picture} style={styles.image} />
//         <View>
//           <Text style={styles.title}>{title}</Text>
//           <Text style={styles.description}>{description}</Text>
//         </View>
//       </View>
//     </>
//   );
// };

// export default Slide;
