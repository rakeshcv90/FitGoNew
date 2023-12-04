import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import NewHeader from '../Component/Headers/NewHeader';
import {localImage} from '../Component/Image';
import {DeviceHeigth, DeviceWidth} from '../Component/Config';
import {AppColor} from '../Component/Color';
import LinearGradient from 'react-native-linear-gradient';
const NewProfileScreen = () => {
  return (
    <View style={styles.Container}>
      <NewHeader backButton header={'Profile'} />
      <View style={styles.DetailView}>
        <Image
          source={localImage.Inrtoduction1}
          style={styles.ProfileImg}
          resizeMode="contain"
        />
        <View style={styles.TextView}>
          <Text style={styles.NameText}>Jamie</Text>
          <Text>abc@gmail.com</Text>
        </View>
        <TouchableOpacity
          style={[styles.Button, {backgroundColor: AppColor.RED}]}>
          <LinearGradient
            start={{x: 1, y: 0}}
            end={{x: 0, y: 1}}
            colors={['#941000', '#D01818']}
            style={styles.buttonStyle}>
            <Text style={styles.EditText}>Edit</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
  ProfileImg: {
    width: 90,
    height: 90,
    borderRadius:90 / 2,
  },
  DetailView: {
    marginVertical: DeviceHeigth*0.05,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginHorizontal:DeviceWidth*0.02
  },
  Button: {
    width: DeviceWidth * 0.21,
    height: DeviceHeigth * 0.033,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  TextView: {
    marginLeft: -20,
  },
  buttonStyle: {
    // backgroundColor: AppColor.RED,
    width: DeviceWidth * 0.21,
    height: DeviceHeigth * 0.03,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  EditText:{
    color:AppColor.WHITE,
    fontFamily:'Poppins',
    fontWeight:'bold'
  },
  NameText:{
    fontFamily:"Poppins",
    color:AppColor.INPUTTEXTCOLOR,
    fontWeight:'bold',
    fontSize:18
  }
});
export default NewProfileScreen;
