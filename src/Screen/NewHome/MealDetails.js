import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, {useEffect, useState, version} from 'react';
import {SafeAreaView} from 'react-native';
import {AppColor} from '../../Component/Color';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../Component/Config';
import {StatusBar} from 'react-native';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Image} from 'react-native';
import {localImage} from '../../Component/Image';
import {useSelector} from 'react-redux';
import axios from 'axios';
import VersionNumber from 'react-native-version-number';
import ActivityLoader from '../../Component/ActivityLoader';

const MealDetails = ({route, navigation}) => {
  const {getUserDataDetails} = useSelector(state => state);
  const [forLoading, setForLoading] = useState(false);
  const [appVersion, setAppVersion] = useState(0);
  const [dietDetails, setDietDetails] = useState();

  useEffect(() => {
    getMealDetails();
  }, []);
  const getMealDetails = async () => {
    setForLoading(true);
    try {
      const data = await axios(`${NewAppapi.DietDetails}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: {
          login_token: getUserDataDetails.login_token,
          diet_id: route.params.item.category_id,
          user_id: getUserDataDetails.id,
          version: VersionNumber.appVersion,
        },
      });
      console.log("dfdsfdsfdsfdsf",data.data)
      if (data.data.length > 0) {
        setForLoading(false);
        setDietDetails(data.data);
      } else {
        setForLoading(false);
        setDietDetails([]);
      }
    } catch (error) {
      setDietDetails([]);
      setForLoading(false);
      console.log('MealDetails List Error', error);
    }
  };
  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={'dark-content'}
        translucent={true}
        backgroundColor={'transparent'}
      />
      <ImageBackground
        translucent={true}
        style={{width: '100%', height: DeviceHeigth * 0.45}}
        source={{uri: route.params.item.category_image}}
      />
      {forLoading ? <ActivityLoader /> : ''}
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}
        style={{
          position: 'absolute',
          top: DeviceHeigth * 0.05,
          width: 32,
          height: 32,
          backgroundColor: '#F7F8F8',
          borderRadius: 10,
          alignItems: 'center',
          justifyContent: 'center',
          left: 10,
        }}>
        <Icons
          name="chevron-right"
          size={25}
          color={'#000'}
          style={{transform: [{rotateY: '180deg'}]}}
        />
      </TouchableOpacity>
      <View
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#fff',
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
          top: -25,
        }}>
        <Text
          style={{
            color: AppColor.BLACK,
            fontFamily: 'Poppins',
            fontWeight: '700',
            lineHeight: 24,
            fontSize: 20,
            top: 20,
            textAlign: 'center',
          }}>
          {route.params.item.category_title}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            marginVertical: DeviceHeigth * 0.035,
            alignSelf: 'center',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignSelf: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={localImage.Step1}
              style={{width: 20, height: 20}}
              resizeMode="contain"
            />

            <Text
              style={{
                fontFamily: 'Poppins',
                fontSize: 13,
                fontWeight: '500',
                color: AppColor.INPUTLABLECOLOR,
                marginHorizontal: 2,
              }}>
              135 kcal
            </Text>
          </View>
          <View
            style={{
              height: 20,
              width: 2,
              backgroundColor: '#505050',
              marginLeft: 10,
              opacity: 0.7,
            }}></View>
          <View
            style={{
              flexDirection: 'row',
              marginLeft: 10,
              alignSelf: 'center',
              alignSelf: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={localImage.Watch}
              style={{width: 17, height: 17}}
              resizeMode="contain"
            />

            <Text
              style={{
                fontFamily: 'Poppins',
                fontSize: 13,
                fontWeight: '500',
                color: AppColor.INPUTLABLECOLOR,
                marginHorizontal: 5,
              }}>
              30 minl
            </Text>
          </View>
        </View>
        <View style={{marginVertical: -DeviceHeigth * 0.01}}>
          <FlatList
            data={dietDetails}
            showsVerticalScrollIndicator={false}
            keyExtractor={item => item.id}
            renderItem={({item, index}) => {
              console.log('dsfdsfdsxcdfd', item);
              return (
                <>
                  <View
                    style={{
                      width: '100%',
                      // height: DeviceHeigth * 0.075,
                      paddingBottom: 15,
                      paddingTop: 10,
                      backgroundColor: '#F4F4F4',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-evenly',
                    }}>
                    <View>
                      <Text style={styles.textStyle2}>{item.diet_protein}</Text>
                      <Text style={styles.textStyle}>Protein</Text>     
                    </View>
                    <View>
                      <Text style={styles.textStyle2}>{item.diet_carbs}</Text>
                      <Text style={styles.textStyle}>Carbs</Text>
                    </View>
                    <View>
                      <Text style={styles.textStyle2}>{item.diet_fat}</Text>
                      <Text style={styles.textStyle}>Fat</Text>
                    </View>
                  </View>
                </>
              );
            }}
          />
        </View>
      </View>
    </View>
  );
};
var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColor.WHITE,
  },
  textStyle: {
    fontFamily: 'Poppins',
    fontWeight: '500',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 15,
    top: 5,
  },
  textStyle2: {
    fontFamily: 'Poppins',
    fontWeight: '400',
    fontSize: 10,
    textAlign: 'center',
    lineHeight: 13,
  },
});
export default MealDetails;
