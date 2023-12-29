import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  FlatList,
  Platform,
  StatusBar,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import NewHeader from '../../Component/Headers/NewHeader';
import {AppColor} from '../../Component/Color';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import {Image} from 'react-native';
import {localImage} from '../../Component/Image';
import {useSelector} from 'react-redux';

const Meals = ({navigation}) => {

  const [selectedMeal, setSelectedMeal] = useState(null);
  const {mealData} = useSelector(state => state);
  useEffect(() => {
    if (mealData.length > 0) {
      generateRandomNumber();
    }
  });

  generateRandomNumber = () => {
    const min = 1;
    const max = mealData.length;
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    const filteredMeals = mealData.filter(
      item => item.category_id === randomNumber,
    );
    if (filteredMeals.length > 0) {
      setSelectedMeal(filteredMeals[0]);
    }
  };
  return (
    <View style={styles.container}>
      <NewHeader header={'Meals'} SearchButton={false} backButton={true} />
      <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />
      <View
        style={{
          width: '95%',
          alignSelf: 'center',
          top: -DeviceHeigth * 0.02,
        }}>
        <Text
          style={{
            color: AppColor.BoldText,
            fontFamily: 'Poppins',
            fontWeight: '700',
            lineHeight: 24,
            fontSize: 16,
            marginLeft:20,
            justifyContent: 'flex-start',
          }}>
          Top diet recipes
        </Text>
      </View>
      {selectedMeal && (
        <>
        
          <View style={styles.meditionBox}>
            <Image
              style={{width: '100%', height: '100%', borderRadius: 15,}}
              resizeMode="cover"
              source={{uri: selectedMeal.category_image}}></Image>
          </View>
          <View
            style={{
              width: '95%',
              alignSelf: 'center',
              top: DeviceHeigth * 0.02,
            }}>
            <Text
              style={{
                color: AppColor.BoldText,
                fontFamily: 'Poppins',
                fontWeight: '700',
                lineHeight: 24,
                fontSize: 16,
                marginLeft:20,
            
                justifyContent: 'flex-start',
              }}>
              {selectedMeal.category_title}
            </Text>
          </View>
        </>
      )}

      <View
        style={{
          flexDirection: 'row',
          top: DeviceHeigth * 0.03,
          width: '86%',
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
              marginHorizontal: 5,
            }}>
            135 kcal
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginHorizontal: DeviceWidth * 0.07,
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
      <View
        style={{
          width: '95%',
          alignSelf: 'center',
          top: DeviceHeigth * 0.07,
        }}>
        <Text
          style={{
            color: AppColor.BoldText,
            fontFamily: 'Poppins',
            fontWeight: '700',
            lineHeight: 24,
            fontSize: 16,
             marginLeft:20,
            justifyContent: 'flex-start',
          }}>
          Categories
        </Text>
      </View>
      <View
        style={{
          top: DeviceHeigth * 0.085,
          alignSelf: 'center',
          height: DeviceHeigth * 0.4,
          paddingBottom: Platform.OS == 'android' ? 30 : 0,
         
        }}>
        <FlatList
          data={mealData}
          numColumns={3}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.id}
          renderItem={({item, index}) => {
            return (
              <>
                <TouchableOpacity style={styles.listItem2}
                onPress={()=>{
                  navigation.navigate('MealDetails',{item:item})
                }}>
                  <Image
                    source={{uri: item.category_image}}
                    style={{
                      height: 60,
                      width: 60,

                      alignSelf: 'center',
                    }}
                    resizeMode="contain"></Image>
                  <Text
                    style={[
                      styles.title,
                      {
                        fontSize: 12,
                        fontWeight: '500',
                        lineHeight: 18,
                        fontFamily: 'Poppins',
                        textAlign: 'center',
                        color: AppColor.BoldText,
                      },
                    ]}>
                    {item.category_title}
                  </Text>
                </TouchableOpacity>
              </>
            );
          }}
        />
      </View>
    </View>
  );
};
var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColor.WHITE,
  },
  meditionBox: {
    width: '86%',
    height: DeviceHeigth * 0.20,
    borderRadius: 15,
    alignSelf: 'center',
    alignItems: 'center',
  },
  listItem2: {
    width: DeviceWidth * 0.25,
    // height: DeviceWidth * 0.25,
    marginHorizontal: 10,
    top:10,
    borderRadius: 10,
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
    backgroundColor: AppColor.WHITE,
    marginBottom: 20,
    shadowColor: 'rgba(0, 0, 0, 1)',
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
});
export default Meals;
