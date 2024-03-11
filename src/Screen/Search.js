import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ImageBackground,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {TextInput} from 'react-native-paper';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {DeviceHeigth, DeviceWidth} from '../Component/Config';
import axios from 'axios';
import {Api, Appapi} from '../Component/Config';
import Header from '../Component/Header';
import HeaderWithoutSearch from '../Component/HeaderWithoutSearch';
import {useSelector} from 'react-redux';
import Loader from '../Component/Loader';
import {useNavigation} from '@react-navigation/native';
import CustomStatusBar from '../Component/CustomStatusBar';
const Search = () => {
  const navigation = useNavigation();
  const [query, setQuery] = useState('');
  const [ApiData, setApiData] = useState([]);
  const [searchedData, setSearchedData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  // const {defaultTheme}=useSelector((state)=>state)
  const [text, setText] = useState(null);
  const {defaultTheme} = useSelector(state => state);
  const emptyData = [];
  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    try {
      const data = await axios(`${Api}/${Appapi.workhouts}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'Multipart/form-data',
        },
      });
      setApiData(data.data);
      setIsLoaded(true);
    } catch (error) {}
  };
  const onSearch = text => {
    if (text == '') {
      setSearchedData(emptyData);
      setText(null);
    } else {
      const ShownData = ApiData.filter(item => {
        return item.title.toLowerCase().indexOf(text.toLowerCase()) > -1;
      });
      setSearchedData(ShownData);
      setIsLoaded(true);

      setText(text);
    }
  };
  if (isLoaded) {
    return (
      <View
        style={[
          styles.container,
          {backgroundColor: defaultTheme ? '#000' : '#fff'},
        ]}>
        {Platform.OS == 'android' ? (
          <>
            <StatusBar
              barStyle={defaultTheme ? 'light-content' : 'dark-content'}
              backgroundColor={'#C8170D'}
            />
          </>
        ) : (
          <>
            <CustomStatusBar />
          </>
        )}
        <HeaderWithoutSearch Header={'Search'} />
        <View
          style={[
            styles.SearchView,
            {
              borderColor: defaultTheme
                ? 'rgba(255,255,255,0.7)'
                : 'rgba(0,0,0,0.6)',
            },
          ]}>
          <Icons
            name={'magnify'}
            size={25}
            color={defaultTheme ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)'}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Search Workouts..."
            underlineColor="transparent"
            placeholderTextColor={
              defaultTheme ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)'
            }
            cursorColor="#C8170D"
            value={query}
            activeUnderlineColor="transparent"
            textColor={defaultTheme ? '#fff' : '#000'}
            onChangeText={text => {
              setQuery(text);
              onSearch(text);
            }}
          />
        </View>
        <View style={{flex: 1}}>
          {searchedData.length > 0 ? (
            <>
              <FlatList
                data={searchedData}
                renderItem={elements => (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('WorkoutDescription', {elements});
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        margin: 10,
                        alignItems: 'center',
                      }}>
                      <Image
                        source={{uri: elements.item.image}}
                        style={styles.Image}
                      />
                      <View>
                        <View style={styles.container3}>
                          <Text
                            style={[
                              styles.flatListTitle,
                              {color: defaultTheme ? '#fff' : '#000'},
                            ]}>
                            <Text></Text>
                            {elements.item.title}
                          </Text>
                          <Icons
                            name="chevron-right"
                            size={20}
                            color={'grey'}
                          />
                        </View>
                        <Text>{elements.item.days}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                updateCellsBatchingPeriod={100}
                removeClippedSubviews={true}
                keyExtractor={(item, index) => index.toString()}
              />
            </>
          ) : (
            <>
              {searchedData.length == 0 && text == null ? (
                <>
                  <View style={styles.noData}></View>
                </>
              ) : (
                <>
                  <View style={styles.noData}>
                    <Text
                      style={{
                        fontSize: 20,
                        color: defaultTheme ? '#fff' : '#000',
                      }}>
                      Ooops! No Results
                    </Text>
                    <Text style={{color: defaultTheme ? '#fff' : '#000'}}>
                      Try different keyword
                    </Text>
                  </View>
                </>
              )}
            </>
          )}
        </View>
      </View>
    );
  } else {
    return <Loader />;
  }
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textInput: {
    backgroundColor: 'transparent',
    width: (DeviceWidth * 70) / 100,
  },
  searchIcon: {
    marginLeft: 9,
  },
  SearchView: {
    flexDirection: 'row',
    width: (DeviceWidth * 94) / 100,
    alignItems: 'center',
    margin: 15,
    borderWidth: 1,
    borderRadius: 8,
  },
  flatListTitle: {
    fontSize: 16,
  },
  container3: {
    flexDirection: 'row',
    alignItems: 'center',
    width: (DeviceWidth * 70) / 100,
    justifyContent: 'space-between',
  },
  Image: {
    width: 60,
    height: 60,
    margin: 10,
    borderRadius: 60 / 2,
  },
  noData: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default Search;
