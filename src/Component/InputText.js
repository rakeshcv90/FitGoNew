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
  mV?: number,
  mH?: number,
  IconLeft: any,
  IconRight?: boolean | false,
  text: string,
  errors: any | undefined,
  touched: any | undefined,
  placeholder: string,
  bgColor: string,
  bColor?: string,
  bR?: number,
  bW?: number,
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
      {/* <View
        style={{
          width: '95%',
          backgroundColor: '#F5F5F5',
          height: 55,
          borderRadius: 5,
          borderColor: 'gray',
          borderWidth: 1,
          justifyContent: 'center',
          paddingLeft: 20,
        }}>
        <View
          style={{
            marginTop: Platform.OS == 'android' && -20,
          }}>
          <TextInput {...Props}></TextInput>
        </View>

        {Props.IconRight && (
          <View
            style={{
              alignSelf: 'flex-end',
              marginTop: Platform.OS == 'android' ? -35 : -20,
              marginRight: 15,
            }}>
            <Image
              source={require('../assets/Image/tick.png')}
              style={{width: 15, height: 15}}
              resizeMode="contain"
            />
          </View>
        )}
        {Props.passwordInput && (
          <TouchableOpacity
            onPress={Props.pasButton}
            style={{
              alignSelf: 'flex-end',
              marginTop: Platform.OS == 'android' ? -35 : -20,
              marginRight: 15,
            }}>
            {Props.passwordInputIcon ? (
              <Image
                source={require('../assets/Image/eye.png')}
                style={{width: 20, height: 20}}
                resizeMode="contain"
              />
            ) : (
              <Image
                source={require('../assets/Image/eye1.png')}
                style={{width: 20, height: 20}}
                resizeMode="contain"
              />
            )}
          </TouchableOpacity>
        )}
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '90%',
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
