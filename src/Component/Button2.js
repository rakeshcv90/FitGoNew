import {View, Text, TouchableOpacity, Image, Platform} from 'react-native';
import React from 'react';
import {DeviceHeigth, DeviceWidth} from './Config';
import {StyleSheet} from 'react-native';
import {AppColor, Fonts, PLATFORM_IOS} from './Color';
import LinearGradient from 'react-native-linear-gradient';
import {localImage} from './Image';

const Button2 = ({buttonText, onFBPress, onGooglePress, onApplePress}) => {
  return (
    <View
      style={{
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
      }}>
      {Platform.OS == 'android' ? (
        <TouchableOpacity
          style={[styles.buttonStyle, {flexDirection:'row'}]}
          activeOpacity={0.5}
          onPress={onGooglePress}>

          <Image
            source={localImage.GOOGLE}
            style={{width: DeviceWidth * 0.12, height: DeviceHeigth * 0.035,left:-5}}
            resizeMode="contain"
          />
          <Text style={{fontSize:16,fontWeight:'600',fontFamily:Fonts.MONTSERRAT_SEMIBOLD}}>Continue With Google</Text>
        </TouchableOpacity>
      ) : (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          
          }}>
          <TouchableOpacity
           onPress={onApplePress}
            style={[styles.buttonStyle, ]}
            activeOpacity={0.5}
           >
            <Image
              source={localImage.AppleLogo}
              style={{width: DeviceWidth * 0.4, height: DeviceHeigth * 0.035}}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.buttonStyle,{marginLeft:10} ]}
            activeOpacity={0.5}
            onPress={onGooglePress}>
            <Image
              source={localImage.GOOGLE1}
              style={{width: DeviceWidth * 0.4, height: DeviceHeigth * 0.035}}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      )}
    </View>

    // <View
    //   style={{
    //     flexDirection: 'row',
    //     alignSelf: 'center',
    //     justifyContent: Platform.OS == 'android' ? 'center' : 'space-between',
    //     alignItems: 'center',
    //   }}>
    //   {Platform.OS == 'ios' && (
    //     <>
    //       <TouchableOpacity
    //         style={[styles.buttonStyle]}
    //         activeOpacity={0.5}
    //         onPress={onApplePress}>
    //         <Image
    //           source={localImage.AppleLogo}
    //           style={{width: DeviceWidth * 0.4, height: DeviceHeigth * 0.035}}
    //           resizeMode="contain"
    //         />
    //       </TouchableOpacity>
    //     </>
    //   )}

    //   <TouchableOpacity
    //     style={[styles.buttonStyle, {marginRight: DeviceWidth * 0.07}]}
    //     activeOpacity={0.5}
    //     onPress={onGooglePress}>
    //     <Image
    //       source={localImage.GOOGLE}
    //       style={{width: DeviceWidth * 0.4, height: DeviceHeigth * 0.035}}
    //       resizeMode="contain"
    //     />
    //   </TouchableOpacity>
    // </View>
  );
};
const styles = StyleSheet.create({
  buttonStyle: {
    backgroundColor: AppColor.SOCIALBUTTON,
    // width: DeviceWidth * 0.4,
    paddingRight: Platform.OS == 'android' ? 20 : 0,
    paddingLeft: Platform.OS == 'android' ? 20 : 0,
    height: DeviceHeigth * 0.07,
    borderRadius: 10,
    justifyContent: 'center',
   alignItems: 'center',
    alignSelf: 'center',
  },
});

export default Button2;
