import RNFetchBlob from 'rn-fetch-blob';
import {store} from '../../Component/ThemeRedux/Store';
import {setVideoLocation} from '../../Component/ThemeRedux/Actions';
import { View } from 'react-native';
import { DeviceHeigth, DeviceWidth } from '../../Component/Config';
import AnimatedLottieView from 'lottie-react-native';

const sanitizeFileName = (fileName: string) => {
  fileName = fileName.replace(/\s+/g, '_');
  return fileName;
};

let StoringData: Record<string, string> = {};

 const downloadVideos = async (
  data: any,
  len: number,
  callback: (progress: number) => void,
): Promise<void> => {

  const filePath = `${RNFetchBlob.fs.dirs.CacheDir}/${sanitizeFileName(
    data?.exercise_title,
  )}.mp4`;
  try {
    const videoExists = await RNFetchBlob.fs.exists(filePath);
    if (videoExists) {
      StoringData[data.exercise_title] = filePath;
      callback(100);
    } else {
      await RNFetchBlob.config({
        fileCache: true,
        path: filePath,
        appendExt: 'mp4',
      })
        .fetch('GET', data.exercise_video, {'Content-Type': 'application/mp4'})
        .progress((received, total) => {
          const progress = (received / total) * 100;
          callback(progress);
        })
        .then(res => {
          StoringData[data.exercise_title] = res.path();
          callback(100);
        });
    }
  } catch (error) {
    console.error('Error downloading video:', error);
  }

  store.dispatch(setVideoLocation(StoringData));
};





const EmptyComponent = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <AnimatedLottieView
        source={require('../../Icon/Images/NewImage/NoData.json')}
        speed={2}
        autoPlay
        loop
        resizeMode="contain"
        style={{
          width: DeviceWidth * 0.5,
          height: DeviceHeigth * 0.6,
        }}
      />
    </View>
  );
};


export {downloadVideos, EmptyComponent}