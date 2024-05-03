import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Modal,
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import NewHeader from '../../Component/Headers/NewHeader';
import {useSelector, useDispatch} from 'react-redux';
import {TouchableOpacity} from 'react-native';
import {AppColor, Fonts} from '../../Component/Color';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../Component/Config';
import {localImage} from '../../Component/Image';
import {BlurView} from '@react-native-community/blur';
import {TextInput} from 'react-native-paper';
import {showMessage} from 'react-native-flash-message';
import {PERMISSIONS, request} from 'react-native-permissions';
import {launchImageLibrary} from 'react-native-image-picker';
import {useIsFocused} from '@react-navigation/native';
import VersionNumber from 'react-native-version-number';
import {setAllExercise} from '../../Component/ThemeRedux/Actions';
import axios from 'axios';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import { BannerAdd } from '../../Component/BannerAdd';
import { bannerAdId } from '../../Component/AdsId';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const CustomWorkout = ({navigation, route}) => {
  const avatarRef = React.createRef();
  const dispatch = useDispatch();
  const routeName = route?.params?.routeName;
  const customWorkoutData = useSelector(state => state.customWorkoutData);
  const getExperience = useSelector(state => state.getExperience);
  const [isCustomWorkout, setIsCustomWorkout] = useState(false);
  const [text, setText] = React.useState('');
  const [getWorkoutAvt, setWorkoutAvt] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const isFocused = useIsFocused();
  const getUserDataDetails = useSelector(state => state.getUserDataDetails);

  useEffect(() => {
    if (isFocused) {
      getAllExerciseData();
    }
  }, [isFocused]);
  const askPermissionForLibrary = async permission => {
    const resultLib = await request(permission);

    if (resultLib == 'granted') {
      try {
        const resultLibrary = await launchImageLibrary({
          mediaType: 'photo',
          quality: 0.5,
          maxWidth: 300,
          maxHeight: 200,
        });
        setWorkoutAvt(resultLibrary.assets[0]);

        if (resultLibrary) {
          // setModalImageUploaded(true);
        }
      } catch (error) {
        console.log('LibimageError', error);
      }
    } else if (Platform.OS == 'ios') {
      Alert.alert(
        'Permission Required',
        'To use the photo library ,Please enable library access in settings',
        [
          {
            text: 'cancel',
            style: 'cancel',
          },
          {
            text: 'Open settings',
            onPress: openSettings,
          },
        ],
        {cancelable: false},
      );
    } else {
      console.log('Gallery error occured');
    }
  };
  const renderItem = useMemo(
    () =>
      ({item}) => {
        return (
          <>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                navigation.navigate('CustomWorkoutDetails', {item: item});
              }}
              style={{
                width: '97%',
                borderRadius: 10,
                backgroundColor: AppColor.WHITE,
                marginVertical: 8,
                flexDirection: 'row',
                alignSelf: 'center',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 12,
                padding: 5,
                borderColor: '#fff',
                borderWidth: 1,

                shadowColor: 'rgba(0, 0, 0, 1)',
                ...Platform.select({
                  ios: {
                    shadowColor: '#000000',
                    shadowOffset: {width: 0, height: 2},
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                  },
                  android: {
                    elevation: 3,
                  },
                }),
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {isLoading && (
                  <ShimmerPlaceholder
                    style={styles.loader}
                    ref={avatarRef}
                    autoRun
                  />
                )}
                <Image
                  // source={{uri: item.workout_image_link}}
                  source={
                    item?.image == '' ? localImage.Noimage : {uri: item?.image}
                  }
                  onLoad={() => setIsLoading(false)}
                  style={{
                    width: 80,
                    height: 80,
                    justifyContent: 'center',
                    alignSelf: 'center',
                    // backgroundColor:'red',
                    borderRadius: 10,
                    marginHorizontal: -7,
                  }}
                  resizeMode="contain"
                />
                <View
                  style={{
                    marginHorizontal: 25,
                    justifyContent: 'center',
                    width: DeviceWidth * 0.52,
                  }}>
                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: 17,
                      fontWeight: '600',
                      color: '#202020',
                      lineHeight: 25,
                      fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                    }}>
                    {item?.workout_name}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: '600',
                      color: '#202020',
                      lineHeight: 30,

                      fontFamily: Fonts.MONTSERRAT_MEDIUM,
                    }}>
                    {item?.total_exercises}
                    {' Exercises'}
                  </Text>
                </View>
                
              </View>
              <Image
                  source={localImage.Next}
                  resizeMode="contain"
                  style={{width: 30, height: 30}}
                />
            </TouchableOpacity>
          </>
        );
      },
    [isLoading],
  );
  const emptyComponent = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          source={localImage.Createworkout}
          resizeMode="contain"
          style={{width: DeviceWidth * 0.7, height: DeviceHeigth * 0.4}}
        />

        <LinearGradient
          start={{x: 0, y: 1}}
          end={{x: 1, y: 0}}
          // colors={['#941000', '#D01818']}
          colors={['#D01818', '#941000']}
          style={{
            width: 180,
            height: 40,
            borderRadius: 30,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 100,
            top:
              Platform.OS == 'android' ? -40 : DeviceHeigth >= 1024 ? 30 : -40,
          }}>
          <TouchableOpacity
            style={{
              width: 180,
              height: 40,

              borderRadius: 30,
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
            }}
            activeOpacity={0.5}
            onPress={() => {
              setIsCustomWorkout(!isCustomWorkout);
            }}>
            <Image
              source={localImage.Plus}
              style={{width: 20, height: 20}}
              tintColor={AppColor.WHITE}
            />
            <Text style={styles.button}>{'Add Custom'}</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  };

  const createWorkout = () => {
    if (text.trim().length <= 0) {
      showMessage({
        message: 'Please Enter WorkoutName',
        type: 'danger',
        animationDuration: 500,

        floating: true,
        icon: {icon: 'auto', position: 'left'},
      });
    } else if (text.trim().length < 3) {
      showMessage({
        message: 'Please enter Proper Message',
        type: 'danger',
        animationDuration: 500,
        floating: true,
        icon: {icon: 'auto', position: 'left'},
      });
    } else {
      navigation.navigate('CreateWorkout', {
        workoutTitle: text,
        workoutImg: getWorkoutAvt,
      });
      setText('');
      setWorkoutAvt(null);
      setIsCustomWorkout(false);
    }
  };

  const getAllExerciseData = async () => {
    try {
      const exerciseData = await axios.get(
        `${NewAppapi.ALL_EXERCISE_DATA}?version=${VersionNumber.appVersion}&user_id=${getUserDataDetails.id}`,
      );
   
      if (
        exerciseData?.data?.msg == 'Please update the app to the latest version'
      ) {
        dispatch(setAllExercise([]));
      } else if (exerciseData?.data?.length > 0) {
        dispatch(setAllExercise(exerciseData?.data));
      } else {
        dispatch(setAllExercise([]));
      }
    } catch (error) {
      dispatch(setAllExercise([]));
      console.log('All-EXCERSIE-ERROR', error);
    }
  };
  return (
    <>
      <NewHeader
        header={'Custom Workout'}
        SearchButton={false}
        backButton={true}
      />

      <View style={styles.container}>
        <View style={[styles.meditionBox, {top: -20}]}>
          <FlatList
            data={customWorkoutData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            ListEmptyComponent={emptyComponent}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            updateCellsBatchingPeriod={100}
            removeClippedSubviews={true}
          />
        </View>
        {customWorkoutData?.length > 0 && (
          <TouchableOpacity
            style={styles.buttonStyle}
            activeOpacity={0.5}
            onPress={() => {
              setIsCustomWorkout(true);
            }}>
            <LinearGradient
              start={{x: 0, y: 1}}
              end={{x: 1, y: 0}}
              colors={['#D01818', '#941000']}
              style={styles.buttonStyle}>
              <Image
                source={localImage.Plus}
                style={{width: 20, height: 20}}
                tintColor={AppColor.WHITE}
              />
              <Text style={styles.button}>{'Add Custom'}</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
      <Modal
        visible={isCustomWorkout}
        transparent={true}
        onRequestClose={() => {
          setIsCustomWorkout(!isCustomWorkout);
        }}>
        {/* <BlurView style={styles.modalContainer} blurType="light" blurAmount={1}> */}
        <TouchableOpacity
          style={{
            flex: 1,
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,.5)',
          }}
          activeOpacity={1}
          onPress={() => setIsCustomWorkout(false)}>
          <View
            style={{
              width: DeviceWidth * 0.9,
              alignSelf: 'center',

              backgroundColor: AppColor.WHITE,
              paddingHorizontal: 10,
              paddingVertical: 20,
              borderRadius: 10,
            }}>
            {/* <Text
              style={{
                color: AppColor.HEADERTEXTCOLOR,
                fontFamily: Fonts.MONTSERRAT_BOLD,
                fontWeight: '600',
                lineHeight: 30,
                fontSize: 18,
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}>
              Workout For Beginners
            </Text> */}
            <TouchableOpacity
              style={styles.imageView}
              onPress={() => {
                if (Platform.OS == 'ios') {
                  askPermissionForLibrary(PERMISSIONS.IOS.PHOTO_LIBRARY);
                } else {
                  askPermissionForLibrary(
                    Platform.Version >= 33
                      ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
                      : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                  );
                }
              }}>
              <Image
                source={
                  getWorkoutAvt == null ? localImage?.Plus : getWorkoutAvt
                }
                resizeMode={getWorkoutAvt == null ? 'contain' : 'cover'}
                style={{
                  height: getWorkoutAvt == null ? 35 : 95,
                  width: getWorkoutAvt == null ? 35 : 95,
                }}
              />
            </TouchableOpacity>
            <TextInput
              label="Enter workout name"
              value={text}
              activeOutlineColor="#707070"
              outlineStyle={{borderRadius: 15}}
              style={{marginVertical: 10, backgroundColor: '#F8F9F9'}}
              onChangeText={text => setText(text)}
            />
            <View
              style={{
                flexDirection: 'row',
                alignSelf: 'flex-end',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() => {
                  setIsCustomWorkout(false);
                }}>
                <Text
                  style={{
                    marginHorizontal: 20,
                    color: '#393939',
                    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                    fontSize: 16,
                    lineHeight: 30,
                    fontWeight: '600',
                  }}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  createWorkout();
                }}>
                <Text
                  style={{
                    marginHorizontal: 10,
                    color: AppColor.RED1,
                    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                    fontSize: 16,
                    lineHeight: 30,
                    fontWeight: '600',
                  }}>
                  OK
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
        {/* </BlurView> */}
      </Modal>
      <BannerAdd bannerAdId={bannerAdId} />
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFDFD',
  },

  meditionBox: {
    backgroundColor: 'white',
  },
  buttonStyle: {
    width: 180,
    height: 40,
    borderRadius: 30,
    justifyContent: 'center',
    flexDirection: 'row',
    position: 'absolute',
    alignItems: 'center',
    bottom: DeviceHeigth * 0.015,
    right: 10,
  },
  button: {
    fontSize: 15,
    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
    textAlign: 'center',
    marginHorizontal: 10,
    color: AppColor.WHITE,
    fontWeight: '600',
    backgroundColor: 'transparent',
    //lineHeight: 25,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,.5)',
  },
  modalContent: {
    padding: 20,
    borderRadius: 8,
    width: DeviceWidth * 0.5,

    alignSelf: 'flex-end',
    position: 'absolute',
    top: DeviceHeigth / 8,
  },
  loader: {
    position: 'absolute',
    justifyContent: 'center',

    backgroundColor: AppColor.GRAY,
    zIndex: 1,
    height: 80,
    width: 90,
    left: -8,
    borderRadius: 10,
  },
  imageView: {
    backgroundColor: AppColor.GRAY1,
    height: 95,
    width: 95,
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  headerstyle: {
    fontWeight: '600',
    fontSize: 19,
  },
});
export default CustomWorkout;
