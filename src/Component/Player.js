import {
  View,
  Text,
  Modal,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {DeviceHeigth, DeviceWidth} from './Config';
import {SafeAreaView} from 'react-native';
import Video from 'react-native-video';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';
import {useNavigation, useRoute} from '@react-navigation/native';
import {WebView} from 'react-native-webview';
const PlayerModal = ({setState, State}) => {
  const {defaultTheme} = useSelector(state => state);
  const [showModal, setShowModal] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const Data = route.params;
  const PlayerScrnData = Data.PlayerData;
  const [currentPage, setCurrentPage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [nextSet, setnextSet] = useState(false);
  const [finished, setFinished] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const [reps, setReps] = useState(1);
  const [sets, setSets] = useState(1);
  const [rest, setRest] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [totaltime, setTotaltime] = useState({
    seconds: 0,
    minutes: 0,
    hours: 0,
  });
  const PlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  const goToNextPage = () => {
    if (currentPage < PlayerScrnData.length - 1) {
      setCurrentPage(currentPage + 1);
      setReps(1);
      setSets(1);
      setIsPlaying(false);
      setTimeLeft(60);
    }
  };
  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      setReps(1);
      setSets(1);
      setIsPlaying(false);
      setTimeLeft(60);
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
        !isCancelled &&
          setTotaltime({seconds: nSeconds, minutes: nMinutes, hours: nHours});
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
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [rest, timeLeft]);
  useEffect(() => {
    if (reps === currentData.reps) {
      if (currentData.sets === sets) {
        if (isEnd) {
          setTimeout(() => {
            Alert.alert('Workout Completed', '', [
              {
                text: 'Ok',
                onPress: () => {
                  navigation.goBack();
                },
              },
            ]);
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
      }, 2500);
      return () => clearInterval(intervalId);
    }
  }, [reps, isPlaying]);
  const handleExit = () => {
    Alert.alert('Confirm Exit', 'Are you sure you want to exit?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Exit',
        onPress: () => {
          navigation.goBack();
        },
      },
    ]);
  };
  const handleRest = () => {
    Alert.alert('Are you ready for the Next Set?', '', [
      {
        text: 'No',
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: () => {
          setRest(false);
          setSets(sets + 1);
          setReps(1);
          setTimeLeft(60);
        },
      },
    ]);
  };
  const handleComplete = () => {
    setFinished(false);
    setRest(false);
    setReps(1);
    setTimeLeft(60);
    setSets(1);
    setCurrentPage(currentPage + 1);
  };
  const renderRest = () => {
    if (rest && !finished) {
      return (
        <View style={{flex: 1}}>
          <View
            style={[
              styles.closeButton,
              {
                marginTop: (DeviceHeigth * 5) / 100,
                marginHorizontal: (DeviceWidth * 5) / 100,
              },
            ]}>
            <TouchableOpacity
              onPress={() => {
                handleRest();
              }}>
              <Icons
                name="close"
                size={27}
                color={defaultTheme ? '#fff' : '#000'}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                borderRadius: 100,
                alignItems: 'center',
                marginHorizontal: 20,
                borderColor: '#C8170D',
                borderWidth: 15,
                width: 200,
                height: 200,
              }}>
              <Text
                style={{fontSize: 66, fontWeight: 'bold', color: '#C8170D'}}>
                {timeLeft}"
              </Text>
            </View>
            <Text
              style={{
                fontSize: 26,
                fontWeight: 'bold',
                marginTop: 20,
                color: defaultTheme ? '#fff' : '#000',
              }}>
              Rest
            </Text>
          </View>
        </View>
      );
    }
  };
  const renderContent = () => {
    if (!finished && !rest) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'space-between',
            backgroundColor: defaultTheme ? '#000' : '#fff',
          }}>
          <View>
            <View
              style={[
                styles.closeButton,
                {
                  marginTop: (DeviceHeigth * 5) / 100,
                  marginHorizontal: (DeviceWidth * 5) / 100,
                },
              ]}>
              <TouchableOpacity
                onPress={() => {
                  handleExit();
                }}>
                <Icons
                  name="close"
                  size={27}
                  color={defaultTheme ? '#fff' : '#000'}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                width: DeviceWidth,
                height: (DeviceHeigth * 30) / 100,
                backgroundColor: defaultTheme ? '#fff' : '#000',
              }}>
              <WebView
                source={{uri: currentData.video}}
                style={{
                  width: DeviceWidth,
                  height: (DeviceHeigth * 30) / 100,
                  backgroundColor: defaultTheme ? '#fff' : '#000',
                }}
              />
            </View>
            <View style={styles.Title}>
              <Text
                style={{color: defaultTheme ? '#fff' : '#000', fontSize: 20}}>
                {currentData.title}
              </Text>
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-around'}}>
              <View style={styles.RepNSet}>
                <Text
                  style={{color: defaultTheme ? '#fff' : '#000', fontSize: 35}}>
                  {reps}/{currentData.reps}
                </Text>
                <Text style={{color: defaultTheme ? '#fff' : '#000'}}>
                  Reps
                </Text>
              </View>
              <View style={styles.RepNSet}>
                <Text
                  style={{color: defaultTheme ? '#fff' : '#000', fontSize: 35}}>
                  {sets}/{currentData.sets}
                </Text>
                <Text style={{color: defaultTheme ? '#fff' : '#000'}}>
                  Sets
                </Text>
              </View>
            </View>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <TouchableOpacity
                style={styles.Startbtn}
                onPress={() => {
                  PlayPause();
                }}>
                <Icons
                  name={isPlaying ? 'pause' : 'play'}
                  size={25}
                  color={'#fff'}
                />
                <Text style={{color: '#fff'}}>
                  {isPlaying ? '  STOP' : 'START NOW'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 100,
              marginHorizontal: 25,
            }}>
          
            <TouchableOpacity
              onPress={() => {
                goToPreviousPage();
              }}>
              <Text
                style={{
                  color: defaultTheme
                    ? currentPage == 0
                      ? '#rgba(255,255,255,0.6)'
                      : '#C8170D'
                    : currentPage == 0
                    ? '#rgba(0,0,0,0.6)'
                    : '#C8170D',
                  fontSize: 20,
                }}>
                Previous
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                goToNextPage();
              }}
              disabled={currentPage === PlayerScrnData.length - 1}>
              <Text
                style={{
                  color: defaultTheme
                    ? currentPage === PlayerScrnData.length - 1
                      ? '#rgba(255,255,255,0.6)'
                      : '#C8170D'
                    : currentPage === PlayerScrnData.length - 1
                    ? '#rgba(0,0,0,0.6)'
                    : '#C8170D',
                  fontSize: 20,
                }}>
                Next
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  };
  return (
    <View style={{flex: 1, backgroundColor: defaultTheme ? '#000' : '#fff'}}>
      {renderContent()}
      {renderRest()}
      {finished ? (
        <View style={{flex: 1}}>
          <View
            style={[
              styles.closeButton,
              {
                marginTop: (DeviceHeigth * 5) / 100,
                marginHorizontal: (DeviceWidth * 5) / 100,
              },
            ]}>
            <TouchableOpacity
              onPress={() => {
                handleComplete();
              }}>
              <Icons
                name="close"
                size={27}
                color={defaultTheme ? '#fff' : '#000'}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 250,
            }}>
            <Icons
              name="checkbox-marked-circle-outline"
              style={{color: '#C8170D', fontSize: 72, marginBottom: 10}}
            />
            <Text
              style={{
                fontSize: 34,
                fontWeight: 'bold',
                textAlign: 'center',
                color: defaultTheme ? '#fff' : '#000',
              }}>
              Exercise Completed
            </Text>
          </View>
        </View>
      ) : null}
    </View>
  );
};
const styles = StyleSheet.create({
  ModalContainer: {
    flex: 1,
    width: DeviceWidth,
    height: DeviceHeigth,
  },
  VideoPlayer: {
    width: '100%',
    height: (DeviceHeigth * 30) / 100,
  },
  closeButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 15,
    alignItems: 'center',
  },
  Title: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: (DeviceHeigth * 4) / 100,
  },
  RepNSet: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  Startbtn: {
    backgroundColor: '#C8170D',
    margin: 20,
    width: (DeviceWidth * 50) / 100,
    height: (DeviceHeigth * 6) / 100,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  modalContainer: {
    flex: 1,
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
export default PlayerModal;
