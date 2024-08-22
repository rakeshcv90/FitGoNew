import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  useWindowDimensions,
  StatusBar,
  ActivityIndicator,
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
import {AppColor} from '../Component/Color';

const TermaAndCondition = ({route}) => {
  const {width} = useWindowDimensions();
  const [isLoaded, setIsLoaded] = useState(false);
  const {defaultTheme} = useSelector(state => state);
  const [Terms, setTerms] = useState([]);

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: defaultTheme ? '#000' : '#fff'},
      ]}>
      <ActivityIndicator
        animating={isLoaded}
        size={'large'}
        color={AppColor.RED}
        style={{
          position: 'absolute',
          top: DeviceHeigth / 2,
          zIndex: 1,
          left: 0,
          right: 0,
        }}
      />
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
        onLoad={() => setIsLoaded(false)} // Set loading to false when content is loaded
        onLoadStart={() => setIsLoaded(true)} // Set loading to true when content starts loadin
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default TermaAndCondition;
