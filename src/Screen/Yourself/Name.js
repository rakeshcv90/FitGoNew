import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import React, {useState} from 'react';
import {AppColor, Fonts, PLATFORM_IOS} from '../../Component/Color';
import ProgressBar from './ProgressBar';
import {TextInput} from 'react-native-paper';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
const Name = ({navigation, route}) => {
  const {nextScreen, data} = route?.params;
  const [name, setName] = useState('');
  const toNextScreen = () => {
    navigation.navigate('Gender', {
      name: name,
      nextScreen: nextScreen + 1,
      data: data,
    });
  };
  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => Keyboard.dismiss()}
      style={styles.Container}>
      <ProgressBar screen={1} />
      <Text style={styles.txt1}>What's your name?</Text>
      <View style={styles.View1}>
        <TextInput
          underlineColor="grey"
          mode="flat"
          keyboardType={AppColor.BLACK}
          activeUnderlineColor={AppColor.RED}
          outlineColor={AppColor.WHITE}
          activeOutlineColor={AppColor.RED}
          placeholder="Write your name"
          placeholderTextColor={AppColor.GRAY2}
          onChangeText={txt => setName(txt)}
          style={{
            width: DeviceWidth * 0.45,
            fontSize: 18,
            fontWeight: '600',
            fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
            color: AppColor.BLACK,
            backgroundColor: AppColor.WHITE,
            textAlign: 'center',
          }}
        />
      </View>
      <KeyboardAvoidingView behavior={PLATFORM_IOS ? 'position' : 'height'}>
        {name !== '' && (
          <TouchableOpacity
            style={styles.buttons}
            onPress={() => {
              toNextScreen();
            }}>
            <LinearGradient
              start={{x: 0, y: 1}}
              end={{x: 1, y: 0}}
              colors={['#941000', '#D5191A']}
              style={[styles.nextButton]}>
              <Icons name="chevron-right" size={25} color={'#fff'} />
            </LinearGradient>
          </TouchableOpacity>
        )}
      </KeyboardAvoidingView>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: AppColor.WHITE,
  },
  View1: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: DeviceHeigth * 0.2,
  },
  //test styles
  txt1: {
    textAlign: 'center',
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontSize: 25,
    color: AppColor.BLACK,
  },
  buttons: {
    bottom: DeviceHeigth * 0.02,
    position: 'absolute',
    right: 20,
  },
  nextButton: {
    backgroundColor: 'red',
    width: 45,
    height: 45,
    borderRadius: 50 / 2,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default Name;
