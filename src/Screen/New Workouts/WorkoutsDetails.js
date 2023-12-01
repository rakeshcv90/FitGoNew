import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import NewHeader from '../../Component/Headers/NewHeader';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import {localImage} from '../../Component/Image';
import LevelRate from '../../Component/LevelRate';
import {AppColor} from '../../Component/Color';

const Workouts = ({navigation}) => {
  const StaticArrayforDesing = [
    {
      id: 1,
      text: 'Text1',
    },
    {
      id: 2,
      text: 'Text1',
    },
    {
      id: 3,
      text: 'Text1',
    },
    {
      id: 4,
      text: 'Text1',
    },
    {
      id: 5,
      text: 'Text1',
    },
    {
      id: 6,
      text: 'Text1',
    },
  ];
  return (
    <View style={styles.Container}>
      <NewHeader header={'Workouts'} backButton SearchButton />
      <ImageBackground
        source={localImage.Inrtoduction1}
        style={styles.ImgBackgrnd}>
        <View style={styles.LinearG}></View>
      </ImageBackground>
      <View style={styles.TitleView}>
        <View style={styles.TextView}>
          <Text style={{fontSize:16,color:AppColor.INPUTLABLECOLOR}}>title</Text>
        </View>
        <View>
          <View style={styles.LevelView}>
            <LevelRate level={'Intermediate'} />
          </View>
          <Text style={{fontSize:16,color:AppColor.INPUTLABLECOLOR}}>Intermediate</Text>
        </View>
      </View>
      <View style={styles.FlatListView}>
        <FlatList
          data={StaticArrayforDesing}
          renderItem={elements => (
            <TouchableOpacity
            activeOpacity={0.6}
              style={[
                styles.FlatListDataView,
                {backgroundColor: AppColor.LIGHTPINK},
              ]}
              onPress={()=>{
                navigation.navigate("NewProfileScreen")
              }}>
              <Text style={[styles.FlatListText, {fontFamily:'Poppins'}]}>
                {elements.item.text}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  ImgBackgrnd: {
    width: DeviceWidth,
    height: DeviceHeigth * 0.22,
  },
  LinearG: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    height: DeviceHeigth * 0.22,
    justifyContent: 'flex-end',
    paddingBottom: 4,
  },
  TitleView: {
    flexDirection: 'row',
    width: DeviceWidth * 0.9,
    position: 'absolute',
    backgroundColor: '#fff',
    justifyContent: 'space-around',
    alignSelf: 'center',
    top: DeviceHeigth * 0.235,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    marginBottom: 20,
  },
  TextView: {margin: 10},
  LevelView: {
    flexDirection: 'row',
    margin: 10,
  },
  FlatListDataView: {
    width: DeviceWidth * 0.9,
    height: DeviceHeigth * 0.08,
    margin: 10,
    borderRadius: 20,
    overflow: 'hidden',
  },
  FlatListView: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginTop: DeviceHeigth * 0.07,
    marginBottom:10
  },
  FlatListText: {
    fontSize: 20,
    margin: 15,
    fontWeight: '800',
    color: '#000',
  },
});
export default Workouts;
