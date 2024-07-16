import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Dimensions,
  Image,
} from 'react-native';

import Svg, {Path} from 'react-native-svg';
import { AppColor } from '../Component/Color';

const WIDTH = Dimensions.get('screen').width;

export default function SplaceNew({navigation}) {
  return (
    <View style={styles.container}>
      <Image
        source={require('../Icon/Images/NewImage2/intro3.png')}
        style={{width: 200, backgroundColor: 'red', height: 100}}
        resizeMode="contain"
      />
      <Svg
        height={400}
        width={WIDTH}
        viewBox="0 0 375 644"
        preserveAspectRatio="none">
        <Path
          d="M-17.5 378.5C31.5 32.5 302.5 463 375 89C447.5 -285 375 644 375 644H0C0 644 -66.5 724.5 -17.5 378.5Z"
          fill={AppColor.RED}
          stroke={AppColor.RED}
        />
      </Svg>
      <View style={{backgroundColor: AppColor.RED, flex: 1}}>
        <View
          style={{
            width: WIDTH - 60,
            height: 50,
            top:-200,
            backgroundColor: 'white',
            borderRadius: 30,
            margin: 30,
            justifyContent: 'center',
            paddingLeft: 10,
          }}>
          <TextInput placeholder="email" />
          
        </View>
        <View
          style={{
            width: WIDTH - 60,
            height: 50,
            backgroundColor: 'white',
            borderRadius: 30,
            top:-230,
            margin: 30,
            justifyContent: 'center',
            paddingLeft: 10,
          }}>
          <TextInput placeholder="email" />
          
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 50,
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
  },
});
