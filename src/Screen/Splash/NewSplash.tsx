import {ImageBackground, StatusBar, StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {localImage} from '../../Component/Image';
import SplashAnimation from './SplashAnimation';
import {ActivityIndicator} from 'react-native';
import FitText from '../../Component/Utilities/FitText';
import {AppColor} from '../../Component/Color';
import {setupSubscription} from './setupSubscription';
import {API_CALLS} from '../../API/API_CALLS';
import useSetupAds from './useSetupAds';
import {useSelector} from 'react-redux';
import checkAllPermissions from './checkAllPermissions';

const NewSplash = ({navigation}: any) => {
  const [loader, setLoader] = useState(true);
  const getUserDataDetails = useSelector(
    (state: any) => state.getUserDataDetails,
  );
  const getAllExercise = useSelector((state: any) => state.getAllExercise);
  const getOfferAgreement = useSelector(
    (state: any) => state.getOfferAgreement,
  );
  const showIntro = useSelector((state: any) => state.showIntro);
  const getChallengesData = useSelector(
    (state: any) => state.getChallengesData,
  );

  useEffect(() => {
    const time = setTimeout(() => {
      setLoader(false);
    }, 10000);

    return () => clearTimeout(time);
  }, []);

  useEffect(() => {
    if (!loader) loadScreen();
  }, [loader]);

  const afterAdFunction = () => {
    setupSubscription();
    API_CALLS.getMajorData();
    API_CALLS.postLogin(getUserDataDetails?.name, getUserDataDetails?.email);
    API_CALLS.getUserDataDetails(getUserDataDetails?.id);
    API_CALLS.getAllWorkouts(getUserDataDetails?.id)
    getAllExercise &&
      getChallengesData &&
      API_CALLS.getAllExercisesData(getUserDataDetails?.id);
      loadScreen()
  };
  const loadScreen = () => {
    if (showIntro) {
      if (getUserDataDetails?.id) {
        if (getUserDataDetails?.profile_compl_status == 1) {
          if (getOfferAgreement?.term_condition == 'Accepted') {
            checkAllPermissions();
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
  
  useSetupAds({afterAdFunction, setLoader});

  return (
    <ImageBackground
      source={localImage.BGSplash}
      style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
      imageStyle={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <StatusBar backgroundColor="white" barStyle={'light-content'} />
      <SplashAnimation />
      <View style={{position: 'absolute', bottom: 10}}>
        <ActivityIndicator
          animating={loader}
          size={'large'}
          color={AppColor.RED}
        />
        <FitText type="SubHeading" value="Please wait..." />
      </View>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({});
export default NewSplash;
