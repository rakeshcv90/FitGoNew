import React, {useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {AppColor} from './Color';
import LinearGradient from 'react-native-linear-gradient';

const CustomSwitch = ({
  navigation,
  selectionMode,
  roundCorner,
  option1,
  option2,
  onSelectSwitch,
  selectionColor,
}) => {
  const [getSelectionMode, setSelectionMode] = useState(selectionMode);
  const [getRoundCorner, setRoundCorner] = useState(roundCorner);

  const updatedSwitchData = val => {
    setSelectionMode(val);
    onSelectSwitch(val);
  };

  return (
    <View>
      <View
        style={{
          height: 44,
          width: 215,
          backgroundColor: AppColor.GRAY2,
          borderRadius: getRoundCorner ? 25 : 0,
          flexDirection: 'row',
          justifyContent: 'center',
          alignSelf: 'center',
        }}>
        <LinearGradient
          start={{x: 0, y: 1}}
          end={{x: 1, y: 0}}
          // colors={['#941000', '#D01818']}
          colors={
            getSelectionMode == 1
              ? ['#941000', '#D01818']
              : ['#D9D9D9', '#D9D9D9']
          }
          style={{
            flex: 1,

            borderRadius: getRoundCorner ? 25 : 0,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => updatedSwitchData(1)}
            style={{
              flex: 1,

              //   backgroundColor:
              //     getSelectionMode == 1 ? selectionColor : AppColor.GRAY2,
              borderRadius: getRoundCorner ? 25 : 0,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Poppins',
            
                lineHeight: 24,
                fontWeight: '700',
                color: getSelectionMode == 1 ? 'white' : AppColor.BLACK,
              }}>
              {option1}
            </Text>
          </TouchableOpacity>
        </LinearGradient>
        <LinearGradient
          start={{x: 0, y: 1}}
          end={{x: 1, y: 0}}
          // colors={['#941000', '#D01818']}
          colors={
            getSelectionMode == 2
              ? ['#941000', '#D01818']
              : ['#D9D9D9', '#D9D9D9']
          }
          style={{
            flex: 1,

            borderRadius: getRoundCorner ? 25 : 0,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            TouchableOpacity
            activeOpacity={1}
            onPress={() => updatedSwitchData(2)}
            style={{
              flex: 1,

              borderRadius: getRoundCorner ? 25 : 0,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Poppins',
            
                lineHeight: 24,
                fontWeight: '700',
                color: getSelectionMode == 2 ? 'white' : AppColor.BLACK,
              }}>
              {option2}
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  );
};
export default CustomSwitch;
