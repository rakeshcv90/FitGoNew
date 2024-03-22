import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  useWindowDimensions,
  StatusBar,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import HTMLRender from 'react-native-render-html';
import {DeviceWidth, DeviceHeigth, NewApi} from '../Component/Config';
import {Api, Appapi} from '../Component/Config';
import {localImage} from '../Component/Image';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import Loader from '../Component/Loader';
import HeaderWithoutSearch from '../Component/HeaderWithoutSearch';
import CustomStatusBar from '../Component/CustomStatusBar';
import {WebView} from 'react-native-webview';
const TermaAndCondition = ({route}) => {
  const {width} = useWindowDimensions();
  const [isLoaded, setIsLoaded] = useState(false);
  const {defaultTheme} = useSelector(state => state);
  const [Terms, setTerms] = useState([]);
  // useEffect(() => {
  //   getData();
  // }, []);
  // const getData = async () => {
  //   try {
  //     const data = await axios(
  //       `https://fitme.cvinfotech.in/json/data_strings.php`,
  //       {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'Multipart/form-data',
  //         },
  //       },
  //     );

  //     setTerms(data.data);
  //     setIsLoaded(true);
  //   } catch (error) {
  //     console.log('eroror', error);
  //   }
  // };

    return (
      <View
        style={[
          styles.container,
          {backgroundColor: defaultTheme ? '#000' : '#fff'},
        ]}>
        <View>
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
        </View>
        <HeaderWithoutSearch Header={route.params.title} />

        <WebView
          source={{
            uri:
              route.params.title === 'Privacy & Policy'
                ? 'https://thefitnessandworkout.com/privacy-policy/'
                : 'https://thefitnessandworkout.com/terms-condition/',
          }}
          style={{flex: 1}}
        />
        {/* <View style={{flex: 1, marginHorizontal: 8}}>
          <FlatList
            data={Terms}
            showsVerticalScrollIndicator={false}
            renderItem={elements => {
              return (
                <View>
                  <HTMLRender
                    source={{html: elements.item.st_termsofservice}}
                    tagsStyles={
                      (customStyle = {
                        p: {
                          color: defaultTheme ? '#fff' : '#000',
                        },
                        strong: {
                          color: '#C8170D',
                          fontSize: 20,
                        },
                      })
                    }
                    contentWidth={width}
                  />
                  <HTMLRender
                    source={{html: elements.item.st_privacypolicy}}
                    tagsStyles={
                      (customStyle = {
                        p: {
                          color: defaultTheme ? '#fff' : '#000',
                        },
                        strong: {
                          color: '#C8170D',
                          fontSize: 20,
                        },
                      })
                    }
                    contentWidth={width}
                  />
                </View>
              );
            }}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            updateCellsBatchingPeriod={100}
            removeClippedSubviews={true}
            keyExtractor={(item, index) => index.toString()}
          />
        </View> */}
      </View>
    );

};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default TermaAndCondition;
