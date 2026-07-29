/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Platform,
} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {DeviceHeigth, DeviceWidth} from '../Config';
import {AppColor, Fonts} from '../Color';
import analytics from '@react-native-firebase/analytics';
import {AddCountFunction} from '../Utilities/AddCountFunction';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {showMessage} from 'react-native-flash-message';
import AnimatedLottieView from 'lottie-react-native';
import {AnalyticsConsole} from '../AnalyticsConsole';
import {localImage} from '../Image';
import {translate} from '../../Screen/Translation/TranslationService';
import FitIcon from '../Utilities/FitIcon';

const GRADIENTS = [
  ['#FF5E7E', '#FF8E53'],
  ['#8E2DE2', '#5B21B6'],
  ['#10B981', '#059669'],
  ['#2563EB', '#1D4ED8'],
  ['#F59E0B', '#D97706'],
];

const FocuseMind = () => {
  const allWorkoutData = useSelector(state => state.allWorkoutData);
  const navigation = useNavigation();

  const viewMorePress = () => {
    analytics().logEvent('CV_FITME_CLICKED_ON_MEDITATION');
    let checkAdsShow = AddCountFunction();
    if (allWorkoutData?.mindset_workout_data?.length > 0) {
      if (checkAdsShow == true) {
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

  const ListItem = React.memo(({title, index}: {title: any; index: number}) => {
    const gradientColors = GRADIENTS[index % GRADIENTS.length];

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => {
          AnalyticsConsole(`MediDetails`);
          let checkAdsShow = AddCountFunction();
          if (checkAdsShow == true) {
            navigation.navigate('MeditationDetails', {item: title});
          } else {
            navigation.navigate('MeditationDetails', {item: title});
          }
        }}
        style={styles.cardItem}>
        <View style={styles.cardWrapper}>
          <LinearGradient
            colors={gradientColors}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.gradientRing}>
            <View style={styles.imageInnerContainer}>
              <Image
                source={
                  title.workout_mindset_image_link != null
                    ? {uri: title.workout_mindset_image_link}
                    : localImage.Noimage
                }
                style={styles.cardImage}
                resizeMode="cover"
              />
            </View>
          </LinearGradient>

          <View style={styles.playBadge}>
            <FitIcon
              type="MaterialCommunityIcons"
              name="play"
              size={12}
              color="#FFFFFF"
            />
          </View>
        </View>

        <Text numberOfLines={1} style={styles.cardTitle}>
          {title?.workout_mindset_title}
        </Text>
      </TouchableOpacity>
    );
  });

  const emptyComponent = () => {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
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
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>
            {translate('focusmind')}
          </Text>
          <TouchableOpacity
            onPress={() => viewMorePress()}
            activeOpacity={0.7}
            style={styles.viewMorePill}>
            <Text style={styles.viewMoreText}>
              {translate('viewmore')}
            </Text>
            <FitIcon
              type="MaterialCommunityIcons"
              name="chevron-right"
              size={16}
              color={AppColor.RED}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.meditionBox}>
          {allWorkoutData?.mindset_workout_data?.length > 0 ? (
            <FlatList
              data={allWorkoutData?.mindset_workout_data}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{paddingHorizontal: 14, paddingVertical: 6}}
              keyExtractor={(item, index) => index.toString()}
              ListEmptyComponent={emptyComponent}
              renderItem={({item, index}) => (
                <ListItem title={item} index={index} />
              )}
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

export default FocuseMind;

const styles = StyleSheet.create({
  container: {
    width: DeviceWidth,
    marginVertical: 10,
  },
  box: {
    width: DeviceWidth * 0.95,
    alignSelf: 'center',
    backgroundColor: AppColor.WHITE,
    borderRadius: 18,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.04,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  headerRow: {
    width: '92%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  headerTitle: {
    color: '#1F2937',
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
    fontSize: 17,
  },
  viewMorePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1F2',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
  },
  viewMoreText: {
    fontFamily: Fonts.HELVETICA_REGULAR,
    fontSize: 12,
    fontWeight: '700',
    color: AppColor.RED,
  },
  meditionBox: {
    width: '100%',
  },
  cardItem: {
    alignItems: 'center',
    marginRight: 16,
    width: 82,
  },
  cardWrapper: {
    position: 'relative',
    width: 76,
    height: 76,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientRing: {
    width: 76,
    height: 76,
    borderRadius: 38,
    padding: 3,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.12,
        shadowRadius: 5,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  imageInnerContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 35,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  playBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: AppColor.RED,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cardTitle: {
    fontFamily: Fonts.MONTSERRAT_BOLD,
    color: '#1F2937',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 8,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
});
