// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Platform,
//   Alert,
//   StyleSheet,
//   Image,
// } from 'react-native';
// import React, {useEffect, useMemo, useState} from 'react';
// import LinearGradient from 'react-native-linear-gradient';
// import {DeviceHeigth, DeviceWidth, NewAppapi} from '../Config';
// import {locationPermission} from '../../Screen/Terms&Country/LocationPermission';
// import axios from 'axios';
// import {showMessage} from 'react-native-flash-message';
// import {
//   Setmealdata,
//   setAgreementContent,
//   setBanners,
//   setCompleteProfileData,
//   setOfferAgreement,
//   setStoreData,
// } from '../ThemeRedux/Actions';
// import {useDispatch, useSelector} from 'react-redux';
// import VersionNumber, {appVersion} from 'react-native-version-number';
// import {openSettings} from 'react-native-permissions';
// import {SliderBox} from 'react-native-image-slider-box';

// import {localImage} from '../Image';
// import FastImage from 'react-native-fast-image';
// import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
// import {AppColor, Fonts} from '../Color';
// import ActivityLoader from '../ActivityLoader';
// import {FlatList} from 'react-native-gesture-handler';
// import NameUpdateModal from './NameUpdateModal';
// import ThemeReducer from '../ThemeRedux/Reducer';
// import {AnalyticsConsole} from '../AnalyticsConsole';
// import Animated, {
//   useSharedValue,
//   useAnimatedStyle,
//   withTiming,
//   withRepeat,
//   useDerivedValue,
//   withSequence,
//   withDelay,
// } from 'react-native-reanimated';
// const Banners = ({
//   type1,
//   type2,
//   onPress,
//   navigation,
//   locationP,
//   setLocationP,
// }) => {
//   const getUserDataDetails = useSelector(state => state?.getUserDataDetails);
//   const getPurchaseHistory = useSelector(state => state?.getPurchaseHistory);
//   const getOfferAgreement = useSelector(state => state.getOfferAgreement);
//   const getBanners = useSelector(state => state?.getBanners);
//   const [loading, setLoading] = useState(true);
//   const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);
//   const avatarRef = React.createRef();
//   const [loaded, setLoaded] = useState(true);
//   const [openEditModal, setOpenEditModal] = useState(false);
//   const [dataType, setDatatype] = useState('');

//   const dispatch = useDispatch();
//   useEffect(() => {
//     if (Object.keys(getBanners).length == 0) {
//       //bannerApi();
//       getUserAllInData();
//     }
//   }, []);
//   const handleStart = () => {
//     if (getUserDataDetails?.email != null && getUserDataDetails?.name != null) {
//       setLoaded(false);
//       if (getOfferAgreement?.location == 'India') {
//         setLoaded(true);
//         if (getPurchaseHistory?.plan == null) {
//           AnalyticsConsole('PP_BANNER');
//           navigation.navigate('NewSubscription', {upgrade: false});
//         } else {
//           AnalyticsConsole('UP_BANNER');
//           navigation.navigate('UpcomingEvent', {eventType: 'upcoming'});
//         }
//       } else {
//         locationPermission()
//           .then(result => {
//             if (result == 'blocked') {
//               setLocationP(true);
//               setLoaded(true);
//             } else if (result === 'denied') {
//               setLocationP(true);
//               setLoaded(true);
//             } else if (result) {
//               StoreAgreementApi(result);
//             } else if (result == null) {
//               // setLocationP(true);
//               setLoaded(true);
//               showMessage({
//                 message: 'Error while getting your location',
//                 floating: true,
//                 duration: 500,
//                 type: 'danger',
//                 icon: {icon: 'auto', position: 'left'},
//               });
//             } else {
//               setLoaded(true);
//               showMessage({
//                 message: 'Error while getting your location',
//                 floating: true,
//                 duration: 500,
//                 type: 'danger',
//                 icon: {icon: 'auto', position: 'left'},
//               });
//             }
//           })
//           .catch(err => {
//             console.log('location Error', err);
//             setLoaded(true);
//           });
//       }
//     } else {
//       if (
//         (getUserDataDetails.name?.toUpperCase() == 'GUEST' ||
//           getUserDataDetails.name == null) &&
//         getUserDataDetails.email == null
//       ) {
//         AnalyticsConsole('BOTH_U_D');
//         setOpenEditModal(true);
//         setDatatype('both');
//       } else {
//         if (
//           getUserDataDetails.name?.toUpperCase() == 'GUEST' ||
//           getUserDataDetails.name == null
//         ) {
//           AnalyticsConsole('NAME_U_D');
//           setOpenEditModal(true);
//           setDatatype('name');
//         }
//         if (getUserDataDetails.email == null) {
//           AnalyticsConsole('EMAIL_U_D');
//           setOpenEditModal(true);
//           setDatatype('email');
//         }
//       }
//     }
//   };
//   // apis for start function
//   const StoreAgreementApi = async country => {
//     setLoaded(false);
//     const payload = new FormData();
//     payload.append('version', VersionNumber?.appVersion);
//     payload.append('user_id', getUserDataDetails?.id);
//     payload.append('country', country);
//     payload.append('term_conditons', 'Accepted');
//     try {
//       const Apicall = await axios(NewAppapi.STORE_USER_AGR_COUNTRY, {
//         method: 'POST',
//         data: payload,
//         headers: {'Content-Type': 'multipart/form-data'},
//       });
//       if (Apicall?.data) {
//         getAgreementStatus();
//       }
//     } catch (error) {
//       console.log(error);
//       setLoaded(true);
//     }
//   };
//   const getAgreementStatus = async () => {
//     try {
//       const ApiCall = await axios(NewAppapi.GET_AGR_STATUS, {
//         method: 'POST',
//         data: {
//           user_id: getUserDataDetails?.id,
//           version: VersionNumber?.appVersion,
//         },
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       if (
//         ApiCall?.data?.msg == 'Please update the app to the latest version.'
//       ) {
//         showMessage({
//           message: ApiCall?.data?.msg,
//           floating: true,
//           duration: 500,
//           type: 'danger',
//           icon: {icon: 'auto', position: 'left'},
//         });
//         setLoaded(true);
//       } else {
//         dispatch(setOfferAgreement(ApiCall?.data));
//         if (ApiCall?.data?.location == 'India') {
//           if (getPurchaseHistory?.plan == null) {
//             navigation.navigate('NewSubscription', {upgrade: false});
//           } else {
//             navigation.navigate('UpcomingEvent', {eventType: 'upcoming'});
//           }
//         }
//         setLoaded(true);
//       }
//     } catch (error) {
//       console.log(error);
//       setLoaded(true);
//     }
//   };
//   const getUserAllInData = async () => {
//     try {
//       const responseData = await axios.get(
//         `${NewAppapi.GET_ALL_IN_ONE}?version=${VersionNumber.appVersion}`,
//       );

//       if (
//         responseData?.data?.msg ==
//         'Please update the app to the latest version.'
//       ) {
//         showMessage({
//           message: responseData?.data?.msg,
//           type: 'danger',
//           animationDuration: 500,
//           floating: true,
//           icon: {icon: 'auto', position: 'left'},
//         });
//       } else if (responseData?.data?.msg == 'version is required') {
//       } else {
//         const objects = {};
//         responseData.data.data.forEach(item => {
//           objects[item?.type] = item?.image;
//         });

//         dispatch(setBanners(objects));
//         dispatch(setAgreementContent(responseData?.data?.terms[0]));
//         dispatch(Setmealdata(responseData?.data?.diets));
//         dispatch(setStoreData(responseData?.data?.types));
//         dispatch(setCompleteProfileData(responseData?.data?.additional_data));
//       }
//     } catch (error) {
//       console.log('all_in_one_api_error', error);
//       dispatch(Setmealdata([]));
//       dispatch(setCompleteProfileData([]));
//       dispatch(setStoreData([]));
//     }
//   };

//   const handleEventClicks = index => {
//     const Sat = getPurchaseHistory?.currentDay == 6;
//     const Sun = getPurchaseHistory?.currentDay == 7;
//     if (type1 == 'new_join') {
//       handleStart();
//     } else if (type1 == 'coming_soon') {
//       AnalyticsConsole('CS_BANNER');
//       showMessage({
//         message:
//           'This feature will be soon available in your country, stay tuned!',
//         floating: true,
//         duration: 500,
//         type: 'danger',
//         icon: {icon: 'auto', position: 'left'},
//       });
//     } else if (
//       type1 == 'joined_challenge' ||
//       (type2 == 'joined_challenge' && index == 1)
//     ) {
//       AnalyticsConsole('JN_BANNER');
//       navigation.navigate('UpcomingEvent', {eventType: 'current'});
//     } else if (type1 == 'ongoing_challenge' && index == 0) {
//       AnalyticsConsole(
//         Sat || Sun
//           ? `ON_B_CL_ON_${getPurchaseHistory?.currentDay}`
//           : 'ON_BANNER',
//       );
//       Sat || Sun
//         ? showMessage({
//             message:
//               'Your event has ended. You can resume your weekly plan normally from Monday. If you join another fitness challenge, it will start from the upcoming Monday.',
//             type: 'danger',
//             animationDuration: 500,
//             duration: 5000,
//             floating: true,
//           })
//         : navigation.navigate('MyPlans');
//     } else if (type2 == 'upcoming_challenge' && index == 1) {
//       AnalyticsConsole('UP_BANNER');
//       navigation.navigate('UpcomingEvent', {eventType: 'upcoming'});
//     }
//   };
//   const opacity = useSharedValue(0);

//   const animatedStyles = useAnimatedStyle(() => ({
//     opacity: opacity.value,
//   }));

//   useEffect(() => {
//     // opacity.value = withSequence(
//     //   withTiming(1, { duration: 1000 }),
//     //   withDelay(2000, withTiming(0, { duration: 1000 })),
//     // );
//     opacity.value = withRepeat(
//       withTiming(1, {duration: 2500}),

//       -1, // -1 means repeat indefinitely
//       true, // true means reverse the animation after each cycle
//     );
//   }, []);
//   const Box = ({imageSource}) => {
//     const renderItem = ({item, index}) => (
//       <TouchableOpacity
//         key={index}
//         onPress={() => handleEventClicks(index)}
//         style={{
//           height: DeviceHeigth * 0.2,
//           width:
//             imageSource?.length > 1 ? DeviceWidth * 0.9 : DeviceWidth * 0.95,
//           alignSelf: 'center',
//           marginRight: 15,
//           justifyContent: 'center',
//           alignItems: 'center',
//         }}>
//         {loading && (
//           <ShimmerPlaceholder
//             style={{
//               height: DeviceHeigth * 0.15,
//               width:
//                 imageSource?.length > 1
//                   ? DeviceWidth * 0.9
//                   : DeviceWidth * 0.95,
//               borderRadius: 20,
//               position: 'absolute',
//             }}
//             ref={avatarRef}
//             autoRun
//           />
//         )}
//         <Image
//           style={{width: '100%', height: '100%', borderRadius: 20}}
//           resizeMode="stretch"
//           source={{uri: item}}
//           onLoad={() => setLoading(false)}
//         />
//       </TouchableOpacity>
//     );

//     const memoizedComponent = useMemo(
//       () => (
//         <View style={{justifyContent: 'center', width: DeviceWidth * 0.95}}>
//           {loaded ? null : <ActivityLoader />}
//           <FlatList
//             data={imageSource}
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             renderItem={renderItem}
//           />
//         </View>
//       ),
//       [imageSource, loaded],
//     );
//     return memoizedComponent;
//   };
//   return (
//     <View
//       style={{
//         marginVertical: 15,
//         // marginLeft: 10,
//         justifyContent: 'center',
//         alignItems: 'center',
//         height: DeviceHeigth * 0.25,
//         // width: DeviceWidth * 0.95,
//       }}>
//       {getBanners && getBanners[type1] && getBanners[type2] ? (
//         <Box imageSource={[getBanners[type1], getBanners[type2]]} />
//       ) : getBanners && getBanners[type1] ? (
//         <Box imageSource={[getBanners[type1]]} />
//       ) : getBanners && getBanners[type2] ? (
//         <Box imageSource={[getBanners[type2]]} />
//       ) : null}
//       {/* <View
//         style={{
//           height: DeviceHeigth * 0.05,
//           width: DeviceWidth,
//           backgroundColor: 'red',
//           justifyContent:'center',
//           alignItems:'center'
//           // flexDirection: 'row',
//           // justifyContent: 'space-between',
//           // alignItems: 'center',
//           // paddingLeft:10,
//           // paddingRight:10,
//         }}>
//         <View style={[styles.ball,]}>
//           <Image
//             source={localImage.VideoLogo}
//             style={{height: 35, width: 35}}
//             resizeMode="contain"
//           />
//           <Text style={styles.txt}>
//             {'How to join the\n'}
//             <Text
//               style={{
//                 fontSize: 18,
//                 color: 'white',
//                 fontFamily: Fonts.MONTSERRAT_BOLD,
//               }}>
//               Challenge and Earn
//             </Text>
//           </Text>

//           <Image
//             source={localImage.VideoLogo}
//             style={{height: 35, width: 35}}
//             resizeMode="contain"
//           />
//         </View>
//       </View> */}
//       <View
//         style={{
//           height: DeviceHeigth * 0.05,
//           width: DeviceWidth,
//           backgroundColor: 'red',
//           justifyContent: 'center',
//           alignItems: 'center',

//           alignItems: 'center',
//         }}>
//         <Animated.View style={[styles.animatedContainer, animatedStyles]}>
//           <Image
//             source={localImage.VideoLogo}
//             style={{height: 35, width: 35}}
//             resizeMode="contain"
//           />
//           <Text style={styles.txt}>
//             {'How to join the\n'}
//             <Text
//               style={{
//                 fontSize: 18,
//                 color: 'white',
//                 fontFamily: Fonts.MONTSERRAT_BOLD,
//               }}>
//               Challenge and Earn
//             </Text>
//           </Text>
//           <Image
//             source={localImage.VideoLogo}
//             style={{height: 35, width: 35}}
//             resizeMode="contain"
//           />
//         </Animated.View>
//       </View>
//       <NameUpdateModal
//         dataType={dataType}
//         openEditModal={openEditModal}
//         setOpenEditModal={setOpenEditModal}
//         user_id={getUserDataDetails?.id}
//       />
//     </View>
//   );
// };
// const styles = StyleSheet.create({
//   background: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     height: DeviceHeigth * 0.18,
//     width: DeviceWidth,
//     backgroundColor: 'red',
//     alignSelf: 'center',
//     borderRadius: 16,
//     overflow: 'hidden',
//   },
//   ball: {
//     height: DeviceHeigth * 0.05,
//     width: DeviceWidth,

//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingLeft: 10,
//     paddingRight: 10,
//   },
//   txt: {
//     color: AppColor.WHITE,
//     fontSize: 16,
//     fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
//     marginHorizontal: 16,
//   },
//   animatedContainer: {
//     height: DeviceHeigth * 0.05,
//     width: DeviceWidth,

//     justifyContent: 'center',
//     alignItems: 'center',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingLeft: 10,
//     paddingRight: 10,
//   },
// });
// export default Banners;
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../Config';
import {locationPermission} from '../../Screen/Terms&Country/LocationPermission';
import axios from 'axios';
import {showMessage} from 'react-native-flash-message';
import {
  Setmealdata,
  setAgreementContent,
  setBanners,
  setCompleteProfileData,
  setOfferAgreement,
  setStoreData,
} from '../ThemeRedux/Actions';
import {useDispatch, useSelector} from 'react-redux';
import VersionNumber, {appVersion} from 'react-native-version-number';
import {openSettings} from 'react-native-permissions';
import {SliderBox} from 'react-native-image-slider-box';
import {Image} from 'react-native';
import {localImage} from '../Image';
import FastImage from 'react-native-fast-image';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import {AppColor} from '../Color';
import ActivityLoader from '../ActivityLoader';
import {FlatList} from 'react-native-gesture-handler';
import NameUpdateModal from './NameUpdateModal';
import ThemeReducer from '../ThemeRedux/Reducer';
import {AnalyticsConsole} from '../AnalyticsConsole';
const Banners = ({
  type1,
  type2,
  onPress,
  navigation,
  locationP,
  setLocationP,
}) => {
  const getUserDataDetails = useSelector(state => state?.getUserDataDetails);
  const getPurchaseHistory = useSelector(state => state?.getPurchaseHistory);
  const getOfferAgreement = useSelector(state => state.getOfferAgreement);
  const getBanners = useSelector(state => state?.getBanners);
  const [loading, setLoading] = useState(true);
  const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);
  const avatarRef = React.createRef();
  const [loaded, setLoaded] = useState(true);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [dataType, setDatatype] = useState('');

  const dispatch = useDispatch();
  useEffect(() => {
    if (Object.keys(getBanners).length == 0) {
      //bannerApi();
      getUserAllInData();
    }
  }, []);
  const handleStart = () => {
    if (getUserDataDetails?.email != null && getUserDataDetails?.name != null) {
      setLoaded(false);
      if (getOfferAgreement?.location == 'India') {
        setLoaded(true);
        if (getPurchaseHistory?.plan == null) {
          AnalyticsConsole('PP_BANNER');
          navigation.navigate('NewSubscription', {upgrade: false});
        } else {
          AnalyticsConsole('UP_BANNER');
          navigation.navigate('UpcomingEvent', {eventType: 'upcoming'});
        }
      } else {
        locationPermission()
          .then(result => {
            if (result == 'blocked') {
              setLocationP(true);
              setLoaded(true);
            } else if (result === 'denied') {
              setLocationP(true);
              setLoaded(true);
            } else if (result) {
              StoreAgreementApi(result);
            } else if (result == null) {
              // setLocationP(true);
              setLoaded(true);
              showMessage({
                message: 'Error while getting your location',
                floating: true,
                duration: 500,
                type: 'danger',
                icon: {icon: 'auto', position: 'left'},
              });
            } else {
              setLoaded(true);
              showMessage({
                message: 'Error while getting your location',
                floating: true,
                duration: 500,
                type: 'danger',
                icon: {icon: 'auto', position: 'left'},
              });
            }
          })
          .catch(err => {
            console.log('location Error', err);
            setLoaded(true);
          });
      }
    } else {
      if (
        (getUserDataDetails.name?.toUpperCase() == 'GUEST' ||
          getUserDataDetails.name == null) &&
        getUserDataDetails.email == null
      ) {
        AnalyticsConsole('BOTH_U_D');
        setOpenEditModal(true);
        setDatatype('both');
      } else {
        if (
          getUserDataDetails.name?.toUpperCase() == 'GUEST' ||
          getUserDataDetails.name == null
        ) {
          AnalyticsConsole('NAME_U_D');
          setOpenEditModal(true);
          setDatatype('name');
        }
        if (getUserDataDetails.email == null) {
          AnalyticsConsole('EMAIL_U_D');
          setOpenEditModal(true);
          setDatatype('email');
        }
      }
    }
  };
  // apis for start function
  const StoreAgreementApi = async country => {
    setLoaded(false);
    const payload = new FormData();
    payload.append('version', VersionNumber?.appVersion);
    payload.append('user_id', getUserDataDetails?.id);
    payload.append('country', country);
    payload.append('term_conditons', 'Accepted');
    try {
      const Apicall = await axios(NewAppapi.STORE_USER_AGR_COUNTRY, {
        method: 'POST',
        data: payload,
        headers: {'Content-Type': 'multipart/form-data'},
      });
      if (Apicall?.data) {
        getAgreementStatus();
      }
    } catch (error) {
      console.log(error);
      setLoaded(true);
    }
  };
  const getAgreementStatus = async () => {
    try {
      const ApiCall = await axios(NewAppapi.GET_AGR_STATUS, {
        method: 'POST',
        data: {
          user_id: getUserDataDetails?.id,
          version: VersionNumber?.appVersion,
        },
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (
        ApiCall?.data?.msg == 'Please update the app to the latest version.'
      ) {
        showMessage({
          message: ApiCall?.data?.msg,
          floating: true,
          duration: 500,
          type: 'danger',
          icon: {icon: 'auto', position: 'left'},
        });
        setLoaded(true);
      } else {
        dispatch(setOfferAgreement(ApiCall?.data));
        if (ApiCall?.data?.location == 'India') {
          if (getPurchaseHistory?.plan == null) {
            navigation.navigate('NewSubscription', {upgrade: false});
          } else {
            navigation.navigate('UpcomingEvent', {eventType: 'upcoming'});
          }
        }
        setLoaded(true);
      }
    } catch (error) {
      console.log(error);
      setLoaded(true);
    }
  };
  const getUserAllInData = async () => {
    try {
      const responseData = await axios.get(
        `${NewAppapi.GET_ALL_IN_ONE}?version=${VersionNumber.appVersion}`,
      );

      if (
        responseData?.data?.msg ==
        'Please update the app to the latest version.'
      ) {
        showMessage({
          message: responseData?.data?.msg,
          type: 'danger',
          animationDuration: 500,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
      } else if (responseData?.data?.msg == 'version is required') {
      } else {
        const objects = {};
        responseData.data.data.forEach(item => {
          objects[item?.type] = item?.image;
        });

        dispatch(setBanners(objects));
        dispatch(setAgreementContent(responseData?.data?.terms[0]));
        dispatch(Setmealdata(responseData?.data?.diets));
        dispatch(setStoreData(responseData?.data?.types));
        dispatch(setCompleteProfileData(responseData?.data?.additional_data));
      }
    } catch (error) {
      console.log('all_in_one_api_error', error);
      dispatch(Setmealdata([]));
      dispatch(setCompleteProfileData([]));
      dispatch(setStoreData([]));
    }
  };

  const handleEventClicks = index => {
    const Sat = getPurchaseHistory?.currentDay == 6;
    const Sun = getPurchaseHistory?.currentDay == 7;
    if (type1 == 'new_join') {
      handleStart();
    } else if (type1 == 'coming_soon') {
      AnalyticsConsole('CS_BANNER');
      showMessage({
        message:
          'This feature will be soon available in your country, stay tuned!',
        floating: true,
        duration: 500,
        type: 'danger',
        icon: {icon: 'auto', position: 'left'},
      });
    } else if (
      type1 == 'joined_challenge' ||
      (type2 == 'joined_challenge' && index == 1)
    ) {
      AnalyticsConsole('JN_BANNER');
      navigation.navigate('UpcomingEvent', {eventType: 'current'});
    } else if (type1 == 'ongoing_challenge' && index == 0) {
      AnalyticsConsole(
        Sat || Sun
          ? `ON_B_CL_ON_${getPurchaseHistory?.currentDay}`
          : 'ON_BANNER',
      );
      Sat || Sun
        ? showMessage({
            message:
              'Your event has ended. You can resume your weekly plan normally from Monday. If you join another fitness challenge, it will start from the upcoming Monday.',
            type: 'danger',
            animationDuration: 500,
            duration: 5000,
            floating: true,
          })
        : navigation.navigate('MyPlans');
    } else if (type2 == 'upcoming_challenge' && index == 1) {
      AnalyticsConsole('UP_BANNER');
      navigation.navigate('UpcomingEvent', {eventType: 'upcoming'});
    }
  };

  const Box = ({imageSource}) => {
    const renderItem = ({item, index}) => (
      <TouchableOpacity
        key={index}
        disabled={loading?true:false}
        onPress={() => handleEventClicks(index)}
        style={{
          height:
            DeviceHeigth <= 667 ? DeviceHeigth * 0.25 : DeviceHeigth * 0.2,
          width:
            imageSource?.length > 1 ? DeviceWidth * 0.9 : DeviceWidth * 0.95,
          alignSelf: 'center',
          marginRight: 15,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {loading && (
          <View
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 20,
              backgroundColor: 'lightgrey',
              justifyContent: 'center',
              position:'absolute'
            }}>
            <ActivityIndicator size={50} color={AppColor.RED} />
          </View>
        )}
        <Image
          style={{width: '100%', height: '100%', borderRadius: 20}}
          resizeMode="stretch"
          source={{uri: item}}
          onLoad={() => setLoading(false)}
          // defaultSource={localImage.testbanner}
        
        />
      </TouchableOpacity>
    );

    const memoizedComponent = useMemo(
      () => (
        <View style={{justifyContent: 'center', width: DeviceWidth * 0.95}}>
          {loaded ? null : <ActivityLoader />}
          <FlatList
            data={imageSource}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={renderItem}
          />
        </View>
      ),
      [imageSource, loaded],
    );
    return memoizedComponent;
  };
  return (
    <View style={{marginVertical: 15, marginLeft: 10}}>
      {getBanners && getBanners[type1] && getBanners[type2] ? (
        <Box imageSource={[getBanners[type1], getBanners[type2]]} />
      ) : getBanners && getBanners[type1] ? (
        <Box imageSource={[getBanners[type1]]} />
      ) : getBanners && getBanners[type2] ? (
        <Box imageSource={[getBanners[type2]]} />
      ) : null}
      <NameUpdateModal
        dataType={dataType}
        openEditModal={openEditModal}
        setOpenEditModal={setOpenEditModal}
        user_id={getUserDataDetails?.id}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  background: {
    justifyContent: 'center',
    alignItems: 'center',
    height: DeviceHeigth * 0.18,
    width: DeviceWidth * 0.95,
    alignSelf: 'center',
    borderRadius: 16,
    overflow: 'hidden',
  },
});
export default Banners;
