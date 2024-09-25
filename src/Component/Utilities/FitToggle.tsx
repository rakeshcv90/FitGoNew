import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import FitIcon from './FitIcon';
import {AppColor} from '../Color';
import {useDispatch} from 'react-redux';
import {AnalyticsConsole} from '../AnalyticsConsole';
import {showMessage} from 'react-native-flash-message';
import {setSoundOnOff} from '../ThemeRedux/Actions';
import {ShadowStyle} from './ShadowStyle';

interface Props {
  title?: string;
  value: boolean;
}

const FitToggle = ({
  title,
  value,
}: Props) => {
  const dispatch = useDispatch();
  const onChange = () => {
    AnalyticsConsole(`SOUND_ON_OFF`);
    if (!value) {
      showMessage({
        message: 'Sound unmuted.',
        type: 'success',
        animationDuration: 500,
        floating: true,
      });
    } else {
      showMessage({
        message: 'Sound muted.',
        animationDuration: 500,
        type: 'danger',
        floating: true,
      });
    }
    dispatch(setSoundOnOff(!value));
  };

  return (
    <TouchableOpacity
      onPress={onChange}
      activeOpacity={1}
      style={[
        styles.container,
        {
          width: 45,
          alignItems: value ? 'flex-end' : 'flex-start',
          backgroundColor: value ? '#F8809D' : '#3C3C434D',
          paddingHorizontal: 2,
        },
      ]}>
      <View
        style={[
          styles.circle,
          {backgroundColor: value ? AppColor.RED : AppColor.WHITE},
          //   ShadowStyle
        ]}>
        <FitIcon
          name={value ? 'volume-up' : 'volume-mute'}
          size={10}
          type="FontAwesome5"
          color={value ? 'white' : '#333333B2'}
        />
      </View>
    </TouchableOpacity>
  );
};

export default FitToggle;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    justifyContent: 'center',
    borderRadius: 15,
    height: 22,
    // alignItems: 'center',
    // padding: 2,
  },
  circle: {
    borderRadius: 100,
    paddingVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: 20,
    height: 20,
  },
});
