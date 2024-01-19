import {
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {FC, useState} from 'react';
import {AppColor} from './Color';
import {DeviceHeigth, DeviceWidth} from './Config';
import {localImage} from './Image';
import {navigationRef} from '../../App';
import WorkoutDescription from '../Screen/NewWorkouts/WorkoutsDescription';

export type Props = {
  viewAllButton?: boolean;
  data: Array<any>;
  trackerData: Array<any>;
  horizontal: boolean;
  headText?: string;
  viewAllPress?: () => void;
  type?: 'core' | 'category';
};

const RoundedCards: FC<Props> = ({...props}) => {
  const [open, setOpen] = useState(false);
  const [desc, setDesc] = useState([]);
  return (
    <>
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
            data={props.data}
            nestedScrollEnabled
            keyExtractor={(item, index) => index.toString()}
            horizontal={props.horizontal}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            renderItem={({item, index}: any) => {
              if (props.type == 'core' && index <= 4) return;
              else if (props.type == 'core' && index > 9) return;
              if (props.type == 'category' && index > 4) return;
              let totalTime = 0;
              for (const day in item?.days) {
                if (day != 'Rest') {
                  totalTime = totalTime + parseInt(item?.days[day]?.total_rest);
                }
              }
              return (
                <TouchableOpacity
                  onPress={() =>
                    navigationRef.current?.navigate('WorkoutDays', {data: item})
                  }
                  activeOpacity={0.8}
                  style={[
                    styles.box,
                    {
                      width: props?.horizontal
                        ? DeviceWidth / 4
                        : DeviceWidth * 0.92,
                      flexDirection: props?.horizontal ? 'column' : 'row',
                      justifyContent: props?.horizontal
                        ? 'center'
                        : 'space-between',
                      marginLeft: props.horizontal ? (index == 0 ? 5 : 10) : 3,
                      // marginBottom:index===data.lenght-1?
                    },
                  ]}>
                  {
                    <Image
                      source={{uri: item?.workout_image_link}}
                      style={{
                        height: DeviceWidth / 6,
                        width: props.horizontal
                          ? DeviceWidth / 6
                          : DeviceWidth / 3,
                      }}
                      resizeMode="contain"
                    />
                  }
                  {props?.trackerData?.includes(item?.workout_id) && (
                    <Image
                      source={localImage.Complete}
                      style={{
                        height: 40,
                        width: 40,
                        marginLeft: -DeviceWidth * 0.1,
                        marginTop: -DeviceWidth * 0.1,
                      }}
                      resizeMode="contain"
                    />
                  )}
                  {props.horizontal ? (
                    <Text
                      style={[styles.category, {fontSize: 14, width: '80%'}]}
                      ellipsizeMode="tail"
                      numberOfLines={1}>
                      {item?.workout_title}
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
                        <Text
                          style={[styles.category]}
                          numberOfLines={2}
                          ellipsizeMode="tail">
                          {item?.workout_title}
                        </Text>
                        <Text style={[styles.category, {fontSize: 14}]}>
                          {/* {!isNaN(totalTime) ? totalTime : 0} */}
                          {!isNaN(totalTime)
                            ? totalTime > 60
                              ? `${(totalTime / 60).toFixed(0)} min`
                              : `${totalTime} sec`
                            : 0}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => {
                          setDesc(item);
                          setOpen(true);
                        }}>
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
      <WorkoutDescription open={open} setOpen={setOpen} data={desc} />
    </>
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
