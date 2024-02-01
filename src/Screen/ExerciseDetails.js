import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  FlatList,
  Modal,
  StatusBar
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { DeviceHeigth, DeviceWidth } from '../Component/Config';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux'
import { List, Subheading, Caption } from 'react-native-paper';
import { Api, Appapi } from '../Component/Config';
import axios from 'axios';
import Loader from '../Component/Loader';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons'
import { WebView } from 'react-native-webview';
import CustomStatusBar from '../Component/CustomStatusBar';
const ExerciseDetails = () => {
  const { defaultTheme } = useSelector(state => state)
  const [showInfo, setShowInfo] = useState(false);
  const [showInst, setShowInst] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true)
  const [showModal, setShowModal] = useState(false);
  const [ApiData, setApiData] = useState([]);
  const pressShowInfo = () => setShowInfo(!showInfo);
  const pressShowInst = () => setShowInst(!showInst);
  const pressShowTips = () => setShowTips(!showTips);
  const togglePlayPause = () => setIsPlaying(!isPlaying)
  const [update,setUpdate]=useState(0);
  const route = useRoute();
  const navigation = useNavigation()
  const data = route.params;
  const Data = data.elements.item

  const handleback = () => {
    setShowModal(false)
  }
  useEffect(() => {
    getData();
  }, [update]);
  const getData = async () => {
    try {
      const data = await axios(`${Api}/${Appapi.Exercise}?id=${Data.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'Multipart/form-data',
        },
      });
      setApiData(data.data);
      // console.log(ApiData)
      setIsLoaded(true);
      setUpdate(update + 1)
    } catch (error) {
      console.log("errrror", error)
    }
  };
  const VideoModal = () => {
    return (
      <View>
        <StatusBar barStyle={defaultTheme?'light-content':'dark-content'} backgroundColor={defaultTheme?"#000":"#fff"}/>
      </View>
    );
  }
  if (isLoaded) {
    return (
      <View style={[styles.container, { backgroundColor: defaultTheme ? "#000" : "#fff" }]}>
        <View style={[styles.closeButton, { marginTop: DeviceHeigth * 7 / 100, marginHorizontal: DeviceWidth * 5 / 100 }]}>
          <TouchableOpacity onPress={() => {
            navigation.goBack()
          }}><Icons name="close" size={27} color={defaultTheme ? "#fff" : "#000"} /></TouchableOpacity>
          <Text style={{ fontSize: 20, color: defaultTheme ? "#fff" : "#000" }}>Exercise Details</Text>
          <Text></Text></View>
        <FlatList data={ApiData} showsVerticalScrollIndicator={false}
          renderItem={elements => {
            return (
              <View style={{ flex: 1, backgroundColor: defaultTheme ? "#000" : "#fff" }}>
                <Modal
                  animationType="slide"
                  // transparent={true}
                  visible={showModal}
                  onRequestClose={() => {
                    setShowModal(!showModal);
                  }}>
                  <View style={[styles.modalContainer, { backgroundColor: defaultTheme ? '#000' : "#fff", flex: 1 }]}>
                    <View style={{ marginHorizontal: DeviceWidth * 4 / 100, marginVertical: DeviceHeigth * 6 / 100, backgroundColor: defaultTheme ? '#000' : "#fff" }}>
                      <TouchableOpacity onPress={() => {
                        handleback();
                      }}><Icons name="close" size={27} color={defaultTheme ? "#fff" : "#000"} /></TouchableOpacity></View>
                    <View style={{ width: DeviceWidth, height: DeviceHeigth * 30 / 100, justifyContent: 'center', marginTop: DeviceHeigth * 20 / 100, backgroundColor: defaultTheme ? '#000' : "#fff" }}>
                      <WebView source={{ uri: elements.item.video }} />
                    </View>
                  </View>
                </Modal>
                <View>
                  <ImageBackground source={{ uri: elements.item.image }} style={styles.ImageBckg}>
                    <TouchableOpacity
                      onPress={() => {
                        setShowModal(true)
                      }}
                    >
                      <View style={{ borderRadius: 100, overflow: 'hidden' }}>
                        <Icons name="play-circle" size={45} color={"#C8170D"} style={{ backgroundColor: 'rgba(255,255,255,1)', overflow: 'hidden' }} />
                      </View>
                    </TouchableOpacity>
                  </ImageBackground>
                </View>
                <View style={styles.titleView}>
                  <Text style={{ color: defaultTheme ? "#fff" : "#000", fontSize: 19 }}>{elements.item.title}</Text>
                </View>
                <View style={{ margin: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View style={styles.GridStyle}>
                    <Icons name="backup-restore" color={"#C8170D"} size={33} />
                    <Text style={{ color: defaultTheme ? "#fff" : "#000" }}>Reps</Text>
                    <Text style={{ color: defaultTheme ? "#fff" : "#000" }}>{Data.reps}</Text>
                  </View>
                  <View style={styles.GridStyle}>
                    <Icons name="checkbox-marked-circle-outline" color={"#C8170D"} size={33} />
                    <Text style={{ color: defaultTheme ? "#fff" : "#000" }}>Sets</Text>
                    <Text style={{ color: defaultTheme ? "#fff" : "#000" }}>{elements.item.sets}</Text>
                  </View>
                  <View style={styles.GridStyle}>
                    <Icons name="timer-outline" color={"#C8170D"} size={33} />
                    <Text style={{ color: defaultTheme ? "#fff" : "#000" }}>Rest</Text>
                    <Text style={{ color: defaultTheme ? "#fff" : "#000" }}>{elements.item.rest}</Text>
                  </View>
                </View>
                <View style={{ marginVertical: 10 }}>
                  <List.Accordion
                    title={"Information"}
                    titleStyle={{ color: defaultTheme ? "#fff" : "#000" }}
                    expanded={showInfo}
                    style={{ backgroundColor: defaultTheme ? "#rgba(0,0,0,0.9)" : "#rgba(0,0,0,0.1)" }}
                    onPress={pressShowInfo}>
                  </List.Accordion>
                  {showInfo ?
                    <View style={{ marginHorizontal: 20 }}>
                      <Subheading style={{ color: defaultTheme ? "#fff" : "#000" }}>Level</Subheading>
                      <Caption style={{ color: defaultTheme ? "#fff" : "#000", fontSize: 14 }}>{elements.item.level}</Caption>

                      <Subheading style={{ color: defaultTheme ? "#fff" : "#000" }}>Muscle Involved</Subheading>
                      <Caption style={{ color: defaultTheme ? "#fff" : "#000", fontSize: 14 }}>{elements.item.bodyparts}</Caption>
                    </View>
                    : null
                  }
                </View>
                <View style={{ marginVertical: 10 }}>
                  <List.Accordion
                    title={"Instructions"}
                    titleStyle={{ color: defaultTheme ? "#fff" : "#000" }}
                    expanded={showInst}
                    style={{ backgroundColor: defaultTheme ? "#rgba(0,0,0,0.9)" : "#rgba(0,0,0,0.1)" }}
                    onPress={pressShowInst}>
                  </List.Accordion>
                  {showInst ?
                    <View style={{ marginHorizontal: 20 }}>
                      <Caption style={{ color: defaultTheme ? "#fff" : "#000", fontSize: 14 }}>{elements.item.instructions.replace(/(<([^>]+)>)/ig, '')}</Caption>
                    </View>
                    : null
                  }
                </View>
                <View style={{ marginVertical: 10 }}>
                  <List.Accordion
                    title={"Tips"}
                    titleStyle={{ color: defaultTheme ? "#fff" : "#000" }}
                    expanded={showTips}
                    style={{ backgroundColor: defaultTheme ? "#rgba(0,0,0,0.9)" : "#rgba(0,0,0,0.1)" }}
                    onPress={pressShowTips}
                  >
                  </List.Accordion>
                  {showTips ?
                    <View style={{ marginHorizontal: 20 }}>
                      <Caption style={{ color: defaultTheme ? "#fff" : "#000", fontSize: 14 }}>{elements.item.tips.replace(/(<([^>]+)>)/ig, '')}</Caption>
                    </View>
                    : null
                  }
                </View>
              </View>);
          }} />
        <VideoModal />
      </View>
    )
  }
  else {
    return (
      <Loader />
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  closeButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 15,
    alignItems: 'center'
  },
  ImageBckg: {
    height: DeviceHeigth * 35 / 100,
    width: DeviceWidth * 95 / 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    overflow: 'hidden',
    margin: 8
  },
  titleView: {
    alignItems: 'center',
    marginVertical: 10
  },
  GridStyle: {
    alignItems: 'center'
  },
  container1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  videoPlayer: {
    width: '100%',
    height: 300,
    flex: 1
  },
  modalContainer: {
    // flex: 1,
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  controlBar: {
    position: 'absolute',
    bottom: "50%",
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 10,
  },
});
export default ExerciseDetails