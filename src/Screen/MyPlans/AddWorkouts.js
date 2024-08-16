import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import DietPlanHeader from '../../Component/Headers/DietPlanHeader';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../Component/Config';
import Icons from 'react-native-vector-icons/FontAwesome5';
import {useDispatch, useSelector} from 'react-redux';
import {FlatList} from 'react-native';
import {localImage} from '../../Component/Image';
import {AppColor, Fonts} from '../../Component/Color';
import NewButton from '../../Component/NewButton';
import VersionNumber from 'react-native-version-number';
import axios from 'axios';
import {showMessage} from 'react-native-flash-message';
import ActivityLoader from '../../Component/ActivityLoader';
import {setEditedExercise} from '../../Component/ThemeRedux/Actions';
import {useIsFocused} from '@react-navigation/native';
const AddWorkouts = ({route, navigation}) => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');

  const getAllExercise = useSelector(state => state?.getAllExercise);
  const getUserDataDetails = useSelector(state => state?.getUserDataDetails);
  const [disabled, setDisabled] = useState(true);
  const dayExercises = route?.params?.dayExercises;
  const image = route?.params?.image;
  const title = route?.params?.title;
  const [tempList, setTempList] = useState(dayExercises);
  const [loaded, setLoaded] = useState(true);
  const day = route?.params?.day;
  let ExerciseIds = tempList.map(item => item?.exercise_id);
  const [filteredCategories, setFilteredCategories] = useState(getAllExercise);
  const isFocused = useIsFocused();
  const getEquipmentExercise = useSelector(
    state => state?.getEquipmentExercise,
  );

  // useEffect(() => {
  //   if (isFocused) {
  //     if (getEquipmentExercise == 1) {
  //       const filteredItems = getAllExercise?.filter(item => {
  //         return item?.exercise_equipment == 'No Equipment';
  //       });
  //       setFilteredCategories(filteredItems);
  //     } else {
  //       const filteredItems = getAllExercise?.filter(item => {
  //         return item?.exercise_equipment != 'No Equipment';
  //       });
  //       setFilteredCategories(filteredItems);
  //     }
  //   }
  // }, []);
  const updateFilteredCategories = test => {
    const filteredItems = getAllExercise?.filter(item =>
      item.exercise_title.toLowerCase().includes(test.toLowerCase()),
    );
    setFilteredCategories(filteredItems);
  };
  //
  const handleItems = obj => {
    setDisabled(false);
    if (ExerciseIds.includes(obj?.exercise_id)) {
      setTempList(prev =>
        prev.filter(item => item.exercise_id !== obj.exercise_id),
      );
    } else if (
      !ExerciseIds.includes(obj?.exercise_id) &&
      tempList.length < dayExercises.length
    ) {
      setTempList(prev => [...prev, obj]);
    }
  };
  const EditExerciseApi = async () => {
    setLoaded(false);
    const payload = new FormData();
    payload.append('user_id', getUserDataDetails?.id);
    payload.append('version', VersionNumber.appVersion);
    payload.append('day', day);
    payload.append('image', image);
    payload.append('title', title);
    for (let i = 0; i < ExerciseIds?.length; i++) {
      payload.append('exercise_id[]', ExerciseIds[i]); // to send data in array format
    }
    try {
      const response = await axios(NewAppapi.EDIT_EVENT_EXERCISE, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: payload,
      });
      if (
        response?.data?.msg == 'Please update the app to the latest version.'
      ) {
        showMessage({
          message: response?.data?.msg,
          type: 'danger',
          animationDuration: 500,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
      } else {
        showMessage({
          message: 'Workout plan created successfully',
          type: 'success',
          animationDuration: 500,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
        getEditedExercises();
      }
    } catch (error) {
      console.log('error', error.response);
      showMessage({
        message: 'Something error occurred',
        type: 'danger',
        animationDuration: 500,
        floating: true,
        icon: {icon: 'auto', position: 'left'},
      });
    }
  };
  const getEditedExercises = async () => {
    try {
      const response = await axios(
        `${NewAppapi.GET_EDITED_EXERCISES}?user_id=${getUserDataDetails?.id}&day=${day}&version=${VersionNumber.appVersion}`,
        {
          method: 'GET',
        },
      );
      if (
        response?.data?.msg == 'Please update the app to the latest version.'
      ) {
        showMessage({
          message: response?.data?.msg,
          type: 'danger',
          animationDuration: 500,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
        setLoaded(true);
      } else {
        setLoaded(true);
        dispatch(setEditedExercise({[day]: response?.data}));

        navigation.navigate('BottomTab');
      }
    } catch (error) {
      console.log('getExercisesApiError', error);
      showMessage({
        message: 'Something error occurred',
        type: 'danger',
        animationDuration: 500,
        floating: true,
        icon: {icon: 'auto', position: 'left'},
      });
      setLoaded(true);
    }
  };
  return (
    <View style={styles.Container}>
      <DietPlanHeader header="Add workouts" shadow />
      <View style={styles.View1}>
        <Icons name="search" size={18} color={'#333333E5'} />
        <TextInput
          placeholder="Search Exercise"
          placeholderTextColor="#33333380"
          value={searchQuery}
          onChangeText={text => {
            setSearchQuery(text);
            updateFilteredCategories(text);
          }}
          style={styles.inputText}
        />
      </View>
      <View style={styles.border} />
      {loaded ? null : <ActivityLoader />}
  
      <FlatList
        data={[
          ...filteredCategories.filter(item =>
            ExerciseIds.includes(item.exercise_id),
          ),
          ...filteredCategories.filter(
            item => !ExerciseIds.includes(item.exercise_id),
          ),
        ]}
        showsVerticalScrollIndicator={false}
        style={{
          marginBottom: DeviceHeigth * 0.02,
        }}
        renderItem={({item, index}) => (
        
          <View key={index}>
  
            <TouchableOpacity
              style={styles.button}
              disabled={
                tempList.length == dayExercises.length &&
                !ExerciseIds.includes(item.exercise_id)
                  ? true
                  : false
              }
              onPress={() => {
                handleItems(item);
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View style={styles.View4}>
                  <Image
                    source={{uri: item?.exercise_image_link}}
                    style={{height: 70, width: 70}}
                    resizeMode="contain"
                    defaultSource={localImage.NOWORKOUT}
                  />
                </View>
                <View style={{marginLeft: 15, width: DeviceWidth * 0.55}}>
                  <View style={{width: 200}}>
                    <Text numberOfLines={1} style={[styles.txt3]}>
                      {item?.exercise_title}
                    </Text>
                  </View>

                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={styles.txt2}>
                      {'Time : ' + item?.exercise_rest}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={{marginRight: 10}}>
                <Image
                  source={
                    ExerciseIds.includes(item.exercise_id)
                      ? localImage.Minus
                      : localImage.Plus
                  }
                  style={{
                    height: 22,
                    width: 22,
                    opacity:
                      tempList.length == dayExercises.length &&
                      !ExerciseIds.includes(item.exercise_id)
                        ? 0.3
                        : 1,
                  }}
                  resizeMode="contain"
                />
              </View>
            </TouchableOpacity>
            {index !==
              (filteredCategories?.length > 0
                ? filteredCategories
                : getAllExercise
              ).length -
                1 && (
              <View
                style={{
                  width: '100%',
                  height: 1,

                  alignItems: 'center',
                  backgroundColor: '#33333314',
                }}
              />
            )}
          </View>
        )}
      />
      <View style={{marginBottom: 20}}>
        <NewButton
          title={'Add'}
          image={localImage.Plus}
          tintColor={AppColor.WHITE}
          Ih={20}
          disabled={
            disabled == true || dayExercises?.length !== tempList?.length
              ? true
              : false
          }
          opacity={
            disabled == true || dayExercises?.length !== tempList?.length
              ? 0.6
              : 1
          }
          onPress={EditExerciseApi}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: AppColor.WHITE,
  },
  View1: {
    width: '90%',
    height: 50,
    alignSelf: 'center',
    backgroundColor: '#F3F5F5',
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
  },
  View4: {
    borderWidth: 1,
    borderColor: AppColor.GRAY1,
    height: 80,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: AppColor.WHITE,
    marginLeft: 8,
  },
  border: {
    height: 0,

    marginVertical: 15,
  },
  inputText: {
    paddingLeft: 15,
    paddingRight: 15,
    width: '90%',
    height: 50,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '600',
    fontFamily: 'Montserrat',
    color: '#000',
  },
  // texts
  txt2: {
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    color: AppColor.BLACK,
    fontSize: 16,
    lineHeight: 30,
  },
  txt3: {
    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
    color: AppColor.BLACK,
    fontSize: 18,
    textAlign: 'left',
  },
  //buttons
  button: {
    marginVertical: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    width: DeviceWidth * 0.9,
    alignSelf: 'center',
    borderRadius: 12,
    justifyContent: 'space-between',
    backgroundColor: AppColor.WHITE,
    // ...Platform.select({
    //   android: {
    //     elevation: 5,
    //     shadowOpacity: 0.1,
    //     shadowColor: 'grey',
    //   },
    //   ios: {
    //     shadowColor: '#000000',
    //     shadowOffset: {width: 0, height: 2},
    //     shadowOpacity: 0.2,
    //     shadowRadius: 4,
    //   },
    // }),
  },
});
export default AddWorkouts;
