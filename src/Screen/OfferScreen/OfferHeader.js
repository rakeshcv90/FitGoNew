import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Touchable,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {localImage} from '../../Component/Image';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import {AppColor} from '../../Component/Color';
import {ArrowLeft} from '../../Component/Utilities/Arrows/Arrow';
import {useNavigation} from '@react-navigation/native';
const OfferHeader = React.memo(() => {
  const navigation = useNavigation();
  return (
    <ImageBackground source={localImage.offer_girl} style={styles.girl}>
      <View style={styles.header}>
        <TouchableOpacity
        activeOpacity={0.9}
        // style={{backgroundColor:'red'}}
          onPress={() => {
            navigation.goBack();
          }}>
          <ArrowLeft fillColor={AppColor.WHITE} />
        </TouchableOpacity>

        <View>
          <Text style={styles.header_text}>Offer Page</Text>
        </View>
        <View style={{width: 20}}></View>
      </View>
    </ImageBackground>
  );
});
const styles = StyleSheet.create({
  header: {
    width: DeviceWidth * 0.9,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: getStatusBarHeight() + 15,
  },
  header_text: {
    color: AppColor.WHITE,
    fontFamily: 'Helvetica-Bold',
    fontSize: 16,
  },
  girl: {width: '100%', height: DeviceHeigth * 0.45},
});
export default OfferHeader;
