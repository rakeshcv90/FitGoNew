import {View, Text, Image, TouchableOpacity, Platform} from 'react-native';
import React from 'react';
import {AppColor} from './Color';
import {StyleSheet} from 'react-native';
import {localImage} from './Image';
import {DeviceWidth} from './Config';
import {TextInput} from 'react-native-paper';

export type Props = TextInputProps & {
  IconLeft: any,
  IconRight?: boolean | false,
  text: string,
  errors: any | undefined,
  touched: any | undefined,
  placeholder: string,

  pasButton?: () => void,
  passwordInput?: boolean | false,
  passwordInputIcon?: boolean | false,
  textWidth?: any,
  w?: 'half' | 'full',
  colorText?: boolean | false,
  headerText: string,
  leftIcon: string,
};
const InputText = ({...Props}) => {
  return (
    <View style={styles.container}>
      <View style={styles.input}>
        <View style={{flexDirection: 'row'}}>
          <TextInput
          
            {...Props}
            mode="outlined"
            activeOutlineColor="#707070"
            outlineStyle={{borderRadius: 15}}
            style={{
              backgroundColor: '#F8F9F9',
              width: DeviceWidth * 0.9,
              alignSelf: 'center',
              height: 55,
              fontFamily: 'Poppins',
            }}
          />
        </View>
      </View>
      {Props.errors && Props.touched && (
        <Text
          style={{
            color: Props.colorText ? 'green' : 'red',
            fontSize: 12,
            textAlign: 'center',
            marginTop:5
          }}>
          {Props.errors}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '95%',
    justifyContent: 'center',
    alignSelf: 'center',
    // backgroundColor: '#E3E3E3',
  },
  input: {
    width: DeviceWidth * 0.9,
    //backgroundColor: '#F8F9F9',
    height: 55,

    justifyContent: 'center',
  },
});
export default InputText;
