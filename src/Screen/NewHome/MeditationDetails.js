import {View, Text, Image, TouchableOpacity} from 'react-native';
import React, { useState } from 'react';
import NewHeader from '../../Component/Headers/NewHeader';
import {StatusBar} from 'react-native';
import {StyleSheet} from 'react-native';
import {AppColor} from '../../Component/Color';
import Icons from 'react-native-vector-icons/FontAwesome5';

import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../Component/Config';
import {useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import {FlatList} from 'react-native';
import {localImage} from '../../Component/Image';
import {showMessage} from 'react-native-flash-message';
import {useFocusEffect} from '@react-navigation/native';
import ActivityLoader from '../../Component/ActivityLoader';
import AnimatedLottieView from 'lottie-react-native';
import axios from 'axios';

const MeditationDetails = ({navigation, route}) => {
  const {customWorkoutData} = useSelector(state => state);
  const [forLoading, setForLoading] = useState(false);
  const [mindsetExercise, setmindsetExercise] = useState([]);

  const colors = [
    {color1: '#E2EFFF', color2: '#9CC2F5', color3: '#425B7B'},
    {color1: '#BFF0F5', color2: '#8DD9EA', color3: '#1F6979'},
    {color1: '#FAE3FF', color2: '#C97FCD', color3: '#7C3D80'},
    {color1: '#FFEBE2', color2: '#DCAF9E', color3: '#1E1E1E'},
  ];
  useFocusEffect(
    React.useCallback(() => {
      if (route?.params?.item) {
     
        getCaterogy(
          route?.params?.item.id,
          route?.params?.item.workout_mindset_level,
        );
      }
    }, []),
  );
  const getCaterogy = async(id, level) => {
    setForLoading(true);
    try {
      const data = await axios(`${NewAppapi.Get_Mindset_Excise}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: {
            workout_mindset_id: id,
            health_level:level
        },
      });
      setForLoading(false);
      console.log("Mindf Set ",data.data)
    //   if (data.data.status == 'data found') {
    //     setForLoading(false);
    //     setproductList(data.data.data);
    //     setFilteredCategories(data.data.data)
    //   } else {
    //     setproductList([]);
     
    //   }
    } catch (error) {
      setForLoading(false);
   
      console.log('Product List Error', error);
    }

  };
  const ListItem = ({title, color}) => (
    <TouchableOpacity
      onPress={() => {
        // navigation.navigate('MeditationDetails',{item:title})
        showMessage({
          message: 'Work in Progress',
          floating: true,
          duration: 500,
          type: 'info',
          icon: {icon: 'auto', position: 'left'},
        });
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
  return (
    <View style={styles.container}>
      <NewHeader
        header={
          route?.params?.item.workout_mindset_title
            ? route?.params?.item.workout_mindset_title
            : 'TEst'
        }
        SearchButton={false}
        backButton={true}
      />
      <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />
      {forLoading ? <ActivityLoader /> : ''}
      <>
        <View
          style={{
            width: '95%',
            alignSelf: 'center',
            // backgroundColor:'red',
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
            keyExtractor={item => item.id}
            // ListEmptyComponent={emptyComponent}
            renderItem={({item, index}) => {
              return (
                <ListItem title={item} color={colors[index % colors.length]} />
              );
            }}
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
          <FlatList
            data={customWorkoutData?.minset_workout}
            showsVerticalScrollIndicator={false}
            keyExtractor={item => item.id}
            // ListEmptyComponent={emptyComponent}

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
                          height: 65,
                          paddingLeft: 5,
                        }}>
                        <View
                          style={{
                            top: -DeviceHeigth * 0.009,
                          }}>
                          <Text
                            style={{
                              color: AppColor.LITELTEXTCOLOR,
                              fontFamily: 'Poppins',
                              fontWeight: '700',
                              lineHeight: 21,
                              fontSize: 14,
                            }}>
                            How to Control Intrusive Thoughts
                          </Text>
                          <Text
                            numberOfLines={3}
                            style={{
                              color: '#191919',
                              fontFamily: 'Poppins',
                              fontWeight: '500',
                              lineHeight: 12,
                              fontSize: 8,
                            }}>
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Nulla convallis libero eget felis lacinia, eu
                            suscipit eros ultrices.
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            top: -DeviceHeigth * 0.009,
                            left: -12,
                          }}>
                          <TouchableOpacity
                            onPress={() => {
                              // navigation.navigate('MeditationDetails',{item:title})
                              showMessage({
                                message: 'Work in Progress',
                                floating: true,
                                duration: 500,
                                type: 'info',
                                icon: {icon: 'auto', position: 'left'},
                              });
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
                            25 Min
                          </Text>
                        </View>
                      </View>
                      <View
                        style={{
                          width: '30%',
                          height: 150,
                          backgroundColor: 'red',
                          left: -10,

                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: 15,
                        }}>
                        <Image
                          source={
                            item.workout_mindset_image_link != null
                              ? {uri: item.workout_mindset_image_link}
                              : localImage.Noimage
                          }
                          style={{
                            height: 120,

                            width: 100,
                          }}
                          resizeMode="contain"></Image>
                      </View>
                    </View>
                  </LinearGradient>
                </>
              );
            }}
          />
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
