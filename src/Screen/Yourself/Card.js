import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Image,
} from 'react-native';
import React from 'react';
import {AppColor} from '../../Component/Color';
import {DeviceWidth} from '../../Component/Config';
import {GameRequestDialog} from 'react-native-fbsdk-next';
import { opacity } from 'react-native-reanimated/lib/typescript/reanimated2/Colors';
export const Card = ({
  ItemArray,
  Ih,
  Iw,
  selectedB,
  translateXValues,
  SelectedButton,
  Goal,
  Styletxt1,
  Styletxt2,
}) => {
  return (
    <>
      {ItemArray.map((v, i) => (
        <Animated.View
          key={i}
          style={[{transform: [{translateX: translateXValues[i]}]}]}>
          <TouchableOpacity
            style={[
              styles.button,
              {
                borderWidth: selectedB == v.id ? 2 : 0,
                borderColor: selectedB == v.id ? AppColor.RED : null,
                flexDirection:Goal?'row-reverse':'row',
                justifyContent:Goal?'space-between':'flex-start'
              },
            ]}
            key={i}
            onPress={() => SelectedButton(v)}>
            <View>
              <Image
                source={v.img}
                style={{height: Goal?v.id==2?30:Ih: Ih, width: Iw,}} // to add customize ih , checked extra condition
                resizeMode="contain"
              />
            </View>
            <View style={{}}>
              <Text style={Styletxt1}>{v.txt}</Text>
              {Goal ? <Text style={Styletxt2}>{v.txt1}</Text> : null}
            </View>
          </TouchableOpacity>
        </Animated.View>
      ))}
    </>
  );
};
const styles = StyleSheet.create({
  button: {
    width: DeviceWidth * 0.9,
    marginTop: 15,
    borderRadius: 7,
    backgroundColor: AppColor.WHITE,
    alignItems: 'center',
    padding: 11,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
        shadowColor: 'darkgrey',
        
      },
    }),
  },
  txt: {
    paddingVertical: 14,
    fontSize: 17,
    color: AppColor.BLACK,
    fontFamily: 'Montserrat-SemiBold',
    fontWeight: '500',
    textAlign: 'center',
    marginLeft: 15,
  },
  txt1: {
    fontFamily: 'Montserrat-SemiBold',
    color: AppColor.BLACK,
    fontSize: 17,
    marginBottom: 7,
  },
  txt2: {
    fontFamily: 'Montserrat-Regular',
    color: AppColor.BLACK,
    fontSize: 14,
  },
});
