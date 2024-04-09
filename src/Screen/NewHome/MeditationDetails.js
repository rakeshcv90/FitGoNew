import {View, Text, Image, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import NewHeader from '../../Component/Headers/NewHeader';
import {StatusBar} from 'react-native';
import {StyleSheet} from 'react-native';
import {AppColor} from '../../Component/Color';
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
import {setVideoLocation} from '../../Component/ThemeRedux/Actions';
import RNFetchBlob from 'rn-fetch-blob';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const MeditationDetails = ({navigation, route}) => {
  let isFocused = useIsFocused();
  const customWorkoutData = useSelector(state => state.customWorkoutData);
  const [forLoading, setForLoading] = useState(true);
  const [mindsetExercise, setmindsetExercise] = useState([]);
  const [downloaded, setDownloade] = useState(0);
  const avatarRef = React.createRef();
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
        data.data.data.map((item, index) =>
          downloadVideos(item, index, data.data.data.length),
        );
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
        console.log(
          'videoExists',
          videoExists,
          100 / (len - (index)),
          filePath,
        );
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
            console.log(
              'File downloaded successfully!',
              res.path(),
              100 / (len - (index + 1)),
            );
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
        getCaterogy(title.id, title.workout_mindset_level);
      }}>
      <LinearGradient
        start={{x: 0, y: 1}}
        end={{x: 1, y: 0}}
        colors={[color.color1, color.color2]}
        style={styles.listItem}>
        <Image
          source={
            title.workout_mindset_image_link != null
              ? {uri: title.workout_mindset_image_link}
              : localImage.Noimage
          }
          style={[
            styles.img,
            {
              height: 50,
              width: 50,
            },
          ]}
          resizeMode="cover"></Image>
        <Text
          style={[
            styles.title,
            {
              color: color.color3,
            },
          ]}>
          {title.workout_mindset_title}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
  const emptyComponent = () => {
    return (
      <View
        style={{
          flex: 1,
        }}>
        <AnimatedLottieView
          source={require('../../Icon/Images/NewImage/NoData.json')}
          speed={2}
          autoPlay
          loop
          resizeMode="contain"
          style={{
            width: DeviceWidth * 0.3,
            height: DeviceHeigth * 0.15,
            alignSelf: 'center',
          }}
        />
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <NewHeader
        header={
          route?.params?.item.workout_mindset_title
            ? route?.params?.item.workout_mindset_title
            : 'Test'
        }
        SearchButton={false}
        backButton={true}
      />
      <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />

      <>
        <View
          style={{
            width: '95%',
            alignSelf: 'center',
            top: -DeviceHeigth * 0.02,
            paddingLeft: 20,
          }}>
          <Text
            style={{
              color: AppColor.LITELTEXTCOLOR,
              fontFamily: 'Poppins',
              fontWeight: '700',
              lineHeight: 21,
              fontSize: 14,
            }}>
            Categories
          </Text>
          <Text
            style={{
              color: '#191919',
              fontFamily: 'Poppins',
              fontWeight: '500',
              lineHeight: 15,
              fontSize: 10,
            }}>
            Looking for something specific?
          </Text>
        </View>
        <View style={styles.meditionBox}>
          <FlatList
            data={customWorkoutData?.minset_workout}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={emptyComponent}
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
        </View>
        <View
          style={{
            width: '95%',
            alignSelf: 'center',

            marginVertical: DeviceHeigth * 0.03,
            paddingLeft: 20,
          }}>
          <Text
            style={{
              color: AppColor.LITELTEXTCOLOR,
              fontFamily: 'Poppins',
              fontWeight: '700',
              lineHeight: 21,
              fontSize: 14,
            }}>
            Explore
          </Text>
          <Text
            style={{
              color: '#191919',
              fontFamily: 'Poppins',
              fontWeight: '500',
              lineHeight: 15,
              fontSize: 10,
            }}>
            Start your session with daily favorites picked for you.
          </Text>
        </View>
        <View style={styles.meditionBox}>
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
          ) : (
            <FlatList
              data={mindsetExercise}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              ListEmptyComponent={emptyComponent}
              renderItem={({item, index}) => {
                return (
                  <>
                    <LinearGradient
                      start={{x: 0, y: 1}}
                      end={{x: 1, y: 0}}
                      colors={[
                        colors[index % colors.length].color1,
                        colors[index % colors.length].color2,
                      ]}
                      style={styles.listItem1}>
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
                            <Text
                              style={{
                                color: AppColor.LITELTEXTCOLOR,
                                fontFamily: 'Poppins',
                                fontWeight: '700',
                                lineHeight: 21,
                                fontSize: 14,
                              }}>
                              {item.exercise_mindset_title}
                            </Text>
                            <Text
                              numberOfLines={3}
                              style={{
                                color: '#505050',
                                fontFamily: 'Poppins',
                                fontWeight: '500',
                                lineHeight: 15,
                                top: 5,
                                fontSize: 10,
                              }}>
                              {item.exercise_mindset_description}
                            </Text>
                          </View>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              marginVertical: DeviceHeigth * 0.005,
                              left: -12,
                            }}>
                            <TouchableOpacity
                            disabled={downloaded > 0 && downloaded != 100}
                              onPress={() => {
                                navigation.navigate(
                                  'MeditationExerciseDetails',
                                  {
                                    item: item,
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
                                  },
                                ]}
                                resizeMode="cover"></Image>
                            </TouchableOpacity>
                            <Text
                              style={{
                                color: AppColor.LITELTEXTCOLOR,
                                fontFamily: 'Poppins',
                                fontWeight: '700',
                                lineHeight: 21,
                                fontSize: 14,
                              }}>
                              {downloaded > 0 && downloaded != 100
                                ? 'Downloading ...'
                                : '25 Min'}
                            </Text>
                          </View>
                        </View>
                        <View
                          style={{
                            width: '30%',
                            height: 150,

                            left: -20,
                            marginVertical: -DeviceHeigth * 0.01,
                          }}>
                          <AnimatedLottieView
                            source={require('../../Icon/Images/NewImage/MusicAnimation.json')}
                            speed={2}
                            autoPlay
                            loop
                            style={{
                              height: 130,
                              width: DeviceWidth * 0.3,
                              position: 'absolute',
                              top: -20,
                            }}
                          />
                          <Image
                            source={
                              item.exercise_mindset_image_link != null
                                ? {uri: item.exercise_mindset_image_link}
                                : localImage.Noimage
                            }
                            style={{
                              height: 130,
                              width: DeviceWidth * 0.3,
                            }}
                            resizeMode="cover"></Image>
                        </View>
                      </View>
                    </LinearGradient>
                  </>
                );
              }}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              updateCellsBatchingPeriod={100}
              removeClippedSubviews={true}
            />
          )}
        </View>
      </>
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
    marginHorizontal: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 21,
    fontFamily: 'Poppins',
  },
  img: {
    height: 80,
    width: 80,
    borderRadius: 160 / 2,
  },
  listItem1: {
    width: DeviceWidth * 0.9,
    height: 150,
    marginHorizontal: 10,
    marginVertical: 10,
    borderRadius: 10,
    padding: 5,
    justifyContent: 'space-between',
  },
});
export default MeditationDetails;
