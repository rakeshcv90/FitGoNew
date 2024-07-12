import {View, Text, StyleSheet, Modal, StatusBar, Image} from 'react-native';
import React, {useState} from 'react';
import {AppColor, Fonts} from './Color';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {DeviceHeigth, DeviceWidth} from './Config';
import {localImage} from './Image';
import Octicons from 'react-native-vector-icons/Octicons';
import NewButton from './NewButton';
import {
  APP_STORE_LINK,
  PLAY_STORE_LINK,
} from './ReviewApp';
import {Platform} from 'react-native';
import {Linking} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {setRatingTrack} from './ThemeRedux/Actions';
const RatingModal = ({getVisibility,setModalVisibilty}) => {
  const [rating, setRating] = useState(3);
  const getRatingStatus=useSelector(state=>state?.getRatingStatus);
  const [visibiltity,setVisibility]=useState(getRatingStatus)
  const dispatch = useDispatch();
  const dataArray = [
    {
      id: 0,
      txt1: ' Lorem Ipsum is simply dummy text of the printing.',
      img: localImage.Rating1,
      txt2: 'Disappointed',
      startCount: 1,
    },
    {
      id: 1,
      txt1: ' Lorem Ipsum is simply dummy text of the printing.',
      img: localImage.Rating2,
      txt2: 'Unhappy',
      startCount: 2,
    },
    {
      id: 2,
      txt1: ' Lorem Ipsum is simply dummy text of the printing.',
      img: localImage.Rating3,
      txt2: 'Cool',
      startCount: 3,
    },
    {
      id: 3,
      txt1: ' Lorem Ipsum is simply dummy text of the printing.',
      img: localImage.Rating4,
      txt2: 'Great',
      startCount: 4,
    },
    {
      id: 4,
      txt1: ' Lorem Ipsum is simply dummy text of the printing.',
      img: localImage.Rating5,
      txt2: 'Awesome',
      startCount: 5,
    },
  ];
  const [getImage, setImage] = useState(dataArray[2]?.img);
  const [getTxt2, setTxt2] = useState(dataArray[2]?.txt2);
  const star = [1, 2, 3, 4, 5];
  const handleRating = index => {
    setRating(index + 1);
    setTxt2(dataArray[index]?.txt2);
    setImage(dataArray[index]?.img);
  };
  const openPlayStoreForRating = () => {
    const storeUrl = Platform.OS == 'ios' ? APP_STORE_LINK : PLAY_STORE_LINK;
      Linking.openURL(storeUrl)
        .then(() => {
          setModalVisibilty?
          setModalVisibilty(false)
          :
          dispatch(setRatingTrack(true));
          setVisibility(true);
          console.log('opnend', getRatingStatus,visibiltity);
        })
        .catch(err => {
          console.error('Error opening Play Store:', err);
        });
  };
  return (
    <Modal transparent visible={getVisibility?getVisibility:!visibiltity} animationType='slide'>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={AppColor.RATING_COLOR}
      />
      <View style={styles.View1}>
        <MaterialIcons
          name="close"
          color={AppColor.BLACK}
          size={25}
          style={styles.Icon1}
          onPress={() => {
           setModalVisibilty? setModalVisibilty(false): setVisibility(true); // if state is true means visibility will be disappeared temp.
          }}
        />
        <Text style={styles.txt1}>
          {
            'Love our app? Rate us and share your feedback to help us improve and keep you motivated!'
          }
        </Text>
        <View style={styles.View2}>
          <Image source={getImage} style={styles.image1} resizeMode="contain" />
        </View>
        <Text
          style={{
            alignSelf: 'center',
            color: AppColor.BLACK,
            fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
            fontSize: 16,
          }}>
          {getTxt2}
        </Text>
        <View style={styles.View3}>
          {star.map((value, index) => (
            <View key={index}>
              <Octicons
                name={value <= rating ? 'star-fill' : 'star'}
                color={AppColor.BLACK}
                size={value <= rating ? 28 : 26}
                style={{margin: 8, marginVertical: DeviceWidth * 0.07}}
                onPress={() => handleRating(index)}
              />
            </View>
          ))}
        </View>
        <NewButton
          ButtonWidth={DeviceWidth * 0.9}
          buttonColor={AppColor.BLACK}
          bR={5}
          title={'Submit'}
          pV={14}
          position={'absolute'}
          bottom={DeviceHeigth * 0.05}
          onPress={openPlayStoreForRating}
        />
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  View1: {
    flex: 1,
    backgroundColor: AppColor.RATING_COLOR,
  },
  Icon1: {alignSelf: 'flex-end', marginRight: 16, marginTop:Platform.OS=='android'?20:DeviceHeigth*0.06},
  txt1: {
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontSize: 20,
    width: DeviceWidth * 0.95,
    alignSelf: 'center',
    textAlign: 'center',
    color: AppColor.BLACK,
    marginVertical: DeviceWidth * 0.09,
  },
  image1: {
    width: '100%',
    height: '100%',
    alignSelf: 'center',
  },
  View2: {
    width: DeviceWidth * 0.9,
    height: DeviceHeigth * 0.4,
    alignSelf: 'center',
  },
  View3: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
});
export default RatingModal;
