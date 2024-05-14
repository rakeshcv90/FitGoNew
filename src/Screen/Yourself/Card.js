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
import {localImage} from '../../Component/Image';
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
                borderWidth: 2,
                borderColor: Goal
                  ? selectedB == v?.goal_id
                    ? AppColor.RED
                    : AppColor.WHITE
                  : selectedB == v.id
                  ? AppColor.RED
                  : AppColor.WHITE,
                flexDirection: Goal ? 'row-reverse' : 'row',
                justifyContent: Goal ? 'space-between' : 'flex-start',
              },
            ]}
            key={i}
            onPress={() => SelectedButton(v)}>
            <View>
              <Image
                source={
                  !Goal
                    ? v.img
                    : v?.goal_id == 1 || v?.goal_id == 3
                    ? localImage.WeightLoss
                    : v?.goal_id == 2 || v?.goal_id == 6
                    ? localImage.BuildMuscle
                    : localImage.Strength
                }
                style={{
                  height: Goal
                    ? v?.goal_id == 2 || v?.goal_id == 6
                      ? 30
                      : Ih
                    : Ih,
                  width: Iw,
                }} // to add customize ih , checked extra condition
                resizeMode="contain"
              />
            </View>
            <View style={{}}>
              <Text style={Styletxt1}>{!Goal ? v.txt : v?.goal_title}</Text>
              {/* {Goal ? <Text style={Styletxt2}>{v.txt1}</Text> : null} */}
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
    borderColor: '#fff',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.2,
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
