import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import {DeviceHeigth, DeviceWidth} from '../Config';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {AppColor} from '../Color';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {useDispatch, useSelector} from 'react-redux';

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

const NewHeader = ({
  header,
  backButton,
  SearchButton,
  onPress,
  extraView,
  coins,
  enteredCurrentEvent,
  coinsLoaded,
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
          height:
            Platform.OS == 'ios'
              ? (DeviceHeigth * 13) / 100
              : (DeviceHeigth * 10) / 100,
          left: 1,
          paddingTop:
            Platform.OS == 'android'
              ? DeviceHeigth * 0.03
              : DeviceHeigth * 0.01,
        },
      ]}>
      {!backButton ? (
        <View style={{width: 20}}></View>
      ) : (
        <TouchableOpacity
          style={{left: 0}}
          onPress={() => {
            if (getExperience == true) {
              dispatch(setExperience(false));
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{name: 'BottomTab'}],
                }),
              );
              // navigationRef.current.navigate('BottomTab',{screen:'Home'})
            } else {
              navigation.goBack();
            }
          }}>
          <Icons
            name={'chevron-left'}
            size={25}
            color={AppColor.INPUTTEXTCOLOR}
          />
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
            <View style={{top: -3}}>
              {!coinsLoaded ? (
                <FitCoins
                  onPress={() => {
                    AnalyticsConsole('LB');
                    if (winnerAnnounced) {
                      navigation.navigate('Winner');
                    } else {
                      navigation.navigate('Leaderboard');
                    }
                  }}
                  coins={coins}
                />
              ) : (
                <ShimmerPlaceholder
                  style={{
                    height: DeviceHeigth * 0.04,
                    width: DeviceWidth * 0.2,
        
                    justifyContent: 'center',
                    alignSelf: 'center',
                    borderRadius: 20,
                    position:'absolute',
                    right:16,
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
        <TouchableOpacity onPress={onPress}>
          <Icons name={'magnify'} size={25} color={AppColor.INPUTTEXTCOLOR} />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};
const style = StyleSheet.create({
  container: {
    width: DeviceWidth,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerstyle: {
    fontWeight: '600',
    fontSize: 19,
  },
});
export default NewHeader;
