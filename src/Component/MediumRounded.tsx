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

export type Props = {
  viewAllButton?: boolean;
  data: Array<any>;
  headText?: string;
};

const MediumRounded: FC<Props> = ({...props}) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.category}>
          {props.headText ? props.headText : 'Category'}
        </Text>
        {props.viewAllButton && (
          <Text
            //   onPress={}
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
            return (
              <View
                style={{
                  height: DeviceWidth * 0.4,
                }}>
                <TouchableOpacity
                  onPress={() => null}
                  activeOpacity={0.8}
                  style={[
                    styles.box,
                    {
                      width: DeviceWidth * 0.6,
                      justifyContent: 'center',
                      marginLeft: index == 0 ? 5 : 10,
                    },
                  ]}>
                  <Image
                    source={item?.image}
                    style={{
                      height: DeviceWidth * 0.35,
                      width: DeviceWidth * 0.6,
                    }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
                <Text style={[styles.category, {fontSize: 14}]}>
                  {item?.name}
                </Text>
              </View>
            );
          }}
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
        elevation: 10,
        shadowColor: 'rgba(0, 0, 0, 0.6)',
        shadowOffset: {width: 5, height: 5},
        shadowOpacity: 0.9,
        // shadowRadius: 10,
      },
    }),
  },
});
