import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  ActivityIndicator,
  Image,
} from 'react-native';
import React from 'react';
import {DeviceHeigth, DeviceWidth} from '../Config';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {AppColor} from '../Color';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {useDispatch, useSelector} from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {setExperience} from '../ThemeRedux/Actions';
import {navigationRef} from '../../../App';
import {extractFont} from 'react-native-svg/lib/typescript/lib/extract/extractText';
import FitCoins from '../Utilities/FitCoins';
import {AnalyticsConsole} from '../AnalyticsConsole';
import moment from 'moment';
import ShimmerPlaceholder, {
  createShimmerPlaceholder,
} from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import {localImage} from '../Image';
import {ArrowLeft} from '../Utilities/Arrows/Arrow';

const NewHeader = ({
  header,
  backButton,
  SearchButton,
  onPress,
  extraView,
  coins,
  enteredCurrentEvent,
  coinsLoaded,
  secondIcon,
}) => {
  const navigation = useNavigation();
  const getExperience = useSelector(state => state.getExperience);
  const dispatch = useDispatch();
  const winnerAnnounced = useSelector(state => state.winnerAnnounced);
  const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);
  const avatarRef = React.createRef();
  return (
    <SafeAreaView
      style={[
        style.container,
        {
          paddingVertical: getStatusBarHeight(),
          left: 3,
        },
      ]}>
      {!backButton ? (
        <View style={{width: 20}}></View>
      ) : (
        <TouchableOpacity
          style={{left: 10, zIndex: 1}}
          onPress={() => {
            navigation.goBack();
          }}>
          <ArrowLeft />
        </TouchableOpacity>
      )}

      <Text
        style={[
          style.headerstyle,
          {
            color: AppColor.INPUTTEXTCOLOR,
            fontFamily: 'Montserrat-SemiBold',
            fontWeight: '700',

            width: DeviceWidth * 0.8,
            textAlign: 'center',
          },
        ]}>
        {header}
      </Text>
      {!SearchButton ? (
        extraView ? (
          enteredCurrentEvent ? (
            <View
              style={{
                top: -3,
                right:
                  DeviceHeigth >= 1024
                    ? DeviceWidth * 0.07
                    : DeviceWidth * 0.09,
              }}>
              {!coinsLoaded ? (
                <FitCoins
                  onPress={() => {
                    if (winnerAnnounced) {
                      AnalyticsConsole('W_L');
                      navigation.navigate('Winner');
                    } else {
                      AnalyticsConsole('LB');
                      navigation.navigate('Leaderboard');
                    }
                  }}
                  coins={coins}
                />
              ) : (
                <ShimmerPlaceholder
                  style={{
                    height: DeviceHeigth * 0.03,
                    width: DeviceWidth * 0.2,

                    justifyContent: 'center',
                    alignSelf: 'center',
                    borderRadius: 20,
                  }}
                  ref={avatarRef}
                  autoRun
                />
              )}
            </View>
          ) : (
            <View style={{width: 25}}></View>
          )
        ) : (
          <View style={{width: 25}}></View>
        )
      ) : (
        <TouchableOpacity onPress={onPress} style={{right: 12}}>
          {secondIcon ? (
            <Image
              source={localImage.infoCircle}
              style={{height: 25, width: 25}}
              resizeMode="contain"
            />
          ) : (
            <Icons name={'magnify'} size={25} color={AppColor.INPUTTEXTCOLOR} />
          )}
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};
const style = StyleSheet.create({
  container: {
    width: DeviceWidth,
    backgroundColor: AppColor.GRAY,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerstyle: {
    fontWeight: '600',
    fontSize: 19,
  },
});
export default NewHeader;
