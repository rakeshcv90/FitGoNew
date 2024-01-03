import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableWithoutFeedbackProps,
  View,
} from 'react-native';
import React, {FC} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {AppColor} from './Color';
import {DeviceWidth} from './Config';

export type Props = TouchableWithoutFeedbackProps & {
  w?: number;
  h?: number;
  text: string;
  textStyle?: StyleProp<TextStyle>;
  mV?: number;
  pV?: number;
  bR?: number;
  bW?: number;
  fill?: any;
  flex?: number;
  colors?: any;
  bC?: string
};

const ProgreesButton: FC<Props> = ({...props}) => {
  return (
    <TouchableOpacity
      {...props}
      style={{
        flex: props.flex ? props.flex : 1,
        width: props.w ? props.w : DeviceWidth * 0.9,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-start',
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
            borderWidth: props.bW ? 1 : 0,
            borderColor: props.bC ? props.bC : 'transparent',
          },
        ]}>
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
                }
          }>
          {props.text}
        </Text>
        <View
          style={{
            backgroundColor: '#D9D9D9',
            height: props.h ? props.h : 50,
            width: props.fill,
            marginTop: -50,
            // borderBottomRightRadius: props.bR ? props.bR : 50 / 2,
            right: 0,
            position: 'absolute',
            zIndex: -1,
          }}
        />
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default ProgreesButton;

const styles = StyleSheet.create({
  nextButton: {
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
});
