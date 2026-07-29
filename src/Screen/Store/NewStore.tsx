/* eslint-disable react/no-unstable-nested-components */
import {
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import React, {useMemo, useState} from 'react';
import Wrapper from '../WorkoutCompleteScreen/Wrapper';
import NewHeader1 from '../../Component/Headers/NewHeader1';
import FitIcon from '../../Component/Utilities/FitIcon';
import {AppColor, Fonts} from '../../Component/Color';
import {useSelector} from 'react-redux';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import AnimatedLottieView from 'lottie-react-native';
import {localImage} from '../../Component/Image';
import {AnalyticsConsole} from '../../Component/AnalyticsConsole';
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

const NewStore = ({navigation}: any) => {
  const [searchWord, setSearchWord] = useState('');
  const getStoreData = useSelector((state: any) => state.getStoreData) || [];

  // Filtered categories memoized for performance
  const filteredCategories = useMemo(() => {
    return getStoreData.filter((item: any) =>
      item?.type_title?.toLowerCase().includes(searchWord.toLowerCase()),
    );
  }, [searchWord, getStoreData]);

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
          placeholder="Search product categories..."
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
  }, [searchWord]);

  // Promotional Banner Component
  const PromoBanner = useMemo(() => {
    if (searchWord.length > 0) return null;
    return (
      <View style={styles.promoBannerContainer}>
        <LinearGradient
          colors={['#FF2A54', '#E11D48']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.promoBannerGradient}>
          <View style={styles.promoTextColumn}>
            <View style={styles.promoBadgeTag}>
              <FitIcon
                type="MaterialCommunityIcons"
                name="fire"
                size={12}
                color="#E11D48"
              />
              <Text style={styles.promoBadgeTagText}>SPECIAL DEALS</Text>
            </View>
            <Text style={styles.promoTitleText}>Premium Fitness Gear</Text>
            <Text style={styles.promoSubtitleText}>
              Elevate your workouts with top-tier equipment
            </Text>
          </View>

          <View style={styles.promoIconCircle}>
            <FitIcon
              type="MaterialIcons"
              name="shopping-bag"
              size={28}
              color="#FFFFFF"
            />
          </View>
        </LinearGradient>
      </View>
    );
  }, [searchWord]);

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
          Try searching for another category or product keyword
        </Text>
      </View>
    );
  };

  const StoreCategoryCard = ({
    item,
    index,
    onPress,
  }: {
    item: StoreItemProps;
    index: number;
    onPress: () => void;
  }) => {
    const scale = useSharedValue(1);

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
        entering={FadeInDown.delay((index % 8) * 65)
          .duration(360)
          .springify()}
        style={[styles.cardGridItem, animatedStyle]}>
        <TouchableOpacity
          activeOpacity={0.92}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          onPress={onPress}
          style={styles.categoryCardInner}>
          {/* Top Image Preview Box with Floating Badge */}
          <View style={styles.imageBoxWrapper}>
            <Image
              source={{uri: item?.type_image_link}}
              defaultSource={localImage?.NOWORKOUT}
              resizeMode="contain"
              style={styles.categoryProductImage}
            />
            <View style={styles.cardRatingBadge}>
              <FitIcon
                type="MaterialIcons"
                name="star"
                size={10}
                color="#F59E0B"
              />
              <Text style={styles.cardRatingBadgeText}>4.9</Text>
            </View>
          </View>

          {/* Details & Action Button */}
          <View style={styles.categoryDetailsContainer}>
            <Text numberOfLines={1} style={styles.categoryTitleText}>
              {item?.type_title}
            </Text>

            {/* Gradient Action Button */}
            <LinearGradient
              colors={['#FF2A54', '#E11D48']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.exploreGradientBtn}>
              <Text style={styles.exploreGradientBtnText}>Explore</Text>
              <FitIcon
                type="MaterialCommunityIcons"
                name="chevron-right"
                size={14}
                color="#FFFFFF"
              />
            </LinearGradient>
          </View>
        </TouchableOpacity>
      </AnimatedReanimated.View>
    );
  };

  const renderItem = ({item, index}: {item: StoreItemProps; index: number}) => {
    const onPress = () => {
      AnalyticsConsole(`${item?.type_title?.substring(0, 3)}`);
      navigation.navigate('Products', {product: item});
    };
    return <StoreCategoryCard item={item} index={index} onPress={onPress} />;
  };

  return (
    <View style={styles.screenContainer}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'#FDFDFD'} />
      <Wrapper styles={{backgroundColor: '#FDFDFD'}}>
        <NewHeader1 header={'Store'} backButton />
        {SearchBar}

        <FlatList
          data={filteredCategories}
          renderItem={renderItem}
          keyExtractor={(_, index) => index.toString()}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={PromoBanner}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.flatListContent}
          ListEmptyComponent={emptyComponent}
        />
      </Wrapper>
    </View>
  );
};

export default NewStore;

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
  promoBannerContainer: {
    width: DeviceWidth - 32,
    alignSelf: 'center',
    marginBottom: 16,
    borderRadius: 22,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#FF2A54',
        shadowOffset: {width: 0, height: 6},
        shadowOpacity: 0.35,
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  promoBannerGradient: {
    padding: 16,
    borderRadius: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  promoTextColumn: {
    flex: 1,
    marginRight: 12,
  },
  promoBadgeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
    gap: 4,
    marginBottom: 6,
  },
  promoBadgeTagText: {
    fontSize: 10,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
    color: '#E11D48',
    letterSpacing: 0.5,
  },
  promoTitleText: {
    fontSize: 18,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  promoSubtitleText: {
    fontSize: 12,
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  promoIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
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
  categoryCardInner: {
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
  categoryProductImage: {
    width: '85%',
    height: '85%',
  },
  cardRatingBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 2,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.06,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  cardRatingBadgeText: {
    fontSize: 10,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
    color: '#111827',
  },
  categoryDetailsContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  categoryTitleText: {
    fontSize: 14.5,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  exploreGradientBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
    gap: 3,
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
  exploreGradientBtnText: {
    fontSize: 12,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: DeviceHeigth * 0.05,
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
