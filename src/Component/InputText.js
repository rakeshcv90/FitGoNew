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
          <Image
            source={Props.leftIcon}
            style={{width: 20, height: 25}}
            resizeMode="contain"
          />
          <TextInput
            {...Props}
            style={{
              width: '80%',
              paddingLeft: 10,
              paddingRight: 10,
              fontFamily: 'Poppins',
            }}></TextInput>

          {Props.passwordInput && (
            <TouchableOpacity
              onPress={Props.pasButton}
              style={{
                alignSelf: 'flex-end',
               
              }}>
              {Props.passwordInputIcon ? (
                <Image
                  source={localImage.EYE}
                  style={{width: 20, height: 20}}
                  resizeMode="contain"
                  tintColor='#ADA4A5'
                />
              ) : (
                <Image
                  source={localImage.EYE1}
                  style={{width: 20, height: 20}}
                  resizeMode="contain"
                  tintColor='#ADA4A5'
                />
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
      {Props.errors && Props.touched && (
        <Text style={{color:Props.colorText?'green' :'red', fontSize: 12, textAlign: 'center'}}>
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
    width: '95%',
    backgroundColor:'#F8F9F9',
    height: 55,
    borderRadius: 15,
    borderColor:'#E3E3E3',
    borderWidth: 1,
    justifyContent: 'center',
    paddingLeft: 10,
  },
});
export default InputText;
