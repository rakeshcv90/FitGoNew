import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Animated,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Image} from 'react-native';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import {AppColor} from '../../Component/Color';
import {localImage} from '../../Component/Image';

const Goal = ({data, selectedImage, setSelectedImage, selectedGender}: any) => {
  const [height, setHeight] = useState(0);
  const animatedHeight = new Animated.Value(height);
  const screenWidth = DeviceWidth * 0.1;
  useEffect(() => {
    // setTimeout(() => {
    //   height >= 100 ? setHeight(0) : setHeight(height + 10);
    // }, 500);
    const animate = () => {
      const heights = Animated.timing(animatedHeight, {
        // toValue: height >= 100 ? 0 : height + 10,
        toValue: height >= screenWidth ? 0 : screenWidth,
        duration: 2000,
        // delay
        useNativeDriver: false, // You need to set this to 'false' for layout animations
      });
      Animated.loop(Animated.sequence([heights])).start();
    };

    animate();
  }, [height, animatedHeight]);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
      }}>
      {data &&
        data?.map((item: any, index: number) => {
          useEffect(() => {
            const prefetchImage = async () => {
              try {
                const image = await Image.prefetch(item.goal_image);
                console.log('Image preloaded:', image);
              } catch (error) {
                console.error('Error prefetching image:', error);
              }
            };

            prefetchImage();
          }, [item.goal_image]);
          if (item.goal_gender != selectedGender) return;
          // console.log(item);
          return (
            <TouchableOpacity
              key={index}
              activeOpacity={0.8}
              onPress={() => setSelectedImage(item?.goal_id)}
              style={[
                styles.box,
                {
                  padding: item?.goal_id == selectedImage ? 18 : 20,
                  paddingRight: index == 0 ? 20 : 10,
                  borderWidth: item?.goal_id == selectedImage ? 1 : 0,
                },
              ]}>
              <Text
                style={{
                  color: '#505050',
                  fontSize: 18,
                  fontWeight: '600',
                  fontFamily: 'Poppins',
                  lineHeight: 27,
                }}>
                {item.goal_title}
              </Text>
              <Image
                source={{uri: item.goal_image}}
                resizeMode="contain"
                style={{
                  height: DeviceHeigth * 0.2,
                  width: DeviceWidth * 0.3,
                  // marginBottom: 25,
                }}
              />

              {/* <View style={{width: '40%'}}>
                <Animated.View
                  style={{
                    width: animatedHeight,
                    backgroundColor: '#fff',
                    height: 10,
                    alignSelf: 'flex-start',
                    borderRadius: 50,
                  }}
                />
              </View> */}
            </TouchableOpacity>
          );
        })}
    </View>
  );
};

export default Goal;

const styles = StyleSheet.create({
  box: {
    width: DeviceWidth * 0.8,
    height: DeviceHeigth / 7,
    borderColor: AppColor.RED,
    borderRadius: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // overflow: 'hidden',
    backgroundColor: '#f5f5f5',
    shadowColor: 'rgba(0, 0, 0, 1)',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
});
