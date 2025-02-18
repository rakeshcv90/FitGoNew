import {Platform, ViewStyle} from 'react-native';
import { AppColor } from '../Color';

const ShadowStyle = {
  shadowColor: 'grey',
  ...Platform.select({
    ios: {
      //shadowColor: '#000000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },
    android: {
      elevation: 3,
    },
  }),
};

const FlexCenter: ViewStyle = {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
};

const NormalCenter: ViewStyle = {
  justifyContent: 'center',
  alignItems: 'center',
};

const rowCenter: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
};
const rowBetween: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const screenContainer: ViewStyle = {
  flex: 1,
  padding: 10,
};
const whiteContainer: ViewStyle = {
  padding: 10,
  borderRadius: 10,
};

const HorizontalLine: ViewStyle = {
  borderWidth: 0.4,
  borderColor: AppColor.NEW_LIGHT_GRAY,
  borderRadius: 10,
};

const PredefinedStyles = {
  FlexCenter,
  ShadowStyle,
  rowBetween,
  rowCenter,
  screenContainer,
  NormalCenter,
  whiteContainer,
  HorizontalLine,
};

export default PredefinedStyles;