import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import NewHeader from '../../Component/Headers/NewHeader';
import {StatusBar} from 'react-native';
import {AppColor} from '../../Component/Color';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../Component/Config';
import {SliderBox} from 'react-native-image-slider-box';
import FastImage from 'react-native-fast-image';
import Icons from 'react-native-vector-icons/FontAwesome5';
import {FlatList} from 'react-native';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import axios from 'axios';
import ActivityLoader from '../../Component/ActivityLoader';
import {localImage} from '../../Component/Image';
import AnimatedLottieView from 'lottie-react-native';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const ProductsList = ({route}) => {
  const [searchText, setsearchText] = useState();
  const [productList, setproductList] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [forLoading, setForLoading] = useState(true);
  const avatarRef = React.createRef();
  let isFocuse = useIsFocused();
  useEffect(() => {
    if (isFocuse) {
      if (route.params.item) {
        getCaterogy(route.params.item.type_id);
      }
    }
  }, [isFocuse]);
  const data = [
    require('../../Icon/Images/product_1631791758.jpg'),
    require('../../Icon/Images/product_1631792207.jpg'),
    require('../../Icon/Images/product_1631791758.jpg'),
    require('../../Icon/Images/product_1631811803.jpg'),
    require('../../Icon/Images/product_1631468947.jpg'),

    require('../../Icon/Images/product_1631791758.jpg'),
  ];

  const getCaterogy = async type => {
    try {
      const data = await axios(`${NewAppapi.Get_Product_List}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: {
          type_id: type,
        },
      });
      setForLoading(false);
      if (data.data.status == 'data found') {
        setForLoading(false);
        setproductList(data.data.data);
        setFilteredCategories(data.data.data);
      } else {
        setproductList([]);
        setForLoading(false);
      }
    } catch (error) {
      setForLoading(false);
      setproductList([]);
      console.log('Product List Error', error);
    }
  };
  const emptyComponent = () => {
    return (
      <View
        style={{
          flex: 1,
        }}>
        <AnimatedLottieView
          source={require('../../Icon/Images/NewImage/NoData.json')}
          speed={2}
          autoPlay
          loop
          resizeMode="cover"
          style={{
            width: DeviceWidth * 0.6,
            height: DeviceHeigth * 0.3,
          }}
        />
      </View>
    );
  };
  const updateFilteredCategories = test => {
    const filteredItems = productList.filter(item =>
      item.product_title.toLowerCase().includes(test.toLowerCase()),
    );

    setFilteredCategories(filteredItems);
  };
  return (
    <View style={styles.container}>
      <NewHeader
        header={route.params.item.type_title}
        SearchButton={false}
        backButton={true}
      />
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
            updateFilteredCategories(text);
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
      <View
        style={{
          width: '95%',
          borderRadius: 10,
          alignSelf: 'center',
          alignItems: 'center',
          top: 20,
        }}>
        <Text
          style={{
            fontSize: 15,
            fontFamily: 'Poppins',
            fontWeight: '700',
            lineHeight: 21,
            marginBottom: 0,
          }}>
          Our Products
        </Text>
        <View
          style={{
            alignSelf: 'center',

            paddingBottom:
              Platform.OS == 'android'
                ? 40
                : DeviceHeigth <= 667
                ? DeviceHeigth * 0.15
                : 15,
          }}>
          {forLoading ? (
            <FlatList
              data={[1, 2, 3, 4, 5, 6]}
              numColumns={3}
              showsVerticalScrollIndicator={false}
              renderItem={({item, index}) => {
                return (
                  <>
                    <TouchableOpacity style={styles.listItem2}>
                      <ShimmerPlaceholder
                        ref={avatarRef}
                        autoRun
                        style={{
                          height: 90,
                          width: 90,
                          borderRadius: 180 / 2,
                          alignSelf: 'center',
                        }}
                      />

                      <View style={{width: 90, paddingBottom: 10}}>
                        <ShimmerPlaceholder
                          ref={avatarRef}
                          autoRun
                          style={{
                            width: 80,
                            top: 10,
                            alignSelf: 'center',
                          }}
                        />
                      </View>
                    </TouchableOpacity>
                  </>
                );
              }}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              updateCellsBatchingPeriod={100}
              removeClippedSubviews={true}
              keyExtractor={(item, index) => index.toString()}
            />
          ) : (
            <FlatList
              data={filteredCategories}
              numColumns={3}
              showsVerticalScrollIndicator={false}
              renderItem={({item, index}) => {
                return (
                  <>
                    <TouchableOpacity
                      style={styles.listItem2}
                      onPress={() => {
                        Linking.openURL(item.product_link);
                      }}>
                      <Image
                        source={
                          item.product_image_link == null
                            ? localImage.Noimage
                            : {uri: item.product_image_link}
                        }
                        style={{
                          height: 90,
                          width: 90,
                          // borderRadius: 180 / 2,
                          alignSelf: 'center',
                        }}
                        resizeMode="contain"></Image>
                      <View style={{width: 90}}>
                        <Text
                          numberOfLines={1}
                          style={{
                            fontSize: 12,
                            fontWeight: '500',
                            lineHeight: 18,
                            fontFamily: 'Poppins',
                            textAlign: 'center',
                            color: AppColor.BoldText,
                          }}>
                          {item.product_title}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </>
                );
              }}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              updateCellsBatchingPeriod={100}
              removeClippedSubviews={true}
              ListEmptyComponent={emptyComponent}
              keyExtractor={(item, index) => index.toString()}
            />
          )}
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
  inputText: {
    paddingLeft: 15,
    paddingRight: 15,
    width: '90%',
    height: 50,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '600',
    fontFamily: 'Poppins',
    color: AppColor.BLACK,
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
export default ProductsList;
