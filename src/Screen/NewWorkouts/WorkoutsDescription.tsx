import {Modal, Platform, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AppColor} from '../../Component/Color';
import {Image} from 'react-native';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';

const WorkoutsDescription = ({navigation, route}: any) => {
  const {data} = route.params;
  const [open, setOpen] = useState(true);
console.log(data)
  return (
    <Modal visible={open} onRequestClose={() => null} animationType="slide">
      <View style={{flex: 1, backgroundColor: AppColor.WHITE}}>
        <Image
          source={{uri: data?.image_path}}
          style={{
            height: DeviceWidth / 2,
            width: DeviceWidth,
            marginTop: DeviceHeigth * 0.1,
          }}
          resizeMode="contain"
        />
        <View style={styles.container}>
            {/* <Text>{data}</Text> */}
        </View>
      </View>
    </Modal>
  );
};

export default WorkoutsDescription;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColor.WHITE,
    alignItems: 'center',
    height: DeviceHeigth * 0.6,
    width: DeviceWidth,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    bottom: 0,
    position: 'absolute',
    padding: 20,
    paddingTop: 50,
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0, 0, 0, 0.6)',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 5,
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
  category: {
    fontFamily: 'Poppins',
    fontSize: 16,
    fontWeight: '600',
    color: AppColor.BoldText,
    lineHeight: 30,
  },
});
