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
import AdmobInterstitial from '../../Component/NativeCodeAds/AdmobInterstitial';
import { setLanguage, getCurrentLanguage, loadLanguage } from '../Translation/TranslationService';

const NewSplash = ({ navigation }: any) => {

  const [loader, setLoader] = useState(true);

  const getAllExercise = useSelector((state: any) => state.getAllExercise);
  const getOfferAgreement = useSelector(
    (state: any) => state.getOfferAgreement,
  );
  const showIntro = useSelector((state: any) => state.showIntro);
  const getChallengesData = useSelector(
    (state: any) => state.getChallengesData,
  );

  const getUserDataDetails = useSelector(
    (state: any) => state.getUserDataDetails,
  );
  const lang = getCurrentLanguage();

  const handleLangChange = async (langCode: string) => {
    await setLanguage(langCode);
    console.log('Language changed to:', langCode);
  };

  useEffect(() => {
    const applyLanguage = async () => {
      console.log('get language', lang)
      await handleLangChange(lang); // or 'hi', 'en', etc.
    };
    applyLanguage();
    loadLanguage();
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
    }, 20000);
    return () => clearTimeout(time);
  }, []);

  useEffect(() => {
    console.log('loader ', loader);
    if (!loader) loadScreen();
  }, [loader]);

  const afterAdFunction = () => {
    console.log("SDfdsfdsfdsf .... ", getUserDataDetails, lang)
    setupSubscription();
    API_CALLS.getMajorData(lang);
    if (getUserDataDetails.id != null) {
      API_CALLS.postLogin(getUserDataDetails?.name, getUserDataDetails?.email);
      API_CALLS.getUserDataDetails(getUserDataDetails?.id, lang);
      if (getUserDataDetails.gender != null) {
        API_CALLS.getAllWorkouts(getUserDataDetails?.id, lang)
      }
      API_CALLS.pastWinners()
      getAllExercise &&
        getChallengesData &&
        API_CALLS.getAllExercisesData(getUserDataDetails?.id, lang);
    }
    // const time = setTimeout(() => {
    // loadScreen()
    // }, 10000);
  };

  const loadScreen = () => {
    setLoader(true);
    if (showIntro) {
      console.log("111");
      if (getUserDataDetails?.id) {
        console.log("112");
        if (getUserDataDetails?.profile_compl_status == 1) {
          console.log("113");
          if (getOfferAgreement?.term_condition == 'Accepted') {
            console.log("114");
            checkAllPermissions();
          } else {
            console.log("115");
            if (Platform.OS === 'android') {
              AdmobInterstitial.showAd()
                .then(() => {
                  console.log('Ad shown and completed');
                  navigation.replace('OfferTerms');
                })
                .catch((err) => {
                  console.error('Ad show failed', err);
                  navigation.replace('OfferTerms');
                });
            } else {
              navigation.replace('OfferTerms');
            }
          }
        } else {
          console.log("116");
          if (Platform.OS === 'android') {
            AdmobInterstitial.showAd()
              .then(() => {
                console.log('Ad shown and completed');
                navigation.navigate('Yourself');
              })
              .catch((err) => {
                console.error('Ad show failed', err);
                navigation.navigate('Yourself');
              });
          } else {
            navigation.navigate('Yourself');
          }
        }
      } else {
        console.log("login call from splash")
        if (Platform.OS === 'android') {
          AdmobInterstitial.showAd()
            .then(() => {
              console.log('Ad shown and completed');
              navigation.replace('LogSignUp');
            })
            .catch((err) => {
              console.error('Ad show failed', err);
              navigation.replace('LogSignUp');
            });
        } else {
          navigation.replace('LogSignUp');
        }
      }
    } else {
      console.log("118");
      if (Platform.OS === 'android') {
        AdmobInterstitial.showAd()
          .then(() => {
            console.log('Ad shown and completed');
            navigation.replace('IntroductionScreen1');
          })
          .catch((err) => {
            console.error('Ad show failed', err);
            navigation.replace('IntroductionScreen1');
          });
      } else {
        navigation.replace('IntroductionScreen1');
      }
    }
    afterAdFunction();
  };
  //  useSetupAds({ afterAdFunction, setLoader });

  return (
    // <ImageBackground
    //   source={localImage.BGSplash}
    //   style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
    //   imageStyle={{
    //     flex: 1,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //   }}>
    //   <StatusBar backgroundColor="white" barStyle={'light-content'} />
    //   <SplashAnimation />
    //   <View style={{ position: 'absolute', bottom: 10 }}>
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
