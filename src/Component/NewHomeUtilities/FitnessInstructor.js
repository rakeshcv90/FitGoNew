import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import React, { useEffect } from 'react';
import {DeviceHeigth, DeviceWidth} from '../Config';
import {AppColor, Fonts} from '../Color';
import {AnalyticsConsole} from '../AnalyticsConsole';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import { AddCountFunction } from '../Utilities/AddCountFunction';
import { MyInterstitialAd } from '../BannerAdd';

const FitnessInstructor = () => {
  const navigation = useNavigation();
  const {initInterstitial, showInterstitialAd} = MyInterstitialAd();
  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      initInterstitial();
    }
  }, [isFocused]);
  let fitnessInstructor = [
    {
      id: 1,
      title: 'Mary',
      img: require('../../Icon/Images/NewImage2/mary.png'),
      language: Platform.OS == 'android' ? 'hi-IN' : 'el-GR',
      languageId:
        Platform.OS == 'android'
          ? 'hi-in-x-hia-local'
          : 'com.apple.ttsbundle.Moira-compact',
    },
    {
      id: 2,
      title: 'Arnold',
      img: require('../../Icon/Images/NewImage2/arnold.png'),
      language: Platform.OS == 'android' ? 'en-US' : 'el-GR',
      languageId:
        Platform.OS == 'android'
          ? 'en-us-x-iol-local'
          : 'com.apple.ttsbundle.Daniel-compact',
    },
    {
      id: 3,
      title: 'Rock',
      img: require('../../Icon/Images/NewImage2/rocky.png'),
      language: Platform.OS == 'android' ? 'en-US' : 'el-GR',
      languageId:
        Platform.OS == 'android'
          ? 'en-us-x-iol-local'
          : 'com.apple.ttsbundle.siri_male_de-DE_compact',
    },
    {
      id: 4,
      title: 'Chris',
      img: require('../../Icon/Images/NewImage2/Chris.png'),
      language: Platform.OS == 'android' ? 'en-IN' : 'en-US',
      languageId:
        Platform.OS == 'android'
          ? 'en-in-x-ene-network'
          : 'com.apple.ttsbundle.siri_male_fr-FR_compact',
    },
    {
      id: 5,
      title: 'Clare',
      img: require('../../Icon/Images/NewImage2/Clare.png'),
      language: Platform.OS == 'android' ? 'en-US' : 'en-Au',
      languageId:
        Platform.OS == 'android'
          ? 'es-us-x-sfb-local'
          : 'com.apple.ttsbundle.Karen-compact',
    },
  ];
  const MyStoreItem = React.memo(({item, index}) => {
    return (
      <>
        <TouchableOpacity
          style={[styles.listItem2]}
          onPress={() => {
            AnalyticsConsole(`AI_TRAINER_BUTTON`);
            let checkAdsShow = AddCountFunction();
            if (checkAdsShow == true) {
              showInterstitialAd();
              navigation.navigate('AITrainer', {item: item});
            } else {
              navigation.navigate('AITrainer', {item: item});
            }
          }}
          >
          <Image
            source={item?.img}
            style={[
              styles.img,
              {
                height: 90,
                width: 90,
                borderRadius: 180 / 2,
                alignSelf: 'center',
                top: -5,
              },
            ]}
            resizeMode="cover"></Image>

          <Text
            numberOfLines={1}
            style={[
              styles.title,
              {
                fontSize: 13,
                fontWeight: '600',
                lineHeight: 20,
                fontFamily: 'Montserrat-SemiBold',
                textAlign: 'center',
                width: 100,
                color: '#505050',
              },
            ]}>
            {item?.title}
          </Text>
        </TouchableOpacity>
      </>
    );
  });
  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <View
          style={{
            width: DeviceWidth * 0.95,
            marginVertical:15,
            alignSelf: 'center',
          }}>
          <Text
            style={{
              fontFamily: Fonts.HELVETICA_BOLD,
              fontSize: 16,
              fontWeight: '700',
              lineHeight: 20,
              color: AppColor.PrimaryTextColor,
            }}>
            Fitness Instructor
          </Text>
        </View>

        <View
          style={[
            styles.meditionBox,
            //
          ]}>
          <FlatList
            data={fitnessInstructor}
            horizontal
            contentContainerStyle={{paddingRight: DeviceHeigth * 0.05}}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            pagingEnabled
            renderItem={({item, index}) => (
              <MyStoreItem item={item} index={index} />
            )}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            updateCellsBatchingPeriod={100}
            removeClippedSubviews={true}
          />
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    width: DeviceWidth,
    backgroundColor: AppColor.WHITE,
    marginVertical: 5,
  },
  box: {
    width: DeviceWidth,
    alignSelf: 'center',
    paddingVertical: 0,
  },
  meditionBox: {
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
  },
  listItem2: {
    marginHorizontal: 10,
    borderRadius: 10,
    padding:10,

    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColor.Background_New,
    marginBottom: 30,
  },
});
export default FitnessInstructor;
