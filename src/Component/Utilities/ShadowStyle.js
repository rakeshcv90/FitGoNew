import {Platform} from 'react-native';

export const ShadowStyle = {
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
