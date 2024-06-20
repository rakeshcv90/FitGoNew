import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  ImageBackground,
  Linking,
  SafeAreaView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import NewHeader from '../../Component/Headers/NewHeader';
import {StatusBar} from 'react-native';
import {StyleSheet} from 'react-native';
import {AppColor, Fonts} from '../../Component/Color';
import Icons from 'react-native-vector-icons/FontAwesome5';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../Component/Config';
import {Platform} from 'react-native';
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import {SliderBox} from 'react-native-image-slider-box';
import FastImage from 'react-native-fast-image';
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';
import {localImage} from '../../Component/Image';
import ActivityLoader from '../../Component/ActivityLoader';
import AnimatedLottieView from 'lottie-react-native';

import FlashMessage, {showMessage} from 'react-native-flash-message';
import analytics from '@react-native-firebase/analytics';
import moment from 'moment';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import {setFitmeAdsCount} from '../../Component/ThemeRedux/Actions';
import {BannerAdd} from '../../Component/BannerAdd';
import {bannerAdId} from '../../Component/AdsId';
import App from '../../../App';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const StoreScreen = ({navigation}) => {
  const getUserDataDetails = useSelector(state => state.getUserDataDetails);
  const getStoreData = useSelector(state => state.getStoreData);
  const [listData, setListData] = useState([]);
  const [productsId, setProductsId] = useState(getStoreData[0]?.type_id);
  const [productList, setproductList] = useState([]);
  const [searchText, setsearchText] = useState('');
  const [forLoading, setForLoading] = useState(false);
  const [category, setcategory] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState(getStoreData);
  const getPurchaseHistory = useSelector(state => state.getPurchaseHistory);
  const avatarRef = React.createRef();
  const dispatch = useDispatch();
  useFocusEffect(
    React.useCallback(() => {
      //   getCaterogy();
      setcategory(getStoreData);
      getProductList(productsId);
    }, [productsId]),
  );

  const updateFilteredCategories = test => {
    const filteredItems = category.filter(item =>
      item.type_title.toLowerCase().includes(test.toLowerCase()),
    );

    setFilteredCategories(filteredItems);
    //filteredItems.clear()
    setForLoading(false);
  };
  const data = [
    require('../../Icon/Images/product_1631791758.jpg'),
    require('../../Icon/Images/product_1631792207.jpg'),
    require('../../Icon/Images/product_1631791758.jpg'),
    require('../../Icon/Images/product_1631811803.jpg'),
    require('../../Icon/Images/product_1631468947.jpg'),

    require('../../Icon/Images/product_1631791758.jpg'),
  ];

  // const getCaterogy = async () => {
  //   setForLoading(true);
  //   try {
  //     const favDiet = await axios.get(
  //       `${NewAppapi.Get_Product_Catogery}?token=${getUserDataDetails.login_token}`,
  //     );

  //     if (favDiet.data.status != 'Invalid token') {
  //       setcategory([]);
  //       setForLoading(false);
  //     } else {
  //       setcategory(favDiet.data.data);
  //       // setFilteredCategories(favDiet.data.data);

  //       setForLoading(false);
  //     }
  //   } catch (error) {
  //     setcategory([]);
  //     console.log('Product Category Error', error);
  //     setForLoading(false);
  //   }
  // };
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
  // const bannerAdsDisplay = () => {
  //   if (getPurchaseHistory.length > 0) {
  //     if (
  //       getPurchaseHistory[0]?.plan_end_date >= moment().format('YYYY-MM-DD')
  //     ) {
  //       return null;
  //     } else {
  //       return (
  //         <View style={{marginBottom: DeviceHeigth <= 808 ? -1 : -10}}>
  //           <BannerAdd bannerAdId={bannerAdId} />
  //         </View>
  //       );
  //     }
  //   } else {
  //     return (
  //       <View style={{marginBottom: DeviceHeigth <= 808 ? -1 : -10}}>
  //         <BannerAdd bannerAdId={bannerAdId} />
  //       </View>
  //     );
  //   }
  // };
  const getProductList = async type => {
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
  return (
    <>
      <View style={styles.container}>
        <NewHeader header={'Store'} SearchButton={false} backButton={true} />
        <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />
        <ScrollView
          keyboardDismissMode="interactive"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{flexGrow: 1}}
          style={{top: -DeviceHeigth * 0.025}}
          keyboardShouldPersistTaps="handled">
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
              top: 5,
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
              marginVertical: 20,
            }}>
            <SliderBox
              ImageComponent={FastImage}
              images={data}
              sliderBoxHeight={DeviceHeigth * 0.18}
              // onCurrentImagePressed={index =>
              //   console.warn(`image ${index} pressed`)
              // }
              dotColor="red"
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
              // alignItems: 'center',
              top: DeviceHeigth * 0.0,
            }}>
            <Text
              style={{
                fontSize: 17,

                fontFamily: 'Montserrat-SemiBold',
                fontWeight: '700',
                lineHeight: 30,
                // marginBottom: 20,
                color: AppColor.BLACK,
              }}>
              Shop by categories
            </Text>
            <View style={{top: DeviceHeigth * 0.02}}>
              <FlatList
                data={filteredCategories}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({item, index}) => {
                  return (
                    <>
                      <TouchableOpacity
                        style={styles.listItem2}
                        onPress={() => {
                          setProductsId(item?.type_id);

                          analytics().logEvent(
                            `CV_FITME_CLICKED_ON_${item?.type_title.replace(
                              ' ',
                              '_',
                            )}`,
                          );
                        }}>
                        <ImageBackground
                          source={
                            // require('../../Icon/Images/product_1631791758.jpg')
                            item.type_image_link == null
                              ? localImage.Noimage
                              : {uri: item.type_image_link}
                          }
                          defaultSource={localImage?.NOWORKOUT}
                          style={{
                            width: DeviceWidth * 0.7,
                            height: DeviceHeigth * 0.15,
                            borderColor: 'white',
                            borderWidth: 1,
                            overflow: 'hidden',
                            zIndex: -1,
                            borderRadius: 10,
                          }}
                          resizeMode="cover">
                          {/* <Text
                          style={{
                            fontSize: 16,
                            fontWeight: '500',
                            lineHeight: 18,
                            fontFamily: 'Poppins',
                        
                            color: AppColor.WHITE,
                          }}>
                          {item.type_title}
                        </Text>  */}
                          <LinearGradient
                            start={{x: 1, y: 0}}
                            end={{x: 0, y: 1}}
                            // colors={['#00000033', '#919EAB29']}
                            colors={[
                              'transparent',
                              'transparent',
                              '#00000033',
                              '#000',
                            ]}
                            style={{
                              width: DeviceWidth * 0.7,
                              height: DeviceHeigth * 0.15,
                              borderRadius: 10,
                              opacity: 0.9,
                            }}>
                            <Text
                              style={{
                                fontSize: 18,
                                fontWeight: '600',
                                lineHeight: 20,
                                fontFamily: Fonts.MONTSERRAT_BOLD,
                                textAlign: 'center',
                                color: AppColor.WHITE,
                                alignSelf: 'flex-start',
                                top: DeviceHeigth * 0.1,
                                left: 20,
                                color: '#fff',
                              }}>
                              {item.type_title}
                            </Text>
                          </LinearGradient>
                        </ImageBackground>
                      </TouchableOpacity>
                    </>
                  );
                }}
                ListEmptyComponent={emptyComponent}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                updateCellsBatchingPeriod={100}
                removeClippedSubviews={true}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              width: '95%',
              alignSelf: 'center',
              top: DeviceHeigth * 0.05,
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                color: AppColor.BLACK,
                fontFamily: 'Montserrat-SemiBold',
                fontWeight: 'bold',
                lineHeight: 19.5,
                fontSize: 18,
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}>
              Our Products
            </Text>

            <TouchableOpacity
              onPress={() => {
                analytics().logEvent(
                  `CV_FITME_CLICKED_ON_${'StoreProductList'}`,
                );
                navigation.navigate('ProductsList', {item: listData});
              }}>
              <Text
                style={{
                  color: AppColor.BoldText,
                  fontFamily: 'Montserrat-SemiBold',
                  fontWeight: '600',
                  color: AppColor.RED1,
                  fontSize: 12,
                  lineHeight: 14,
                }}>
                View All
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              alignSelf: 'center',
              top: DeviceHeigth * 0.06,
              paddingBottom: DeviceHeigth * 0.05,
            }}>
            {forLoading ? (
              <FlatList
                data={[1, 2, 3, 4, 5, 6]}
                numColumns={3}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                renderItem={({item, index}) => {
                  return (
                    <View s style={styles.listItem3}>
                      <ShimmerPlaceholder
                        ref={avatarRef}
                        autoRun
                        style={{
                          height: DeviceHeigth * 0.07,
                          width: 104,
                          top: 5,
                          borderRadius: 10,
                          alignSelf: 'center',
                        }}
                      />
                      <ShimmerPlaceholder
                        ref={avatarRef}
                        autoRun
                        style={{
                          width: 80,
                          top: 15,
                          alignSelf: 'center',
                        }}
                      />
                    </View>
                  );
                }}
                initialNumToRender={10}
                maxToRenderPerBatch={5}
                updateCellsBatchingPeriod={100}
                removeClippedSubviews={true}
                // Adjust based on your data size and performance
                windowSize={10}
              />
            ) : (
              <FlatList
                data={productList.slice(0, 6)}
                numColumns={3}
                showsVerticalScrollIndicator={false}
                renderItem={({item, index}) => {
                  setListData(productList);

                  return (
                    <>
                      <TouchableOpacity
                        style={styles.listItem3}
                      activeOpacity={0.9}
                        onPress={() => {
                          analytics().logEvent(
                            `CV_FITME_CLICKED_ON_${'StoreProductList'}`,
                          );

                          Linking.openURL(item?.product_link);
                        }}>
                        <View
                          style={{
                            width: DeviceWidth * 0.3,
                            height: DeviceWidth * 0.3,
                            backgroundColor: '#fff',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 10,
                            alignSelf: 'center',
                            borderColor: '#fff',
                            borderWidth: 1,
                            shadowColor: 'grey',
                            ...Platform.select({
                              ios: {
                                //shadowColor: '#000000',
                                shadowOffset: {width: 0, height: 2},
                                shadowOpacity: 0.2,
                                shadowRadius: 4,
                              },
                              android: {
                                elevation: 1,
                              },
                            }),
                          }}>
                          <Image
                            source={
                              item.product_image_link == null
                                ? localImage.Noimage
                                : {uri: item.product_image_link}
                            }
                            defaultSource={localImage?.NOWORKOUT}
                            style={{
                              height: '90%',
                              width: 100,

                              alignSelf: 'center',
                            }}
                            resizeMode="contain"></Image>
                        </View>
                        <View style={{width: 100}}>
                          <Text
                            numberOfLines={1}
                            style={{
                              fontSize: 15,
                              fontWeight: '500',
                              lineHeight: 18,
                              fontFamily: 'Poppins',
                              textAlign: 'center',
                              top: 10,
                              color: AppColor.BoldText,
                            }}>
                            {item?.product_title}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </>
                  );
                }}
                ListEmptyComponent={emptyComponent}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                updateCellsBatchingPeriod={100}
                removeClippedSubviews={true}
                keyExtractor={(item, index) => index.toString()}
              />
            )}
            {/* <View style={{height: DeviceHeigth * 0.025}} /> */}
          </View>
        </ScrollView>
      </View>
      {/* {bannerAdsDisplay()} */}
      <View style={{marginBottom: DeviceHeigth <= 808 ? -1 : -10}}>
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
  lastItemMargin: {
    marginBottom: 0, // Set your desired margin for the last item
  },
  listItem2: {
    marginHorizontal: 12,
  },
  listItem3: {
    // height: DeviceWidth * 0.25,
    marginHorizontal: 5,

    paddingTop: 10,
    paddingBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',

    marginBottom: 20,
  },
});
export default StoreScreen;
