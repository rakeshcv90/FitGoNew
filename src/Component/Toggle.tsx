import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedbackProps,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {FC, useEffect} from 'react';
import {AppColor} from './Color';
import {useSelector} from 'react-redux';

type Props = TouchableWithoutFeedbackProps & {
  data: Array<any>;
  highlightColor: string;
  baseColor: string;
  selected: string;
  setSelected: Function;
};

const Toggle: FC<Props> = ({...Props}) => {
  const {defaultTheme} = useSelector((state: any) => state);

  return (
    <View
      style={{
        width: 100,
        height: 35,
        backgroundColor: Props.baseColor
          ? Props.baseColor
          : AppColor.SOCIALBUTTON,
        borderRadius: 25,
        overflow: 'hidden',
        flexDirection: 'row',
      }}>
      {Props.data &&
        Props.data.map((item: any, index: number) => (
          <TouchableWithoutFeedback
            onPress={() => Props.setSelected(item)}
            key={index}>
            <View
              style={{
                width: '50%',
                backgroundColor:
                  Props.selected == item
                    ? Props.highlightColor
                    : Props.baseColor,
                height: 35,
                borderRadius: 25,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: !defaultTheme ? AppColor.WHITE : AppColor.BLACK,
                  fontWeight: '500',
                  fontFamily: 'Verdana',
                  fontSize: 12,
                }}>
                {item}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        ))}
    </View>
  );
};

export default Toggle;

const styles = StyleSheet.create({});
