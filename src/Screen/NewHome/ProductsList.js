import { View, Text, StyleSheet, TextInput } from 'react-native'
import React, { useState } from 'react'
import NewHeader from '../../Component/Headers/NewHeader'
import { StatusBar } from 'react-native'
import { AppColor } from '../../Component/Color'
import { DeviceHeigth } from '../../Component/Config'
import {SliderBox} from 'react-native-image-slider-box';
import FastImage from 'react-native-fast-image';
import Icons from 'react-native-vector-icons/FontAwesome5';

const ProductsList = ({route}) => {
    const [searchText, setsearchText] = useState();
    const data = [
        require('../../Icon/Images/product_1631791758.jpg'),
        require('../../Icon/Images/product_1631792207.jpg'),
        require('../../Icon/Images/product_1631791758.jpg'),
        require('../../Icon/Images/product_1631811803.jpg'),
        require('../../Icon/Images/product_1631468947.jpg'),
        require('../../Icon/Images/recipe_1519697004.jpg'),
        require('../../Icon/Images/product_1631791758.jpg'),
      ];
  return (
    <View style={styles.container}>
    <NewHeader header={route.params.item.type_title} SearchButton={false} backButton={true} />
    <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />
    <View
        style={{
          width: '95%',
          height: 50,
          alignSelf: 'center',
          backgroundColor: '#FCFCFC',
          borderRadius: 6,
          flexDirection: 'row',
          alignItems: 'center',
          paddingLeft: 10,
          top: -DeviceHeigth * 0.02,
          shadowColor: 'rgba(0, 0, 0, 1)',
          ...Platform.select({
            ios: {
              shadowColor: '#000000',
              shadowOffset: {width: 0, height: 2},
              shadowOpacity: 0.1,
              shadowRadius: 4,
            },
            android: {
              elevation: 5,
            },
          }),
        }}>
        <Icons name="search" size={25} color={'rgba(80, 80, 80, 0.6)'} />
        <TextInput
          placeholder="Search Products"
          placeholderTextColor={'rgba(80, 80, 80, 0.6)'}
          value={searchText}
          onChangeText={text => {
            setsearchText(text);
          }}
          style={styles.inputText}
        />
      </View>

      <View
        style={{
          width: '95%',
          height: 150,
          borderRadius: 10,

          alignSelf: 'center',
          alignItems: 'center',
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
    </View>
  )
}
var styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: AppColor.WHITE,
    },
    inputText: {
      paddingLeft: 15,
      paddingRight: 15,
      width: '90%',
      height: 50,
      fontSize: 12,
      lineHeight: 18,
      fontWeight: '600',
      fontFamily: 'Poppins',
      color: 'rgba(80, 80, 80, 0.6)',
    },
    listItem2: {
      marginHorizontal: 5,
      top: 10,
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
export default ProductsList