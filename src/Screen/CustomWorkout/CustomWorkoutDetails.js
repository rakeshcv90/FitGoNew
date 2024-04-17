import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useMemo} from 'react';
import NewHeader from '../../Component/Headers/NewHeader';
import {AppColor, Fonts} from '../../Component/Color';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../Component/Config';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {BlurView} from '@react-native-community/blur';
import {useDispatch, useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import {localImage} from '../../Component/Image';
import AnimatedLottieView from 'lottie-react-native';
import ActivityLoader from '../../Component/ActivityLoader';
import axios from 'axios';
import VersionNumber from 'react-native-version-number';
import {setCustomWorkoutData} from '../../Component/ThemeRedux/Actions';
import {showMessage} from 'react-native-flash-message';

const CustomWorkoutDetails = ({navigation, route}) => {
  const data = route?.params?.item;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [forLoading, setForLoading] = useState(false);
  const getUserDataDetails = useSelector(state => state.getUserDataDetails);
  const dispatch = useDispatch();

  const renderItem = useMemo(
    () =>
      ({item}) => {
        return (
          <>
            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                width: '95%',
                borderRadius: 10,
                backgroundColor: '#FDFDFD',
                marginVertical: 8,
                flexDirection: 'row',
                alignSelf: 'center',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 20,
                padding: 5,
                borderColor: '#D9D9D9',

                borderWidth: 1,
                shadowColor: 'rgba(0, 0, 0, 1)',
                ...Platform.select({
                  ios: {
                    shadowColor: '#000000',
                    shadowOffset: {width: 0, height: 2},
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                  },
                  android: {
                    elevation: 4,
                  },
                }),
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {isLoading && (
                  <ActivityIndicator
                    style={styles.loader}
                    size="small"
                    color="#0000ff"
                  />
                )}

                <Image
                  //  source={{uri: item?.exercise_image_link}}
                  source={
                    item?.exercise_image_link != null
                      ? {uri: item?.exercise_image_link}
                      : localImage.Noimage
                  }
                  onLoad={() => setIsLoading(false)}
                  style={{
                    width: 80,
                    height: 80,
                    justifyContent: 'center',
                    alignSelf: 'center',
                    // backgroundColor:'red',
                    marginHorizontal: -7,
                  }}
                  resizeMode="contain"
                />
                <View
                  style={{
                    marginHorizontal: 25,
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 17,
                      fontWeight: '600',
                      color: '#202020',
                      lineHeight: 25,
                      fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                    }}>
                    {item?.exercise_title}
                  </Text>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: '600',
                        color: '#202020',
                        lineHeight: 30,

                        fontFamily: Fonts.MONTSERRAT_MEDIUM,
                      }}>
                      {'Set: '}
                      {item?.exercise_sets}
                    </Text>
                    <Text
                      style={{
                        fontSize: 30,
                        fontWeight: '600',
                        color: '#202020',
                        lineHeight: 20,
                        marginHorizontal: 10,
                        fontFamily: Fonts.MONTSERRAT_MEDIUM,
                      }}>
                      .
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: '600',
                        color: '#202020',
                        lineHeight: 30,

                        fontFamily: Fonts.MONTSERRAT_MEDIUM,
                      }}>
                      {'Reps: '}
                      {item?.exercise_reps}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </>
        );
      },
    [],
  );
  const emptyComponent = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <AnimatedLottieView
          source={require('../../Icon/Images/NewImage/NoData.json')}
          speed={2}
          autoPlay
          loop
          resizeMode="contain"
          style={{
            width: DeviceWidth * 0.5,

            height: DeviceHeigth * 0.5,
          }}
        />
      </View>
    );
  };
  const deleteCustomeWorkout = async () => {
    setForLoading(true);
    setIsMenuOpen(false);

    try {
      const response = await axios.get(
        `${NewAppapi.DELETE_CUSTOM_WORKOUT}?user_id=${getUserDataDetails.id}&custom_workout_id=${data?.custom_workout_id}&version=${VersionNumber.appVersion}`,
      );

      if (response?.data?.msg == 'data deleted successfully') {
        getCustomWorkout();
        showMessage({
          message: response?.data?.msg,
          type: 'success',
          animationDuration: 500,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
      } else {
        setForLoading(false);
        showMessage({
          message: response?.data?.msg,
          type: 'danger',
          animationDuration: 500,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
      }
    } catch (error) {
      setForLoading(false);
      showMessage({
        message: 'Something went wrong pleasr try again',
        type: 'danger',
        animationDuration: 500,
        floating: true,
        icon: {icon: 'auto', position: 'left'},
      });
      console.log('Custom Workout Delete Error', error);
    }
  };
  const getCustomWorkout = async () => {
    try {
      const data = await axios.get(
        `${NewAppapi.GET_USER_CUSTOM_WORKOUT}?user_id=${getUserDataDetails?.id}`,
      );
     
      if (data?.data?.msg != 'data not found.') {
        setForLoading(false);
        dispatch(setCustomWorkoutData(data?.data?.data));
        navigation.goBack();
      } else {
        setForLoading(false);
        navigation.goBack();
        dispatch(setCustomWorkoutData([]));
      }
    } catch (error) {
      setForLoading(false);
      showMessage({
        message: 'Something went wrong pleasr try again',
        type: 'danger',
        animationDuration: 500,
        floating: true,
        icon: {icon: 'auto', position: 'left'},
      });
      console.log('Custom Workout Error', error);
      dispatch(setCustomWorkoutData([]));
    }
  };
  return (
    <>
      <NewHeader
        //header={route?.params?.item?.workout_name}
        header={'Custom Workout'}
        SearchButton={false}
        backButton={true}
      />
      {forLoading ? <ActivityLoader /> : ''}
      <View style={styles.container}>
        <View
          style={{
            width: '95%',
            borderRadius: 10,
            backgroundColor: '#FDFDFD',
            marginVertical: 8,
            flexDirection: 'row',
            alignSelf: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            padding: 5,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              // source={{uri: data.workout_image_link}}
              source={localImage.Noimage}
              style={{
                width: 80,
                height: 80,
                justifyContent: 'center',
                alignSelf: 'center',
                // backgroundColor:'red',
                marginHorizontal: -7,
              }}
              resizeMode="contain"
            />
            <View
              style={{
                marginHorizontal: 25,
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: '600',
                  color: '#202020',
                  lineHeight: 25,
                  fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                }}>
                {data?.workout_name}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '600',
                  color: '#202020',
                  lineHeight: 30,

                  fontFamily: Fonts.MONTSERRAT_MEDIUM,
                }}>
                {data?.total_exercises}
                {' Exercises'}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              setIsMenuOpen(true);
            }}>
            <Icons name="dots-vertical" size={30} color={'#000'} />
          </TouchableOpacity>
        </View>
        <View style={{width: '95%', alignSelf: 'center', top: -20}}>
          <Text
            style={{
              color: AppColor.BLACK,
              fontFamily: 'Montserrat-SemiBold',
              fontWeight: '700',
              lineHeight: 20,
              fontSize: 20,
              top: 10,
              alignItems: 'center',
            }}>
            Exercises
          </Text>
        </View>
        <View style={{paddingBottom: 10, flex: 1}}>
          <FlatList
            data={data?.exercise_data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            ListEmptyComponent={emptyComponent}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            updateCellsBatchingPeriod={100}
            removeClippedSubviews={true}
          />
        </View>
        {data?.exercise_data.length > 0 && (
          <TouchableOpacity
            style={styles.buttonStyle}
            activeOpacity={0.5}
            onPress={() => {}}>
            <LinearGradient
              start={{x: 0, y: 1}}
              end={{x: 1, y: 0}}
              colors={['#D01818', '#941000']}
              style={styles.buttonStyle}>
              <Image
                source={localImage.Biceps}
                style={{width: 20, height: 20}}
              />
              <Text style={styles.button}>{'Start Workout'}</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
      <Modal
        visible={isMenuOpen}
        transparent={true}
        onRequestClose={() => {
          setIsMenuOpen(!isMenuOpen);
        }}>
        <BlurView style={styles.modalContainer} blurType="light" blurAmount={1}>
          <TouchableOpacity
            style={{flex: 1}}
            activeOpacity={1}
            onPress={() => setIsMenuOpen(false)}>
            <View
              style={{
                width: DeviceWidth * 0.4,
                alignSelf: 'flex-end',
                backgroundColor: AppColor.WHITE,
                paddingBottom: 10,
                marginTop: DeviceHeigth * 0.15,
                borderRadius: 10,
                marginRight: DeviceWidth * 0.05,
              }}>
              <TouchableOpacity
                onPress={() => {
                  setIsMenuOpen(false);
                  navigation.navigate('EditCustomWorkout', {item: data});
                }}
                style={{
                  flexDirection: 'row',
                  marginVertical: 10,
                  marginHorizontal: 20,
                  alignItems: 'center',
                }}>
                <Icons name="pen" size={20} color={'#000'} />
                <Text
                  style={{
                    fontWeight: '600',
                    fontSize: 14,
                    lineHeight: 18,
                    marginHorizontal: 10,
                    color: '#505050',
                    textAlign: 'center',
                    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                  }}>
                  Edit
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  deleteCustomeWorkout();
                }}
                style={{
                  flexDirection: 'row',
                  marginHorizontal: 20,
                  alignItems: 'center',
                }}>
                <Icons name="delete" size={20} color={'#D5191A'} />
                <Text
                  style={{
                    fontWeight: '600',
                    fontSize: 14,
                    lineHeight: 18,
                    marginHorizontal: 10,
                    color: '#D5191A',
                    textAlign: 'center',
                    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                  }}>
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </BlurView>
      </Modal>
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
  },
  modalContainer: {
    flex: 1,

    backgroundColor: 'rgba(0,0,0,.2)',
  },
  modalContent: {
    padding: 20,
    borderRadius: 8,
    width: DeviceWidth * 0.5,

    alignSelf: 'flex-end',
    position: 'absolute',
    top: DeviceHeigth / 8,
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
  loader: {
    position: 'absolute',
    justifyContent: 'center',
    alignSelf: 'center',

    height: 50,
    width: 50,
    borderRadius: 100 / 2,
  },
});
export default CustomWorkoutDetails;
