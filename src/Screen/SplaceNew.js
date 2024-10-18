import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Dimensions,
  Image,
  StatusBar,
} from 'react-native';
import {useSelector} from 'react-redux';
import { AppColor } from '../Component/Color';
import { CommonActions } from '@react-navigation/native';

export default function SplaceNew({navigation}) {
  const showIntro = useSelector(state => state.showIntro);
  const getOfferAgreement = useSelector(state => state.getOfferAgreement);
  const getUserDataDetails = useSelector(state => state.getUserDataDetails);

  useEffect(() => {
    setTimeout(() => {
      loadScreen();
    }, 1000);
  }, []);

  const loadScreen = () => {
    if (showIntro) {
      if (getUserDataDetails?.id) {
        if (getUserDataDetails?.profile_compl_status == 1) {
          if (getOfferAgreement?.term_condition == 'Accepted') {
            // navigation.replace('BottomTab');
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'BottomTab'}],
              }),
            );
          } else {
            navigation.replace('OfferTerms');
          }
        } else {
          navigation.navigate('Yourself');
        }
      } else {
        navigation.replace('LogSignUp');
      }
    } else {
      navigation.replace('IntroductionScreen1');
    }
  };
  return (
    <View style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={AppColor.WHITE} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
