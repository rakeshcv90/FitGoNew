import {
  Animated,
  Image,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableWithoutFeedbackProps,
  View,
} from 'react-native';
import React, {FC, useEffect, useRef} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {AppColor} from './Color';
import {DeviceWidth} from './Config';

export type Props = TouchableWithoutFeedbackProps & {
  w?: number;
  h?: number;
  text: string;
  textStyle?: StyleProp<TextStyle>;
  mV?: number;
  mB?: number;
  pV?: number;
  bR?: number;
  alignSelf?: boolean;
  flex?: number;
  position?: string;
  bottm?: number;
  Image?: StyleProp<ImageSourcePropType>;
  ImageStyle?: StyleProp<ImageStyle>;
  weeklyAnimation?: boolean | false;
  activeOpacity?: number | 0.2;
  mR?: number | 0;
  colors?: Array<any>;
};

const GradientButton: FC<Props> = ({...props}) => {
  const progressAnimation = new Animated.Value(0);
  const progressBarWidth = progressAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['100%', '0%'],
    extrapolate: 'extend',
  });
  useEffect(() => {
    if (props.weeklyAnimation) {
      Animated.timing(progressAnimation, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: false,
      }).start();
    }
  }, [props.weeklyAnimation, progressAnimation]);

  return (
    <TouchableOpacity
      {...props}
      activeOpacity={props.activeOpacity}
      style={{
        flex: props.flex ? props.flex : 1,
        width: props.w ? props.w : DeviceWidth * 0.9,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: !props.alignSelf ? 'flex-start' : 'center',
        marginBottom: props.mB,
        marginRight: props.mR,
        position: props.position,

        bottom: props.bottm,
      }}>
      <LinearGradient
        start={{x: 1, y: 0}}
        end={{x: 0, y: 1}}
        colors={props.colors ? props.colors : ['#941000', '#D5191A']}
        style={[
          styles.nextButton,
          {
            width: props.w ? props.w : DeviceWidth * 0.9,
            height: props.h ? props.h : 50,
            marginVertical: props.mV,
            paddingVertical: props.pV,
            borderRadius: props.bR ? props.bR : 50 / 2,
          },
        ]}>
        {props.Image ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={props.Image}
              style={
                props.ImageStyle
                  ? props.ImageStyle
                  : {
                      height: DeviceWidth * 0.1,
                      width: DeviceWidth * 0.1,
                    }
              }
              resizeMode="contain"
            />
            <Text
              style={
                props.textStyle
                  ? props.textStyle
                  : {
                      fontSize: 20,
                      fontFamily: 'Poppins',
                      lineHeight: 30,
                      color: AppColor.WHITE,
                      fontWeight: '700',
                      zIndex: 1,
                    }
              }>
              {props.text}
            </Text>
          </View>
        ) : (
          <>
            <Text
              style={
                props.textStyle
                  ? props.textStyle
                  : {
                      fontSize: 20,
                      fontFamily: 'Poppins',
                      lineHeight: 30,
                      color: AppColor.WHITE,
                      fontWeight: '700',
                      zIndex: 1,
                    }
              }>
              {props.text}
            </Text>
          </>
        )}
        <Animated.View
          style={{
            backgroundColor: '#D9D9D9',
            height: props.weeklyAnimation ? (props.h ? props.h : 50) : 0,
            width: progressBarWidth,
            marginTop: -50,
            right: 0,
            position: 'absolute',
            zIndex: props.weeklyAnimation ? 0 : -1,
          }}
        />
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default GradientButton;

const styles = StyleSheet.create({
  nextButton: {
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
});
