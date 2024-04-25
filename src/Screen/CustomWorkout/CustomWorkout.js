import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Modal,
  ActivityIndicator,
  Platform,
} from 'react-native';
import React, {useMemo, useState} from 'react';
import NewHeader from '../../Component/Headers/NewHeader';
import {useSelector, useDispatch} from 'react-redux';
import {TouchableOpacity} from 'react-native';
import {AppColor, Fonts} from '../../Component/Color';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import {localImage} from '../../Component/Image';
import {BlurView} from '@react-native-community/blur';
import {TextInput} from 'react-native-paper';
import {showMessage} from 'react-native-flash-message';

const CustomWorkout = ({navigation}) => {
  const customWorkoutData = useSelector(state => state.customWorkoutData);
  const getExperience=useSelector(state=>state.getExperience)
  const [isCustomWorkout, setIsCustomWorkout] = useState(false);
  const [text, setText] = React.useState('');
  const [isLoading, setIsLoading] = useState(true);

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
                width: '95%',
                borderRadius: 10,
                backgroundColor: 'white',
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
                  //shadowColor: '#000000',
                  shadowOffset: {width: 0, height: 2},
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                },
                android: {
                  elevation: 3,
                },
              }),
                // ...Platform.select({
                //   ios: {
                //     shadowColor: '#000000',
                //     shadowOffset: {width: 0, height: 2},
                //     shadowOpacity: 0.1,
                //     shadowRadius: 4,
                //   },
                //   android: {
                //     elevation: 4,
                //   },
                // }),
              }}
              >
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {isLoading && (
                  <ActivityIndicator
                    style={styles.loader}
                    size="small"
                    color="#0000ff"
                  />
                )}
                <Image
                  // source={{uri: item.workout_image_link}}
                  source={localImage.Noimage}
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
      navigation.navigate('CreateWorkout', {workoutTitle: text});
      setText('');
      setIsCustomWorkout(false);
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
            <Text
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
            </Text>
            <TextInput
              label="Workout Name"
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
    alignSelf: 'center',

    height: 50,
    width: 50,
    borderRadius: 100 / 2,
  },
});
export default CustomWorkout;
