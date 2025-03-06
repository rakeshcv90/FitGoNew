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
  onChange: (changedValue: boolean, name?: string) => void;
  name?: string;
  /*  2px margin for both Top & Down on inside Button */
  toggleHeight?: number;
  toggleContainerWidth?: number;
}

const FitToggle = ({
  title,
  value,
  name,
  onChange,
  toggleContainerWidth,
  toggleHeight,
}: Props) => {
  const handleChange = () => onChange(value, name);

  return (
    <TouchableOpacity
      onPress={handleChange}
      activeOpacity={1}
      style={[
        styles.container,
        {
          width: toggleContainerWidth ?? 50,
          alignItems: value ? 'flex-end' : 'flex-start',
          backgroundColor: value ? '#F8809D' : '#3C3C434D',
          paddingHorizontal: 2,
          height: toggleHeight ?? 27,
        },
      ]}>
      <View
        style={[
          styles.circle,
          {
            backgroundColor: value ? AppColor.WHITE : AppColor.WHITE,
            width: toggleHeight ? toggleHeight - 4 : 22,
            height: toggleHeight ? toggleHeight - 4 : 22,
          },
          //   ShadowStyle
        ]}>
        {/* <FitIcon
          name={value ? 'volume-up' : 'volume-mute'}
          size={10}
          type="FontAwesome5"
          color={value ? 'white' : '#333333B2'}
        /> */}
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
    // alignItems: 'center',
    // padding: 2,
  },
  circle: {
    borderRadius: 100,
    paddingVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});