import {
  Platform,
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
import {DeviceWidth} from '../../../Component/Config';
import {AppColor} from '../../../Component/Color';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Animated} from 'react-native';

export type Props = TouchableWithoutFeedbackProps & {
  w?: number;
  h?: number;
  play: boolean;
  textStyle?: StyleProp<TextStyle>;
  mV?: number;
  mB?: number;
  pV?: number;
  bR?: number;
  fill?: any;
  alignSelf?: boolean;
  playy?: any;
  back?: any;
  next?: any;
  BM?: number;
  colors?: Array<any>;
  oneDay?: boolean | false;
  text?: string;
  fillBack?: string | '#D9D9D9';
};

const Play: FC<Props> = ({...props}) => {
  const progressAnimation = useRef(new Animated.Value(props.fill | 0)).current;
  const progressBarWidth = progressAnimation.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
    extrapolate: 'extend',
  });
  useEffect(() => {
    Animated.timing(progressAnimation, {
      toValue: props.fill,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [props.fill]);
  const PARENT = props.oneDay ? TouchableOpacity : View;
  return (
    <PARENT
      {...props}
      style={{
        flex: 1,
        width: props.w ? props.w : DeviceWidth * 0.5,
        justifyContent: 'center',
        alignItems: 'center',
        //alignSelf: !props.alignSelf ? 'flex-start' : 'center',
        marginBottom: props.mB,
        // bottom: 0,
        // position: 'absolute',
        alignSelf: 'center',
      }}>
      <View
        style={[
          styles.nextButton,
          {
            width: props.w ? props.w : DeviceWidth * 0.5,
            height: props.h ? props.h : 50,
            marginVertical: props.mV,
            paddingVertical: props.pV,
            // borderRadius: props.bR ? props.bR : 80 / 2,
          },
          props.oneDay && {
            justifyContent: 'center',
          },
        ]}>
        {props.oneDay ? (
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
        ) : (
          <>
            <TouchableOpacity
              style={{
                zIndex: 1,
              }}
              onPress={props.back}>
              <Icons name={'skip-previous'} size={30} color='#333333CC' />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                zIndex: 1,
                backgroundColor: AppColor.NEW_DARK_RED,
                borderRadius: 30,
                padding: 10
              }}
              onPress={props.playy}>
              {props.play ? (
                <Icons name={'play'} size={30} color={AppColor.WHITE} />
              ) : (
                <Icons name={'pause'} size={30} color={AppColor.WHITE} />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                zIndex: 1,
              }}
              onPress={props.next}>
              <Icons name={'skip-next'} size={30} color='#333333CC' />
            </TouchableOpacity>
          </>
        )}
        <Animated.View
          style={{
            backgroundColor: props.fillBack ? props.fillBack : 'transparent',
            height: props.h ? props.h : 50,
            width: progressBarWidth,
            marginTop: -50,
            // borderBottomRightRadius: props.bR ? props.bR : 50 / 2,
            right: 0,
            position: 'absolute',
            zIndex: !props.oneDay && props.fillBack ? -1 : 0,
          }}
        />
      </View>
    </PARENT>
  );
};

export default Play;

const styles = StyleSheet.create({
  nextButton: {
    overflow: 'hidden',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
  },
});
