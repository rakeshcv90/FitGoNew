import { ImageBackground, StatusBar, StyleSheet, View, Image, Text, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import { localImage } from '../../Component/Image';
import SplashAnimation from './SplashAnimation';
import { ActivityIndicator } from 'react-native';
import FitText from '../../Component/Utilities/FitText';
import { AppColor } from '../../Component/Color';
import { setupSubscription } from './setupSubscription';
import { API_CALLS } from '../../API/API_CALLS';
import useSetupAds from './useSetupAds';
import { useSelector } from 'react-redux';
import checkAllPermissions from './checkAllPermissions';
import LottieView from 'lottie-react-native';
// import AdmobInterstitial from '../../Component/NativeCodeAds/AdmobInterstitial';
import { setLanguage, getCurrentLanguage } from '../Translation/TranslationService';

const NewSplash = ({ navigation }: any) => {

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

  const handleLangChange = async (langCode: string) => {
    await setLanguage(langCode);
    console.log('Language changed to:', langCode);
  };

  useEffect(() => {
    const applyLanguage = async () => {
      console.log('get language', getCurrentLanguage)
      await handleLangChange(getCurrentLanguage); // or 'hi', 'en', etc.
    };

    applyLanguage();
  }, []);

  // useEffect(() => {
  //   if (Platform.OS === 'android') {
  //     AdmobInterstitial.loadAd()
  //       .then(() => console.log('Ad Loaded'))
  //       .catch((err) => console.error('Ad Load Failed 123 .....', err));
  //   }
  // }, []);

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
    console.log("SDfdsfdsfdsf .... ", getUserDataDetails?.name, getUserDataDetails?.email, getUserDataDetails)
    setupSubscription();
    API_CALLS.getMajorData();
    if (getUserDataDetails.id != null) {
      API_CALLS.postLogin(getUserDataDetails?.name, getUserDataDetails?.email);
      API_CALLS.getUserDataDetails(getUserDataDetails?.id);
      if(getUserDataDetails.gender != null){
      API_CALLS.getAllWorkouts(getUserDataDetails?.id)
      }
      API_CALLS.pastWinners()
      getAllExercise &&
        getChallengesData &&
        API_CALLS.getAllExercisesData(getUserDataDetails?.id);
    }

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
        console.log("login call from splash")
        navigation.replace('LogSignUp');
      }
    } else {
      navigation.replace('IntroductionScreen1');
    }
  };

  useSetupAds({ afterAdFunction, setLoader });

  return (
    // <ImageBackground
    //   source={localImage.BGSplash}
    //   style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
    //   imageStyle={{
    //     flex: 1,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //   }}>
    //   <StatusBar backgroundColor="white" barStyle={'light-content'} />
    //   <SplashAnimation />
    //   <View style={{position: 'absolute', bottom: 10}}>
    //     <ActivityIndicator
    //       animating={loader}
    //       size={'large'}
    //       color={AppColor.RED}
    //     />
    //     <FitText type="SubHeading" value="Please wait..." />
    //   </View>
    // </ImageBackground>

    <View style={styles.container}>
      <StatusBar backgroundColor="#0D1117" barStyle="light-content" />

      <Image
        source={localImage.Splashlogo} // Replace with your actual logo
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Método HQ72</Text>

      <View style={styles.loaderContainer}>
        <LottieView
          source={localImage.Splashlottie} // Replace with your Lottie file
          autoPlay
          loop
          style={styles.lottie}
          onAnimationFinish={() => setLoader(false)}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1117',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    height: 140,
    width: 140,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    fontFamily: 'BlackOpsOne-Regular.ttf', // Use your custom font if needed
    marginBottom: 20,
  },
  loaderContainer: {
    width: '60%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lottie: {
    width: '100%',
    height: 40,
  },
});
export default NewSplash;
