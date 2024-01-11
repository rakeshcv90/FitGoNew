import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  ScrollView,
  FlatList,
} from 'react-native';
import React, {useEffect} from 'react';
import {AppColor} from '../../Component/Color';

import {StatusBar} from 'react-native';
import {StyleSheet} from 'react-native';
import NewHeader from '../../Component/Headers/NewHeader2';
import {SliderBox} from 'react-native-image-slider-box';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import {localImage} from '../../Component/Image';
import {Image} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import Button from '../../Component/Button';
import {useSelector} from 'react-redux';
import * as RNIap from 'react-native-iap';

const Subscription = () => {
  const {getInAppPurchase} = useSelector(state => state);

  const data = [
    require('../../Icon/Images/product_1631791758.jpg'),
    require('../../Icon/Images/product_1631792207.jpg'),
    require('../../Icon/Images/product_1631791758.jpg'),
    require('../../Icon/Images/product_1631811803.jpg'),
    require('../../Icon/Images/product_1631468947.jpg'),
    require('../../Icon/Images/recipe_1519697004.jpg'),
    require('../../Icon/Images/product_1631791758.jpg'),
  ];
  const purchaseItems = async items => {
    try {
      const purchase = await RNIap.requestSubscription({
        sku: items.productId,
      });

      fetchPurchaseHistory(purchase.productId);
    } catch (error) {
      console.log('Failed to purchase ios product', error);
    }
  };
  const fetchPurchaseHistory = data => {
    console.log("AAAAAAAAAAAAAAAAAA",data)
  };
  return (
    <View style={styles.container}>
      <NewHeader
        header={'Fitness Coach'}
        backButton={true}
        onPress={() => {
          console.log('Hebhcdfefdffdsfdsf');
        }}
      />
      <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />
      <View
        style={{
          width: '95%',
          height: 150,
          borderRadius: 10,
          alignSelf: 'center',
          alignItems: 'center',
          top: -20,
        }}>
        <SliderBox
          ImageComponent={FastImage}
          images={data}
          sliderBoxHeight={150}
          onCurrentImagePressed={index =>
            console.warn(`image ${index} pressed`)
          }
          dotColor="#FFEE58"
          inactiveDotColor="#90A4AE"
          paginationBoxVerticalPadding={20}
          autoplay
          circleLoop
          resizeMethod={'resize'}
          resizeMode={'cover'}
          paginationBoxStyle={{
            position: 'absolute',
            bottom: 0,
            padding: 0,
            alignItems: 'center',
            alignSelf: 'center',
            justifyContent: 'center',
            paddingVertical: 10,
          }}
          dotStyle={{
            width: 10,
            height: 10,
            borderRadius: 5,
            marginHorizontal: 0,
            padding: 0,
            margin: 0,
            backgroundColor: 'rgba(128, 128, 128, 0.92)',
          }}
          ImageComponentStyle={{borderRadius: 15, width: '95%'}}
          imageLoadingColor="#2196F3"
        />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} style={{marginTop: 0}}>
        <LinearGradient
          start={{x: 0, y: 1}}
          end={{x: 1, y: 0}}
          colors={['#E3FDF5', '#FFE6FAB5']}
          style={{
            width: '95%',
            top: -20,
            borderRadius: 10,
            marginVertical: DeviceHeigth * 0.02,
            padding: 5,
            alignSelf: 'center',
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              source={localImage.Tick2}
              style={{
                height: 40,
                width: 40,
              }}
              resizeMode="contain"></Image>
            <Text
              style={{
                textAlign: 'center',
                marginLeft: 10,
                fontWeight: '500',
                fontSize: 18,
                lineHeight: 24,
                fontFamily: 'Poppins',
                color: '#ED4530',
              }}>
              100+
              <Text
                style={{
                  textAlign: 'center',
                  marginLeft: 10,
                  fontWeight: '500',
                  fontSize: 18,
                  lineHeight: 24,
                  fontFamily: 'Poppins',
                  color: '#1E1E1E',
                }}>
                {''} Workout Plans
              </Text>
            </Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              source={localImage.Tick2}
              style={{
                height: 40,
                width: 40,
              }}
              resizeMode="contain"></Image>

            <Text
              style={{
                textAlign: 'center',
                marginLeft: 10,
                fontWeight: '500',
                fontSize: 18,
                lineHeight: 24,
                fontFamily: 'Poppins',
                color: '#1E1E1E',
              }}>
              {''} No Advertisement
            </Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              source={localImage.Tick2}
              style={{
                height: 40,
                width: 40,
              }}
              resizeMode="contain"></Image>

            <Text
              style={{
                textAlign: 'center',
                marginLeft: 10,
                fontWeight: '500',
                fontSize: 18,
                lineHeight: 24,
                fontFamily: 'Poppins',
                color: '#1E1E1E',
              }}>
              {''} No Advertisement
            </Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              source={localImage.Tick2}
              style={{
                height: 40,
                width: 40,
              }}
              resizeMode="contain"></Image>

            <Text
              style={{
                textAlign: 'center',
                marginLeft: 10,
                fontWeight: '500',
                fontSize: 18,
                lineHeight: 24,
                fontFamily: 'Poppins',
                color: '#1E1E1E',
              }}>
              {''} Access to backup feature
            </Text>
          </View>
        </LinearGradient>
        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'center',
            width: '95%',
            paddingLeft: 5,
            paddingRight: 5,
            top: -20,
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              textAlign: 'center',
              fontWeight: '500',
              fontSize: 12,
              lineHeight: 18,
              fontFamily: 'Poppins',
              color: '#1E1E1E',
            }}>
            Subscription Plans
          </Text>
          <TouchableOpacity
            onPress={() => {
              showMessage({
                message: 'Work in Progress',
                floating: true,
                duration: 500,
                type: 'info',
                icon: {icon: 'auto', position: 'left'},
              });
            }}>
            <Text
              style={{
                textAlign: 'center',
                fontWeight: '500',
                fontSize: 12,
                lineHeight: 18,
                fontFamily: 'Poppins',
                color: '#1E1E1E',
                textDecorationLine: 'underline',
              }}>
              Restore purchase
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{marginBottom: DeviceHeigth * 0.1}}>
          <FlatList
            data={getInAppPurchase}
            scrollEnabled={false}
            extraData={({item, index}) => index.toString()}
            renderItem={({item, index}) => {
              return (
                <>
                  <TouchableOpacity
                    style={styles.button}
                    activeOpacity={0.5}
                    onPress={() => {
                      purchaseItems(item);
                    }}>
                    <Text
                      style={{
                        fontWeight: '600',
                        fontSize: 15,
                        lineHeight: 20,
                        color: '#272727',
                      }}>
                      {item.title}
                    </Text>

                    <Text
                      style={{
                        fontWeight: '500',
                        fontSize: 20,
                        lineHeight: 24,
                        top: 5,
                        color: '#D5191A',
                      }}>
                      ₹ {item.price}
                      <Text
                        style={{
                          fontWeight: '500',
                          fontSize: 18,
                          lineHeight: 24,
                          color: '#000000',
                        }}>
                        {' '}
                        / {item.title}
                      </Text>
                    </Text>
                  </TouchableOpacity>
                </>
              );
            }}
          />
        </View>
      </ScrollView>
      <View style={{bottom: 18, alignSelf: 'center', position: 'absolute'}}>
        <Button buttonText={'Proceed'} />
      </View>
    </View>
  );
};
var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColor.WHITE,
  },
  button: {
    width: DeviceWidth * 0.9,
    height: DeviceHeigth * 0.1,
    marginVertical: DeviceHeigth * 0.005,
    borderRadius: 16,
    alignSelf: 'center',
    backgroundColor: AppColor.WHITE,
    paddingLeft: 30,
    paddingTop: 15,
    borderWidth: 1,

    ...Platform.select({
      ios: {
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
export default Subscription;
