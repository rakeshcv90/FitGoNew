import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import NewHeader from '../../Component/Headers/NewHeader';
import {StatusBar} from 'react-native';
import {StyleSheet} from 'react-native';
import {AppColor} from '../../Component/Color';
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

import {showMessage} from 'react-native-flash-message';
import analytics from '@react-native-firebase/analytics';
import moment from 'moment';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import {setFitmeAdsCount} from '../../Component/ThemeRedux/Actions';
import {BannerAdd} from '../../Component/BannerAdd';
import {bannerAdId} from '../../Component/AdsId';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const Store = ({navigation}) => {
  const getUserDataDetails = useSelector(state => state.getUserDataDetails);
  const getStoreData = useSelector(state => state.getStoreData);

  const [searchText, setsearchText] = useState('');
  const [forLoading, setForLoading] = useState(false);
  const [category, setcategory] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState(getStoreData);
  const getPurchaseHistory = useSelector(state => state.getPurchaseHistory);
  const avatarRef = React.createRef();
  const dispatch = useDispatch();
  useFocusEffect(
    React.useCallback(() => {
      getCaterogy();
      setcategory(getStoreData);
    }, []),
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

  const getCaterogy = async () => {
    setForLoading(true);
    try {
      const favDiet = await axios.get(
        `${NewAppapi.Get_Product_Catogery}?token=${getUserDataDetails.login_token}`,
      );

      if (favDiet.data.status != 'Invalid token') {
        setcategory([]);
        setForLoading(false);
      } else {
        setcategory(favDiet.data.data);
        // setFilteredCategories(favDiet.data.data);

        setForLoading(false);
      }
    } catch (error) {
      setcategory([]);
      console.log('Product Category Error', error);
      setForLoading(false);
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
  const bannerAdsDisplay = () => {
    if (getPurchaseHistory.length > 0) {
      if (
        getPurchaseHistory[0]?.plan_end_date >= moment().format('YYYY-MM-DD')
      ) {
        return null;
      } else {
        return (
          <View style={{marginBottom: DeviceHeigth <= 808 ? -1 : -10}}>
            <BannerAdd bannerAdId={bannerAdId} />
          </View>
        );
      }
    } else {
      return (
        <View style={{marginBottom: DeviceHeigth <= 808 ? -1 : -10}}>
          <BannerAdd bannerAdId={bannerAdId} />
        </View>
      );
    }
  };
  return (
    <>
      <View style={styles.container}>
        <NewHeader header={'Store'} SearchButton={false} backButton={true} />
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
            alignItems: 'center',
            top: 10,
            
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
            Our Products
          </Text>

          <View
            style={{
              alignSelf: 'center',
              paddingBottom: Platform.OS == 'android' ? DeviceHeigth<=808?DeviceHeigth * 0.45:DeviceHeigth * 0.4 : 50,
              // paddingBottom:
              //   Platform.OS == 'android'
              //     ? 50
              //     : DeviceHeigth <= 667
              //     ? DeviceHeigth * 0.15
              //     : 15,
            }}>
            {forLoading ? (
              <FlatList
                data={[1, 2, 3, 4, 5, 6, 7, 8, 9]}
                numColumns={3}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                renderItem={({item, index}) => {
                  return (
                    <View s style={styles.listItem2}>
                      <ShimmerPlaceholder
                        ref={avatarRef}
                        autoRun
                        style={{
                          height: 80,
                          width: 80,
                          top: 5,
                          borderRadius: 160 / 2,
                          alignSelf: 'center',
                        }}
                      />
                      <ShimmerPlaceholder
                        ref={avatarRef}
                        autoRun
                        style={{
                          width: 80,
                          top: 5,
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
                data={filteredCategories}
                numColumns={3}
                showsVerticalScrollIndicator={false}
                renderItem={({item, index}) => {
                  return (
                    <>
                      <TouchableOpacity
                        style={styles.listItem2}
                        onPress={() => {
                          analytics().logEvent(
                            `CV_FITME_CLICKED_ON_${item?.type_title.replace(
                              ' ',
                              '_',
                            )}`,
                          );
                          navigation.navigate('ProductsList', {item: item});
                        }}>
                        <Image
                          source={
                            item.type_image_link == null
                              ? localImage.Noimage
                              : {uri: item.type_image_link}
                          }
                          style={{
                            height: 90,
                            width: 90,

                            alignSelf: 'center',
                          }}
                          resizeMode="contain"></Image>
                        <Text
                          style={{
                            fontSize: 12,
                            fontWeight: '500',
                            lineHeight: 18,
                            fontFamily: 'Poppins',
                            textAlign: 'center',
                            color: AppColor.BoldText,
                          }}>
                          {item.type_title}
                        </Text>
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
            <View style={{height: DeviceHeigth * 0.025}} />
          </View>
        </View>
      </View>
      {bannerAdsDisplay()}
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
    width: DeviceWidth * 0.26,
    // height: DeviceWidth * 0.25,
    marginHorizontal: 12,
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
    // marginHorizontal: 5,
    // // top: -10,
    // borderRadius: 10,
    // paddingRight: 10,
    // paddingTop: 10,
    // paddingBottom: 20,
    // justifyContent: 'center',
    // alignItems: 'center',
    // paddingLeft: 10,
    // backgroundColor: AppColor.WHITE,
    // marginBottom: 10,
    // shadowColor: 'rgba(0, 0, 0, 1)',
    // ...Platform.select({
    //   ios: {
    //     shadowColor: '#000000',
    //     shadowOffset: {width: 0, height: 2},
    //     shadowOpacity: 0.3,
    //     shadowRadius: 4,
    //   },
    //   android: {
    //     elevation: 5,
    //   },
    // }),
  },
});
export default Store;
