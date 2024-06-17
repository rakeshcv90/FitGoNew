import {
  FlatList,
  Image,
  ImageBackground,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {AppColor, Fonts, PLATFORM_IOS} from '../../Component/Color';
import DietPlanHeader from '../../Component/Headers/DietPlanHeader';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../Component/Config';
import {useDispatch, useSelector} from 'react-redux';
import {localImage} from '../../Component/Image';
import FitText from '../../Component/Utilities/FitText';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import VersionNumber from 'react-native-version-number';
import FitIcon from '../../Component/Utilities/FitIcon';
import AnimatedLottieView from 'lottie-react-native';
import FastImage from 'react-native-fast-image';

type TypeData = {
  name: string;
  fit_coins: number;
  id: number;
  image: string | null;
  rank: number;
  image_path: string | null;
};
const Leaderboard = ({navigation, route}: any) => {
  const getUserDataDetails = useSelector(
    (state: any) => state.getUserDataDetails,
  );
  const dispatch = useDispatch();
  const [mainData, setMainData] = useState<Array<TypeData>>([]);
  const [otherData, setOtherData] = useState<Array<TypeData>>([]);
  const [refresh, setRefresh] = useState(false);
  const [loader, setLoader] = useState(false);
  useEffect(() => {
    setLoader(true);
    getLeaderboardDataAPI();
  }, []);

  const getLeaderboardDataAPI = async () => {
    try {
      const result = await axios({
        // url: `${NewAppapi.GET_LEADERBOARD}?user_id=${getUserDataDetails?.id}&version=${appVersion}`,
        url: `${NewAppapi.GET_LEADERBOARD}?user_id=${getUserDataDetails?.id}&version=${VersionNumber.appVersion}`,
      });
      if (result.data) {
        const top5 = result.data?.data?.filter((item: any) => item?.rank <= 5);
        const after5 = result.data?.data?.filter((item: any) => item?.rank > 5);
        setMainData(top5);
        setOtherData(after5);
        // console.log(result.data);
        const myRank = result.data?.data?.findIndex(
          (item: TypeData) => item?.id == getUserDataDetails?.id,
        );
      }
      setLoader(false);
      setRefresh(false);
    } catch (error) {
      console.log(error);
      setLoader(false);
      setRefresh(false);
    }
  };

  const renderItem = useMemo(
    () =>
      ({item, index}: any) => {
        if (index > 4 || item?.rank == 1) return null;
        const Name = item?.name.substring(0, 1);
        return (
          <View
            style={[
              styles.itemContainer,
              {
                borderWidth: item?.id == getUserDataDetails?.id ? 1 : 0,
                borderColor:
                  item?.id == getUserDataDetails?.id
                    ? AppColor.ORANGE
                    : AppColor.WHITE,
              },
            ]}>
            {item?.id == getUserDataDetails?.id && (
              <FitIcon
                name="arrow-right"
                size={50}
                type="MaterialIcons"
                style={{
                  position: 'absolute',
                  left: -42,
                  top: -25,
                  color: AppColor.ORANGE,
                }}
              />
            )}
            <View style={{width: '12%', marginLeft: 5}}>
              <FitText
                type="Heading"
                value={item?.rank}
                color={AppColor.NEW_DARK_RED}
                fontSize={14}
              />
            </View>
            {item?.image_path == null ? (
              <View
                style={[
                  styles.row,
                  {
                    width: '52%',
                    marginHorizontal: 20,
                  },
                ]}>
                <ImageBackground
                  source={localImage.PinkGradient}
                  imageStyle={styles.mainImage}
                  resizeMode="contain"
                  style={{
                    height: 40,
                    width: 40,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 10,
                    borderWidth: 0,
                  }}>
                  <FitText
                    type="SubHeading"
                    value={Name}
                    color={AppColor.WHITE}
                    textTransform="uppercase"
                  />
                </ImageBackground>

                <FitText
                  type="SubHeading"
                  value={item?.name}
                  textTransform="capitalize"
                  w="80%"
                />
              </View>
            ) : (
              <View
                style={[
                  styles.row,
                  {
                    width: '52%',
                    marginHorizontal: 20,
                  },
                ]}>
                <FastImage
                  style={styles.mainImage}
                  source={{
                    uri: item?.image_path,
                    headers: {Authorization: 'someAuthToken'},
                    priority: FastImage.priority.high,
                  }}
                  resizeMode={FastImage.resizeMode.contain}
                  defaultSource={localImage.NOWORKOUT}
                />
                <FitText
                  type="SubHeading"
                  value={item?.name}
                  textTransform="capitalize"
                  w="80%"
                />
              </View>
            )}
            <View style={styles.coinView}>
              <LinearGradient
                colors={['#FFB400B2', '#F38029']}
                start={{x: 0, y: 1}}
                end={{x: 1, y: 1}}
                style={styles.coinGradient}>
                <Image
                  source={localImage.Coin}
                  style={styles.coinImage}
                  resizeMode="contain"
                />
                <FitText
                  type="SubHeading"
                  value={`${item?.fit_coins}`}
                  color={AppColor.WHITE}
                  fontSize={14}
                />
              </LinearGradient>
            </View>
          </View>
        );
      },
    [],
  );

  const LoaderLottie = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <AnimatedLottieView
          source={require('../../Icon/Images/NewImage2/Adloader.json')}
          speed={2}
          autoPlay
          loop
          resizeMode="contain"
          style={{
            width: DeviceWidth * 0.5,
            height: DeviceHeigth * 0.5,
          }}
        />
      </View>
    );
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: AppColor.WHITE}}>
      <DietPlanHeader
        header="Leaderboard"
        h={DeviceWidth * 0.15}
        paddingTop={PLATFORM_IOS ? DeviceHeigth * 0.025 : DeviceHeigth * 0.02}
        shadow
      />
      {loader ? (
        <LoaderLottie />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refresh}
              onRefresh={getLeaderboardDataAPI}
              colors={[AppColor.RED, AppColor.RED]}
            />
          }>
          <ImageBackground
            source={localImage.Rank1background}
            imageStyle={{width: DeviceWidth, height: DeviceWidth / 2}}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              width: DeviceWidth,
              marginBottom: 20,
              paddingVertical: 10,
            }}>
            <LinearGradient
              colors={['#FFB400B2', '#F38029']}
              start={{x: 0, y: 1}}
              end={{x: 1, y: 1}}
              style={{
                width: DeviceWidth * 0.25,
                borderRadius: 20,
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 2,
              }}>
              <FitText
                type="SubHeading"
                value="RANK: 1"
                color={AppColor.WHITE}
                fontSize={14}
              />
            </LinearGradient>
            <ImageBackground
              source={localImage.BlueGradient}
              imageStyle={{
                width: 75,
                height: 75,
              }}
              resizeMode="contain"
              style={{
                height: 75,
                width: 75,
                justifyContent: 'center',
                alignItems: 'center',
                marginVertical: 5,
              }}>
              {mainData[0]?.image_path == null ? (
                <FitText
                  type="Heading"
                  value={mainData[0]?.name.substring(0, 1)}
                  color={AppColor.WHITE}
                  textTransform="uppercase"
                  fontSize={30}
                  lineHeight={40}
                />
              ) : (
                <FastImage
                  style={{
                    width: 67,
                    height: 67,
                    borderRadius: 70,
                  }}
                  source={{
                    uri: mainData[0]?.image_path,
                    headers: {Authorization: 'someAuthToken'},
                    priority: FastImage.priority.high,
                  }}
                  resizeMode={FastImage.resizeMode.cover}
                  defaultSource={localImage.NOWORKOUT}
                />
              )}
            </ImageBackground>
            <FitText
              type="SubHeading"
              value={`Player: ${mainData[0]?.name}`}
              color="#333333"
            />
            <FitText
              type="Heading"
              value={`${mainData[0]?.fit_coins} coins`}
              color="#F38029"
              fontFamily={Fonts.MONTSERRAT_SEMIBOLD}
            />
          </ImageBackground>
          <FlatList data={mainData} renderItem={renderItem} />
          {otherData.length > 0 && (
            <>
              <Image
                source={localImage.Top5Boundary}
                resizeMode="contain"
                style={{
                  width: DeviceWidth * 0.9,
                  alignSelf: 'center',
                  marginVertical: (DeviceWidth * 0.1) / 2,
                }}
              />
              <FlatList
                data={otherData}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
              />
            </>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default Leaderboard;

const styles = StyleSheet.create({
  itemContainer: {
    // flex: 1,
    backgroundColor: '#F9F9F9',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 5,
    padding: 20,
    borderRadius: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  coinView: {
    width: DeviceWidth * 0.2,
    overflow: 'visible',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coinGradient: {
    flexDirection: 'row',
    width: DeviceWidth * 0.15,
    borderRadius: 5,
    justifyContent: 'space-between',
    alignItems: 'center',
    // zIndex: -1,
    padding: 5,
    // paddingVertical: 2,
    // marginRight: DeviceWidth * 0.05,
  },
  coinImage: {
    height: 25,
    width: 25,
    // marginRight: 10,
    // right: -DeviceWidth * 0.08,
    // zIndex: 1,
  },
  mainImage: {
    borderWidth: 0.5,
    borderColor: '#3333334D',
    borderRadius: 20,
    height: 40,
    width: 40,
    marginRight: 10,
  },
});
