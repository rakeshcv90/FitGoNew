import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Image,
  Platform,
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
                    : AppColor.BACKGROUNG
                  : selectedB == v.id
                  ? AppColor.RED
                  : AppColor.BACKGROUNG,
                flexDirection: Goal ? 'row-reverse' : 'row',
                justifyContent: Goal ? 'space-between' : 'flex-start',
                paddingVertical: Goal ? DeviceWidth * 0.05 : 11,
              },
            ]}
            key={i}
            onPress={() => SelectedButton(v)}>
            <View>
              <Image
                source={!Goal ? v.img : {uri: v?.goal_image}}
                style={{
                  height: Ih,
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
    backgroundColor: AppColor.BACKGROUNG,
    alignItems: 'center',
    padding: 11,
    ...Platform.select({
      android:{
        elevation:5,
        shadowColor:'grey'
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 5, height: 5},
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
    })
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
