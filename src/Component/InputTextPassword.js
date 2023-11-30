import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import React from 'react';
import {AppColor} from './Color';
import {StyleSheet} from 'react-native';
import {localImage} from './Image';
import { DeviceHeigth, DeviceWidth } from './Config';

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
const InputTextPassword = ({...Props}) => {
  return (
    <View style={styles.container}>
      <View style={styles.input}>
        <View style={{flexDirection: 'row'}}>
          <TextInput
            {...Props}
            style={{
              width: '80%',
              paddingLeft: 10,
              paddingRight: 10,
              fontFamily: 'Poppins',
            }}></TextInput>
        </View>
      </View>
      {Props.errors && Props.touched && (
        <Text
          style={{
            color: Props.colorText ? 'green' : 'red',
            fontSize: 12,
            textAlign: 'center',
          }}>
          {Props.errors}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
       // width: '40%',
        justifyContent: 'center',
        alignSelf: 'center',
        height:DeviceHeigth*0.08,
        // backgroundColor: '#E3E3E3',
      },
      input: {
        width:DeviceWidth*0.15,
        backgroundColor:'#F8F9F9',
        height:DeviceHeigth*0.07,
        borderRadius: 15,
        borderColor:'#E3E3E3',
        borderWidth: 1,
        justifyContent: 'center',
        paddingLeft: 10,
      },
});
export default InputTextPassword;
