import {
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {FC} from 'react';
import {AppColor} from './Color';
import {DeviceHeigth, DeviceWidth} from './Config';
import {localImage} from './Image';
import {navigationRef} from '../../App';

export type Props = {
  viewAllButton?: boolean;
  data: Array<any>;
  headText?: string;
  viewAllPress?: () => void;
};

const MediumRounded: FC<Props> = ({...props}) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text
          style={[
            styles.category,
            {
              fontWeight: 'bold',
              color: AppColor.BLACK,
              fontSize: 18,
              fontFamily: 'Montserrat',
            },
          ]}>
          {props.headText ? props.headText : 'Category'}
        </Text>
        {props.viewAllButton && (
          <Text
            onPress={props.viewAllPress}
            style={[
              styles.category,
              {
                fontFamily: 'Montserrat-SemiBold',
                fontWeight: '600',
                color: AppColor.RED1,
                fontSize: 12,
                lineHeight: 14,
              },
            ]}>
            View All
          </Text>
        )}
      </View>
      <View
        style={{
          height: DeviceWidth / 2,
          width: 'auto',
        }}>
        <FlatList
          data={props.data}
          nestedScrollEnabled
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          renderItem={({item, index}: any) => {
            let totalTime = 0;
            for (const day in item?.days) {
              if (day != 'Rest') {
                totalTime = totalTime + parseInt(item?.days[day]?.total_rest);
              }
            }
            return (
              <View
                style={{
                  height: DeviceWidth * 0.4,
                }}>
                <TouchableOpacity
                  onPress={() =>
                    navigationRef.current?.navigate('WorkoutDays', {data: item, challenge: false})
                  }
                  activeOpacity={0.8}
                  style={[
                    styles.box,
                    {
                      width: DeviceWidth * 0.6,
                      justifyContent: 'center',
                      marginLeft: index == 0 ? 5 : 10,
                    },
                  ]}>
                  {/* <Image
                    source={
                      item.workout_price == 'Premium'
                        ? require('../Icon/Images/NewImage/premium.png')
                        : require('../Icon/Images/NewImage/free.png')
                    }
                    resizeMode="contain"
                    style={{
                      width: 100,
                      height: 50,
                      top:
                        Platform.OS == 'android'
                          ? DeviceHeigth * 0.01
                          : DeviceHeigth >= 1024
                          ? -DeviceHeigth * 0.007
                          : DeviceHeigth >= 932
                          ? DeviceHeigth * 0.005
                          : DeviceHeigth * 0.005,
                      left:
                        Platform.OS == 'android'
                          ? -DeviceWidth * 0.18
                          : DeviceWidth >= 768
                          ? -DeviceWidth * 0.24
                          : DeviceHeigth >= 932
                          ? -DeviceWidth * 0.195
                          : -DeviceWidth * 0.18,
                    }}></Image> */}

                  <Image
                    source={{uri: item?.workout_image_link}}
                    style={{
                      height: DeviceWidth * 0.3,
                      width: DeviceWidth * 0.55,
                      //top: -15,
                    }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
                <Text
                  style={[styles.category, {fontSize: 14, marginLeft: 10}]}
                  ellipsizeMode="tail"
                  numberOfLines={1}>
                  {item?.workout_title}
                </Text>
           
              </View>
            );
          }}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={100}
          removeClippedSubviews={true}
        />
      </View>
    </View>
  );
};

export default MediumRounded;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: AppColor.WHITE,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  category: {
    fontFamily: 'Poppins',
    fontSize: 16,
    fontWeight: '600',
    color: AppColor.BoldText,
    lineHeight: 30,
  },
  box: {
    backgroundColor: AppColor.WHITE,
    height: DeviceWidth * 0.35,
    alignItems: 'center',
    borderRadius: 10,
    marginRight: 8,
    marginTop: 10,
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0, 0, 0, 0.6)',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.3,
        // shadowRadius: 10,
      },
      android: {
        elevation: 3,
        shadowColor: 'rgba(0, 0, 0, 0.6)',
        shadowOffset: {width: 5, height: 5},
        shadowOpacity: 0.9,
        // shadowRadius: 10,
      },
    }),
  },
});
