import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, {useState} from 'react';
import NewHeader from '../Component/Headers/NewHeader';
import {DeviceHeigth, DeviceWidth} from '../Component/Config';
import {localImage} from '../Component/Image';
import {AppColor} from '../Component/Color';

const TestScreen = () => {
  const [imageView, setImageVIew] = useState([]);
  const [listId, setListId] = useState(-1);
  const iddata = [1, 2, 3, 4, 5, 6, 7];
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedItemsName, setSelectedItemsName] = useState([]);
  const buttonName = [
    {
      id: 1,
      text1: 'Chest',
    },
    {
      id: 2,
      text1: 'Shoulder',
    },
    {
      id: 3,
      text1: 'Biceps',
    },
    {
      id: 4,
      text1: 'Abs',
    },
    {
      id: 5,
      text1: 'Triceps',
    },
    {
      id: 6,
      text1: 'Legs',
    },
    {
      id: 7,
      text1: 'Back',
    },
  ];
  const buttonName1 = [
    {
      id: 1,
      text1: 'Chest',
    },
    {
      id: 2,
      text1: 'Shoulder',
    },
    {
      id: 3,
      text1: 'Biceps',
    },
    {
      id: 4,
      text1: 'Abs',
    },
    {
      id: 5,
      text1: 'Triceps',
    },
    {
      id: 6,
      text1: 'Legs',
    },
    {
      id: 7,
      text1: 'Back',
    },
  ];
  const setImageFocusArea = (itemId,item) => {
    const index = selectedItems.indexOf(itemId);
    if (index === -1) {
      setSelectedItems([...selectedItems, itemId]);
      setImageVIew([...selectedItems, itemId]);

    } else {
      const newSelectedItems = [...selectedItems];
      newSelectedItems.splice(index, 1);
      setSelectedItems(newSelectedItems);
      setImageVIew(newSelectedItems);

    }

  };


  return (
    <View>
      <SafeAreaView>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: DeviceHeigth * 0.07,
          }}>
          <Text style={styles.textStyle}>What’s your Focus Area?</Text>

          <Text style={styles.LoginText2}>
            This helps us create to your personalized plan
          </Text>
        </View>
        <View style={styles.imageView}>
          <View
            style={{
              width: DeviceWidth / 2,
              height: DeviceHeigth * 0.7,

              alignItems: 'flex-end',
            }}>
            <View
              style={{top: DeviceHeigth * 0.15, height: DeviceHeigth * 0.7}}>
              <FlatList
                data={buttonName}
                extraData={({item, index}) => index.toString()}
                renderItem={({item, index}) => {
                  const isSelected = selectedItems.includes(item.id);
                  return (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={[styles.buttonView, {marginVertical: 6,borderWidth:isSelected ? 1 : 0}]}
                      onPress={() => {
                        setImageFocusArea(item.id,item.text1);
                      }}>
                      <Text>{item.text1}</Text>
                    </TouchableOpacity>
                  );
                }}
              />
       
            </View>
          </View>
          <View
            style={{
              width: DeviceWidth / 2,
              height: DeviceHeigth * 0.7,
            }}>
            <Image
              source={localImage.Focus}
              style={styles.Image}
              resizeMode="contain"
            />
          </View>
          {imageView != 0 && (
            <View>
              {imageView.find((num) => num === 1)&& (
                <View
                  style={{
                    width: 30,
                    height: 30,
                    position: 'absolute',
                    right: DeviceWidth * 0.31,
                    top: DeviceHeigth * 0.19,
                  }}>
                  <Image
                    source={localImage.Ellipse}
                    style={styles.Image2}
                    resizeMode="contain"
                  />
                </View>
              )}
              {imageView.find((num) => num === 2) && (
                <View
                  style={{
                    width: 30,
                    height: 30,
                    position: 'absolute',
                    right: DeviceWidth * 0.39,
                    top: DeviceHeigth * 0.17,
                  }}>
                  <Image
                    source={localImage.Ellipse}
                    style={[
                      styles.Image2,
                      {
                        width: DeviceWidth * 0.15,
                        height: DeviceHeigth * 0.07,
                        marginLeft: DeviceWidth * 0.02,
                      },
                    ]}
                    resizeMode="contain"
                  />
                </View>
              )}
              {imageView.find((num) => num === 3) && (
                <View
                  style={{
                    width: 30,
                    height: 30,
                    position: 'absolute',
                    right: DeviceWidth * 0.2,
                    top: DeviceHeigth * 0.23,
                  }}>
                  <Image
                    source={localImage.Ellipse}
                    style={[
                      styles.Image2,
                      {
                        width: DeviceWidth * 0.15,
                        height: DeviceHeigth * 0.07,
                        marginLeft: DeviceWidth * 0.02,
                      },
                    ]}
                    resizeMode="contain"
                  />
                </View>
              )}
              {imageView.find((num) => num === 4) && (
                <View
                  style={{
                    width: 30,
                    height: 30,
                    position: 'absolute',
                    right: DeviceWidth * 0.31,
                    top: DeviceHeigth * 0.24,
                  }}>
                  <Image
                    source={localImage.Ellipse}
                    style={[
                      styles.Image2,
                      {
                        marginLeft: DeviceWidth * 0.02,
                      },
                    ]}
                    resizeMode="contain"
                  />
                </View>
              )}
              {imageView.find((num) => num === 5) && (
                <View
                  style={{
                    width: 30,
                    height: 30,
                    position: 'absolute',
                    right: DeviceWidth * 0.2,
                    top: DeviceHeigth * 0.23,
                  }}>
                  <Image
                    source={localImage.Ellipse}
                    style={[
                      styles.Image2,
                      {
                        width: DeviceWidth * 0.15,
                        height: DeviceHeigth * 0.07,
                        marginLeft: DeviceWidth * 0.02,
                      },
                    ]}
                    resizeMode="contain"
                  />
                </View>
              )}
              {imageView.find((num) => num === 6) && (
                <View
                  style={{
                    width: 30,
                    height: 30,
                    position: 'absolute',
                    right: DeviceWidth * 0.4,
                    top: DeviceHeigth * 0.35,
                  }}>
                  <Image
                    source={localImage.Ellipse}
                    style={[
                      styles.Image2,
                      {
                        width: DeviceWidth * 0.15,
                        height: DeviceHeigth * 0.07,
                        marginLeft: DeviceWidth * 0.05,
                      },
                    ]}
                    resizeMode="contain"
                  />
                </View>
              )}
              {imageView.find((num) => num === 7)&& (
                <View
                  style={{
                    width: 30,
                    height: 30,
                    position: 'absolute',
                    right: DeviceWidth * 0.4,
                    top: DeviceHeigth * 0.32,
                  }}>
                  <Image
                    source={localImage.Ellipse}
                    style={[
                      styles.Image2,
                      {
                        width: DeviceWidth * 0.15,
                        height: DeviceHeigth * 0.07,
                        marginLeft: DeviceWidth * 0.02,
                      },
                    ]}
                    resizeMode="contain"
                  />
                </View>
              )}
            </View>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};
const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
  buttonView: {
    width: DeviceWidth * 0.45,
    height: DeviceHeigth * 0.04,
    backgroundColor: AppColor.WHITE,
    marginTop: DeviceHeigth * 0.01,
    borderColor: 'red',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 30,

    shadowColor: 'rgba(0, 0, 0, 1)',
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0, 0, 0, 1)',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 3,
      },
      android: {
        elevation: 4,
        shadowRadius: 3,
      },
    }),
  },
  imageView: {
    flexDirection: 'row',
    width: DeviceWidth,
    height: DeviceHeigth * 0.7,
  },
  shadow: {
    width: DeviceWidth,
  },
  Image: {
    width: DeviceWidth / 2,
    height: DeviceHeigth * 0.7,
    marginLeft: -25,
    marginBottom: 30,
  },
  textStyle: {
    color: 'black',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Poppins',
  },
  LoginText2: {
    fontSize: 16,
    fontFamily: 'Poppins',
    color: '#3A4750',
    lineHeight: 20,
    letterSpacing: 0,
  },
  Image2: {
    width: DeviceWidth * 0.2,
    height: DeviceHeigth * 0.1,
    marginLeft: DeviceWidth * 0.02,
  },
});
export default TestScreen;
