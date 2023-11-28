import React, {FC, memo} from 'react';
import {
  TouchableOpacity,
  Text,
  TouchableNativeFeedbackProps,
  View,
  StyleSheet,
} from 'react-native';
import { DeviceWidth } from './Config';

export type Props = TouchableNativeFeedbackProps & {
  textColor?: string;
  textSize?: number;
  style?: {};
  headingStyle?: {};
  textStyle?: {};
  pH?: number;
  pV?: number;
  displayType?: 'row' | 'column';
  data: any;
  radioColor: string;
  selected: string;
  setSelected: Function;
  mV?: number | 10;
  heading: string;
  errors: string | undefined;
  touched: boolean | undefined;
};

const TextRadio: FC<Props> = ({...Props}) => {
  return (
    <View
      style={{
        marginVertical: Props.mV,
        marginHorizontal: 20,
        width: DeviceWidth * 0.8,
      }}>
      <Text
        style={
          Props.headingStyle
            ? Props.headingStyle
            : {
                // color: COLORS.BLACK,
                fontSize: 15,
                // fontFamily: FONTS.ROBOTO_BOLD,
                fontWeight: '500',
              }
        }>
        {Props.heading}
      </Text>
      <View
        style={
          Props.style
            ? Props.style
            : {
                paddingHorizontal: Props.pH ? Props.pH : 5,
                paddingVertical: Props.pV ? Props.pV : 5,
                alignSelf: Props.displayType == 'column' ? 'auto' : 'center',
                flexDirection:
                  Props.displayType == 'row'
                    ? 'row'
                    : Props.displayType == 'column'
                    ? 'column'
                    : 'row',
                alignItems: 'center',
                justifyContent:
                  Props.displayType == 'row' ? 'space-between' : 'flex-start',
              }
        }>
        {Props.data.length &&
          Props.data.map((item: any, index: number) => (
            <TouchableOpacity
              key={index}
              onPress={() => Props.setSelected(item.value)}
              disabled={Props.disabled}
              style={{
                width: Props.displayType == 'column' ? '100%' : '50%',
                alignItems: 'center',
                flexDirection: 'row',
                marginVertical: 5,
                alignSelf: Props.displayType == 'column' ?'flex-start':'auto',
                marginHorizontal: Props.displayType == 'column' ? 10 : 0
              }}>
              <View
                style={{
                  height: 15,
                  width: 15,
                  borderRadius: 50,
                //   backgroundColor: COLORS.WHITE,
                  borderColor:
                    item.value == Props.selected
                      ? Props.radioColor
                      : 'black',
                  borderWidth: 1.5,
                  marginRight: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginVertical: 2,
                  alignSelf: 'baseline'
                }}>
                {item.value == Props.selected ? (
                  <View
                    style={{
                      backgroundColor: Props.radioColor,
                      margin: 10,
                      borderRadius: 50,
                      height: 10,
                      width: 10,
                    }}></View>
                ) : (
                  <View
                    style={{
                    //   backgroundColor: COLORS.WHITE,
                      margin: 5,
                      borderRadius: 50,
                      height: 8,
                      width: 8,
                    }}></View>
                )}
              </View>
              <Text
                style={
                  Props.textStyle
                    ? Props.textStyle
                    : {
                        color: Props.textColor
                          ? Props.textColor
                          : 'grey',
                        // fontFamily: FONTS.ROBOTO_BOLD,
                        fontSize: Props.textSize ? Props.textSize : 14,
                        fontWeight: '500',
                      }
                }>
                {item.value}
              </Text>
            </TouchableOpacity>
          ))}
      </View>
      {Props.errors && Props.touched && (
        <Text style={{color: 'red', fontSize: 11, textAlign: 'center'}}>
          {Props.errors}
        </Text>
      )}
    </View>
  );
};

export default memo(TextRadio);
