import {
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useMemo, useState} from 'react';
import Wrapper from '../WorkoutCompleteScreen/Wrapper';
import NewHeader1 from '../../Component/Headers/NewHeader1';
import FitIcon from '../../Component/Utilities/FitIcon';
import {AppColor} from '../../Component/Color';
import {useSelector} from 'react-redux';
import FitText from '../../Component/Utilities/FitText';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import AnimatedLottieView from 'lottie-react-native';
import {localImage} from '../../Component/Image';
import {AnalyticsConsole} from '../../Component/AnalyticsConsole';
import {ShadowStyle} from '../../Component/Utilities/ShadowStyle';

type StoreItemProps = {
  type_id: number;
  type_image_link: string;
  type_title: string;
};

const NewStore = ({navigation}: any) => {
  const [searchWord, setSearchWord] = useState('');
  const getStoreData = useSelector((state: any) => state.getStoreData);

  // Filtered categories memoized for performance
  const filteredCategories = useMemo(() => {
    return getStoreData.filter((item: any) =>
      item.type_title.toLowerCase().includes(searchWord.toLowerCase()),
    );
  }, [searchWord, getStoreData]);

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

  const emptyComponent = () => {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
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

  const renderItem = ({item, index}: {item: StoreItemProps; index: number}) => {
    const onPress = () => {
      AnalyticsConsole(`${item?.type_title.substring(0, 3)}`);
      navigation.navigate('Products', {product: item});
    };
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        activeOpacity={0.5}
        onPress={onPress}>
        <Image
          source={{uri: item.type_image_link}}
          defaultSource={localImage?.NOWORKOUT}
          resizeMode="contain"
          style={styles.itemImage}
        />
        <View style={{margin: 10}}>
          <FitText type="SubHeading" value={item.type_title} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: '#F9F9F9'}}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />
      <Wrapper styles={{backgroundColor: '#F9F9F9'}}>
        <NewHeader1 header={'Store'} backButton />
        {SearchBar}
        <View style={[styles.mainContainer, styles.centerStyle, ShadowStyle]}>
          <FitText type="Heading" value="Shop by categories" fontSize={14} />
          <FlatList
            data={filteredCategories}
            renderItem={renderItem}
            keyExtractor={(_, index) => index.toString()}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            style={{flex: 1}}
            ListEmptyComponent={emptyComponent}
          />
        </View>
      </Wrapper>
    </View>
  );
};

export default NewStore;

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
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    overflow: 'hidden',
    width: '50%',
    margin: 10,
    flex: 1,
  },
  itemImage: {
    width: '80%',
    height: DeviceHeigth * 0.1,
    alignSelf: 'center',
    margin: 5,
  },
});
