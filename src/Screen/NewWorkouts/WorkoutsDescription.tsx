import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AppColor} from '../../Component/Color';
import {Image} from 'react-native';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import RenderHTML from 'react-native-render-html';
import Tts from 'react-native-tts';
const WorkoutsDescription = ({data, open, setOpen}: any) => {
  const [ttsInitialized, setTtsInitialized] = useState(false);
  const TextSpeech=`${data?.workout_description}`
  const [description,SetDescription]=useState('')
  console.log(data?.workout_description)
  const cleanText =  TextSpeech.replace(/<\/?[^>]+(>|$)/g, '');
  useEffect(() => {
    const initTts = async () => {
      const ttsStatus = await Tts.getInitStatus();
      if (!ttsStatus.isInitialized) {
        try {
       
          await Tts.setDefaultVoice('hi-in-x-hid-local');
          await Tts.setDefaultLanguage('en-US');
          await Tts.setDucking(true);
          await Tts.setIgnoreSilentSwitch('ignore');
          setTtsInitialized(true);
        } catch (error) {
          console.log("VoicessError", error);
        }
      }
      // Register tts-progress event listener outside the conditional block
      Tts.addEventListener('tts-progress', event => {
    
      });
    };
  
    initTts();
  }, []);
  useEffect(()=>{
    if(open){
      Tts.speak(cleanText);
    }else{
      Tts.stop()
    }
  
  },[open])
  const tag = {
    p: {
      color: '#3A4750',
      fontSize: 12,
      lineHeight: 15,
      fontFamily: 'Poppins',
    },
    strong: {
      color: '#C8170D',
      fontSize: 10,
    },
    li: {
      color: '#505050',
      fontSize: 14,
      lineHeight: 22,
      fontFamily: 'Poppins',
      fontWeight: '500',
      marginBottom: 5
    },
    ul: {
      color: '#3A4750',
    },
    ol: {
      color: '#3A4750',
    },
  };
  return (
    <Modal visible={open} onRequestClose={() => null} animationType="slide">
      <View
        style={{
          flex: 1,
          backgroundColor: AppColor.WHITE,
          flexDirection: 'row',
        }}>
        <Image
          source={{uri: data?.workout_image_link || data?.exercise_image}}
          style={{
            height: DeviceWidth / 1.5,
            width: DeviceWidth * 0.95,
            marginTop: DeviceHeigth * 0.1,
          }}
          resizeMode="contain"
        />
        <TouchableOpacity
          onPress={() => setOpen(false)}
          style={{
            marginTop: DeviceHeigth * 0.1,
          }}>
          <Text
            style={{
              color: 'grey',
              fontSize: 20,
              marginRight: 20,
              fontWeight: '600',
            }}>
            X
          </Text>
        </TouchableOpacity>
        <View style={styles.container}>
          <Text
            style={{
              fontWeight: '700',
              fontSize: 24,
              lineHeight: 30,
              fontFamily: 'Poppins',
            }}>
            {data?.workout_title || data?.exercise_title}
          </Text>
          <Text />
          {data?.workout_description ? (
            <RenderHTML
              source={{html: data?.workout_description}}
              contentWidth={DeviceWidth}
              tagsStyles={tag}
            />
          ) : (
            <RenderHTML
              source={{html: data?.exercise_instructions}}
              contentWidth={DeviceWidth}
              tagsStyles={tag}
            />
          )}
          {/* <Text
            style={{
              fontWeight: 'normal',
              fontSize: 12,
              lineHeight: 18,
              fontFamily: 'Poppins',
            }}>
            {description?.map((text: any, index: number) => {
              if (index % 2 === 0) {
                <View style={{height: 10}} />;
              } else {
                return text;
                // Bold section, wrap in <BoldText>
              }
            })}
          </Text> */}
        </View>
      </View>
    </Modal>
  );
};

export default WorkoutsDescription;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColor.WHITE,
    // alignItems: 'center',
    height: DeviceHeigth * 0.6,
    width: DeviceWidth,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    bottom: 0,
    position: 'absolute',
    padding: 20,
    paddingTop: 50,
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0, 0, 0, 0.6)',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 5,
        // shadowRadius: 10,
      },
      android: {
        elevation: 10,
        shadowColor: 'rgba(0, 0, 0, 0.6)',
        shadowOffset: {width: 5, height: 5},
        shadowOpacity: 0.9,
        // shadowRadius: 10,
      },
    }),
  },
  category: {
    fontFamily: 'Poppins',
    fontSize: 16,
    fontWeight: '600',
    color: AppColor.BoldText,
    lineHeight: 30,
  },
});
