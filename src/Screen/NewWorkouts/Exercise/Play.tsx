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
  const PARENT = props.oneDay ? TouchableOpacity : View;
  return (
    <PARENT
      {...props}
      style={{
        flex: 1,
        width: props.w ? props.w : DeviceWidth * 0.9,
        justifyContent: 'center',
        alignItems: 'center',
        //alignSelf: !props.alignSelf ? 'flex-start' : 'center',
        marginBottom: props.mB,
        bottom: 0,
        position: 'absolute',
        alignSelf: 'center',
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
            borderRadius: props.bR ? props.bR : 20 / 2,
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
              <Icons name={'chevron-left'} size={40} color={AppColor.WHITE} />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                zIndex: 1,
              }}
              onPress={props.playy}>
              {props.play ? (
                <Icons name={'play'} size={40} color={AppColor.WHITE} />
              ) : (
                <Icons name={'pause'} size={40} color={AppColor.WHITE} />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                zIndex: 1,
              }}
              onPress={props.next}>
              <Icons name={'chevron-right'} size={40} color={AppColor.WHITE} />
            </TouchableOpacity>
          </>
        )}
        <View
          style={{
            backgroundColor: props.fillBack ? props.fillBack : '#D9D9D9',
            height: props.h ? props.h : 50,
            width: props.fill,
            marginTop: -50,
            // borderBottomRightRadius: props.bR ? props.bR : 50 / 2,
            right: 0,
            position: 'absolute',
            zIndex: !props.fillBack ? -1 :0,
          }}
        />
      </LinearGradient>
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
