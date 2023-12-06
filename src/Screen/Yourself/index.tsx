import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {navigation} from '../../../App';
import {
  DeviceHeigth,
  DeviceWidth,
  NewApi,
  NewAppapi,
} from '../../Component/Config';
import LinearGradient from 'react-native-linear-gradient';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {localImage} from '../../Component/Image';
import Gender from './Gender';
import Goal from './Goal';
import {showMessage} from 'react-native-flash-message';
import Level from './Level';
import {Picker} from '@react-native-picker/picker';
import Focus from './Focus';
import Toggle from '../../Component/Toggle';
import {AppColor} from '../../Component/Color';
import {setCompleteProfileData} from '../../Component/ThemeRedux/Actions';
import axios from 'axios';
import ActivityLoader from '../../Component/ActivityLoader';
import Button from '../../Component/Button';

const imgData = Array(60)
  .fill(0)
  .map((item: any, index, arr) => arr[index] + index + 1);
const imgData2 = Array(60)
  .fill(27)
  .map((item: any, index, arr) => arr[index] + index + 3);

const Index = ({navigation, route}: any) => {
  const {defaultTheme, completeProfileData, getUserID} = useSelector(
    (state: any) => state,
  );
  const dispatch = useDispatch();
  const [screen, setScreen] = useState(0);
  const [toggleW, setToggleW] = useState('kg');
  const [toggle, setToggle] = useState('ft');
  const [visible, setVisible] = useState(false);
  const [selectedGender, setSelectedGender] = useState(-1);
  const [selectedGoal, setSelectedGoal] = useState(-1);
  const [selectedLevel, setSelectedLevel] = useState(-1);
  const [selectedFocus, setSelectedFocus] = useState(-1);
  const [selectedHeight, setSelectedHeight] = useState('');
  const [selectedWeight, setSelectedWeight] = useState('');
  const [selectedAge, setSelectedAge] = useState('');
  const [isRouteDataAvailable, setIsrouteDataAvailable] = useState(false);
  useEffect(() => {
    if (route?.params?.id == undefined) {
      setScreen(0);
      // console.log(Sid.id)
    } else {
      setScreen(route?.params?.id);
      setIsrouteDataAvailable(true);
    }
  }, [route?.params?.id]);
  useEffect(() => {
    ProfileDataAPI();
  }, []);

  const ProfileDataAPI = async () => {
    try {
      const res = await axios({
        url: NewAppapi.Get_COMPLETE_PROFILE,
        method: 'get',
      });
      if (res.data) {
        // console.log(res.data);
        dispatch(setCompleteProfileData(res.data));
      }
    } catch (error) {
      dispatch(setCompleteProfileData([]));
      console.log(error);
    }
  };
  const setProfileAPI = async () => {
    setVisible(true);
    const payload = new FormData();
    // gender,goal,age,fitnesslevel,focusarea,height, weight
    payload.append('gender', selectedGender == 0 ? 'Male' : 'Female');
    payload.append('goal', selectedGoal);
    payload.append('age', selectedAge);
    payload.append('fitnesslevel', selectedLevel);
    payload.append('focusarea', selectedFocus);
    payload.append('height', selectedHeight);
    payload.append('weight', selectedWeight);
    payload.append('id', getUserID);
    // console.log(payload);
    try {
      const res = await axios({
        url: NewAppapi.Post_COMPLETE_PROFILE,
        method: 'post',
        data: payload,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (res.data) {
        // console.log(res.data);
        setVisible(false);
        navigation.navigate('BottomTab');
      }
    } catch (error) {
      console.log(error);
      navigation.navigate('BottomTab');

      setVisible(false);
    }
  };

  const fullData = [
    {
      id: 1,
      name: 'Gender',
      data: [
        {id: 1, image: localImage.MALE, name: 'Male'},
        {id: 2, image: localImage.FEMALE, name: 'Female'},
      ],
      top1: 'Tell us about yourself!',
      top2: 'To give you a better experience we need to know your gender',
    },
    {
      id: 2,
      name: 'Goal',
      data: [
        {
          id: 1,
          image: localImage.WeightLoss,
          name: 'Weight Loss',
          color: '#95ADFE4D',
          gender: 'Female',
        },
        {
          id: 2,
          image: localImage.BuildMuscle,
          name: 'Build Muscle',
          color: '#D7EFFE',
          gender: 'Female',
        },
        {
          id: 3,
          image: localImage.StrengthF,
          name: 'Strength',
          color: '#EFDFD2',
          gender: 'Female',
        },
        {
          id: 4,
          image: localImage.WeightLossM,
          name: 'Weight Loss',
          color: '#95ADFE4D',
          gender: 'Male',
        },
        {
          id: 5,
          image: localImage.BuildMuscleM,
          name: 'Build Muscle',
          color: '#D7EFFE',
          gender: 'Male',
        },
        {
          id: 6,
          image: localImage.Strength,
          name: 'Strength',
          color: '#EFDFD2',
          gender: 'Male',
        },
      ],
      top1: `What’s your goal?`,
      top2: 'This helps us create to your personalized plan',
    },
    {
      id: 3,
      name: 'Level',
      data: [
        {
          id: 1,
          image: localImage.BeginnerLevel,
          name: 'Beginner',
        },
        {
          id: 2,
          image: localImage.IntermediateLevel,
          name: 'Intermediate',
        },
        {id: 3, image: localImage.AdvanceLevel, name: 'Advance'},
        {id: 4, image: localImage.AdvanceLevel, name: 'Elite'},
      ],
      top1: `What’s your Fitness level?`,
      top2: 'This helps us create to your personalized plan',
    },
    {
      id: 4,
      name: 'Weight',
      top1: `What’s your Weight?`,
      top2: 'This helps us create to your personalized plan',
      data: ['kg', 'lb'],
    },
    {
      id: 5,
      name: 'Height',
      top1: `What’s your height?`,
      top2: 'This helps us create to your personalized plan',
      data: ['ft', 'cm'],
    },
    {
      id: 6,
      name: 'Age',
      top1: `How old are you ?`,
      top2: 'This helps us create to your personalized plan',
    },
    {
      id: 7,
      name: 'Focus',
      data: [
        {
          id: 1,
          image:
            'https://s3-alpha-sig.figma.com/img/1095/45fb/d3a879434dc93bc48b49f0017caf502b?Expires=1702252800&Signature=aU63bVTWLsvR~bXX7LpQHkn0mGrM8P4cs7h7MC7mcXpFL5MkeKPZ6-PiVa8B9G--twIPDKzOILKOr0oPGCIcHfdmZooK5M5AGJm7n-wOkumenFnrB3vEpmuDd9exXYtCOwcpkuOyjqdcQnz7yig7kKOoAV8ZQtbqVbFVhFHx7U2K3SRB1JIhYXR-Fv3Re1wJScDdRhyTBs6wHA1MtQIQ5S~RIM3LZL-qHYSBOp5yOp8v5SeXqkYLkHMl-dfR1IIOCVkCkPi4ELRqKzNNc-jjvdQC6DJLwDDrbcVcsWLT8R~vyK0ylbtXLYfCQzPCEBx4EvZMB0bJ~jXgo-FxHGmsKg__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4',
          name: 'Legs',
        },
        {
          id: 2,
          image:
            'https://s3-alpha-sig.figma.com/img/7910/f5cb/bf41d4a61461ea0e215258e153dade1d?Expires=1702252800&Signature=U6wH-q9rpuBeAD~mWlmKVUrJl9dNpDVEnkVSMof2mpm~aSEv-2BXy5OUKIC-JCh2XOsQGPiLfszi8SL9TTvqz75gjtmuUd97uOjq8Gnyd2p8jfC0d4eKBB-RBLs0fiob-uf9F6dUC99qasTFEltk2muZWbAuFpk23uFDtPbj8X-kpLzyCr1-~grSMkFCYIOjYfg1H19ZYj7bGtZJ69rWFFe~c-UaokTSxUOlAPL1B-V8WhVuCaRiDXWeE6Fe5Q0aoKl3~jLYOg0TpB0zGcSaxenEaJizmwXU11oFazQ1zVgSUuMjSeSDI6CCU5ya5tEFXhEjLaRr18CxjtFF72Bjdw__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4',
          name: 'Shoulders',
        },
        {id: 3, image: localImage.AdvanceLevel, name: 'Biceps'},
        {
          id: 4,
          image: localImage.BeginnerLevel,
          name: 'Back',
        },
        {
          id: 5,
          image: localImage.IntermediateLevel,
          name: 'Triceps',
        },
        {id: 3, image: localImage.AdvanceLevel, name: 'Abs'},
        {id: 3, image: localImage.AdvanceLevel, name: 'Chest'},
      ],
      top1: `What’s your Focus Area?`,
      top2: 'This helps us create to your personalized plan',
    },
  ];
  const Pickers = () => {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          width: DeviceWidth * 0.5,
          marginTop: DeviceHeigth * 0.2,
        }}>
        {screen == 3 ? (
          <Picker
            style={{flex: 1}}
            selectedValue={selectedWeight}
            onValueChange={(itemValue: any, itemIndex) => {
              setSelectedWeight(itemValue);
            }}
            selectionColor={'white'}>
            {imgData.map((hr: any, index: number) => {
              if (index < 10) return;
              if (toggleW == 'lb') hr = (hr * 0.2).toPrecision(2);
              return (
                <Picker.Item label={hr} value={hr} />
                // <Picker.Item label={`${hr} kg`} value={hr} />
              );
            })}
          </Picker>
        ) : screen == 4 ? (
          <Picker
            style={{flex: 1}}
            selectedValue={selectedHeight}
            onValueChange={(itemValue: any, itemIndex) => {
              setSelectedHeight(itemValue);
            }}
            selectionColor={'white'}>
            {imgData2.map((hr: any, index: number) => {
              if (index < 10) return;
              if (toggle == 'cm') hr = (hr * 30).toPrecision(2);
              return (
                <Picker.Item label={hr} value={hr} />
                // <Picker.Item label={`${hr} kg`} value={hr} />
              );
            })}
          </Picker>
        ) : (
          <Picker
            style={{flex: 1}}
            selectedValue={selectedAge}
            onValueChange={(itemValue: any, itemIndex) => {
              setSelectedAge(itemValue);
            }}
            selectionColor={'white'}>
            {imgData.map((hr: any, index: number) => {
              if (index < 15) return;
              return (
                <Picker.Item label={hr} value={hr} />
                // <Picker.Item label={`${hr} kg`} value={hr} />
              );
            })}
          </Picker>
        )}
      </View>
    );
  };

  const ProgressBar = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          width: DeviceWidth * 0.9,
        }}>
        <View style={{flexDirection: 'row-reverse', alignSelf: 'flex-end'}}>
          <Text
            style={{
              color: '#83898C',
              fontFamily: 'Poppins',
              fontWeight: '400',
            }}>
            <Text style={{color: AppColor.RED}}>{`Step  ${screen + 1} `}</Text>
            of 8
          </Text>
        </View>
        <View
          style={{
            width: DeviceWidth * 0.8,
            backgroundColor: '#E2E6F9',
            height: 5,
            borderRadius: 5,
            marginLeft: 40,
            marginTop: 5,
          }}>
          <View
            style={{
              width: (DeviceWidth * 0.9) / (7 - screen),
              backgroundColor: AppColor.RED,
              height: 5,
              borderRadius: 5,
            }}
          />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: defaultTheme ? 'black' : 'white'}}>
      {isRouteDataAvailable ? (
        <View style={{marginTop: DeviceHeigth * 0.03}}></View>
      ) : (
        <ProgressBar />
      )}
      {/* <View style={styles.buttonsUp}>
        {screen >= 1 && (
          <TouchableOpacity
            style={[styles.nextButton2]}
            onPress={() => setScreen(screen - 1)}>
            <Icons name="chevron-left" size={25} color={'#000'} />
          </TouchableOpacity>
        )}
        {screen >= 1 && screen <= 6 && (
          <TouchableOpacity onPress={() => setProfileAPI()}>
            <Text
              style={[{fontSize: 15, color: 'black', fontFamily: 'Poppins'}]}>
              SKIP
            </Text>
          </TouchableOpacity>
        )}
      </View> */}
      <View
        style={{
          height: DeviceHeigth * 0.7,
          alignItems: 'center',
        }}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: !defaultTheme ? 'black' : 'white',
              fontSize: 20,
              fontFamily: '',
              fontWeight: 'bold',
              lineHeight: 30,
            }}>
            {fullData[screen]?.top1}
          </Text>
          <Text
            style={{
              color: !defaultTheme ? 'black' : 'white',
              marginTop: 5,
              fontSize: 14,
              fontFamily: '',
              fontWeight: '400',
              lineHeight: 16,
              width: DeviceWidth * 0.6,
              textAlign: 'center',
            }}>
            {fullData[screen]?.top2}
          </Text>
          {/* <Text>{screen}</Text> */}
        </View>
        {screen == 3 && (
          <View
            style={{
              flexDirection: 'row-reverse',
              left: 100,
              marginVertical: 30,
            }}>
            <Toggle
              data={fullData[screen].data}
              highlightColor={AppColor.RED}
              baseColor={AppColor.SOCIALBUTTON}
              selected={toggleW}
              setSelected={setToggleW}
            />
          </View>
        )}
        {screen == 4 && (
          <View
            style={{
              flexDirection: 'row-reverse',
              left: 100,
              marginVertical: 30,
            }}>
            <Toggle
              data={fullData[screen].data}
              highlightColor={AppColor.RED}
              baseColor={AppColor.SOCIALBUTTON}
              selected={toggle}
              setSelected={setToggle}
            />
          </View>
        )}

        {screen == 0 ? (
          <Gender
            data={fullData[screen]?.data}
            selectedImage={selectedGender}
            setSelectedImage={setSelectedGender}
          />
        ) : screen == 1 ? (
          <Goal
            data={completeProfileData?.goal}
            selectedImage={selectedGoal}
            setSelectedImage={setSelectedGoal}
            selectedGender={selectedGender == 0 ? 'M' : 'F'}
          />
        ) : screen == 2 ? (
          <Level
            data2={completeProfileData?.level}
            data={fullData[screen]?.data}
            selectedImage={selectedLevel}
            setSelectedImage={setSelectedLevel}
          />
        ) : screen == 5 || screen == 4 || screen == 3 ? (
          <Pickers />
        ) : screen == 6 ? (
          <Focus
            data={fullData[screen]?.data}
            data2={completeProfileData?.focusarea}
            selectedImage={selectedFocus}
            setSelectedImage={setSelectedFocus}
          />
        ) : null}
      </View>

      {isRouteDataAvailable ? (
        <View
          style={{
            marginBottom: DeviceHeigth * 0.05,
            flex: 1,
            justifyContent: 'flex-end',
          }}>
          <Button
            buttonText={'Update'}
            onPresh={() => {
              navigation.navigate('Personal Details');
            }}
          />
        </View>
      ) : (
        <>
          <View style={styles.buttons}>
            {screen >= 1 ? (
              <TouchableOpacity
                style={[styles.nextButton2]}
                onPress={() => setScreen(screen - 1)}>
                <Icons name="chevron-left" size={25} color={'#000'} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.nextButton2]}
                onPress={() => setScreen(screen - 1)}
                disabled>
                <Text
                  style={[
                    {fontSize: 15, color: 'black', fontFamily: 'Poppins'},
                  ]}>
                  {}
                </Text>
              </TouchableOpacity>
            )}
            {/* <View
                style={{
                  width: DeviceWidth * 0.22,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                {IntroductionData.map(item => (
                  <View
                    style={{
                      height: 3,
                      width: item.id == currentPage + 1 ? 40 : 20,
                      backgroundColor:
                        item.id == currentPage + 1
                          ? AppColor.RED
                          : AppColor.SOCIALBUTTON,
                    }}
                  />
                ))}
              </View> */}
            <TouchableOpacity
              onPress={() => {
                screen == 1 && selectedGoal == -1
                  ? showMessage({
                      message: 'Please Select one Goal',
                      animationDuration: 750,
                      floating: true,
                      type: 'danger',
                      // icon: {icon: 'none', position: 'left'},
                    })
                  : screen == 2 && selectedLevel == -1
                  ? showMessage({
                      message: 'Please Select your Current Fitness Level',
                      animationDuration: 750,
                      floating: true,
                      type: 'danger',
                      // icon: {icon: 'none', position: 'left'},
                    })
                  : screen == 6
                  ? selectedFocus == -1
                    ? showMessage({
                        message: 'Please Select your Focus Area',
                        animationDuration: 750,
                        floating: true,
                        type: 'danger',
                        // icon: {icon: 'none', position: 'left'},
                      })
                    : setProfileAPI()
                  : setScreen(screen + 1);
              }}>
              <LinearGradient
                start={{x: 0, y: 1}}
                end={{x: 1, y: 0}}
                colors={['#941000', '#D5191A']}
                style={[
                  styles.nextButton,
                  {
                    flexDirection: screen == 6 ? 'row' : 'column',
                    width: screen == 6 ? 120 : 45,
                  },
                ]}>
                {screen == 6 && (
                  <Text
                    style={{
                      color: 'white',
                      marginTop: 5,
                      fontSize: 14,
                      fontFamily: 'Poppins',
                      fontWeight: '600',
                      lineHeight: 16,
                      textAlign: 'center',
                    }}>
                    Let's Start
                  </Text>
                )}
                <Icons name="chevron-right" size={25} color={'#fff'} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </>
      )}
      <ActivityLoader visible={visible} />
    </SafeAreaView>
  );
};

export default Index;

const styles = StyleSheet.create({
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: (DeviceWidth * 85) / 100,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 50,
  },
  buttonsUp: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: (DeviceWidth * 85) / 100,
    alignItems: 'center',
    alignSelf: 'center',
    height: 50,
  },
  nextButton: {
    backgroundColor: 'red',
    height: 45,
    borderRadius: 50 / 2,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButton2: {
    // backgroundColor: 'red',
    width: 45,
    height: 45,
    borderRadius: 50 / 2,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
