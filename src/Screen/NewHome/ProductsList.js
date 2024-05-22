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
import {AppColor, Fonts} from '../../Component/Color';
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
import {BannerAdd} from '../../Component/BannerAdd';
import {bannerAdId} from '../../Component/AdsId';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const ProductsList = ({route}) => {
  const [searchText, setsearchText] = useState();
  const [productList, setproductList] = useState();
  const [filteredCategories, setFilteredCategories] = useState([]);
  const getPurchaseHistory = useSelector(state => state.getPurchaseHistory);

  const avatarRef = React.createRef();
  let isFocuse = useIsFocused();

  useEffect(() => {
    if (isFocuse) {
      setproductList(route.params.item);
      setFilteredCategories(route.params.item);
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
        <NewHeader
          header={'Products Details'}
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
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            paddingBottom:DeviceHeigth*0.18
             
                
          }}>
          <FlatList
            data={filteredCategories}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            renderItem={({item, index}) => {
              return (
                <>
                  <TouchableOpacity
                    style={styles.listItem2}
                    onPress={() => {
                      Linking.openURL(item.product_link);
                    }}>
                    <View
                      style={{
                        width: DeviceWidth * 0.45,
                        height: DeviceWidth * 0.4,
                        backgroundColor: '#F3F4F1',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 10,
                      }}>
                      <Image
                        source={
                          item.product_image_link == null
                            ? localImage.Noimage
                            : {uri: item.product_image_link}
                        }
                        style={{
                          width: DeviceWidth * 0.4,
                        height: DeviceWidth * 0.35,
                          // borderRadius: 180 / 2,
                          alignSelf: 'center',
                        }}
                        resizeMode="contain"
                      />
                    </View>

                    <View
                      style={{
                        width: DeviceWidth * 0.45,
                        alignItems: 'center',
                        justifyContent: 'center',
                        top:8,
                      }}>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: 18,

                          fontFamily: Fonts.MONTSERRAT_REGULAR,
                          fontWeight: '700',
                          lineHeight: 30,
                          // marginBottom: 20,
                          color: AppColor.BLACK,
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
    fontFamily: 'Poppins',
    color: AppColor.BLACK,
  },
  listItem2: {
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
});
export default ProductsList;
