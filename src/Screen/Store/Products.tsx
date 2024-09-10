import {
  FlatList,
  Image,
  Linking,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import Wrapper from '../WorkoutCompleteScreen/Wrapper';
import NewHeader1 from '../../Component/Headers/NewHeader1';
import FitIcon from '../../Component/Utilities/FitIcon';
import {AppColor} from '../../Component/Color';
import {useSelector} from 'react-redux';
import FitText from '../../Component/Utilities/FitText';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../Component/Config';
import AnimatedLottieView from 'lottie-react-native';
import {localImage} from '../../Component/Image';
import {AnalyticsConsole} from '../../Component/AnalyticsConsole';
import LoadingScreen from '../../Component/NewHomeUtilities/LoadingScreen';
import {RequestAPI} from '../../Component/Utilities/RequestAPI';

type StoreItemProps = {
  type_id: number;
  type_image_link: string;
  type_title: string;
};

type ProductItemProps = {
  product_description: string;
  product_featured: string;
  product_id: number;
  product_image: string;
  product_image_link: string;
  product_link: string;
  product_price: number;
  product_status: number;
  product_title: string;
  product_type: number;
};

const Products = ({navigation, route}: any) => {
  const product: StoreItemProps = route.params?.product;
  const [searchWord, setSearchWord] = useState('');
  const [loader, setLoader] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [productsData, setProductsData] = useState([]);

  useEffect(() => {
    getProductsData();
  }, [product]);

  const getProductsData = () => {
    setLoader(true);
    RequestAPI.makeRequest(
      'POST',
      NewAppapi.Get_Product_List,
      {type_id: product.type_id},
      (res: any) => {
        setLoader(false);
        if (res?.error) {
          console.log(res?.error);
        } else if (res.data.status == 'data not found') {
          setProductsData([]);
        } else {
          setProductsData(res.data?.data);
        }
      },
    );
  };

  // Filtered categories memoized for performance
  const filteredCategories = useMemo(() => {
    return productsData.filter((item: any) =>
      item.product_title.toLowerCase().includes(searchWord.toLowerCase()),
    );
  }, [searchWord, productsData]);

  const updateSearchWord = (text: string) => {
    setSearchWord(text);
  };

  // Memoize SearchBar to avoid unnecessary re-renders
  const SearchBar = useMemo(() => {
    return (
      <View style={[styles.searchContainer, styles.centerStyle]}>
        <TextInput
          placeholder="Search Product"
          value={searchWord}
          onChangeText={updateSearchWord}
          placeholderTextColor="#49454F"
          style={{
            width: '95%',
          }}
        />
        <FitIcon
          name="search"
          type="MaterialIcons"
          size={20}
          color={AppColor.BLACK}
        />
      </View>
    );
  }, [searchWord, updateSearchWord]);

  const renderItem = ({
    item,
    index,
  }: {
    item: ProductItemProps;
    index: number;
  }) => {
    const onPress = () => {
      AnalyticsConsole(`Products`);
      Linking.openURL(item?.product_link);
    };
    const isLastOdd =
      index + (1 % 2) != 0 && index + 1 == filteredCategories.length;
    return (
      <TouchableOpacity
        style={[
          styles.itemContainer,
          {flex: isLastOdd ? 0 : 1, width: isLastOdd ? '45%' : '50%'},
        ]}
        activeOpacity={0.5}
        onPress={onPress}>
        <Image
          source={{uri: item.product_image_link}}
          defaultSource={localImage?.NOWORKOUT}
          resizeMode="contain"
          style={styles.itemImage}
        />
        <View style={{margin: 10, alignItems: 'center'}}>
          <FitText type="SubHeading" value={item.product_title} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      {loader ? (
        <LoadingScreen />
      ) : (
        <View style={{flex: 1, backgroundColor: '#F9F9F9'}}>
          <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />
          <Wrapper styles={{backgroundColor: '#F9F9F9'}}>
            <NewHeader1 header={product.type_title} backButton />
            {SearchBar}
            {filteredCategories.length > 0 ? (
              <View style={[styles.centerStyle, {flex: 1}]}>
                <FlatList
                  data={filteredCategories}
                  renderItem={renderItem}
                  keyExtractor={(_, index) => index.toString()}
                  numColumns={2}
                  showsVerticalScrollIndicator={false}
                  style={{flex: 1}}
                  refreshControl={
                    <RefreshControl
                      refreshing={refresh}
                      onRefresh={getProductsData}
                      colors={[AppColor.RED]}
                    />
                  }
                />
              </View>
            ) : (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: -50
                }}>
                <AnimatedLottieView
                  source={require('../../Icon/Images/NewImage/NoData.json')}
                  speed={2}
                  autoPlay
                  loop
                  resizeMode="contain"
                  style={{
                    width: DeviceWidth * 0.6,
                    height: DeviceHeigth * 0.3,
                  }}
                />
              </View>
            )}
          </Wrapper>
        </View>
      )}
    </>
  );
};

export default Products;

const styles = StyleSheet.create({
  searchContainer: {
    height: 50,
    borderRadius: 20,
    padding: 5,
    paddingHorizontal: 10,
    backgroundColor: '#EFF1F3',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  centerStyle: {
    width: '90%',
    alignSelf: 'center',
  },
  mainContainer: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: AppColor.WHITE,
  },
  itemContainer: {
    borderRadius: 15,
    backgroundColor: AppColor.WHITE,
    overflow: 'hidden',
    margin: 10,
  },
  itemImage: {
    width: '80%',
    height: DeviceHeigth * 0.1,
    alignSelf: 'center',
    margin: 5,
  },
});
