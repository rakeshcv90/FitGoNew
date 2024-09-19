import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  ScrollView,
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
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import HTMLRender from 'react-native-render-html';
import {BannerAdd} from '../../Component/BannerAdd';
import {bannerAdId} from '../../Component/AdsId';
import moment from 'moment';
import { ArrowLeft } from '../../Component/Utilities/Arrows/Arrow';

const MealDetails = ({route, navigation}) => {
  const getStoreVideoLoc = useSelector(state => state.getStoreVideoLoc);
  const getPurchaseHistory = useSelector(state => state.getPurchaseHistory);

  const customStyles = {
    fontFamily: 'Poppins',
    fontSize: 10,
    fontWeight: '400',
    color: AppColor.INPUTLABLECOLOR,
  };

  // const bannerAdsDisplay = () => {
  //   if (getPurchaseHistory.length > 0) {
  //     if (
  //       getPurchaseHistory[0]?.plan_end_date >= moment().format('YYYY-MM-DD')
  //     ) {
  //       return null;
  //     } else {
  //       return (
  //         <View style={{marginBottom: DeviceHeigth <= 846 ? -1 : -10}}>
  //           <BannerAdd bannerAdId={bannerAdId} />
  //         </View>
  //       );
  //     }
  //   } else {
  //     return (
  //       <View style={{marginBottom: DeviceHeigth <= 846? -1 : -10}}>
  //         <BannerAdd bannerAdId={bannerAdId} />
  //       </View>
  //     );
  //   }
  // };
  return (
    <>
      <View style={styles.container}>
        <StatusBar
          barStyle={'dark-content'}
          translucent={true}
          backgroundColor={'transparent'}
        />

        <ImageBackground
          translucent={true}
          style={{width: '100%', height: DeviceHeigth * 0.4}}
          resizeMode="cover"
          source={
            route?.params?.item?.diet_image == null
              ? localImage.Noimage
              : {uri: route?.params?.item?.diet_image}
          }
        />
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={{
            position: 'absolute',
            top: DeviceHeigth * 0.05,
            width: 32 * 1.5,
            height: 32,
            // backgroundColor: '#F7F8F8',
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            left: 10,
          }}>
          <ArrowLeft fillColor={AppColor.WHITE} />
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
            {route.params.item.diet_title}
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
                  fontFamily: 'Montserrat-SemiBold',
                  fontSize: 13,
                  fontWeight: '500',
                  color: AppColor.BLACK,
                  marginHorizontal: 2,
                  opacity: 0.7,
                }}>
                {route.params.item.diet_calories} kcal
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
                  fontFamily: 'Montserrat-SemiBold',
                  fontSize: 13,
                  fontWeight: '500',
                  color: AppColor.BLACK,
                  marginHorizontal: 5,
                  opacity: 0.7,
                }}>
                {route.params.item.diet_time}
              </Text>
            </View>
          </View>
          <View style={{marginVertical: -DeviceHeigth * 0.01}}>
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
                <Text style={styles.textStyle2}>
                  {route.params.item.diet_protein}
                </Text>
                <Text style={styles.textStyle}>Protein</Text>
              </View>
              <View>
                <Text style={styles.textStyle2}>
                  {route.params.item.diet_carbs}
                </Text>
                <Text style={styles.textStyle}>Carbs</Text>
              </View>
              <View>
                <Text style={styles.textStyle2}>
                  {route.params.item.diet_fat}
                </Text>
                <Text style={styles.textStyle}>Fat</Text>
              </View>
            </View>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{flexGrow: 1}}>
            <View style={{marginVertical: DeviceHeigth * 0.03}}>
              <View
                style={{
                  width: '95%',
                  alignSelf: 'center',
                  borderRadius: 15,
                  borderWidth: 1,
                  padding: 10,
                  borderColor: 'rgba(80, 80, 80, 0.6)',
                }}>
                <Text
                  style={{
                    fontFamily: 'Poppins',
                    fontSize: 15,
                    fontWeight: '700',
                    color: AppColor.LITELTEXTCOLOR,
                  }}>
                  Summary
                </Text>
                <View style={{top: -10}}>
                  <HTMLRender
                    source={{html: route.params.item.diet_description}}
                    contentWidth={DeviceWidth}
                    tagsStyles={{
                      p: {
                        color: '#3A4750',
                        fontSize: 12,
                        lineHeight: 15,
                        fontFamily: 'Poppins',
                      },
                      strong: {
                        color: '#C8170D',
                        fontSize: 10,
                      },
                      li: {
                        color: '#3A4750',
                      },
                      ul: {
                        color: '#3A4750',
                      },
                      ol: {
                        color: '#3A4750',
                      },
                    }}
                  />
                </View>
              </View>
            </View>
            <View style={{marginVertical: -DeviceHeigth * 0.015}}>
              <View
                style={{
                  width: '95%',
                  alignSelf: 'center',
                  borderRadius: 15,
                  borderWidth: 1,
                  padding: 10,
                  borderColor: 'rgba(80, 80, 80, 0.6)',
                }}>
                <Text
                  style={{
                    fontFamily: 'Poppins',
                    fontSize: 15,
                    fontWeight: '700',
                    color: AppColor.LITELTEXTCOLOR,
                  }}>
                  Ingredients
                </Text>
                <View style={{top: -10}}>
                  <HTMLRender
                    source={{html: route.params.item.diet_ingredients}}
                    contentWidth={DeviceWidth}
                    tagsStyles={{
                      p: {
                        color: '#3A4750',
                        fontSize: 12,
                        lineHeight: 15,
                        fontFamily: 'Poppins',
                      },
                      strong: {
                        color: '#C8170D',
                        fontSize: 10,
                      },
                      li: {
                        color: '#3A4750',
                      },
                      ul: {
                        color: '#3A4750',
                      },
                      ol: {
                        color: '#3A4750',
                      },
                    }}
                  />
                </View>
              </View>
            </View>
            <View
              style={{
                marginVertical: DeviceHeigth * 0.032,
                marginBottom: DeviceHeigth * 0.45,
              }}>
              <View
                style={{
                  width: '95%',
                  alignSelf: 'center',
                  borderRadius: 15,
                  borderWidth: 1,
                  padding: 10,
                  borderColor: 'rgba(80, 80, 80, 0.6)',
                }}>
                <Text
                  style={{
                    fontFamily: 'Poppins',
                    fontSize: 15,
                    fontWeight: '700',
                    color: AppColor.LITELTEXTCOLOR,
                  }}>
                  Instructions
                </Text>

                <View style={{top: -10}}>
                  <HTMLRender
                    source={{html: route.params.item.diet_direction}}
                    contentWidth={DeviceWidth}
                    tagsStyles={{
                      p: {
                        color: '#3A4750',
                        fontSize: 12,
                        lineHeight: 15,
                        fontFamily: 'Poppins',
                      },
                      strong: {
                        color: '#C8170D',
                        fontSize: 10,
                      },
                      li: {
                        color: '#3A4750',
                      },
                      ul: {
                        color: '#3A4750',
                      },
                      ol: {
                        color: '#3A4750',
                      },
                    }}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        </View>

        
      </View>
      {/* {bannerAdsDisplay()} */}
          <View style={{marginBottom: DeviceHeigth <= 846 ? -1 : -10}}>
            <BannerAdd bannerAdId={bannerAdId} />
          </View>
    </>
  );
};
var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColor.WHITE,
  },
  textStyle: {
    fontFamily: 'Montserrat-SemiBold',
    fontWeight: '500',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 15,
    top: 5,
    color: AppColor.BLACK,
  },
  textStyle2: {
    fontFamily: 'Montserrat-SemiBold',
    fontWeight: '400',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    color: AppColor.BLACK,
  },
});
export default MealDetails;
