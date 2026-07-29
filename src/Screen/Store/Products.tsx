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
  Platform,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import Wrapper from '../WorkoutCompleteScreen/Wrapper';
import NewHeader1 from '../../Component/Headers/NewHeader1';
import FitIcon from '../../Component/Utilities/FitIcon';
import {AppColor, Fonts} from '../../Component/Color';
import {useSelector} from 'react-redux';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../Component/Config';
import AnimatedLottieView from 'lottie-react-native';
import {localImage} from '../../Component/Image';
import {AnalyticsConsole} from '../../Component/AnalyticsConsole';
import LoadingScreen from '../../Component/NewHomeUtilities/LoadingScreen';
import {RequestAPI} from '../../Component/Utilities/RequestAPI';
import LinearGradient from 'react-native-linear-gradient';
import AnimatedReanimated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeInDown,
} from 'react-native-reanimated';

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
  const [productsData, setProductsData] = useState<ProductItemProps[]>([]);
  const [favorites, setFavorites] = useState<{[key: number]: boolean}>({});

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
        } else if (res.data?.status === 'data not found') {
          setProductsData([]);
        } else {
          setProductsData(res.data?.data || []);
        }
      },
    );
  };

  const toggleFavorite = (id: number) => {
    setFavorites(prev => ({...prev, [id]: !prev[id]}));
  };

  // Filtered products memoized for performance
  const filteredProducts = useMemo(() => {
    return productsData.filter((item: any) =>
      item.product_title?.toLowerCase().includes(searchWord.toLowerCase()),
    );
  }, [searchWord, productsData]);

  const updateSearchWord = (text: string) => {
    setSearchWord(text);
  };

  // Ultra-Modern SearchBar Component
  const SearchBar = useMemo(() => {
    return (
      <View style={styles.searchBarWrapper}>
        <View style={styles.searchIconBadge}>
          <FitIcon
            name="search"
            type="MaterialIcons"
            size={18}
            color="#E11D48"
          />
        </View>
        <TextInput
          placeholder={`Search in ${product?.type_title || 'products'}...`}
          value={searchWord}
          onChangeText={updateSearchWord}
          placeholderTextColor="#9CA3AF"
          style={styles.searchInputStyle}
        />
        {searchWord.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchWord('')}
            style={styles.searchClearBtn}>
            <FitIcon
              name="close-circle"
              type="MaterialCommunityIcons"
              size={18}
              color="#9CA3AF"
            />
          </TouchableOpacity>
        )}
      </View>
    );
  }, [searchWord, product?.type_title]);

  // Category Hero Banner Header
  const CategoryHeaderBanner = useMemo(() => {
    if (searchWord.length > 0) return null;
    return (
      <View style={styles.categoryHeaderCard}>
        <LinearGradient
          colors={['#FFF1F2', '#FFE4E6']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.categoryHeaderGradient}>
          <View style={styles.categoryHeaderLeft}>
            {product?.type_image_link && (
              <View style={styles.categoryImageThumbWrapper}>
                <Image
                  source={{uri: product.type_image_link}}
                  style={styles.categoryImageThumb}
                  resizeMode="contain"
                />
              </View>
            )}
            <View style={{flex: 1}}>
              <Text numberOfLines={1} style={styles.categoryHeaderTitle}>
                {product?.type_title || 'Store Items'}
              </Text>
              <View style={styles.categoryCountBadge}>
                <FitIcon
                  type="MaterialCommunityIcons"
                  name="tag-heart"
                  size={12}
                  color="#E11D48"
                />
                <Text style={styles.categoryCountBadgeText}>
                  {productsData.length} Products Available
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  }, [searchWord, product, productsData.length]);

  const ProductCardItem = ({
    item,
    index,
    onPress,
  }: {
    item: ProductItemProps;
    index: number;
    onPress: () => void;
  }) => {
    const scale = useSharedValue(1);
    const isFav = !!favorites[item.product_id];

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{scale: scale.value}],
    }));

    const onPressIn = () => {
      scale.value = withSpring(0.95, {damping: 14, stiffness: 280});
    };

    const onPressOut = () => {
      scale.value = withSpring(1, {damping: 14, stiffness: 280});
    };

    return (
      <AnimatedReanimated.View
        entering={FadeInDown.delay((index % 8) * 65).duration(360).springify()}
        style={[styles.cardGridItem, animatedStyle]}>
        <TouchableOpacity
          activeOpacity={0.92}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          onPress={onPress}
          style={styles.productCardInner}>
          {/* Top Image Box Container */}
          <View style={styles.imageBoxWrapper}>
            <Image
              source={{uri: item?.product_image_link}}
              defaultSource={localImage?.NOWORKOUT}
              resizeMode="contain"
              style={styles.productImageStyle}
            />

            {/* Favorite Heart Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => toggleFavorite(item.product_id)}
              style={styles.favoriteCircleBtn}>
              <FitIcon
                type="MaterialCommunityIcons"
                name={isFav ? 'heart' : 'heart-outline'}
                size={14}
                color={isFav ? '#E11D48' : '#9CA3AF'}
              />
            </TouchableOpacity>

            {/* Price Gradient Badge */}
            {item?.product_price > 0 && (
              <LinearGradient
                colors={['#FF2A54', '#E11D48']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.pricePillGradient}>
                <Text style={styles.pricePillText}>
                  ₹{item?.product_price}
                </Text>
              </LinearGradient>
            )}
          </View>

          {/* Details & Action Button */}
          <View style={styles.productDetailsContainer}>
            <Text numberOfLines={2} style={styles.productTitleText}>
              {item?.product_title}
            </Text>

            {/* Rating Stars Row */}
            <View style={styles.ratingRow}>
              <FitIcon
                type="MaterialIcons"
                name="star"
                size={12}
                color="#F59E0B"
              />
              <Text style={styles.ratingText}>4.9</Text>
              <Text style={styles.reviewsText}>(45+)</Text>
            </View>

            {/* Gradient View/Buy Action Button */}
            <LinearGradient
              colors={['#FF2A54', '#E11D48']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.actionGradientBtn}>
              <Text style={styles.actionGradientBtnText}>View Product</Text>
              <FitIcon
                type="MaterialCommunityIcons"
                name="open-in-new"
                size={13}
                color="#FFFFFF"
              />
            </LinearGradient>
          </View>
        </TouchableOpacity>
      </AnimatedReanimated.View>
    );
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: ProductItemProps;
    index: number;
  }) => {
    const onPress = () => {
      AnalyticsConsole(`Products`);
      if (item?.product_link) {
        Linking.openURL(item.product_link);
      }
    };
    return <ProductCardItem item={item} index={index} onPress={onPress} />;
  };

  const emptyComponent = () => {
    return (
      <View style={styles.emptyStateContainer}>
        <AnimatedLottieView
          source={require('../../Icon/Images/NewImage/NoData.json')}
          speed={2}
          autoPlay
          loop
          resizeMode="contain"
          style={{
            width: DeviceWidth * 0.55,
            height: DeviceHeigth * 0.35,
          }}
        />
        <Text style={styles.emptyStateTitle}>No Products Found</Text>
        <Text style={styles.emptyStateSubtitle}>
          There are currently no items matching your search criteria
        </Text>
      </View>
    );
  };

  return (
    <>
      {loader ? (
        <LoadingScreen />
      ) : (
        <View style={styles.screenContainer}>
          <StatusBar barStyle={'dark-content'} backgroundColor={'#FDFDFD'} />
          <Wrapper styles={{backgroundColor: '#FDFDFD'}}>
            <NewHeader1 header={product?.type_title || 'Products'} backButton />
            {SearchBar}

            <FlatList
              data={filteredProducts}
              renderItem={renderItem}
              keyExtractor={(_, index) => index.toString()}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={CategoryHeaderBanner}
              columnWrapperStyle={styles.columnWrapper}
              contentContainerStyle={styles.flatListContent}
              ListEmptyComponent={emptyComponent}
              refreshControl={
                <RefreshControl
                  refreshing={refresh}
                  onRefresh={getProductsData}
                  colors={[AppColor.RED]}
                />
              }
            />
          </Wrapper>
        </View>
      )}
    </>
  );
};

export default Products;

const CARD_WIDTH = (DeviceWidth - 44) / 2;

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#FDFDFD',
  },
  searchBarWrapper: {
    width: '92%',
    height: 48,
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginTop: 8,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#F3F4F6',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  searchIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF1F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  searchInputStyle: {
    flex: 1,
    fontSize: 14,
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    color: '#111827',
    paddingVertical: 0,
  },
  searchClearBtn: {
    padding: 4,
  },
  categoryHeaderCard: {
    width: DeviceWidth - 32,
    alignSelf: 'center',
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
  },
  categoryHeaderGradient: {
    padding: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  categoryHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryImageThumbWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  categoryImageThumb: {
    width: '90%',
    height: '90%',
  },
  categoryHeaderTitle: {
    fontSize: 17,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
    color: '#111827',
  },
  categoryCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  categoryCountBadgeText: {
    fontSize: 11.5,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
    color: '#E11D48',
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  flatListContent: {
    paddingBottom: 40,
  },
  cardGridItem: {
    width: CARD_WIDTH,
  },
  productCardInner: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 10,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 6},
        shadowOpacity: 0.06,
        shadowRadius: 10,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  imageBoxWrapper: {
    width: '100%',
    height: 114,
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  productImageStyle: {
    width: '85%',
    height: '85%',
  },
  favoriteCircleBtn: {
    position: 'absolute',
    top: 6,
    left: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.08,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  pricePillGradient: {
    position: 'absolute',
    top: 6,
    right: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  pricePillText: {
    fontSize: 10.5,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  productDetailsContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  productTitleText: {
    fontSize: 14,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 4,
    height: 38,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 11,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
    color: '#111827',
  },
  reviewsText: {
    fontSize: 10.5,
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    color: '#6B7280',
  },
  actionGradientBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    ...Platform.select({
      ios: {
        shadowColor: '#FF2A54',
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.3,
        shadowRadius: 5,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  actionGradientBtnText: {
    fontSize: 11.5,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: DeviceHeigth * 0.08,
  },
  emptyStateTitle: {
    fontSize: 17,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
    color: '#111827',
    marginTop: 12,
  },
  emptyStateSubtitle: {
    fontSize: 13,
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 30,
  },
});
