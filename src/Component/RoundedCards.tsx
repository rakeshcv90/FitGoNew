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
import { navigationRef } from '../../App';

export type Props = {
  viewAllButton?: boolean;
  data: Array<any>;
  horizontal: boolean;
  headText?: string;
  viewAllPress?: () => void;
};

const data = [
  {
    id: 1,
    name: 'Cardio',
    image: localImage.Abs,
  },
  {
    id: 2,
    name: 'Workout',
    image: localImage.Abs,
  },
  {
    id: 3,
    name: 'Stretching',
    image: localImage.Abs,
  },
  {
    id: 4,
    name: 'Weights',
    image: localImage.Abs,
  },
  {
    id: 5,
    name: 'Cardio',
    image: localImage.Abs,
  },
  {
    id: 6,
    name: 'Cardio',
    image: localImage.Abs,
  },
];
const RoundedCards: FC<Props> = ({...props}) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.category}>
          {props.headText ? props.headText : 'Category'}
        </Text>
        {props.viewAllButton && (
          <Text
            onPress={props.viewAllPress}
            style={[
              styles.category,
              {fontSize: 12, color: 'rgba(80, 80, 80, 0.6) '},
            ]}>
            View All
          </Text>
        )}
      </View>
      <View
        style={{
          height: props.horizontal ? DeviceWidth / 3 : DeviceHeigth / 2,
          width: 'auto',
        }}>
        <FlatList
          data={props.horizontal ? props.data : props.data}
          nestedScrollEnabled
          keyExtractor={(item, index) => index.toString()}
          horizontal={props.horizontal}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          renderItem={({item, index}: any) => {
            return (
              <TouchableOpacity
                onPress={() => navigationRef.current?.navigate('WorkoutDays',{data: item})}
                activeOpacity={0.8}
                style={[
                  styles.box,
                  {
                    width: props?.horizontal
                      ? DeviceWidth / 4
                      : DeviceWidth * 0.9,
                    flexDirection: props?.horizontal ? 'column' : 'row',
                    justifyContent: props?.horizontal
                      ? 'center'
                      : 'space-between',
                    marginLeft: props.horizontal ? (index == 0 ? 5 : 10) : 3,
                  },
                ]}>
                <Image
                  source={
                    props.horizontal ? item.image : {uri: item?.image_path}
                  }
                  style={{
                    height: DeviceWidth / 6,
                    width: props.horizontal ? DeviceWidth / 6 : DeviceWidth / 3,
                  }}
                  resizeMode="contain"
                />
                {props.horizontal ? (
                  <Text style={[styles.category, {fontSize: 14}]}>
                    {item?.name}
                  </Text>
                ) : (
                  <View
                    style={[
                      {
                        width: DeviceWidth - DeviceWidth / 3,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginLeft: 10,
                      },
                    ]}>
                    <View
                      style={{
                        width: '70%',
                      }}>
                      <Text style={[styles.category]}>
                        {item?.workout_title}
                      </Text>
                      <Text style={[styles.category, {fontSize: 14}]}>
                        {item?.workout_duration}
                      </Text>
                    </View>
                    <TouchableOpacity onPress={() => navigationRef.navigate('WorkoutsDescription',{data: item})} >
                      <Image
                        source={localImage.INFO}
                        style={{
                          width: 20,
                          height: 20,
                          marginRight: DeviceWidth,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </View>
  );
};

export default RoundedCards;

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
    height: DeviceWidth / 4,
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
        elevation: 10,
        shadowColor: 'rgba(0, 0, 0, 0.6)',
        shadowOffset: {width: 5, height: 5},
        shadowOpacity: 0.9,
        // shadowRadius: 10,
      },
    }),
  },
});
