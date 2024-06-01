import React, {FC, memo} from 'react';
import {
  TouchableOpacity,
  Text,
  TouchableNativeFeedbackProps,
  View,
  StyleSheet,
  ViewStyle,
  Platform,
} from 'react-native';
import {DeviceWidth} from '../Config';
import {AppColor, Fonts} from '../Color';

type data = {
  id: number;
  title: string;
};

export type Props = TouchableNativeFeedbackProps & {
  textColor?: string;
  textSize?: number;
  style?: {};
  headingStyle?: {};
  textStyle?: {};
  pH?: number;
  pV?: number;
  displayType?: 'row' | 'column';
  data: Array<data>;
  radioColor: string;
  selected: string;
  setSelected: Function;
  mV?: number | 10;
  heading?: string;
  errors: string | undefined;
  touched: boolean | undefined;
  w?: number;
  bgItem?: string;
  containerStyle?: ViewStyle;
  hasHeader?: boolean | false;
  bR?: number;
  shadow?: boolean | false;
};

const RadioButtons: FC<Props> = ({...Props}) => {
  const Radio = ({item, index}: any) => {
    return (
      <TouchableOpacity
        key={index}
        onPress={() => Props.setSelected(item.id)}
        disabled={Props.disabled}
        style={[
          {
            display: 'flex',
            padding: Props.pV ? Props.pV : 5,
            width: Props.displayType == 'column' ? '100%' : '50%',
            alignItems: 'center',
            flexDirection: 'row',
            marginVertical: Props.displayType == 'column' ? 0 : 5,
            marginHorizontal: Props.displayType == 'column' ? 10 : 0,
            alignSelf: Props.displayType == 'column' ? 'center' : 'auto',
            justifyContent: 'center',
            backgroundColor:
              item.id == Props.selected ? Props.bgItem : AppColor.WHITE,
            shadowColor: item.id != Props.selected ? 'grey' : AppColor.WHITE,
          },

          Props.shadow && styles.shadow,
        ]}>
        <View
          style={{
            height: 15,
            width: 15,
            borderRadius: 50,
            backgroundColor: AppColor.WHITE,
            borderColor: item.id == Props.selected ? '#A93737' : AppColor.BLACK,
            borderWidth: 1.5,
            marginRight: 5,
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: 2,
            alignSelf: 'baseline',
          }}>
          {item.id == Props.selected ? (
            <View
              style={{
                backgroundColor: '#A93737',
                margin: 10,
                borderRadius: 50,
                height: 7,
                width: 7,
              }}></View>
          ) : (
            <View
              style={{
                backgroundColor: AppColor.WHITE,
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
                  color: Props.textColor ? Props.textColor : '#79747E',
                  fontFamily: Fonts.MONTSERRAT_BOLD,
                  fontSize: Props.textSize ? Props.textSize : 14,
                  fontWeight: '500',
                }
          }>
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <>
      {Props.hasHeader ? (
        <View
          style={[
            Props.containerStyle || {
              marginVertical: Props.mV,
              marginHorizontal: 20,
              width: Props.w ? Props.w : DeviceWidth * 0.8,
            },
            Props.shadow && styles.shadow,
          ]}>
          <Text
            style={
              Props.headingStyle
                ? Props.headingStyle
                : {
                    color: AppColor.BLACK,
                    fontSize: 15,
                    fontFamily: Fonts.MONTSERRAT_BOLD,
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
                    alignSelf:
                      Props.displayType == 'column' ? 'auto' : 'center',
                    flexDirection:
                      Props.displayType == 'row'
                        ? 'row'
                        : Props.displayType == 'column'
                        ? 'column'
                        : 'row',
                    alignItems: 'center',
                    justifyContent:
                      Props.displayType == 'row'
                        ? 'space-between'
                        : 'flex-start',
                  }
            }>
            {Props.data.length &&
              Props.data.map((item: any, index: number) => (
                <Radio item={item} index={index} />
              ))}
          </View>
          {Props.errors && Props.touched && (
            <Text style={{color: 'red', fontSize: 11, textAlign: 'center'}}>
              {Props.errors}
            </Text>
          )}
        </View>
      ) : (
        <>
          {/* <View
            style={[
              Props.style
                ? Props.style
                : {
                    // paddingHorizontal: Props.pH ? Props.pH : 5,
                    width: Props.w || '50%',
          // paddingVertical: 0,
          // width: Props.displayType == 'column' ? '80%' : '50%',
                    alignSelf:
                      Props.displayType == 'column' ? 'auto' : 'center',
                    flexDirection: Props.displayType,
                    alignItems: 'center',
                    justifyContent:
                      Props.displayType == 'row'
                        ? 'space-between'
                        : Props.hasHeader
                        ? 'flex-start'
                        : 'center',
                    borderRadius: Props.bR || 0,
                    // backgroundColor: 'white',
                  },
              Props.shadow && styles.shadow,
            ]}> */}
          {Props.data.length &&
            Props.data.map((item: any, index: number) => (
              <Radio item={item} index={index} />
            ))}
          {/* </View>
          {Props.errors && Props.touched && (
            <Text style={{color: 'red', fontSize: 11, textAlign: 'center'}}>
              {Props.errors}
            </Text>
          )} */}
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  shadow: {
    ...Platform.select({
      ios: {
        //shadowColor: '#000000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
    }),
  },
});
export default memo(RadioButtons);
