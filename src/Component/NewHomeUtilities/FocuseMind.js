import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, {useEffect} from 'react';
import {DeviceHeigth, DeviceWidth} from '../Config';
import {AppColor, Fonts} from '../Color';
import analytics from '@react-native-firebase/analytics';
import {AddCountFunction} from '../Utilities/AddCountFunction';
import {useSelector} from 'react-redux';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {MyInterstitialAd} from '../BannerAdd';
import {showMessage} from 'react-native-flash-message';
import AnimatedLottieView from 'lottie-react-native';
import {AnalyticsConsole} from '../AnalyticsConsole';
import {localImage} from '../Image';
const FocuseMind = () => {
  const allWorkoutData = useSelector(state => state.allWorkoutData);
  const navigation = useNavigation();
  const {showInterstitialAd} = MyInterstitialAd();
  const viewMorePress = () => {
    analytics().logEvent('CV_FITME_CLICKED_ON_MEDITATION');
    let checkAdsShow = AddCountFunction();
    if (allWorkoutData?.mindset_workout_data?.length > 0) {
      if (checkAdsShow == true) {
        showInterstitialAd();
        navigation.navigate('MeditationDetails', {
          item: allWorkoutData?.mindset_workout_data[0],
        });
      } else {
        navigation.navigate('MeditationDetails', {
          item: allWorkoutData?.mindset_workout_data[0],
        });
      }
    } else {
      showMessage({
        message: 'No have Mindset Data',
        floating: true,
        duration: 500,
        type: 'danger',
        icon: {icon: 'none', position: 'left'},
      });
    }
  };

  const ListItem = React.memo(({title}) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {
        AnalyticsConsole(`MediDetails`);
        let checkAdsShow = AddCountFunction();
        if (checkAdsShow == true) {
          showInterstitialAd();
          navigation.navigate('MeditationDetails', {item: title});
        } else {
          navigation.navigate('MeditationDetails', {item: title});
        }
      }}>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginHorizontal: 20,
          marginVertical: 5,
        }}>
        <View
          style={{
            width: 100,
            height: 100,
            borderRadius: 100,
           
          }}>
          <Image
            source={
              title.workout_mindset_image_link != null
                ? {uri: title.workout_mindset_image_link}
                : localImage.Noimage
            }
            style={{
              width: 100,
              height: 100,
              borderRadius: 100,
             
            }}
          />
        </View>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',

            marginVertical: 5,
          }}>
          <Text
            style={{
              textAlign: 'center',

              fontFamily: Fonts.HELVETICA_REGULAR,

              color: AppColor.PrimaryTextColor,
              fontSize: 15,
              fontWeight: '500',
              lineHeight: 25,
              textTransform: 'capitalize',
            }}>
            {title?.workout_mindset_title}
          </Text>
        </View>
      </View>
      {/* <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginHorizontal: 20,
        }}>
        <LinearGradient
          start={{x: 0, y: 2}}
          end={{x: 1, y: 0}}
          colors={[color.color1, color.color2]}
          style={styles.listItem}>
          <Image
            source={
              title.workout_mindset_image_link != null
                ? {uri: title.workout_mindset_image_link}
                : localImage.Noimage
            }
            style={[
              styles.img,
              {
                height: 60,
                width: 60,
                alignSelf: 'center',
              },
            ]}
            resizeMode="contain"></Image>
        </LinearGradient>
        <View style={{marginVertical: 10}}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 13,

              fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
              fontWeight: '500',
              lineHeight: 15,
              color: AppColor.SUBHEADING,
            }}>
            {title?.workout_mindset_title}
          </Text>
        </View>
      </View> */}
    </TouchableOpacity>
  ));
  const emptyComponent = () => {
    return (
      <View
        style={{
          flex: 1,
        }}>
        <AnimatedLottieView
          source={require('../../Icon/Images/NewImage/NoData.json')}
          speed={2}
          autoPlay
          loop
          resizeMode="contain"
          style={{
            width: DeviceWidth * 0.3,
            height: DeviceHeigth * 0.15,
          }}
        />
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <View
          style={{
            width: DeviceWidth * 0.95,
            marginVertical:15,
            flexDirection: 'row',
            alignSelf: 'center',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              color: AppColor.HEADERTEXTCOLOR,
              fontFamily: Fonts.MONTSERRAT_BOLD,
              fontWeight: '600',
              lineHeight: 30,
              fontSize: 18,
            }}>
            Focus Mind
          </Text>
          <TouchableOpacity
            onPress={() => {
              viewMorePress();
            }}
            activeOpacity={0.5}
            style={{}}>
            <Text
              style={{
                fontFamily: Fonts.HELVETICA_REGULAR,
                fontSize: 14,
                lineHeight: 20,
                color: AppColor.SecondaryTextColor,
                textDecorationLine:'underline'
              }}>
              View More
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={[
            styles.meditionBox,
            
          ]}>
          {allWorkoutData?.mindset_workout_data?.length > 0 ? (
            <FlatList
              data={allWorkoutData?.mindset_workout_data}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              ListEmptyComponent={emptyComponent}
              renderItem={({item, index}) => {
                return <ListItem title={item} />;
              }}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              updateCellsBatchingPeriod={100}
              removeClippedSubviews={true}
            />
          ) : (
            <View>
              <AnimatedLottieView
                source={require('../../Icon/Images/NewImage2/Adloader.json')}
                speed={2}
                autoPlay
                loop
                resizeMode="contain"
                style={{
                  width: DeviceWidth * 0.5,

                  height: DeviceHeigth * 0.1,
                }}
              />
            </View>
          )}
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    width: DeviceWidth,

    backgroundColor: AppColor.WHITE,
    marginVertical: 15,
  },
  box: {
    width: DeviceWidth,

    alignSelf: 'center',
    paddingVertical:0,
  },
  meditionBox: {
    width: '100%',
    alignSelf: 'center',
    // backgroundColor: 'white',

    alignItems: 'center',
  },
});
export default FocuseMind;
