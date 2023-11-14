import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Linking
} from 'react-native';
import React from 'react';
import { DeviceWidth, DeviceHeigth } from '../../Component/Config';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import HTMLRender from "react-native-render-html";
import CustomStatusBar from '../../Component/CustomStatusBar';
const StoreDetail = () => {
  const navigation = useNavigation()
  const route = useRoute();
  const Data = route.params;
  const Description = Data.data.description
  const { defaultTheme } = useSelector(state => state);
  return (
    <View style={{ flex: 1, backgroundColor: defaultTheme ? '#000' : 'fff' }}>
      <View>
        <ImageBackground source={{ uri: Data.data.image }} style={[styles.HomeImg]}>
        {Platform.OS=='android'?<><StatusBar barStyle={defaultTheme?'light-content':'dark-content'} backgroundColor={'#941000'}/></>:<><CustomStatusBar/></>}
          <LinearGradient
            colors={['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.6)']}
            style={styles.LinearG}>
            <View style={styles.Buttn}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Store');
                }}>
                <Icons name="close" size={30} color={'white'} />
              </TouchableOpacity>
            </View>
            <View style={styles.textView}>
              <Text style={{ color: "#941000" }}>{Data.data.type}</Text>
              <Text style={{ color: 'white', paddingVertical: 8, fontSize: 16 }}>
                {Data.data.title}
              </Text>
              <Text style={{ color: '#941000' }}>{Data.data.price}</Text>
            </View>
          </LinearGradient>
        </ImageBackground>
      </View>
      <View style={{ marginHorizontal: 20 }}>
        <HTMLRender source={{ html: Description }} contentWidth={DeviceWidth} tagsStyles={{
          p: {
            color: defaultTheme ? "#fff" : "#000"
          },
          strong: {
            color: '#941000',
            fontSize: 20,
          }
          , li: {
            color: defaultTheme ? "#fff" : "#000"
          },
          ul: {
            color: defaultTheme ? "#fff" : "#000"
          },
          ol: {
            color: defaultTheme ? "#fff" : "#000"
          }
        }} />
      </View>
      <View>
        <TouchableOpacity style={{ backgroundColor: '#941000', width: DeviceWidth * 90 / 100, height: DeviceHeigth * 5 / 100, margin: 20, justifyContent: 'center', alignItems: 'center', borderRadius: 20, flexDirection: 'row' }}
        onPress={()=>{
          Linking.openURL(Data.data.link)
        }}>
          <Icons name='cart-outline' size={20} color={'#000'} />
          <Text style={{ color: defaultTheme ? "#fff" : "#000" }}>BUY NOW</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  HomeImg: {
    height: (DeviceHeigth * 40) / 100,
    width: DeviceWidth,
  },
  Buttn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: (DeviceHeigth * 7) / 100,
    marginHorizontal: (DeviceWidth * 4) / 100,
    // borderWidth:1
  },
  LinearG: {
    height: (DeviceHeigth * 40) / 100,
    width: DeviceWidth,
    justifyContent: 'space-between',
  },
  textView: {
    marginBottom: (DeviceHeigth * 3) / 100,
    alignItems: 'flex-start',
    // borderWidth:1,
    // justifyContent:'flex-end'
    margin: 20,
  },
  levelGoalView: {
    width: DeviceWidth,
    height: (DeviceHeigth * 8) / 100,
    backgroundColor: '#941000',
    justifyContent: 'space-around',
    flexDirection: 'row',
    alignItems: 'center',
  },
  Days: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: (DeviceWidth * 4) / 100,
    marginVertical: (DeviceHeigth * 2) / 100,
  },
});
export default StoreDetail