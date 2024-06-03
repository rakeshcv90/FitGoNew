import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {AppColor, Fonts} from '../../Component/Color';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import RadioButtons from '../../Component/Utilities/RadioButtons';
import FitText from '../../Component/Utilities/FitText';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {navigationRef} from '../../../App';
import GradientButton from '../../Component/GradientButton';
import {useFocusEffect} from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoder-reborn';
import NewButton from '../../Component/NewButton';

type Coordinates = {
  latitude: number;
  longitude: number;
};
const radioData = [
  {
    id: 1,
    title: 'English',
  },
  {
    id: 2,
    title: 'Hindi',
  },
];
const OfferTerms = ({navigation, route}: any) => {
  const [selected, setSelected] = useState('1');
  const [opened, setOpened] = useState(false);
  const [checked, setChecked] = useState(false);
  const CheckBox = () => {
    return (
      <View style={styles.checkBoxContainer}>
        <TouchableOpacity onPress={() => setChecked(!checked)}>
          <Icons
            name={checked ? 'checkbox-marked' : 'checkbox-blank-outline'}
            size={28}
            color={checked ? '#A93737' : '#333333'}
          />
        </TouchableOpacity>
        <View>
          <Text style={styles.policyText}>By continuing you accept our</Text>
        </View>
      </View>
    );
  };
  const handleAgreement = () => {
    navigation.navigate('CountryLocation');
  };
  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          backgroundColor: 'white',
          paddingVertical: (DeviceWidth * 0.1) / 2,
          shadowColor: 'grey',
          ...Platform.select({
            ios: {
              shadowOffset: {width: 1, height: 0},
              shadowOpacity: 0.3,
              shadowRadius: 2,
            },
            android: {
              elevation: 4,
            },
          }),
        }}>
        <AntDesign
          name={'arrowleft'}
          size={25}
          color={AppColor.INPUTTEXTCOLOR}
          onPress={() => navigation.goBack()}
          style={{marginLeft: 16}}
        />
        <View
          style={{
            marginTop: 10,
            paddingHorizontal: 16,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View>
            <FitText
              value="Agreement"
              type="SubHeading"
              textTransform="uppercase"
              fontWeight="500"
              letterSpacing={0.2}
            />
            <FitText value="Terms & Conditions" type="Heading" />
          </View>
          <TouchableOpacity
            onPress={() => setOpened(!opened)}
            activeOpacity={1}
            style={{
              width: DeviceWidth * 0.22,
            }}>
            <View
              style={{
                backgroundColor: '#3333330A',
                padding: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <FitText
                type="normal"
                value={selected == '1' ? 'English' : 'Hindi'}
                fontWeight="500"
                fontSize={12}
              />
              <AntDesign name={opened ? 'caretdown' : 'caretup'} size={10} />
            </View>
            {opened && (
              <View
                style={{
                  position: 'absolute',
                  right: 5,
                  top: DeviceWidth * 0.1,
                }}>
                <RadioButtons
                  data={radioData}
                  errors=""
                  displayType="column"
                  radioColor=""
                  selected={selected}
                  setSelected={setSelected}
                  touched={false}
                  bgItem="#3333330A"
                  pV={20}
                  w={DeviceWidth * 0.3}
                  shadow
                />
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
      <View style={{flex: 1}}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <FitText type="SubHeading" value="asdasdasdasdasdasdasdasda" />
          <FitText type="Heading" value="·····asdasdasdasdasdasdasdasda" />
          <FitText type="normal" value="·asdasdasdasdasdasdasdasda" />
          <View style={styles.HLine} />
          <CheckBox />
          <NewButton
            pV={14}
            title={'I Agree'}
            disabled={!checked}
            opacity={checked ? 1 : 0.7}
            onPress={() => handleAgreement()}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default OfferTerms;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: AppColor.WHITE},
  policyText: {
    fontFamily: Fonts.MONTSERRAT_REGULAR,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
    color: AppColor.BLACK,
    marginLeft: 10,
  },
  buttonText: {
    fontSize: 14,
    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
    lineHeight: 20,
    fontWeight: '500',
    zIndex: 1,
    color: AppColor.WHITE,
  },
  HLine: {
    backgroundColor: '#3333331A',
    height: 1,
    width: '100%',
  },
  checkBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '85%',
    alignSelf: 'center',
    paddingRight: DeviceWidth * 0.08,
    marginTop: DeviceHeigth * 0.02,
    marginBottom: DeviceWidth * 0.1,
  },
});
