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
  mB?: number;
  pV?: number;
  bR?: number;
  alignSelf?: boolean,
};

const GradientButton: FC<Props> = ({...props}) => {
  return (
    <TouchableOpacity
      {...props}
      style={{
        flex: 1,
        width: props.w ? props.w : DeviceWidth * 0.9,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: !props.alignSelf? 'flex-start' : 'center',
        marginBottom: props.mB
      }}>
      <LinearGradient
        start={{x: 1, y: 0}}
        end={{x: 0, y: 1}}
        colors={['#941000', '#D5191A']}
        style={[
          styles.nextButton,
          {
            width: props.w ? props.w : DeviceWidth * 0.9,
            height: props.h ? props.h : 50,
            marginVertical: props.mV,
            paddingVertical: props.pV,
            borderRadius: props.bR?props.bR: 50 / 2,
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
