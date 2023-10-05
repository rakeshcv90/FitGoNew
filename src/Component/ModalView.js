import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { useSelector, } from 'react-redux';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import Video from 'react-native-video'
import { DeviceHeigth } from './Config';
const ModalView = ({ navigation }) => {
  const { defaultTheme } = useSelector(state => state)
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: defaultTheme ? "#000" : "#fff" }]}>
      <View style={[styles.closeButton, { margin: 35 }]}>
        <TouchableOpacity onPress={() => {
          navigation.goBack()
        }}><Icons name="close" size={27} color={defaultTheme ? "#fff" : "#000"} />
        </TouchableOpacity></View>
      <View style={[styles.container1,{backgroundColor:defaultTheme?"#000":"#fff"}]}>
        <Video
          source={{ uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' }}
          style={styles.videoPlayer}
          // controls={true}
          resizeMode="contain"
          repeat={true}
          muted={true}
          // hideShutterView
        />
      </View>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  container1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'black', // Background color for the video player
  },
  videoPlayer: {
    width: '100%',
    height: DeviceHeigth * 30 / 100,
  },
})
export default ModalView