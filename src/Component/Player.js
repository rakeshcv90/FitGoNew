import { View, Text, Modal, StyleSheet, StatusBar, TouchableOpacity, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import { DeviceHeigth, DeviceWidth } from './Config'
import { SafeAreaView } from 'react-native'
import Video from 'react-native-video'
import Icons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useSelector } from 'react-redux'
import { useNavigation, useRoute } from '@react-navigation/native'
const PlayerModal = ({ setState, State }) => {
  const { defaultTheme } = useSelector(state => state)
  const [showModal,setShowModal]=useState(false)
  const navigation = useNavigation()
  const route = useRoute();
  const Data = route.params;
  const PlayerScrnData = Data.PlayerData
  const [currentPage, setCurrentPage] = useState(0);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [nextSet, setnextSet] = React.useState(false);
  const [finished, setFinished] = React.useState(false);
  const [isEnd, setIsEnd] = React.useState(false);
  const [reps, setReps] = React.useState(1);
  const [sets, setSets] = React.useState(1);
  const [rest, setRest] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState(60);
  const [totaltime, setTotaltime] = React.useState({ seconds: 0, minutes: 0, hours: 0, });
  const PlayPause = () => {
    setIsPlaying(!isPlaying);
  }
  const goToNextPage = () => {
    if (currentPage < PlayerScrnData.length - 1) {
      setCurrentPage(currentPage + 1);
      setReps(1)
      setSets(1)
      setIsPlaying(false)
      setTimeLeft(60)
    }
  };
  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      setReps(1)
      setSets(1)
      setIsPlaying(false)
      setTimeLeft(60)
    }
  };
  const currentData = PlayerScrnData[currentPage];
  useEffect(() => {
    let isCancelled = false;
    const advanceTime = () => {
      setTimeout(() => {
        let nSeconds = totaltime.seconds;
        let nMinutes = totaltime.minutes;
        let nHours = totaltime.hours;
        nSeconds++;
        if (nSeconds > 59) {
          nMinutes++;
          nSeconds = 0;
        }
        if (nMinutes > 59) {
          nHours++;
          nMinutes = 0;
        }
        if (nHours > 24) {
          nHours = 0;
        }
        !isCancelled && setTotaltime({ seconds: nSeconds, minutes: nMinutes, hours: nHours });
      }, 1000);
    };
    if (isPlaying || rest) {
      advanceTime();
    }
    return () => {
      isCancelled = true;
    };
  }, [totaltime, isPlaying]);

  useEffect(() => {
    if (currentPage === PlayerScrnData.length - 1) {
      setIsEnd(true);
    } else {
      setIsEnd(false);
    }
  }, [currentPage]);
  useEffect(() => {
    if (rest) {
      if (!timeLeft) return;
      const intervalId = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 100);
      return () => clearInterval(intervalId);
    }
  }, [rest, timeLeft]);
  useEffect(() => {
    if (reps === currentData.reps) {
      if (currentData.sets === sets) {
        if (isEnd) {
          setTimeout(() => {
            navigation.navigate('completed', {id: currentData.id, time: totaltime});
          }, 1000);
        } else if (!isEnd) {
          setTimeout(() => {
            setFinished(true);
          }, 1000);
        }
      } else {
        setTimeout(() => {
          setRest(true);
        }, 1000);
      }
    }
  }, [reps]);
  useEffect(() => {
    if (timeLeft === 0) {
      if (sets < currentData.sets) {
        setSets(sets + 1);
        setReps(1);
        setnextSet(true);
        setTimeLeft(60);
        setRest(false);
      }
    }
  }, [timeLeft]);

  useEffect(() => {

    if (isPlaying) {
      if (!reps) return;
      const intervalId = setInterval(() => {
        if (reps < currentData.reps) {
          setReps(reps + 1);
        } else {
          setnextSet(true);
          setIsPlaying(false);
        }
      }, 100);
      return () => clearInterval(intervalId);
    }
  }, [reps, isPlaying]);
  const renderRest = () => {
    if (rest && !finished) {
      return (
        <SafeAreaView style={{ flex: 1, height: DeviceHeigth, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ flexDirection: 'column', justifyContent: 'center', borderRadius: 100, alignItems: 'center', marginHorizontal: 20, borderColor: "orange", borderWidth: 15, width: 200, height: 200, }}>
            <Text style={{ fontSize: 66, fontWeight: 'bold', color: "black" }}>{timeLeft}"</Text>
          </View>
          <Text style={{ fontSize: 26, fontWeight: 'bold', marginTop: 20 }}>Rest</Text>
        </SafeAreaView>
      )
    }
  }
  const ExitModal=()=>{
    return( <Modal 
      transparent={false}
      animationType='fade'
      visible={showModal}
      onRequestClose={()=>{
        setShowModal(false)
      }}
      >
        <View style={{width:400,height:400}}>
       <Text>Confirm Exit</Text>
       <Text>Are you sure you want to exit</Text>
        </View>
      </Modal>)
   
  }
  const renderContent = () => {
    if (!finished && !rest) {
      return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'space-between' }}>
          <View>
            <View style={[styles.closeButton, { margin: 10 }]}>
              <TouchableOpacity onPress={() => {
                navigation.goBack()
              }}><Icons name="close" size={27} color={defaultTheme ? "#fff" : "#000"} /></TouchableOpacity></View>
            <View>
              <Video source={{ uri: 'https://vjs.zencdn.net/v/oceans.mp4' }} repeat muted style={styles.VideoPlayer} resizeMode={"stretch"} paused={!isPlaying}/>
            </View>
            <View style={styles.Title}>
              <Text style={{ color: defaultTheme ? "#fff" : "#000", fontSize: 20 }}>{currentData.title}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
              <View style={styles.RepNSet}>
                <Text style={{ color: defaultTheme ? "#fff" : "#000", fontSize: 35 }}>{reps}/{currentData.reps}</Text>
                <Text style={{ color: defaultTheme ? "#fff" : "#000" }}>Reps</Text>
              </View>
              <View style={styles.RepNSet}>
                <Text style={{ color: defaultTheme ? "#fff" : "#000", fontSize: 35 }}>{sets}/{currentData.sets}</Text>
                <Text style={{ color: defaultTheme ? "#fff" : "#000" }}>Sets</Text>
              </View>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <TouchableOpacity style={styles.Startbtn}
                onPress={() => {
                  PlayPause()
                }}>
                <Icons name={isPlaying ? "pause" : "play"} size={25} color={'#000'} /><Text style={{ color: '#000' }}>{isPlaying ? "  STOP" : "START NOW"}</Text></TouchableOpacity>
            </View>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 100, marginHorizontal: 25 }}>
            <TouchableOpacity onPress={() => { goToPreviousPage() }} disabled={currentPage === 0} ><Text style={{ color: '#f39c1f', fontSize: 20 }}>Previous</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => { goToNextPage() }} disabled={currentPage === PlayerScrnData.length - 1}><Text style={{ color: '#f39c1f', fontSize: 20 }}>Next</Text></TouchableOpacity>
          </View>
         
        </SafeAreaView>)
    }
  }
  
  return (
    <SafeAreaView style={{ flex: 1 ,backgroundColor:defaultTheme?"#000":"#fff"}}>
        
      {renderContent()}
      {renderRest()}
      {finished ?
       <View style={{flex:1}}>
         <View style={[styles.closeButton, { margin: 10}]}>
          <TouchableOpacity onPress={() => {
            navigation.goBack()
          }}><Icons name="close" size={27} color={defaultTheme ? "#fff" : "#000"} /></TouchableOpacity>
          </View>
            <View style={{alignItems:'center',justifyContent:'center',marginTop:250}}>
            <Icons name="checkbox-marked-circle-outline" style={{color:'#f39c1f', fontSize: 72, marginBottom:10}}/>
            <Text style={{fontSize:34, fontWeight:'bold', textAlign:'center',color:defaultTheme?"#fff":"#000"}}>Completed</Text>
            </View>
            </View> : null}
     
    </SafeAreaView>

  );
}
const styles = StyleSheet.create({
  ModalContainer: {
    flex: 1,
    width: DeviceWidth,
    height: DeviceHeigth
  },
  VideoPlayer: {
    width: "100%",
    height: DeviceHeigth * 30 / 100,
  },
  closeButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 15,
    alignItems: 'center'
  },
  Title: {
    justifyContent: 'center',
    alignItems: "center",
    marginVertical: DeviceHeigth * 4 / 100
  },
  RepNSet: {
    justifyContent: 'center',
    alignItems: "center"
  },
  Startbtn: {
    backgroundColor: '#f39c1f',
    margin: 20,
    width: DeviceWidth * 50 / 100,
    height: DeviceHeigth * 6 / 100,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  modalContainer: {
    flex: 1,
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
})
export default PlayerModal