import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import NewHeader from '../../Component/Headers/NewHeader';
import {StatusBar} from 'react-native';
import {StyleSheet} from 'react-native';
import {AppColor, Fonts} from '../../Component/Color';
import Icons from 'react-native-vector-icons/FontAwesome5';
import VersionNumber, {appVersion} from 'react-native-version-number';

import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../Component/Config';
import {useDispatch, useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import {FlatList} from 'react-native';
import {localImage} from '../../Component/Image';
import {showMessage} from 'react-native-flash-message';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import ActivityLoader from '../../Component/ActivityLoader';
import AnimatedLottieView from 'lottie-react-native';
import axios from 'axios';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import moment from 'moment';
import NativeAddTest from '../../Component/NativeAd';
import {setVideoLocation} from '../../Component/ThemeRedux/Actions';
import RNFetchBlob from 'rn-fetch-blob';
import {BannerAdd} from '../../Component/BannerAdd';
import {bannerAdId} from '../../Component/AdsId';
import RewardModal from '../../Component/Utilities/RewardModal';
import UpcomingEventModal from '../../Component/Utilities/UpcomingEventModal';
import {AnalyticsConsole} from '../../Component/AnalyticsConsole';
import Wrapper from '../WorkoutCompleteScreen/Wrapper';
import NewHeader1 from '../../Component/Headers/NewHeader1';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const MeditationDetails = ({navigation, route}) => {
  let isFocused = useIsFocused();
  const customWorkoutData = useSelector(state => state.customWorkoutData);
  const getPurchaseHistory = useSelector(state => state.getPurchaseHistory);
  const [forLoading, setForLoading] = useState(true);
  const [mindsetExercise, setmindsetExercise] = useState([]);
  const [headerTitle, setHeaderTitle] = useState(route?.params?.item);
  const [selectedTitle, setSelectedTitle] = useState(
    route?.params?.item?.workout_mindset_title,
  );
  const [downloaded, setDownloade] = useState(0);
  const avatarRef = React.createRef();
  const allWorkoutData = useSelector(state => state.allWorkoutData);
  const enteredCurrentEvent = useSelector(state => state?.enteredCurrentEvent);
  const enteredUpcomingEvent = useSelector(
    state => state?.enteredUpcomingEvent,
  );
  const getOfferAgreement = useSelector(state => state?.getOfferAgreement);
  const colors = [
    {color1: '#E2EFFF', color2: '#9CC2F5', color3: '#425B7B'},
    {color1: '#BFF0F5', color2: '#8DD9EA', color3: '#1F6979'},
    {color1: '#FAE3FF', color2: '#C97FCD', color3: '#7C3D80'},
    {color1: '#FFEBE2', color2: '#DCAF9E', color3: '#1E1E1E'},
  ];
  const dispatch = useDispatch();
  useEffect(() => {
    if (isFocused) {
      if (route?.params?.item) {
        getCaterogy(
          route?.params?.item.id,
          route?.params?.item.workout_mindset_level,
        );
      }
      setDownloade(0);
    }
  }, [isFocused]);
  const getCaterogy = async (id, level) => {
    setForLoading(true);

    try {
      const data = await axios(`${NewAppapi.Get_Mindset_Excise}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: {
          workout_mindset_id: id,
          health_level: level,
          version: VersionNumber.appVersion,
        },
      });

      if (data?.data?.msg == 'Please update the app to the latest version.') {
        showMessage({
          message: data?.data?.msg,
          type: 'danger',
          animationDuration: 500,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
        setForLoading(false);
      } else if (data?.data?.status == 'data found') {
        setForLoading(false);
        setmindsetExercise(data.data.data);
        // Promise.all(
        //   data.data.data.map((item, index) =>
        //     downloadVideos(item, index, data.data.data.length),
        //   ),
        // ).finally(() => setmindsetExercise(data.data.data));
      } else {
        setForLoading(false);
        setmindsetExercise([]);
      }
    } catch (error) {
      setForLoading(false);
      setmindsetExercise([]);
      console.log('MindSet  List Error', error);
    }
  };

  let StoringData = {};
  const downloadVideos = async (data, index, len) => {
    const filePath = `${RNFetchBlob.fs.dirs.CacheDir}/${data?.id}.mp3`;
    try {
      const videoExists = await RNFetchBlob.fs.exists(filePath);
      if (videoExists) {
        StoringData[data?.id] = filePath;
        setDownloade(100 / (len - index));
      } else {
        await RNFetchBlob.config({
          fileCache: true,
          // IOSBackgroundTask: true, // Add this for iOS background downloads
          path: filePath,
          appendExt: '.mp3',
        })
          .fetch('GET', data?.exercise_mindset_audio, {
            'Content-Type': 'application/mp4',
            // key: 'Config.REACT_APP_API_KEY',
          })
          .then(res => {
            StoringData[data?.id] = res.path();
            setDownloade(100 / (len - index));

            // Linking.openURL(`file://${fileDest}`);
          })
          .catch(err => {
            console.log(err);
          });
      }
    } catch (error) {
      console.log('ERRRR', error);
    }
    dispatch(setVideoLocation(StoringData));
  };
  const ListItem = ({title, color}) => (
    <TouchableOpacity
      onPress={() => {
        setHeaderTitle(title);
        getCaterogy(title.id, title.workout_mindset_level);
        setSelectedTitle(title?.workout_mindset_title);
      }}>
      <LinearGradient
        start={{x: 0, y: 1}}
        end={{x: 1, y: 0}}
        colors={[color.color1, color.color2]}
        style={[
          styles.listItem,
          {
            width: DeviceHeigth >= 1024 ? DeviceWidth * 0.165 : 100,
            borderWidth: headerTitle?.id == title?.id ? 2 : 0,
            borderColor: headerTitle?.id == title?.id && '#368EFF',
            marginHorizontal: DeviceHeigth >= 1024 ? 10 : 5,
          },
        ]}>
        {headerTitle?.id == title?.id && (
          <Image
            source={require('../../Icon/Images/NewImage/tick3.png')}
            style={[
              styles.img,
              {
                height: 20,
                width: 20,
                position: 'absolute',
                top: 5,
                alignSelf: 'flex-end',
                right: 5,
              },
            ]}
            resizeMode="contain"></Image>
        )}
        <Text
          style={[
            styles.title,
            {
              color: '#1E1E1E99',
            },
          ]}>
          {title.workout_mindset_title}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
  const EmptyComponent = () => {
    return (
      <View
        style={{
          alignSelf: 'center',
          marginTop: 30,
          width: DeviceWidth,
        }}>
        <AnimatedLottieView
          source={require('../../Icon/Images/NewImage/NoData.json')}
          speed={2}
          autoPlay
          loop
          resizeMode="contain"
          style={{
            width: DeviceWidth * 0.6,
            height: DeviceHeigth * 0.3,
            alignSelf: 'center',
          }}
        />
      </View>
    );
  };

  const getNativeAdsDisplay = () => {
    if (getPurchaseHistory?.plan != null) {
      if (
        getPurchaseHistory?.plan == 'premium' &&
        getPurchaseHistory?.end_date >= moment().format('YYYY-MM-DD')
      ) {
        return null;
      } else {
        return (
          <View
            style={{
              alignSelf: 'center',
              alignItems: 'center',
              marginVertical: 10,

              //  top: DeviceHeigth * 0.1,
            }}>
            <NativeAddTest type="image" media={false} />
          </View>
        );
      }
    } else {
      return (
        <View
          style={{
            alignSelf: 'center',
            alignItems: 'center',
            marginVertical: 10,

            //top: DeviceHeigth * 0.1,
          }}>
          <NativeAddTest type="image" media={false} />
        </View>
      );
    }
  };
  const getAdsDisplay = (index, item) => {
    if (mindsetExercise.length > 1) {
      if (index == 0) {
        return getNativeAdsDisplay();
      } else if ((index + 1) % 6 == 0) {
        return getNativeAdsDisplay();
      }
    }
  };
  // const bannerAdsDisplay = () => {
  //   if (getPurchaseHistory.length > 0) {
  //     if (
  //       getPurchaseHistory[0]?.plan_end_date >= moment().format('YYYY-MM-DD')
  //     ) {
  //       return null;
  //     } else {
  //       return <BannerAdd bannerAdId={bannerAdId} />

  //     }
  //   } else {
  //     return   <BannerAdd bannerAdId={bannerAdId} />

  //   }
  // };
  const Space = () => (
    <View
      style={{height: 15, width: DeviceWidth, backgroundColor: '#F9F9F9'}}
    />
  );
  return (
    <View style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />
      <Wrapper styles={{backgroundColor: AppColor.WHITE}}>
        <NewHeader1 header={headerTitle?.workout_mindset_title} backButton />
        <Space />
        <View
          style={{
            width: '90%',
            alignSelf: 'center',
            // top: DeviceHeigth >= 1024 ? 0 : -DeviceHeigth * 0.02,
            marginVertical: DeviceHeigth * 0.01,
          }}>
          <Text
            style={{
              color: AppColor.HEADERTEXTCOLOR,
              fontFamily: Fonts.MONTSERRAT_BOLD,
              fontWeight: 'bold',
              lineHeight: 19.5,
              fontSize: 18,
              alignItems: 'center',
            }}>
            Categories
          </Text>
          <Text
            style={{
              color: '#6B7280',
              fontFamily: 'Montserrat-Medium',
              fontWeight: '500',
              lineHeight: 20,
              fontSize: 14,
            }}>
            Looking for something specific?
          </Text>
        </View>
        <View style={styles.meditionBox}>
          <FlatList
            data={allWorkoutData?.mindset_workout_data}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={<EmptyComponent />}
            renderItem={({item, index}) => {
              return (
                <ListItem title={item} color={colors[index % colors.length]} />
              );
            }}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            updateCellsBatchingPeriod={100}
            removeClippedSubviews={true}
          />
          <View style={{height: 20}} />
        </View>
        <Space />
        <View
          style={{
            width: '90%',
            alignSelf: 'center',

            marginVertical: DeviceHeigth * 0.03,
          }}>
          <Text
            style={{
              color: AppColor.HEADERTEXTCOLOR,
              fontFamily: Fonts.MONTSERRAT_BOLD,
              fontWeight: 'bold',
              lineHeight: 19.5,
              fontSize: 18,
              alignItems: 'center',
            }}>
            Explore
          </Text>
          <Text
            style={{
              color: '#6B7280',
              fontFamily: 'Montserrat-Medium',
              fontWeight: '500',
              lineHeight: 20,
              fontSize: 14,
            }}>
            Start the meditation of your choice.
          </Text>
        </View>
        <View style={[styles.meditionBox, {flex: 1}]}>
          {forLoading ? (
            <FlatList
              data={[1, 2, 3, 4]}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item, index}) => {
                return (
                  <>
                    <View style={styles.listItem1}>
                      <View
                        style={[
                          styles.listItem1,
                          {
                            marginHorizontal: 0,
                            flexDirection: 'row',
                            marginHorizontal: 0,

                            justifyContent: 'space-between',
                          },
                        ]}>
                        <View
                          style={{
                            width: '65%',
                            height: 150,
                            paddingLeft: 5,
                          }}>
                          <View
                            style={{
                              marginVertical: -DeviceHeigth * 0.002,
                            }}>
                            <ShimmerPlaceholder ref={avatarRef} autoRun />
                            <ShimmerPlaceholder
                              style={{marginVertical: 10}}
                              ref={avatarRef}
                              autoRun
                            />
                          </View>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              marginVertical: DeviceHeigth * 0.005,
                              left: -2,
                            }}>
                            <View>
                              <ShimmerPlaceholder
                                ref={avatarRef}
                                autoRun
                                style={[
                                  styles.img,
                                  {
                                    height: 60,
                                    width: 60,
                                  },
                                ]}
                              />
                            </View>
                            <ShimmerPlaceholder
                              style={{marginHorizontal: 10, width: 75}}
                              ref={avatarRef}
                              autoRun
                            />
                          </View>
                        </View>
                        <View
                          style={{
                            width: '30%',
                            height: 150,

                            left: -20,
                            marginVertical: -DeviceHeigth * 0.01,
                          }}>
                          <ShimmerPlaceholder
                            ref={avatarRef}
                            autoRun
                            style={{
                              height: 130,
                              width: DeviceWidth * 0.3,
                            }}
                          />
                        </View>
                      </View>
                    </View>
                  </>
                );
              }}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              updateCellsBatchingPeriod={100}
              removeClippedSubviews={true}
            />
          ) : mindsetExercise.length > 0 ? (
            <FlatList
              data={mindsetExercise}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              ListEmptyComponent={<EmptyComponent />}
              //  contentInset={{paddingBottom: DeviceHeigth * 0.1}}
              renderItem={({item, index}) => {
                return (
                  <>
                    <TouchableOpacity
                      style={styles.box}
                      activeOpacity={0.8}
                      onPress={() => {
                        navigation.navigate('MeditationExerciseDetails', {
                          index: index,
                          allMeditation: mindsetExercise
                        });
                      }}>
                      <ImageBackground
                        source={
                          item.exercise_mindset_image_link != null
                            ? {uri: item.exercise_mindset_image_link}
                            : localImage.Noimage
                        }
                        style={{
                          height: '100%',
                          width: '100%',
                        }}
                        resizeMode="stretch">
                        <LinearGradient
                          start={{x: 0, y: 1}}
                          end={{x: 1, y: 0}}
                          colors={[
                            'rgba(0,0,0,1)',
                            'rgba(0,0,0,1)',
                            'transparent',
                            'transparent',
                          ]}
                          style={[styles.box, styles.grad]}>
                          <View
                            style={{
                              width: '100%',
                              padding: 10,
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              bottom: 0,
                              position: 'absolute',
                            }}>
                            <Text
                              style={{
                                color: AppColor.WHITE,
                                fontFamily: 'Montserrat-SemiBold',
                                fontWeight: '700',
                                lineHeight: 25,
                                fontSize: 18,
                              }}>
                              {item.exercise_mindset_title}
                            </Text>
                            <TouchableOpacity
                              // disabled={downloaded > 0 && downloaded != 100}
                              onPress={() => {
                                navigation.navigate(
                                  'MeditationExerciseDetails',
                                  {
                                    index: index,
                                    allMeditation: mindsetExercise
                                  },
                                );
                              }}>
                              <Image
                                source={localImage.Play2}
                                style={[
                                  styles.img,
                                  {
                                    height: 60,
                                    width: 60,
                                    left: -12,
                                  },
                                ]}
                                resizeMode="cover"></Image>
                            </TouchableOpacity>
                          </View>
                        </LinearGradient>
                      </ImageBackground>
                    </TouchableOpacity>
                    {getAdsDisplay(index, item)}
                  </>
                );
              }}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              updateCellsBatchingPeriod={100}
              removeClippedSubviews={true}
            />
          ) : (
            <EmptyComponent />
          )}
        </View>
      </Wrapper>
      {/* {bannerAdsDisplay()} */}
      <BannerAdd bannerAdId={bannerAdId} />
    </View>
  );
};
var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColor.WHITE,
  },
  meditionBox: {
    width: '95%',
    alignSelf: 'center',
    backgroundColor: 'white',
  },
  listItem: {
    width: 100,
    height: 100,
    borderRadius: 20,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 23,
    fontFamily: Fonts.HELVETICA_BOLD,
    textTransform: 'uppercase',
  },
  img: {
    height: 80,
    width: 80,
    borderRadius: 160 / 2,
  },
  listItem1: {
    width: DeviceWidth * 0.95,
    height: 150,
    marginVertical: 10,
    borderRadius: 10,
    padding: 5,
    justifyContent: 'space-between',
  },
  box: {
    width: '97%',
    height: DeviceHeigth * 0.17,
    borderRadius: 10,
    alignSelf: 'center',
    overflow: 'hidden',
    marginVertical: 5,
  },
  grad: {width: '100%', justifyContent: 'center', marginVertical: 0},
});
export default MeditationDetails;
