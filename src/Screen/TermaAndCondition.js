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
import CustomStatusBar from '../Component/CustomStatusBar';
import {WebView} from 'react-native-webview';
import {AppColor} from '../Component/Color';
import NewHeader from '../Component/Headers/NewHeader';
import NewHeader1 from '../Component/Headers/NewHeader1';
import Wrapper from './WorkoutCompleteScreen/Wrapper';

const TermaAndCondition = ({route}) => {
  const [isLoaded, setIsLoaded] = useState(true);
  const {defaultTheme} = useSelector(state => state);
  return (
    <View
      style={[
        styles.container,
        {backgroundColor: defaultTheme ? '#000' : '#fff'},
      ]}>
      <Wrapper>
        <NewHeader1 header={route?.params?.title} backButton />
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
        <WebView
          source={{
            uri:
              route.params.title === 'Privacy Policy'
                ? 'https://thefitnessandworkout.com/privacy-policy/'
                : 'https://thefitnessandworkout.com/terms-condition/',
          }}
          style={{flex: 1}}
          onLoad={() => setIsLoaded(false)} // Set loading to false when content is loaded
          onLoadStart={() => setIsLoaded(true)} // Set loading to true when content starts loadin
        />
      </Wrapper>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default TermaAndCondition;
