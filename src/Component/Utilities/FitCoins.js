import {View, Text, StyleSheet, TouchableOpacity, Platform} from 'react-native';
import React from 'react';
import {AppColor, Fonts} from '../Color';
import {Image} from 'react-native';
import {localImage} from '../Image';


const FitCoins = ({coins, onPress,disable}) => {
  return (
    <View style={styles.Container}>
      <TouchableOpacity onPress={onPress} style={styles.button}
      disabled={disable}>
        <Image
          source={localImage.Trophy}
          style={{height: 20, width: 20, marginRight: 3}}
          resizeMode="contain"
        />
        <Text style={styles.txt}>{coins}</Text>
        <Image
          source={localImage.FitCoin}
          style={{height: 17, width: 17}}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  Container: {},
  button: {
    backgroundColor: AppColor.YELLOW,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    // position: 'absolute',
    // right: 16,
    paddingVertical: 4,
    ...Platform.select({
      android: {
        elevation: 5,
      },
      ios: {
        shadowColor: '#000000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
  txt: {
    color: AppColor.WHITE,
    fontSize: 14,
    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
    marginRight: 3,
  },
});
export default FitCoins;
