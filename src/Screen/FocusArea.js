import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {AppColor} from '../Component/Color';
import ProgressBar from './Yourself/ProgressBar';
import {DeviceHeigth, DeviceWidth} from '../Component/Config';
import FocuseAreaFmale from '../Component/FocuseAreaFmale';
import {useDispatch, useSelector} from 'react-redux';
import FocuseAreaMale from '../Component/FocuseAreaMale';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import {setLaterButtonData} from '../Component/ThemeRedux/Actions';
import Bulb from './Yourself/Bulb';
const FocusArea = ({route, navigation}) => {
  const dispatch = useDispatch();
  const {nextScreen} = route.params;
  // const {getLaterButtonData} = useSelector(state => state);
  const getLaterButtonData = useSelector(state => state.getLaterButtonData);
  const [screen, setScreen] = useState(nextScreen);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    setScreen(nextScreen);
  }, []);
  const toNextScreen = () => {
    const currentData = {
      focuseArea: selectedItems,
    };
   dispatch(setLaterButtonData([...getLaterButtonData, currentData]));
   navigation.navigate('WorkoutArea', {nextScreen: screen + 1});
    {
  
    }
  };

  return (
    <View style={styles.Container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />
     
        <ProgressBar screen={screen} />
     
      <View style={{marginTop:- DeviceHeigth * 0.05}}>
        <Bulb
          screen={'Select your Focus area'}
        />
      </View>
      <View>
        {getLaterButtonData[0].gender == 'Male' ? (
          <FocuseAreaMale selectedItems={selectedItems} setSelectedItems={setSelectedItems} />
        ) : (
          <FocuseAreaFmale selectedItems={selectedItems} setSelectedItems={setSelectedItems} />
        )}
      </View>
      <View style={styles.buttons}>
        <TouchableOpacity
          style={{
            backgroundColor: '#F7F8F8',
            width: 45,
            height: 45,
            borderRadius: 15,
            overflow: 'hidden',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => navigation.goBack()}>
          <Icons name="chevron-left" size={25} color={'#000'} />
        </TouchableOpacity>

        {selectedItems.length !== 0 && (
          <TouchableOpacity
            onPress={() => {
              toNextScreen();
            }}>
            <LinearGradient
              start={{x: 0, y: 1}}
              end={{x: 1, y: 0}}
              colors={['#941000', '#D5191A']}
              style={[styles.nextButton]}>
              <Icons name="chevron-right" size={25} color={'#fff'} />
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: AppColor.WHITE,
  },
  textStyle: {
    color: 'black',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Poppins',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: DeviceWidth * 0.9,
    alignItems: 'center',
    alignSelf: 'center',

    bottom: DeviceHeigth * 0.02,
    position: 'absolute',
 
  },
  nextButton: {
    backgroundColor: 'red',
    width: 45,
    height: 45,
    borderRadius: 50 / 2,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default FocusArea;
