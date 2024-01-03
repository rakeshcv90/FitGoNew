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
import {DeviceWidth} from '../../../Component/Config';
import {AppColor} from '../../../Component/Color';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';

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
  colors?: Array<any>;
};

const Play: FC<Props> = ({...props}) => {
  return (
    <View
      {...props}
      style={{
        flex: 1,
        width: props.w ? props.w : DeviceWidth * 0.9,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: !props.alignSelf ? 'flex-start' : 'center',
        marginBottom: props.mB,
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
        ]}>
        <TouchableOpacity onPress={props.back}>
          <Icons name={'chevron-left'} size={40} color={AppColor.WHITE} />
        </TouchableOpacity>
        <TouchableOpacity onPress={props.playy}>
          {props.play ? (
            <Icons name={'play'} size={40} color={AppColor.WHITE} />
          ) : (
            <Icons name={'pause'} size={40} color={AppColor.WHITE} />
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={props.next}>
          <Icons name={'chevron-right'} size={40} color={AppColor.WHITE} />
        </TouchableOpacity>
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
    </View>
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
