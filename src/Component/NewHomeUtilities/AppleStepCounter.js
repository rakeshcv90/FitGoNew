import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  NativeEventEmitter,
  NativeModules,
  Modal,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {DeviceHeigth, DeviceWidth} from '../Config';
import {AppColor, Fonts} from '../Color';
import {Image} from 'react-native';
import {localImage} from '../Image';
import {useIsFocused} from '@react-navigation/native';
import AppleHealthKit, {EventType} from 'react-native-health';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import analytics from '@react-native-firebase/analytics';
import {setPedomterData, setPermissionIos} from '../ThemeRedux/Actions';
import {BlurView} from '@react-native-community/blur';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Slider} from '@miblanchard/react-native-slider';

const AppleStepCounter = () => {
  const dispatch = useDispatch();
  const getPedomterData = useSelector(state => state.getPedomterData);
  const getPopUpSeen = useSelector(state => state.getPopUpSeen);
  const [steps, setSteps] = useState(0);
  const stepsRef = useRef(steps);
  const [Calories, setCalories] = useState(0);
  const caloriesRef = useRef(Calories);
  const [distance, setDistance] = useState(0);
  const distanceRef = useRef(distance);
  const isFocused = useIsFocused();
  const [stepGoalProfile, setStepGoalProfile] = useState(
    getPedomterData[0] ? getPedomterData[0].RSteps : 5000,
  );
  const [DistanceGoalProfile, setDistanceGoalProfile] = useState(
    getPedomterData[1] ? getPedomterData[1].RDistance : 2.5,
  );
  const [CalriesGoalProfile, setCaloriesGoalProfile] = useState(
    getPedomterData[2] ? getPedomterData[2].RCalories : 250,
  );
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (isFocused) {
      setTimeout(() => {
        ActivityPermission();
      }, 2000);
    }
  }, [isFocused]);

  const ActivityPermission = async () => {
    if (Platform.OS == 'android') {
    } else if (Platform.OS == 'ios') {
      AppleHealthKit.isAvailable((err, available) => {
        const permissions = {
          permissions: {
            read: [AppleHealthKit.Constants.Permissions.StepCount],
          },
        };
        if (err) {
          console.log('error initializing Healthkit: ', err);
          if (!getPopUpSeen) {
            dispatch(setPermissionIos(true));
          }
        } else if (available == true) {
          AppleHealthKit.initHealthKit(permissions, error => {
            Promise.resolve(
              AsyncStorage.setItem('hasPermissionForStepCounter', 'true'),
            );
            if (error) {
              console.log('[ERROR] Cannot grant permissions!', error);
              if (!getPopUpSeen) {
                dispatch(setPermissionIos(true));
              }
            } else {
              if (!getPopUpSeen) {
                setTimeout(() => {
                  if (!getPopUpSeen) {
                    dispatch(setPermissionIos(true));
                  }
                }, 1500);
              }
              new NativeEventEmitter(NativeModules.AppleHealthKit).addListener(
                // adding a listner here to record whenever new Steps will be sent from healthkit
                'healthKit:StepCount:new',
                async () => {
                  AppleHealthKit.getStepCount(
                    options,
                    (callbackError, results) => {
                      if (callbackError) {
                        console.log('Error while getting the data');
                      }
                      setSteps(results.value);
                      setDistance(((results.value / 20) * 0.01).toFixed(2));
                      setCalories(((results.value / 20) * 1).toFixed(1));
                    },
                  );
                },
              );
              const options = {
                startDate: new Date(
                  new Date().getFullYear(),
                  new Date().getMonth(),
                  new Date().getDate(),
                  0,
                  0,
                  0,
                ),
                endDate: new Date(),
              };
              AppleHealthKit.getStepCount(options, (callbackError, results) => {
                if (callbackError) {
                }
                setSteps(results?.value);
                setDistance(((results?.value / 20) * 0.01).toFixed(2));
                setCalories(((results?.value / 20) * 1).toFixed(1));
              });
            }
          });
        } else {
          Alert.alert(
            'Attention',
            "Health data can't be tracked in this Device due to its specifications",
            {},
          );
        }
      });
    }
  };
  const closeModal = () => {
    setModalVisible(false); // Close the modal
  };
  const handleLongPress = () => {
    analytics().logEvent('CV_FITME_CLICKED_ON_PEDOMETER');
    setModalVisible(true); // Show the modal when long-press is detected
  };

  const SliderView = ({
    Visiblity,
    txt,
    Value,
    Value1,
    handleChange,
    ToggleState,
    ImgSource,
    MinimumValue,
    MaximumValue,
  }) => {
    const thumbStyle = {
      width: 35,
      height: 35,
      backgroundColor: AppColor.WHITE,
      borderRadius: 35 / 2,
      justifyContent: 'center',
      alignItems: 'center',
      ...Platform.select({
        ios: {
          shadowColor: AppColor.BLACK,
          shadowOpacity: 0.5,
          shadowOffset: {width: 5, height: 0},
        },
        android: {
          elevation: 5,
        },
      }),
    };
    const ToggleVisiblity = () => {
      ToggleState(prev => !prev);
    };
    const ThumbImage = ({param}) => {
      return (
        <View style={thumbStyle}>
          <Image
            source={ImgSource}
            style={{width: 20, height: 20}}
            resizeMode="contain"
            tintColor={param == 'Steps' ? '#5FB67B' : null}
          />
        </View>
      );
    };
    return (
      <>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 15,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              source={ImgSource}
              style={{width: 30, height: 30}}
              tintColor={txt == 'Steps' ? '#5FB67B' : null}
              resizeMode="contain"
            />
            <Text style={styles.txt5}>
              {txt == 'Steps'
                ? 'Steps'
                : txt == 'Distance'
                ? 'Distance'
                : txt == 'Calories'
                ? 'Calories'
                : ''}
            </Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={{
                color: AppColor.BoldText,
                marginLeft: 10,
                fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
              }}>
              {Value1}
            </Text>
            <TouchableOpacity
              style={styles.dropButton}
              onPress={() => ToggleVisiblity(txt)}>
              <Icons
                name={Visiblity ? 'chevron-up' : 'chevron-down'}
                size={25}
                color={'#000'}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{marginTop: 5}}>
          {
            // Step_Visible
            Visiblity ? (
              <Slider
                value={Value}
                maximumValue={MaximumValue}
                minimumValue={MinimumValue}
                step={1}
                onValueChange={handleChange}
                minimumTrackTintColor="#5FB67B"
                renderThumbComponent={() => <ThumbImage param={txt} />}
                trackStyle={{height: 10, borderRadius: 20}}
              />
            ) : null
          }
        </View>
      </>
    );
  };
  const UpdateGoalModal = () => {
    const [Steps_Goal, setSteps_Goal] = useState(
      getPedomterData[0] ? getPedomterData[0].RSteps : 500,
    );
    const [Calories_Goal, setCalories_Goal] = useState(
      getPedomterData[2] ? getPedomterData[2].RCalories : 25,
    );
    const [Distance_Goal, setDistance_Goal] = useState(
      getPedomterData[1] ? getPedomterData[1].RDistance : 0.25,
    );
    const [Step_Visible, setSteps_Visible] = useState(true);
    const [Distance_Visible, setDistance_Visible] = useState(false);
    const [Calories_Visible, setCalories_Visible] = useState(false);

    const HandleSave = () => {
      setStepGoalProfile(Steps_Goal);
      setDistanceGoalProfile(Distance_Goal);
      setCaloriesGoalProfile(Calories_Goal);
      dispatch(
        setPedomterData([
          {RSteps: Steps_Goal},
          {RDistance: Distance_Goal},
          {RCalories: Calories_Goal},
        ]),
      );
      closeModal();
    };
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}>
        <BlurView
          style={styles.modalContainer}
          blurType="light"
          blurAmount={1}
          reducedTransparencyFallbackColor="white"
        />
        <View
          style={[styles.modalContent, {backgroundColor: AppColor.BACKGROUNG}]}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                source={localImage.Target}
                style={{width: DeviceWidth * 0.07, height: DeviceHeigth * 0.03}}
                resizeMode="contain"
              />
              <Text
                style={[styles.title, {color: AppColor.BLACK, marginLeft: 10}]}>
                Set Goals
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
              }}
              style={styles.dropButton}>
              <Icons name={'close'} size={15} color={'#000'} />
            </TouchableOpacity>
          </View>
          <SliderView
            txt={'Steps'}
            Visiblity={Step_Visible}
            Value={Steps_Goal}
            handleChange={value => {
              setSteps_Goal(value);
              setCalories_Goal((value * 0.05).toFixed(2));
              setDistance_Goal((value * 0.0005).toFixed(2));
            }}
            Value1={`${Steps_Goal} Steps`}
            ToggleState={setSteps_Visible}
            ImgSource={localImage.Step3}
            MinimumValue={500}
            MaximumValue={10000}
          />
          <SliderView
            txt={'Distance'}
            Visiblity={Distance_Visible}
            Value={Distance_Goal}
            handleChange={value => {
              setDistance_Goal(value);
              setSteps_Goal((value * 2000).toFixed(0));
              setCalories_Goal((value * 100).toFixed(2));
            }}
            Value1={`${Distance_Goal} Km`}
            ToggleState={setDistance_Visible}
            ImgSource={localImage.Step2}
            MinimumValue={0.25}
            MaximumValue={5}
          />
          <SliderView
            txt={'Calories'}
            Visiblity={Calories_Visible}
            Value={Calories_Goal}
            handleChange={value => {
              setCalories_Goal(value);
              setDistance_Goal((value * 0.01).toFixed(2));
              setSteps_Goal(value * 20);
            }}
            Value1={`${Calories_Goal} Kcal`}
            ToggleState={setCalories_Visible}
            ImgSource={localImage.Step1}
            MinimumValue={25}
            MaximumValue={500}
          />
          <TouchableOpacity
            style={styles.Modal_Save_btton}
            activeOpacity={0.5}
            onPress={() => {
              // AnimationRef.current && AnimationRef?.current.reAnimate();

              HandleSave();
            }}>
            <View
              style={{
                width: DeviceWidth * 0.3,
                height: DeviceHeigth * 0.04,
                borderRadius: 6,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#f0013b',
              }}>
              <Text style={[styles.title, {color: AppColor.WHITE}]}>Save</Text>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <View
          style={{
            width: '100%',
            height: '15%',
            flexDirection: 'row',

            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              fontFamily: Fonts.HELVETICA_BOLD,
              fontSize: 16,
              fontWeight: '700',
              lineHeight: 20,
              color: AppColor.PrimaryTextColor,
            }}>
            Health Overview
          </Text>
          <TouchableOpacity
            onPress={handleLongPress}
            activeOpacity={0.5}
            style={{
              width: 20,
              height: 20,
            }}>
            <Image
              source={require('../../Icon/Images/NewImage/editpen.png')}
              style={[
                styles.img,
                {
                  height: 20,
                  width: 20,
                },
              ]}
              resizeMode="contain"></Image>
          </TouchableOpacity>
        </View>
        <View
          style={{
            width: '100%',
            height: '85%',
            marginVertical: 15,

            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'center',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              width: '33.33%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 100 / 2,
                backgroundColor: '#eaf6ec',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={localImage.Step3}
                style={[
                  styles.img,
                  {
                    height: 35,
                    width: 35,
                  },
                ]}
                resizeMode="contain"
              />
            </View>
            <Text style={[styles.monetText, {marginTop: 15}]}>
              {Platform.OS == 'ios' ? steps?.toFixed(0) : stepsRef.current}
              <Text
                style={[
                  styles.monetText,
                  {
                    fontSize: 16,
                    fontWeight: '400',
                    fontFamily: Fonts.HELVETICA_REGULAR,
                  },
                ]}>
                {`/${stepGoalProfile}`}
              </Text>
            </Text>
            <Text style={styles.monetText2}>Steps</Text>
          </View>
          <View
            style={{
              width: '33.33%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 100 / 2,
                backgroundColor: '#fff9e6',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={require('../../Icon/Images/NewImage2/Point.png')}
                style={[
                  styles.img,
                  {
                    height: 35,
                    width: 35,
                  },
                ]}
                resizeMode="contain"
              />
            </View>
            <Text style={[styles.monetText, {marginTop: 15}]}>
              {Platform.OS == 'ios' ? distance : distanceRef.current}
              <Text
                style={[
                  styles.monetText,
                  {
                    fontSize: 16,
                    fontWeight: '400',
                    fontFamily: Fonts.HELVETICA_REGULAR,
                  },
                ]}>
                {`/${DistanceGoalProfile} km `}
              </Text>
            </Text>
            <Text style={styles.monetText2}>Distance</Text>
          </View>
          <View
            style={{
              width: '33.33%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 100 / 2,
                backgroundColor: '#fbebec',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={localImage.Step1}
                style={[
                  styles.img,
                  {
                    height: 35,
                    width: 35,
                  },
                ]}
                resizeMode="contain"
              />
            </View>
            <Text style={[styles.monetText, {marginTop: 15}]}>
              {Platform.OS == 'ios' ? Calories : caloriesRef.current}
              <Text
                style={[
                  styles.monetText,
                  {
                    fontSize: 16,
                    fontWeight: '400',
                    fontFamily: Fonts.HELVETICA_REGULAR,
                  },
                ]}>
                {`/${CalriesGoalProfile} Kcal`}
              </Text>
            </Text>
            <Text style={styles.monetText2}>Calories</Text>
          </View>
        </View>
      </View>
      <UpdateGoalModal />
    </View>
  );
};
var styles = StyleSheet.create({
  container: {
    width: DeviceWidth,
    height: DeviceHeigth * 0.2,
    backgroundColor: AppColor.WHITE,
    marginVertical: 15,
  },
  box: {
    width: DeviceWidth * 0.95,
    height: DeviceHeigth * 0.2,
    alignSelf: 'center',
    paddingVertical: 10,
  },
  monetText: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 16,
    fontFamily: Fonts.HELVETICA_BOLD,
    color: AppColor.PrimaryTextColor,
  },
  monetText2: {
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 20,
    fontFamily: Fonts.HELVETICA_REGULAR,

    color: AppColor.SecondaryTextColor,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // Semi-transparent background
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 27,
    fontFamily: Fonts.HELVETICA_BOLD,
  },
  modalContent: {
    padding: 20,
    borderRadius: 8,
    width: DeviceWidth * 0.95,

    position: 'absolute',
    top: DeviceHeigth / 6,
    marginHorizontal: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOpacity: 0.2,
        shadowOffset: {height: 5, width: 0},
      },
      android: {
        elevation: 5,
      },
    }),
  },
  dropButton: {
    backgroundColor: AppColor.WHITE,
    width: 25,
    height: 25,
    borderRadius: 25 / 2,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOpacity: 0.3,
        shadowOffset: {height: 5, width: 0},
        shadowRadius: 20,
      },
      android: {
        elevation: 5,
      },
    }),
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  Modal_Save_btton: {
    width: DeviceWidth * 0.3,
    height: DeviceHeigth * 0.04,
    borderRadius: 12,
    alignSelf: 'center',
    marginTop: 8,
  },
});
export default AppleStepCounter;
