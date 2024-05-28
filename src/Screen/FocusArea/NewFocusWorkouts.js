import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {AppColor, Fonts} from '../../Component/Color';
import {useSelector, useDispatch} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import {BannerAdd} from '../../Component/BannerAdd';
import {bannerAdId} from '../../Component/AdsId';
import NativeAddTest from '../../Component/NativeAddTest';
import DietPlanHeader from '../../Component/Headers/DietPlanHeader';
import RBSheet from 'react-native-raw-bottom-sheet';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import Icons from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/Entypo';
import Iconss from 'react-native-vector-icons/FontAwesome5';
import FastImage from 'react-native-fast-image';
import {localImage} from '../../Component/Image';
import Button from '../../Component/Button';

const NewFocusWorkouts = ({route, navigation}) => {
  const getUserDataDetails = useSelector(state => state.getUserDataDetails);
  const getPurchaseHistory = useSelector(state => state.getPurchaseHistory);
  const exerciseData = route?.params?.focusExercises;
  const isFocused = useIsFocused();

  const [searchQuery, setSearchQuery] = useState('');
  const refStandard = useRef();

  const [filterList, setFilterList] = useState(exerciseData);
  const uperBody = [
    {
      id: 1,
      title: 'Chest',
      ima: require('../../Icon/Images/NewImage2/chest.png'),
    },
    {
      id: 2,
      title: 'Back',
      ima: require('../../Icon/Images/NewImage2/back.png'),
    },
    {
      id: 3,
      title: 'Shoulder',
      ima: require('../../Icon/Images/NewImage2/shoulder.png'),
    },
    {
      id: 4,
      title: 'Arms',
      ima: require('../../Icon/Images/NewImage2/arms.png'),
    },
  ];
  const lowerBody = [
    {
      id: 1,
      title: 'Legs',
      ima: require('../../Icon/Images/NewImage2/calves.png'),
    },
    {
      id: 2,
      title: 'Quads',
      ima: require('../../Icon/Images/NewImage2/quards.png'),
    },
    {
      id: 3,
      title: 'Calves',
      ima: require('../../Icon/Images/NewImage2/calves.png'),
    },
  ];
  const core = [
    {
      id: 1,
      title: 'Abs',
      ima: require('../../Icon/Images/NewImage2/core.png'),
    },
    {
      id: 2,
      title: 'Cardio',
      ima: require('../../Icon/Images/NewImage2/Cardio.png'),
    },
  ];
  useEffect(() => {
    if (route?.params?.focusedPart == 'Upper Body') {
      refStandard.current.open();
    } else if (route?.params?.focusedPart == 'Lower Body') {
      refStandard.current.open();
    } else if (route?.params?.focusedPart == 'Core') {
      refStandard.current.open();
    } else {
      refStandard.current.close();
    }
  }, []);
  const updateFilteredCategories = test => {
    const filteredItems = workoutList.filter(item =>
      item.exercise_title.toLowerCase().includes(test.toLowerCase()),
    );
    setFilteredCategories(filteredItems);
  };
  const bannerAdsDisplay = () => {
    if (getPurchaseHistory.length > 0) {
      if (
        getPurchaseHistory[0]?.plan_end_date >= moment().format('YYYY-MM-DD')
      ) {
        return null;
      } else {
        return <BannerAdd bannerAdId={bannerAdId} />;
      }
    } else {
      return <BannerAdd bannerAdId={bannerAdId} />;
    }
  };
  const getAdsDisplay = (item, index) => {
    if (execrise.length >= 1) {
      if (index == 0 && execrise.length > 1) {
        return getNativeAdsDisplay();
      } else if ((index + 1) % 8 == 0 && execrise.length > 8) {
        return getNativeAdsDisplay();
      }
    }
  };
  const getNativeAdsDisplay = () => {
    if (getPurchaseHistory.length > 0) {
      if (
        getPurchaseHistory[0]?.plan_end_date >= moment().format('YYYY-MM-DD')
      ) {
        return null;
      } else {
        return (
          <View
            style={{
              alignSelf: 'center',
              alignItems: 'center',
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
          }}>
          <NativeAddTest type="image" media={false} />
        </View>
      );
    }
  };
  const BottomSheet = () => {
    return (
      <>
        <RBSheet
          ref={refStandard}
          // draggable
          customModalProps={{
            animationType: 'slide',
            statusBarTranslucent: true,
          }}
          customStyles={{
            container: {
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
               height: DeviceHeigth * 0.55,
            },
            draggableIcon: {
              width: 80,
            },
          }}>
          <View style={styles.listContainer}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                // top: -10,
              }}>
              <View />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  lineHeight: 24,
                  fontFamily: Fonts.MONTSERRAT_BOLD,
                  color: '#1E1E1E',
                  marginLeft: DeviceWidth * 0.06,
                }}>
                Filter
              </Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  refStandard.current.close();
                }}>
                <Icons name={'close'} size={25} color={AppColor.BLACK} />
              </TouchableOpacity>
            </View>
            <View
              style={{
                width: DeviceWidth,
                height: 1,
                backgroundColor: '#1E1E1E',
                opacity: 0.2,
                marginVertical: 16,
                alignSelf: 'center',
              }}
            />
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                lineHeight: 24,
                fontFamily: Fonts.MONTSERRAT_BOLD,
                color: '#1E1E1E',
              }}>
              Upper Body
            </Text>
            <View
              style={{
                //height: DeviceHeigth * 0.35,
                marginTop: 20,
                justifyContent: 'center',
              }}>
              <FlatList
                data={
                  route?.params?.focusedPart == 'Upper Body'
                    ? uperBody
                    : route?.params?.focusedPart == 'Lower Body'
                    ? lowerBody
                    : route?.params?.focusedPart == 'Core'
                    ? core
                    : []
                }
                numColumns={2}
                // contentContainerStyle={{paddingBottom: DeviceHeigth * 0.0}}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item, index}) => {
                  return (
                    <>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => {}}
                        style={{
                          marginHorizontal: 10,
                          width: 172,
                          height: 124,
                          justifyContent: 'space-between',
                          marginBottom: 20,
                          alignSelf: 'center',
                          backgroundColor: '#F9F9F9',
                          flexDirection: 'row',
                          borderRadius: 10,
                        }}>
                        <View
                          style={{
                            width: 25,
                            height: 25,

                            top: 15,
                            left: 10,
                          }}
                        />
                        <View
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Image
                            source={item.ima}
                            // onLoad={() => setImageLoad(false)}
                            style={{
                              width: 50,
                              height: 60,
                              justifyContent: 'center',
                              alignSelf: 'center',
                            }}
                            resizeMode="contain"
                          />
                          <Text
                            style={{
                              color: 'black',
                              fontSize: 15,
                              fontWeight: '600',
                              lineHeight: 20,
                              marginVertical: 5,
                              textAlign: 'center',
                              fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                            }}>
                            {item.title}
                          </Text>
                          <Text
                            style={{
                              color: '#333333CC',
                              fontSize: 14,
                              fontWeight: '500',
                              lineHeight: 20,

                              textAlign: 'center',
                              fontFamily: Fonts.MONTSERRAT_MEDIUM,
                            }}>
                            Exercise x8
                          </Text>
                        </View>
                        <View
                          style={{
                            width: 25,
                            height: 25,

                            top: 15,
                            left: 0,
                            borderWidth: 3,
                            opacity: 0.2,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderColor: '#333333',
                            borderRadius: 30 / 2,
                            // backgroundColor: '#A93737',
                          }}>
                          <Icon
                            name={'check'}
                            size={15}
                            color={AppColor.BLACK}
                          />
                        </View>
                        <View />
                      </TouchableOpacity>
                    </>
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
                width: DeviceWidth,
                height: 1,
                backgroundColor: '#1E1E1E',
                opacity: 0.2,
                marginVertical: 10,
                alignSelf: 'center',
              }}
            />
            <TouchableOpacity
              style={{
                width: 150,
                height: 50,
                backgroundColor: '#A93737',
                borderRadius: 6,
                alignSelf: 'flex-end',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: '#FFFFFF',
                  fontSize: 14,
                  fontWeight: '500',
                  lineHeight: 20,

                  textAlign: 'center',
                  fontFamily: Fonts.MONTSERRAT_MEDIUM,
                }}>
                Show Result
              </Text>
            </TouchableOpacity>
          </View>
        </RBSheet>
      </>
    );
  };
  return (
    <>
      <View style={styles.container}>
        <DietPlanHeader
          header={route?.params?.focusedPart}
          SearchButton={true}
          backButton={true}
          // backPressCheck={true}
          // onPress={()=>{

          // }}
          onPressImage={() => {
            if (route?.params?.focusedPart == 'Upper Body') {
              refStandard.current.open();
            } else if (route?.params?.focusedPart == 'Lower Body') {
              refStandard.current.open();
            } else if (route?.params?.focusedPart == 'Core') {
              refStandard.current.open();
            } else {
              refStandard.current.close();
            }
          }}
          source={require('../../Icon/Images/NewImage2/filter.png')}
        />
        <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />
        <View
          style={{
            width: '95%',
            height: 50,
            alignSelf: 'center',
            backgroundColor: '#F3F5F5',
            borderRadius: 6,
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: 10,
            top: -10,
          }}>
          <Iconss name="search" size={18} color={'#333333E5'} />
          <TextInput
            placeholder="Search Exercise"
            placeholderTextColor={'rgba(80, 80, 80, 0.6)'}
            value={searchQuery}
            onChangeText={text => {
              setSearchQuery(text);
              updateFilteredCategories(text);
            }}
            style={styles.inputText}
          />
        </View>
        <View>
          <FlatList
            data={filterList}
            contentContainerStyle={{paddingBottom: DeviceHeigth * 0.25}}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) => {
              return (
                <>
                  <TouchableOpacity
                    style={{
                      width: '100%',
                      marginVertical: 10,
                      paddingHorizontal: 20,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <FastImage
                      fallback={true}
                      style={{
                        width: 75,
                        height: 75,
                        justifyContent: 'center',
                        alignSelf: 'center',
                        borderRadius: 5,
                        borderWidth: 1,
                        borderColor: '#D9D9D9',
                      }}
                      source={{
                        uri: item?.exercise_image_link,
                        headers: {Authorization: 'someAuthToken'},
                        priority: FastImage.priority.high,
                      }}
                      resizeMode={FastImage.resizeMode.contain}
                      defaultSource={localImage.NOWORKOUT}
                    />
                    <View
                      style={{marginHorizontal: 16, width: DeviceWidth * 0.48}}>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: 16,
                          fontWeight: '600',
                          lineHeight: 24,
                          fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                          color: '#1E1E1E',
                        }}>
                        {item?.exercise_title}
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: '400',
                          lineHeight: 24,
                          opacity: 0.7,
                          fontFamily: Fonts.MONTSERRAT_MEDIUM,
                          color: '#1E1E1E',
                        }}>
                        {item?.exercise_rest}
                      </Text>
                    </View>
                    <TouchableOpacity style={{alignSelf: 'center', right: -20}}>
                      <Icons
                        name={'playcircleo'}
                        size={25}
                        opacity={0.6}
                        color={'#333333'}
                      />
                    </TouchableOpacity>
                  </TouchableOpacity>
                  {index !== exerciseData.length - 1 && (
                    <View
                      style={{
                        width: '100%',
                        height: 1,

                        alignItems: 'center',
                        backgroundColor: '#33333314',
                      }}
                    />
                  )}
                </>
              );
            }}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            updateCellsBatchingPeriod={100}
            removeClippedSubviews={true}
          />
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {}}
          style={{
            position: 'absolute',
            width: DeviceWidth * 0.91,
            height: 50,
            backgroundColor: '#A93737',
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            bottom: 5,
            borderRadius: 6,
          }}>
          <Text
            style={{
              fontSize: 15,
              fontWeight: '500',
              lineHeight: 20,
              textAlign: 'center',
              fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
              color: '#fff',
            }}>
            Start All
          </Text>
        </TouchableOpacity>
        {/* <Button buttonText={'Login'} /> */}
        <BottomSheet />
      </View>
      {bannerAdsDisplay()}
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
  loader: {
    position: 'absolute',
    justifyContent: 'center',

    backgroundColor: AppColor.GRAY,
    zIndex: 1,
    height: 70,
    width: 70,
    left: 0,
    borderRadius: 5,
  },
  listContainer: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
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
});
export default NewFocusWorkouts;
